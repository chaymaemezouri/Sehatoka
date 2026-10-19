import { motion, useReducedMotion } from "motion/react"
import { type ReactNode } from "react"
import { cn } from "@/lib/utils.ts"

interface AssistantCardProps {
  children: ReactNode
  className?: string
}

export function AssistantCard({ children, className }: AssistantCardProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={cn(
        "relative flex h-[min(28rem,72svh)] w-full min-h-0 min-w-0 overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/22 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.85),0_24px_60px_rgb(48_24_40_/_0.16)] backdrop-blur-3xl sm:h-[40rem] sm:rounded-[2.25rem] sm:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.85),0_40px_100px_rgb(48_24_40_/_0.16)] lg:h-[44rem]",
        className,
      )}
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
