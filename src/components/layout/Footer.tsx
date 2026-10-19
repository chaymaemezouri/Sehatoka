import { specialties } from "@/data/specialties.ts"
import { useLocale } from "@/i18n/useLocale.ts"

const copyrightYear = new Date().getFullYear()

const atmosphere = [
  "radial-gradient(46% 60% at 8% 0%, #f2c2d4 0%, transparent 64%)",
  "radial-gradient(40% 55% at 96% 12%, #9eb6ef 0%, transparent 66%)",
  "radial-gradient(58% 72% at 70% 100%, #ee9d86 0%, transparent 70%)",
  "linear-gradient(180deg, #f4eaf0 0%, #f6e4ea 38%, #eadcf2 100%)",
].join(",")

export function Footer() {
  const { t } = useLocale()
  return (
    <footer className="relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: atmosphere }} aria-hidden="true" />
      <div className="relative z-10 px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-0 md:px-12 lg:px-16">
        <div className="grid gap-8 border-t border-black/10 pt-8 sm:gap-10 sm:pt-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <p className="max-w-sm text-[15px] leading-relaxed text-ink-soft">
            {t.footerBody}
          </p>

          <ul className="space-y-2.5">
            {t.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-[15px] text-ink-soft transition-colors hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <ul className="space-y-2.5">
            {specialties.map((specialty) => (
              <li key={specialty.id}>
                {specialty.href ? (
                  <a
                    href={specialty.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] font-medium text-ink transition-opacity hover:opacity-60"
                  >
                    {t.accessOphtho}
                  </a>
                ) : (
                  <a
                    href={`#${specialty.id}`}
                    onClick={(event) => event.preventDefault()}
                    className="text-[15px] text-ink-soft transition-colors hover:text-ink"
                  >
                    {t.specialties[specialty.id].name}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-2 text-[12px] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {copyrightYear} Sehatoka. {t.rights}
          </p>
          <p>{t.footerNote}</p>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="pointer-events-none relative z-0 -mb-[0.18em] px-4 text-[17vw] leading-[0.8] font-medium tracking-[-0.07em] text-[#3a2c44]/[0.12] select-none sm:px-6 sm:text-[22vw] md:px-12 lg:px-16"
      >
        Sehatoka
      </p>
    </footer>
  )
}
