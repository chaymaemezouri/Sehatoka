import { ArrowUpRight } from "lucide-react"
import { carePlaces } from "@/data/places.ts"
import { useLocale } from "@/i18n/useLocale.ts"

export function CareStructures() {
  const { t } = useLocale()
  return (
    <section id="cabinets" className="scroll-mt-20 bg-[#efeeec] py-14 sm:scroll-mt-24 sm:py-24 lg:py-32">
      <div className="px-4 sm:px-6 md:px-12 lg:px-16">
        <p className="text-[11px] font-medium tracking-[0.16em] text-ink-faint uppercase sm:text-[12px] sm:tracking-[0.18em]">
          {t.structuresKicker}
        </p>
        <h2 className="mt-3 max-w-[18ch] text-[1.7rem] leading-[1.02] font-medium tracking-[-0.04em] text-ink sm:mt-4 sm:max-w-[14ch] sm:text-[clamp(2.5rem,4.6vw,4.2rem)] sm:leading-[0.96] sm:tracking-[-0.045em]">
          {t.structuresTitle}
        </h2>
        <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-ink-soft sm:mt-5 sm:text-[15px]">
          {t.structuresBody}
        </p>

        <div className="mt-8 grid gap-3 sm:mt-14 sm:gap-4 lg:grid-cols-3">
          {carePlaces.map((place) => (
            <article
              key={place.id}
              className="relative flex min-h-[13.5rem] flex-col justify-end overflow-hidden rounded-[1.25rem] p-4 text-white sm:min-h-[24rem] sm:rounded-[1.7rem] sm:p-6"
            >
              <div
                className="absolute inset-0"
                style={{ background: place.wash }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent" />
              <div className="relative">
                <p className="text-[12px] text-white/75">{t.places[place.id].field}</p>
                <h3 className="mt-1 text-[1.35rem] font-medium tracking-[-0.04em] sm:text-[1.7rem]">
                  {t.places[place.id].name}
                </h3>
                <p className="mt-2 max-w-[28ch] text-[14px] leading-relaxed text-white/80">
                  {t.places[place.id].summary}
                </p>
                <a
                  href={`#${place.id}`}
                  onClick={(event) => event.preventDefault()}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-white/15 px-3.5 py-1.5 text-[13px] font-medium backdrop-blur-md transition-colors hover:bg-white/25"
                >
                  {t.places[place.id].name}
                  <ArrowUpRight className="size-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
