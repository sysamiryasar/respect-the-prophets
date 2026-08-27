import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useTransform, type MotionValue } from 'framer-motion'
import { STORY_ENVIRONMENTS, YUSUF_STAGES, type StoryEnvironment } from '../data/journey'
import { PROPHET_BY_ID } from '../data/prophets'
import { useJourney } from '../lib/journey'
import SceneArt from '../components/visuals/SceneArt'
import ParticleField from '../components/visuals/ParticleField'
import Plate from '../components/Plate'
import { GeometricPattern } from '../components/visuals/GeometricPattern'
import { Grain, Vignette } from '../components/ui'
import { Beat, Eyebrow, InfoPanel, Scene, SceneRail, SceneVeil, Statement } from './kit'

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
      className="relative flex min-h-[70svh] w-full items-center justify-center overflow-hidden px-5 py-24"
    >
      <div aria-hidden="true" className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(80% 60% at 50% 50%, rgba(16,28,51,.6), rgba(4,7,11,1) 72%)' }}
        />
        <GeometricPattern variant="khatam" opacity={0.045} scale={200} color="#d3ad68" />
        <ParticleField weather="stars" density={0.9} color="#e7cd9b" opacity={0.6} />
      </div>
      <Vignette strength={0.82} />
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
function StoryEnvironmentScene({ story, order }: { story: StoryEnvironment; order: number }) {
  const { reduced, cue } = useJourney()
  const p = PROPHET_BY_ID[story.id]
  const [open, setOpen] = useState<number | null>(null)
  const isMusa = story.id === 'musa'

  return (
    <>
      <Scene
        id={`story-${story.id}`}
        height={isMusa ? 420 : 320}
        label={`${p.name} ${p.honorific} — ${story.environment}`}
        backdrop={(prog, step) => (
          <StoryBackdrop id={story.id} progress={prog} step={step} accent={p.accent} weather={p.weather} />
        )}
        flat={
          <div className="relative overflow-hidden px-5 py-20">
            <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-45">
              <SceneArt art={story.id} progress={0.8} accent={p.accent} />
            </div>
            <div className="absolute inset-0 -z-10 bg-ink/70" aria-hidden="true" />
            <div className="relative mx-auto max-w-3xl text-center">
              <Eyebrow color={p.accent}>{story.environment}</Eyebrow>
              <h3 className="font-display mt-5 text-[clamp(2rem,7vw,4rem)] leading-none font-light uppercase">
                {story.title} <span className="text-[0.3em] text-gold/60">{p.honorific}</span>
              </h3>
              <p className="font-display mt-8 text-xl leading-relaxed font-light text-ivory/85 italic">
                {story.line}
              </p>
            </div>
          </div>
        }
      >
        {(prog) => (
          <>
            <Beat progress={prog} from={0} to={0.34}>
              <Eyebrow color={p.accent}>
                Scene {String(order + 1).padStart(2, '0')} · {story.environment}
              </Eyebrow>
              <p className="font-arabic mt-7 text-3xl sm:text-5xl" style={{ color: p.accent }} lang="ar">
                {p.arabic}
              </p>
              <h3 className="font-display mt-4 text-[clamp(2.4rem,10vw,7rem)] leading-none font-light uppercase">
                {story.title}
                <span className="ml-3 align-middle text-[0.28em] tracking-normal text-gold/60">
                  {p.honorific}
                </span>
              </h3>
            </Beat>

            {isMusa ? (
              <>
                <Beat progress={prog} from={0.34} to={0.6}>
                  <Statement size="md">
                    The sea ahead. Pharaoh’s army closing behind.
                    <br />
                    His people said: we are surely overtaken.
                  </Statement>
                </Beat>
                <Beat progress={prog} from={0.6} to={0.8}>
                  <Statement size="xl" gilded>
                    The sea
                    <br />
                    opens
                  </Statement>
                </Beat>
                <Beat progress={prog} from={0.8} to={1}>
                  <Statement size="md" className="italic">
                    “{story.line}”
                  </Statement>
                  <p className="mt-7 text-[0.66rem] tracking-[0.3em] text-gold/55 uppercase">
                    Surah Ash-Shu‘ara · 26:62
                  </p>
                </Beat>
              </>
            ) : (
              <Beat progress={prog} from={0.34} to={1}>
                <Statement size="md" className="italic">
                  “{story.line}”
                </Statement>
              </Beat>
            )}
          </>
        )}
      </Scene>

      {/* ── the reveals ──────────────────────────────────────────── */}
      <section
        aria-label={`What ${p.name} ${p.honorific} teaches`}
        className="relative flex min-h-[80svh] w-full items-center justify-center overflow-hidden px-5 py-20"
      >
        <div aria-hidden="true" className="absolute inset-0">
          <Plate id={story.id} opacity={0.55} />
          <div className="absolute inset-0 opacity-55">
            <SceneArt art={story.id} progress={0.9} accent={p.accent} />
          </div>
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(4,7,11,.72), rgba(4,7,11,.84) 50%, rgba(4,7,11,.96))',
            }}
          />
          <ParticleField weather={p.weather} density={0.6} color={p.accent} opacity={0.4} />
        </div>
        <Vignette strength={0.8} />
        <Grain opacity={0.03} />

        <div className="relative z-30 w-full max-w-4xl">
          <p className="text-center text-[0.66rem] tracking-[0.4em] uppercase" style={{ color: `${p.accent}bb` }}>
            {story.title} {p.honorific} · what it teaches
          </p>

          <ul className="mt-10 flex flex-wrap justify-center gap-3">
            {story.reveals.map((r, i) => {
              const on = open === i
              return (
                <li key={r.title}>
                  <button
                    type="button"
                    onClick={() => {
                      cue(on ? 'close' : 'select')
                      setOpen(on ? null : i)
                    }}
                    onMouseEnter={() => cue('hover')}
                    data-cursor="explore"
                    aria-pressed={on}
                    className="group relative cursor-pointer border px-6 py-4 text-[0.7rem] tracking-[0.24em] uppercase transition-all duration-500"
                    style={{
                      borderColor: on ? p.accent : `${p.accent}3a`,
                      color: on ? '#f6e5bf' : `${p.accent}dd`,
                      background: on ? `${p.accent}1c` : 'rgba(4,7,11,.5)',
                      boxShadow: on ? `0 0 40px -10px ${p.accent}` : 'none',
                    }}
                  >
                    {r.title}
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="mt-10 flex min-h-[13rem] justify-center">
            <AnimatePresence mode="wait">
              {open !== null ? (
                <InfoPanel
                  key={open}
                  title={story.reveals[open].title}
                  accent={p.accent}
                  onClose={() => {
                    cue('close')
                    setOpen(null)
                  }}
                >
                  {story.reveals[open].body}
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
    </>
  )
}

/* ------------------------------------------------------------------ */

function StoryBackdrop({
  id,
  progress,
  step,
  accent,
  weather,
}: {
  id: StoryEnvironment['id']
  progress: MotionValue<number>
  step: number
  accent: string
  weather: 'stars' | 'rain' | 'sand' | 'dust' | 'embers' | 'motes'
}) {
  const scale = useTransform(progress, [0, 1], [1.14, 1.02])
  const y = useTransform(progress, [0, 1], ['-3%', '3%'])
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <Plate id={id} opacity={0.9} />
      <motion.div className="absolute inset-0 opacity-85" style={{ scale, y }}>
        <SceneArt art={id} progress={step / 40} accent={accent} />
      </motion.div>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(4,7,11,.5), rgba(4,7,11,.24) 38%, rgba(4,7,11,.86))',
        }}
      />
      <ParticleField weather={weather} density={0.85} color={accent} opacity={0.55} />
      <GeometricPattern variant="lattice" opacity={0.02} scale={140} color={accent} />
      <SceneVeil progress={progress} />
      <Vignette strength={0.82} />
      <Grain opacity={0.032} />
      <SceneRail progress={progress} accent={accent} />
    </div>
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
          <SceneArt art="yusuf" progress={artProgress} accent={p.accent} />
        </motion.div>
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(4,7,11,.66), rgba(4,7,11,.5) 45%, rgba(4,7,11,.94))',
          }}
        />
        <ParticleField weather="motes" density={0.7} color={p.accent} opacity={0.5} />
      </div>
      <Vignette strength={0.82} />
      <Grain opacity={0.03} />

      <div className="relative z-30">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <Eyebrow color={p.accent}>
            Scene {String(order + 1).padStart(2, '0')} · {story.environment}
          </Eyebrow>
          <p className="font-arabic mt-6 text-3xl sm:text-4xl" style={{ color: p.accent }} lang="ar">
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
                <StageCard stage={s} index={i} accent={p.accent} active />
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
                  <StageCard stage={s} index={i} accent={p.accent} active={stage === i} />
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
                      background: stage === i ? p.accent : 'rgba(185,177,163,.28)',
                      boxShadow: stage === i ? `0 0 14px ${p.accent}` : 'none',
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
              style={{ borderColor: `${p.accent}33`, color: `${p.accent}dd` }}
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
        borderColor: active ? `${accent}66` : 'rgba(211,173,104,.14)',
        background: active ? 'rgba(7,12,20,.82)' : 'rgba(7,12,20,.6)',
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
