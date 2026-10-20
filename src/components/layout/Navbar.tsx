import { LogOut } from "lucide-react"
import { useState } from "react"
import { AccountSwipe } from "@/components/auth/AccountSwipe.tsx"
import { useLocale } from "@/i18n/useLocale.ts"
import { useAuth } from "@/lib/auth/useAuth.ts"
import { useScrolled } from "@/hooks/useScrolled.ts"
import { cn } from "@/lib/utils.ts"

export function Navbar() {
  const pastHero = useScrolled(typeof window === "undefined" ? 640 : window.innerHeight * 0.72)
  const { locale, setLocale, t } = useLocale()
  const { account, logout } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background,backdrop-filter,border-color] duration-300",
        pastHero
          ? "border-b border-black/6 bg-[#efeeec]/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="relative flex h-14 w-full items-center justify-between px-4 sm:h-16 sm:px-6 md:px-12 lg:pr-48 lg:pl-16">
        <a
          href="#accueil"
          className={cn(
            "relative z-10 text-[15px] font-medium tracking-[-0.03em]",
            pastHero ? "text-ink" : "text-white",
          )}
        >
          Sehatoka
        </a>

        <AccountSwipe />

        <div className="relative z-10 flex items-center gap-2">
          {account ? (
            <div className="relative">
              <button
                type="button"
                aria-expanded={open}
                aria-label={t.patientSpace}
                onClick={() => setOpen((value) => !value)}
                className="inline-flex h-9 items-center gap-2 rounded-full bg-[#161616] pr-3 pl-1 text-[13px] font-medium text-white"
              >
                <span className="grid size-7 place-items-center rounded-full bg-white/15 text-[11px]">
                  {`${account.firstName[0] ?? ""}${account.lastName[0] ?? ""}`.toUpperCase()}
                </span>
                <span className="max-w-20 truncate">{account.firstName}</span>
              </button>
              {open ? (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-black/10 bg-white p-1 text-ink shadow-[var(--shadow-soft)]">
                  <a href="#patient" className="block rounded-xl px-3 py-2 text-[13px] hover:bg-canvas">{t.patientSpace}</a>
                  <a href="#patient/profil" className="block rounded-xl px-3 py-2 text-[13px] hover:bg-canvas">{locale === "en" ? "Profile" : "Profil"}</a>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[13px] hover:bg-canvas"
                    onClick={() => void logout().then(() => { window.location.hash = "#accueil" })}
                  >
                    <LogOut className="size-3.5" />
                    {t.logout}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <a
                href="#connexion"
                className={cn(
                  "inline-flex h-9 items-center rounded-full px-3 text-[13px] font-medium min-[880px]:hidden",
                  pastHero ? "bg-navy text-white" : "border border-white/45 bg-white/10 text-white",
                )}
              >
                {t.signIn}
              </a>
              <a
                href="#inscription"
                className={cn(
                  "hidden h-9 items-center text-[13px] font-medium sm:inline-flex",
                  pastHero ? "text-ink" : "text-white",
                )}
              >
                {t.register}
              </a>
            </>
          )}
          <div
            className={cn(
              "flex items-center rounded-full border p-0.5 text-[12px] font-medium",
              pastHero ? "border-black/10 bg-white/70" : "border-white/40 bg-white/10 backdrop-blur-md",
            )}
          >
            {(["fr", "en"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLocale(item)}
                className={cn(
                  "h-7 rounded-full px-2 text-[11px] uppercase transition-colors sm:px-2.5 sm:text-[12px]",
                  locale === item
                    ? pastHero
                      ? "bg-ink text-white"
                      : "bg-white text-ink"
                    : pastHero
                      ? "text-ink-soft hover:text-ink"
                      : "text-white/75 hover:text-white",
                )}
                aria-pressed={locale === item}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
