import { useState } from 'react'
import { AnimatePresence, motion, useTransform, type MotionValue } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { QUALITIES, RESPECT_STEPS, FINAL_LINES } from '../data/journey'
import { VERSES } from '../data/content'
import { PROPHET_BY_ID } from '../data/prophets'
import { useJourney } from '../lib/journey'
import SceneArt from '../components/visuals/SceneArt'
import ParticleField from '../components/visuals/ParticleField'
import Plate from '../components/Plate'
import { GeometricPattern, Rosette, OrnamentDivider } from '../components/visuals/GeometricPattern'
import { GoldButton, Grain, SourceTag, Vignette } from '../components/ui'
import { Beat, Eyebrow, InfoPanel, Scene, SceneRail, SceneVeil, Statement } from './kit'

const MERCY = VERSES.find((v) => v.id === 'v-21-107')!
const M = PROPHET_BY_ID.muhammad

/* ================================================================== */
/*  SECTION 7 — MUHAMMAD ﷺ                                             */
/* ================================================================== */

export function MuhammadScene() {
  const { reduced, cue } = useJourney()
  const [open, setOpen] = useState<string | null>(null)
  const active = QUALITIES.find((q) => q.id === open) ?? null

  return (
    <div id="muhammad" data-scene="muhammad">
      {/* ── the reveal ───────────────────────────────────────────── */}
      <Scene
        id="muhammad-reveal"
        height={380}
        label="Muhammad ﷺ, the final Messenger of Allah"
        backdrop={(prog, step) => <MuhammadBackdrop progress={prog} step={step} />}
        flat={
          <div className="relative overflow-hidden px-5 py-24 text-center">
            <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-50">
              <SceneArt art="muhammad" progress={0.9} accent={M.accent} />
            </div>
            <div className="absolute inset-0 -z-10 bg-ink/72" aria-hidden="true" />
            <Eyebrow color={M.accent}>Chapter Seven</Eyebrow>
            <h2 className="font-display text-gilded mt-6 text-[clamp(2.4rem,9vw,6rem)] leading-none font-light uppercase">
              Muhammad ﷺ
            </h2>
            <p className="mt-6 text-[0.7rem] tracking-[0.4em] text-ivory-dim/60 uppercase">
              The final Messenger of Allah
            </p>
          </div>
        }
      >
        {(prog) => (
          <>
            <Beat progress={prog} from={0} to={0.28}>
              <Eyebrow color={M.accent}>Chapter Seven</Eyebrow>
              <Statement size="md" className="mt-7">
                A quiet night over the desert.
              </Statement>
            </Beat>

            <Beat progress={prog} from={0.28} to={0.54}>
              <p className="font-arabic text-4xl sm:text-6xl" style={{ color: M.accent }} lang="ar">
                {M.arabic}
              </p>
              <h2 className="font-display text-gilded anim-shimmer mt-6 text-[clamp(2.4rem,11vw,7.5rem)] leading-none font-light uppercase">
                Muhammad ﷺ
              </h2>
            </Beat>

            <Beat progress={prog} from={0.54} to={0.76}>
              <Statement size="lg" gilded>
                The final Messenger
                <br />
                of Allah
              </Statement>
            </Beat>

            <Beat progress={prog} from={0.76} to={1} hold>
              <figure className="mx-auto max-w-2xl">
                <SourceTag kind="quran" />
                <p
                  lang="ar"
                  dir="rtl"
                  className="font-arabic mt-7 text-[clamp(1.4rem,4vw,2.4rem)] leading-[2]"
                  style={{ color: M.accent }}
                >
                  {MERCY.arabic}
                </p>
                <div className="hairline my-7 h-px w-full" aria-hidden="true" />
                <blockquote className="font-display text-[clamp(1.05rem,2.6vw,1.5rem)] leading-relaxed font-light text-ivory/85 italic">
                  “{MERCY.translation}”
                </blockquote>
                <figcaption className="mt-5 text-[0.66rem] tracking-[0.3em] text-gold/60 uppercase">
                  Surah Al-Anbiya · 21:107
                </figcaption>
              </figure>
            </Beat>
          </>
        )}
      </Scene>

      {/* ── the five qualities ───────────────────────────────────── */}
      <section
        aria-label="Five qualities of the Messenger ﷺ"
        className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-5 py-24"
      >
        <div aria-hidden="true" className="absolute inset-0">
          <Plate id="muhammad" opacity={0.8} />
          <div className="absolute inset-0 opacity-70">
            <SceneArt art="muhammad" progress={0.95} accent={M.accent} />
          </div>
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(4,7,11,.7), rgba(4,7,11,.8) 50%, rgba(4,7,11,.96))',
            }}
          />
          <ParticleField weather="stars" density={1.1} color={M.accent} opacity={0.6} />
          <GeometricPattern variant="khatam" opacity={0.03} scale={175} color={M.accent} />
        </div>
        <Vignette strength={0.85} />
        <Grain opacity={0.03} />

        <div className="relative z-30 w-full max-w-4xl text-center">
          <p className="text-[0.66rem] tracking-[0.44em] uppercase" style={{ color: `${M.accent}bb` }}>
            His character, in five words
          </p>

          {/* floating qualities */}
          <ul className="mt-14 flex flex-wrap items-center justify-center gap-x-4 gap-y-5">
            {QUALITIES.map((q, i) => {
              const on = open === q.id
              const dim = open !== null && !on
              return (
                <motion.li
                  key={q.id}
                  animate={{ opacity: dim ? 0.35 : 1, y: reduced ? 0 : on ? -6 : 0 }}
                  transition={{ duration: reduced ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
                  style={
                    reduced
                      ? undefined
                      : { animation: `rtp-breathe ${7 + i * 1.3}s ease-in-out ${i * 0.7}s infinite` }
                  }
                >
                  <button
                    type="button"
                    onClick={() => {
                      cue(on ? 'close' : 'select')
                      setOpen(on ? null : q.id)
                    }}
                    onMouseEnter={() => cue('hover')}
                    data-cursor="explore"
                    aria-pressed={on}
                    className="group relative cursor-pointer border px-6 py-4 text-[0.72rem] tracking-[0.26em] uppercase transition-all duration-500 sm:px-8"
                    style={{
                      borderColor: on ? M.accent : `${M.accent}33`,
                      color: on ? '#f6e5bf' : `${M.accent}dd`,
                      background: on ? `${M.accent}1c` : 'rgba(4,7,11,.45)',
                      boxShadow: on ? `0 0 50px -12px ${M.accent}` : 'none',
                    }}
                  >
                    {q.title}
                  </button>
                </motion.li>
              )
            })}
          </ul>

          <div className="mt-12 flex min-h-[13rem] justify-center">
            <AnimatePresence mode="wait">
              {active ? (
                <InfoPanel
                  key={active.id}
                  title={active.title}
                  accent={M.accent}
                  onClose={() => {
                    cue('close')
                    setOpen(null)
                  }}
                >
                  {active.body}
                </InfoPanel>
              ) : (
                <motion.p
                  key="prompt"
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.18 } }}
                  className="self-center text-[0.66rem] tracking-[0.34em] text-ivory-dim/40 uppercase"
                >
                  Select one to reveal it
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  )
}

function MuhammadBackdrop({ progress, step }: { progress: MotionValue<number>; step: number }) {
  const scale = useTransform(progress, [0, 1], [1.16, 1.02])
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <Plate id="muhammad" opacity={0.9} />
      <motion.div className="absolute inset-0 opacity-85" style={{ scale }}>
        <SceneArt art="muhammad" progress={step / 40} accent={M.accent} />
      </motion.div>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(4,7,11,.52), rgba(4,7,11,.28) 40%, rgba(4,7,11,.88))',
        }}
      />
      <ParticleField weather="stars" density={1} color={M.accent} opacity={0.6} />
      <SceneVeil progress={progress} />
      <Vignette strength={0.84} />
      <Grain opacity={0.032} />
      <SceneRail progress={progress} accent={M.accent} />
    </div>
  )
}

/* ================================================================== */
/*  SECTION 8 — HOW DO WE SHOW RESPECT?                                */
/* ================================================================== */

export function ActionScene() {
  const { cue } = useJourney()
  const [open, setOpen] = useState<number | null>(4)

  return (
    <section
      id="action"
      data-scene="action"
      aria-label="How do we show respect"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-5 py-24"
    >
      <div aria-hidden="true" className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(80% 70% at 50% 100%, rgba(211,173,104,.14), rgba(4,7,11,1) 70%)' }}
        />
        <GeometricPattern variant="weave" opacity={0.03} scale={130} color="#d3ad68" />
        <ParticleField weather="dust" density={0.6} color="#d3ad68" opacity={0.45} />
      </div>
      <Vignette strength={0.85} />
      <Grain opacity={0.03} />

      <div className="relative z-30 w-full max-w-3xl">
        <div className="text-center">
          <Eyebrow>Chapter Eight</Eyebrow>
          <Statement size="md" gilded className="mt-5">
            How do we show respect?
          </Statement>
        </div>

        {/* the path climbs as you go down the list */}
        <ol className="mt-16 space-y-3">
          {RESPECT_STEPS.map((s, i) => {
            const on = open === i
            const last = i === RESPECT_STEPS.length - 1
            return (
              <li key={s.n} style={{ marginLeft: `${i * 4}%` }}>
                <button
                  type="button"
                  onClick={() => {
                    cue(on ? 'close' : 'select')
                    setOpen(on ? null : i)
                  }}
                  onMouseEnter={() => cue('hover')}
                  data-cursor="explore"
                  aria-expanded={on}
                  className="group relative block w-full cursor-pointer overflow-hidden border text-left transition-all duration-700"
                  style={{
                    borderColor: on ? 'rgba(211,173,104,.6)' : 'rgba(211,173,104,.14)',
                    background: on ? 'rgba(9,14,24,.86)' : 'rgba(6,10,17,.6)',
                    boxShadow: on ? '0 0 70px -26px rgba(211,173,104,.85)' : 'none',
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent transition-all duration-700"
                    style={{ width: on ? '100%' : '0%' }}
                  />
                  <span className="flex items-baseline gap-5 px-6 py-6 sm:px-8">
                    <span
                      className="font-display shrink-0 text-[0.72rem] tracking-[0.3em] tabular-nums transition-colors duration-500"
                      style={{ color: on ? '#d3ad68' : 'rgba(211,173,104,.45)' }}
                    >
                      {s.n}
                    </span>
                    <span
                      className={`font-display leading-none font-light uppercase transition-all duration-700 ${
                        last
                          ? 'text-[clamp(1.7rem,6vw,3.4rem)]'
                          : 'text-[clamp(1.2rem,3.6vw,2rem)]'
                      }`}
                      style={{ color: on ? '#f6e5bf' : '#ece4d5' }}
                    >
                      {s.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className="ml-auto shrink-0 text-gold/40 transition-transform duration-500"
                      style={{ transform: on ? 'rotate(90deg)' : 'none' }}
                    >
                      ›
                    </span>
                  </span>
                  <span
                    className="grid transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)]"
                    style={{ gridTemplateRows: on ? '1fr' : '0fr' }}
                  >
                    <span className="overflow-hidden">
                      <span className="block px-6 pb-7 pl-[3.6rem] text-sm leading-relaxed text-ivory/78 sm:px-8 sm:pl-[4.4rem] sm:text-[0.95rem]">
                        {s.body}
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        <p className="font-display mt-16 text-center text-[clamp(1.4rem,5vw,2.8rem)] leading-tight font-light">
          <span className="text-gilded anim-shimmer uppercase">Live the lessons.</span>
        </p>
      </div>
    </section>
  )
}

/* ================================================================== */
/*  FINAL SCENE                                                        */
/* ================================================================== */

export function FinalScene() {
  const { reduced, cue } = useJourney()

  const restart = () => {
    cue('open')
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  const WINDOWS = FINAL_LINES.length + 2

  return (
    <div id="final" data-scene="final">
      <Scene
        id="final-scene"
        height={WINDOWS * 90}
        label="The final message"
        backdrop={(prog) => <DawnBackdrop progress={prog} />}
        flat={
          <div className="relative overflow-hidden px-5 py-24 text-center">
            <div aria-hidden="true" className="absolute inset-0 -z-10">
              <Plate id="ch-final" opacity={0.7} />
              <div className="absolute inset-0 bg-ink/70" />
            </div>
            <ul className="space-y-4">
              {FINAL_LINES.map((l) => (
                <li key={l} className="font-display text-2xl font-light text-ivory/70">
                  {l}
                </li>
              ))}
            </ul>
            <p className="font-display text-gilded mt-10 text-[clamp(2.4rem,10vw,5rem)] leading-none font-light uppercase">
              Worship Allah.
            </p>
            <ClosingLines />
          </div>
        }
      >
        {(prog) => (
          <>
            {FINAL_LINES.map((line, i) => (
              <Beat key={line} progress={prog} from={i / WINDOWS} to={(i + 1) / WINDOWS}>
                <Statement size={i === FINAL_LINES.length - 1 ? 'lg' : 'md'}>
                  <span className={i === FINAL_LINES.length - 1 ? 'text-gold-soft' : 'text-ivory/60'}>
                    {line}
                  </span>
                </Statement>
              </Beat>
            ))}

            <Beat progress={prog} from={FINAL_LINES.length / WINDOWS} to={(FINAL_LINES.length + 1) / WINDOWS}>
              <Statement size="xl" gilded>
                Worship
                <br />
                Allah.
              </Statement>
            </Beat>

            <Beat progress={prog} from={(FINAL_LINES.length + 1) / WINDOWS} to={1} hold live>
              <div className="max-w-2xl">
                <ClosingLines />
                <div className="pointer-events-auto mt-12">
                  <GoldButton arrow="" size="lg" onClick={restart}>
                    <span className="inline-flex items-center gap-3">
                      <RotateCcw size={14} strokeWidth={1.5} aria-hidden="true" />
                      Experience again
                    </span>
                  </GoldButton>
                </div>
              </div>
            </Beat>
          </>
        )}
      </Scene>

      {/* colophon, after the pin */}
      <section className="relative z-10 mx-auto max-w-3xl px-5 pb-24 text-center">
        <OrnamentDivider className="mb-8" />
        <p className="mx-auto max-w-xl text-[0.72rem] leading-relaxed text-ivory-dim/45">
          An educational project. Qur’anic passages are quoted with their surah and ayah. English
          renderings are conventional translations of meaning. In keeping with Islamic practice, no
          Prophet is depicted anywhere in this experience — every scene is told through landscape,
          architecture, object and light.
        </p>
        <p className="mt-6 text-[0.64rem] tracking-[0.36em] text-gold/35 uppercase">
          Respect the Prophets ﷺ
        </p>
      </section>
    </div>
  )
}

function ClosingLines() {
  return (
    <div className="space-y-3">
      {['Respect the Prophets.', 'Learn from the Prophets.', 'Follow the guidance they brought.'].map(
        (l) => (
          <p
            key={l}
            className="font-display text-[clamp(1.05rem,3vw,1.7rem)] leading-relaxed font-light text-ivory/78"
          >
            {l}
          </p>
        ),
      )}
      <p className="font-arabic pt-7 text-xl text-gold-soft sm:text-2xl" lang="ar">
        جَزَاكُمُ اللَّهُ خَيْرًا
      </p>
      <p className="text-[0.68rem] tracking-[0.34em] text-gold/55 uppercase">
        Jazakum Allahu Khayran
      </p>
    </div>
  )
}

/** Night fading into dawn: the stars go out, the horizon fills with gold. */
function DawnBackdrop({ progress }: { progress: MotionValue<number> }) {
  const starOpacity = useTransform(progress, [0, 0.55, 0.85], [0.8, 0.4, 0])
  const dawn = useTransform(progress, [0.3, 0.85, 1], [0, 0.75, 1])
  const lightScale = useTransform(progress, [0, 0.6, 1], [0.5, 1.1, 1.9])
  const rosette = useTransform(progress, [0.7, 1], [0, 0.22])

  return (
    <div aria-hidden="true" className="absolute inset-0">
      <Plate id="ch-final" opacity={0.85} />
      <motion.div className="absolute inset-0" style={{ opacity: starOpacity }}>
        <ParticleField weather="stars" density={1.3} color="#e7cd9b" opacity={1} />
      </motion.div>
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[70%]"
        style={{
          opacity: dawn,
          background:
            'linear-gradient(to top, rgba(246,229,191,.30), rgba(211,173,104,.12) 42%, transparent 75%)',
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 h-[52vmin] w-[52vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          scale: lightScale,
          background:
            'radial-gradient(circle, rgba(246,229,191,.85) 0%, rgba(211,173,104,.3) 18%, rgba(211,173,104,.06) 42%, transparent 68%)',
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ opacity: rosette, scale: lightScale }}
      >
        <Rosette className="h-[70vmin] w-[70vmin]" progress={1} />
      </motion.div>
      <SceneVeil progress={progress} />
      <Vignette strength={0.94} />
      <Grain opacity={0.035} />
      <SceneRail progress={progress} accent="#f6e5bf" />
    </div>
  )
}
