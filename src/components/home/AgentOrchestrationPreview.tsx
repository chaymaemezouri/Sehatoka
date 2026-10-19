import { researchAgents } from "@/data/agents.ts"
import { useLocale } from "@/i18n/useLocale.ts"

export function AgentOrchestrationPreview() {
  const { t } = useLocale()
  return (
    <section className="relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-[#b496c8]" aria-hidden="true" />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background: [
            "radial-gradient(70% 80% at 12% 20%, rgba(244,232,246,0.28) 0%, transparent 55%)",
            "radial-gradient(55% 70% at 82% 70%, rgba(196,96,88,0.55) 0%, transparent 58%)",
            "linear-gradient(115deg, #a98bc4 0%, #c4a0b4 46%, #c98478 100%)",
          ].join(","),
        }}
      />

      <div className="relative px-4 py-14 sm:px-6 sm:py-24 md:px-12 lg:px-16 lg:py-32">
        <h2 className="max-w-[16ch] text-[1.7rem] leading-[1.02] font-medium tracking-[-0.04em] sm:max-w-[14ch] sm:text-[clamp(2.5rem,4.6vw,4.4rem)] sm:leading-[0.95] sm:tracking-[-0.045em]">
          {t.agentsTitle}
        </h2>
        <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white/75 sm:mt-6 sm:text-[16px]">
          {t.agentsBody}
        </p>

        <ol className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-16 sm:gap-12 lg:grid-cols-4 lg:gap-8">
          {researchAgents.map((agent, index) => (
            <li key={agent.id}>
              <p className="text-[13px] text-white/55">{agent.index}</p>
              <h3 className="mt-2 text-[1.02rem] font-medium tracking-[-0.03em] sm:mt-3 sm:text-[1.35rem]">
                {t.agents[index]?.name}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/75 sm:mt-3 sm:text-[15px]">
                {t.agents[index]?.role}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
