import { useState, type FormEvent, type ReactNode } from "react"
import { directoryDoctors, doctorById, type ConsultMode } from "@/data/demo-directory.ts"
import { useLocale } from "@/i18n/useLocale.ts"
import { useAuth } from "@/lib/auth/useAuth.ts"
import { cancelRequest, createRequest, requestById, updateRequest, type RequestWindow } from "@/lib/patient/requests.ts"
import { useCareRequests } from "@/lib/patient/useCare.ts"
import { EmptyState, Panel, StatusPill, fieldClass } from "@/patient/ui.tsx"

export function AppointmentsPage({ path, params }: { path: string; params: URLSearchParams }) {
  const parts = path.split("/")
  const leaf = parts[2]
  if (leaf === "nouveau") {
    return <Booking params={params} />
  }
  if (leaf) {
    return <RequestDetail key={leaf} id={leaf} />
  }
  return <RequestList />
}

function RequestList() {
  const { locale, t } = useLocale()
  const { account } = useAuth()
  const en = locale === "en"
  const requests = useCareRequests(account?.id ?? "")
  const upcoming = requests.filter((item) => item.status === "demande")
  const cancelled = requests.filter((item) => item.status === "annulee")

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[1.7rem] font-medium tracking-[-0.04em]">{en ? "My requests" : "Mes demandes"}</h1>
          <p className="mt-2 max-w-2xl text-[14px] text-ink-soft">
            {en
              ? "These are session preferences. No appointment is confirmed, and no calendar is blocked."
              : "Ce sont des préférences de session. Aucun rendez-vous n'est confirmé, et aucun agenda n'est bloqué."}
          </p>
        </div>
        <a href="#patient/rendez-vous/nouveau" className="inline-flex h-10 items-center rounded-full bg-[#161616] px-4 text-[13px] font-medium text-white">
          {en ? "Note a request" : "Noter une demande"}
        </a>
      </header>
      <Section title={en ? "Open" : "En cours"} empty={en ? "No open request." : "Aucune demande en cours."}>
        {upcoming.map((item) => {
          const doctor = doctorById(item.doctorId)
          return (
            <a key={item.id} href={`#patient/rendez-vous/${item.id}`} className="block rounded-2xl border border-black/8 bg-white/70 px-4 py-3">
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{doctor ? `${doctor.firstName} ${doctor.lastName}` : item.doctorId}</span>
                <StatusPill tone="warn">{en ? "Noted" : "Notée"}</StatusPill>
              </span>
              <span className="mt-1 block text-[13px] text-ink-soft">{t.specialties[item.specialtyId].name} · {windowLabel(item.window, en)}</span>
            </a>
          )
        })}
      </Section>
      <Section title={en ? "Cancelled" : "Annulées"} empty={en ? "No cancelled request." : "Aucune demande annulée."}>
        {cancelled.map((item) => {
          const doctor = doctorById(item.doctorId)
          return (
            <a key={item.id} href={`#patient/rendez-vous/${item.id}`} className="block rounded-2xl border border-black/8 px-4 py-3 text-[14px]">
              {doctor ? `${doctor.firstName} ${doctor.lastName}` : item.doctorId}
              <span className="mt-1 block text-[13px] text-ink-faint">{en ? "Cancelled" : "Annulée"}</span>
            </a>
          )
        })}
      </Section>
      <Panel>
        <p className="text-[14px] font-medium">{en ? "Past consultations" : "Consultations passées"}</p>
        <p className="mt-2 text-[13px] text-ink-soft">{en ? "No consultation has been recorded." : "Aucune consultation n'a été enregistrée."}</p>
      </Panel>
    </div>
  )
}

function Section({ title, empty, children }: { title: string; empty: string; children: ReactNode }) {
  const list = Array.isArray(children) ? children : [children]
  const filled = list.some(Boolean)
  return (
    <section className="space-y-2">
      <h2 className="text-[13px] font-medium tracking-[0.12em] text-ink-faint uppercase">{title}</h2>
      {filled ? children : <p className="text-[13px] text-ink-soft">{empty}</p>}
    </section>
  )
}

function Booking({ params }: { params: URLSearchParams }) {
  const { locale, t } = useLocale()
  const { account } = useAuth()
  const en = locale === "en"
  const preset = params.get("medecin") ?? ""
  const [doctorId, setDoctorId] = useState(preset)
  const [mode, setMode] = useState<ConsultMode>("cabinet")
  const [windowChoice, setWindowChoice] = useState<RequestWindow>("matin")
  const [error, setError] = useState("")
  const [created, setCreated] = useState("")
  const doctor = doctorById(doctorId)

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!account || !doctor) {
      setError(en ? "Choose a profile first." : "Choisissez d'abord une fiche.")
      return
    }
    if (!doctor.modes.includes(mode)) {
      setError(en ? "This profile does not list that mode." : "Cette fiche ne propose pas cette modalité.")
      return
    }
    const result = createRequest({
      patientId: account.id,
      doctorId: doctor.id,
      specialtyId: doctor.specialtyId,
      mode,
      window: windowChoice,
    })
    if (!result.ok) {
      setError(en ? "A request for this profile is already noted. It is not a confirmed appointment." : "Une demande existe déjà pour cette fiche. Ce n'est pas un rendez-vous confirmé.")
      return
    }
    setCreated(result.request.id)
    setError("")
  }

  if (created) {
    return (
      <Panel>
        <StatusPill tone="warn">{en ? "Request noted" : "Demande notée"}</StatusPill>
        <h1 className="mt-3 text-[1.6rem] font-medium tracking-[-0.04em]">{en ? "Nothing is reserved" : "Rien n'est réservé"}</h1>
        <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-ink-soft">
          {en
            ? "Your preference is saved. No professional is notified, and no slot is held."
            : "Votre préférence est enregistrée. Aucun professionnel n'est prévenu, et aucun créneau n'est retenu."}
        </p>
        <a href={`#patient/rendez-vous/${created}`} className="mt-5 inline-flex h-11 items-center rounded-full bg-[#161616] px-5 text-[14px] font-medium text-white">
          {en ? "View the request" : "Voir la demande"}
        </a>
      </Panel>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <header>
        <h1 className="text-[1.7rem] font-medium tracking-[-0.04em]">{en ? "Note a request" : "Noter une demande"}</h1>
        <p className="mt-2 max-w-2xl text-[14px] text-ink-soft">
          {en
            ? "The professional calendar is not connected. You choose a preference, not a date or a time."
            : "L'agenda du professionnel n'est pas relié. Vous choisissez une préférence, pas une date ni une heure."}
        </p>
      </header>
      {error ? <p className="text-[13px] text-danger" role="alert">{error}</p> : null}
      <Panel className="space-y-4">
        <label className="block text-[12px] text-ink-soft">
          {en ? "Profile" : "Fiche"}
          <select className={fieldClass} value={doctorId} onChange={(event) => setDoctorId(event.target.value)} required>
            <option value="">{en ? "Choose" : "Choisir"}</option>
            {directoryDoctors.map((item) => (
              <option key={item.id} value={item.id}>
                {item.firstName} {item.lastName} — {t.specialties[item.specialtyId].name}
              </option>
            ))}
          </select>
        </label>
        <fieldset>
          <legend className="text-[12px] text-ink-soft">{en ? "Mode" : "Modalité"}</legend>
          <div className="mt-2 flex gap-2">
            {(["cabinet", "visio"] as const).map((item) => (
              <button key={item} type="button" onClick={() => setMode(item)} className={`h-10 rounded-full px-4 text-[13px] ${mode === item ? "bg-navy text-white" : "border border-black/10"}`} aria-pressed={mode === item}>
                {item === "cabinet" ? (en ? "Office" : "Cabinet") : "Visio"}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-[12px] text-ink-soft">{en ? "Preference" : "Préférence"}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["matin", "apres-midi", "semaine"] as const).map((item) => (
              <button key={item} type="button" onClick={() => setWindowChoice(item)} className={`h-10 rounded-full px-4 text-[13px] ${windowChoice === item ? "bg-navy text-white" : "border border-black/10"}`} aria-pressed={windowChoice === item}>
                {windowLabel(item, en)}
              </button>
            ))}
          </div>
        </fieldset>
        {doctor ? (
          <p className="text-[13px] text-ink-soft">
            {doctor.firstName} {doctor.lastName} · {t.specialties[doctor.specialtyId].name} · {doctor.city}
          </p>
        ) : null}
        <button type="submit" className="inline-flex h-11 items-center rounded-full bg-[#161616] px-5 text-[14px] font-medium text-white">
          {en ? "Save this preference" : "Enregistrer cette préférence"}
        </button>
      </Panel>
    </form>
  )
}

function RequestDetail({ id }: { id: string }) {
  const { locale, t } = useLocale()
  const { account } = useAuth()
  const en = locale === "en"
  useCareRequests(account?.id ?? "")
  const request = account ? requestById(account.id, id) : undefined
  const [windowChoice, setWindowChoice] = useState<RequestWindow>(request?.window ?? "matin")
  const [mode, setMode] = useState<ConsultMode>(request?.mode ?? "cabinet")
  const [message, setMessage] = useState("")

  if (!account || !request) {
    return <EmptyState title={en ? "Request unavailable" : "Demande inaccessible"} body={en ? "This request does not belong to the current session." : "Cette demande n'appartient pas à la session en cours."} />
  }
  const doctor = doctorById(request.doctorId)

  const save = () => {
    const next = updateRequest(account.id, request.id, { window: windowChoice, mode })
    setMessage(next ? (en ? "Preference updated. Still not booked." : "Préférence mise à jour. Toujours non réservée.") : (en ? "This request can no longer be changed." : "Cette demande ne peut plus être modifiée."))
  }
  const cancel = () => {
    cancelRequest(account.id, request.id)
    setMessage(en ? "Request cancelled." : "Demande annulée.")
  }

  return (
    <Panel className="space-y-4">
      <StatusPill tone="warn">{request.status === "annulee" ? (en ? "Cancelled" : "Annulée") : (en ? "Noted, not booked" : "Notée, non réservée")}</StatusPill>
      <h1 className="text-[1.6rem] font-medium tracking-[-0.04em]">{doctor ? `${doctor.firstName} ${doctor.lastName}` : request.doctorId}</h1>
      <p className="text-[14px] text-ink-soft">{t.specialties[request.specialtyId].name}{doctor ? ` · ${doctor.city} · ${doctor.establishment}` : ""}</p>
      {message ? <p className="text-[13px] text-ink" role="status">{message}</p> : null}
      {request.status === "demande" ? (
        <div className="space-y-3">
          <label className="block text-[12px] text-ink-soft">
            {en ? "Preference" : "Préférence"}
            <select className={fieldClass} value={windowChoice} onChange={(event) => setWindowChoice(event.target.value as RequestWindow)}>
              <option value="matin">{windowLabel("matin", en)}</option>
              <option value="apres-midi">{windowLabel("apres-midi", en)}</option>
              <option value="semaine">{windowLabel("semaine", en)}</option>
            </select>
          </label>
          <label className="block text-[12px] text-ink-soft">
            {en ? "Mode" : "Modalité"}
            <select className={fieldClass} value={mode} onChange={(event) => setMode(event.target.value as ConsultMode)}>
              <option value="cabinet">{en ? "Office" : "Cabinet"}</option>
              <option value="visio">Visio</option>
            </select>
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={save} className="h-10 rounded-full bg-[#161616] px-4 text-[13px] font-medium text-white">{en ? "Update preference" : "Modifier la préférence"}</button>
            <button type="button" onClick={cancel} className="h-10 rounded-full border border-black/10 px-4 text-[13px] font-medium">{en ? "Cancel request" : "Annuler la demande"}</button>
          </div>
        </div>
      ) : null}
    </Panel>
  )
}

function windowLabel(value: RequestWindow, en: boolean) {
  if (value === "matin") {
    return en ? "Morning" : "Matin"
  }
  if (value === "apres-midi") {
    return en ? "Afternoon" : "Après-midi"
  }
  return en ? "This week" : "Cette semaine"
}
