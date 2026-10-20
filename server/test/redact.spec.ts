import { redact } from "../src/common/redact"

describe("redact", () => {
  it("removes secrets and patient details from structured logs", () => {
    const cleaned = redact({
      method: "POST",
      password: "Sehatoka1",
      token: "abc",
      cookie: "session",
      email: "amina@example.com",
      allergies: "pollen",
      nested: { birthDate: "1990-01-01", status: 201 },
    }) as { method: string; password: string; nested: { birthDate: string; status: number } }

    expect(cleaned.method).toBe("POST")
    expect(cleaned.password).toBe("[redacted]")
    expect(cleaned.nested.birthDate).toBe("[redacted]")
    expect(cleaned.nested.status).toBe(201)
    expect(JSON.stringify(cleaned)).not.toContain("Sehatoka1")
    expect(JSON.stringify(cleaned)).not.toContain("amina@example.com")
    expect(JSON.stringify(cleaned)).not.toContain("pollen")
  })
})
