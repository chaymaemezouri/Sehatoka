import { Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button.tsx"
import { useLocale } from "@/i18n/useLocale.ts"
import { useScrolled } from "@/hooks/useScrolled.ts"
import { cn } from "@/lib/utils.ts"

export function Navbar() {
  const pastHero = useScrolled(typeof window === "undefined" ? 640 : window.innerHeight * 0.72)
  const [open, setOpen] = useState(false)
  const solid = pastHero || open
  const { locale, setLocale, t } = useLocale()

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const close = () => setOpen(false)

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background,backdrop-filter,border-color] duration-300",
        solid
          ? "border-b border-black/6 bg-[#efeeec]/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="relative flex h-14 w-full items-center justify-between px-4 sm:h-16 sm:px-6 md:px-12 lg:px-16">
        <a
          href="#accueil"
          className={cn(
            "relative z-10 text-[15px] font-medium tracking-[-0.03em]",
            solid ? "text-ink" : "text-white",
          )}
        >
          Sehatoka
        </a>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 lg:flex"
          aria-label={t.navLabel}
        >
          {t.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "text-[14px] transition-colors",
                solid ? "text-ink-soft hover:text-ink" : "text-white/75 hover:text-white",
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="relative z-10 flex items-center gap-2">
          <div
            className={cn(
              "flex items-center rounded-full border p-0.5 text-[12px] font-medium",
              solid ? "border-black/10 bg-white/70" : "border-white/40 bg-white/10 backdrop-blur-md",
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
                    ? solid
                      ? "bg-ink text-white"
                      : "bg-white text-ink"
                    : solid
                      ? "text-ink-soft hover:text-ink"
                      : "text-white/75 hover:text-white",
                )}
                aria-pressed={locale === item}
              >
                {item}
              </button>
            ))}
          </div>
          <a
            href="#ia"
            className={cn(
              "hidden h-9 items-center rounded-full px-4 text-[13px] font-medium transition-colors sm:inline-flex",
              solid
                ? "bg-navy text-white hover:bg-navy-mid"
                : "border border-white/45 bg-white/10 text-white backdrop-blur-md hover:bg-white/18",
            )}
          >
            Sehatoka AI
          </a>
          <button
            type="button"
            className={cn(
              "flex size-10 items-center justify-center rounded-full lg:hidden",
              solid ? "text-ink" : "text-white",
            )}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.menuClose : t.menuOpen}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-black/6 bg-[#efeeec] lg:hidden">
          <nav className="flex flex-col gap-1 px-5 py-4" aria-label={t.navLabel}>
            {t.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={close}
                className="rounded-2xl px-3 py-3 text-[15px] text-ink hover:bg-black/4"
              >
                {item.label}
              </a>
            ))}
            <Button asChild variant="primary" className="mt-2 w-full">
              <a href="#ia" onClick={close}>
                {t.discoverAi}
              </a>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
