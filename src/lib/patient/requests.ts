import { createId } from "@/lib/utils.ts"
import { persistentGet, persistentSet } from "@/lib/patient/storage.ts"
import type { SpecialtyId } from "@/types/specialty.ts"
import type { ConsultMode } from "@/data/demo-directory.ts"

export type RequestWindow = "matin" | "apres-midi" | "semaine"
export type RequestStatus = "demande" | "annulee"

export interface CareRequest {
  id: string
  patientId: string
  doctorId: string
  specialtyId: SpecialtyId
  mode: ConsultMode
  window: RequestWindow
  status: RequestStatus
  createdAt: string
}

const storageKey = "sehatoka-demo-requests"
const listeners = new Set<() => void>()
let requests = read()

function read(): CareRequest[] {
  try {
    const raw = persistentGet(storageKey)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter(isRequest)
  } catch {
    return []
  }
}

function isRequest(value: unknown): value is CareRequest {
  if (!value || typeof value !== "object") {
    return false
  }
  const item = value as Partial<CareRequest>
  return typeof item.id === "string" && typeof item.patientId === "string" && typeof item.doctorId === "string"
}

function commit(next: CareRequest[]) {
  requests = next
  persistentSet(storageKey, JSON.stringify(next))
  listeners.forEach((listener) => listener())
}

export function subscribeRequests(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getRequests() {
  return requests
}

export function requestsFor(patientId: string) {
  return requests.filter((item) => item.patientId === patientId)
}

export function requestById(patientId: string, id: string) {
  return requests.find((item) => item.id === id && item.patientId === patientId)
}

export function createRequest(input: Omit<CareRequest, "id" | "status" | "createdAt">) {
  const duplicate = requests.some(
    (item) => item.patientId === input.patientId && item.doctorId === input.doctorId && item.status === "demande",
  )
  if (duplicate) {
    return { ok: false as const, reason: "duplicate" as const }
  }
  const created: CareRequest = {
    ...input,
    id: createId("demande"),
    status: "demande",
    createdAt: new Date().toISOString(),
  }
  commit([created, ...requests])
  return { ok: true as const, request: created }
}

export function updateRequest(patientId: string, id: string, patch: Pick<CareRequest, "window" | "mode">) {
  const current = requestById(patientId, id)
  if (!current || current.status !== "demande") {
    return undefined
  }
  const next = requests.map((item) => (item.id === id && item.patientId === patientId ? { ...item, ...patch } : item))
  commit(next)
  return requestById(patientId, id)
}

export function cancelRequest(patientId: string, id: string) {
  const current = requestById(patientId, id)
  if (!current || current.status !== "demande") {
    return undefined
  }
  commit(requests.map((item) => (item.id === id && item.patientId === patientId ? { ...item, status: "annulee" } : item)))
  return requestById(patientId, id)
}

export function removeRequestsFor(patientId: string) {
  commit(requests.filter((item) => item.patientId !== patientId))
}
