import { Maximize2, RotateCcw } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useEffect, useRef } from "react"
import { ChatMessage } from "@/components/chatbot/ChatMessage.tsx"
import { MessageComposer } from "@/components/chatbot/MessageComposer.tsx"
import { TypingIndicator } from "@/components/chatbot/TypingIndicator.tsx"
import { site } from "@/data/site.ts"
import { useChat } from "@/hooks/useChat.ts"
import { useLocale } from "@/i18n/useLocale.ts"

interface ChatPanelProps {
  expandHref?: string
  chat?: ReturnType<typeof useChat>
  promptLimit?: number
}

export function ChatPanel({ expandHref, chat: externalChat, promptLimit }: ChatPanelProps) {
  const reduceMotion = useReducedMotion()
  const { t } = useLocale()
  const localChat = useChat()
  const { messages, isTyping, error, send, reset, restoreExample, isExample } =
    externalChat ?? localChat
  const prompts = t.prompts.slice(0, promptLimit ?? t.prompts.length)
  const shown = isExample ? t.example : messages.filter((message) => !message.isExample)
  const askAppointment = () => {
    void send(t.chat.bookMessage)
  }
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = listRef.current
    if (!node) {
      return
    }
    node.scrollTo({
      top: node.scrollHeight,
      behavior: reduceMotion ? "auto" : "smooth",
    })
  }, [shown, isTyping, reduceMotion])

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-transparent">
      <header className="flex shrink-0 items-center justify-between px-4 pt-4 pb-3 sm:px-6 sm:pt-5 sm:pb-4">
        <div className="min-w-0">
          <h2
            id="chat-title"
            className="text-[18px] font-medium tracking-[-0.04em] text-ink"
          >
            {site.product}
          </h2>
          <p className="mt-1 flex items-center gap-1.5 text-[12px] text-ink-faint">
            <span className="size-1.5 rounded-full bg-emerald" />
            {t.chat.status}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {expandHref ? (
            <a
              href={expandHref}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/70 bg-white/40 px-3 text-[12px] font-medium text-ink shadow-[inset_0_1px_0_rgb(255_255_255_/_0.9)] backdrop-blur-xl transition-colors hover:bg-white/70"
              aria-label={t.chat.fullscreenLabel}
            >
              <Maximize2 className="size-3.5" />
              <span className="hidden sm:inline">{t.chat.fullscreen}</span>
            </a>
          ) : null}
          <button
            type="button"
            onClick={isExample ? reset : restoreExample}
            className="flex size-9 items-center justify-center rounded-full border border-white/70 bg-white/40 text-ink shadow-[inset_0_1px_0_rgb(255_255_255_/_0.9)] backdrop-blur-xl transition-colors hover:bg-white/70"
            aria-label={isExample ? t.chat.newChat : t.chat.restore}
          >
            <RotateCcw className="size-3.5" />
          </button>
        </div>
      </header>

      <div
        ref={listRef}
        className="chat-scroll min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-2 sm:px-5"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        <AnimatePresence initial={false}>
          {shown.map((message) => (
            <motion.div
              key={message.id}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <ChatMessage message={message} onBook={askAppointment} />
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping ? <TypingIndicator /> : null}
        {error ? (
          <p className="rounded-2xl bg-danger-soft px-3 py-2 text-xs text-danger" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <div className="shrink-0 px-3 pt-2 pb-3 sm:px-5 sm:pt-3 sm:pb-5">
        <div className="mb-3 flex flex-wrap gap-2">
          {prompts.map((prompt) => (
            <button
              key={prompt.label}
              type="button"
              disabled={isTyping}
              onClick={() => {
                void send(prompt.text)
              }}
              className="rounded-full border border-white/70 bg-white/35 px-3.5 py-1.5 text-[12.5px] font-medium text-ink shadow-[inset_0_1px_0_rgb(255_255_255_/_0.85)] backdrop-blur-xl transition-colors hover:bg-white/60 disabled:opacity-50"
            >
              {prompt.label}
            </button>
          ))}
        </div>
        <MessageComposer disabled={isTyping} onSend={(value) => void send(value)} />
        <p className="mt-3 text-center text-[11px] leading-snug text-ink-faint">
          {t.chat.disclaimer}
        </p>
      </div>
    </div>
  )
}
