import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TRIALS, WHEEL } from '../data/journey'
import { useJourney } from '../lib/journey'
import SceneArt from '../components/visuals/SceneArt'
import ParticleField from '../components/visuals/ParticleField'
import Plate from '../components/Plate'
import { GeometricPattern, Rosette } from '../components/visuals/GeometricPattern'
import { Grain, Vignette } from '../components/ui'
import { Eyebrow, Statement } from './kit'

/* ================================================================== */
/*  SECTION 5 — THE TRIALS                                             */
/* ================================================================== */

export function TrialsScene() {
  const { reduced, cue, compact } = useJourney()
  const [open, setOpen] = useState<string | null>(null)
  const active = TRIALS.find((t) => t.id === open) ?? null

  return (
    <section
      id="trials"
      data-scene="trials"
      aria-label="The trials"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-5 py-24"
    >
      <div aria-hidden="true" className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(90% 65% at 50% 50%, rgba(9,12,20,.9), rgba(3,5,8,1) 74%)' }}
        />
        <AnimatePresence>
          {active && (
            <motion.div
              key={active.id}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4 }}
              className="absolute inset-0"
            >
              <Plate id={active.id} opacity={1} />
            </motion.div>
          )}
        </AnimatePresence>
        <ParticleField
          weather={active ? (active.id === 'nuh' ? 'rain' : active.id === 'ibrahim' ? 'embers' : 'sand') : 'dust'}
          density={0.7}
          color={active?.accent ?? '#8b6a42'}
          opacity={0.45}
        />
        <GeometricPattern variant="lattice" opacity={0.025} scale={120} color="#8b6a42" />
      </div>
      <Vignette strength={0.9} />
      <Grain opacity={0.035} />

      <div className="relative z-30 w-full max-w-6xl">
        <div className="text-center">
          <Eyebrow>Chapter Five</Eyebrow>
          <Statement size="lg" className="mx-auto mt-6 max-w-4xl">
            Great faith does not mean
            <br />
            <span className="text-gilded anim-shimmer uppercase">a life without trials.</span>
          </Statement>
        </div>

        {/* ── the three environments ───────────────────────────────── */}
        <ul className={`mt-16 grid gap-4 ${compact ? 'grid-cols-1' : 'grid-cols-3'}`}>
          {TRIALS.map((t) => {
            const on = open === t.id
            const dim = open !== null && !on
            return (
              <motion.li
                key={t.id}
                animate={{
                  opacity: dim ? 0.4 : 1,
                  flexGrow: on ? 1.6 : 1,
                }}
                transition={{ duration: reduced ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  type="button"
                  onClick={() => {
                    cue(on ? 'close' : 'select')
                    setOpen(on ? null : t.id)
                  }}
                  onMouseEnter={() => cue('hover')}
                  data-cursor="explore"
                  aria-pressed={on}
                  aria-label={`${t.element} — ${t.prophet}, ${t.quality}`}
                  className="group relative block h-full w-full cursor-pointer overflow-hidden border text-left transition-all duration-700"
                  style={{
                    borderColor: on ? `${t.accent}88` : 'rgba(211,173,104,.14)',
                    boxShadow: on ? `0 0 90px -32px ${t.accent}` : 'none',
                  }}
                >
                  <span className="relative block aspect-[4/3] w-full overflow-hidden">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 transition-transform duration-[1400ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.08]"
                      style={{ transform: on ? 'scale(1.08)' : undefined }}
                    >
                      <SceneArt art={t.id} progress={on ? 0.95 : 0.35} accent={t.accent} />
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 transition-opacity duration-700"
                      style={{
                        background: `linear-gradient(to bottom, rgba(4,7,11,.3), rgba(4,7,11,.72) 55%, rgba(4,7,11,.95))`,
                        opacity: on ? 0.85 : 1,
                      }}
                    />
                    <span className="absolute right-5 bottom-4 left-5">
                      <span
                        className="font-display block text-[clamp(1.8rem,4vw,2.8rem)] leading-none font-light uppercase transition-colors duration-500"
                        style={{ color: on ? '#f6e5bf' : '#ece4d5' }}
                      >
                        {t.element}
                      </span>
                      <span
                        className="mt-2 block text-[0.66rem] tracking-[0.28em] uppercase"
                        style={{ color: `${t.accent}cc` }}
                      >
                        {t.prophet} · {t.quality}
                      </span>
                    </span>
                  </span>

                  {/* expands on select */}
                  <span
                    className="grid bg-ink/85 transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)]"
                    style={{ gridTemplateRows: on ? '1fr' : '0fr' }}
                  >
                    <span className="overflow-hidden">
                      <span className="block px-6 py-6 text-sm leading-relaxed text-ivory/80">
                        {t.body}
                      </span>
                    </span>
                  </span>
                </button>
              </motion.li>
            )
          })}
        </ul>

        {/* ── the centre ───────────────────────────────────────────── */}
        <div className="mt-16 text-center">
          <div className="hairline mx-auto h-px w-40" aria-hidden="true" />
          <p className="font-display mt-8 text-[clamp(1.1rem,3.2vw,2rem)] tracking-[0.24em] font-light text-gold-soft uppercase">
            Patience <span className="text-gold/40">•</span> Courage <span className="text-gold/40">•</span> Trust
          </p>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-ivory-dim/55">
            Every one of them was tested, and none of them were spared because of who they were. The
            trial is not a sign that Allah has turned away.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ================================================================== */
/*  SECTION 6 — THE WHEEL OF CHARACTER                                 */
/* ================================================================== */

const R = 39 // % of the wheel box

export function LessonsScene() {
  const { reduced, cue, compact } = useJourney()
  const [index, setIndex] = useState<number | null>(null)
  const active = index !== null ? WHEEL[index] : null

  // The wheel turns so the chosen lesson comes to the top.
  const rotation = index === null ? 0 : -(index / WHEEL.length) * 360

  return (
    <section
      id="lessons"
      data-scene="lessons"
      aria-label="What can we learn"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-5 py-24"
    >
      <div aria-hidden="true" className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(80% 62% at 50% 48%, rgba(11,28,34,.62), rgba(4,7,11,1) 74%)' }}
        />
        <GeometricPattern variant="khatam" opacity={0.04} scale={165} color="#8ec6a8" drift={!reduced} />
        <ParticleField weather="motes" density={0.65} color="#8ec6a8" opacity={0.45} />
      </div>
      <Vignette strength={0.85} />
      <Grain opacity={0.03} />

      <div className="relative z-30 w-full max-w-6xl">
        <div className="text-center">
          <Eyebrow color="#8ec6a8">Chapter Six</Eyebrow>
          <Statement size="md" gilded className="mt-5">
            What can we learn?
          </Statement>
        </div>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
          {/* ── the wheel ────────────────────────────────────────── */}
          <div className="relative mx-auto aspect-square w-full max-w-[min(86vw,520px)]">
            <div aria-hidden="true" className="absolute inset-0">
              <Rosette
                className="absolute inset-0 h-full w-full opacity-20"
                progress={1}
                spin={!reduced}
                color="#4c8f83"
              />
              <div className="absolute inset-[12%] rounded-full border border-gold/12" />
              <div className="absolute inset-[30%] rounded-full border border-gold/10" />
            </div>

            {/* the marker the wheel turns toward */}
            <span
              aria-hidden="true"
              className="absolute top-[2%] left-1/2 z-10 h-4 w-px -translate-x-1/2"
              style={{ background: 'linear-gradient(to bottom, #f6e5bf, transparent)' }}
            />

            <motion.div
              className="absolute inset-0"
              animate={{ rotate: reduced ? 0 : rotation }}
              transition={{ duration: reduced ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {WHEEL.map((l, i) => {
                const a = (i / WHEEL.length) * Math.PI * 2 - Math.PI / 2
                const on = index === i
                const dim = index !== null && !on
                return (
                  <motion.button
                    key={l.id}
                    type="button"
                    onClick={() => {
                      cue(on ? 'close' : 'select')
                      setIndex(on ? null : i)
                    }}
                    onMouseEnter={() => cue('hover')}
                    data-cursor="explore"
                    aria-pressed={on}
                    aria-label={`${l.title} — ${l.arabic}`}
                    className="group absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center"
                    style={{ left: `${50 + Math.cos(a) * R}%`, top: `${50 + Math.sin(a) * R}%` }}
                    animate={{ opacity: dim ? 0.32 : 1, scale: on ? 1.14 : 1 }}
                    transition={{ duration: reduced ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* keep the labels upright while the wheel turns */}
                    <motion.span
                      className="flex flex-col items-center"
                      animate={{ rotate: reduced ? 0 : -rotation }}
                      transition={{ duration: reduced ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute top-1/2 left-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2"
                      />
                      <span
                        className="relative flex h-[clamp(2.6rem,8vw,3.6rem)] w-[clamp(2.6rem,8vw,3.6rem)] items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-500"
                        style={{
                          borderColor: on ? '#f6e5bf' : 'rgba(211,173,104,.3)',
                          background: on ? 'rgba(211,173,104,.16)' : 'rgba(4,7,11,.8)',
                          boxShadow: on ? '0 0 44px -6px rgba(211,173,104,.75)' : 'none',
                        }}
                      >
                        <span className="font-arabic text-base text-gold-soft sm:text-lg" lang="ar">
                          {l.arabic.slice(0, 3)}
                        </span>
                      </span>
                      <span
                        className={`mt-2 text-[0.64rem] tracking-[0.18em] whitespace-nowrap uppercase transition-colors duration-500 ${
                          on ? 'text-gold-bright' : 'text-ivory-dim/55 group-hover:text-gold-soft'
                        }`}
                      >
                        {l.title}
                      </span>
                    </motion.span>
                  </motion.button>
                )
              })}
            </motion.div>

            {/* centre */}
            <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center">
              <span
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
                style={{ background: 'radial-gradient(circle, rgba(246,229,191,.35), transparent 70%)' }}
              />
              <p className="font-display text-gilded relative text-xl tracking-[0.26em] uppercase sm:text-2xl">
                Character
              </p>
            </div>
          </div>

          {/* ── the explanation ──────────────────────────────────── */}
          <div className="flex min-h-[18rem] items-center justify-center">
            <AnimatePresence mode="wait">
              {active ? (
                <motion.div
                  key={active.id}
                  initial={reduced ? false : { opacity: 0, x: compact ? 0 : 22, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{
                    opacity: 0,
                    x: compact ? 0 : -14,
                    filter: 'blur(8px)',
                    transition: { duration: reduced ? 0 : 0.2 },
                  }}
                  transition={{ duration: reduced ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="surface-glass w-full max-w-lg p-8 sm:p-10"
                  role="status"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-3xl font-light text-gold-bright">{active.title}</h3>
                    <p className="font-arabic text-2xl text-gold/65" lang="ar">
                      {active.arabic}
                    </p>
                  </div>
                  <div className="hairline my-6 h-px w-full" aria-hidden="true" />
                  <p className="text-sm leading-relaxed text-ivory/80 sm:text-[0.95rem]">{active.body}</p>
                  <p className="mt-6 text-[0.64rem] tracking-[0.28em] text-gold/50 uppercase">
                    {active.reference}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="prompt"
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.18 } }}
                  className="max-w-sm text-center"
                >
                  <p className="text-[0.66rem] tracking-[0.34em] text-ivory-dim/40 uppercase">
                    Turn the wheel
                  </p>
                  <p className="mt-6 text-sm leading-relaxed text-ivory-dim/55">
                    Eight qualities that run through every one of their lives. Select one and the
                    wheel brings it to the top.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
