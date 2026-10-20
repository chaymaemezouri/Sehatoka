import { AiSwipeRail } from "@/components/home/AiSwipeRail.tsx"
import { Hero } from "@/components/home/Hero.tsx"
import { Navbar } from "@/components/layout/Navbar.tsx"
import { useLocale } from "@/i18n/useLocale.ts"

export function HomePage() {
  const { t } = useLocale()

  return (
    <div className="min-h-svh bg-[#efeeec]">
      <a
        href="#ia"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-navy"
      >
        {t.skip}
      </a>
      <Navbar />
      <main>
        <Hero />
      </main>
      <AiSwipeRail />
    </div>
  )
}
