import { useState, type FormEvent } from "react"
import { useLocale } from "@/i18n/useLocale.ts"
import { isAuthError } from "@/lib/auth/errors.ts"
import { passwordIsStrong } from "@/lib/auth/password.ts"
import { useAuth } from "@/lib/auth/useAuth.ts"
import { markAllNoticesRead, markNoticeRead } from "@/lib/patient/notices.ts"
import { recordsFor } from "@/lib/patient/records.ts"
import { requestsFor } from "@/lib/patient/requests.ts"
import { useNotices } from "@/lib/patient/useCare.ts"
import { EmptyState, Panel, fieldClass } from "@/patient/ui.tsx"

export function ProfilePage() {
  const { locale } = useLocale()
  const { account, updateProfile } = useAuth()
  const en = locale === "en"
  const [message, setMessage] = useState("")
  if (!account) {
    return null
  }
  const initials = `${account.firstName[0] ?? ""}${account.lastName[0] ?? ""}`.toUpperCase()

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    await updateProfile({
      firstName: String(data.get("firstName") ?? "").trim() || account.firstName,
      lastName: String(data.get("lastName") ?? "").trim() || account.lastName,
      phone: String(data.get("phone") ?? "").trim(),
      birthDate: String(data.get("birthDate") ?? ""),
      city: String(data.get("city") ?? ""),
      language: locale,
      bloodGroup: String(data.get("bloodGroup") ?? ""),
      allergies: String(data.get("allergies") ?? ""),
      conditions: String(data.get("conditions") ?? ""),
      emergencyName: String(data.get("emergencyName") ?? ""),
      emergencyPhone: String(data.get("emergencyPhone") ?? ""),
    })
    setMessage(en ? "Profile updated." : "Profil mis à jour.")
  }

  return (
    <form onSubmit={(event) => void save(event)} className="space-y-5">
      <header>
        <h1 className="text-[1.7rem] font-medium tracking-[-0.04em]">{en ? "Profile" : "Profil"}</h1>
        <p className="mt-2 text-[14px] text-ink-soft">{en ? "Email stays as registered. Health fields are optional and self-declared." : "L'e-mail reste celui de l'inscription. Les champs de santé sont facultatifs et déclarés par vous."}</p>
      </header>
      <Panel className="flex items-center gap-4">
        <span className="grid size-14 place-items-center rounded-full bg-navy text-[16px] text-white">{initials}</span>
        <p className="text-[13px] leading-relaxed text-ink-soft">
          {en ? "A profile photo is not stored. Private file storage is not connected." : "La photo de profil n'est pas enregistrée. Le stockage privé n'est pas relié."}
        </p>
      </Panel>
      {message ? <p className="text-[13px] text-ink" role="status">{message}</p> : null}
      <Panel className="grid gap-3 sm:grid-cols-2">
        <Field name="firstName" label={en ? "First name" : "Prénom"} defaultValue={account.firstName} />
        <Field name="lastName" label={en ? "Last name" : "Nom"} defaultValue={account.lastName} />
        <label className="block text-[12px] text-ink-soft">
          {en ? "Email" : "E-mail"}
          <input value={account.email} readOnly className={`${fieldClass} bg-canvas`} />
        </label>
        <Field name="phone" label={en ? "Phone" : "Téléphone"} defaultValue={account.phone} />
        <Field name="birthDate" label={en ? "Date of birth" : "Date de naissance"} type="date" defaultValue={account.birthDate} />
        <Field name="city" label={en ? "City" : "Ville"} defaultValue={account.city} />
        <Field name="bloodGroup" label={en ? "Blood group" : "Groupe sanguin"} defaultValue={account.bloodGroup} />
        <Field name="emergencyName" label={en ? "Emergency contact" : "Contact d'urgence"} defaultValue={account.emergencyName} />
        <Field name="emergencyPhone" label={en ? "Emergency phone" : "Téléphone d'urgence"} defaultValue={account.emergencyPhone} />
        <label className="block text-[12px] text-ink-soft sm:col-span-2">
          {en ? "Allergies" : "Allergies"}
          <textarea name="allergies" defaultValue={account.allergies} rows={3} className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-[14px] outline-none" />
        </label>
        <label className="block text-[12px] text-ink-soft sm:col-span-2">
          {en ? "Conditions" : "Antécédents"}
          <textarea name="conditions" defaultValue={account.conditions} rows={3} className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-[14px] outline-none" />
        </label>
        <button type="submit" className="h-11 rounded-full bg-[#161616] px-5 text-[14px] font-medium text-white sm:col-span-2">{en ? "Save" : "Enregistrer"}</button>
      </Panel>
    </form>
  )
}

export function PrivacyPage() {
  const { locale } = useLocale()
  const { account, changePassword, updateProfile, deleteAccount, logout } = useAuth()
  const en = locale === "en"
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [confirm, setConfirm] = useState("")
  if (!account) {
    return null
  }

  const onPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const current = String(data.get("current") ?? "")
    const next = String(data.get("next") ?? "")
    if (!passwordIsStrong(next)) {
      setError(en ? "Use 8 characters, with a letter and a number." : "Utilisez 8 caractères, une lettre et un chiffre.")
      return
    }
    try {
      await changePassword(current, next)
      setError("")
      setMessage(en ? "Password updated." : "Mot de passe mis à jour.")
      event.currentTarget.reset()
    } catch (caught) {
      setMessage("")
      setError(isAuthError(caught) && caught.failure === "invalid"
        ? (en ? "Current password is not recognized." : "Le mot de passe actuel n'est pas reconnu.")
        : (en ? "Password was not changed." : "Le mot de passe n'a pas été changé."))
    }
  }

  const download = () => {
    const payload = { account, requests: requestsFor(account.id), records: recordsFor(account.id) }
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }))
    const link = document.createElement("a")
    link.href = url
    link.download = "sehatoka.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  const remove = async () => {
    if (confirm.trim().toLowerCase() !== account.email) {
      setError(en ? "Type your email to confirm deletion." : "Saisissez votre e-mail pour confirmer la suppression.")
      return
    }
    await deleteAccount()
    window.location.hash = "#accueil"
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-[1.7rem] font-medium tracking-[-0.04em]">{en ? "Privacy" : "Confidentialité"}</h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-soft">
          {en
            ? "Your information stays on this device. It is not shared with a care establishment."
            : "Vos informations restent sur cet appareil. Elles ne sont pas partagées avec un établissement."}
        </p>
      </header>
      {message ? <p className="text-[13px] text-ink" role="status">{message}</p> : null}
      {error ? <p className="text-[13px] text-danger" role="alert">{error}</p> : null}
      <Panel>
        <h2 className="text-[15px] font-medium">{en ? "Password" : "Mot de passe"}</h2>
        <form onSubmit={(event) => void onPassword(event)} className="mt-3 grid gap-3">
          <Field name="current" label={en ? "Current password" : "Mot de passe actuel"} type="password" />
          <Field name="next" label={en ? "New password" : "Nouveau mot de passe"} type="password" />
          <button type="submit" className="h-10 rounded-full bg-[#161616] px-4 text-[13px] font-medium text-white">{en ? "Update" : "Mettre à jour"}</button>
        </form>
      </Panel>
      <Panel className="space-y-3">
        <h2 className="text-[15px] font-medium">{en ? "This device" : "Cet appareil"}</h2>
        <p className="text-[13px] text-ink-soft">{en ? "Your session stays in this browser. No other device is listed." : "Votre session reste dans ce navigateur. Aucun autre appareil n'est listé."}</p>
        <button type="button" onClick={() => void logout().then(() => { window.location.hash = "#accueil" })} className="h-10 rounded-full border border-black/10 px-4 text-[13px] font-medium">
          {en ? "Log out" : "Déconnexion"}
        </button>
      </Panel>
      <Panel className="space-y-3">
        <h2 className="text-[15px] font-medium">{en ? "Sharing preference" : "Préférence de partage"}</h2>
        <p className="text-[13px] leading-relaxed text-ink-soft">
          {en
            ? "Saving this preference does not send your information. No professional or clinic can read it."
            : "Enregistrer cette préférence n'envoie pas vos informations. Aucun professionnel ni aucune clinique ne peut les lire."}
        </p>
        <label className="flex items-center gap-2 text-[14px]">
          <input
            type="checkbox"
            checked={account.shareWithCare}
            onChange={(event) => void updateProfile({ shareWithCare: event.target.checked })}
          />
          {en ? "I would allow a future care team to read my self-declared notes" : "J'accepterais qu'une future équipe de soins lise mes notes déclarées"}
        </label>
      </Panel>
      <Panel className="flex flex-wrap gap-2">
        <button type="button" onClick={download} className="h-10 rounded-full border border-black/10 px-4 text-[13px] font-medium">{en ? "Download my data" : "Télécharger mes données"}</button>
      </Panel>
      <Panel className="space-y-3">
        <h2 className="text-[15px] font-medium">{en ? "Delete this account" : "Supprimer ce compte"}</h2>
        <p className="text-[13px] text-ink-soft">{en ? "Type your email. The account, its requests, and its documents disappear from this device." : "Saisissez votre e-mail. Le compte, les demandes et les documents disparaissent de cet appareil."}</p>
        <input value={confirm} onChange={(event) => setConfirm(event.target.value)} className={fieldClass} placeholder={account.email} />
        <button type="button" onClick={() => void remove()} className="h-10 rounded-full bg-danger px-4 text-[13px] font-medium text-white">{en ? "Delete" : "Supprimer"}</button>
      </Panel>
    </div>
  )
}

export function SettingsPage() {
  const { locale, setLocale } = useLocale()
  const { account, updateProfile } = useAuth()
  const en = locale === "en"
  if (!account) {
    return null
  }
  return (
    <div className="space-y-4">
      <h1 className="text-[1.7rem] font-medium tracking-[-0.04em]">{en ? "Settings" : "Réglages"}</h1>
      <Panel className="space-y-3">
        <h2 className="text-[15px] font-medium">{en ? "Language" : "Langue"}</h2>
        <div className="flex gap-2">
          {(["fr", "en"] as const).map((item) => (
            <button key={item} type="button" onClick={() => { setLocale(item); void updateProfile({ language: item }) }} className={`h-9 rounded-full px-4 text-[13px] uppercase ${locale === item ? "bg-navy text-white" : "border border-black/10"}`} aria-pressed={locale === item}>
              {item}
            </button>
          ))}
        </div>
      </Panel>
      <Panel className="space-y-3">
        <h2 className="text-[15px] font-medium">{en ? "Notices in this space" : "Avis dans cet espace"}</h2>
        <p className="text-[13px] leading-relaxed text-ink-soft">
          {en ? "No email is sent. This only shows or hides notices inside the portal." : "Aucun e-mail n'est envoyé. Cela affiche ou masque seulement les avis dans le portail."}
        </p>
        <label className="flex items-center gap-2 text-[14px]">
          <input type="checkbox" checked={account.notifyInApp} onChange={(event) => void updateProfile({ notifyInApp: event.target.checked })} />
          {en ? "Show request notices" : "Afficher les avis de demande"}
        </label>
      </Panel>
    </div>
  )
}

export function NotificationsPage() {
  const { locale } = useLocale()
  const { account } = useAuth()
  const en = locale === "en"
  const notices = useNotices(account?.id ?? "", locale)
  if (!account) {
    return null
  }
  const visible = account.notifyInApp ? notices : []
  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[1.7rem] font-medium tracking-[-0.04em]">{en ? "Notifications" : "Notifications"}</h1>
        {visible.length > 0 ? (
          <button type="button" onClick={() => markAllNoticesRead(account.id, visible.map((item) => item.id))} className="h-9 rounded-full border border-black/10 px-3 text-[13px]">
            {en ? "Mark all as read" : "Tout marquer comme lu"}
          </button>
        ) : null}
      </header>
      {visible.length === 0 ? (
        <EmptyState title={en ? "No notice" : "Aucun avis"} body={en ? "A notice is created only after a request you actually note." : "Un avis n'est créé qu'après une demande que vous notez vraiment."} />
      ) : (
        <ul className="space-y-2">
          {visible.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                onClick={() => markNoticeRead(account.id, item.id)}
                className="block rounded-2xl border border-black/8 bg-white/75 px-4 py-3"
              >
                <span className="flex items-center gap-2 text-[14px] font-medium">
                  {item.unread ? <span className="size-1.5 rounded-full bg-emerald" /> : null}
                  {item.title}
                </span>
                <span className="mt-1 block text-[13px] text-ink-soft">{item.body}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function PaymentsPage() {
  const { locale } = useLocale()
  const en = locale === "en"
  return (
    <div className="space-y-4">
      <h1 className="text-[1.7rem] font-medium tracking-[-0.04em]">{en ? "Payments" : "Paiements"}</h1>
      <EmptyState
        title={en ? "No invoice" : "Aucune facture"}
        body={en
          ? "Invoices from a care establishment will appear here, in MAD."
          : "Les factures d'un établissement apparaîtront ici, en dirhams."}
      />
    </div>
  )
}

function Field({ name, label, defaultValue = "", type = "text" }: { name: string; label: string; defaultValue?: string; type?: string }) {
  return (
    <label className="block text-[12px] text-ink-soft">
      {label}
      <input name={name} type={type} defaultValue={defaultValue} className={fieldClass} />
    </label>
  )
}
