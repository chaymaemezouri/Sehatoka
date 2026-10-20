import type { SpecialtyId } from "@/types/specialty.ts"

export type ConsultMode = "cabinet" | "visio"

export interface DemoDoctor {
  id: string
  firstName: string
  lastName: string
  specialtyId: SpecialtyId
  city: string
  establishment: string
  languages: string[]
  modes: ConsultMode[]
  reviews: number
  lat: number
  lng: number
  introFr: string
  introEn: string
  demonstration: true
}

export const directoryDoctors: DemoDoctor[] = [
  doctor("oph-1", "Lina", "Berrada", "ophthalmology", "Casablanca", "Cabinet Anfa", ["Français", "Arabe"], 186, 33.591, -7.639),
  doctor("oph-2", "Yassine", "El Idrissi", "ophthalmology", "Rabat", "Cabinet Agdal", ["Français", "Arabe", "Anglais"], 142, 34.002, -6.849, ["cabinet"]),
  doctor("card-1", "Amine", "Bennani", "cardiology", "Casablanca", "Cabinet Maarif", ["Français", "Arabe"], 214, 33.582, -7.632),
  doctor("card-2", "Sara", "Tazi", "cardiology", "Rabat", "Cabinet Hassan", ["Français", "Anglais"], 163, 34.022, -6.836),
  doctor("derm-1", "Nadia", "Chraibi", "dermatology", "Casablanca", "Cabinet Gauthier", ["Français", "Arabe"], 198, 33.592, -7.624),
  doctor("derm-2", "Omar", "Alaoui", "dermatology", "Marrakech", "Cabinet Guéliz", ["Français", "Arabe", "Anglais"], 121, 31.636, -8.008),
  doctor("ped-1", "Salma", "Benjelloun", "pediatrics", "Rabat", "Cabinet Souissi", ["Français", "Arabe"], 176, 33.971, -6.828),
  doctor("ped-2", "Mehdi", "Kettani", "pediatrics", "Fès", "Cabinet Atlas", ["Français", "Arabe"], 109, 34.037, -5.002),
  doctor("gen-1", "Imane", "Squalli", "general-medicine", "Casablanca", "Cabinet Bourgogne", ["Français", "Arabe"], 241, 33.569, -7.603),
  doctor("gen-2", "Karim", "Ouazzani", "general-medicine", "Tanger", "Cabinet Malabata", ["Français", "Arabe", "Anglais"], 154, 35.776, -5.796, ["cabinet", "visio"]),
  doctor("gyn-1", "Hajar", "Filali", "gynecology", "Casablanca", "Cabinet Racine", ["Français", "Arabe"], 167, 33.586, -7.641),
  doctor("gyn-2", "Leila", "Amrani", "gynecology", "Rabat", "Cabinet Hay Riad", ["Français", "Anglais"], 132, 33.955, -6.87),
  doctor("psy-1", "Adam", "Senoussi", "psychiatry", "Casablanca", "Cabinet Ain Diab", ["Français", "Arabe"], 118, 33.598, -7.668),
  doctor("psy-2", "Maya", "Bensouda", "psychiatry", "Rabat", "Cabinet Orangers", ["Français", "Anglais"], 97, 34.015, -6.83, ["visio"]),
]

function doctor(
  id: string,
  firstName: string,
  lastName: string,
  specialtyId: SpecialtyId,
  city: string,
  establishment: string,
  languages: string[],
  reviews: number,
  lat: number,
  lng: number,
  modes: ConsultMode[] = ["cabinet", "visio"],
): DemoDoctor {
  return {
    id,
    firstName,
    lastName,
    specialtyId,
    city,
    establishment,
    languages,
    modes,
    reviews,
    lat,
    lng,
    introFr: "Médecin proposé pour cette spécialité. Le lieu, les langues et les modalités de consultation sont indiqués ci-dessous.",
    introEn: "A doctor suggested for this specialty. Location, languages, and consultation modes are listed below.",
    demonstration: true,
  }
}

export function doctorById(id: string) {
  return directoryDoctors.find((item) => item.id === id)
}
