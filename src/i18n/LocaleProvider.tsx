import { useMemo, useSyncExternalStore, type ReactNode } from "react"
import { copy } from "@/i18n/copy.ts"
import { LocaleContext } from "@/i18n/useLocale.ts"
import { getLocale, setLocale, subscribeLocale, type Locale } from "@/i18n/store.ts"

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore<Locale>(subscribeLocale, getLocale, () => "fr")

  const value = useMemo(
    () => ({
      locale,
      t: copy[locale],
      setLocale,
    }),
    [locale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
