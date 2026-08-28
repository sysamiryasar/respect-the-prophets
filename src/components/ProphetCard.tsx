import { ac } from '../lib/art'
import { useRef, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { Prophet } from '../data/prophets'
import { useJourney } from '../lib/journey'
import ProphetGlyph from './visuals/ProphetGlyph'
import Plate from './Plate'

interface Props {
  prophet: Prophet
  index: number
  orientation?: 'horizontal' | 'vertical'
  /** The first few cards load their plate eagerly. */
  priority?: boolean
}

const MotionLink = motion.create(Link)

/**
 * A timeline card, and a link to that prophet's page.
 *
 * Hovering gives a real 3D tilt driven by pointer position, with the
 * illumination hotspot tracking the cursor — both disabled on touch devices
 * and under reduced motion.
 */
export default function ProphetCard({
  prophet,
  index,
  orientation = 'horizontal',
  priority = false,
}: Props) {
  const { reduced, coarse, cue } = useJourney()
  const ref = useRef<HTMLAnchorElement>(null)
  const interactive = !reduced && !coarse

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, { stiffness: 180, damping: 22, mass: 0.4 })
  const sy = useSpring(py, { stiffness: 180, damping: 22, mass: 0.4 })

  const rotateY = useTransform(sx, [0, 1], [8, -8])
  const rotateX = useTransform(sy, [0, 1], [-7, 7])
  const glowX = useTransform(sx, (v) => `${(v * 100).toFixed(2)}%`)
  const glowY = useTransform(sy, (v) => `${(v * 100).toFixed(2)}%`)
  const spotlight = useMotionTemplate`radial-gradient(220px circle at ${glowX} ${glowY}, ${ac(prophet.accent)}2e, transparent 72%)`

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!interactive || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }

  const reset = () => {
    px.set(0.5)
    py.set(0.5)
  }

  const vertical = orientation === 'vertical'

  return (
    <MotionLink
      ref={ref}
      to={`/prophets/${prophet.id}`}
      onClick={() => cue('open')}
      onMouseMove={onMove}
      onMouseEnter={() => cue('hover')}
      onMouseLeave={reset}
      data-cursor="explore"
      aria-label={`Open the story of ${prophet.name} ${prophet.honorific}`}
      className={`group relative block shrink-0 overflow-hidden border border-gold/15 bg-ink/70 text-left backdrop-blur-sm transition-colors duration-500 hover:border-gold/45 ${
        vertical ? 'w-full' : 'w-[76vw] max-w-[19rem] sm:w-[19rem]'
      }`}
      style={
        interactive
          ? { rotateX, rotateY, transformPerspective: 1100, transformStyle: 'preserve-3d' }
          : undefined
      }
      whileHover={interactive ? { y: -6 } : undefined}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* the prophet's atmospheric plate, sitting well back */}
      <Plate
        id={prophet.id}
        priority={priority}
        opacity={0.4}
        sizes="(max-width: 640px) 76vw, 19rem"
        className="transition-opacity duration-700 group-hover:opacity-100"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgb(var(--ink-rgb) / calc(.6 * var(--scrim-k))), rgb(var(--ink-rgb) / calc(.85 * var(--scrim-k))) 55%, rgb(var(--ink-rgb) / calc(.96 * var(--scrim-k))))',
        }}
      />

      {/* cursor-tracking illumination */}
      {interactive && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: spotlight }}
        />
      )}

      <span
        aria-hidden="true"
        className="absolute top-0 left-0 h-px w-0 transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${ac(prophet.accent)}, transparent)` }}
      />

      <span className="relative block p-6 sm:p-7">
        <span className="flex items-start justify-between gap-4">
          <span className="font-display text-[0.62rem] tracking-[0.34em] text-gold/40 tabular-nums">
            {String(index + 1).padStart(2, '0')}
          </span>
          {prophet.ululAzm && (
            <span
              className="border border-gold/30 px-2 py-0.5 text-[0.62rem] tracking-[0.22em] text-gold/70 uppercase"
              title="One of the five messengers of firm resolve (ulu al-‘azm)"
            >
              Ulu al-‘azm
            </span>
          )}
        </span>

        <span
          className="mt-5 flex h-16 w-16 items-center justify-center rounded-full border transition-all duration-700 group-hover:scale-110"
          style={{
            borderColor: `${ac(prophet.accent)}44`,
            background: `radial-gradient(circle, ${ac(prophet.accent)}1a, transparent 70%)`,
          }}
        >
          <ProphetGlyph
            id={prophet.id}
            className="h-8 w-8 transition-transform duration-700 group-hover:rotate-[6deg]"
            color={ac(prophet.accent)}
          />
        </span>

        <span className="font-display mt-6 flex items-baseline gap-2 text-2xl font-light text-ivory sm:text-[1.7rem]">
          {prophet.name}
          <span className="text-sm text-gold/60">{prophet.honorific}</span>
        </span>
        <span className="font-arabic mt-1 block text-lg text-gold/55" lang="ar">
          {prophet.arabic}
        </span>

        <span className="mt-4 block text-[0.68rem] leading-relaxed tracking-wide text-ivory-dim/65 uppercase">
          {prophet.epithet}
        </span>

        <span className="hairline my-5 block h-px w-full" aria-hidden="true" />

        <span className="font-display block text-[0.98rem] leading-relaxed text-ivory/75 italic">
          “{prophet.lesson}”
        </span>

        <span className="grid grid-rows-[0fr] transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
          <span className="block overflow-hidden">
            <span className="block pt-4 text-[0.8rem] leading-relaxed text-ivory-dim/70">
              {prophet.description.slice(0, 128)}…
            </span>
          </span>
        </span>

        <span
          className="mt-6 flex items-center gap-2 text-[0.62rem] tracking-[0.3em] uppercase transition-colors duration-500"
          style={{ color: `${ac(prophet.accent)}cc` }}
        >
          Enter the scene
          <span
            aria-hidden="true"
            className="transition-transform duration-500 group-hover:translate-x-1.5"
          >
            →
          </span>
        </span>
      </span>
    </MotionLink>
  )
}
