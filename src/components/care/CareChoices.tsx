import type { ReactNode } from "react"
import { useLocale } from "@/i18n/useLocale.ts"
import { matchCare } from "@/lib/directory/match.ts"
import type { Recommendation } from "@/types/chat.ts"

export function CareChoices({
  messages,
  recommendation,
}: {
  messages: readonly { role: string; content: string }[]
  recommendation?: Recommendation
}) {
  const { locale } = useLocale()
  const en = locale === "en"
  const match = matchCare({
    messages,
    specialtyId: recommendation?.specialtyId,
    urgent: recommendation?.urgency === "urgent",
  })
  const specialtyQuery = recommendation?.specialtyId ? `specialite=${recommendation.specialtyId}` : ""
  const cityQuery = match.city ? `ville=${encodeURIComponent(match.city.name)}` : ""
  const query = [specialtyQuery, cityQuery].filter(Boolean).join("&")

  return (
    <div className="space-y-3">
      <ChoiceGroup label={match.urgent ? (en ? "Clinics" : "Cliniques") : (en ? "Doctors" : "Médecins")}>
        {match.urgent
          ? match.clinics.map((clinic) => (
              <ChoiceCard
                key={clinic.id}
                title={clinic.name}
                meta={`${clinic.city} · ${en ? "Emergency" : "Urgences"}`}
              />
            ))
          : match.doctors.map((doctor) => (
              <ChoiceCard
                key={doctor.id}
                href={`#patient/medecins/${doctor.id}`}
                title={`${doctor.firstName} ${doctor.lastName}`}
                meta={`${doctor.city} · ${doctor.establishment} · ${doctor.reviews} ${en ? "reviews" : "avis"}`}
              />
            ))}
      </ChoiceGroup>

      {match.urgent ? (
        <ChoiceGroup label={en ? "Doctors" : "Médecins"}>
          {match.doctors.map((doctor) => (
            <ChoiceCard
              key={doctor.id}
              href={`#patient/medecins/${doctor.id}`}
              title={`${doctor.firstName} ${doctor.lastName}`}
              meta={`${doctor.city} · ${doctor.establishment} · ${doctor.reviews} ${en ? "reviews" : "avis"}`}
            />
          ))}
        </ChoiceGroup>
      ) : null}

      {match.cabinets.length > 0 ? (
        <ChoiceGroup label={en ? "Offices" : "Cabinets"}>
          {match.cabinets.map((cabinet) => (
            <ChoiceCard
              key={cabinet.id}
              href={`#patient/medecins/${cabinet.doctorId}`}
              title={cabinet.name}
              meta={cabinet.city}
            />
          ))}
        </ChoiceGroup>
      ) : null}

      {!match.urgent && match.clinics.length > 0 ? (
        <ChoiceGroup label={en ? "Clinics" : "Cliniques"}>
          {match.clinics.map((clinic) => (
            <ChoiceCard key={clinic.id} title={clinic.name} meta={`${clinic.city} · ${en ? "Emergency" : "Urgences"}`} />
          ))}
        </ChoiceGroup>
      ) : null}

      {recommendation?.specialtyId && !match.urgent ? (
        <a
          href={`#patient/medecins${query ? `?${query}` : ""}`}
          className="inline-flex items-center justify-center rounded-full bg-[#9a4e66] px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#864257]"
        >
          {en ? "Find a doctor" : "Trouver un médecin"}
        </a>
      ) : null}
    </div>
  )
}

function ChoiceGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[12px] text-ink-faint">{label}</p>
      <ul className="mt-2 space-y-2">{children}</ul>
    </div>
  )
}

function ChoiceCard({ title, meta, href }: { title: string; meta: string; href?: string }) {
  const className = "block rounded-2xl border border-white/80 bg-white/70 px-3 py-2.5 shadow-[inset_0_1px_0_rgb(255_255_255)]"
  const body = (
    <>
      <span className="block text-[13px] font-medium text-ink">{title}</span>
      <span className="mt-0.5 block text-[12px] text-ink-faint">{meta}</span>
    </>
  )
  return <li>{href ? <a href={href} className={`${className} transition-colors hover:bg-white`}>{body}</a> : <div className={className}>{body}</div>}</li>
}
