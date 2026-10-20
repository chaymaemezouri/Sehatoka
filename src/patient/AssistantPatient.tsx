import { ChatPanel } from "@/components/chatbot/ChatPanel.tsx"
import { CareChoices } from "@/components/care/CareChoices.tsx"
import { useChat } from "@/hooks/useChat.ts"
import { useLocale } from "@/i18n/useLocale.ts"
import { Panel } from "@/patient/ui.tsx"

export function AssistantPatient() {
  const { locale, t } = useLocale()
  const chat = useChat()
  const en = locale === "en"
  const recommendation = [...chat.messages].reverse().find((message) => message.recommendation && !message.isExample)?.recommendation

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[1.7rem] font-medium tracking-[-0.04em]">Sehatoka AI</h1>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-soft">
            {en
              ? "Describe what brings you. The choices narrow to a specialty, a city, or urgent care."
              : "Décrivez ce qui vous amène. Les choix se précisent selon la spécialité, la ville ou l'urgence."}
          </p>
        </div>
        <button type="button" onClick={chat.reset} className="h-9 rounded-full border border-black/10 px-3 text-[13px] font-medium">
          {t.chat.newChat}
        </button>
      </header>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="h-[min(40rem,calc(100svh-14rem))] min-h-80 overflow-hidden rounded-[1.5rem] border border-black/8 bg-white/55">
          <ChatPanel chat={chat} />
        </div>
        <Panel className="space-y-3">
          <p className="text-[12px] font-medium tracking-[0.14em] text-ink-faint uppercase">{en ? "Orientation" : "Orientation"}</p>
          <h2 className="text-[1.25rem] font-medium tracking-[-0.03em]">
            {recommendation?.specialtyName ?? (en ? "Waiting for a need" : "En attente d'un besoin")}
          </h2>
          <p className="text-[13px] leading-relaxed text-ink-soft">
            {recommendation?.rationale ??
              (en
                ? "Doctors with the most reviews stay listed. A specialty or a city narrows them."
                : "Les médecins avec le plus d'avis restent proposés. Une spécialité ou une ville affine la liste.")}
          </p>
          <CareChoices messages={chat.messages.filter((message) => !message.isExample)} recommendation={recommendation} />
          {recommendation?.urgency === "urgent" ? (
            <p className="text-[13px] leading-relaxed text-danger">
              {en ? "These clinics stay among the choices for urgent signs." : "Ces cliniques restent dans les choix en cas de signes urgents."}
            </p>
          ) : null}
          <p className="text-[12px] leading-relaxed text-ink-faint">{t.chat.disclaimer}</p>
        </Panel>
      </div>
    </div>
  )
}
