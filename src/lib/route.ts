export function parseHash(hash: string) {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash
  const queryAt = raw.indexOf("?")
  const path = (queryAt === -1 ? raw : raw.slice(0, queryAt)) || "accueil"
  const params = new URLSearchParams(queryAt === -1 ? "" : raw.slice(queryAt + 1))
  return { path, params }
}

export function safePatientNext(value: string | null) {
  if (!value || !value.startsWith("#patient") || value.includes("://") || value.includes("\\")) {
    return "#patient"
  }
  return value
}
