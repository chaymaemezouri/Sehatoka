/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHAT_ADAPTER?: string
  readonly VITE_CHAT_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
