import type { Patient, PatientProfile } from "@prisma/client"

export interface PatientAccount {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  birthDate: string
  city: string
  language: "fr" | "en"
  bloodGroup: string
  allergies: string
  conditions: string
  medicationsNote: string
  emergencyName: string
  emergencyPhone: string
  onboarded: boolean
  notifyInApp: boolean
  shareWithCare: boolean
}

type PatientWithProfile = Patient & { profile: PatientProfile | null }

export function toAccount(patient: PatientWithProfile): PatientAccount {
  const profile = patient.profile
  return {
    id: patient.id,
    firstName: patient.firstName,
    lastName: patient.lastName,
    email: patient.email,
    phone: patient.phone,
    birthDate: patient.birthDate.toISOString().slice(0, 10),
    city: profile?.city ?? "",
    language: patient.language === "en" ? "en" : "fr",
    bloodGroup: profile?.bloodGroup ?? "",
    allergies: profile?.allergies ?? "",
    conditions: profile?.conditions ?? "",
    medicationsNote: profile?.medicationsNote ?? "",
    emergencyName: profile?.emergencyName ?? "",
    emergencyPhone: profile?.emergencyPhone ?? "",
    onboarded: profile?.onboarded ?? false,
    notifyInApp: profile?.notifyInApp ?? true,
    shareWithCare: profile?.shareWithCare ?? false,
  }
}

export function assertBirthDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }
  const today = new Date().toISOString().slice(0, 10)
  if (value > today) {
    return false
  }
  const parsed = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

export function assertPhone(value: string) {
  return value.length <= 40 && value.replace(/\D/g, "").length >= 8
}
