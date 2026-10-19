import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import type { ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils.ts"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] transition-colors duration-200 disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4",
  {
    variants: {
      variant: {
        primary:
          "bg-navy text-canvas-elevated shadow-[0_10px_24px_rgb(12_21_38_/_0.16)] hover:bg-navy-mid",
        emerald:
          "bg-emerald text-white shadow-[0_10px_24px_rgb(13_122_92_/_0.22)] hover:bg-emerald-bright",
        outline:
          "hairline bg-transparent text-ink hover:bg-navy/[0.04]",
        ghost: "text-ink-soft hover:bg-navy/[0.05] hover:text-ink",
        navy: "bg-navy-mid text-canvas-elevated hover:bg-navy",
        light:
          "bg-white text-navy shadow-[0_12px_30px_rgb(0_0_0_/_0.18)] hover:bg-white/92",
        glass:
          "bg-white/8 text-white ring-1 ring-white/20 hover:bg-white/14",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-[15px]",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button }
