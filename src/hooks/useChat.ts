import { useCallback, useMemo, useState } from "react"
import { exampleThread, welcomeMessage } from "@/data/chat-examples.ts"
import { copy } from "@/i18n/copy.ts"
import { getLocale } from "@/i18n/store.ts"
import { createChatAdapter } from "@/lib/chat/create-adapter.ts"
import { createId } from "@/lib/utils.ts"
import type { AppointmentRequest, ChatMessage } from "@/types/chat.ts"

function nowIso() {
  return new Date().toISOString()
}

export function useChat() {
  const adapter = useMemo(() => createChatAdapter(), [])
  const [messages, setMessages] = useState<ChatMessage[]>(exampleThread)
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [appointments, setAppointments] = useState<AppointmentRequest[]>([])

  const send = useCallback(
    async (raw: string) => {
      const content = raw.trim()
      if (!content || isTyping) {
        return
      }

      const userMessage: ChatMessage = {
        id: createId("user"),
        role: "user",
        content,
        createdAt: nowIso(),
      }

      const history = [...messages, userMessage]
      setError(null)
      setMessages((current) => [...current, userMessage])
      setIsTyping(true)

      try {
        const output = await adapter.complete({
          history,
          userMessage: content,
        })

        const assistantMessage: ChatMessage = {
          id: createId("assistant"),
          role: "assistant",
          content: output.content,
          createdAt: nowIso(),
          recommendation: output.recommendation,
        }

        setMessages((current) => [
          ...current.filter((message) => !message.isExample),
          assistantMessage,
        ])
        if (output.appointment) {
          setAppointments((current) => [...current, output.appointment as AppointmentRequest])
        }
      } catch {
        setError(copy[getLocale()].chat.error)
      } finally {
        setIsTyping(false)
      }
    },
    [adapter, isTyping, messages],
  )

  const reset = useCallback(() => {
    setError(null)
    setIsTyping(false)
    setAppointments([])
    setMessages([welcomeMessage])
  }, [])

  const restoreExample = useCallback(() => {
    setError(null)
    setIsTyping(false)
    setAppointments([])
    setMessages(exampleThread)
  }, [])

  return {
    adapter,
    messages,
    isTyping,
    error,
    appointments,
    send,
    reset,
    restoreExample,
    isExample: messages.length > 0 && messages.every((message) => message.isExample),
  }
}
