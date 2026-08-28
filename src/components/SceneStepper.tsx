import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useJourney } from '../lib/journey'

export interface Step {
  /** Small caps label above the content. */
  label?: string
  content: ReactNode
  /** Rendered under the content, outside the crossfade (buttons, verses). */
  after?: ReactNode
}

interface Props {
  steps: Step[]
  accent: string
  /** Called whenever the active step changes — used to drive the artwork. */
  onStep?: (index: number, progress: number) => void
  /** Content shown beneath the stage in every state. */
  children?: ReactNode
  className?: string
  /** Label for the stepper region, for screen readers. */
  label: string
}

/**
 * A scene told one beat at a time.
 *
 * This is the paged answer to a scroll-pinned sequence: instead of a very tall
 * section that hijacks the scrollbar, the reader advances deliberately with a
 * click, an arrow key, or a swipe. Nothing is hidden from assistive tech — the
 * stage is a live region, every beat is reachable, and under reduced motion the
 * whole sequence renders as a plain readable list instead.
 */
export default function SceneStepper({
  steps,
  accent,
  onStep,
  children,
  className = '',
  label,
}: Props) {
  const { reduced, cue } = useJourney()
  const [i, setI] = useState(0)
  const stageRef = useRef<HTMLDivElement>(null)
  const touchX = useRef<number | null>(null)

  const last = steps.length - 1
  const progress = last > 0 ? i / last : 1

  useEffect(() => {
    onStep?.(i, progress)
  }, [i, progress, onStep])

  const go = useCallback(
    (dir: 1 | -1) => {
      setI((cur) => {
        const next = Math.min(last, Math.max(0, cur + dir))
        if (next !== cur) cue('select')
        return next
      })
    },
    [last, cue],
  )

  /* Arrow keys work whenever the stepper is on screen and nothing else has
     claimed them (no open dialog, not typing in a field). */
  useEffect(() => {
    if (reduced) return
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return
      const t = e.target as HTMLElement | null
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        go(1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        go(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, reduced])

  /* ── reduced motion: the whole sequence, plainly ───────────────────── */
  if (reduced) {
    return (
      <div className={className}>
        <ol className="space-y-12">
          {steps.map((s, k) => (
            <li key={k}>
              {s.label && (
                <span
                  className="block text-[0.62rem] tracking-[0.42em] uppercase"
                  style={{ color: `${accent}cc` }}
                >
                  {s.label}
                </span>
              )}
              <div className="mt-4">{s.content}</div>
              {s.after && <div className="mt-8">{s.after}</div>}
            </li>
          ))}
        </ol>
        {children}
      </div>
    )
  }

  const step = steps[i]

  return (
    <div className={className}>
      <section
        ref={stageRef}
        aria-label={label}
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          if (Math.abs(dx) > 56) go(dx < 0 ? 1 : -1)
          touchX.current = null
        }}
        className="relative"
      >
        {/* ── the stage ──────────────────────────────────────────── */}
        <div
          className="relative flex min-h-[58svh] items-center justify-center px-2 py-8 text-center sm:min-h-[62svh]"
          aria-live="polite"
          aria-atomic="true"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 34, filter: 'blur(14px)', scale: 0.97 }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
              exit={{
                opacity: 0,
                y: -26,
                filter: 'blur(12px)',
                scale: 1.02,
                transition: { duration: 0.32, ease: [0.65, 0, 0.35, 1] },
              }}
              transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-3xl"
            >
              {step.label && (
                <>
                  <span
                    className="font-display block text-[0.64rem] tracking-[0.46em] uppercase"
                    style={{ color: `${accent}dd` }}
                  >
                    {step.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mx-auto mt-6 block h-10 w-px"
                    style={{ background: `linear-gradient(to bottom, ${accent}88, transparent)` }}
                  />
                </>
              )}
              <div className="mt-6">{step.content}</div>
              {step.after && <div className="mt-10">{step.after}</div>}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── controls ───────────────────────────────────────────── */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={i === 0}
            data-cursor="hover"
            aria-label="Previous beat"
            className="group flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center border border-gold/25 text-gold/70 transition-all duration-400 hover:border-gold hover:text-gold-bright disabled:cursor-default disabled:opacity-20"
          >
            <ChevronLeft
              size={20}
              strokeWidth={1.3}
              className="transition-transform duration-400 group-enabled:group-hover:-translate-x-0.5"
            />
          </button>

          {/* dots */}
          <ol className="flex flex-wrap items-center justify-center gap-2.5">
            {steps.map((s, k) => (
              <li key={k}>
                <button
                  type="button"
                  onClick={() => {
                    cue('hover')
                    setI(k)
                  }}
                  data-cursor="hover"
                  aria-label={`Beat ${k + 1} of ${steps.length}${s.label ? `: ${s.label}` : ''}`}
                  aria-current={k === i}
                  className="group flex h-11 w-8 cursor-pointer items-center justify-center"
                >
                  <span
                    className="block h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: k === i ? '1.75rem' : '0.375rem',
                      background: k === i ? accent : 'rgb(var(--ivory-dim-rgb) / .28)',
                      boxShadow: k === i ? `0 0 14px ${accent}` : 'none',
                    }}
                  />
                </button>
              </li>
            ))}
          </ol>

          <button
            type="button"
            onClick={() => go(1)}
            disabled={i === last}
            data-cursor="hover"
            aria-label="Next beat"
            className="group flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center border transition-all duration-400 disabled:cursor-default disabled:opacity-20"
            style={{
              borderColor: i === last ? 'rgb(var(--gold-rgb) / .25)' : `${accent}66`,
              color: i === last ? 'rgb(var(--gold-rgb) / .7)' : accent,
            }}
          >
            <ChevronRight
              size={20}
              strokeWidth={1.3}
              className="transition-transform duration-400 group-enabled:group-hover:translate-x-0.5"
            />
          </button>
        </div>

        <p className="mt-5 text-center text-[0.62rem] tracking-[0.34em] text-ivory-dim/35 uppercase">
          Beat {String(i + 1).padStart(2, '0')} of {String(steps.length).padStart(2, '0')}
          <span className="mx-2 hidden text-ivory-dim/20 sm:inline">·</span>
          <span className="hidden sm:inline">Use ← → or swipe</span>
        </p>
      </section>

      {children}
    </div>
  )
}
