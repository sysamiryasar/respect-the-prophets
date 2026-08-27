import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { PILLARS } from '../data/content'
import { useJourney } from '../lib/journey'
import ParticleField from '../components/visuals/ParticleField'
import { GeometricPattern, Rosette } from '../components/visuals/GeometricPattern'
import { Grain, Vignette } from '../components/ui'
import { Eyebrow, Hotspot, InfoPanel, Statement } from './kit'

const SHORT: Record<string, string> = {
  allah: 'Allah',
  angels: 'Angels',
  books: 'Books',
  messengers: 'Messengers',
  'last-day': 'Last Day',
  qadar: 'Divine Decree',
}

const RADIUS = 38 // % of the constellation box

export function ImanScene() {
  const { reduced, cue } = useJourney()
  const [open, setOpen] = useState<string | null>(null)
  const active = PILLARS.find((p) => p.id === open) ?? null

  const go = () => {
    cue('open')
    document.getElementById('prophets')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <section
      id="iman"
      data-scene="iman"
      aria-label="The six pillars of iman"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center px-5 py-24"
    >
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={active?.id ?? 'idle'}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4 }}
            className="absolute inset-0"
            style={{
              background: active?.highlight
                ? 'radial-gradient(78% 62% at 50% 48%, rgba(211,173,104,.24), rgba(4,7,11,1) 72%)'
                : active
                  ? 'radial-gradient(78% 62% at 50% 48%, rgba(13,58,51,.4), rgba(4,7,11,1) 74%)'
                  : 'radial-gradient(78% 62% at 50% 48%, rgba(16,28,51,.52), rgba(4,7,11,1) 76%)',
            }}
          />
        </AnimatePresence>
        <ParticleField weather="stars" density={1.3} color="#e7cd9b" opacity={0.75} />
        <GeometricPattern variant="khatam" opacity={0.035} scale={190} color="#d3ad68" drift={!reduced} />
      </div>
      <Vignette strength={0.85} />
      <Grain opacity={0.03} />

      <div className="relative z-30 w-full max-w-6xl">
        <div className="text-center">
          <Eyebrow>Chapter Two</Eyebrow>
          <Statement size="md" gilded className="mt-5">
            The Six Pillars of Iman
          </Statement>
        </div>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
          {/* ── the constellation ────────────────────────────────── */}
          <motion.div
            className="relative mx-auto aspect-square w-full max-w-[min(84vw,540px)]"
            animate={{ rotate: active ? (reduced ? 0 : 6) : 0, scale: active ? 0.96 : 1 }}
            transition={{ duration: reduced ? 0 : 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div aria-hidden="true" className="absolute inset-0">
              <Rosette
                className="absolute inset-0 h-full w-full opacity-20"
                progress={1}
                spin={!reduced}
                color="#8b6a42"
              />
            </div>

            <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
              {PILLARS.map((p, i) => {
                const a = (i / PILLARS.length) * Math.PI * 2 - Math.PI / 2
                const on = open === p.id
                return (
                  <line
                    key={`s-${p.id}`}
                    x1="50"
                    y1="50"
                    x2={50 + Math.cos(a) * RADIUS}
                    y2={50 + Math.sin(a) * RADIUS}
                    stroke={p.highlight ? '#d3ad68' : '#8b6a42'}
                    strokeWidth={on ? 0.55 : 0.25}
                    strokeOpacity={open ? (on ? 0.9 : 0.08) : p.highlight ? 0.6 : 0.28}
                    style={{ transition: 'stroke-opacity .8s, stroke-width .8s' }}
                  />
                )
              })}
              {/* the ring joining them */}
              <polygon
                points={PILLARS.map((_, i) => {
                  const a = (i / PILLARS.length) * Math.PI * 2 - Math.PI / 2
                  return `${50 + Math.cos(a) * RADIUS},${50 + Math.sin(a) * RADIUS}`
                }).join(' ')}
                fill="none"
                stroke="#e7cd9b"
                strokeWidth="0.25"
                strokeOpacity={open ? 0.08 : 0.2}
                style={{ transition: 'stroke-opacity .8s' }}
              />
            </svg>

            {/* centre */}
            <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center">
              <span
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
                style={{ background: 'radial-gradient(circle, rgba(246,229,191,.4), transparent 70%)' }}
              />
              <p className="font-arabic relative text-2xl text-gold-soft/80 sm:text-3xl" lang="ar">
                إيمان
              </p>
              <p className="font-display text-gilded relative mt-1 text-2xl tracking-[0.3em] uppercase sm:text-3xl">
                Iman
              </p>
            </div>

            {/* the six points */}
            {PILLARS.map((p, i) => {
              const a = (i / PILLARS.length) * Math.PI * 2 - Math.PI / 2
              return (
                <Hotspot
                  key={p.id}
                  label={SHORT[p.id] ?? p.title}
                  accent={p.highlight ? '#f6e5bf' : '#d3ad68'}
                  size={p.highlight ? 'lg' : 'md'}
                  index={String(p.index)}
                  active={open === p.id}
                  dimmed={open !== null && open !== p.id}
                  onSelect={() => setOpen((c) => (c === p.id ? null : p.id))}
                  style={{
                    left: `${50 + Math.cos(a) * RADIUS}%`,
                    top: `${50 + Math.sin(a) * RADIUS}%`,
                  }}
                />
              )
            })}
          </motion.div>

          {/* ── the panel ────────────────────────────────────────── */}
          <div className="flex min-h-[20rem] items-center justify-center">
            <AnimatePresence mode="wait">
              {active ? (
                <InfoPanel
                  key={active.id}
                  title={active.title}
                  arabic={active.arabic}
                  accent={active.highlight ? '#f6e5bf' : '#d3ad68'}
                  footnote={active.short}
                >
                  {active.body}
                  {active.highlight && (
                    <button
                      type="button"
                      onClick={go}
                      data-cursor="hover"
                      className="group mt-7 flex cursor-pointer items-center gap-3 border border-gold/40 px-5 py-3 text-[0.66rem] tracking-[0.3em] text-gold-bright uppercase transition-colors hover:border-gold"
                    >
                      Follow this one
                      <ArrowRight
                        size={14}
                        strokeWidth={1.5}
                        className="transition-transform duration-500 group-hover:translate-x-1"
                      />
                    </button>
                  )}
                </InfoPanel>
              ) : (
                <motion.div
                  key="prompt"
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.18 } }}
                  className="max-w-sm text-center"
                >
                  <p className="text-[0.66rem] tracking-[0.34em] text-ivory-dim/40 uppercase">
                    Select a pillar
                  </p>
                  <p className="mt-6 text-sm leading-relaxed text-ivory-dim/55">
                    Six beliefs, described in the well-known narration of Jibril (AS). One of them
                    is the doorway into the rest of this journey.
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
