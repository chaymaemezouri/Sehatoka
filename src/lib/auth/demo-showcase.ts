import { passwordHash } from "@/lib/auth/password.ts"
import type { PatientAccount } from "@/lib/auth/types.ts"
import { createRequest } from "@/lib/patient/requests.ts"
import { addLab, addPrescription, addVaccine, saveHeldNote } from "@/lib/patient/records.ts"
import { persistentGet, persistentRemove, persistentSet } from "@/lib/patient/storage.ts"

const usersKey = "sehatoka-demo-users"
const filledKey = "sehatoka-demo-showcase"
const email = "demo@sehatoka.local"
const password = "Sehatoka2026"
const patientId = "patient-demo-amina"

export async function ensureDemoShowcase() {
  const users = readUsers()
  const existing = users.find((user) => user.account.email === email)
  if (!existing) {
    users.push({ passwordHash: await passwordHash(email, password), account: showcaseAccount() })
    writeUsers(users)
    persistentRemove(filledKey)
  } else if (existing.account.id !== patientId) {
    return
  }
  if (persistentGet(filledKey) === patientId) {
    return
  }
  createRequest({ patientId, doctorId: "derm-1", specialtyId: "dermatology", mode: "cabinet", window: "semaine" })
  createRequest({ patientId, doctorId: "card-1", specialtyId: "cardiology", mode: "cabinet", window: "matin" })
  addPrescription(patientId, {
    title: "Salbutamol",
    date: "2026-02-02",
    prescriber: "Imane Squalli",
    note: "À garder à portée de main en cas de gêne respiratoire.",
  })
  addLab(patientId, {
    name: "Numération formule sanguine",
    date: "2026-01-15",
    value: "Hémoglobine 13,2 g/dL",
    note: "Prélèvement du matin, à jeun.",
  })
  addVaccine(patientId, {
    name: "Grippe saisonnière",
    date: "2025-10-06",
    note: "Casablanca.",
  })
  await saveHeldNote(
    patientId,
    "suivi-cardiologie.txt",
    "Note de suivi.\nPréférence de rendez-vous : matin, cardiologie, Casablanca.\n",
  )
  persistentSet(filledKey, patientId)
}

function showcaseAccount(): PatientAccount {
  return {
    id: patientId,
    firstName: "Amina",
    lastName: "El Fassi",
    email,
    phone: "0612345678",
    birthDate: "1994-06-18",
    city: "Casablanca",
    language: "fr",
    bloodGroup: "A+",
    allergies: "Pénicilline",
    conditions: "Asthme",
    medicationsNote: "Salbutamol si besoin",
    emergencyName: "Youssef El Fassi",
    emergencyPhone: "0661987654",
    onboarded: true,
    notifyInApp: true,
    shareWithCare: false,
  }
}

function readUsers(): Array<{ passwordHash: string; account: PatientAccount }> {
  try {
    const raw = persistentGet(usersKey)
    const parsed = raw ? (JSON.parse(raw) as unknown) : []
    return Array.isArray(parsed) ? parsed.filter(isStoredUser) : []
  } catch {
    return []
  }
}

function isStoredUser(value: unknown): value is { passwordHash: string; account: PatientAccount } {
  if (!value || typeof value !== "object") {
    return false
  }
  const item = value as { passwordHash?: unknown; account?: { email?: unknown } }
  return typeof item.passwordHash === "string" && Boolean(item.account && typeof item.account === "object")
}

function writeUsers(users: Array<{ passwordHash: string; account: PatientAccount }>) {
  persistentSet(usersKey, JSON.stringify(users))
}
