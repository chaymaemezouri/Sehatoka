import { Sparkles } from "lucide-react"
import { AgentOrchestrationPreview } from "@/components/home/AgentOrchestrationPreview.tsx"
import { CareStructures } from "@/components/home/CareStructures.tsx"
import { Hero } from "@/components/home/Hero.tsx"
import { SpecialtyGrid } from "@/components/home/SpecialtyGrid.tsx"
import { TrustSection } from "@/components/home/TrustSection.tsx"
import { Footer } from "@/components/layout/Footer.tsx"
import { Navbar } from "@/components/layout/Navbar.tsx"
import { useLocale } from "@/i18n/useLocale.ts"

export function HomePage() {
  const { t } = useLocale()

  return (
    <div className="min-h-svh bg-[#efeeec]">
      <a
        href="#assistant"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-navy"
      >
        {t.skip}
      </a>
      <Navbar />
      <main>
        <Hero />
        <SpecialtyGrid />
        <CareStructures />
        <AgentOrchestrationPreview />
        <TrustSection />
      </main>
      <Footer />
      <a
        href="#ia"
        aria-label={t.openAi}
        className="fixed right-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 flex size-11 items-center justify-center rounded-full border border-white/70 bg-white/50 text-ink shadow-[inset_0_1px_0_rgb(255_255_255_/_0.9),0_16px_40px_rgb(48_24_40_/_0.2)] backdrop-blur-2xl transition-transform hover:scale-105 sm:right-5 sm:bottom-5 sm:size-14"
      >
        <Sparkles className="size-5" />
      </a>
    </div>
  )
}
