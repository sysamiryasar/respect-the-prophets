import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PATH_PROPHETS } from '../data/journey'
import { PROPHET_BY_ID } from '../data/prophets'
import { useJourney } from '../lib/journey'
import ParticleField from '../components/visuals/ParticleField'
import ProphetGlyph from '../components/visuals/ProphetGlyph'
import Plate from '../components/Plate'
import { OrnamentDivider } from '../components/visuals/GeometricPattern'
import { Grain, Vignette, useInViewSafe } from '../components/ui'
import { Eyebrow, Statement } from './kit'
import { useRef } from 'react'

/** The golden path the points sit on, in a 0–100 space. */
const PATH_D =
  'M2,62 C12,56 16,36 22,34 C30,31 30,64 37,66 C46,68 46,30 52,30 C60,30 60,66 67,64 C76,62 74,34 81,36 C89,38 88,58 98,58'

export function ProphetsScene() {
  const { reduced, cue, compact } = useJourney()
  const [open, setOpen] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const inView = useInViewSafe(mapRef, { once: true, amount: 0.25 })

  const point = PATH_PROPHETS.find((p) => p.id === open) ?? null
  const prophet = point ? PROPHET_BY_ID[point.id] : null

  return (
    <section
      id="prophets"
      data-scene="prophets"
      aria-label="The Prophets"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center px-5 py-24"
    >
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <AnimatePresence>
          {prophet && (
            <motion.div
              key={prophet.id}
              initial={reduced ? false : { opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Plate id={prophet.id} opacity={0.55} />
            </motion.div>
          )}
        </AnimatePresence>
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(85% 60% at 50% 50%, rgba(10,17,32,.72), rgba(4,7,11,1) 76%)',
          }}
        />
        <ParticleField
          weather="stars"
          density={1.2}
          color={prophet?.accent ?? '#e7cd9b'}
          opacity={0.7}
        />
      </div>
      <Vignette strength={0.85} />
      <Grain opacity={0.03} />

      <div className="relative z-30 w-full max-w-6xl">
        <div className="text-center">
          <Eyebrow>Chapter Three</Eyebrow>
          <Statement size="md" gilded className="mt-5">
            The Messengers
          </Statement>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-ivory-dim/65 sm:text-base">
            Seven of them, on one golden path. The Qur’an names twenty-five and tells us there were
            many more whose stories were not related to us — so this is a selection, not a complete
            list, and the exact chronology of most of these lives is not established.
          </p>
        </div>

        <OrnamentDivider className="my-12" />

        {/* ── the golden path ──────────────────────────────────────── */}
        <div
          ref={mapRef}
          className={`relative mx-auto w-full ${compact ? 'h-[34rem] max-w-sm' : 'h-[22rem] max-w-5xl'}`}
          role="group"
          aria-label="A golden path of seven prophets. Select a point to read about that prophet."
        >
          {!compact && (
            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full overflow-visible"
            >
              <path
                d={PATH_D}
                fill="none"
                stroke="#d3ad68"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
                strokeOpacity="0.12"
                strokeLinecap="round"
              />
              <path
                d={PATH_D}
                fill="none"
                stroke="#f6e5bf"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
                strokeOpacity="0.55"
                strokeLinecap="round"
                strokeDasharray="600"
                strokeDashoffset={reduced || inView ? 0 : 600}
                style={{ transition: 'stroke-dashoffset 2.6s cubic-bezier(.16,1,.3,1)' }}
              />
            </svg>
          )}
          {compact && (
            <span
              aria-hidden="true"
              className="absolute top-0 bottom-0 left-6 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent"
            />
          )}

          {PATH_PROPHETS.map((pt, i) => {
            const p = PROPHET_BY_ID[pt.id]
            const on = open === pt.id
            const dim = open !== null && !on
            const pos = compact
              ? { left: '1.5rem', top: `${(i / (PATH_PROPHETS.length - 1)) * 92 + 4}%` }
              : { left: `${pt.x}%`, top: `${pt.y}%` }

            return (
              <motion.button
                key={pt.id}
                type="button"
                onClick={() => {
                  cue(on ? 'close' : 'select')
                  setOpen(on ? null : pt.id)
                }}
                onMouseEnter={() => cue('hover')}
                data-cursor="explore"
                aria-pressed={on}
                aria-label={`${p.name} ${p.honorific} — ${pt.lesson}`}
                className={`group absolute z-20 flex cursor-pointer items-center ${
                  compact ? 'gap-4 -translate-y-1/2' : '-translate-x-1/2 -translate-y-1/2 flex-col'
                }`}
                style={pos}
                initial={reduced ? false : { opacity: 0, scale: 0.4 }}
                animate={
                  inView || reduced
                    ? { opacity: dim ? 0.32 : 1, scale: on ? 1.18 : 1 }
                    : { opacity: 0, scale: 0.4 }
                }
                transition={{
                  duration: reduced ? 0 : 0.9,
                  delay: reduced ? 0 : 0.5 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <span aria-hidden="true" className="absolute top-1/2 left-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2" />
                <span
                  className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-500 group-hover:scale-110"
                  style={{
                    borderColor: on ? p.accent : `${p.accent}55`,
                    background: `radial-gradient(circle, ${p.accent}22, rgba(4,7,11,.85) 72%)`,
                    boxShadow: on ? `0 0 34px -4px ${p.accent}` : 'none',
                  }}
                >
                  <ProphetGlyph id={pt.id} className="h-6 w-6" color={p.accent} />
                </span>
                <span className={compact ? 'text-left' : 'mt-3 text-center'}>
                  <span
                    className={`block text-[0.7rem] tracking-[0.22em] whitespace-nowrap uppercase transition-colors duration-500 ${
                      on ? 'text-gold-bright' : 'text-ivory-dim/65 group-hover:text-gold-soft'
                    }`}
                  >
                    {p.name}
                  </span>
                  <span className="block text-[0.62rem] tracking-[0.2em] whitespace-nowrap text-ivory-dim/35 uppercase">
                    {pt.lesson}
                  </span>
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* ── the cinematic panel ──────────────────────────────────── */}
        <div className="mt-14 flex min-h-[19rem] justify-center">
          <AnimatePresence mode="wait">
            {point && prophet ? (
              <motion.article
                key={point.id}
                initial={reduced ? false : { opacity: 0, y: 30, filter: 'blur(14px)', scale: 0.98 }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                exit={{
                  opacity: 0,
                  y: -16,
                  filter: 'blur(10px)',
                  transition: { duration: reduced ? 0 : 0.24 },
                }}
                transition={{ duration: reduced ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="surface-glass relative w-full max-w-3xl overflow-hidden p-8 sm:p-11"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-0 h-px w-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${prophet.accent}, transparent)`,
                  }}
                />
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <p className="font-arabic text-2xl" style={{ color: prophet.accent }} lang="ar">
                      {prophet.arabic}
                    </p>
                    <h3 className="font-display mt-2 text-4xl leading-none font-light text-ivory sm:text-5xl">
                      {prophet.name}
                      <span className="ml-2 align-middle text-[0.3em] tracking-normal text-gold/60">
                        {prophet.honorific}
                      </span>
                    </h3>
                  </div>
                  <ProphetGlyph id={point.id} className="h-10 w-10 shrink-0" color={prophet.accent} />
                </div>

                <div className="hairline my-7 h-px w-full" aria-hidden="true" />

                <dl className="grid gap-7 sm:grid-cols-2">
                  <div>
                    <dt className="text-[0.64rem] tracking-[0.32em] text-gold/50 uppercase">
                      Symbolic environment
                    </dt>
                    <dd className="font-display mt-2 text-lg leading-snug font-light text-ivory/85 italic">
                      {point.environment}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.64rem] tracking-[0.32em] text-gold/50 uppercase">
                      Major lesson
                    </dt>
                    <dd
                      className="font-display mt-2 text-lg leading-snug"
                      style={{ color: prophet.accent }}
                    >
                      {point.lesson}
                    </dd>
                  </div>
                </dl>

                <p className="mt-8 text-sm leading-relaxed text-ivory/75 sm:text-[0.95rem]">
                  {point.summary}
                </p>

                <p className="mt-7 text-[0.64rem] tracking-[0.26em] text-ivory-dim/35 uppercase">
                  {prophet.quran.map((q) => `${q.surah} ${q.ref}`).join('  ·  ')}
                </p>
              </motion.article>
            ) : (
              <motion.p
                key="prompt"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.18 } }}
                className="self-center text-center text-[0.66rem] tracking-[0.34em] text-ivory-dim/40 uppercase"
              >
                Select a point on the path
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
