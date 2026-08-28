import { ac } from '../lib/art'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { CHAPTERS, neighbours, type Chapter } from '../data/chapters'
import { useJourney } from '../lib/journey'
import Plate from './Plate'
import ParticleField, { type Weather } from './visuals/ParticleField'
import { GeometricPattern, OrnamentDivider } from './visuals/GeometricPattern'
import { Grain, Kicker, Vignette } from './ui'

interface Props {
  chapter: Chapter
  children: ReactNode
  /** Ambient particle style for this chapter. */
  weather?: Weather
  /** Hide the standard title block (pages that stage their own opening). */
  bare?: boolean
  /** Extra classes on the content wrapper. */
  className?: string
  /** Replaces the default max-width container. */
  wide?: boolean
}

/**
 * The shell every chapter page shares: a full-bleed atmospheric plate, the
 * chapter's title block, its content, and the footer that carries the reader
 * to the next chapter.
 */
export default function ChapterPage({
  chapter,
  children,
  weather = 'motes',
  bare = false,
  className = '',
  wide = false,
}: Props) {
  const { reduced } = useJourney()
  const { pathname } = useLocation()
  const { index, prev, next } = neighbours(pathname)

  return (
    <div className="relative min-h-[100svh] w-full">
      {/* ── backdrop ──────────────────────────────────────────────── */}
      <div aria-hidden="true" className="fixed inset-0 -z-10">
        <Plate id={chapter.plate} priority opacity={0.85} />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, rgb(var(--ink-rgb) / calc(.45 * var(--scrim-k))), rgb(var(--ink-rgb) / calc(.72 * var(--scrim-k))) 55%, rgb(var(--ink-rgb) / calc(.94 * var(--scrim-k))))`,
          }}
        />
        <GeometricPattern
          variant="khatam"
          opacity={0.035}
          scale={170}
          color={ac(chapter.accent)}
          drift={!reduced}
        />
        <ParticleField weather={weather} density={0.7} color={ac(chapter.accent)} opacity={0.5} />
        <Vignette strength={0.7} />
        <Grain opacity={0.03} />
      </div>

      {/* ── chapter marker ────────────────────────────────────────── */}
      <div className="pointer-events-none absolute top-24 left-4 z-20 flex items-baseline gap-3 sm:left-10">
        <span
          className="font-display text-xs tracking-[0.4em] tabular-nums"
          style={{ color: `${ac(chapter.accent)}88` }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="text-[0.64rem] tracking-[0.36em] text-ivory-dim/40 uppercase">
          {chapter.short}
        </span>
      </div>

      {/* ── content ───────────────────────────────────────────────── */}
      <div className={`relative z-10 px-5 pt-32 pb-8 sm:px-8 sm:pt-40 ${className}`}>
        {!bare && (
          <motion.header
            initial={reduced ? false : { opacity: 0, y: 26, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-3xl text-center"
          >
            <Kicker>{chapter.kicker}</Kicker>
            <h1 className="font-display mt-6 text-[clamp(2rem,6vw,4.2rem)] leading-[1.03] font-light">
              {chapter.title}
              {chapter.titleAccent && (
                <>
                  {' '}
                  <span className="text-gilded anim-shimmer">{chapter.titleAccent}</span>
                </>
              )}
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-sm leading-relaxed text-ivory-dim/70 sm:text-base">
              {chapter.standfirst}
            </p>
            <OrnamentDivider className="mt-12" color={ac(chapter.accent)} />
          </motion.header>
        )}

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: reduced ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
          className={bare ? '' : `mx-auto mt-16 ${wide ? 'max-w-6xl' : 'max-w-4xl'}`}
        >
          {children}
        </motion.div>
      </div>

      {/* ── on to the next chapter ────────────────────────────────── */}
      <ChapterFooter prev={prev} next={next} index={index} accent={ac(chapter.accent)} />
    </div>
  )
}

export function ChapterFooter({
  prev,
  next,
  index,
  accent,
}: {
  prev: Chapter | null
  next: Chapter | null
  index: number
  accent: string
}) {
  const { cue } = useJourney()

  return (
    <footer className="relative z-10 mt-20 border-t border-gold/12 bg-ink/60 backdrop-blur-sm">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-px sm:grid-cols-2">
        {prev ? (
          <Link
            to={prev.path}
            onClick={() => cue('select')}
            data-cursor="hover"
            className="group flex items-center gap-5 p-8 transition-colors duration-500 hover:bg-ivory/[.03] sm:p-10"
          >
            <ArrowLeft
              size={20}
              strokeWidth={1.2}
              className="shrink-0 text-gold/60 transition-transform duration-500 group-hover:-translate-x-1.5"
            />
            <span className="min-w-0">
              <span className="block text-[0.62rem] tracking-[0.32em] text-ivory-dim/40 uppercase">
                Previous chapter
              </span>
              <span className="font-display mt-1.5 block truncate text-xl font-light text-ivory/85 sm:text-2xl">
                {prev.short}
              </span>
            </span>
          </Link>
        ) : (
          <Link
            to="/"
            onClick={() => cue('select')}
            data-cursor="hover"
            className="group flex items-center gap-5 p-8 transition-colors duration-500 hover:bg-ivory/[.03] sm:p-10"
          >
            <ArrowLeft
              size={20}
              strokeWidth={1.2}
              className="shrink-0 text-gold/60 transition-transform duration-500 group-hover:-translate-x-1.5"
            />
            <span>
              <span className="block text-[0.62rem] tracking-[0.32em] text-ivory-dim/40 uppercase">
                Back to
              </span>
              <span className="font-display mt-1.5 block text-xl font-light text-ivory/85 sm:text-2xl">
                The beginning
              </span>
            </span>
          </Link>
        )}

        {next ? (
          <Link
            to={next.path}
            onClick={() => cue('select')}
            data-cursor="hover"
            className="group flex items-center justify-end gap-5 p-8 text-right transition-colors duration-500 hover:bg-ivory/[.03] sm:p-10"
          >
            <span className="min-w-0">
              <span className="block text-[0.62rem] tracking-[0.32em] uppercase" style={{ color: `${accent}99` }}>
                Next chapter
              </span>
              <span className="font-display mt-1.5 block truncate text-xl font-light text-ivory sm:text-2xl">
                {next.short}
              </span>
            </span>
            <ArrowRight
              size={20}
              strokeWidth={1.2}
              className="shrink-0 transition-transform duration-500 group-hover:translate-x-1.5"
              style={{ color: accent }}
            />
          </Link>
        ) : (
          <Link
            to="/"
            onClick={() => cue('select')}
            data-cursor="hover"
            className="group flex items-center justify-end gap-5 p-8 text-right transition-colors duration-500 hover:bg-ivory/[.03] sm:p-10"
          >
            <span>
              <span className="block text-[0.62rem] tracking-[0.32em] uppercase" style={{ color: `${accent}99` }}>
                The journey ends
              </span>
              <span className="font-display mt-1.5 block text-xl font-light text-ivory sm:text-2xl">
                Start again ↻
              </span>
            </span>
          </Link>
        )}
      </div>

      <p className="border-t border-gold/8 py-6 text-center text-[0.62rem] tracking-[0.34em] text-ivory-dim/30 uppercase">
        {String(index + 1).padStart(2, '0')} of {String(CHAPTERS.length).padStart(2, '0')} · Respect
        the Prophets ﷺ
      </p>
    </footer>
  )
}
