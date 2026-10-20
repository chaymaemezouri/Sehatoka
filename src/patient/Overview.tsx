import { ArrowRight, CalendarClock, FolderHeart, Sparkles, Stethoscope } from "lucide-react"
import type { ReactNode } from "react"
import { useLocale } from "@/i18n/useLocale.ts"
import { doctorById } from "@/data/demo-directory.ts"
import { useAuth } from "@/lib/auth/useAuth.ts"
import { useCareRequests, useRecords } from "@/lib/patient/useCare.ts"

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
  const records = useRecords(account?.id ?? "")
  if (!account) {
    return null
  }
  const open = requests.find((item) => item.status === "demande")
  const doctor = open ? doctorById(open.doctorId) : undefined

  return (
    <div className="space-y-5">
      <header className="px-1 pt-1">
        <h1 className="text-[2.2rem] leading-[0.95] font-medium tracking-[-0.05em] text-ink sm:text-[2.8rem]">
          {en ? `Hello, ${account.firstName}` : `Bonjour, ${account.firstName}`}
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-ink-soft">
          {en ? "Assistant, doctors, and follow-up. Three steps, clearly separated." : "L'assistant, les médecins et le suivi. Trois étapes, bien séparées."}
        </p>
      </header>

      <section className="relative overflow-hidden rounded-[1.8rem] border border-white/75 bg-white/42 p-6 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.95),0_24px_60px_rgb(48_24_40_/_0.08)] backdrop-blur-2xl sm:p-8">
        <div className="pointer-events-none absolute inset-0" style={{ background: wash }} aria-hidden="true" />
        <div className="relative">
          <p className="text-[13px] text-ink-faint">{en ? "Next step" : "Prochaine étape"}</p>
          {open && doctor ? (
            <>
              <h2 className="mt-3 text-[1.8rem] leading-none font-medium tracking-[-0.045em] sm:text-[2.15rem]">
                {doctor.firstName} {doctor.lastName}
              </h2>
              <p className="mt-3 text-[15px] text-ink-soft">
                {t.specialties[open.specialtyId].name} · {doctor.city} · {windowLabel(open.window, en)}
              </p>
              <a href={`#patient/rendez-vous/${open.id}`} className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#9a4e66] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[#864257]">
                {en ? "View the request" : "Voir la demande"}
                <ArrowRight className="size-4" />
              </a>
            </>
          ) : (
            <>
              <h2 className="mt-3 max-w-[16ch] text-[1.8rem] leading-[1.02] font-medium tracking-[-0.045em] sm:text-[2.2rem]">
                {en ? "Talk with Sehatoka AI" : "Parlez à Sehatoka AI"}
              </h2>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
                {en
                  ? "Describe what brings you. The doctors narrow to the specialty, then to your city."
                  : "Décrivez ce qui vous amène. Les médecins se réduisent à la spécialité, puis à votre ville."}
              </p>
              <a href="#patient/assistant" className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#9a4e66] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[#864257]">
                {en ? "Start" : "Commencer"}
                <ArrowRight className="size-4" />
              </a>
            </>
          )}
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        <Tile href="#patient/assistant" icon={<Sparkles className="size-4" />} label={en ? "Assistant" : "Assistant"} hint={en ? "Describe a need" : "Décrire un besoin"} />
        <Tile href="#patient/medecins" icon={<Stethoscope className="size-4" />} label={en ? "Doctors" : "Médecins"} hint={en ? "Most reviewed first" : "Les plus d'avis d'abord"} />
        <Tile href="#patient/suivi" icon={<FolderHeart className="size-4" />} label={en ? "Follow-up" : "Suivi"} hint={en ? "Documents and notes" : "Documents et notes"} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Quiet href="#patient/documents" title={en ? "Documents" : "Documents"} lines={records.documents.slice(0, 2).map((item) => item.name)} empty={en ? "None saved yet." : "Aucun document pour le moment."} />
        <Quiet href="#patient/ordonnances" title={en ? "Prescriptions" : "Ordonnances"} lines={records.prescriptions.slice(0, 2).map((item) => item.title)} empty={en ? "None saved yet." : "Aucune ordonnance pour le moment."} />
      </div>

      <a href="#patient/rendez-vous" className="inline-flex items-center gap-2 text-[13px] font-medium text-[#7a3a50]">
        <CalendarClock className="size-4" />
        {en ? "Your requests" : "Vos demandes"}
      </a>
    </div>
  )
}

function Tile({ href, label, hint, icon }: { href: string; label: string; hint: string; icon: ReactNode }) {
  return (
    <a href={href} className="rounded-[1.4rem] border border-white/75 bg-white/55 p-4 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.95)] backdrop-blur-xl transition-colors hover:bg-white">
      <span className="grid size-9 place-items-center rounded-2xl bg-[#f6dde4] text-[#7a3a50]">{icon}</span>
      <span className="mt-3 block text-[15px] font-medium tracking-[-0.03em]">{label}</span>
      <span className="mt-1 block text-[12px] text-ink-faint">{hint}</span>
    </a>
  )
}

function Quiet({ href, title, lines, empty }: { href: string; title: string; lines: string[]; empty: string }) {
  return (
    <a href={href} className="block rounded-[1.4rem] border border-white/70 bg-white/40 p-4 backdrop-blur-xl transition-colors hover:bg-white/70">
      <p className="text-[14px] font-medium">{title}</p>
      {lines.length === 0 ? (
        <p className="mt-1 text-[13px] text-ink-soft">{empty}</p>
      ) : (
        <ul className="mt-2 space-y-1">
          {lines.map((line) => (
            <li key={line} className="truncate text-[13px] text-ink-soft">{line}</li>
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
