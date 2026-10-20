import { ArrowRight } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { useState } from "react"
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
          className="pointer-events-none absolute top-[11%] right-[13%] z-[1] hidden w-[min(40vw,560px)] object-contain object-right mix-blend-screen select-none lg:block"
        />

        <div className="relative z-auto flex min-h-[100svh] flex-col justify-center gap-4 px-5 pt-16 pb-36 sm:px-6 sm:pt-24 sm:pb-40 md:px-12 lg:z-10 lg:justify-between lg:gap-0 lg:px-16 lg:pt-32 lg:pr-48 lg:pb-12">
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

          <div className="max-w-md lg:mt-auto lg:pt-16">
            <p className="max-w-[34ch] text-[13.5px] leading-relaxed text-white/80 sm:text-[15px]">
              {t.heroBody}
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:items-center sm:gap-3">
              <a
                href="#ia"
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
        </div>
      </section>
    </>
  )
}
