import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { PILLARS } from '../data/content'
import { CHAPTER_BY_PATH } from '../data/chapters'
import { useJourney } from '../lib/journey'
import ChapterPage from '../components/ChapterPage'
import ParticleField from '../components/visuals/ParticleField'
import { Rosette } from '../components/visuals/GeometricPattern'

const CH = CHAPTER_BY_PATH['/pillars']
const RADIUS = 41 // % of the wheel box
const SECRET_CLICKS = 5

export default function PillarsPage() {
  const { reduced, cue, compact } = useJourney()
  const [active, setActive] = useState<string | null>(null)
  const [secret, setSecret] = useState(false)
  const secretCount = useRef(0)
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([])

  const activePillar = PILLARS.find((p) => p.id === active) ?? null

  const select = useCallback(
    (id: string) => {
      setActive((cur) => {
        const next = cur === id ? null : id
        cue(next ? 'select' : 'close')
        return next
      })
    },
    [cue],
  )

  const tapHub = useCallback(() => {
    cue('hover')
    secretCount.current += 1
    if (secretCount.current >= SECRET_CLICKS) {
      secretCount.current = 0
      setSecret(true)
      cue('reveal')
    }
  }, [cue])

  const onNodeKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return
    e.preventDefault()
    e.stopPropagation()
    const last = PILLARS.length - 1
    const next =
      e.key === 'Home'
        ? 0
        : e.key === 'End'
          ? last
          : e.key === 'ArrowRight'
            ? (index + 1) % PILLARS.length
            : (index - 1 + PILLARS.length) % PILLARS.length
    nodeRefs.current[next]?.focus()
  }

  return (
    <ChapterPage chapter={CH} weather={activePillar ? 'motes' : 'stars'} wide>
      {/* ── the wheel ────────────────────────────────────────────── */}
      <div className="relative mx-auto aspect-square w-full max-w-[min(86vw,620px)]">
        <div aria-hidden="true" className="absolute inset-0">
          <Rosette
            className="absolute inset-0 h-full w-full opacity-25"
            progress={1}
            spin={!reduced}
            color="#8b6a42"
          />
          <div className="absolute inset-[9%] rounded-full border border-gold/15" />
          <div className="absolute inset-[26%] rounded-full border border-gold/10" />
        </div>

        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          {PILLARS.map((p, i) => {
            const a = (i / PILLARS.length) * Math.PI * 2 - Math.PI / 2
            const on = active === p.id
            return (
              <line
                key={p.id}
                x1="50"
                y1="50"
                x2={50 + Math.cos(a) * RADIUS}
                y2={50 + Math.sin(a) * RADIUS}
                stroke={p.highlight ? 'var(--color-gold)' : 'var(--color-bronze)'}
                strokeWidth={on ? 0.5 : 0.25}
                strokeOpacity={active ? (on ? 0.85 : 0.12) : p.highlight ? 0.6 : 0.3}
                style={{ transition: 'stroke-opacity .7s, stroke-width .7s' }}
              />
            )
          })}
        </svg>

        {/* centre hub — Iman (and the hidden interaction) */}
        <button
          type="button"
          onClick={tapHub}
          data-cursor="hover"
          aria-label="Iman — the centre of belief"
          className="group absolute top-1/2 left-1/2 z-20 flex h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center justify-center rounded-full"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-gold/35 bg-ink/80 backdrop-blur-sm transition-all duration-700 group-hover:border-gold/70 group-hover:shadow-[0_0_60px_-8px_rgb(var(--gold-rgb) / .55)]"
          />
          {!reduced && (
            <span
              aria-hidden="true"
              className="anim-pulse-ring absolute inset-0 rounded-full border border-gold/30"
            />
          )}
          <span
            className="font-arabic relative text-[clamp(1rem,3.2vw,1.6rem)] text-gold-soft/80"
            lang="ar"
          >
            إيمان
          </span>
          <span className="font-display text-gilded relative mt-0.5 text-[clamp(.85rem,2.6vw,1.35rem)] tracking-[0.3em] uppercase">
            Iman
          </span>
        </button>

        {/* the six nodes */}
        {PILLARS.map((p, i) => {
          const a = (i / PILLARS.length) * Math.PI * 2 - Math.PI / 2
          const on = active === p.id
          const dim = active !== null && !on
          return (
            <motion.button
              key={p.id}
              ref={(el) => {
                nodeRefs.current[i] = el
              }}
              type="button"
              onClick={() => select(p.id)}
              onKeyDown={(e) => onNodeKeyDown(e, i)}
              onMouseEnter={() => cue('hover')}
              data-cursor="hover"
              aria-pressed={on}
              aria-label={`${p.title}. ${p.short}`}
              className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center"
              style={{ left: `${50 + Math.cos(a) * RADIUS}%`, top: `${50 + Math.sin(a) * RADIUS}%` }}
              animate={{ opacity: dim ? 0.28 : 1, scale: on ? 1.14 : 1 }}
              transition={{ duration: reduced ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                aria-hidden="true"
                className={`relative flex h-[clamp(3rem,10vw,4.6rem)] w-[clamp(3rem,10vw,4.6rem)] items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-500 ${
                  on
                    ? 'border-gold bg-gold/15 shadow-[0_0_46px_-6px_rgb(var(--gold-rgb) / .7)]'
                    : p.highlight
                      ? 'border-gold/55 bg-ink/80 hover:border-gold'
                      : 'border-gold/25 bg-ink/80 hover:border-gold/60'
                }`}
              >
                <span className="font-display text-[clamp(.85rem,2.4vw,1.25rem)] text-gold-soft tabular-nums">
                  {p.index}
                </span>
                {p.highlight && !reduced && (
                  <span className="anim-pulse-ring absolute inset-0 rounded-full border border-gold/45" />
                )}
              </span>
              <span
                className={`mt-2.5 max-w-[7.5rem] text-center text-[0.62rem] leading-tight tracking-[0.16em] uppercase transition-colors duration-500 sm:text-[0.66rem] ${
                  on ? 'text-gold-bright' : p.highlight ? 'text-gold/80' : 'text-ivory-dim/60'
                }`}
              >
                {compact ? p.title.replace('Belief in ', '').replace('His ', '') : p.title}
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* ── detail panel ─────────────────────────────────────────── */}
      <div className="mx-auto mt-12 min-h-[13rem] max-w-3xl sm:mt-14">
        <AnimatePresence mode="wait">
          {activePillar ? (
            <motion.div
              key={activePillar.id}
              initial={reduced ? false : { opacity: 0, y: 26, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{
                opacity: 0,
                y: -14,
                filter: 'blur(8px)',
                transition: { duration: reduced ? 0 : 0.22 },
              }}
              transition={{ duration: reduced ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={`surface-glass relative p-8 sm:p-10 ${
                activePillar.highlight ? 'border-gold/45' : ''
              }`}
              role="status"
            >
              {activePillar.highlight && (
                <span className="absolute -top-3 left-8 bg-ink px-3 text-[0.62rem] tracking-[0.32em] text-gold uppercase">
                  The doorway
                </span>
              )}
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <h2 className="font-display text-[clamp(1.4rem,3.4vw,2.1rem)] font-light text-gold-bright">
                  {activePillar.title}
                </h2>
                <p className="font-arabic text-xl text-gold/70 sm:text-2xl" lang="ar">
                  {activePillar.arabic}
                </p>
              </div>
              <p className="mt-1 text-[0.66rem] tracking-[0.28em] text-gold/50 uppercase">
                {activePillar.short}
              </p>
              <div className="hairline my-6 h-px w-full" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-ivory/80 sm:text-base">
                {activePillar.body}
              </p>
              {activePillar.highlight && (
                <Link
                  to="/prophets"
                  onClick={() => cue('select')}
                  data-cursor="hover"
                  className="mt-7 inline-flex items-center gap-2 text-[0.64rem] tracking-[0.3em] text-gold uppercase transition-colors hover:text-gold-bright"
                >
                  Enter the timeline
                  <span aria-hidden="true">→</span>
                </Link>
              )}
            </motion.div>
          ) : (
            <motion.p
              key="prompt"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.18 } }}
              className="text-center text-[0.64rem] tracking-[0.34em] text-ivory-dim/40 uppercase"
            >
              Select a pillar to explore it
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── the hidden reveal ────────────────────────────────────── */}
      <AnimatePresence>
        {secret && (
          <motion.div
            className="fixed inset-0 z-[95] flex items-center justify-center px-6"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.8 }}
            role="dialog"
            aria-modal="true"
            aria-label="A hidden message"
            onClick={() => setSecret(false)}
          >
            <div aria-hidden="true" className="absolute inset-0 bg-ink/95 backdrop-blur-xl" />
            <ParticleField weather="stars" density={1.4} color="var(--color-gold)" opacity={0.8} />
            <div className="relative max-w-2xl text-center">
              <motion.p
                initial={reduced ? false : { opacity: 0, y: 24, filter: 'blur(12px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: reduced ? 0 : 1.4,
                  delay: reduced ? 0 : 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="font-display text-[clamp(1.2rem,3.4vw,2rem)] leading-relaxed font-light text-ivory/70 italic"
              >
                The Prophets came with one essential message.
              </motion.p>
              <motion.p
                initial={reduced ? false : { opacity: 0, y: 34, filter: 'blur(20px)', scale: 0.95 }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                transition={{
                  duration: reduced ? 0 : 1.8,
                  delay: reduced ? 0 : 1.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="font-display text-gilded anim-shimmer mt-10 text-[clamp(2rem,7vw,4.6rem)] leading-none font-light uppercase"
              >
                Worship Allah alone.
              </motion.p>
              <motion.button
                type="button"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduced ? 0 : 3.4, duration: reduced ? 0 : 1 }}
                onClick={() => setSecret(false)}
                data-cursor="hover"
                className="mt-16 cursor-pointer text-[0.66rem] tracking-[0.4em] text-ivory-dim/50 uppercase transition-colors hover:text-gold"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ChapterPage>
  )
}
