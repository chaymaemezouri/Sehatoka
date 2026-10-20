import { AuthError } from "@/lib/auth/errors.ts"
import type { AuthFailure, AuthGateway, PatientAccount, RegisterInput } from "@/lib/auth/types.ts"

const csrfName = "sehatoka_csrf"

const failures: readonly AuthFailure[] = ["invalid", "exists", "unavailable", "weak", "missing", "rate", "rejected"]

function readCookie(name: string) {
  const prefix = `${name}=`
  const item = document.cookie.split("; ").find((row) => row.startsWith(prefix))
  return item ? decodeURIComponent(item.slice(prefix.length)) : ""
}

function isFailure(code: string | undefined): code is AuthFailure {
  return failures.some((item) => item === code)
}

async function ensureCsrf() {
  const existing = readCookie(csrfName)
  if (existing) {
    return existing
  }
  await fetch("/api/auth/csrf", { credentials: "include" })
  const token = readCookie(csrfName)
  if (!token) {
    throw new AuthError("unavailable")
  }
  return token
}

async function send(path: string, method: "GET" | "POST" | "PATCH" | "DELETE", body?: unknown) {
  const headers = new Headers()
  if (method !== "GET") {
    headers.set("content-type", "application/json")
    headers.set("x-csrf-token", await ensureCsrf())
  }
  const response = await fetch(path, {
    method,
    credentials: "include",
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const payload = (await response.json().catch(() => null)) as { code?: string } | null
  if (!response.ok) {
    throw new AuthError(isFailure(payload?.code) ? payload.code : "unavailable")
  }
  return payload
}

export function createApiGateway(): AuthGateway {
  return {
    mode: "api",
    async current() {
      const response = await fetch("/api/auth/me", { credentials: "include" })
      if (response.status === 401) {
        return null
      }
      if (!response.ok) {
        throw new AuthError("unavailable")
      }
      return (await response.json()) as PatientAccount
    },
    async register(input: RegisterInput) {
      return (await send("/api/auth/register", "POST", input)) as PatientAccount
    },
    async login(email, password) {
      return (await send("/api/auth/login", "POST", { email, password })) as PatientAccount
    },
    async logout() {
      await send("/api/auth/logout", "POST")
    },
    async updateProfile(patch) {
      return (await send("/api/patients/me", "PATCH", patch)) as PatientAccount
    },
    async changePassword(currentPassword, nextPassword) {
      await send("/api/auth/password", "POST", { currentPassword, nextPassword })
    },
    async resetPassword() {
      throw new AuthError("unavailable")
    },
    async requestPasswordReset(email) {
      await send("/api/auth/password-reset/request", "POST", { email })
    },
    async confirmPasswordReset(token, password) {
      await send("/api/auth/password-reset/confirm", "POST", { token, password })
    },
    async deleteAccount() {
      await send("/api/patients/me", "DELETE")
    },
  }
}
