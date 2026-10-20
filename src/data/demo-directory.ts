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
  introFr: string
  introEn: string
  demonstration: true
}

export const directoryDoctors: DemoDoctor[] = [
  doctor("oph-1", "Lina", "Berrada", "ophthalmology", "Casablanca", "Cabinet démo Anfa", ["Français", "Arabe"]),
  doctor("oph-2", "Yassine", "El Idrissi", "ophthalmology", "Rabat", "Cabinet démo Agdal", ["Français", "Arabe", "Anglais"], ["cabinet"]),
  doctor("card-1", "Amine", "Bennani", "cardiology", "Casablanca", "Cabinet démo Maarif", ["Français", "Arabe"]),
  doctor("card-2", "Sara", "Tazi", "cardiology", "Rabat", "Cabinet démo Hassan", ["Français", "Anglais"]),
  doctor("derm-1", "Nadia", "Chraibi", "dermatology", "Casablanca", "Cabinet démo Gauthier", ["Français", "Arabe"]),
  doctor("derm-2", "Omar", "Alaoui", "dermatology", "Marrakech", "Cabinet démo Guéliz", ["Français", "Arabe", "Anglais"]),
  doctor("ped-1", "Salma", "Benjelloun", "pediatrics", "Rabat", "Cabinet démo Souissi", ["Français", "Arabe"]),
  doctor("ped-2", "Mehdi", "Kettani", "pediatrics", "Fès", "Cabinet démo Atlas", ["Français", "Arabe"]),
  doctor("gen-1", "Imane", "Squalli", "general-medicine", "Casablanca", "Cabinet démo Bourgogne", ["Français", "Arabe"]),
  doctor("gen-2", "Karim", "Ouazzani", "general-medicine", "Tanger", "Cabinet démo Malabata", ["Français", "Arabe", "Anglais"], ["cabinet", "visio"]),
  doctor("gyn-1", "Hajar", "Filali", "gynecology", "Casablanca", "Cabinet démo Racine", ["Français", "Arabe"]),
  doctor("gyn-2", "Leila", "Amrani", "gynecology", "Rabat", "Cabinet démo Hay Riad", ["Français", "Anglais"]),
  doctor("psy-1", "Adam", "Senoussi", "psychiatry", "Casablanca", "Cabinet démo Ain Diab", ["Français", "Arabe"]),
  doctor("psy-2", "Maya", "Bensouda", "psychiatry", "Rabat", "Cabinet démo Agdal", ["Français", "Anglais"], ["visio"]),
]

function doctor(
  id: string,
  firstName: string,
  lastName: string,
  specialtyId: SpecialtyId,
  city: string,
  establishment: string,
  languages: string[],
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
    introFr: "Médecin proposé pour cette spécialité. Le lieu, les langues et les modalités de consultation sont indiqués ci-dessous.",
    introEn: "A doctor suggested for this specialty. Location, languages, and consultation modes are listed below.",
    demonstration: true,
  }
}

export function doctorById(id: string) {
  return directoryDoctors.find((item) => item.id === id)
}
