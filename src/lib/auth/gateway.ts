import { AuthError } from "@/lib/auth/errors.ts"
import { createApiGateway } from "@/lib/auth/api-gateway.ts"
import { createDemoGateway } from "@/lib/auth/demo-gateway.ts"
import type { AuthGateway } from "@/lib/auth/types.ts"

function unavailable(): AuthGateway {
  const fail = async () => {
    throw new AuthError("unavailable")
  }
  return {
    mode: "unavailable",
    current: async () => null,
    register: fail,
    login: fail,
    logout: async () => undefined,
    updateProfile: fail,
    changePassword: fail,
    resetPassword: fail,
    requestPasswordReset: fail,
    confirmPasswordReset: fail,
    deleteAccount: fail,
  }
}

export function createAuthGateway() {
  if (import.meta.env.VITE_AUTH_MODE === "api") {
    return createApiGateway()
  }
  if (import.meta.env.PROD) {
    return unavailable()
  }
  return createDemoGateway()
}
