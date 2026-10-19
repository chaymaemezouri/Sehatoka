import { SpecialtyCard } from "@/components/specialties/SpecialtyCard.tsx"
import { specialties } from "@/data/specialties.ts"
import { useLocale } from "@/i18n/useLocale.ts"

export function SpecialtyGrid() {
  const { t } = useLocale()
  const [featured, ...rest] = specialties
  const primary = rest.slice(0, 3)
  const later = rest.slice(3)

  if (!featured) {
    return null
  }

  return (
    <section id="specialites" className="scroll-mt-20 bg-[#efeeec] py-14 sm:scroll-mt-24 sm:py-20 lg:py-28">
      <div className="px-4 sm:px-6 md:px-12 lg:px-16">
        <h2 className="mx-auto max-w-[16ch] text-center text-[1.7rem] leading-[1.02] font-medium tracking-[-0.04em] text-ink sm:max-w-[14ch] sm:text-[clamp(2.4rem,4.4vw,3.8rem)] sm:leading-[0.98] sm:tracking-[-0.045em]">
          {t.specialtiesTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-center text-[14px] leading-relaxed text-ink-soft sm:mt-4 sm:text-[15px]">
          {t.specialtiesBody}
        </p>

        <div className="mt-8 grid grid-cols-2 items-end gap-3 sm:mt-14 sm:gap-4 lg:grid-cols-4">
          <div className="col-span-2 lg:col-span-1">
            <SpecialtyCard specialty={featured} featured />
          </div>
          {primary.map((specialty) => (
            <SpecialtyCard key={specialty.id} specialty={specialty} />
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-3">
          {later.map((specialty) => (
            <SpecialtyCard key={specialty.id} specialty={specialty} />
          ))}
        </div>
      </div>
    </section>
  )
}
