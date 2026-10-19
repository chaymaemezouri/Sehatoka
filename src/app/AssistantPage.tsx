import { ArrowLeft, CalendarClock, ClipboardList, RotateCcw, Siren } from "lucide-react"
import type { ReactNode } from "react"
import { ChatPanel } from "@/components/chatbot/ChatPanel.tsx"
import { useChat } from "@/hooks/useChat.ts"
import { OPTHOCARE_URL } from "@/data/site.ts"
import { cn } from "@/lib/utils.ts"

const atmosphere = [
  "radial-gradient(42% 46% at 8% 0%, #f2c2d4 0%, transparent 62%)",
  "radial-gradient(38% 42% at 96% 8%, #9eb6ef 0%, transparent 60%)",
  "radial-gradient(46% 50% at 88% 100%, #ee9d86 0%, transparent 64%)",
  "linear-gradient(165deg, #f6eef3 0%, #f7ece6 46%, #e7ebf8 100%)",
].join(",")

const windows = [
  { label: "Matin", text: "Je souhaite un rendez-vous, de préférence le matin." },
  { label: "Après-midi", text: "Je souhaite un rendez-vous, de préférence l'après-midi." },
  { label: "Cette semaine", text: "Je souhaite un rendez-vous, de préférence cette semaine." },
]

export function AssistantPage() {
  const chat = useChat()
  const recommendation = [...chat.messages]
    .reverse()
    .find((message) => message.recommendation)?.recommendation

  return (
    <div className="relative flex h-svh flex-col overflow-hidden">
      <div className="absolute inset-0" style={{ background: atmosphere }} aria-hidden="true" />

      <header className="relative z-10 flex h-14 shrink-0 items-center justify-between px-4 sm:px-6">
        <a
          href="#accueil"
          className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/45 px-3 py-1.5 text-[13px] font-medium text-ink shadow-[inset_0_1px_0_rgb(255_255_255_/_0.9)] backdrop-blur-xl"
        >
          <ArrowLeft className="size-4" />
          Accueil
        </a>
        <p className="text-[14px] font-medium tracking-[-0.03em] text-ink">Sehatoka AI</p>
      </header>

      <div className="relative z-10 grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)_auto] gap-2 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:gap-3 sm:px-3 sm:pb-3 lg:grid-cols-[15.5rem_minmax(0,1fr)_19rem] lg:grid-rows-1 lg:px-4 lg:pb-4">
        <aside className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          <Action
            icon={<RotateCcw className="size-4" />}
            label="Nouvelle conversation"
            onClick={chat.reset}
          />
          <Action
            icon={<CalendarClock className="size-4" />}
            label="Demander un rendez-vous"
            onClick={() => void chat.send("Je souhaite demander un rendez-vous.")}
            disabled={chat.isTyping}
          />
          <Action
            icon={<ClipboardList className="size-4" />}
            label="Préparer la visite"
            onClick={() => void chat.send("Que dois-je préparer avant l'orientation ?")}
            disabled={chat.isTyping}
          />
          <Action
            icon={<Siren className="size-4" />}
            label="Signes d'urgence"
            onClick={() => void chat.send("Que faire si les signes semblent urgents ?")}
            disabled={chat.isTyping}
          />
        </aside>

        <section className="min-h-0 overflow-hidden rounded-[1.6rem] border border-white/55 bg-white/18 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.75),0_24px_70px_rgb(48_24_40_/_0.16)] backdrop-blur-3xl">
          <ChatPanel chat={chat} />
        </section>

        <aside className="flex max-h-36 min-h-0 flex-col gap-2 overflow-y-auto rounded-[1.25rem] border border-white/55 bg-white/28 p-3 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.8)] backdrop-blur-2xl sm:max-h-44 sm:gap-3 sm:rounded-[1.6rem] sm:p-4 lg:max-h-none lg:p-5">
          <p className="text-[13px] text-ink-faint">Parcours</p>
          <h2 className="text-[1.15rem] font-medium tracking-[-0.04em] text-ink sm:text-[1.45rem]">
            {recommendation?.specialtyName ?? "En attente d'un besoin"}
          </h2>
          <p className="text-[14px] leading-relaxed text-ink-soft">
            {recommendation
              ? recommendation.rationale
              : "Décrivez un besoin. L'orientation apparaît ici, puis vous pouvez formuler une demande de rendez-vous."}
          </p>

          <div className="mt-2">
            <p className="text-[12px] text-ink-faint">Préférence de rendez-vous</p>
            <div className="mt-2 flex flex-row flex-wrap gap-2 lg:flex-col">
              {windows.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  disabled={chat.isTyping}
                  onClick={() => void chat.send(item.text)}
                  className="rounded-full border border-white/80 bg-white/60 px-4 py-2 text-left text-[13px] font-medium text-ink shadow-[inset_0_1px_0_rgb(255_255_255)] transition-colors hover:bg-white disabled:opacity-50"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-ink-faint">
              Demande de démonstration, conservée dans cette session. Aucun
              créneau clinique n'est réservé.
            </p>
          </div>

          {recommendation?.specialtyId === "ophthalmology" ? (
            <a
              href={OPTHOCARE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center justify-center rounded-full bg-ink px-4 py-2.5 text-[13px] font-medium text-white"
            >
              Continuer sur OphthoCare
            </a>
          ) : null}

          {chat.appointments.length > 0 ? (
            <ul className="space-y-2 border-t border-black/10 pt-3">
              {chat.appointments.map((item, index) => (
                <li key={`${item.windowLabel}-${index}`} className="text-[13px] text-ink">
                  {item.specialtyName} · {item.windowLabel}
                  <span className="mt-0.5 block text-[12px] text-ink-faint">
                    {item.liveModule ? "Relais possible via OphthoCare" : "Module pas encore ouvert"}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </aside>
      </div>
    </div>
  )
}

function Action({
  icon,
  label,
  onClick,
  disabled = false,
}: {
  icon: ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/70 bg-white/40 px-3 py-2 text-left text-[12px] font-medium text-ink shadow-[inset_0_1px_0_rgb(255_255_255_/_0.9)] backdrop-blur-xl transition-colors hover:bg-white/70 disabled:opacity-50 sm:gap-2 sm:px-3.5 sm:py-2.5 sm:text-[13px] lg:w-full lg:rounded-2xl",
      )}
    >
      {icon}
      {label}
    </button>
  )
}
