export function TypingIndicator() {
  return (
    <div className="flex justify-start" aria-live="polite" aria-label="Sehatoka AI rédige une réponse">
      <div className="flex items-center gap-1.5 rounded-[1.25rem] rounded-bl-md border border-white/75 bg-white/38 px-3.5 py-2.5 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.9)] backdrop-blur-xl">
        <span className="size-1.5 animate-bounce rounded-full bg-ink/40 [animation-delay:-0.28s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-ink/40 [animation-delay:-0.14s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-ink/40" />
      </div>
    </div>
  )
}
