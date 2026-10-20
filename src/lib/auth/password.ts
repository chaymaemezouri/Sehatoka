export async function passwordHash(email: string, password: string) {
  const data = new TextEncoder().encode(`sehatoka-demo\u0000${email.trim().toLowerCase()}\u0000${password}`)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("")
}

export function passwordIsStrong(password: string) {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password)
}
