import type { InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils.ts"

function Input({
  className,
  type = "text",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        "h-12 w-full rounded-full bg-transparent px-4 text-[15px] text-ink placeholder:text-ink-faint outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
