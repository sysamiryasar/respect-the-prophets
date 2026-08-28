import { ac } from '../lib/art'
import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, motion, useTransform, type MotionValue } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { QUALITIES, RESPECT_STEPS, FINAL_LINES } from '../data/journey'
import { VERSES } from '../data/content'
import { PROPHET_BY_ID } from '../data/prophets'
import { useJourney } from '../lib/journey'
import SceneArt from '../components/visuals/SceneArt'
import ParticleField from '../components/visuals/ParticleField'
import Plate from '../components/Plate'
import { GeometricPattern, OrnamentDivider } from '../components/visuals/GeometricPattern'
import SceneStepper, { type Step } from '../components/SceneStepper'
import { GoldButton, SourceTag } from '../components/ui'
import {
  Beat,
  Eyebrow,
  InfoPanel,
  Scene,
  SceneRail,
  SceneVeil,
  Statement,
  useRevealOnSelect,
} from './kit'

const MERCY = VERSES.find((v) => v.id === 'v-21-107')!
const M = PROPHET_BY_ID.muhammad

/* ================================================================== */
/*  SECTION 7 — MUHAMMAD ﷺ                                             */
/* ================================================================== */

export function MuhammadScene() {
  const { reduced, cue } = useJourney()
  const [open, setOpen] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  useRevealOnSelect(panelRef, open)
  const active = QUALITIES.find((q) => q.id === open) ?? null

  return (
    <div id="muhammad" data-scene="muhammad">
      {/* ── the reveal ───────────────────────────────────────────── */}
      <Scene
        id="muhammad-reveal"
        height={210}
        label="Muhammad ﷺ, the final Messenger of Allah"
        backdrop={(prog, step) => <MuhammadBackdrop progress={prog} step={step} />}
        flat={
          <div className="relative overflow-hidden px-5 py-24 text-center">
            <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-50">
              <SceneArt art="muhammad" progress={0.9} accent={ac(M.accent)} />
            </div>
            <div className="absolute inset-0 -z-10 bg-ink/72" aria-hidden="true" />
            <Eyebrow color={ac(M.accent)}>Chapter Seven</Eyebrow>
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
              <Eyebrow color={ac(M.accent)}>Chapter Seven</Eyebrow>
              <Statement size="md" className="mt-7">
                A quiet night over the desert.
              </Statement>
            </Beat>

            <Beat progress={prog} from={0.28} to={0.54}>
              <p className="font-arabic text-4xl sm:text-6xl" style={{ color: ac(M.accent) }} lang="ar">
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
                  style={{ color: ac(M.accent) }}
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
        className="cv-screen relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-5 py-24"
      >
        <div aria-hidden="true" className="absolute inset-0">
          <Plate id="muhammad" opacity={0.8} />
          <div className="absolute inset-0 opacity-70">
            <SceneArt art="muhammad" progress={0.95} accent={ac(M.accent)} />
          </div>
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgb(var(--ink-rgb) / calc(.7 * var(--scrim-k))), rgb(var(--ink-rgb) / calc(.8 * var(--scrim-k))) 50%, rgb(var(--ink-rgb) / calc(.96 * var(--scrim-k))))',
            }}
          />
          <ParticleField weather="stars" density={1.1} color={ac(M.accent)} opacity={0.6} />
          <GeometricPattern variant="khatam" opacity={0.03} scale={175} color={ac(M.accent)} />
        </div>

        <div className="relative z-30 w-full max-w-4xl text-center">
          <p className="text-[0.66rem] tracking-[0.44em] uppercase" style={{ color: `${ac(M.accent)}bb` }}>
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
                      borderColor: on ? ac(M.accent) : `${ac(M.accent)}33`,
                      color: on ? 'var(--color-gold-bright)' : `${ac(M.accent)}dd`,
                      background: on ? `${ac(M.accent)}1c` : 'rgb(var(--ink-rgb) / .45)',
                      boxShadow: on ? `0 0 50px -12px ${ac(M.accent)}` : 'none',
                    }}
                  >
                    {q.title}
                  </button>
                </motion.li>
              )
            })}
          </ul>

          <div ref={panelRef} className="mt-12 flex min-h-[13rem] justify-center">
            <AnimatePresence mode="wait">
              {active ? (
                <InfoPanel
                  key={active.id}
                  title={active.title}
                  accent={ac(M.accent)}
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
        <SceneArt art="muhammad" progress={step / 14} accent={ac(M.accent)} />
      </motion.div>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgb(var(--ink-rgb) / calc(.52 * var(--scrim-k))), rgb(var(--ink-rgb) / calc(.28 * var(--scrim-k))) 40%, rgb(var(--ink-rgb) / calc(.88 * var(--scrim-k))))',
        }}
      />
      <ParticleField weather="stars" density={1} color={ac(M.accent)} opacity={0.6} />
      <SceneVeil progress={progress} />
      <SceneRail progress={progress} accent={ac(M.accent)} />
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
      className="cv-screen relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-5 py-16"
    >
      <div aria-hidden="true" className="absolute inset-0">
        <Plate id="ch-respect" opacity={0.5} />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(80% 70% at 50% 100%, rgb(var(--gold-rgb) / .14), rgb(var(--ink-rgb) / .92) 70%)' }}
        />
        <GeometricPattern variant="weave" opacity={0.03} scale={130} color="#d3ad68" />
        <ParticleField weather="dust" density={0.6} color="#d3ad68" opacity={0.45} />
      </div>

      <div className="relative z-30 w-full max-w-3xl">
        <div className="text-center">
          <Eyebrow>Chapter Eight</Eyebrow>
          <Statement size="md" gilded className="mt-5">
            How do we show respect?
          </Statement>
        </div>

        {/* the path climbs as you go down the list */}
        <ol className="mt-10 space-y-2.5">
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
                    borderColor: on ? 'rgb(var(--gold-rgb) / .6)' : 'rgb(var(--gold-rgb) / .14)',
                    background: on ? 'rgb(var(--ink-2-rgb) / .86)' : 'rgb(var(--ink-2-rgb) / .6)',
                    boxShadow: on ? '0 0 70px -26px rgb(var(--gold-rgb) / .85)' : 'none',
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent transition-all duration-700"
                    style={{ width: on ? '100%' : '0%' }}
                  />
                  <span className="flex items-baseline gap-5 px-6 py-5 sm:px-8">
                    <span
                      className="font-display shrink-0 text-[0.72rem] tracking-[0.3em] tabular-nums transition-colors duration-500"
                      style={{ color: on ? 'var(--color-gold)' : 'rgb(var(--gold-rgb) / .45)' }}
                    >
                      {s.n}
                    </span>
                    <span
                      className={`font-display leading-none font-light uppercase transition-all duration-700 ${
                        last
                          ? 'text-[clamp(1.5rem,5vw,2.9rem)]'
                          : 'text-[clamp(1.2rem,3.6vw,2rem)]'
                      }`}
                      style={{ color: on ? 'var(--color-gold-bright)' : 'var(--color-ivory)' }}
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
                      <span className="block px-6 pb-6 pl-[3.6rem] text-sm leading-relaxed text-ivory/78 sm:px-8 sm:pl-[4.4rem] sm:text-[0.95rem]">
                        {s.body}
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        <p className="font-display mt-12 text-center text-[clamp(1.3rem,4.4vw,2.4rem)] leading-tight font-light">
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
  const [progress, setProgress] = useState(0)
  const onStep = useCallback((_i: number, v: number) => setProgress(v), [])

  const restart = () => {
    cue('open')
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  const steps: Step[] = [
    ...FINAL_LINES.map((line, i) => ({
      content: (
        <p
          className={`font-display font-light ${
            i === FINAL_LINES.length - 1
              ? 'text-[clamp(1.9rem,7vw,4rem)] text-gold-soft'
              : 'text-[clamp(1.6rem,6vw,3.4rem)] text-ivory/60'
          }`}
        >
          {line}
        </p>
      ),
    })),
    {
      content: (
        <p className="font-display text-gilded anim-shimmer text-[clamp(2.6rem,13vw,9rem)] leading-none font-light uppercase">
          Worship
          <br />
          Allah.
        </p>
      ),
    },
    {
      content: <ClosingLines />,
      after: (
        <GoldButton arrow="" size="lg" onClick={restart}>
          <span className="inline-flex items-center gap-3">
            <RotateCcw size={14} strokeWidth={1.5} aria-hidden="true" />
            Experience again
          </span>
        </GoldButton>
      ),
    },
  ]

  return (
    <div id="final" data-scene="final">
      <section
        aria-label="The final message"
        className="cv-screen relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-5 pt-28 pb-16"
      >
        {/* Night gives way to dawn as the reader advances, rather than as
            they scroll — same fade, a fifth of the page height. */}
        <div aria-hidden="true" className="absolute inset-0">
          <Plate id="ch-final" opacity={0.85} />
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: 1 - progress * 0.9 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <ParticleField weather="stars" density={1.1} color="#e7cd9b" opacity={1} />
          </motion.div>
          <motion.div
            className="absolute inset-x-0 bottom-0 h-[70%]"
            animate={{ opacity: 0.15 + progress * 0.75 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background:
                'linear-gradient(to top, rgb(var(--glow-rgb) / .3), rgb(var(--glow-rgb) / .1) 42%, transparent 75%)',
            }}
          />
          <motion.div
            className="absolute top-[74%] left-1/2 h-[46vmin] w-[46vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
            animate={{ scale: 0.6 + progress * 1.5, opacity: 0.5 + progress * 0.4 }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background:
                'radial-gradient(circle, rgb(var(--glow-rgb) / .8) 0%, rgb(var(--glow-rgb) / .28) 18%, transparent 66%)',
            }}
          />
          <div
            className="absolute inset-x-0 top-[16%] h-[46%]"
            style={{
              background:
                'radial-gradient(60% 100% at 50% 50%, rgb(var(--ink-rgb) / calc(.6 * var(--scrim-k))), transparent 78%)',
            }}
          />
        </div>

        <div className="relative z-30 w-full max-w-3xl text-center">
          <SceneStepper
            steps={steps}
            accent="var(--color-gold)"
            onStep={onStep}
            label="The final message"
            stage="compact"
          />
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-3xl px-5 pb-20 text-center">
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

