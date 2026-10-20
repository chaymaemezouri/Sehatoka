import { ArrowUpRight, ShieldAlert } from "lucide-react"
import { useLocale } from "@/i18n/useLocale.ts"
import { cn } from "@/lib/utils.ts"
import type { Recommendation } from "@/types/chat.ts"

interface SpecialtyRecommendationProps {
  recommendation: Recommendation
  compact?: boolean
  onBook?: () => void
}

export function SpecialtyRecommendation({
  recommendation,
  compact = false,
  onBook,
}: SpecialtyRecommendationProps) {
  const { t } = useLocale()
  const isUrgent = recommendation.urgency === "urgent"
  const specialtyLabel = recommendation.specialtyId
    ? t.specialties[recommendation.specialtyId].name
    : recommendation.specialtyName

  const hasActions = Boolean((!isUrgent && onBook) || (recommendation.ctaHref && recommendation.ctaLabel))

  return (
    <div
      className={cn(
        "mt-3 w-full overflow-hidden rounded-[1.35rem] border border-white/75 bg-white/48 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.95)] backdrop-blur-2xl",
        isUrgent && "border-danger/20 bg-danger-soft/85",
      )}
    >
      <div className={cn("px-4 pt-4", hasActions ? "pb-3" : "pb-4", compact && "px-3 pt-3")}>
        <p className="text-[10px] font-medium tracking-[0.18em] text-ink-faint uppercase">
          {isUrgent ? t.chat.emergency : t.chat.orientation}
        </p>
        <p
          className={cn(
            "mt-1.5 font-medium tracking-[-0.04em] text-ink",
            compact ? "text-[1.05rem]" : "text-[1.35rem] leading-none",
          )}
        >
          {isUrgent ? (
            <span className="inline-flex items-center gap-2">
              <ShieldAlert className="size-4 text-danger" />
              {specialtyLabel}
            </span>
          ) : (
            specialtyLabel
          )}
        </p>
        <p className={cn("mt-2 leading-relaxed text-ink-soft", compact ? "text-[11px]" : "text-[13px]")}>
          {recommendation.rationale}
        </p>
      </div>

      {hasActions ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-black/10 px-4 py-3">
          {!isUrgent && onBook ? (
            <button
              type="button"
              onClick={onBook}
              className="inline-flex h-9 items-center rounded-full bg-[#161616] px-4 text-[13px] font-medium text-white transition-colors hover:bg-black"
            >
              {t.chat.book}
            </button>
          ) : null}
          {recommendation.ctaHref && recommendation.ctaLabel ? (
            <a
              href={recommendation.ctaHref}
              target={recommendation.ctaHref.startsWith("#") ? undefined : "_blank"}
              rel={recommendation.ctaHref.startsWith("#") ? undefined : "noopener noreferrer"}
              className="inline-flex items-center gap-1 text-[13px] font-medium text-ink transition-opacity hover:opacity-70"
            >
              {recommendation.ctaLabel}
              <ArrowUpRight className="size-3.5" />
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
