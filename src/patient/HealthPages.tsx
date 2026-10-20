import { useState, type FormEvent } from "react"
import { useLocale } from "@/i18n/useLocale.ts"
import { useAuth } from "@/lib/auth/useAuth.ts"
import { doctorById } from "@/data/demo-directory.ts"
import { useCareRequests } from "@/lib/patient/useCare.ts"
import { VaccinesPanel } from "@/patient/Records.tsx"
import { EmptyState, Panel, fieldClass } from "@/patient/ui.tsx"

const tabs = ["infos", "history", "allergies", "medications", "visits", "vaccines"] as const

export function HealthRecordsPage() {
  const { locale } = useLocale()
  const { account, updateProfile } = useAuth()
  const en = locale === "en"
  const requests = useCareRequests(account?.id ?? "")
  const [tab, setTab] = useState<(typeof tabs)[number]>("infos")
  const [message, setMessage] = useState("")
  if (!account) {
    return null
  }

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const value = (key: string) => String(data.get(key) ?? "")
    if (tab === "infos") {
      await updateProfile({
        city: value("city"),
        bloodGroup: value("bloodGroup"),
        emergencyName: value("emergencyName"),
        emergencyPhone: value("emergencyPhone"),
      })
    }
    if (tab === "history") {
      await updateProfile({ conditions: value("conditions") })
    }
    if (tab === "allergies") {
      await updateProfile({ allergies: value("allergies") })
    }
    if (tab === "medications") {
      await updateProfile({ medicationsNote: value("medicationsNote") })
    }
    setMessage(en ? "Saved." : "Enregistré.")
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-[1.7rem] font-medium tracking-[-0.04em]">{en ? "Health records" : "Dossier de santé"}</h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-soft">
          {en
            ? "Allergies, treatments, vaccines, and the requests you noted."
            : "Allergies, traitements, vaccins et demandes que vous avez notées."}
        </p>
      </header>
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={`h-9 shrink-0 rounded-full px-3 text-[13px] ${tab === item ? "bg-[#f6dde4] text-[#7a3a50]" : "border border-white/80 bg-white/50"}`} aria-pressed={tab === item}>
            {tabLabel(item, en)}
          </button>
        ))}
      </div>
      {message ? <p className="text-[13px] text-ink" role="status">{message}</p> : null}
      {tab === "visits" ? (
        requests.length === 0 ? (
          <EmptyState title={en ? "No visit" : "Aucune consultation"} body={en ? "A noted request is not a consultation." : "Une demande notée n'est pas une consultation."} />
        ) : (
          <div className="space-y-2">
            {requests.map((item) => {
              const doctor = doctorById(item.doctorId)
              return (
                <a key={item.id} href={`#patient/rendez-vous/${item.id}`} className="block rounded-2xl border border-black/8 bg-white/70 px-4 py-3 text-[14px]">
                  {doctor ? `${doctor.firstName} ${doctor.lastName}` : item.doctorId}
                  <span className="mt-1 block text-[12px] text-ink-faint">{en ? "Session request, not a consultation" : "Demande de session, pas une consultation"}</span>
                </a>
              )
            })}
          </div>
        )
      ) : tab === "vaccines" ? (
        <VaccinesPanel />
      ) : (
        <form onSubmit={(event) => void save(event)} className="grid gap-3">
          <Panel className="grid gap-3">
            <p className="text-[12px] font-medium text-emerald">{en ? "Self-declared" : "Déclaré par vous"}</p>
            {tab === "infos" ? (
              <>
                <Text name="city" label={en ? "City" : "Ville"} defaultValue={account.city} />
                <Text name="bloodGroup" label={en ? "Blood group (optional)" : "Groupe sanguin (facultatif)"} defaultValue={account.bloodGroup} />
                <Text name="emergencyName" label={en ? "Emergency contact" : "Contact d'urgence"} defaultValue={account.emergencyName} />
                <Text name="emergencyPhone" label={en ? "Emergency phone" : "Téléphone d'urgence"} defaultValue={account.emergencyPhone} />
              </>
            ) : null}
            {tab === "history" ? <Area name="conditions" label={en ? "Conditions you want to note" : "Antécédents que vous souhaitez noter"} defaultValue={account.conditions} /> : null}
            {tab === "allergies" ? <Area name="allergies" label={en ? "Allergies you want to note" : "Allergies que vous souhaitez noter"} defaultValue={account.allergies} /> : null}
            {tab === "medications" ? <Area name="medicationsNote" label={en ? "Treatments you want to note" : "Traitements que vous souhaitez noter"} defaultValue={account.medicationsNote} /> : null}
            <button type="submit" className="h-11 rounded-full bg-[#9a4e66] px-5 text-[14px] font-medium text-white">{en ? "Save" : "Enregistrer"}</button>
          </Panel>
        </form>
      )}
    </div>
  )
}

function Text({ name, label, defaultValue }: { name: string; label: string; defaultValue: string }) {
  return (
    <label className="block text-[12px] text-ink-soft">
      {label}
      <input name={name} defaultValue={defaultValue} className={fieldClass} />
    </label>
  )
}

function Area({ name, label, defaultValue }: { name: string; label: string; defaultValue: string }) {
  return (
    <label className="block text-[12px] text-ink-soft">
      {label}
      <textarea name={name} defaultValue={defaultValue} rows={5} className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-[14px] text-ink outline-none" />
    </label>
  )
}

function tabLabel(tab: (typeof tabs)[number], en: boolean) {
  const fr = { infos: "Informations", history: "Antécédents", allergies: "Allergies", medications: "Traitements", visits: "Demandes", vaccines: "Vaccins" }
  const english = { infos: "Details", history: "History", allergies: "Allergies", medications: "Treatments", visits: "Requests", vaccines: "Vaccines" }
  return (en ? english : fr)[tab]
}
