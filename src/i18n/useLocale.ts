import { createContext, useContext } from "react"
import type { Copy } from "@/i18n/copy.ts"
import type { Locale } from "@/i18n/store.ts"

export interface LocaleContextValue {
  locale: Locale
  t: Copy
  setLocale: (next: Locale) => void
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)

export function useLocale() {
  const value = useContext(LocaleContext)
  if (!value) {
    throw new Error("useLocale must be used within LocaleProvider")
  }
  return value
}
