import type { AuthFailure } from "@/lib/auth/types.ts"

export class AuthError extends Error {
  readonly failure: AuthFailure

  constructor(failure: AuthFailure) {
    super(failure)
    this.name = "AuthError"
    this.failure = failure
  }
}

export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError
}
