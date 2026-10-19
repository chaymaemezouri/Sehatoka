import { useLocale } from "@/i18n/useLocale.ts"

export function TrustSection() {
  const { t } = useLocale()
  return (
    <section id="comment-ca-marche" className="scroll-mt-20 bg-[#efeeec] py-14 sm:scroll-mt-24 sm:py-24 lg:py-32">
      <div className="px-4 sm:px-6 md:px-12 lg:px-16">
        <h2 className="max-w-[18ch] text-[1.7rem] leading-[1.02] font-medium tracking-[-0.04em] text-ink sm:max-w-[16ch] sm:text-[clamp(2.5rem,4.6vw,4.4rem)] sm:leading-[0.95] sm:tracking-[-0.045em]">
          {t.trustTitle}
        </h2>

        <div className="mt-8 grid gap-8 sm:mt-16 sm:gap-12 md:grid-cols-3">
          {t.pillars.map((pillar, index) => (
            <article key={pillar.title}>
              <p className="text-[13px] text-ink-faint">0{index + 1}</p>
              <h3 className="mt-2 text-[1.25rem] font-medium tracking-[-0.03em] text-ink sm:mt-3 sm:text-[1.7rem]">
                {pillar.title}
              </h3>
              <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-ink-soft">
                {pillar.body}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-8 border-t border-black/10 pt-8 sm:mt-16 sm:gap-10 sm:pt-12 md:grid-cols-2">
          {t.commitments.map((item) => (
            <article key={item.title}>
              <h3 className="text-[1.15rem] font-medium tracking-[-0.02em] text-ink">
                {item.title}
              </h3>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
