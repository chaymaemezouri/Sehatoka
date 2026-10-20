import { ChevronsLeft, Sparkles } from "lucide-react"
import { useReducedMotion } from "motion/react"
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react"
import { AssistantPage } from "@/app/AssistantPage.tsx"
import { useLocale } from "@/i18n/useLocale.ts"

const openDelay = 520

export function AiSwipeRail() {
  const reduceMotion = useReducedMotion()
  const { t } = useLocale()
  const [drag, setDrag] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [reveal, setReveal] = useState(false)
  const originX = useRef(0)
  const dragRef = useRef(0)
  const draggingRef = useRef(false)
  const opening = useRef(false)
  const last = useRef({ x: 0, t: 0, v: 0 })

  const setDragPx = (value: number) => {
    const next = Math.max(0, value)
    dragRef.current = next
    setDrag(next)
  }

  const open = () => {
    if (opening.current) {
      return
    }
    opening.current = true
    setDragging(false)
    setReveal(true)
    if (reduceMotion) {
      window.location.hash = "#ia"
      return
    }
    setDragPx(window.innerWidth)
    window.setTimeout(() => {
      window.location.hash = "#ia"
    }, openDelay)
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (opening.current) {
      return
    }
    originX.current = event.clientX
    last.current = { x: event.clientX, t: performance.now(), v: 0 }
    draggingRef.current = true
    setReveal(true)
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || opening.current) {
      return
    }
    const now = performance.now()
    const dt = now - last.current.t
    if (dt > 0) {
      last.current.v = (last.current.x - event.clientX) / dt
    }
    last.current.x = event.clientX
    last.current.t = now
    setDragPx(originX.current - event.clientX)
  }

  const onPointerUp = () => {
    if (!draggingRef.current || opening.current) {
      return
    }
    const distance = dragRef.current
    draggingRef.current = false
    setDragging(false)
    const flicked = distance > 48 && last.current.v > 0.9
    if (distance < 8 || distance > 72 || flicked) {
      open()
      return
    }
    setDragPx(0)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      open()
    }
  }

  const transition = dragging
    ? "none"
    : "transform 520ms cubic-bezier(0.22, 0.8, 0.28, 1)"

  return (
    <>
      {reveal ? (
        <div
          className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
          style={{
            transform: `translate3d(calc(100% - ${drag}px), 0, 0)`,
            transition,
          }}
          aria-hidden="true"
        >
          <AssistantPage />
        </div>
      ) : null}

      <div
        role="button"
        tabIndex={0}
        aria-label={t.openAi}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        className="fixed inset-x-0 bottom-0 z-[60] h-28 cursor-grab touch-none select-none active:cursor-grabbing lg:inset-y-0 lg:right-0 lg:left-auto lg:h-auto lg:w-40"
        style={{ transform: `translate3d(${-drag}px, 0, 0)`, transition }}
      >
        <div className="flex h-full flex-row items-center justify-center gap-5 border-t border-black bg-white/12 text-[#161616] backdrop-blur-[42px] backdrop-saturate-150 lg:flex-col lg:border-t-0 lg:border-l">
          <Sparkles className="size-6" strokeWidth={1.75} />
          <ChevronsLeft className="sehatoka-swipe size-16" strokeWidth={1.75} />
        </div>
      </div>
    </>
  )
}
