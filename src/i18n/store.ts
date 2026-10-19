export type Locale = "fr" | "en"

const storageKey = "sehatoka-lang"

export function isLocale(value: unknown): value is Locale {
  return value === "fr" || value === "en"
}

function readLocale(): Locale {
  if (typeof localStorage === "undefined") {
    return "fr"
  }
  const stored = localStorage.getItem(storageKey)
  return isLocale(stored) ? stored : "fr"
}

let locale: Locale = readLocale()
const listeners = new Set<() => void>()

function applyDocument(next: Locale) {
  if (typeof document === "undefined") {
    return
  }
  document.documentElement.lang = next
  document.title =
    next === "en"
      ? "Sehatoka — Your health, guided by intelligence"
      : "Sehatoka — Votre santé, guidée par l'intelligence"
}

applyDocument(locale)

export function getLocale(): Locale {
  return locale
}

export function setLocale(next: Locale) {
  locale = next
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(storageKey, next)
  }
  applyDocument(next)
  listeners.forEach((listener) => listener())
}

export function subscribeLocale(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
