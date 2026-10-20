import { createHash, randomBytes } from "node:crypto"

export const sessionCookie = "sehatoka_session"
export const csrfCookie = "sehatoka_csrf"

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
}

export function newToken() {
  return randomBytes(32).toString("base64url")
}
