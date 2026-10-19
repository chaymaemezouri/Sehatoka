import type { SpecialtyId, SpecialtyStatus } from "./specialty.ts"

export const messageRole = {
  user: "user",
  assistant: "assistant",
} as const

export type MessageRole = (typeof messageRole)[keyof typeof messageRole]

export const recommendationUrgency = {
  orientation: "orientation",
  urgent: "urgent",
} as const

export type RecommendationUrgency =
  (typeof recommendationUrgency)[keyof typeof recommendationUrgency]

export interface Recommendation {
  specialtyId?: SpecialtyId
  specialtyName: string
  status: SpecialtyStatus | "urgent"
  rationale: string
  ctaLabel?: string
  ctaHref?: string
  urgency: RecommendationUrgency
}

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  createdAt: string
  recommendation?: Recommendation
  isExample?: boolean
}

export interface ChatTurnInput {
  history: readonly ChatMessage[]
  userMessage: string
}

export interface AppointmentRequest {
  specialtyName: string
  windowLabel: string
  liveModule: boolean
}

export interface ChatTurnOutput {
  content: string
  recommendation?: Recommendation
  appointment?: AppointmentRequest
}

export interface ChatAdapter {
  readonly id: string
  readonly modeLabel: string
  complete: (input: ChatTurnInput) => Promise<ChatTurnOutput>
}
