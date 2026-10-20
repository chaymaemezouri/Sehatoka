import {
  Bell,
  CalendarClock,
  FolderHeart,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Sparkles,
  Stethoscope,
  X,
} from "lucide-react"
import { useEffect, useState, type FormEvent, type ReactNode } from "react"
import { useLocale } from "@/i18n/useLocale.ts"
import { useAuth } from "@/lib/auth/useAuth.ts"
import { useNotices } from "@/lib/patient/useCare.ts"
import { NotificationsPage, PaymentsPage, PrivacyPage, ProfilePage, SettingsPage } from "@/patient/AccountPages.tsx"
import { AssistantPatient } from "@/patient/AssistantPatient.tsx"
import { AppointmentsPage } from "@/patient/Appointments.tsx"
import { DoctorsPage } from "@/patient/Doctors.tsx"
import { HealthRecordsPage } from "@/patient/HealthPages.tsx"
import { DocumentsPage, LabsPage, PrescriptionsPage } from "@/patient/Records.tsx"
import { FollowUpPage } from "@/patient/FollowUp.tsx"
import { Overview } from "@/patient/Overview.tsx"
import { cn } from "@/lib/utils.ts"

const atmosphere = [
  "radial-gradient(42% 46% at 8% 0%, #f2c2d4 0%, transparent 62%)",
  "radial-gradient(38% 42% at 96% 8%, #9eb6ef 0%, transparent 60%)",
  "radial-gradient(46% 50% at 88% 100%, #ee9d86 0%, transparent 64%)",
  "linear-gradient(165deg, #f6eef3 0%, #f7ece6 46%, #e7ebf8 100%)",
].join(",")

export function PatientPortal({ path, params }: { path: string; params: URLSearchParams }) {
  const { locale } = useLocale()
  const auth = useAuth()
  const notices = useNotices(auth.account?.id ?? "", locale)
  const [menu, setMenu] = useState(false)
  const [accountMenu, setAccountMenu] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [step, setStep] = useState(0)
  const [seenPath, setSeenPath] = useState(path)
  const en = locale === "en"
  if (seenPath !== path) {
    setSeenPath(path)
    setMenu(false)
    setAccountMenu(false)
  }
  const unread = auth.account?.notifyInApp ? notices.filter((item) => item.unread).length : 0

  useEffect(() => {
    if (!auth.ready || auth.account) {
      return
    }
    const hash = window.location.hash || "#patient"
    if (!hash.startsWith("#patient")) {
      return
    }
    window.location.hash = `#connexion?next=${encodeURIComponent(hash)}`
  }, [auth.account, auth.ready])

  if (!auth.ready) {
    return <div className="min-h-svh bg-canvas" />
  }
  if (!auth.account) {
    return null
  }

  const account = auth.account
  const initials = `${account.firstName[0] ?? ""}${account.lastName[0] ?? ""}`.toUpperCase()
  const items = navItems(en)
  const current = items.find((item) => isActive(path, item))

  return (
    <div className="relative min-h-svh text-ink">
      <div className="pointer-events-none absolute inset-0" style={{ background: atmosphere }} aria-hidden="true" />
      <aside className={cn("fixed top-3 bottom-3 left-3 z-30 hidden flex-col overflow-hidden rounded-[1.8rem] border border-white/75 bg-white/42 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.95),0_18px_50px_rgb(48_24_40_/_0.08)] backdrop-blur-2xl lg:flex", collapsed ? "w-[4.75rem]" : "w-[15.25rem]")}>
        <Sidebar en={en} path={path} collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
      </aside>
      {menu ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" className="absolute inset-0 bg-[#140f18]/25" aria-label={en ? "Close menu" : "Fermer le menu"} onClick={() => setMenu(false)} />
          <aside className="relative flex h-full w-72 flex-col border-r border-white/70 bg-white/72 backdrop-blur-2xl">
            <Sidebar en={en} path={path} collapsed={false} onNavigate={() => setMenu(false)} />
          </aside>
        </div>
      ) : null}
      <div className={cn("relative min-h-svh", collapsed ? "lg:pl-[6.4rem]" : "lg:pl-[17rem]")}>
        <header className="sticky top-0 z-20 px-3 pt-3 sm:px-4">
          <div className="flex h-14 items-center gap-3 rounded-full border border-white/75 bg-white/48 px-3 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.95),0_12px_30px_rgb(48_24_40_/_0.06)] backdrop-blur-2xl">
            <button type="button" className="grid size-9 place-items-center rounded-full bg-white/70 lg:hidden" onClick={() => setMenu(true)} aria-label={en ? "Open menu" : "Ouvrir le menu"}>
              <Menu className="size-4" />
            </button>
            <p className="min-w-0 flex-1 truncate text-[14px] font-medium tracking-[-0.03em] lg:hidden">
              {current?.label ?? "Sehatoka"}
            </p>
            <div className="ml-auto hidden lg:block" />
            <form
              className="hidden items-center md:flex"
              onSubmit={(event: FormEvent<HTMLFormElement>) => {
                event.preventDefault()
                const query = String(new FormData(event.currentTarget).get("q") ?? "").trim()
                window.location.hash = query ? `#patient/medecins?q=${encodeURIComponent(query)}` : "#patient/medecins"
              }}
            >
              <label className="relative">
                <span className="sr-only">{en ? "Search doctors" : "Rechercher un médecin"}</span>
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint" />
                <input name="q" placeholder={en ? "Search a doctor" : "Rechercher un médecin"} className="h-9 w-56 rounded-full border border-white/80 bg-white/70 pr-3 pl-9 text-[13px] outline-none" />
              </label>
            </form>
            <a href="#patient/rendez-vous/nouveau" className="hidden h-10 items-center rounded-full bg-[#9a4e66] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#864257] sm:inline-flex">
              {en ? "Request" : "Demande"}
            </a>
            <a href="#patient/notifications" className="relative grid size-9 place-items-center rounded-full bg-white/70" aria-label={en ? "Notifications" : "Notifications"}>
              <Bell className="size-4" />
              {unread > 0 ? <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-emerald" /> : null}
            </a>
            <div className="relative">
              <button type="button" className="inline-flex h-9 items-center gap-2 rounded-full border border-white/80 bg-white/75 pr-3 pl-1 text-ink" aria-expanded={accountMenu} onClick={() => setAccountMenu((value) => !value)}>
                <span className="grid size-8 place-items-center rounded-full bg-[#f3d5df] text-[11px] text-[#7a3a50]">{initials}</span>
                <span className="hidden max-w-24 truncate text-[13px] sm:block">{account.firstName}</span>
              </button>
              {accountMenu ? (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-black/10 bg-white p-1 shadow-[var(--shadow-soft)]">
                  <MenuLink href="#patient/profil">{en ? "Profile" : "Profil"}</MenuLink>
                  <MenuLink href="#patient/notifications">{en ? "Notifications" : "Notifications"}</MenuLink>
                  <MenuLink href="#patient/paiements">{en ? "Payments" : "Paiements"}</MenuLink>
                  <MenuLink href="#patient/confidentialite">{en ? "Privacy" : "Confidentialité"}</MenuLink>
                  <MenuLink href="#patient/reglages">{en ? "Settings" : "Réglages"}</MenuLink>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[13px] hover:bg-canvas"
                    onClick={() => void auth.logout().then(() => { window.location.hash = "#accueil" })}
                  >
                    <LogOut className="size-4" />
                    {en ? "Log out" : "Déconnexion"}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-3 py-6 sm:px-5">
          <Page path={path} params={params} />
        </main>
      </div>
      {!account.onboarded ? (
        <Onboarding
          en={en}
          name={account.firstName}
          step={step}
          onStep={setStep}
          onClose={() => void auth.updateProfile({ onboarded: true })}
        />
      ) : null}
    </div>
  )
}

function Page({ path, params }: { path: string; params: URLSearchParams }) {
  if (path === "patient") {
    return <Overview />
  }
  if (path === "patient/assistant") {
    return <AssistantPatient />
  }
  if (path === "patient/medecins" || path.startsWith("patient/medecins/")) {
    return <DoctorsPage path={path} params={params} />
  }
  if (path === "patient/rendez-vous" || path.startsWith("patient/rendez-vous/")) {
    return <AppointmentsPage path={path} params={params} />
  }
  if (path === "patient/suivi") {
    return <FollowUpPage />
  }
  if (path === "patient/dossier") {
    return <HealthRecordsPage />
  }
  if (path === "patient/ordonnances") {
    return <PrescriptionsPage />
  }
  if (path === "patient/analyses") {
    return <LabsPage />
  }
  if (path === "patient/documents") {
    return <DocumentsPage />
  }
  if (path === "patient/notifications") {
    return <NotificationsPage />
  }
  if (path === "patient/paiements") {
    return <PaymentsPage />
  }
  if (path === "patient/profil") {
    return <ProfilePage />
  }
  if (path === "patient/confidentialite") {
    return <PrivacyPage />
  }
  if (path === "patient/reglages") {
    return <SettingsPage />
  }
  return <p className="text-[14px] text-ink-soft">Cette page n'existe pas.</p>
}

function Sidebar({
  en,
  path,
  collapsed,
  onToggle,
  onNavigate,
}: {
  en: boolean
  path: string
  collapsed: boolean
  onToggle?: () => void
  onNavigate?: () => void
}) {
  return (
    <>
      <div className="flex h-16 items-center justify-between px-4">
        <a href="#accueil" className={cn("font-medium tracking-[-0.03em]", collapsed && "sr-only")}>Sehatoka</a>
        {onToggle ? (
          <button type="button" onClick={onToggle} className="grid size-8 place-items-center rounded-full text-ink-soft hover:bg-white/70" aria-label={en ? "Collapse menu" : "Réduire le menu"}>
            {collapsed ? <Menu className="size-4" /> : <X className="size-4" />}
          </button>
        ) : null}
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6">
        {navItems(en).map((item) => {
          const active = isActive(path, item)
          const Icon = item.icon
          return (
            <a
              key={item.path}
              href={item.href}
              title={item.label}
              onClick={onNavigate}
              className={cn(
                "flex h-11 items-center gap-2.5 rounded-2xl px-3 text-[14px] font-medium",
                active ? "bg-[#f6dde4] text-[#7a3a50]" : "text-ink-soft hover:bg-white/70 hover:text-ink",
                collapsed && "justify-center px-0",
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="size-4 shrink-0" />
              <span className={cn(collapsed && "sr-only")}>{item.label}</span>
            </a>
          )
        })}
      </nav>
    </>
  )
}

function MenuLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} className="block rounded-xl px-3 py-2 text-[13px] hover:bg-canvas">{children}</a>
}

function Onboarding({
  en,
  name,
  step,
  onStep,
  onClose,
}: {
  en: boolean
  name: string
  step: number
  onStep: (step: number) => void
  onClose: () => void
}) {
  const steps = en
    ? [
        `Welcome, ${name}. Your Sehatoka space brings guidance, doctors, and your requests together.`,
        "Complete your profile whenever you wish: city, emergency contact, and the details that matter to you.",
        "Choose how Sehatoka keeps you informed about your requests.",
        "The assistant guides you to the right specialty, then to the doctors who match.",
      ]
    : [
        `Bienvenue, ${name}. Votre espace Sehatoka réunit l'orientation, les médecins et le suivi de vos demandes.`,
        "Complétez votre profil quand vous le souhaitez : ville, contact d'urgence, et les informations qui vous sont utiles.",
        "Choisissez comment Sehatoka vous informe du suivi de vos demandes.",
        "L'assistant vous oriente vers la spécialité adaptée, puis vers les médecins correspondants.",
      ]
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-navy/25 p-4 sm:place-items-center" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <div className="w-full max-w-md rounded-[1.6rem] bg-canvas-elevated p-6 shadow-[var(--shadow-soft)]">
        <p className="text-[12px] text-ink-faint">{step + 1} / {steps.length}</p>
        <h2 id="welcome-title" className="mt-2 text-[1.4rem] font-medium tracking-[-0.04em]">{en ? "Your space" : "Votre espace"}</h2>
        <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">{steps[step]}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {step < steps.length - 1 ? (
            <button type="button" onClick={() => onStep(step + 1)} className="h-10 rounded-full bg-[#9a4e66] px-4 text-[13px] font-medium text-white">{en ? "Continue" : "Continuer"}</button>
          ) : (
            <a href="#patient/assistant" onClick={onClose} className="inline-flex h-10 items-center rounded-full bg-[#9a4e66] px-4 text-[13px] font-medium text-white">{en ? "Open the assistant" : "Ouvrir l'assistant"}</a>
          )}
          <button type="button" onClick={onClose} className="h-10 rounded-full px-4 text-[13px] font-medium text-ink-soft">{en ? "Skip" : "Passer"}</button>
        </div>
      </div>
    </div>
  )
}

function isActive(path: string, item: { path: string; also?: string[] }) {
  if (item.path === "patient") {
    return path === "patient"
  }
  const names = [item.path, ...(item.also ?? [])]
  return names.some((name) => path === name || path.startsWith(`${name}/`))
}

function navItems(en: boolean) {
  return [
    { href: "#patient", path: "patient", label: en ? "Home" : "Accueil", icon: LayoutDashboard },
    { href: "#patient/assistant", path: "patient/assistant", label: en ? "Assistant" : "Assistant", icon: Sparkles },
    { href: "#patient/medecins", path: "patient/medecins", label: en ? "Doctors" : "Médecins", icon: Stethoscope },
    { href: "#patient/rendez-vous", path: "patient/rendez-vous", label: en ? "Requests" : "Demandes", icon: CalendarClock },
    {
      href: "#patient/suivi",
      path: "patient/suivi",
      label: en ? "Follow-up" : "Suivi",
      icon: FolderHeart,
      also: ["patient/documents", "patient/ordonnances", "patient/analyses", "patient/dossier"],
    },
  ]
}
