import { useSyncExternalStore } from "react"
import { noticeVersion, noticesFor, subscribeNotices } from "@/lib/patient/notices.ts"
import { documentsFor, labsFor, prescriptionsFor, recordsVersion, subscribeRecords, vaccinesFor } from "@/lib/patient/records.ts"
import { getRequests, subscribeRequests } from "@/lib/patient/requests.ts"
import type { PatientAccount } from "@/lib/auth/types.ts"

export function useCareRequests(patientId: string) {
  const all = useSyncExternalStore(subscribeRequests, getRequests)
  return all.filter((item) => item.patientId === patientId)
}

export function useNotices(patientId: string, locale: "fr" | "en") {
  useSyncExternalStore(subscribeNotices, noticeVersion)
  return noticesFor(patientId, locale)
}

export function useRecords(patientId: string) {
  useSyncExternalStore(subscribeRecords, recordsVersion)
  return {
    documents: documentsFor(patientId),
    vaccines: vaccinesFor(patientId),
    prescriptions: prescriptionsFor(patientId),
    labs: labsFor(patientId),
  }
}

export function profileCompletion(account: PatientAccount) {
  const fields = [
    account.phone,
    account.birthDate,
    account.city,
    account.emergencyName,
    account.emergencyPhone,
    account.allergies,
    account.conditions,
  ]
  const filled = fields.filter((item) => item.trim().length > 0).length
  return Math.round((filled / fields.length) * 100)
}
