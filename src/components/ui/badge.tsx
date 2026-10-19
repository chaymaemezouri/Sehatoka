import { cva, type VariantProps } from "class-variance-authority"
import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils.ts"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-[0.04em] uppercase",
  {
    variants: {
      tone: {
        muted: "bg-canvas-warm text-ink-soft",
        emerald: "bg-emerald-soft text-emerald",
        navy: "bg-navy text-canvas-elevated",
        teal: "bg-teal/10 text-teal",
        gold: "bg-gold/12 text-gold",
        danger: "bg-danger-soft text-danger",
        outline: "hairline text-ink-soft",
      },
    },
    defaultVariants: {
      tone: "muted",
    },
  },
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone, className }))} {...props} />
}

export { Badge }
