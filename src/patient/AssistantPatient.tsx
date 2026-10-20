import { ChatPanel } from "@/components/chatbot/ChatPanel.tsx"
import { directoryDoctors } from "@/data/demo-directory.ts"
import { useChat } from "@/hooks/useChat.ts"
import { useLocale } from "@/i18n/useLocale.ts"
import { Panel } from "@/patient/ui.tsx"

export function AssistantPatient() {
  const { locale, t } = useLocale()
  const chat = useChat()
  const en = locale === "en"
  const recommendation = [...chat.messages].reverse().find((message) => message.recommendation && !message.isExample)?.recommendation
  const urgent = recommendation?.urgency === "urgent"
  const doctors =
    recommendation?.specialtyId && !urgent
      ? directoryDoctors.filter((doctor) => doctor.specialtyId === recommendation.specialtyId)
      : []

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[1.7rem] font-medium tracking-[-0.04em]">Sehatoka AI</h1>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-soft">
            {en
              ? "Orientation only. The assistant does not diagnose, prescribe, or book a slot. The conversation stays in this page and is not sent to an external service."
              : "Orientation seulement. L'assistant ne diagnostique pas, ne prescrit pas et ne réserve pas de créneau. La conversation reste sur cette page et n'est pas envoyée à un service externe."}
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
            {recommendation?.rationale ?? (en ? "Describe what is happening. A specialty can appear here." : "Décrivez ce qui se passe. Une spécialité peut apparaître ici.")}
          </p>
          {doctors.length > 0 ? (
            <ul className="space-y-2">
              {doctors.map((doctor) => (
                <li key={doctor.id}>
                  <a href={`#patient/medecins/${doctor.id}`} className="block rounded-2xl border border-black/8 bg-canvas px-3 py-2.5">
                    <span className="block text-[13px] font-medium text-ink">
                      {doctor.firstName} {doctor.lastName}
                    </span>
                    <span className="mt-0.5 block text-[12px] text-ink-faint">
                      {doctor.city} · {doctor.establishment}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          {recommendation?.specialtyId && !urgent ? (
            <a href={`#patient/medecins?specialite=${recommendation.specialtyId}`} className="inline-flex h-10 items-center rounded-full bg-[#161616] px-4 text-[13px] font-medium text-white">
              {en ? "Find a doctor" : "Trouver un médecin"}
            </a>
          ) : null}
          {urgent ? (
            <p className="text-[13px] leading-relaxed text-danger">
              {en ? "This may need urgent care. Do not continue toward an appointment." : "Cela peut relever des soins urgents. Ne poursuivez pas vers un rendez-vous."}
            </p>
          ) : null}
          <p className="text-[12px] leading-relaxed text-ink-faint">{t.chat.disclaimer}</p>
        </Panel>
      </div>
    </div>
  )
}
