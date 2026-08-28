import { ac } from '../lib/art'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { PROPHETS, type ArtKey } from '../data/prophets'
import { CHAPTER_BY_PATH } from '../data/chapters'
import { useJourney } from '../lib/journey'
import ChapterPage from '../components/ChapterPage'
import ProphetGlyph from '../components/visuals/ProphetGlyph'
import { GoldButton, useInViewSafe } from '../components/ui'

const CH = CHAPTER_BY_PATH['/constellation']
const CORE = { x: 50, y: 50 }

export default function ConstellationPage() {
  const { reduced, cue, compact } = useJourney()
  const [sel, setSel] = useState<ArtKey | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const inView = useInViewSafe(mapRef, { once: true, amount: 0.2 })

  const active = sel ? PROPHETS.find((p) => p.id === sel)! : null

  return (
    <ChapterPage chapter={CH} weather="stars" wide>
      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-center">
        {/* ── the map ────────────────────────────────────────────── */}
        <div
          ref={mapRef}
          className="relative aspect-[4/3] w-full select-none"
          role="group"
          aria-label="Constellation map. Select a star to read about that prophet."
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            {PROPHETS.map((p, i) => {
              const on = sel === p.id
              return (
                <line
                  key={`c-${p.id}`}
                  x1={p.star.x}
                  y1={p.star.y}
                  x2={CORE.x}
                  y2={CORE.y}
                  stroke={on ? ac(p.accent) : 'var(--color-gold)'}
                  strokeWidth={on ? 1 : 0.6}
                  vectorEffect="non-scaling-stroke"
                  strokeOpacity={sel ? (on ? 0.8 : 0.05) : 0.14}
                  strokeDasharray={reduced ? undefined : 220}
                  strokeDashoffset={reduced || inView ? 0 : 220}
                  style={{
                    transition: `stroke-dashoffset 1.6s cubic-bezier(.16,1,.3,1) ${i * 0.07}s, stroke-opacity .7s, stroke-width .7s`,
                  }}
                />
              )
            })}
            {PROPHETS.slice(0, -1).map((p, i) => {
              const q = PROPHETS[i + 1]
              return (
                <line
                  key={`p-${p.id}`}
                  x1={p.star.x}
                  y1={p.star.y}
                  x2={q.star.x}
                  y2={q.star.y}
                  stroke="#e7cd9b"
                  strokeWidth="0.5"
                  vectorEffect="non-scaling-stroke"
                  strokeOpacity={sel ? 0.06 : 0.22}
                  strokeDasharray={reduced ? undefined : 160}
                  strokeDashoffset={reduced || inView ? 0 : 160}
                  style={{
                    transition: `stroke-dashoffset 1.4s cubic-bezier(.16,1,.3,1) ${0.4 + i * 0.09}s, stroke-opacity .7s`,
                  }}
                />
              )
            })}
          </svg>

          {/* the core */}
          <motion.div
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ left: `${CORE.x}%`, top: `${CORE.y}%` }}
            initial={reduced ? false : { opacity: 0, scale: 0.7 }}
            animate={inView || reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
            transition={{ duration: 1.6, delay: reduced ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl sm:h-36 sm:w-36"
              style={{ background: 'radial-gradient(circle, rgb(var(--gold-bright-rgb) / .5), transparent 70%)' }}
            />
            {!reduced && (
              <span
                aria-hidden="true"
                className="anim-pulse-ring absolute top-1/2 left-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/50"
              />
            )}
            <span className="relative block h-3 w-3 translate-x-[calc(50%-0.375rem)] rounded-full bg-gold-bright shadow-[0_0_28px_6px_rgb(var(--gold-bright-rgb) / .6)]" />
            <span
              className="font-arabic relative mt-4 block text-lg whitespace-nowrap text-gold-soft sm:text-2xl"
              lang="ar"
            >
              لَا إِلَٰهَ إِلَّا اللَّه
            </span>
            <span className="relative mt-2 block text-[0.62rem] tracking-[0.34em] whitespace-nowrap text-gold/70 uppercase sm:text-[0.68rem]">
              Worship Allah alone
            </span>
          </motion.div>

          {/* the stars */}
          {PROPHETS.map((p, i) => {
            const on = sel === p.id
            const dim = sel !== null && !on
            return (
              <motion.button
                key={p.id}
                type="button"
                onClick={() => {
                  cue(on ? 'close' : 'select')
                  setSel(on ? null : p.id)
                }}
                onMouseEnter={() => cue('hover')}
                data-cursor="explore"
                aria-pressed={on}
                aria-label={`${p.name} ${p.honorific} — ${p.lesson}`}
                className="group absolute z-20 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center"
                style={{ left: `${p.star.x}%`, top: `${p.star.y}%` }}
                initial={reduced ? false : { opacity: 0, scale: 0.4 }}
                animate={
                  inView || reduced
                    ? { opacity: dim ? 0.3 : 1, scale: on ? 1.25 : 1 }
                    : { opacity: 0, scale: 0.4 }
                }
                transition={{
                  duration: reduced ? 0 : 0.9,
                  delay: reduced ? 0 : 0.3 + i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {/* comfortable touch target, independent of the visual dot */}
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2"
                />
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-md transition-all duration-500 group-hover:blur-lg"
                  style={{
                    width: `${p.star.mag * 22}px`,
                    height: `${p.star.mag * 22}px`,
                    background: `radial-gradient(circle, ${ac(p.accent)}88, transparent 70%)`,
                  }}
                />
                <span
                  className="relative block rounded-full transition-transform duration-500 group-hover:scale-150"
                  style={{
                    width: `${p.star.mag * 5}px`,
                    height: `${p.star.mag * 5}px`,
                    background: ac(p.accent),
                    boxShadow: `0 0 ${p.star.mag * 10}px ${ac(p.accent)}`,
                  }}
                />
                <span
                  className={`pointer-events-none mt-2.5 text-[0.62rem] tracking-[0.2em] whitespace-nowrap uppercase transition-all duration-500 sm:text-[0.66rem] ${
                    on ? 'text-gold-bright' : 'text-ivory-dim/50 group-hover:text-gold-soft'
                  }`}
                >
                  {p.name}
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* ── the read-out ───────────────────────────────────────── */}
        <div className="min-h-[22rem]">
          <AnimatePresence mode="wait">
            {active ? (
              <motion.div
                key={active.id}
                initial={reduced ? false : { opacity: 0, x: compact ? 0 : 24, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{
                  opacity: 0,
                  x: compact ? 0 : -16,
                  filter: 'blur(8px)',
                  transition: { duration: reduced ? 0 : 0.22 },
                }}
                transition={{ duration: reduced ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="surface-glass relative p-8"
                role="status"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-0 h-px w-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${ac(active.accent)}, transparent)`,
                  }}
                />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-3xl font-light text-ivory">
                      {active.name}
                      <span className="ml-2 text-sm text-gold/60">{active.honorific}</span>
                    </h2>
                    <p className="font-arabic mt-1 text-xl" style={{ color: ac(active.accent) }} lang="ar">
                      {active.arabic}
                    </p>
                  </div>
                  <ProphetGlyph id={active.id} className="h-9 w-9 shrink-0" color={ac(active.accent)} />
                </div>

                <div className="hairline my-6 h-px w-full" aria-hidden="true" />

                <p className="text-[0.64rem] tracking-[0.32em] text-gold/50 uppercase">Major themes</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {active.themes.map((t) => (
                    <li
                      key={t}
                      className="border px-2.5 py-1 text-[0.64rem] tracking-[0.18em] uppercase"
                      style={{ borderColor: `${ac(active.accent)}33`, color: `${ac(active.accent)}cc` }}
                    >
                      {t}
                    </li>
                  ))}
                </ul>

                <p className="mt-7 text-[0.64rem] tracking-[0.32em] text-gold/50 uppercase">Key lesson</p>
                <p className="font-display mt-2 text-lg leading-relaxed font-light text-ivory/85 italic">
                  {active.lesson}
                </p>

                <p className="mt-7 text-[0.64rem] tracking-[0.32em] text-gold/50 uppercase">
                  Qur’an references
                </p>
                <ul className="mt-3 space-y-2">
                  {active.quran.map((q) => (
                    <li key={q.ref} className="text-[0.78rem] leading-relaxed text-ivory-dim/70">
                      <span className="text-gold-soft">{q.surah}</span>{' '}
                      <span className="text-gold/55 tabular-nums">{q.ref}</span>
                      <span className="text-ivory-dim/45"> — {q.note}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link to={`/prophets/${active.id}`} onClick={() => cue('open')}>
                    <GoldButton size="sm">Open the scene</GoldButton>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.18 } }}
                className="flex h-full flex-col justify-center border border-gold/10 p-8 text-center lg:text-left"
              >
                <p className="font-display text-[clamp(1.1rem,2.6vw,1.6rem)] leading-relaxed font-light text-ivory/60 italic">
                  “And We sent not before you any messenger except that We revealed to him that:
                  there is no deity except Me, so worship Me.”
                </p>
                <p className="mt-5 text-[0.66rem] tracking-[0.3em] text-gold/55 uppercase">
                  Surah Al-Anbiya · 21:25
                </p>
                <div className="hairline my-7 h-px w-full" aria-hidden="true" />
                <p className="text-[0.64rem] tracking-[0.3em] text-ivory-dim/40 uppercase">
                  Select a star to explore
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ChapterPage>
  )
}
