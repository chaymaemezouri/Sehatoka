import { useMemo, useState } from "react"
import { directoryDoctors, doctorById, type ConsultMode, type DemoDoctor } from "@/data/demo-directory.ts"
import { useLocale } from "@/i18n/useLocale.ts"
import { EmptyState, Panel } from "@/patient/ui.tsx"
import type { SpecialtyId } from "@/types/specialty.ts"

const specialtyIds: SpecialtyId[] = [
  "general-medicine",
  "cardiology",
  "dermatology",
  "ophthalmology",
  "pediatrics",
  "gynecology",
  "psychiatry",
]

export function DoctorsPage({ path, params }: { path: string; params: URLSearchParams }) {
  const id = path.split("/")[2]
  if (id) {
    return <DoctorDetail id={id} />
  }
  return <DoctorList params={params} />
}

function DoctorList({ params }: { params: URLSearchParams }) {
  const { locale, t } = useLocale()
  const en = locale === "en"
  const specialtyParam = params.get("specialite") ?? ""
  const queryParam = params.get("q") ?? ""
  const [name, setName] = useState(queryParam)
  const [specialty, setSpecialty] = useState(specialtyParam)
  const [seenQuery, setSeenQuery] = useState(queryParam)
  const [seenSpecialty, setSeenSpecialty] = useState(specialtyParam)
  const [city, setCity] = useState("")
  const [place, setPlace] = useState("")
  const [mode, setMode] = useState<"" | ConsultMode>("")

  if (seenQuery !== queryParam) {
    setSeenQuery(queryParam)
    setName(queryParam)
  }
  if (seenSpecialty !== specialtyParam) {
    setSeenSpecialty(specialtyParam)
    setSpecialty(specialtyParam)
  }

  const cities = useMemo(() => [...new Set(directoryDoctors.map((item) => item.city))], [])
  const places = useMemo(() => [...new Set(directoryDoctors.map((item) => item.establishment))], [])
  const visible = directoryDoctors.filter((doctor) => {
    const full = `${doctor.firstName} ${doctor.lastName}`.toLowerCase()
    const matchesName = full.includes(name.trim().toLowerCase())
    const matchesSpecialty = !specialty || doctor.specialtyId === specialty
    const matchesCity = !city || doctor.city === city
    const matchesPlace = !place || doctor.establishment === place
    const matchesMode = !mode || doctor.modes.includes(mode)
    return matchesName && matchesSpecialty && matchesCity && matchesPlace && matchesMode
  })

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-[1.7rem] font-medium tracking-[-0.04em]">{en ? "Find a doctor" : "Trouver un médecin"}</h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-soft">
          {en
            ? "Find a doctor by specialty, city, or practice."
            : "Trouvez un médecin par spécialité, ville ou cabinet."}
        </p>
      </header>
      <Panel className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <label className="block text-[12px] text-ink-soft">
          {en ? "Name" : "Nom"}
          <input value={name} onChange={(event) => setName(event.target.value)} className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-[14px] text-ink outline-none" />
        </label>
        <label className="block text-[12px] text-ink-soft">
          {en ? "Specialty" : "Spécialité"}
          <select value={specialty} onChange={(event) => setSpecialty(event.target.value)} className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-[14px] text-ink outline-none">
            <option value="">{en ? "All" : "Toutes"}</option>
            {specialtyIds.map((item) => (
              <option key={item} value={item}>{t.specialties[item].name}</option>
            ))}
          </select>
        </label>
        <label className="block text-[12px] text-ink-soft">
          {en ? "City" : "Ville"}
          <select value={city} onChange={(event) => setCity(event.target.value)} className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-[14px] text-ink outline-none">
            <option value="">{en ? "All" : "Toutes"}</option>
            {cities.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="block text-[12px] text-ink-soft">
          {en ? "Place" : "Établissement"}
          <select value={place} onChange={(event) => setPlace(event.target.value)} className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-[14px] text-ink outline-none">
            <option value="">{en ? "All" : "Tous"}</option>
            {places.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="block text-[12px] text-ink-soft">
          {en ? "Mode" : "Mode"}
          <select value={mode} onChange={(event) => setMode(event.target.value as "" | ConsultMode)} className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-[14px] text-ink outline-none">
            <option value="">{en ? "All" : "Tous"}</option>
            <option value="cabinet">{en ? "Office" : "Cabinet"}</option>
            <option value="visio">{en ? "Video" : "Visio"}</option>
          </select>
        </label>
        <p className="self-end text-[12px] leading-relaxed text-ink-faint">
          {en ? "Date and price filters are hidden: that data is not connected." : "Les filtres de date et de tarif sont absents : ces données ne sont pas reliées."}
        </p>
      </Panel>
      {visible.length === 0 ? (
        <EmptyState title={en ? "No profile matches" : "Aucune fiche ne correspond"} body={en ? "Try another specialty or city." : "Essayez une autre spécialité ou une autre ville."} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)}
        </div>
      )}
    </div>
  )
}

function DoctorCard({ doctor }: { doctor: DemoDoctor }) {
  const { locale, t } = useLocale()
  const en = locale === "en"
  const initials = `${doctor.firstName[0] ?? ""}${doctor.lastName[0] ?? ""}`
  return (
    <article className="rounded-[1.35rem] border border-black/8 bg-white/80 p-5 shadow-[0_16px_40px_rgb(12_21_38_/_0.05)]">
      <div className="flex items-start gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-navy text-[13px] font-medium text-white">{initials}</span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[1.05rem] font-medium tracking-[-0.03em]">{doctor.firstName} {doctor.lastName}</h2>
          </div>
          <p className="mt-1 text-[13px] text-ink-soft">{t.specialties[doctor.specialtyId].name}</p>
        </div>
      </div>
      <p className="mt-4 text-[13px] text-ink-soft">{doctor.city} · {doctor.establishment}</p>
      <p className="mt-1 text-[13px] text-ink-faint">{doctor.languages.join(" · ")} · {doctor.modes.map((item) => (item === "cabinet" ? (en ? "Office" : "Cabinet") : "Visio")).join(" · ")}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <a href={`#patient/medecins/${doctor.id}`} className="inline-flex h-9 items-center rounded-full border border-black/10 px-4 text-[13px] font-medium">{en ? "View profile" : "Voir la fiche"}</a>
        <a href={`#patient/rendez-vous/nouveau?medecin=${doctor.id}`} className="inline-flex h-9 items-center rounded-full bg-[#161616] px-4 text-[13px] font-medium text-white">{en ? "Note a request" : "Noter une demande"}</a>
      </div>
    </article>
  )
}

function DoctorDetail({ id }: { id: string }) {
  const { locale, t } = useLocale()
  const en = locale === "en"
  const doctor = doctorById(id)
  if (!doctor) {
    return <EmptyState title={en ? "Profile not found" : "Fiche introuvable"} body={en ? "This demonstration profile does not exist." : "Cette fiche de démonstration n'existe pas."} />
  }
  return (
    <div className="space-y-5">
      <a href="#patient/medecins" className="text-[13px] font-medium text-ink-soft">{en ? "All doctors" : "Tous les médecins"}</a>
      <Panel>
        <h1 className="text-[1.8rem] font-medium tracking-[-0.04em]">{doctor.firstName} {doctor.lastName}</h1>
        <p className="mt-2 text-[15px] text-ink-soft">{t.specialties[doctor.specialtyId].name}</p>
        <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-ink-soft">{en ? doctor.introEn : doctor.introFr}</p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <Info label={en ? "City" : "Ville"} value={doctor.city} />
          <Info label={en ? "Place" : "Lieu"} value={doctor.establishment} />
          <Info label={en ? "Languages" : "Langues"} value={doctor.languages.join(", ")} />
          <Info label={en ? "Modes" : "Modalités"} value={doctor.modes.join(", ")} />
          <Info label={en ? "Qualifications" : "Parcours"} value={en ? "Not provided" : "Non renseigné"} />
          <Info label={en ? "Calendar" : "Agenda"} value={en ? "Not connected" : "Non relié"} />
        </dl>
        <a href={`#patient/rendez-vous/nouveau?medecin=${doctor.id}`} className="mt-6 inline-flex h-11 items-center rounded-full bg-[#161616] px-5 text-[14px] font-medium text-white">
          {en ? "Note a request" : "Noter une demande"}
        </a>
      </Panel>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[12px] text-ink-faint">{label}</dt>
      <dd className="mt-1 text-[14px] text-ink">{value}</dd>
    </div>
  )
}
