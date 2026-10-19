export const specialtyStatus = {
  available: "available",
  upcoming: "upcoming",
} as const

export type SpecialtyStatus =
  (typeof specialtyStatus)[keyof typeof specialtyStatus]

export type SpecialtyId =
  | "ophthalmology"
  | "cardiology"
  | "dermatology"
  | "pediatrics"
  | "general-medicine"
  | "gynecology"
  | "psychiatry"

export interface Specialty {
  id: SpecialtyId
  name: string
  field: string
  summary: string
  status: SpecialtyStatus
  moduleName?: string
  href?: string
  accent: string
}
