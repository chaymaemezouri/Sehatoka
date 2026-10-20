import { AuthError } from "@/lib/auth/errors.ts"
import { passwordHash, passwordIsStrong } from "@/lib/auth/password.ts"
import type { AuthGateway, PatientAccount, RegisterInput } from "@/lib/auth/types.ts"
import { clearNotices } from "@/lib/patient/notices.ts"
import { removePatientRecords } from "@/lib/patient/records.ts"
import { removeRequestsFor } from "@/lib/patient/requests.ts"
import { persistentGet, persistentRemove, persistentSet } from "@/lib/patient/storage.ts"
import { createId } from "@/lib/utils.ts"

const usersKey = "sehatoka-demo-users"
const sessionKey = "sehatoka-demo-session"
const ready = import.meta.env.DEV
  ? import("./demo-showcase.ts").then((mod) => mod.ensureDemoShowcase()).catch(() => undefined)
  : Promise.resolve()

interface StoredUser {
  passwordHash: string
  account: PatientAccount
}

function readUsers(): StoredUser[] {
  try {
    const raw = persistentGet(usersKey)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter(isStoredUser)
  } catch {
    return []
  }
}

function isStoredUser(value: unknown): value is StoredUser {
  if (!value || typeof value !== "object") {
    return false
  }
  const item = value as Partial<StoredUser>
  return typeof item.passwordHash === "string" && Boolean(item.account && typeof item.account === "object")
}

function writeUsers(users: StoredUser[]) {
  persistentSet(usersKey, JSON.stringify(users))
}

function blankAccount(input: RegisterInput, id: string): PatientAccount {
  return {
    id,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    birthDate: input.birthDate,
    city: "",
    language: input.language,
    bloodGroup: "",
    allergies: "",
    conditions: "",
    medicationsNote: "",
    emergencyName: "",
    emergencyPhone: "",
    onboarded: false,
    notifyInApp: true,
    shareWithCare: false,
  }
}

export function createDemoGateway(): AuthGateway {
  return {
    mode: "demo",
    async current() {
      await ready
      const id = persistentGet(sessionKey)
      if (!id) {
        return null
      }
      return readUsers().find((user) => user.account.id === id)?.account ?? null
    },
    async register(input) {
      await ready
      if (!passwordIsStrong(input.password)) {
        throw new AuthError("weak")
      }
      const email = input.email.trim().toLowerCase()
      const users = readUsers()
      if (users.some((user) => user.account.email === email)) {
        throw new AuthError("exists")
      }
      const account = blankAccount(input, createId("patient"))
      users.push({ passwordHash: await passwordHash(email, input.password), account })
      writeUsers(users)
      persistentSet(sessionKey, account.id)
      return account
    },
    async login(email, password) {
      await ready
      const normalized = email.trim().toLowerCase()
      const user = readUsers().find((item) => item.account.email === normalized)
      if (!user || user.passwordHash !== (await passwordHash(normalized, password))) {
        throw new AuthError("invalid")
      }
      persistentSet(sessionKey, user.account.id)
      return user.account
    },
    async logout() {
      persistentRemove(sessionKey)
    },
    async updateProfile(patch) {
      await ready
      const id = persistentGet(sessionKey)
      const users = readUsers()
      const index = users.findIndex((user) => user.account.id === id)
      const current = users[index]
      if (!id || !current) {
        throw new AuthError("missing")
      }
      const account: PatientAccount = {
        ...current.account,
        ...patch,
        id: current.account.id,
        email: current.account.email,
      }
      users[index] = { ...current, account }
      writeUsers(users)
      return account
    },
    async changePassword(currentPassword, nextPassword) {
      await ready
      if (!passwordIsStrong(nextPassword)) {
        throw new AuthError("weak")
      }
      const id = persistentGet(sessionKey)
      const users = readUsers()
      const index = users.findIndex((user) => user.account.id === id)
      const current = users[index]
      if (!id || !current) {
        throw new AuthError("missing")
      }
      const email = current.account.email
      if (current.passwordHash !== (await passwordHash(email, currentPassword))) {
        throw new AuthError("invalid")
      }
      users[index] = { ...current, passwordHash: await passwordHash(email, nextPassword) }
      writeUsers(users)
    },
    async requestPasswordReset() {
      return undefined
    },
    async confirmPasswordReset() {
      throw new AuthError("invalid")
    },
    async resetPassword(email, nextPassword) {
      await ready
      if (!passwordIsStrong(nextPassword)) {
        throw new AuthError("weak")
      }
      const normalized = email.trim().toLowerCase()
      const users = readUsers()
      const index = users.findIndex((user) => user.account.email === normalized)
      const current = users[index]
      if (!current) {
        throw new AuthError("missing")
      }
      users[index] = { ...current, passwordHash: await passwordHash(normalized, nextPassword) }
      writeUsers(users)
    },
    async deleteAccount() {
      await ready
      const id = persistentGet(sessionKey)
      if (!id) {
        throw new AuthError("missing")
      }
      writeUsers(readUsers().filter((user) => user.account.id !== id))
      persistentRemove(sessionKey)
      removeRequestsFor(id)
      clearNotices(id)
      await removePatientRecords(id)
    },
  }
}
