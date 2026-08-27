import { useEffect, useRef, useState } from 'react'
import { useJourney } from '../lib/journey'

type Mode = 'idle' | 'hover' | 'explore'

/**
 * A restrained two-part cursor: a small solid dot that tracks exactly, and
 * a ring that lags slightly behind. It reacts to anything marked with
 * `data-cursor`, and disables itself entirely on touch or reduced motion.
 *
 * Positioning is written straight to the DOM inside rAF so pointer moves
 * never trigger a React render.
 */
export default function CustomCursor() {
  const { coarse, reduced } = useJourney()
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<Mode>('idle')
  const [visible, setVisible] = useState(false)

  const enabled = !coarse && !reduced

  useEffect(() => {
    if (!enabled) {
      delete document.documentElement.dataset.cursor
      return
    }
    document.documentElement.dataset.cursor = 'custom'

    let raf = 0
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ring = { ...target }

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!visible) setVisible(true)

      const el = (e.target as HTMLElement | null)?.closest?.('[data-cursor]') as HTMLElement | null
      const next = (el?.dataset.cursor as Mode | undefined) ?? 'idle'
      setMode((m) => (m === next ? m : next))
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    const tick = () => {
      raf = requestAnimationFrame(tick)
      ring.x += (target.x - ring.x) * 0.16
      ring.y += (target.y - ring.y) * 0.16
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
      delete document.documentElement.dataset.cursor
    }
  }, [enabled, visible])

  if (!enabled) return null

  const ringSize = mode === 'explore' ? 62 : mode === 'hover' ? 46 : 30

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200]">
      <div
        ref={dotRef}
        className="fixed top-0 left-0 h-1.5 w-1.5 rounded-full bg-gold-bright transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 flex items-center justify-center rounded-full border transition-[width,height,border-color,opacity] duration-400 ease-[cubic-bezier(.16,1,.3,1)]"
        style={{
          width: ringSize,
          height: ringSize,
          opacity: visible ? (mode === 'idle' ? 0.45 : 0.95) : 0,
          borderColor: mode === 'idle' ? 'rgba(211,173,104,.5)' : 'rgba(246,229,191,.9)',
          background: mode === 'explore' ? 'rgba(211,173,104,.07)' : 'transparent',
        }}
      >
        <span
          className="text-[0.62rem] tracking-[0.2em] text-gold-bright uppercase transition-opacity duration-300"
          style={{ opacity: mode === 'explore' ? 1 : 0 }}
        >
          Open
        </span>
      </div>
    </div>
  )
}
