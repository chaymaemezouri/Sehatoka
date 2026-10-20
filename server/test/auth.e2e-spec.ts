import type { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import type { Server } from "node:http"
import request from "supertest"
import { AppModule } from "../src/app.module"
import { configureApp } from "../src/configure-app"
import { MailService } from "../src/mail/mail.service"
import { PrismaService } from "../src/prisma/prisma.service"
import { spawn, type ChildProcess } from "node:child_process"
import { readFileSync, rmSync } from "node:fs"
import path from "node:path"

const origin = "http://localhost:5173"

describe("patient accounts", () => {
  let app: INestApplication
  let server: Server
  let database: ChildProcess

  beforeAll(async () => {
    database = await startDatabase()
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile()
    app = moduleRef.createNestApplication({ bodyParser: false })
    configureApp(app)
    await app.init()
    server = app.getHttpServer() as Server
  }, 300000)

  afterAll(async () => {
    await app?.close()
    database?.kill()
    rmSync(path.join(__dirname, "..", ".test-db.json"), { force: true })
  })

  it("rejects a registration that misses the rules", async () => {
    const client = await guest(server)
    const response = await client.post("/api/auth/register").send({
      firstName: "A",
      lastName: "B",
      email: "not-an-email",
      phone: "12",
      birthDate: "2999-01-01",
      password: "short",
      language: "fr",
    })
    expect(response.status).toBe(400)
    expect(response.body.code === "invalid" || response.body.code === "weak").toBe(true)
    expect(JSON.stringify(response.body)).not.toContain("passwordHash")
  })

  it("registers, logs in, rejects a bad password, and logs out", async () => {
    const client = await guest(server)
    const created = await client.post("/api/auth/register").send(account("amina.auth@example.com"))
    expect(created.status).toBe(201)
    expect(created.body.email).toBe("amina.auth@example.com")
    expect(created.body.passwordHash).toBeUndefined()
    expect(headerList(created.headers["set-cookie"]).join(";")).toContain("sehatoka_session")

    const me = await client.agent.get("/api/auth/me").set("Origin", origin)
    expect(me.status).toBe(200)
    expect(me.body.id).toBe(created.body.id)

    const wrong = await client.post("/api/auth/login").send({ email: "amina.auth@example.com", password: "Wrongpass1" })
    expect(wrong.status).toBe(401)
    expect(wrong.body).toEqual({ code: "invalid" })

    const again = await client.post("/api/auth/login").send({ email: "amina.auth@example.com", password: "Sehatoka1" })
    expect(again.status).toBe(200)

    const goodbye = await client.post("/api/auth/logout").send({})
    expect(goodbye.status).toBe(200)
    expect(goodbye.body).toEqual({ ok: true })
    const after = await client.agent.get("/api/auth/me")
    expect(after.status).toBe(401)
  })

  it("refuses a duplicate email", async () => {
    const client = await guest(server)
    await client.post("/api/auth/register").send(account("dup.auth@example.com"))
    const response = await client.post("/api/auth/register").send(account("dup.auth@example.com"))
    expect(response.status).toBe(409)
    expect(response.body).toEqual({ code: "exists" })
  })

  it("rejects a missing session, a foreign profile, and an expired session", async () => {
    const outsider = await guest(server)
    const anonymous = await outsider.agent.get("/api/auth/me")
    expect(anonymous.status).toBe(401)

    const first = await guest(server)
    const second = await guest(server)
    const createdA = await first.post("/api/auth/register").send(account("a.auth@example.com"))
    const createdB = await second.post("/api/auth/register").send(account("b.auth@example.com", "Bennani"))
    expect(createdA.status).toBe(201)
    expect(createdB.status).toBe(201)

    const crossed = await first.patch("/api/patients/me").send({ id: createdB.body.id, city: "Rabat" })
    expect(crossed.status).toBe(400)
    const untouched = await second.agent.get("/api/auth/me")
    expect(untouched.body.city).toBe("")
    expect(untouched.body.id).toBe(createdB.body.id)

    const missing = await first.agent.get("/api/patients/someone-else")
    expect(missing.status).toBe(404)

    const prisma = app.get(PrismaService)
    await prisma.session.updateMany({
      where: { patientId: createdA.body.id },
      data: { expiresAt: new Date(Date.now() - 60_000) },
    })
    const expired = await first.agent.get("/api/auth/me")
    expect(expired.status).toBe(401)
  })

  it("requires the csrf token and a known origin", async () => {
    const client = await guest(server)
    const noToken = await client.agent
      .post("/api/auth/login")
      .set("Origin", origin)
      .send({ email: "amina.auth@example.com", password: "Sehatoka1" })
    expect(noToken.status).toBe(403)
    expect(noToken.body).toEqual({ code: "rejected" })

    const forged = await client.agent
      .post("/api/auth/login")
      .set("Origin", "https://example.test")
      .set("X-CSRF-Token", client.token)
      .send({ email: "amina.auth@example.com", password: "Sehatoka1" })
    expect(forged.status).toBe(403)
    expect(forged.body).toEqual({ code: "rejected" })
  })

  it("does not reveal an account and does not change a password before a valid token", async () => {
    const prisma = app.get(PrismaService)
    const mail = app.get(MailService)
    const client = await guest(server)
    process.env.PASSWORD_RESET_ENABLED = "false"
    const hidden = await client.post("/api/auth/password-reset/request").send({ email: "nobody.auth@example.com" })
    const known = await client.post("/api/auth/password-reset/request").send({ email: "amina.auth@example.com" })
    expect(hidden.status).toBe(known.status)
    expect(hidden.body).toEqual(known.body)
    expect(await prisma.passwordReset.count()).toBe(0)

    const rejected = await client.post("/api/auth/password-reset/confirm").send({ token: "not-a-token", password: "Sehatoka2" })
    expect(rejected.status).toBe(400)
    expect(rejected.body).toEqual({ code: "invalid" })

    process.env.PASSWORD_RESET_ENABLED = "true"
    process.env.SMTP_HOST = "memory"
    mail.outbox.length = 0
    await client.post("/api/auth/register").send(account("reset.auth@example.com"))
    const sent = await client.post("/api/auth/password-reset/request").send({ email: "reset.auth@example.com" })
    const absent = await client.post("/api/auth/password-reset/request").send({ email: "nobody.auth@example.com" })
    expect(sent.body).toEqual(absent.body)
    expect(mail.outbox).toHaveLength(1)
    expect(mail.outbox[0]?.to).toBe("reset.auth@example.com")

    const confirmed = await client.post("/api/auth/password-reset/confirm").send({
      token: mail.outbox[0]?.token,
      password: "Sehatoka2",
    })
    expect(confirmed.body).toEqual({ ok: true })

    const oldPassword = await client.post("/api/auth/login").send({ email: "reset.auth@example.com", password: "Sehatoka1" })
    expect(oldPassword.status).toBe(401)
    const fresh = await guest(server)
    const signedIn = await fresh.post("/api/auth/login").send({ email: "reset.auth@example.com", password: "Sehatoka2" })
    expect(signedIn.status).toBe(200)
    process.env.PASSWORD_RESET_ENABLED = "false"
    process.env.SMTP_HOST = ""
  })
})

function startDatabase() {
  const child = spawn(process.execPath, [path.join(__dirname, "database.mjs")], {
    cwd: path.join(__dirname, ".."),
    stdio: ["pipe", "inherit", "inherit"],
  })
  const marker = path.join(__dirname, "..", ".test-db.json")
  return new Promise<ChildProcess>((resolve, reject) => {
    const started = Date.now()
    const timer = setInterval(() => {
      try {
        const payload = JSON.parse(readFileSync(marker, "utf8")) as { databaseUrl: string }
        const parsed = new URL(payload.databaseUrl)
        if (parsed.hostname !== "127.0.0.1" || !parsed.pathname.includes("sehatoka_test")) {
          clearInterval(timer)
          reject(new Error("Refusing a database that is not the local Sehatoka test database"))
          return
        }
        process.env.DATABASE_URL = payload.databaseUrl
        process.env.APP_ORIGINS = "http://localhost:5173"
        process.env.ATTEMPT_PEPPER = "test-pepper-value"
        process.env.COOKIE_SECURE = "false"
        process.env.TRUST_PROXY = "false"
        process.env.PASSWORD_RESET_ENABLED = "false"
        process.env.SMTP_HOST = ""
        process.env.NODE_ENV = "test"
        process.env.HOST = "127.0.0.1"
        clearInterval(timer)
        resolve(child)
      } catch {
        if (Date.now() - started > 240000 || child.exitCode !== null) {
          clearInterval(timer)
          reject(new Error("The local test database did not start"))
        }
      }
    }, 500)
  })
}

function account(email: string, lastName = "El Amrani") {
  return {
    firstName: "Amina",
    lastName,
    email,
    phone: "0612345678",
    birthDate: "1992-04-03",
    password: "Sehatoka1",
    language: "fr",
  }
}

async function guest(server: Server) {
  const agent = request.agent(server)
  const csrf = await agent.get("/api/auth/csrf").set("Origin", origin)
  const token = cookieValue(headerList(csrf.headers["set-cookie"]), "sehatoka_csrf")
  return {
    agent,
    token,
    post(path: string) {
      return agent.post(path).set("Origin", origin).set("X-CSRF-Token", token)
    },
    patch(path: string) {
      return agent.patch(path).set("Origin", origin).set("X-CSRF-Token", token)
    },
  }
}

function headerList(value: string | string[] | undefined) {
  if (!value) {
    return []
  }
  return Array.isArray(value) ? value : [value]
}

function cookieValue(cookies: string[], name: string) {
  const line = cookies?.find((item) => item.startsWith(`${name}=`))
  return line?.split(";")[0]?.slice(name.length + 1) ?? ""
}
