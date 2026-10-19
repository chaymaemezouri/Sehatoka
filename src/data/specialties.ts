import { OPTHOCARE_URL } from "./site.ts"
import type { Specialty } from "@/types/specialty.ts"

export const specialties: Specialty[] = [
  {
    id: "ophthalmology",
    name: "Ophtalmologie",
    field: "Vision et santé oculaire",
    summary:
      "Orientation vers le parcours oculaire. Le module spécialisé OphthoCare est déjà accessible.",
    status: "available",
    moduleName: "OphthoCare",
    href: OPTHOCARE_URL,
    accent: "emerald",
  },
  {
    id: "cardiology",
    name: "Cardiologie",
    field: "Cœur et circulation",
    summary:
      "Module d'accompagnement cardiaque prévu dans l'écosystème Sehatoka.",
    status: "upcoming",
    accent: "navy",
  },
  {
    id: "dermatology",
    name: "Dermatologie",
    field: "Peau et muqueuses",
    summary:
      "Parcours cutané en préparation, pour une orientation plus fine à venir.",
    status: "upcoming",
    accent: "teal",
  },
  {
    id: "pediatrics",
    name: "Pédiatrie",
    field: "Santé de l'enfant",
    summary:
      "Un module dédié à l'orientation pédiatrique sera intégré ultérieurement.",
    status: "upcoming",
    accent: "navy",
  },
  {
    id: "general-medicine",
    name: "Médecine générale",
    field: "Premier recours",
    summary:
      "Porte d'entrée naturelle du parcours de soins, encore en cours de conception.",
    status: "upcoming",
    accent: "teal",
  },
  {
    id: "gynecology",
    name: "Gynécologie",
    field: "Santé des femmes",
    summary:
      "Module d'orientation gynécologique prévu, non opérationnel à ce jour.",
    status: "upcoming",
    accent: "navy",
  },
  {
    id: "psychiatry",
    name: "Psychiatrie",
    field: "Santé mentale",
    summary:
      "Accompagnement d'orientation en santé mentale, à l'étude dans la feuille de route.",
    status: "upcoming",
    accent: "teal",
  },
]

export function getSpecialty(id: Specialty["id"]) {
  return specialties.find((item) => item.id === id)
}
