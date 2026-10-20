export interface PatientAccount {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  birthDate: string
  city: string
  language: "fr" | "en"
  bloodGroup: string
  allergies: string
  conditions: string
  medicationsNote: string
  emergencyName: string
  emergencyPhone: string
  onboarded: boolean
  notifyInApp: boolean
  shareWithCare: boolean
}

export interface RegisterInput {
  firstName: string
  lastName: string
  email: string
  phone: string
  birthDate: string
  password: string
  language: "fr" | "en"
}

export type AuthMode = "demo" | "unavailable"

export type AuthFailure = "invalid" | "exists" | "unavailable" | "weak" | "missing"

export interface AuthGateway {
  readonly mode: AuthMode
  current: () => Promise<PatientAccount | null>
  register: (input: RegisterInput) => Promise<PatientAccount>
  login: (email: string, password: string) => Promise<PatientAccount>
  logout: () => Promise<void>
  updateProfile: (patch: Partial<PatientAccount>) => Promise<PatientAccount>
  changePassword: (currentPassword: string, nextPassword: string) => Promise<void>
  resetPassword: (email: string, nextPassword: string) => Promise<void>
  deleteAccount: () => Promise<void>
}
