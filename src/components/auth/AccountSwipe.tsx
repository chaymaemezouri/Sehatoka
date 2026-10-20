import { useReducedMotion } from "motion/react"
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react"
import { AssistantPage } from "@/app/AssistantPage.tsx"
import { useLocale } from "@/i18n/useLocale.ts"
import { useAuth } from "@/lib/auth/useAuth.ts"
import { cn } from "@/lib/utils.ts"

const openDelay = 480

export function AccountSwipe() {
  const reduceMotion = useReducedMotion()
  const { t } = useLocale()
  const { account } = useAuth()
  const [drag, setDrag] = useState(0)
  const [dragging, setDragging] = useState(false)
  const originX = useRef(0)
  const dragRef = useRef(0)
  const draggingRef = useRef(false)
  const opening = useRef(false)
  const last = useRef({ x: 0, t: 0, v: 0 })

  const setDragPx = (value: number) => {
    dragRef.current = value
    setDrag(value)
  }

  const openHash = (hash: string) => {
    if (opening.current) {
      return
    }
    opening.current = true
    setDragging(false)
    draggingRef.current = false
    if (reduceMotion) {
      window.location.hash = hash
      return
    }
    setDragPx(hash === "#ia" ? -window.innerWidth : window.innerWidth)
    window.setTimeout(() => {
      window.location.hash = hash
    }, openDelay)
  }

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (opening.current) {
      return
    }
    originX.current = event.clientX
    last.current = { x: event.clientX, t: performance.now(), v: 0 }
    draggingRef.current = true
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!draggingRef.current || opening.current) {
      return
    }
    const now = performance.now()
    const dt = now - last.current.t
    if (dt > 0) {
      last.current.v = (event.clientX - last.current.x) / dt
    }
    last.current.x = event.clientX
    last.current.t = now
    setDragPx(event.clientX - originX.current)
  }

  const onPointerUp = () => {
    if (!draggingRef.current || opening.current) {
      return
    }
    const distance = dragRef.current
    draggingRef.current = false
    setDragging(false)
    if (Math.abs(distance) < 8) {
      openHash(account ? "#patient" : "#connexion")
      return
    }
    if (distance <= -72 || (distance < -40 && last.current.v < -0.7)) {
      openHash("#ia")
      return
    }
    if (distance >= 72 || (distance > 40 && last.current.v > 0.7)) {
      openHash(account ? "#patient" : "#connexion")
      return
    }
    setDragPx(0)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      openHash(account ? "#patient" : "#connexion")
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      openHash("#ia")
    }
  }

  const transition = dragging ? "none" : "transform 480ms cubic-bezier(0.22, 0.8, 0.28, 1)"
  const label = account ? account.firstName : t.signIn

  if (account) {
    return null
  }

  return (
    <>
      {drag < -8 ? (
        <div
          className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
          style={{ transform: `translate3d(calc(100% + ${drag}px), 0, 0)`, transition }}
          aria-hidden="true"
        >
          <AssistantPage />
        </div>
      ) : null}

      <button
        type="button"
        aria-label={account ? t.patientSpace : t.signIn}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        className={cn(
          "absolute top-1/2 left-1/2 z-10 hidden h-9 max-w-44 cursor-grab touch-none items-center justify-center overflow-hidden rounded-full bg-[#161616] px-5 text-[13px] font-medium text-white transition-colors select-none hover:bg-black active:cursor-grabbing min-[880px]:inline-flex",
        )}
        style={{ transform: `translate3d(calc(-50% + ${Math.max(-18, Math.min(18, drag / 8))}px), -50%, 0)` }}
      >
        <span className="relative truncate">{label}</span>
      </button>
    </>
  )
}
