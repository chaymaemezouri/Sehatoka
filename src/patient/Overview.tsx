import { ArrowRight, CalendarClock, FileText, Sparkles, Stethoscope, UserRound } from "lucide-react"
import type { ReactNode } from "react"
import { useLocale } from "@/i18n/useLocale.ts"
import { doctorById } from "@/data/demo-directory.ts"
import { useAuth } from "@/lib/auth/useAuth.ts"
import { profileCompletion, useCareRequests, useNotices, useRecords } from "@/lib/patient/useCare.ts"

const wash = [
  "radial-gradient(46% 42% at 8% 0%, rgba(242,194,212,0.9) 0%, transparent 62%)",
  "radial-gradient(36% 40% at 96% 8%, rgba(158,182,239,0.75) 0%, transparent 60%)",
  "linear-gradient(180deg, rgba(255,255,255,0.2), transparent 42%)",
].join(",")

export function Overview() {
  const { locale, t } = useLocale()
  const { account } = useAuth()
  const en = locale === "en"
  const requests = useCareRequests(account?.id ?? "")
  const notices = useNotices(account?.id ?? "", locale)
  const records = useRecords(account?.id ?? "")
  if (!account) {
    return null
  }
  const open = requests.find((item) => item.status === "demande")
  const doctor = open ? doctorById(open.doctorId) : undefined
  const completion = profileCompletion(account)
  const initials = `${account.firstName[0] ?? ""}${account.lastName[0] ?? ""}`.toUpperCase()

  return (
    <div className="space-y-5">
      <header className="px-1 pt-2">
        <h1 className="text-[2.4rem] leading-[0.95] font-medium tracking-[-0.05em] text-ink sm:text-[3.15rem]">
          {en ? `Hello, ${account.firstName}` : `Bonjour, ${account.firstName}`}
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-soft">
          {en
            ? "Your requests, your doctors, and your follow-up, in one place."
            : "Vos demandes, vos médecins et votre suivi, au même endroit."}
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(16rem,0.7fr)]">
        <section className="relative overflow-hidden rounded-[1.8rem] border border-white/75 bg-white/38 p-6 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.95),0_24px_60px_rgb(48_24_40_/_0.08)] backdrop-blur-2xl sm:p-8">
          <div className="pointer-events-none absolute inset-0" style={{ background: wash }} aria-hidden="true" />
          <div className="relative">
            <p className="text-[13px] text-ink-faint">{en ? "Next step" : "Prochaine étape"}</p>
            {open && doctor ? (
              <>
                <h2 className="mt-3 text-[1.8rem] leading-none font-medium tracking-[-0.045em] sm:text-[2.2rem]">
                  {doctor.firstName} {doctor.lastName}
                </h2>
                <p className="mt-3 text-[15px] text-ink-soft">
                  {t.specialties[open.specialtyId].name} · {doctor.city} · {windowLabel(open.window, en)}
                </p>
                <p className="mt-1 text-[13px] text-ink-faint">{doctor.establishment}</p>
                <a href={`#patient/rendez-vous/${open.id}`} className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#161616] px-5 text-[14px] font-medium text-white transition-colors hover:bg-black">
                  {en ? "View the request" : "Voir la demande"}
                  <ArrowRight className="size-4" />
                </a>
              </>
            ) : (
              <>
                <h2 className="mt-3 max-w-[14ch] text-[1.8rem] leading-[1.02] font-medium tracking-[-0.045em] sm:text-[2.35rem]">
                  {en ? "Talk with Sehatoka AI" : "Parlez à Sehatoka AI"}
                </h2>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
                  {en
                    ? "Describe what brings you here. Sehatoka guides you to the right specialty and the doctors who match."
                    : "Décrivez ce qui vous amène. Sehatoka vous oriente vers la spécialité adaptée et les médecins correspondants."}
                </p>
                <a href="#patient/assistant" className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#161616] px-5 text-[14px] font-medium text-white transition-colors hover:bg-black">
                  {en ? "Start" : "Commencer"}
                  <ArrowRight className="size-4" />
                </a>
              </>
            )}
          </div>
        </section>

        <section className="flex flex-col justify-between rounded-[1.8rem] border border-white/75 bg-white/50 p-6 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.95),0_18px_40px_rgb(48_24_40_/_0.06)] backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-full bg-[#161616] text-[14px] font-medium text-white">{initials}</span>
            <div>
              <p className="text-[13px] text-ink-faint">{en ? "Your profile" : "Votre profil"}</p>
              <p className="text-[15px] font-medium tracking-[-0.03em]">{account.firstName} {account.lastName}</p>
            </div>
          </div>
          <div className="mt-8">
            <div className="flex items-end justify-between">
              <p className="text-[2.4rem] leading-none font-medium tracking-[-0.05em]">{completion}%</p>
              <p className="pb-1 text-[13px] text-ink-faint">{en ? "completed" : "complété"}</p>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-black/8">
              <div className="h-full rounded-full bg-[#161616]" style={{ width: `${completion}%` }} />
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">
              {en ? "A few details are enough to personalize your follow-up." : "Quelques informations suffisent pour personnaliser votre suivi."}
            </p>
          </div>
          <a href="#patient/profil" className="mt-6 text-[13px] font-medium text-ink underline-offset-4 hover:underline">
            {en ? "Complete my profile" : "Compléter mon profil"}
          </a>
        </section>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Action href="#patient/medecins" icon={<Stethoscope className="size-4" />} label={en ? "Find a doctor" : "Trouver un médecin"} />
        <Action href="#patient/rendez-vous/nouveau" icon={<CalendarClock className="size-4" />} label={en ? "Book a visit" : "Prendre rendez-vous"} />
        <Action href="#patient/assistant" icon={<Sparkles className="size-4" />} label="Sehatoka AI" />
        <Action href="#patient/documents" icon={<FileText className="size-4" />} label={en ? "Documents" : "Documents"} />
        <Action href="#patient/profil" icon={<UserRound className="size-4" />} label={en ? "Profile" : "Profil"} />
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <Summary
          href="#patient/documents"
          title={en ? "Documents" : "Documents"}
          empty={en ? "Add a report or an image you already have." : "Ajoutez un compte rendu ou une image que vous avez déjà."}
          lines={records.documents.slice(0, 2).map((item) => ({ id: item.id, label: item.name }))}
        />
        <Summary
          href="#patient/ordonnances"
          title={en ? "Prescriptions" : "Ordonnances"}
          empty={en ? "Keep a prescription you already have." : "Conservez une ordonnance que vous avez déjà."}
          lines={records.prescriptions.slice(0, 2).map((item) => ({ id: item.id, label: item.title }))}
        />
        <section className="rounded-[1.5rem] border border-white/70 bg-white/42 p-5 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.9)] backdrop-blur-xl">
          <p className="text-[15px] font-medium tracking-[-0.03em]">{en ? "Notifications" : "Notifications"}</p>
          {notices.length === 0 ? (
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
              {en ? "Updates about your requests will appear here." : "Le suivi de vos demandes apparaîtra ici."}
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {notices.slice(0, 3).map((item) => (
                <li key={item.id}>
                  <a href={item.href} className="text-[13px] font-medium text-ink">{item.title}</a>
                  <p className="text-[12px] leading-relaxed text-ink-faint">{item.body}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

function Action({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  return (
    <a href={href} className="flex items-center gap-3 rounded-full border border-white/75 bg-white/55 px-4 py-3 text-[13px] font-medium text-ink shadow-[inset_0_1px_0_rgb(255_255_255_/_0.95)] backdrop-blur-xl transition-colors hover:bg-white">
      <span className="text-ink-soft">{icon}</span>
      {label}
    </a>
  )
}

function Summary({ href, title, empty, lines }: { href: string; title: string; empty: string; lines: Array<{ id: string; label: string }> }) {
  return (
    <a href={href} className="block rounded-[1.5rem] border border-white/70 bg-white/42 p-5 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.9)] backdrop-blur-xl transition-colors hover:bg-white/70">
      <p className="text-[15px] font-medium tracking-[-0.03em]">{title}</p>
      {lines.length === 0 ? (
        <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {lines.map((line) => (
            <li key={line.id} className="truncate text-[13px] text-ink-soft">{line.label}</li>
          ))}
        </ul>
      )}
    </a>
  )
}

function windowLabel(value: string, en: boolean) {
  if (value === "matin") {
    return en ? "Morning" : "Matin"
  }
  if (value === "apres-midi") {
    return en ? "Afternoon" : "Après-midi"
  }
  return en ? "This week" : "Cette semaine"
}
