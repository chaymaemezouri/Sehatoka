import { useEffect, useState } from "react"
import { AssistantPage } from "@/app/AssistantPage.tsx"
import { HomePage } from "@/app/HomePage.tsx"
import { LocaleProvider } from "@/i18n/LocaleProvider.tsx"

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash)

  useEffect(() => {
    const sync = () => setHash(window.location.hash)
    window.addEventListener("hashchange", sync)
    return () => window.removeEventListener("hashchange", sync)
  }, [])

  return hash
}

export function App() {
  const hash = useHash()
  const assistantOpen = hash === "#ia"

  useEffect(() => {
    if (assistantOpen) {
      window.scrollTo(0, 0)
    }
  }, [assistantOpen])

  return (
    <LocaleProvider>{assistantOpen ? <AssistantPage /> : <HomePage />}</LocaleProvider>
  )
}
