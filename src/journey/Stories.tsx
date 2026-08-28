import { ac } from '../lib/art'
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { STORY_ENVIRONMENTS, YUSUF_STAGES, type StoryEnvironment } from '../data/journey'
import { PROPHET_BY_ID } from '../data/prophets'
import { useJourney } from '../lib/journey'
import SceneArt from '../components/visuals/SceneArt'
import ParticleField from '../components/visuals/ParticleField'
import Plate from '../components/Plate'
import { GeometricPattern } from '../components/visuals/GeometricPattern'

import SceneStepper, { type Step } from '../components/SceneStepper'
import { Eyebrow, Statement } from './kit'

export function StoriesScene() {
  return (
    <div id="stories" data-scene="stories">
      <StoryOpening />
      {STORY_ENVIRONMENTS.map((s, i) =>
        s.id === 'yusuf' ? (
          <YusufJourney key={s.id} story={s} order={i} />
        ) : (
          <StoryEnvironmentScene key={s.id} story={s} order={i} />
        ),
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */

function StoryOpening() {
  return (
    <section
      aria-label="Enter their stories"
      className="cv-70 relative flex min-h-[70svh] w-full items-center justify-center overflow-hidden px-5 py-24"
    >
      <div aria-hidden="true" className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(80% 60% at 50% 50%, rgb(var(--navy-2-rgb) / .6), rgb(var(--ink-rgb) / 1) 72%)' }}
        />
        <GeometricPattern variant="khatam" opacity={0.045} scale={200} color="#d3ad68" />
        <ParticleField weather="stars" density={0.9} color="#e7cd9b" opacity={0.6} />
      </div>
      <div className="relative z-30 max-w-3xl text-center">
        <Eyebrow>Chapter Four</Eyebrow>
        <Statement size="lg" gilded className="mt-6">
          Enter their stories
        </Statement>
        <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-ivory-dim/65 sm:text-base">
          Five environments. Keep scrolling and each one builds around you — told entirely through
          landscape, object and light.
        </p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

/**
 * One prophet's environment: a pinned cinematic run, then a stable strip of
 * interactive reveals on the same backdrop.
 */
/**
 * One prophet's environment, as a stage rather than a scroll track.
 *
 * This used to be a 320svh pinned run followed by a separate strip of
 * reveals — four screens of scrolling to read four sentences. It is now a
 * single screen the reader clicks through, which is both shorter and puts
 * them in control of the pace. The artwork still responds to the beat.
 */
function StoryEnvironmentScene({ story, order }: { story: StoryEnvironment; order: number }) {
  const { reduced } = useJourney()
  const p = PROPHET_BY_ID[story.id]
  const [progress, setProgress] = useState(0)
  const onStep = useCallback((_i: number, v: number) => setProgress(v), [])

  const steps: Step[] = [
    {
      content: (
        <div>
          <p className="font-arabic text-3xl sm:text-5xl" style={{ color: ac(p.accent) }} lang="ar">
            {p.arabic}
          </p>
          <h3 className="font-display mt-4 text-[clamp(2.2rem,9vw,5.5rem)] leading-none font-light uppercase">
            {story.title}
            <span className="ml-3 align-middle text-[0.28em] tracking-normal text-gold/60">
              {p.honorific}
            </span>
          </h3>
          <p className="font-display mt-7 text-[clamp(1.1rem,3vw,1.7rem)] leading-relaxed font-light text-ivory/85 italic">
            “{story.line}”
          </p>
        </div>
      ),
    },
    ...story.reveals.map((r) => ({
      label: r.title,
      content: (
        <p className="font-display text-[clamp(1.15rem,3.4vw,2.1rem)] leading-[1.45] font-light text-ivory/90">
          {r.body}
        </p>
      ),
    })),
  ]

  return (
    <section
      id={`story-${story.id}`}
      data-scene={`story-${story.id}`}
      aria-label={`${p.name} ${p.honorific} — ${story.environment}`}
      className="cv-screen relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-5 py-16"
    >
      <div aria-hidden="true" className="absolute inset-0">
        <Plate id={story.id} opacity={0.85} />
        <motion.div
          className="absolute inset-0 opacity-85"
          animate={reduced ? undefined : { scale: 1 + progress * 0.06 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <SceneArt art={story.id} progress={progress} accent={ac(p.accent)} />
        </motion.div>
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgb(var(--ink-rgb) / calc(.6 * var(--scrim-k))), rgb(var(--ink-rgb) / calc(.42 * var(--scrim-k))) 42%, rgb(var(--ink-rgb) / calc(.9 * var(--scrim-k))))',
          }}
        />
        <ParticleField weather={p.weather} density={0.75} color={ac(p.accent)} opacity={0.5} />
        <GeometricPattern variant="lattice" opacity={0.02} scale={140} color={ac(p.accent)} />
      </div>

      <div className="relative z-30 w-full max-w-4xl">
        <div className="text-center">
          <Eyebrow color={ac(p.accent)}>
            Scene {String(order + 1).padStart(2, '0')} · {story.environment}
          </Eyebrow>
        </div>
        <SceneStepper
          steps={steps}
          accent={ac(p.accent)}
          onStep={onStep}
          label={`${p.name} ${p.honorific}, one beat at a time`}
          className="mt-4"
        />
      </div>
    </section>
  )
}

/* ================================================================== */
/*  YUSUF — a horizontal journey: well → prison → palace               */
/* ================================================================== */

function YusufJourney({ story, order }: { story: StoryEnvironment; order: number }) {
  const { reduced, cue, compact } = useJourney()
  const p = PROPHET_BY_ID.yusuf
  const railRef = useRef<HTMLDivElement>(null)
  const [stage, setStage] = useState(0)
  const drag = useRef<{ x: number; left: number } | null>(null)

  /* Track which stage is centred, and drive the artwork from it. */
  const measure = useCallback(() => {
    const el = railRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    const t = max > 4 ? el.scrollLeft / max : 0
    setStage(Math.round(t * (YUSUF_STAGES.length - 1)))
  }, [])

  useEffect(() => {
    const el = railRef.current
    if (!el || compact) return
    measure()
    el.addEventListener('scroll', measure, { passive: true })
    return () => el.removeEventListener('scroll', measure)
  }, [measure, compact])

  /* Click-and-drag on desktop, on top of native wheel/touch scrolling. */
  const onPointerDown = (e: React.PointerEvent) => {
    const el = railRef.current
    if (!el || compact) return
    drag.current = { x: e.clientX, left: el.scrollLeft }
    el.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const el = railRef.current
    if (!el || !drag.current) return
    el.scrollLeft = drag.current.left - (e.clientX - drag.current.x)
  }
  const endDrag = (e: React.PointerEvent) => {
    const el = railRef.current
    drag.current = null
    if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
  }

  const goTo = (i: number) => {
    const el = railRef.current
    if (!el) return
    cue('select')
    const max = el.scrollWidth - el.clientWidth
    el.scrollTo({
      left: (i / (YUSUF_STAGES.length - 1)) * max,
      behavior: reduced ? 'auto' : 'smooth',
    })
  }

  /* Progress through YusufArt: well (0) → prison (~0.42) → palace/stars (1) */
  const artProgress = stage / (YUSUF_STAGES.length - 1)

  return (
    <section
      id="story-yusuf"
      aria-label={`${p.name} ${p.honorific} — well, prison, palace`}
      className="relative w-full overflow-hidden py-24"
    >
      <div aria-hidden="true" className="absolute inset-0">
        <Plate id="yusuf" opacity={0.75} />
        <motion.div
          key={stage}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <SceneArt art="yusuf" progress={artProgress} accent={ac(p.accent)} />
        </motion.div>
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgb(var(--ink-rgb) / calc(.66 * var(--scrim-k))), rgb(var(--ink-rgb) / calc(.5 * var(--scrim-k))) 45%, rgb(var(--ink-rgb) / calc(.94 * var(--scrim-k))))',
          }}
        />
        <ParticleField weather="motes" density={0.7} color={ac(p.accent)} opacity={0.5} />
      </div>

      <div className="relative z-30">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <Eyebrow color={ac(p.accent)}>
            Scene {String(order + 1).padStart(2, '0')} · {story.environment}
          </Eyebrow>
          <p className="font-arabic mt-6 text-3xl sm:text-4xl" style={{ color: ac(p.accent) }} lang="ar">
            {p.arabic}
          </p>
          <h3 className="font-display mt-3 text-[clamp(2.2rem,8vw,5rem)] leading-none font-light uppercase">
            {story.title}
            <span className="ml-3 align-middle text-[0.28em] tracking-normal text-gold/60">
              {p.honorific}
            </span>
          </h3>
          <p className="font-display mt-7 text-lg leading-relaxed font-light text-ivory/80 italic sm:text-xl">
            “{story.line}”
          </p>
        </div>

        {/* ── the three stages ─────────────────────────────────────── */}
        {compact ? (
          <ol className="mx-auto mt-14 max-w-lg space-y-6 px-5">
            {YUSUF_STAGES.map((s, i) => (
              <li key={s.id}>
                <StageCard stage={s} index={i} accent={ac(p.accent)} active />
              </li>
            ))}
          </ol>
        ) : (
          <>
            <div
              ref={railRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              className="mt-14 flex cursor-grab snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth px-[max(1.25rem,calc(50vw-19rem))] pb-8 active:cursor-grabbing"
              role="region"
              aria-label="Drag or scroll through the well, the prison and the palace"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') {
                  e.preventDefault()
                  e.stopPropagation()
                  goTo(Math.min(YUSUF_STAGES.length - 1, stage + 1))
                } else if (e.key === 'ArrowLeft') {
                  e.preventDefault()
                  e.stopPropagation()
                  goTo(Math.max(0, stage - 1))
                }
              }}
            >
              {YUSUF_STAGES.map((s, i) => (
                <div key={s.id} className="w-[min(80vw,34rem)] shrink-0 snap-center">
                  <StageCard stage={s} index={i} accent={ac(p.accent)} active={stage === i} />
                </div>
              ))}
            </div>

            <div className="mt-2 flex items-center justify-center gap-3">
              {YUSUF_STAGES.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(i)}
                  data-cursor="hover"
                  aria-label={`Go to ${s.label}`}
                  aria-current={stage === i}
                  className="flex h-11 w-10 cursor-pointer items-center justify-center"
                >
                  <span
                    className="block h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: stage === i ? '2rem' : '0.5rem',
                      background: stage === i ? ac(p.accent) : 'rgb(var(--ivory-dim-rgb) / .28)',
                      boxShadow: stage === i ? `0 0 14px ${ac(p.accent)}` : 'none',
                    }}
                  />
                </button>
              ))}
            </div>
            <p className="mt-3 text-center text-[0.64rem] tracking-[0.32em] text-ivory-dim/35 uppercase">
              Drag, scroll or use ← →
            </p>
          </>
        )}

        {/* the four lessons */}
        <ul className="mx-auto mt-16 flex max-w-3xl flex-wrap justify-center gap-3 px-5">
          {story.reveals.map((r) => (
            <li
              key={r.title}
              className="border px-4 py-2 text-[0.66rem] tracking-[0.22em] uppercase"
              style={{ borderColor: `${ac(p.accent)}33`, color: `${ac(p.accent)}dd` }}
            >
              {r.title}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function StageCard({
  stage,
  index,
  accent,
  active,
}: {
  stage: (typeof YUSUF_STAGES)[number]
  index: number
  accent: string
  active: boolean
}) {
  return (
    <article
      className="relative h-full overflow-hidden border p-8 backdrop-blur-sm transition-all duration-700 sm:p-10"
      style={{
        borderColor: active ? `${accent}66` : 'rgb(var(--gold-rgb) / .14)',
        background: active ? 'rgb(var(--ink-2-rgb) / .82)' : 'rgb(var(--ink-2-rgb) / .6)',
        boxShadow: active ? `0 0 80px -30px ${accent}` : 'none',
      }}
    >
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 h-px transition-all duration-700"
        style={{ width: active ? '100%' : '0%', background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
      <p className="font-display text-[0.64rem] tracking-[0.34em] tabular-nums" style={{ color: `${accent}88` }}>
        {String(index + 1).padStart(2, '0')} / 03
      </p>
      <h4 className="font-display mt-4 text-3xl leading-none font-light text-ivory uppercase sm:text-4xl">
        {stage.label}
      </h4>
      <div className="hairline my-6 h-px w-full" aria-hidden="true" />
      <p className="text-sm leading-relaxed text-ivory/78 sm:text-[0.95rem]">{stage.line}</p>
      <p className="mt-7 text-[0.66rem] tracking-[0.3em] uppercase" style={{ color: accent }}>
        {stage.lesson}
      </p>
    </article>
  )
}
