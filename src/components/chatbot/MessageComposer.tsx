import { Send } from "lucide-react"
import { type FormEvent, useState } from "react"
import { useLocale } from "@/i18n/useLocale.ts"
import { cn } from "@/lib/utils.ts"

interface MessageComposerProps {
  disabled?: boolean
  compact?: boolean
  onSend: (value: string) => void
}

export function MessageComposer({
  disabled = false,
  compact = false,
  onSend,
}: MessageComposerProps) {
  const [value, setValue] = useState("")
  const { t } = useLocale()

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const next = value.trim()
    if (!next) {
      return
    }
    onSend(next)
    setValue("")
  }

  return (
    <form
      onSubmit={submit}
      className={cn(
        "flex items-center gap-1.5 rounded-full border border-white/80 bg-white/55 p-1.5 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.95),0_10px_30px_rgb(40_20_30_/_0.08)] backdrop-blur-xl",
        compact && "p-0.5",
      )}
    >
      <label htmlFor="sehatoka-message" className="sr-only">
        {t.chat.fieldLabel}
      </label>
      <input
        id="sehatoka-message"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={t.chat.placeholder}
        autoComplete="off"
        disabled={disabled}
        maxLength={500}
        className={cn(
          "h-10 min-w-0 flex-1 bg-transparent px-3 text-[13px] text-ink outline-none placeholder:text-ink-faint disabled:opacity-50",
          compact && "h-9 px-2.5 text-[12px]",
        )}
      />
      <button
        type="submit"
        disabled={disabled || value.trim().length === 0}
        aria-label={t.chat.send}
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#161616] text-white transition-colors hover:bg-black disabled:opacity-35"
      >
        <Send className="size-3.5" />
      </button>
    </form>
  )
}
