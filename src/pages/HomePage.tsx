import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CHAPTERS } from '../data/chapters'
import { useJourney } from '../lib/journey'
import Plate from '../components/Plate'
import ParticleField from '../components/visuals/ParticleField'
import { GeometricPattern, Rosette, OrnamentDivider } from '../components/visuals/GeometricPattern'
import { GoldButton, Grain, Reveal, Vignette } from '../components/ui'

/** 0 black · 1 particles · 2 distant light · 3 pattern · 4 title · 5 controls */
const STAGE_TIMINGS = [220, 900, 1500, 2200, 3400]

export default function HomePage() {
  const { reduced, enter, cue } = useJourney()
  const navigate = useNavigate()
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
    navigate('/why')
  }

  return (
    <>
      {/* ══ the opening ══════════════════════════════════════════════ */}
      <section
        aria-label="Respect the Prophets — introduction"
        className="relative isolate flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-5 py-28"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink">
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 1.08 }}
            animate={{ opacity: at(2) ? 1 : 0, scale: 1 }}
            transition={{ duration: 3.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Plate id="ch-home" priority opacity={0.75} />
          </motion.div>

          <motion.div
            className="absolute top-1/2 left-1/2 h-[130vmax] w-[130vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
            initial={reduced ? false : { opacity: 0, scale: 0.35 }}
            animate={{ opacity: at(2) ? 1 : 0, scale: at(2) ? 1 : 0.35 }}
            transition={{ duration: 3.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background:
                'radial-gradient(circle, rgba(211,173,104,.18) 0%, rgba(139,106,66,.09) 26%, rgba(10,17,32,.3) 52%, rgba(4,7,11,0) 72%)',
            }}
          />

          <motion.div
            className="absolute inset-0"
            initial={reduced ? false : { opacity: 0, scale: 1.14 }}
            animate={{ opacity: at(3) ? 1 : 0, scale: at(3) ? 1 : 1.14 }}
            transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
          >
            <GeometricPattern variant="khatam" opacity={0.055} scale={168} color="#d3ad68" />
            <GeometricPattern variant="lattice" opacity={0.03} scale={92} color="#4c8f83" />
          </motion.div>

          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={reduced ? false : { opacity: 0, scale: 0.86, rotate: -8 }}
            animate={{ opacity: at(3) ? 0.32 : 0, scale: at(3) ? 1 : 0.86, rotate: 0 }}
            transition={{ duration: 3.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Rosette
              className="h-[min(88vmin,760px)] w-[min(88vmin,760px)]"
              progress={at(3) ? 1 : 0}
              spin={!reduced}
            />
          </motion.div>

          <motion.div
            className="absolute inset-0"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: at(1) ? 1 : 0 }}
            transition={{ duration: 2.4 }}
          >
            <ParticleField weather="stars" density={1.15} color="#e7cd9b" opacity={0.75} />
            <ParticleField weather="dust" density={0.55} color="#d3ad68" opacity={0.5} speed={0.7} />
          </motion.div>
        </div>

        <Vignette strength={0.9} />
        <Grain opacity={0.04} />

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
            initial={
              reduced ? false : { opacity: 0, y: 34, filter: 'blur(18px)', letterSpacing: '0.5em' }
            }
            animate={
              at(4)
                ? { opacity: 1, y: 0, filter: 'blur(0px)', letterSpacing: '0.14em' }
                : { opacity: 0, y: 34, filter: 'blur(18px)', letterSpacing: '0.5em' }
            }
            transition={{ duration: 2.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-gilded anim-shimmer text-[clamp(2.1rem,8.2vw,6.2rem)] leading-[0.95] font-light uppercase"
          >
            Respect the
            <br />
            Prophets
            <span className="font-arabic ml-3 align-middle text-[0.42em] tracking-normal text-gold-soft">
              ﷺ
            </span>
          </motion.h1>

          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: at(4) ? 1 : 0 }}
            transition={{ duration: 1.6, delay: reduced ? 0 : 0.5 }}
            className="mt-8 w-full"
          >
            <OrnamentDivider />
          </motion.div>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: at(4) ? 1 : 0, y: 0 }}
            transition={{ duration: 1.6, delay: reduced ? 0 : 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="font-display mx-auto mt-8 max-w-2xl text-[clamp(1rem,2.4vw,1.45rem)] leading-relaxed font-light text-ivory/75 italic"
          >
            A journey through the lives, struggles, teachings, and legacy of the Messengers of Allah.
          </motion.p>

          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: at(5) ? 1 : 0 }}
            transition={{ duration: 1.4, delay: reduced ? 0 : 0.2 }}
            className="mt-5 text-[0.64rem] tracking-[0.42em] text-ivory-dim/45 uppercase"
          >
            Faith · History · Character
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: at(5) ? 1 : 0, y: 0 }}
            transition={{ duration: 1.5, delay: reduced ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-14 flex flex-col items-center gap-5"
          >
            <GoldButton size="lg" onClick={begin}>
              Begin the Journey
            </GoldButton>
            <p className="text-[0.62rem] tracking-[0.34em] text-ivory-dim/35 uppercase">
              Nine chapters · each its own page
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: at(5) ? 1 : 0 }}
          transition={{ duration: 1.4, delay: reduced ? 0 : 1 }}
          className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-3"
        >
          <span className="text-[0.62rem] tracking-[0.4em] text-ivory-dim/45 uppercase">
            Or choose a chapter
          </span>
          <span aria-hidden="true" className="relative block h-11 w-px overflow-hidden bg-gold/15">
            <span className="anim-scroll-cue absolute inset-x-0 top-0 block h-4 bg-gradient-to-b from-transparent via-gold to-transparent" />
          </span>
        </motion.div>
      </section>

      {/* ══ chapter index ════════════════════════════════════════════ */}
      <section
        aria-label="Chapters"
        className="relative isolate w-full overflow-hidden bg-ink px-5 py-24 sm:px-8 sm:py-32"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(90% 60% at 50% 0%, rgba(10,17,32,.9), rgba(4,7,11,1) 65%)',
            }}
          />
          <GeometricPattern variant="lattice" opacity={0.03} scale={110} color="#4c8f83" />
          <ParticleField weather="motes" density={0.5} color="#d3ad68" opacity={0.4} />
        </div>

        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-[clamp(1.5rem,4vw,2.6rem)] font-light">
            The <span className="text-gilded">Journey</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ivory-dim/60">
            Nine chapters, in order. Each opens as its own page — go straight through, or start
            wherever you like.
          </p>
        </Reveal>

        <ul className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CHAPTERS.map((c, i) => (
            <Reveal as="li" key={c.id} delay={i * 0.05} y={18} amount={0.15}>
              <Link
                to={c.path}
                onClick={() => cue('select')}
                data-cursor="explore"
                className="group relative flex h-full flex-col overflow-hidden border border-gold/12 transition-colors duration-500 hover:border-gold/45"
              >
                <span className="relative block aspect-[16/9] w-full overflow-hidden">
                  <Plate
                    id={c.plate}
                    opacity={0.8}
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                    className="transition-transform duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.07]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to bottom, rgba(4,7,11,.2), rgba(4,7,11,.6) 60%, rgba(4,7,11,.95))',
                    }}
                  />
                  <span
                    className="font-display absolute top-4 left-5 text-[0.62rem] tracking-[0.34em] tabular-nums"
                    style={{ color: c.accent }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display absolute right-5 bottom-4 left-5 block text-2xl leading-tight font-light text-ivory">
                    {c.short}
                  </span>
                </span>
                <span className="relative flex flex-1 flex-col bg-ink/85 p-6 backdrop-blur-sm">
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-0 h-px w-0 transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:w-full"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${c.accent}, transparent)`,
                    }}
                  />
                  <span className="text-[0.62rem] tracking-[0.3em] uppercase" style={{ color: `${c.accent}aa` }}>
                    {c.kicker}
                  </span>
                  <span className="mt-3 block text-[0.85rem] leading-relaxed text-ivory-dim/65">
                    {c.standfirst}
                  </span>
                  <span className="mt-auto flex items-center gap-2 pt-6 text-[0.62rem] tracking-[0.3em] text-ivory-dim/40 uppercase transition-colors duration-500 group-hover:text-gold">
                    Open chapter
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-500 group-hover:translate-x-1.5"
                    >
                      →
                    </span>
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-16 text-center" delay={0.1}>
          <p className="mx-auto max-w-lg text-[0.72rem] leading-relaxed text-ivory-dim/40">
            In keeping with Islamic practice, no Prophet is depicted anywhere in this experience.
            Every scene is told through landscape, architecture, object and light.
          </p>
        </Reveal>
      </section>
    </>
  )
}
