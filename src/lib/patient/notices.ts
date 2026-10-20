import { requestsFor, subscribeRequests, type CareRequest } from "@/lib/patient/requests.ts"
import { persistentGet, persistentRemove, persistentSet } from "@/lib/patient/storage.ts"
import { doctorById } from "@/data/demo-directory.ts"

export interface PatientNotice {
  id: string
  title: string
  body: string
  at: string
  href: string
}

const listeners = new Set<() => void>()
const readByPatient = new Map<string, string[]>()
let version = 0

function touch() {
  version += 1
  listeners.forEach((listener) => listener())
}

function storageKey(patientId: string) {
  return `sehatoka-demo-read:${patientId}`
}

function readIds(patientId: string) {
  const cached = readByPatient.get(patientId)
  if (cached) {
    return cached
  }
  try {
    const raw = persistentGet(storageKey(patientId))
    const parsed = raw ? (JSON.parse(raw) as unknown) : []
    const ids = Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : []
    readByPatient.set(patientId, ids)
    return ids
  } catch {
    const empty: string[] = []
    readByPatient.set(patientId, empty)
    return empty
  }
}

export function subscribeNotices(listener: () => void) {
  listeners.add(listener)
  const stopRequests = subscribeRequests(() => {
    version += 1
    listener()
  })
  return () => {
    listeners.delete(listener)
    stopRequests()
  }
}

export function noticeVersion() {
  return version
}

export function noticesFor(patientId: string, locale: "fr" | "en"): Array<PatientNotice & { unread: boolean }> {
  const read = new Set(readIds(patientId))
  return requestsFor(patientId).map((item) => {
    const notice = toNotice(item, locale)
    return { ...notice, unread: !read.has(notice.id) }
  })
}

function toNotice(item: CareRequest, locale: "fr" | "en"): PatientNotice {
  const doctor = doctorById(item.doctorId)
  const name = doctor ? `${doctor.firstName} ${doctor.lastName}` : item.doctorId
  const cancelled = item.status === "annulee"
  return {
    id: `demande-${item.id}`,
    at: item.createdAt,
    href: `#patient/rendez-vous/${item.id}`,
    title: cancelled
      ? locale === "en"
        ? "Request cancelled"
        : "Demande annulée"
      : locale === "en"
        ? "Request noted"
        : "Demande notée",
    body: locale === "en"
      ? `${name}. Preference only. No appointment is confirmed.`
      : `${name}. Préférence uniquement. Aucun rendez-vous n'est confirmé.`,
  }
}

export function markNoticeRead(patientId: string, id: string) {
  const current = readIds(patientId)
  if (current.includes(id)) {
    return
  }
  const next = [...current, id]
  readByPatient.set(patientId, next)
  persistentSet(storageKey(patientId), JSON.stringify(next))
  touch()
}

export function markAllNoticesRead(patientId: string, ids: string[]) {
  readByPatient.set(patientId, ids)
  persistentSet(storageKey(patientId), JSON.stringify(ids))
  touch()
}

export function clearNotices(patientId: string) {
  readByPatient.delete(patientId)
  persistentRemove(storageKey(patientId))
  touch()
}
