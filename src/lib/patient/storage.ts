export function persistentGet(key: string) {
  try {
    const current = localStorage.getItem(key)
    if (current !== null) {
      return current
    }
    const legacy = sessionStorage.getItem(key)
    if (legacy !== null) {
      localStorage.setItem(key, legacy)
      return legacy
    }
  } catch {
    return null
  }
  return null
}

export function persistentSet(key: string, value: string) {
  localStorage.setItem(key, value)
}

export function persistentRemove(key: string) {
  try {
    localStorage.removeItem(key)
    sessionStorage.removeItem(key)
  } catch {
    localStorage.removeItem(key)
  }
}
