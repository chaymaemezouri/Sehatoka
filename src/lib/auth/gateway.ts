import { AuthError } from "@/lib/auth/errors.ts"
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
    deleteAccount: fail,
  }
}

export function createAuthGateway() {
  const demo = import.meta.env.DEV || import.meta.env.VITE_AUTH_MODE === "demo"
  return demo ? createDemoGateway() : unavailable()
}
