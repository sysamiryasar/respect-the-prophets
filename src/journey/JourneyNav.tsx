import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { JOURNEY_NAV } from '../data/journey'
import { useJourney } from '../lib/journey'
import AudioControls from '../components/AudioControls'

/**
 * The top progress bar: where you are in the journey, and a way to jump.
 * Appears once the reader leaves the opening.
 */
export default function JourneyNav() {
  const { reduced, cue, progress } = useJourney()
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.5)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Which named scene owns the middle of the viewport.
     An IntersectionObserver rather than measuring eleven elements on every
     scroll frame — that loop was forcing synchronous layout the whole way
     down the page. */
  useEffect(() => {
    const nodes = JOURNEY_NAV.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    )
    if (!nodes.length) return

    const visible = new Set<number>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const i = nodes.indexOf(e.target as HTMLElement)
          if (i < 0) continue
          if (e.isIntersecting) visible.add(i)
          else visible.delete(i)
        }
        if (visible.size) setActive(Math.max(...visible))
      },
      // a thin band across the middle of the screen
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    nodes.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    document.body.dataset.locked = 'true'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      delete document.body.dataset.locked
    }
  }, [menuOpen])

  const jump = (id: string) => {
    cue('select')
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }

  const step = String(active + 1).padStart(2, '0')
  const total = String(JOURNEY_NAV.length).padStart(2, '0')

  return (
    <>
      {/* continuous progress through the whole journey */}
      <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[70] h-[2px] bg-gold/8">
        <motion.div
          className="h-full origin-left bg-gradient-to-r from-bronze via-gold to-gold-bright"
          style={{ scaleX: progress }}
        />
      </div>

      <AnimatePresence>
        {visible && (
          <motion.header
            initial={reduced ? false : { y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-0 z-[60] px-3 pt-3 sm:px-5 sm:pt-4"
          >
            <nav
              aria-label="Journey sections"
              className="surface-glass mx-auto flex max-w-6xl items-center justify-between gap-4 px-3 py-2.5 sm:px-5"
            >
              <button
                type="button"
                onClick={() => jump('intro')}
                data-cursor="hover"
                aria-label="Back to the beginning"
                className="group flex cursor-pointer items-center gap-2.5 py-2 pr-2"
              >
                <svg viewBox="0 0 40 40" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor">
                  <g
                    className="text-gold transition-transform duration-700 group-hover:rotate-45"
                    style={{ transformOrigin: '20px 20px' }}
                  >
                    <rect x="8" y="8" width="24" height="24" strokeWidth="1.4" />
                    <rect x="8" y="8" width="24" height="24" strokeWidth="1.4" transform="rotate(45 20 20)" />
                  </g>
                </svg>
                <span className="font-arabic text-sm text-gold/70">ﷺ</span>
              </button>

              {/* the chapter chain */}
              <ol className="hidden items-center gap-0.5 xl:flex">
                {JOURNEY_NAV.map((s, i) => {
                  const on = i === active
                  const done = i < active
                  return (
                    <li key={s.id} className="flex items-center">
                      <button
                        type="button"
                        onClick={() => jump(s.id)}
                        onMouseEnter={() => cue('hover')}
                        data-cursor="hover"
                        aria-current={on ? 'true' : undefined}
                        className={`relative cursor-pointer px-2.5 py-2 text-[0.62rem] tracking-[0.2em] whitespace-nowrap uppercase transition-colors duration-400 ${
                          on
                            ? 'text-gold-bright'
                            : done
                              ? 'text-gold/45 hover:text-gold-soft'
                              : 'text-ivory-dim/45 hover:text-gold-soft'
                        }`}
                      >
                        {s.label}
                        {on && (
                          <motion.span
                            layoutId="journey-underline"
                            className="absolute inset-x-2 -bottom-0.5 h-px bg-gold"
                            transition={{ duration: reduced ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
                          />
                        )}
                      </button>
                      {i < JOURNEY_NAV.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="hidden text-[0.55rem] text-gold/20 2xl:inline"
                        >
                          →
                        </span>
                      )}
                    </li>
                  )
                })}
              </ol>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden items-center gap-2 2xl:flex" aria-label={`Section ${step} of ${total}`}>
                  <span className="font-display text-[0.64rem] text-gold tabular-nums">{step}</span>
                  <span aria-hidden="true" className="relative block h-px w-12 bg-gold/15">
                    <span
                      className="absolute inset-y-0 left-0 bg-gold transition-[width] duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
                      style={{ width: `${((active + 1) / JOURNEY_NAV.length) * 100}%` }}
                    />
                  </span>
                  <span className="font-display text-[0.64rem] text-gold/40 tabular-nums">{total}</span>
                </div>

                <AudioControls />

                <button
                  type="button"
                  onClick={() => {
                    cue('open')
                    setMenuOpen(true)
                  }}
                  data-cursor="hover"
                  aria-label="Open the section menu"
                  aria-expanded={menuOpen}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center border border-gold/20 text-gold/70 transition-colors hover:border-gold/60 hover:text-gold-bright xl:hidden"
                >
                  <Menu size={16} strokeWidth={1.5} />
                </button>
              </div>
            </nav>
          </motion.header>
        )}
      </AnimatePresence>

      {/* jump menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.3 }}
            className="fixed inset-0 z-[75] xl:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Journey sections"
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 cursor-default bg-ink/95 backdrop-blur-xl"
            />
            <motion.div
              initial={reduced ? false : { x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: reduced ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-y-0 right-0 flex w-[min(88vw,22rem)] flex-col overflow-y-auto border-l border-gold/15 bg-ink/95 p-6 pt-8"
            >
              <div className="flex items-center justify-between">
                <span className="text-[0.64rem] tracking-[0.36em] text-gold/60 uppercase">
                  The journey
                </span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="cursor-pointer p-2 text-gold/70 transition-colors hover:text-gold-bright"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              <ol className="mt-8">
                {JOURNEY_NAV.map((s, i) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => jump(s.id)}
                      className={`group flex w-full cursor-pointer items-baseline gap-4 border-b border-gold/8 py-4 text-left transition-colors ${
                        i === active ? 'text-gold-bright' : 'text-ivory/70'
                      }`}
                    >
                      <span className="font-display text-[0.64rem] text-gold/40 tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-display text-xl font-light transition-transform duration-500 group-hover:translate-x-1">
                        {s.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>

              <Link
                to="/chapters"
                onClick={() => cue('select')}
                className="mt-8 border-t border-gold/8 pt-6 text-[0.64rem] tracking-[0.3em] text-ivory-dim/55 uppercase transition-colors hover:text-gold"
              >
                Chapter pages →
              </Link>

              <p className="mt-auto pt-8 text-[0.64rem] tracking-[0.3em] text-ivory-dim/35 uppercase">
                {step} / {total}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
