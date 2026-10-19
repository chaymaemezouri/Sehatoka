import { SpecialtyRecommendation } from "@/components/chatbot/SpecialtyRecommendation.tsx"
import { cn } from "@/lib/utils.ts"
import type { ChatMessage as ChatMessageType } from "@/types/chat.ts"

interface ChatMessageProps {
  message: ChatMessageType
  compact?: boolean
  onBook?: () => void
}

export function ChatMessage({ message, compact = false, onBook }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[min(85%,40rem)]", isUser && "flex flex-col items-end")}>
        <div
          className={cn(
            "px-3.5 py-2.5 leading-[1.45] tracking-[0.01em]",
            compact ? "text-[11.5px]" : "text-[13.5px] sm:text-[15px]",
            isUser
              ? "rounded-[1.25rem] rounded-br-md border border-white/30 bg-[#1a1422]/72 text-white shadow-[inset_0_1px_0_rgb(255_255_255_/_0.35),0_10px_28px_rgb(20_10_24_/_0.2)] backdrop-blur-xl"
              : "rounded-[1.25rem] rounded-bl-md border border-white/80 bg-white/62 text-ink shadow-[inset_0_1px_0_rgb(255_255_255_/_0.95),0_10px_28px_rgb(40_20_30_/_0.08)] backdrop-blur-xl",
          )}
        >
          {message.content}
        </div>
        {message.recommendation ? (
          <SpecialtyRecommendation
            recommendation={message.recommendation}
            compact={compact}
            onBook={onBook}
          />
        ) : null}
      </div>
    </div>
  )
}
