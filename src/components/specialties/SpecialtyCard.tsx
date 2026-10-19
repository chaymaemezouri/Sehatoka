import { ArrowUpRight } from "lucide-react"
import { useLocale } from "@/i18n/useLocale.ts"
import { cn } from "@/lib/utils.ts"
import type { Specialty, SpecialtyId } from "@/types/specialty.ts"

const washes: Record<SpecialtyId, string> = {
  ophthalmology:
    "linear-gradient(165deg, #cbb6dc 0%, #e4b39a 48%, #7fadd4 100%)",
  cardiology: "linear-gradient(180deg, #f0c7b6 0%, #c47d74 100%)",
  dermatology: "linear-gradient(180deg, #e4d2c2 0%, #b49678 100%)",
  pediatrics: "linear-gradient(180deg, #d5e0ee 0%, #7f9ec4 100%)",
  "general-medicine": "linear-gradient(180deg, #ddd4ea 0%, #9a86b8 100%)",
  gynecology: "linear-gradient(180deg, #f0d0c8 0%, #c98b96 100%)",
  psychiatry: "linear-gradient(180deg, #d7d3e6 0%, #8d86b0 100%)",
}

const art: Partial<Record<SpecialtyId, string>> = {
  cardiology: "/heart-card.png",
  dermatology: "/dermatologie-card.png",
  pediatrics: "/pediatrics-card.png",
}

interface SpecialtyCardProps {
  specialty: Specialty
  featured?: boolean
}

export function SpecialtyCard({ specialty, featured = false }: SpecialtyCardProps) {
  const { t } = useLocale()
  const label = t.specialties[specialty.id]

  return (
    <article
      className={cn(
        "relative flex min-h-[13.5rem] flex-col justify-end overflow-hidden rounded-[1.2rem] p-3.5 text-white sm:min-h-[26rem] sm:rounded-[1.7rem] sm:p-6",
        featured && "min-h-[16rem] sm:min-h-[32rem] lg:min-h-[36rem]",
        
      )}
    >
      <div
        className="absolute inset-0"
        style={{ background: washes[specialty.id] }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-black/0" />
      {art[specialty.id] ? (
        <img
          src={art[specialty.id]}
          alt=""
          className="pointer-events-none absolute top-1 left-1/2 h-[48%] w-[78%] -translate-x-1/2 object-contain drop-shadow-[0_0_18px_rgba(255,255,255,0.45)] sm:top-2 sm:h-[70%] sm:w-[94%]"
        />
      ) : null}

      <div className="relative z-10">
        {featured ? (
          <p className="max-w-[18ch] text-[1.15rem] font-medium leading-[1.15] tracking-[-0.03em] sm:max-w-[16ch] sm:text-[1.45rem] lg:text-[1.7rem]">
            {t.featuredQuote}
          </p>
        ) : null}
        <div className={cn(featured && "mt-4 sm:mt-8")}>
          <h3 className="text-[1.02rem] font-medium tracking-[-0.03em] sm:text-[1.35rem]">
            {specialty.moduleName ?? label.name}
          </h3>
          <p className="mt-0.5 text-[11px] text-white/80 sm:mt-1 sm:text-[13px]">{label.field}</p>
        </div>
        {specialty.href ? (
          <a
            href={specialty.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 rounded-full border border-white/50 bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur-md transition-colors hover:bg-white/25 sm:mt-4 sm:gap-1.5 sm:px-3.5 sm:py-1.5 sm:text-[13px]"
          >
            {t.accessOphtho}
            <ArrowUpRight className="size-3.5" />
          </a>
        ) : (
          <a
            href={`#${specialty.id}`}
            onClick={(event) => event.preventDefault()}
            className="mt-3 inline-flex max-w-full items-center gap-1 rounded-full border border-white/50 bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur-md transition-colors hover:bg-white/25 sm:mt-4 sm:gap-1.5 sm:px-3.5 sm:py-1.5 sm:text-[13px]"
          >
            {label.name}
            <ArrowUpRight className="size-3.5" />
          </a>
        )}
      </div>
    </article>
  )
}
