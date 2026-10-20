export class AppError extends Error {
  constructor(
    readonly code: "invalid" | "exists" | "unavailable" | "weak" | "missing" | "rate" | "rejected",
    readonly status: number,
  ) {
    super(code)
    this.name = "AppError"
  }
}
