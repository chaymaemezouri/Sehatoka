export interface AppEnv {
  databaseUrl: string
  origins: string[]
  port: number
  host: string
  cookieSecure: boolean
  trustProxy: boolean
  sessionTtlMs: number
  attemptPepper: string
  passwordResetEnabled: boolean
  nodeEnv: string
}

function required(name: string) {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(`Missing ${name}`)
  }
  return value
}

export function readEnv(): AppEnv {
  const nodeEnv = process.env.NODE_ENV ?? "development"
  const cookieSecure = (process.env.COOKIE_SECURE ?? (nodeEnv === "production" ? "true" : "false")) === "true"
  const host = process.env.HOST?.trim() || "127.0.0.1"
  const env: AppEnv = {
    databaseUrl: required("DATABASE_URL"),
    origins: required("APP_ORIGINS").split(",").map((item) => item.trim()).filter(Boolean),
    port: Number(process.env.PORT ?? 3001),
    host,
    cookieSecure,
    trustProxy: process.env.TRUST_PROXY === "true",
    sessionTtlMs: Number(process.env.SESSION_TTL_HOURS ?? 12) * 60 * 60 * 1000,
    attemptPepper: required("ATTEMPT_PEPPER"),
    passwordResetEnabled: process.env.PASSWORD_RESET_ENABLED === "true",
    nodeEnv,
  }
  if (!Number.isInteger(env.port) || env.port < 1) {
    throw new Error("Invalid PORT")
  }
  if (env.attemptPepper.length < 16) {
    throw new Error("ATTEMPT_PEPPER is too short")
  }
  if (env.nodeEnv === "production" && !env.cookieSecure) {
    throw new Error("COOKIE_SECURE must be true in production")
  }
  if (env.nodeEnv === "production" && env.host !== "127.0.0.1" && env.host !== "localhost") {
    throw new Error("HOST must stay on the loopback interface")
  }
  return env
}
