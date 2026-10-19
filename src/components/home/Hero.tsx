import { ArrowRight, Check } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { useState } from "react"
import { ChatPanel } from "@/components/chatbot/ChatPanel.tsx"
import { AssistantCard } from "@/components/home/AssistantCard.tsx"
import { useLocale } from "@/i18n/useLocale.ts"

export function Hero() {
  const reduceMotion = useReducedMotion()
  const [showPhoto, setShowPhoto] = useState(true)
  const { t } = useLocale()

  return (
    <>
      <section id="accueil" className="relative isolate min-h-svh overflow-hidden text-white">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-[#b7a3c6]" />
          {showPhoto ? (
            <img
              src="/hero-bg.jpg"
              alt=""
              className="absolute inset-0 size-full object-cover object-[72%_center]"
              onError={() => setShowPhoto(false)}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: [
                  "radial-gradient(80% 70% at 16% 40%, rgba(244,232,246,0.35) 0%, rgba(244,232,246,0) 50%)",
                  "radial-gradient(58% 72% at 76% 50%, rgba(196,96,88,0.72) 0%, rgba(196,96,88,0) 52%)",
                  "radial-gradient(46% 52% at 88% 22%, rgba(70,122,176,0.78) 0%, rgba(70,122,176,0) 50%)",
                  "linear-gradient(105deg, #b496c8 0%, #c09bb8 32%, #d48978 68%, #6d96c2 100%)",
                ].join(","),
              }}
            />
          )}
          <div className="absolute inset-0 bg-linear-to-r from-[#3a2c44]/25 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(42%_40%_at_92%_92%,rgba(36,22,34,0.34),transparent_72%)]" />
        </div>

        <img
          src="/ia-herosection.png?v=2"
          alt=""
          className="pointer-events-none absolute top-[11%] right-[5%] z-[1] hidden w-[min(40vw,560px)] object-contain object-right mix-blend-screen select-none lg:block"
        />

        <div className="relative z-auto flex min-h-[100svh] flex-col justify-center gap-4 px-5 pt-16 pb-7 sm:px-6 sm:pt-24 md:px-12 lg:z-10 lg:justify-between lg:gap-0 lg:px-16 lg:pt-32 lg:pb-12">
          <motion.h1
            className="max-w-[11ch] text-[1.85rem] leading-[0.96] font-medium tracking-[-0.045em] text-white min-[400px]:text-[2rem] sm:mt-[4vh] sm:max-w-[min(8.2em,46vw)] sm:text-[clamp(3.15rem,7.4vw,7.4rem)] sm:leading-[0.9] sm:tracking-[-0.055em]"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {t.heroTitle[0]}
            <br />
            {t.heroTitle[1]}
            <br />
            {t.heroTitle[2]}
          </motion.h1>

          <img
            src="/ia-herosection.png?v=2"
            alt=""
            className="pointer-events-none mx-auto h-[min(30svh,220px)] w-auto max-w-full object-contain mix-blend-screen select-none lg:hidden"
          />

          <div className="flex flex-col gap-5 lg:mt-auto lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:pt-16">
            <div className="max-w-md">
              <p className="max-w-[34ch] text-[13.5px] leading-relaxed text-white/80 sm:text-[15px]">
                {t.heroBody}
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:items-center sm:gap-3">
                <a
                  href="#assistant"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#161616] px-4 text-[13px] font-medium text-white transition-colors hover:bg-black sm:h-11 sm:px-5 sm:text-[14px]"
                >
                  {t.heroPrimary}
                  <ArrowRight className="size-4" />
                </a>
                <a
                  href="#specialites"
                  className="inline-flex h-10 items-center justify-center rounded-full border border-white/50 bg-white/10 px-4 text-[13px] font-medium text-white backdrop-blur-md transition-colors hover:bg-white/18 sm:h-11 sm:px-5 sm:text-[14px]"
                >
                  {t.heroSecondary}
                </a>
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-4 border-t border-white/25 pt-4 lg:block lg:max-w-xs lg:border-0 lg:pt-0 lg:text-right">
              <p className="text-[16px] font-medium tracking-[-0.03em] text-white sm:text-[22px]">
                OphthoCare
              </p>
              <p className="max-w-[16ch] text-right text-[12px] leading-snug text-white/75 lg:mt-2 lg:max-w-none lg:text-[14px] lg:leading-relaxed">
                {t.heroModule}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="assistant" className="relative scroll-mt-24 overflow-hidden">
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background: [
              "radial-gradient(46% 62% at 78% 38%, #f2c2d4 0%, transparent 64%)",
              "radial-gradient(34% 48% at 96% 8%, #9eb6ef 0%, transparent 66%)",
              "radial-gradient(42% 52% at 64% 100%, #ee9d86 0%, transparent 68%)",
              "linear-gradient(180deg, #efeeec 0%, #f7eef3 22%, #f4e6ec 55%, #efeaf6 82%, #efeeec 100%)",
            ].join(","),
          }}
        />
        <div className="relative grid items-center gap-8 px-5 py-14 sm:gap-14 sm:px-6 sm:py-24 md:px-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(28rem,42rem)] lg:gap-20 lg:px-16 lg:py-32">
          <div>
            <p className="text-[11px] font-medium tracking-[0.16em] text-ink-faint uppercase sm:text-[12px] sm:tracking-[0.18em]">
              {t.assistantKicker}
            </p>
            <h2 className="mt-3 max-w-[16ch] text-[1.7rem] leading-[1.02] font-medium tracking-[-0.04em] text-ink sm:mt-4 sm:max-w-[12ch] sm:text-[clamp(2.6rem,4.4vw,4.15rem)] sm:leading-[0.96] sm:tracking-[-0.045em]">
              {t.assistantTitle}
            </h2>
            <p className="mt-4 max-w-md text-[14px] leading-relaxed text-ink-soft sm:mt-5 sm:text-[15px]">
              {t.assistantBody}
            </p>
            <ul className="mt-6 space-y-3 sm:mt-8 sm:space-y-3.5">
              {t.assistantPoints.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[14px] text-ink sm:text-[15px]">
                  <span className="flex size-5 items-center justify-center rounded-full bg-ink text-white">
                    <Check className="size-3" strokeWidth={2.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <AssistantCard>
            <ChatPanel expandHref="#ia" promptLimit={3} />
          </AssistantCard>
        </div>
      </section>
    </>
  )
}
