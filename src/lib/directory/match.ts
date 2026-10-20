import { careCities, type CareCity } from "@/data/cities.ts"
import { careClinics, type CareClinic } from "@/data/clinics.ts"
import { directoryDoctors, type DemoDoctor } from "@/data/demo-directory.ts"
import { normalizeText } from "@/lib/utils.ts"
import type { SpecialtyId } from "@/types/specialty.ts"

export interface CareCabinet {
  id: string
  name: string
  city: string
  doctorId: string
  lat: number
  lng: number
}

export interface CareMatch {
  city?: CareCity
  doctors: DemoDoctor[]
  cabinets: CareCabinet[]
  clinics: CareClinic[]
  urgent: boolean
}

export function mentionedCity(messages: readonly { role: string; content: string }[]) {
  let found: CareCity | undefined
  for (const message of messages) {
    if (message.role !== "user") {
      continue
    }
    const text = normalizeText(message.content)
    for (const city of careCities) {
      if (city.aliases.some((alias) => text.includes(alias))) {
        found = city
      }
    }
  }
  return found
}

export function matchCare(input: {
  messages: readonly { role: string; content: string }[]
  specialtyId?: SpecialtyId
  urgent?: boolean
}): CareMatch {
  const city = mentionedCity(input.messages)
  const urgent = Boolean(input.urgent)
  const pool = urgent
    ? directoryDoctors.filter((doctor) => doctor.specialtyId === "general-medicine")
    : input.specialtyId
      ? directoryDoctors.filter((doctor) => doctor.specialtyId === input.specialtyId)
      : directoryDoctors
  const doctors = [...pool].sort(compareDoctors(city)).slice(0, input.specialtyId && !urgent ? pool.length : 4)
  const cabinets = city
    ? uniqueCabinets(doctors).sort((a, b) => distance(city, a) - distance(city, b)).slice(0, 3)
    : []
  const clinics = city || urgent
    ? [...careClinics].sort((a, b) => (city ? distance(city, a) - distance(city, b) : 0)).slice(0, urgent ? 4 : 3)
    : []
  return { city, doctors, cabinets, clinics, urgent }
}

function uniqueCabinets(doctors: DemoDoctor[]): CareCabinet[] {
  const seen = new Set<string>()
  const cabinets: CareCabinet[] = []
  for (const doctor of doctors) {
    if (seen.has(doctor.establishment)) {
      continue
    }
    seen.add(doctor.establishment)
    cabinets.push({
      id: doctor.establishment,
      name: doctor.establishment,
      city: doctor.city,
      doctorId: doctor.id,
      lat: doctor.lat,
      lng: doctor.lng,
    })
  }
  return cabinets
}

function compareDoctors(city?: CareCity) {
  return (a: DemoDoctor, b: DemoDoctor) => {
    if (city) {
      const gap = distance(city, a) - distance(city, b)
      if (Math.abs(gap) > 12) {
        return gap
      }
    }
    return b.reviews - a.reviews
  }
}

function distance(origin: { lat: number; lng: number }, place: { lat: number; lng: number }) {
  const earth = 6371
  const lat = radians(place.lat - origin.lat)
  const lng = radians(place.lng - origin.lng)
  const a =
    Math.sin(lat / 2) ** 2 +
    Math.cos(radians(origin.lat)) * Math.cos(radians(place.lat)) * Math.sin(lng / 2) ** 2
  return 2 * earth * Math.asin(Math.sqrt(a))
}

function radians(value: number) {
  return (value * Math.PI) / 180
}
