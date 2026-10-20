import { createId } from "@/lib/utils.ts"
import { persistentGet, persistentSet } from "@/lib/patient/storage.ts"

export interface HeldDocument {
  id: string
  patientId: string
  name: string
  size: number
  mime: string
  addedAt: string
}

export interface VaccineNote {
  id: string
  patientId: string
  name: string
  date: string
  note: string
  addedAt: string
}

export interface PrescriptionNote {
  id: string
  patientId: string
  title: string
  date: string
  prescriber: string
  note: string
  addedAt: string
}

export interface LabNote {
  id: string
  patientId: string
  name: string
  date: string
  value: string
  note: string
  addedAt: string
}

const documentsKey = "sehatoka-documents"
const vaccinesKey = "sehatoka-vaccines"
const prescriptionsKey = "sehatoka-prescriptions"
const labsKey = "sehatoka-labs"
const maxBytes = 4 * 1024 * 1024

const listeners = new Set<() => void>()
let version = 0
let documents = readList<HeldDocument>(documentsKey, isDocument)
let vaccines = readList<VaccineNote>(vaccinesKey, isVaccine)
let prescriptions = readList<PrescriptionNote>(prescriptionsKey, isPrescription)
let labs = readList<LabNote>(labsKey, isLab)

function readList<T>(key: string, guard: (value: unknown) => value is T) {
  try {
    const raw = persistentGet(key)
    if (!raw) {
      return [] as T[]
    }
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed.filter(guard) : []
  } catch {
    return [] as T[]
  }
}

function isDocument(value: unknown): value is HeldDocument {
  return hasId(value) && typeof (value as HeldDocument).name === "string"
}

function isVaccine(value: unknown): value is VaccineNote {
  return hasId(value) && typeof (value as VaccineNote).name === "string"
}

function isPrescription(value: unknown): value is PrescriptionNote {
  return hasId(value) && typeof (value as PrescriptionNote).title === "string"
}

function isLab(value: unknown): value is LabNote {
  return hasId(value) && typeof (value as LabNote).name === "string"
}

function hasId(value: unknown): value is { id: string; patientId: string } {
  if (!value || typeof value !== "object") {
    return false
  }
  const item = value as { id?: unknown; patientId?: unknown }
  return typeof item.id === "string" && typeof item.patientId === "string"
}

function touch() {
  version += 1
  listeners.forEach((listener) => listener())
}

function saveAll() {
  persistentSet(documentsKey, JSON.stringify(documents))
  persistentSet(vaccinesKey, JSON.stringify(vaccines))
  persistentSet(prescriptionsKey, JSON.stringify(prescriptions))
  persistentSet(labsKey, JSON.stringify(labs))
  touch()
}

export function subscribeRecords(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function recordsVersion() {
  return version
}

export function documentsFor(patientId: string) {
  return documents.filter((item) => item.patientId === patientId)
}

export function vaccinesFor(patientId: string) {
  return vaccines.filter((item) => item.patientId === patientId)
}

export function prescriptionsFor(patientId: string) {
  return prescriptions.filter((item) => item.patientId === patientId)
}

export function labsFor(patientId: string) {
  return labs.filter((item) => item.patientId === patientId)
}

export function recordsFor(patientId: string) {
  return {
    documents: documentsFor(patientId).map(({ id, name, size, mime, addedAt }) => ({ id, name, size, mime, addedAt })),
    vaccines: vaccinesFor(patientId),
    prescriptions: prescriptionsFor(patientId),
    labs: labsFor(patientId),
  }
}

export async function addDocument(patientId: string, file: File) {
  if (file.size > maxBytes) {
    return "large" as const
  }
  if (file.size === 0) {
    return "failed" as const
  }
  const id = createId("doc")
  try {
    await putBlob(id, file)
  } catch {
    return "failed" as const
  }
  documents = [
    {
      id,
      patientId,
      name: file.name || "document",
      size: file.size,
      mime: file.type,
      addedAt: new Date().toISOString(),
    },
    ...documents,
  ]
  saveAll()
  return "ok" as const
}

export async function openDocument(id: string) {
  const meta = documents.find((item) => item.id === id)
  const blob = await readBlob(id)
  if (!meta || !blob) {
    return false
  }
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.target = "_blank"
  link.rel = "noopener"
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
  return true
}

export async function removeDocument(patientId: string, id: string) {
  const current = documents.find((item) => item.id === id && item.patientId === patientId)
  if (!current) {
    return
  }
  documents = documents.filter((item) => item.id !== id)
  saveAll()
  await deleteBlob(id)
}

export function addVaccine(patientId: string, input: { name: string; date: string; note: string }) {
  const name = input.name.trim()
  if (!name) {
    return undefined
  }
  const created: VaccineNote = {
    id: createId("vaccin"),
    patientId,
    name,
    date: input.date,
    note: input.note.trim(),
    addedAt: new Date().toISOString(),
  }
  vaccines = [created, ...vaccines]
  saveAll()
  return created
}

export function removeVaccine(patientId: string, id: string) {
  vaccines = vaccines.filter((item) => !(item.id === id && item.patientId === patientId))
  saveAll()
}

export function addPrescription(patientId: string, input: { title: string; date: string; prescriber: string; note: string }) {
  const title = input.title.trim()
  if (!title) {
    return undefined
  }
  const created: PrescriptionNote = {
    id: createId("ordo"),
    patientId,
    title,
    date: input.date,
    prescriber: input.prescriber.trim(),
    note: input.note.trim(),
    addedAt: new Date().toISOString(),
  }
  prescriptions = [created, ...prescriptions]
  saveAll()
  return created
}

export function removePrescription(patientId: string, id: string) {
  prescriptions = prescriptions.filter((item) => !(item.id === id && item.patientId === patientId))
  saveAll()
}

export function addLab(patientId: string, input: { name: string; date: string; value: string; note: string }) {
  const name = input.name.trim()
  if (!name) {
    return undefined
  }
  const created: LabNote = {
    id: createId("analyse"),
    patientId,
    name,
    date: input.date,
    value: input.value.trim(),
    note: input.note.trim(),
    addedAt: new Date().toISOString(),
  }
  labs = [created, ...labs]
  saveAll()
  return created
}

export function removeLab(patientId: string, id: string) {
  labs = labs.filter((item) => !(item.id === id && item.patientId === patientId))
  saveAll()
}

export async function removePatientRecords(patientId: string) {
  const ids = documents.filter((item) => item.patientId === patientId).map((item) => item.id)
  documents = documents.filter((item) => item.patientId !== patientId)
  vaccines = vaccines.filter((item) => item.patientId !== patientId)
  prescriptions = prescriptions.filter((item) => item.patientId !== patientId)
  labs = labs.filter((item) => item.patientId !== patientId)
  saveAll()
  await Promise.all(ids.map((id) => deleteBlob(id)))
}

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("sehatoka-files", 1)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains("blobs")) {
        request.result.createObjectStore("blobs")
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error("db"))
  })
}

function putBlob(id: string, blob: Blob) {
  return openDb().then(
    (database) =>
      new Promise<void>((resolve, reject) => {
        const tx = database.transaction("blobs", "readwrite")
        tx.objectStore("blobs").put(blob, id)
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error ?? new Error("write"))
      }),
  )
}

function readBlob(id: string) {
  return openDb().then(
    (database) =>
      new Promise<Blob | undefined>((resolve, reject) => {
        const tx = database.transaction("blobs", "readonly")
        const request = tx.objectStore("blobs").get(id)
        request.onsuccess = () => resolve(request.result instanceof Blob ? request.result : undefined)
        request.onerror = () => reject(request.error ?? new Error("read"))
      }),
  )
}

function deleteBlob(id: string) {
  return openDb()
    .then(
      (database) =>
        new Promise<void>((resolve, reject) => {
          const tx = database.transaction("blobs", "readwrite")
          tx.objectStore("blobs").delete(id)
          tx.oncomplete = () => resolve()
          tx.onerror = () => reject(tx.error ?? new Error("delete"))
        }),
    )
    .catch(() => undefined)
}
