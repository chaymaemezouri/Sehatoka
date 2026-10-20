/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHAT_ADAPTER?: string
  readonly VITE_CHAT_API_URL?: string
  readonly VITE_AUTH_MODE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
