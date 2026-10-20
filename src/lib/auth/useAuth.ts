import { createContext, useContext } from "react"
import type { AuthMode, PatientAccount, RegisterInput } from "@/lib/auth/types.ts"

export interface AuthContextValue {
  ready: boolean
  mode: AuthMode
  account: PatientAccount | null
  register: (input: RegisterInput) => Promise<PatientAccount>
  login: (email: string, password: string) => Promise<PatientAccount>
  logout: () => Promise<void>
  updateProfile: (patch: Partial<PatientAccount>) => Promise<PatientAccount>
  changePassword: (currentPassword: string, nextPassword: string) => Promise<void>
  resetPassword: (email: string, nextPassword: string) => Promise<void>
  requestPasswordReset: (email: string) => Promise<void>
  confirmPasswordReset: (token: string, password: string) => Promise<void>
  deleteAccount: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return value
}
