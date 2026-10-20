import type { ChatMessage } from "@/types/chat.ts"

export const welcomeMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Bonjour. Décrivez votre besoin — je vous oriente vers la spécialité cohérente, sans poser de diagnostic.",
  createdAt: "2026-10-13T08:00:00.000Z",
}

export const exampleThread: ChatMessage[] = [
  {
    id: "example-user",
    role: "user",
    content: "J'ai une vision floue et une gêne aux yeux.",
    createdAt: "2026-10-13T08:00:08.000Z",
    isExample: true,
  },
  {
    id: "example-assistant",
    role: "assistant",
    content:
      "Une consultation en ophtalmologie peut être appropriée. Ce n'est pas un diagnostic.",
    createdAt: "2026-10-13T08:00:14.000Z",
    isExample: true,
    recommendation: {
      specialtyId: "ophthalmology",
      specialtyName: "Ophtalmologie",
      status: "available",
      rationale:
        "Orientation vers l'ophtalmologie, avec les médecins proposés pour cette spécialité.",
      ctaLabel: "Trouver un médecin",
      ctaHref: "#patient/medecins?specialite=ophthalmology",
      urgency: "orientation",
    },
  },
]
