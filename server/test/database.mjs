import { randomBytes } from "node:crypto"
import { execFileSync } from "node:child_process"
import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import EmbeddedPostgres from "embedded-postgres"

const serverDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const marker = path.join(serverDir, ".test-db.json")

const password = randomBytes(18).toString("hex")
const databaseDir = mkdtempSync(path.join(tmpdir(), "sehatoka-pg-"))
const postgres = new EmbeddedPostgres({
  databaseDir,
  user: "sehatoka",
  password,
  port: 54329,
  persistent: false,
})

await postgres.initialise()
await postgres.start()
await postgres.createDatabase("sehatoka_test")

const databaseUrl = `postgresql://sehatoka:${password}@127.0.0.1:54329/sehatoka_test`
const parsed = new URL(databaseUrl)
if (parsed.hostname !== "127.0.0.1" || !parsed.pathname.includes("sehatoka_test")) {
  throw new Error("Refusing a database that is not the local Sehatoka test database")
}

const env = {
  ...process.env,
  DATABASE_URL: databaseUrl,
  NODE_ENV: "test",
}
const prisma = path.join(serverDir, "node_modules", "prisma", "build", "index.js")
execFileSync(process.execPath, [prisma, "migrate", "deploy"], {
  cwd: serverDir,
  env,
  stdio: "inherit",
})

writeFileSync(marker, JSON.stringify({ databaseUrl }))
process.stdin.resume()

const shutdown = async () => {
  await postgres.stop()
  process.exit(0)
}
process.on("SIGTERM", () => {
  void shutdown()
})
process.on("SIGINT", () => {
  void shutdown()
})
