import { useEffect, useRef, useState, type ReactNode, type ButtonHTMLAttributes, type RefObject } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { useJourney } from '../lib/journey'

/* ------------------------------------------------------------------ */
/*  In-view detection, with a failsafe                                 */
/* ------------------------------------------------------------------ */

/**
 * `useInView` with a guard: if the observer has not reported anything after
 * a beat and the element is demonstrably inside the viewport, reveal it
 * anyway. Reveal animations must never be the reason content is unreadable.
 */
export function useInViewSafe(
  ref: RefObject<Element | null>,
  options?: Parameters<typeof useInView>[1],
) {
  const inView = useInView(ref, options)
  const [forced, setForced] = useState(false)

  useEffect(() => {
    if (inView || forced) return
    const t = window.setTimeout(() => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight && r.bottom > 0) setForced(true)
    }, 1600)
    return () => window.clearTimeout(t)
  }, [inView, forced, ref])

  return inView || forced
}

/* ------------------------------------------------------------------ */
/*  Reveal — the workhorse scroll animation                            */
/* ------------------------------------------------------------------ */

interface RevealProps {
  children: ReactNode
  /** Seconds. */
  delay?: number
  y?: number
  blur?: boolean
  className?: string
  as?: 'div' | 'section' | 'li' | 'p' | 'span' | 'h2' | 'h3'
  once?: boolean
  amount?: number
}

export function Reveal({
  children,
  delay = 0,
  y = 26,
  blur = true,
  className = '',
  as = 'div',
  once = true,
  amount = 0.35,
}: RevealProps) {
  const { reduced } = useJourney()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInViewSafe(ref, { once, amount })
  const Cmp = motion[as] as typeof motion.div

  if (reduced) {
    const Plain = as as 'div'
    return (
      <Plain ref={ref as never} className={className}>
        {children}
      </Plain>
    )
  }

  return (
    <Cmp
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, filter: blur ? 'blur(10px)' : 'blur(0px)' }}
      animate={
        inView
          ? { opacity: 1, y: 0, filter: 'blur(0px)' }
          : { opacity: 0, y, filter: blur ? 'blur(10px)' : 'blur(0px)' }
      }
      transition={{ duration: 1.05, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Cmp>
  )
}

/* ------------------------------------------------------------------ */
/*  Line-by-line text reveal                                           */
/* ------------------------------------------------------------------ */

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(8px)' },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1, delay: i * 0.42, ease: [0.16, 1, 0.3, 1] },
  }),
}

export function LineReveal({
  lines,
  className = '',
  lineClassName = '',
  stagger = 1,
  startDelay = 0,
}: {
  lines: string[]
  className?: string
  lineClassName?: string
  stagger?: number
  startDelay?: number
}) {
  const { reduced } = useJourney()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInViewSafe(ref, { once: true, amount: 0.4 })

  return (
    <div ref={ref} className={className}>
      {lines.map((line, i) => (
        <motion.p
          key={line}
          className={lineClassName}
          custom={i * stagger + startDelay}
          variants={lineVariants}
          initial={reduced ? 'show' : 'hidden'}
          animate={reduced || inView ? 'show' : 'hidden'}
        >
          {line}
        </motion.p>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Section shell                                                      */
/* ------------------------------------------------------------------ */

export function SectionShell({
  id,
  index,
  label,
  children,
  className = '',
  ariaLabel,
  clip = true,
}: {
  id: string
  index?: string
  label?: string
  children: ReactNode
  className?: string
  ariaLabel?: string
  /**
   * Sections normally clip their bleeding background layers. Set false when
   * the section contains `position: sticky` children — `overflow: hidden`
   * turns an element into a scroll container, which stops descendants from
   * ever sticking to the viewport.
   */
  clip?: boolean
}) {
  return (
    <section
      id={id}
      aria-label={ariaLabel ?? label}
      data-section={id}
      className={`relative isolate w-full ${clip ? 'overflow-hidden' : ''} ${className}`}
    >
      {(index || label) && (
        <div className="pointer-events-none absolute top-8 left-4 z-20 flex items-baseline gap-3 sm:top-12 sm:left-10">
          {index && (
            <span className="font-display text-xs tracking-[0.4em] text-gold/45 tabular-nums">
              {index}
            </span>
          )}
          {label && (
            <span className="text-[0.64rem] tracking-[0.36em] text-ivory-dim/45 uppercase">
              {label}
            </span>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Eyebrow / kicker                                                   */
/* ------------------------------------------------------------------ */

export function Kicker({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-block text-[0.62rem] tracking-[0.42em] text-gold/70 uppercase sm:text-[0.68rem] ${className}`}
    >
      {children}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Gilded button                                                      */
/* ------------------------------------------------------------------ */

interface GoldButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  arrow?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'solid' | 'ghost'
}

export function GoldButton({
  children,
  arrow = '→',
  size = 'md',
  variant = 'ghost',
  className = '',
  onMouseEnter,
  ...rest
}: GoldButtonProps) {
  const { cue } = useJourney()
  const pad =
    size === 'lg'
      ? 'px-9 py-5 text-[0.7rem] sm:px-12 sm:text-[0.78rem]'
      : size === 'sm'
        ? 'px-5 py-2.5 text-[0.64rem]'
        : 'px-7 py-3.5 text-[0.66rem]'

  return (
    <button
      {...rest}
      onMouseEnter={(e) => {
        cue('hover')
        onMouseEnter?.(e)
      }}
      className={`group relative inline-flex cursor-pointer items-center justify-center gap-3 overflow-hidden tracking-[0.3em] uppercase transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:scale-[1.035] active:scale-[0.99] ${pad} ${
        variant === 'solid' ? 'text-ink' : 'text-gold-bright'
      } ${className}`}
      data-cursor="hover"
    >
      {/* border */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 border transition-colors duration-500 ${
          variant === 'solid' ? 'border-gold bg-gold' : 'border-gold/40 group-hover:border-gold/90'
        }`}
      />
      {/* sweep */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold/20 to-transparent transition-transform duration-[1100ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-full"
      />
      {/* glow */}
      <span
        aria-hidden="true"
        className="absolute -inset-6 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100"
        style={{ background: 'radial-gradient(circle, rgb(var(--gold-rgb) / .28), transparent 65%)' }}
      />
      {/* corner ticks */}
      {variant === 'ghost' && (
        <span aria-hidden="true">
          {(
            [
              'left-0 top-0 border-l border-t',
              'right-0 top-0 border-r border-t',
              'left-0 bottom-0 border-l border-b',
              'right-0 bottom-0 border-r border-b',
            ] as const
          ).map((pos) => (
            <span
              key={pos}
              className={`absolute h-2.5 w-2.5 border-gold opacity-0 transition-all duration-500 group-hover:opacity-100 ${pos}`}
            />
          ))}
        </span>
      )}
      <span className="relative z-10">{children}</span>
      {arrow && (
        <span
          aria-hidden="true"
          className="relative z-10 translate-x-0 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-1.5"
        >
          {arrow}
        </span>
      )}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Vignette + grain overlay                                           */
/* ------------------------------------------------------------------ */

export function Vignette({ strength = 0.8 }: { strength?: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10"
      style={{
        background: `radial-gradient(120% 90% at 50% 45%, transparent 35%, rgb(var(--ink-rgb) / ${strength * 0.55}) 78%, rgb(var(--ink-rgb) / ${strength}) 100%)`,
      }}
    />
  )
}

/**
 * A single tiled SVG noise layer. Cheap: one data-URI, GPU-composited,
 * no per-frame work.
 */
export function Grain({ opacity = 0.035 }: { opacity?: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 mix-blend-overlay"
      style={{
        opacity,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        backgroundSize: '160px 160px',
      }}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  A respectful note used wherever sourcing needs to be explicit      */
/* ------------------------------------------------------------------ */

export function SourceTag({ kind }: { kind: 'quran' | 'hadith' | 'teaching' }) {
  const map = {
    quran: { label: 'Qur’an', cls: 'border-gold/45 text-gold-soft' },
    hadith: { label: 'Hadith', cls: 'border-emerald-300/35 text-emerald-200/80' },
    teaching: { label: 'Educational note', cls: 'border-ivory-dim/30 text-ivory-dim/70' },
  } as const
  const { label, cls } = map[kind]
  return (
    <span
      className={`inline-block border px-2.5 py-1 text-[0.65rem] tracking-[0.28em] uppercase ${cls}`}
    >
      {label}
    </span>
  )
}
