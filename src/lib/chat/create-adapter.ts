import { DemoChatAdapter } from "@/lib/chat/demo-adapter.ts"
import type { ChatAdapter } from "@/types/chat.ts"

export function createChatAdapter(): ChatAdapter {
  const mode = import.meta.env.VITE_CHAT_ADAPTER ?? "demo"

  switch (mode) {
    case "demo":
      return new DemoChatAdapter()
    default:
      return new DemoChatAdapter()
  }
}
