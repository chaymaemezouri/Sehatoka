export interface CareClinic {
  id: string
  name: string
  city: string
  lat: number
  lng: number
  emergency: true
}

export const careClinics: CareClinic[] = [
  { id: "cli-anfa", name: "Clinique Anfa", city: "Casablanca", lat: 33.588, lng: -7.642, emergency: true },
  { id: "cli-oasis", name: "Clinique Oasis", city: "Casablanca", lat: 33.548, lng: -7.632, emergency: true },
  { id: "cli-agdal", name: "Clinique Agdal", city: "Rabat", lat: 33.998, lng: -6.852, emergency: true },
  { id: "cli-souissi", name: "Clinique Souissi", city: "Rabat", lat: 33.97, lng: -6.82, emergency: true },
  { id: "cli-gueliz", name: "Clinique Guéliz", city: "Marrakech", lat: 31.634, lng: -8.01, emergency: true },
  { id: "cli-atlas", name: "Polyclinique Atlas", city: "Fès", lat: 34.041, lng: -4.99, emergency: true },
  { id: "cli-malabata", name: "Clinique Malabata", city: "Tanger", lat: 35.778, lng: -5.79, emergency: true },
]
