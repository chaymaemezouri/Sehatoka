import { useEffect, useMemo, useState } from "react"
import { AssistantPage } from "@/app/AssistantPage.tsx"
import { HomePage } from "@/app/HomePage.tsx"
import { LocaleProvider } from "@/i18n/LocaleProvider.tsx"
import { AuthProvider } from "@/lib/auth/AuthProvider.tsx"
import { parseHash } from "@/lib/route.ts"
import { AuthScreen } from "@/pages/auth/AuthScreen.tsx"
import { PatientPortal } from "@/patient/PatientPortal.tsx"

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
  const route = useMemo(() => parseHash(hash), [hash])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [route.path])

  let page = <HomePage />
  if (route.path === "ia") {
    page = <AssistantPage />
  } else if (route.path === "connexion" || route.path === "inscription" || route.path === "mot-de-passe") {
    page = <AuthScreen mode={route.path} next={route.params.get("next")} />
  } else if (route.path === "patient" || route.path.startsWith("patient/")) {
    page = <PatientPortal path={route.path} params={route.params} />
  }

  return (
    <LocaleProvider>
      <AuthProvider>{page}</AuthProvider>
    </LocaleProvider>
  )
}
