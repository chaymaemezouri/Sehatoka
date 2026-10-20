import { useState, type FormEvent } from "react"
import { useLocale } from "@/i18n/useLocale.ts"
import { useAuth } from "@/lib/auth/useAuth.ts"
import { addDocument, addLab, addPrescription, addVaccine, openDocument, removeDocument, removeLab, removePrescription, removeVaccine } from "@/lib/patient/records.ts"
import { useRecords } from "@/lib/patient/useCare.ts"
import { EmptyState, Panel, fieldClass } from "@/patient/ui.tsx"

export function DocumentsPage() {
  const { locale } = useLocale()
  const { account } = useAuth()
  const en = locale === "en"
  const records = useRecords(account?.id ?? "")
  const [message, setMessage] = useState("")
  if (!account) {
    return null
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-[1.7rem] font-medium tracking-[-0.04em]">{en ? "Documents" : "Documents"}</h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-soft">
          {en
            ? "Add a report, a prescription, or an image you already have. It stays on this device."
            : "Ajoutez un compte rendu, une ordonnance ou une image que vous avez déjà. Le fichier reste sur cet appareil."}
        </p>
      </header>
      <Panel>
        <label className="block text-[13px] font-medium">
          {en ? "Add a file" : "Ajouter un fichier"}
          <input
            type="file"
            className="mt-3 block text-[13px]"
            onChange={(event) => {
              const file = event.target.files?.[0]
              event.target.value = ""
              if (!file) {
                return
              }
              void addDocument(account.id, file).then((result) => {
                setMessage(
                  result === "ok"
                    ? en
                      ? "Document saved."
                      : "Document enregistré."
                    : result === "large"
                      ? en
                        ? "This file is larger than 4 MB."
                        : "Ce fichier dépasse 4 Mo."
                      : en
                        ? "The file could not be saved."
                        : "Le fichier n'a pas pu être enregistré.",
                )
              })
            }}
          />
        </label>
        {message ? <p className="mt-3 text-[13px] text-ink" role="status">{message}</p> : null}
      </Panel>
      {records.documents.length === 0 ? (
        <EmptyState title={en ? "No document yet" : "Aucun document pour le moment"} body={en ? "The files you add will be listed here." : "Les fichiers que vous ajoutez seront listés ici."} />
      ) : (
        <ul className="space-y-2">
          {records.documents.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[1.4rem] border border-white/75 bg-white/52 px-4 py-3 backdrop-blur-xl">
              <div>
                <p className="text-[14px] font-medium">{item.name}</p>
                <p className="mt-0.5 text-[12px] text-ink-faint">{formatWhen(item.addedAt, locale)} · {formatSize(item.size)}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => void openDocument(item.id)} className="h-9 rounded-full bg-[#161616] px-3 text-[13px] font-medium text-white">{en ? "Open" : "Ouvrir"}</button>
                <button type="button" onClick={() => void removeDocument(account.id, item.id)} className="h-9 rounded-full px-3 text-[13px] font-medium text-ink-soft">{en ? "Remove" : "Retirer"}</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function PrescriptionsPage() {
  const { locale } = useLocale()
  const { account } = useAuth()
  const en = locale === "en"
  const records = useRecords(account?.id ?? "")
  if (!account) {
    return null
  }

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const created = addPrescription(account.id, {
      title: String(data.get("title") ?? ""),
      date: String(data.get("date") ?? ""),
      prescriber: String(data.get("prescriber") ?? ""),
      note: String(data.get("note") ?? ""),
    })
    if (created) {
      event.currentTarget.reset()
    }
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-[1.7rem] font-medium tracking-[-0.04em]">{en ? "Prescriptions" : "Ordonnances"}</h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-soft">
          {en
            ? "Keep a prescription you already have. Sehatoka does not create one and does not suggest a dose."
            : "Conservez une ordonnance que vous avez déjà. Sehatoka n'en crée pas et ne propose pas de posologie."}
        </p>
      </header>
      <Panel>
        <form onSubmit={save} className="grid gap-3 sm:grid-cols-2">
          <Label className="sm:col-span-2" name="title" label={en ? "Title" : "Intitulé"} required />
          <Label name="date" label={en ? "Date" : "Date"} type="date" />
          <Label name="prescriber" label={en ? "Prescriber" : "Prescripteur"} />
          <Note name="note" label={en ? "Note" : "Note"} />
          <button type="submit" className="h-11 rounded-full bg-[#161616] px-5 text-[14px] font-medium text-white sm:col-span-2 sm:justify-self-start">{en ? "Save" : "Enregistrer"}</button>
        </form>
      </Panel>
      {records.prescriptions.length === 0 ? (
        <EmptyState title={en ? "No prescription yet" : "Aucune ordonnance pour le moment"} body={en ? "Add the ones you want to find again." : "Ajoutez celles que vous souhaitez retrouver."} />
      ) : (
        <ul className="space-y-2">
          {records.prescriptions.map((item) => (
            <li key={item.id} className="rounded-[1.4rem] border border-white/75 bg-white/52 px-4 py-3 backdrop-blur-xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[15px] font-medium">{item.title}</p>
                  <p className="mt-1 text-[13px] text-ink-soft">{[item.prescriber, formatDay(item.date, locale)].filter(Boolean).join(" · ")}</p>
                  {item.note ? <p className="mt-1 text-[13px] text-ink-faint">{item.note}</p> : null}
                </div>
                <button type="button" onClick={() => removePrescription(account.id, item.id)} className="text-[13px] text-ink-soft">{en ? "Remove" : "Retirer"}</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function LabsPage() {
  const { locale } = useLocale()
  const { account } = useAuth()
  const en = locale === "en"
  const records = useRecords(account?.id ?? "")
  if (!account) {
    return null
  }

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const created = addLab(account.id, {
      name: String(data.get("name") ?? ""),
      date: String(data.get("date") ?? ""),
      value: String(data.get("value") ?? ""),
      note: String(data.get("note") ?? ""),
    })
    if (created) {
      event.currentTarget.reset()
    }
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-[1.7rem] font-medium tracking-[-0.04em]">{en ? "Lab results" : "Analyses"}</h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-soft">
          {en
            ? "Note a result as it appears on your report. Sehatoka does not interpret it."
            : "Notez un résultat tel qu'il figure sur votre compte rendu. Sehatoka ne l'interprète pas."}
        </p>
      </header>
      <Panel>
        <form onSubmit={save} className="grid gap-3 sm:grid-cols-2">
          <Label className="sm:col-span-2" name="name" label={en ? "Exam" : "Examen"} required />
          <Label name="date" label={en ? "Date" : "Date"} type="date" />
          <Label name="value" label={en ? "Result" : "Résultat"} />
          <Note name="note" label={en ? "Note" : "Note"} />
          <button type="submit" className="h-11 rounded-full bg-[#161616] px-5 text-[14px] font-medium text-white sm:col-span-2 sm:justify-self-start">{en ? "Save" : "Enregistrer"}</button>
        </form>
      </Panel>
      {records.labs.length === 0 ? (
        <EmptyState title={en ? "No result yet" : "Aucun résultat pour le moment"} body={en ? "The results you note will be listed here." : "Les résultats que vous notez seront listés ici."} />
      ) : (
        <ul className="space-y-2">
          {records.labs.map((item) => (
            <li key={item.id} className="rounded-[1.4rem] border border-white/75 bg-white/52 px-4 py-3 backdrop-blur-xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[15px] font-medium">{item.name}</p>
                  <p className="mt-1 text-[13px] text-ink-soft">{[item.value, formatDay(item.date, locale)].filter(Boolean).join(" · ")}</p>
                  {item.note ? <p className="mt-1 text-[13px] text-ink-faint">{item.note}</p> : null}
                </div>
                <button type="button" onClick={() => removeLab(account.id, item.id)} className="text-[13px] text-ink-soft">{en ? "Remove" : "Retirer"}</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function VaccinesPanel() {
  const { locale } = useLocale()
  const { account } = useAuth()
  const en = locale === "en"
  const records = useRecords(account?.id ?? "")
  if (!account) {
    return null
  }

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const created = addVaccine(account.id, {
      name: String(data.get("name") ?? ""),
      date: String(data.get("date") ?? ""),
      note: String(data.get("note") ?? ""),
    })
    if (created) {
      event.currentTarget.reset()
    }
  }

  return (
    <div className="space-y-3">
      <Panel>
        <form onSubmit={save} className="grid gap-3 sm:grid-cols-2">
          <Label className="sm:col-span-2" name="name" label={en ? "Vaccine" : "Vaccin"} required />
          <Label name="date" label={en ? "Date" : "Date"} type="date" />
          <Label name="note" label={en ? "Note" : "Note"} />
          <button type="submit" className="h-11 rounded-full bg-[#161616] px-5 text-[14px] font-medium text-white sm:col-span-2 sm:justify-self-start">{en ? "Add" : "Ajouter"}</button>
        </form>
      </Panel>
      {records.vaccines.length === 0 ? (
        <EmptyState title={en ? "No vaccine yet" : "Aucun vaccin pour le moment"} body={en ? "Add the vaccines you want to keep in your record." : "Ajoutez les vaccins que vous souhaitez garder dans votre carnet."} />
      ) : (
        <ul className="space-y-2">
          {records.vaccines.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3 rounded-[1.4rem] border border-white/75 bg-white/52 px-4 py-3 backdrop-blur-xl">
              <div>
                <p className="text-[15px] font-medium">{item.name}</p>
                <p className="mt-1 text-[13px] text-ink-soft">{[formatDay(item.date, locale), item.note].filter(Boolean).join(" · ")}</p>
              </div>
              <button type="button" onClick={() => removeVaccine(account.id, item.id)} className="text-[13px] text-ink-soft">{en ? "Remove" : "Retirer"}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Label({ name, label, type = "text", required = false, className = "" }: { name: string; label: string; type?: string; required?: boolean; className?: string }) {
  return (
    <label className={`block text-[12px] text-ink-soft ${className}`}>
      {label}
      <input name={name} type={type} required={required} className={fieldClass} />
    </label>
  )
}

function Note({ name, label }: { name: string; label: string }) {
  return (
    <label className="block text-[12px] text-ink-soft sm:col-span-2">
      {label}
      <textarea name={name} rows={3} className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-[14px] text-ink outline-none" />
    </label>
  )
}

function formatDay(value: string, locale: "fr" | "en") {
  if (!value) {
    return ""
  }
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(date)
}

function formatWhen(value: string, locale: "fr" | "en") {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value))
}

function formatSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} o`
  }
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} Ko`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}
