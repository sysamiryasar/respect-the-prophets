import { ac } from '../lib/art'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useTransform } from 'framer-motion'
import { PATH_POINTS } from '../data/journey'
import { useJourney } from '../lib/journey'
import DesertPath from '../components/visuals/DesertPath'
import ParticleField from '../components/visuals/ParticleField'
import { GeometricPattern, Rosette, OrnamentDivider } from '../components/visuals/GeometricPattern'
import { GoldButton } from '../components/ui'
import {
  Beat,
  Eyebrow,
  Hotspot,
  InfoPanel,
  Scene,
  SceneRail,
  SceneVeil,
  ScrollCue,
  Statement,
  useRevealOnSelect,
} from './kit'

const STAGE_TIMINGS = [300, 1100, 1900, 2700, 3600]

/* ================================================================== */
/*  INTRO — enter the journey                                          */
/* ================================================================== */

export function IntroScene() {
  const { reduced, enter, cue } = useJourney()
  const [stage, setStage] = useState(reduced ? 5 : 0)

  useEffect(() => {
    if (reduced) {
      setStage(5)
      return
    }
    const timers = STAGE_TIMINGS.map((ms, i) => window.setTimeout(() => setStage(i + 1), ms))
    return () => timers.forEach(clearTimeout)
  }, [reduced])

  const at = (n: number) => stage >= n

  const begin = () => {
    cue('open')
    enter()
    document.getElementById('why')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <section
      id="intro"
      data-scene="intro"
      aria-label="Respect the Prophets — the opening"
      className="cv-screen relative flex min-h-[100svh] w-full flex-col items-center justify-center px-5 py-28"
    >
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        {/* the desert emerges out of the black */}
        <motion.div
          className="absolute inset-0"
          initial={reduced ? false : { opacity: 0, scale: 1.12 }}
          animate={{ opacity: at(3) ? 1 : 0, scale: at(3) ? 1 : 1.12 }}
          transition={{ duration: 4, ease: [0.16, 1, 0.3, 1] }}
        >
          <DesertPath progress={0} accent="#d3ad68" />
        </motion.div>

        {/* the distant golden light, before anything else is visible */}
        <motion.div
          className="absolute top-1/2 left-1/2 h-[120vmax] w-[120vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
          initial={reduced ? false : { opacity: 0, scale: 0.3 }}
          animate={{ opacity: at(2) ? 1 : 0, scale: at(2) ? 1 : 0.3 }}
          transition={{ duration: 3.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background:
              'radial-gradient(circle, rgb(var(--gold-rgb) / .20) 0%, rgb(var(--bronze-rgb) / .09) 25%, rgb(var(--navy-rgb) / .28) 52%, rgb(var(--ink-rgb) / 0) 72%)',
          }}
        />

        <motion.div
          className="absolute inset-0"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: at(1) ? 1 : 0 }}
          transition={{ duration: 2.6 }}
        >
          <ParticleField weather="stars" density={1.2} color="#e7cd9b" opacity={0.8} />
          <ParticleField weather="dust" density={0.5} color="#d3ad68" opacity={0.45} speed={0.7} />
        </motion.div>

        <motion.div
          className="absolute inset-0"
          initial={reduced ? false : { opacity: 0, scale: 1.1 }}
          animate={{ opacity: at(3) ? 1 : 0, scale: 1 }}
          transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
        >
          <GeometricPattern variant="khatam" opacity={0.05} scale={172} color="#d3ad68" />
        </motion.div>

        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={reduced ? false : { opacity: 0, scale: 0.85 }}
          animate={{ opacity: at(3) ? 0.26 : 0, scale: at(3) ? 1 : 0.85 }}
          transition={{ duration: 3.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Rosette className="h-[min(84vmin,720px)] w-[min(84vmin,720px)]" progress={at(3) ? 1 : 0} spin={!reduced} />
        </motion.div>
      </div>

      <div className="relative z-30 flex w-full max-w-4xl flex-col items-center text-center">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: at(4) ? 1 : 0, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-arabic mb-8 text-lg text-gold/60 sm:text-2xl"
          lang="ar"
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </motion.p>

        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 32, filter: 'blur(20px)', letterSpacing: '0.55em' }}
          animate={
            at(4)
              ? { opacity: 1, y: 0, filter: 'blur(0px)', letterSpacing: '0.14em' }
              : { opacity: 0, y: 32, filter: 'blur(20px)', letterSpacing: '0.55em' }
          }
          transition={{ duration: 2.3, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-gilded anim-shimmer text-[clamp(2.1rem,8.4vw,6.4rem)] leading-[0.95] font-light uppercase"
        >
          Respect the
          <br />
          Prophets
          <span className="font-arabic ml-3 align-middle text-[0.42em] tracking-normal text-gold-soft">ﷺ</span>
        </motion.h1>

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: at(4) ? 1 : 0 }}
          transition={{ duration: 1.6, delay: reduced ? 0 : 0.6 }}
          className="mt-8 w-full"
        >
          <OrnamentDivider />
        </motion.div>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: at(4) ? 1 : 0, y: 0 }}
          transition={{ duration: 1.7, delay: reduced ? 0 : 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="font-display mt-8 max-w-2xl text-[clamp(1rem,2.5vw,1.5rem)] leading-relaxed font-light text-ivory/75 italic"
        >
          A Journey Through Faith, History &amp; Character
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: at(5) ? 1 : 0, y: 0 }}
          transition={{ duration: 1.5, delay: reduced ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14"
        >
          <GoldButton size="lg" onClick={begin}>
            Begin the Journey
          </GoldButton>
          <p className="mt-6 text-[0.64rem] tracking-[0.34em] text-ivory-dim/45 uppercase">
            Ten chapters · about 12 minutes · you set the pace
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: at(5) ? 1 : 0 }}
        transition={{ duration: 1.4, delay: reduced ? 0 : 1.2 }}
        className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2"
      >
        <ScrollCue />
      </motion.div>
    </section>
  )
}

/* ================================================================== */
/*  WHY — the path forward, and four points along it                   */
/* ================================================================== */

export function WhyScene() {
  const { reduced, cue } = useJourney()
  const [open, setOpen] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const active = PATH_POINTS.find((p) => p.id === open) ?? null
  useRevealOnSelect(panelRef, open)

  return (
    <>
      {/* ── the road moving forward ─────────────────────────────── */}
      <Scene
        id="why"
        height={185}
        label="Why do we respect the Prophets"
        backdrop={(p, step) => (
          <BackdropPath progress={p} step={step} />
        )}
        flat={
          <div className="relative overflow-hidden px-5 py-24 text-center">
            <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-50">
              <DesertPath progress={0.6} />
            </div>
            <Eyebrow>Chapter One</Eyebrow>
            <Statement size="lg" gilded className="mt-6">
              Chosen to guide humanity
            </Statement>
            <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-ivory/75">
              Allah sent Prophets and Messengers to guide humanity toward truth, righteousness, and
              the worship of Allah alone.
            </p>
          </div>
        }
      >
        {(p) => (
          <>
            <Beat progress={p} from={0} to={0.42}>
              <Eyebrow>Chapter One</Eyebrow>
              <Statement size="lg" gilded className="mt-6">
                Chosen to guide
                <br />
                humanity
              </Statement>
            </Beat>

            <Beat progress={p} from={0.42} to={0.82}>
              <Statement size="md">
                Allah sent Prophets and Messengers to guide humanity toward truth, righteousness,
                and the worship of Allah alone.
              </Statement>
            </Beat>

            <Beat progress={p} from={0.82} to={1} hold>
              <Eyebrow color="#e7cd9b">Four things respect asks of us</Eyebrow>
              <p className="mt-6 text-[0.68rem] tracking-[0.34em] text-ivory-dim/45 uppercase">
                Keep going ↓
              </p>
            </Beat>
          </>
        )}
      </Scene>

      {/* ── the four interactive points ─────────────────────────── */}
      <section
        aria-label="Four things respect asks of us"
        className="cv-screen relative flex min-h-[100svh] w-full flex-col items-center justify-center px-5 py-24"
      >
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <DesertPath progress={0.85} accent={active?.accent ?? '#d3ad68'} />
          <motion.div
            key={active?.id ?? 'none'}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
            style={{
              background: active
                ? `radial-gradient(70% 55% at 50% 55%, ${ac(active.accent)}1f, transparent 68%)`
                : 'radial-gradient(70% 55% at 50% 55%, rgb(var(--navy-rgb) / .5), transparent 70%)',
            }}
          />
          <ParticleField weather="dust" density={0.6} color={active?.accent ?? '#d3ad68'} opacity={0.45} />
        </div>

        <div className="relative z-30 w-full max-w-5xl">
          <p className="text-center text-[0.66rem] tracking-[0.44em] text-gold/70 uppercase">
            Respect is a road, not a word
          </p>

          {/* the points sit along the road, receding into it */}
          <div className="relative mx-auto mt-16 h-[16rem] w-full max-w-3xl sm:h-[18rem]">
            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              <path
                d="M8,82 C30,74 40,44 50,32 C60,22 72,16 92,12"
                fill="none"
                stroke="#d3ad68"
                strokeOpacity="0.25"
                strokeWidth="0.6"
                vectorEffect="non-scaling-stroke"
                strokeDasharray="3 3"
              />
            </svg>
            {PATH_POINTS.map((pt, i) => {
              const pos = [
                { left: '8%', top: '82%' },
                { left: '36%', top: '56%' },
                { left: '64%', top: '32%' },
                { left: '92%', top: '12%' },
              ][i]
              return (
                <Hotspot
                  key={pt.id}
                  label={pt.title}
                  accent={ac(pt.accent)}
                  index={String(i + 1).padStart(2, '0')}
                  active={open === pt.id}
                  dimmed={open !== null && open !== pt.id}
                  onSelect={() => setOpen((c) => (c === pt.id ? null : pt.id))}
                  style={pos}
                />
              )
            })}
          </div>

          <div ref={panelRef} className="mt-14 flex min-h-[15rem] justify-center">
            <AnimatePresence mode="wait">
              {active ? (
                <InfoPanel
                  key={active.id}
                  title={active.title}
                  accent={ac(active.accent)}
                  footnote={active.short}
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
                  className="self-center text-center text-[0.66rem] tracking-[0.34em] text-ivory-dim/40 uppercase"
                >
                  Select a point on the road
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <p className="font-display mt-20 text-center text-[clamp(1.2rem,3.6vw,2.2rem)] leading-tight font-light text-ivory/60">
            Respect is more than knowing their names.
          </p>
        </div>
      </section>
    </>
  )
}

/** The road backdrop, driven forward by the scene's own scroll. */
function BackdropPath({
  progress,
  step,
}: {
  progress: import('framer-motion').MotionValue<number>
  step: number
}) {
  const scale = useTransform(progress, [0, 1], [1.02, 1.16])
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <motion.div className="absolute inset-0" style={{ scale }}>
        <DesertPath progress={step / 14} />
      </motion.div>
      <ParticleField weather="dust" density={0.7} color="#d3ad68" opacity={0.5} />
      <GeometricPattern variant="lattice" opacity={0.022} scale={130} color="#d3ad68" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgb(var(--ink-rgb) / calc(.5 * var(--scrim-k))), rgb(var(--ink-rgb) / calc(.28 * var(--scrim-k))) 40%, rgb(var(--ink-rgb) / calc(.88 * var(--scrim-k))))',
        }}
      />
      <SceneVeil progress={progress} />
      <SceneRail progress={progress} accent="#d3ad68" />
    </div>
  )
}
