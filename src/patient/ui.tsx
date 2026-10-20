import type { ReactNode } from "react"
import { cn } from "@/lib/utils.ts"

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-[1.6rem] border border-white/75 bg-white/52 p-5 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.95),0_18px_44px_rgb(48_24_40_/_0.06)] backdrop-blur-2xl", className)}>
      {children}
    </section>
  )
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/70 bg-white/35 px-5 py-8 backdrop-blur-xl">
      <p className="text-[15px] font-medium tracking-[-0.02em] text-ink">{title}</p>
      <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-ink-soft">{body}</p>
    </div>
  )
}

export function StatusPill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "warn" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium",
        tone === "warn" ? "bg-canvas-warm text-ink-soft" : "bg-emerald-soft text-emerald",
      )}
    >
      {children}
    </span>
  )
}

export const fieldClass =
  "mt-1.5 h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-[14px] text-ink outline-none focus-visible:ring-2 focus-visible:ring-navy/20"

export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-[12px] font-medium text-ink-soft">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-[12px] text-danger">{error}</span> : null}
    </label>
  )
}

export function QuietLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="text-[13px] font-medium text-ink underline-offset-4 hover:underline">
      {children}
    </a>
  )
}
