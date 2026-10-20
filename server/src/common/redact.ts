const sensitive = /password|token|cookie|authorization|secret|csrf|email|phone|birth|allerg|condition|medication|blood|emergency|name|pepper|session/i

export function redact(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => redact(item))
  }
  if (!value || typeof value !== "object") {
    return value
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, sensitive.test(key) ? "[redacted]" : redact(item)]),
  )
}
