import { useEffect, useMemo, useState, type ReactNode } from "react"
import { createAuthGateway } from "@/lib/auth/gateway.ts"
import { AuthContext } from "@/lib/auth/useAuth.ts"
import type { PatientAccount, RegisterInput } from "@/lib/auth/types.ts"

export function AuthProvider({ children }: { children: ReactNode }) {
  const gateway = useMemo(() => createAuthGateway(), [])
  const [account, setAccount] = useState<PatientAccount | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let live = true
    void gateway.current().then((value) => {
      if (!live) {
        return
      }
      setAccount(value)
      setReady(true)
    })
    return () => {
      live = false
    }
  }, [gateway])

  const value = useMemo(
    () => ({
      ready,
      mode: gateway.mode,
      account,
      register: async (input: RegisterInput) => {
        const next = await gateway.register(input)
        setAccount(next)
        return next
      },
      login: async (email: string, password: string) => {
        const next = await gateway.login(email, password)
        setAccount(next)
        return next
      },
      logout: async () => {
        await gateway.logout()
        setAccount(null)
      },
      updateProfile: async (patch: Partial<PatientAccount>) => {
        const next = await gateway.updateProfile(patch)
        setAccount(next)
        return next
      },
      changePassword: (currentPassword: string, nextPassword: string) =>
        gateway.changePassword(currentPassword, nextPassword),
      resetPassword: (email: string, nextPassword: string) => gateway.resetPassword(email, nextPassword),
      requestPasswordReset: (email: string) => gateway.requestPasswordReset(email),
      confirmPasswordReset: (token: string, password: string) => gateway.confirmPasswordReset(token, password),
      deleteAccount: async () => {
        await gateway.deleteAccount()
        setAccount(null)
      },
    }),
    [account, gateway, ready],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
