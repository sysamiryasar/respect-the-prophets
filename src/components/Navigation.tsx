import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { CHAPTERS, chapterIndex } from '../data/chapters'
import { useJourney } from '../lib/journey'
import AudioControls from './AudioControls'

export default function Navigation() {
  const { reduced, cue, compact } = useJourney()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const index = chapterIndex(pathname)
  const onHome = pathname === '/'

  /* The bar is always present off the home page; on the home page it appears
     once the reader moves past the opening. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.5)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [pathname])

  /* Lock the page behind the mobile menu. */
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

  const visible = !onHome || scrolled
  const step = index >= 0 ? String(index + 1).padStart(2, '0') : '—'
  const total = String(CHAPTERS.length).padStart(2, '0')

  return (
    <>
      {/* ── chapter progress hairline ─────────────────────────────── */}
      <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[70] h-[2px] bg-gold/8">
        <div
          className="h-full origin-left bg-gradient-to-r from-bronze via-gold to-gold-bright transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)]"
          style={{
            transform: `scaleX(${index >= 0 ? (index + 1) / CHAPTERS.length : 0})`,
            transformOrigin: 'left',
          }}
        />
      </div>

      {/* ── floating bar ──────────────────────────────────────────── */}
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
              aria-label="Chapters"
              className="surface-glass mx-auto flex max-w-6xl items-center justify-between gap-4 px-3 py-2.5 sm:px-5"
            >
              <Link
                to="/"
                onClick={() => cue('select')}
                data-cursor="hover"
                className="group flex items-center gap-2.5 py-2 pr-2"
                aria-label="Back to the beginning"
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
                <span className="font-display hidden text-[0.66rem] tracking-[0.3em] text-ivory/80 uppercase sm:inline">
                  Respect the Prophets
                </span>
                <span className="font-arabic text-sm text-gold/70">ﷺ</span>
              </Link>

              {/* desktop chapter links */}
              <ul className="hidden items-center gap-0.5 xl:flex">
                {CHAPTERS.map((c) => (
                  <li key={c.id}>
                    <NavLink
                      to={c.path}
                      onClick={() => cue('select')}
                      onMouseEnter={() => cue('hover')}
                      data-cursor="hover"
                      className={({ isActive }) =>
                        `relative block px-2.5 py-2 text-[0.62rem] tracking-[0.2em] uppercase transition-colors duration-400 ${
                          isActive ? 'text-gold-bright' : 'text-ivory-dim/55 hover:text-gold-soft'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {c.short}
                          {isActive && (
                            <motion.span
                              layoutId="nav-underline"
                              className="absolute inset-x-2 -bottom-0.5 h-px bg-gold"
                              transition={{ duration: reduced ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2 sm:gap-3">
                <div
                  className="hidden items-center gap-2 md:flex"
                  aria-label={`Chapter ${step} of ${total}`}
                >
                  <span className="font-display text-[0.64rem] text-gold tabular-nums">{step}</span>
                  <span aria-hidden="true" className="relative block h-px w-14 bg-gold/15">
                    <span
                      className="absolute inset-y-0 left-0 bg-gold transition-[width] duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
                      style={{
                        width: `${index >= 0 ? ((index + 1) / CHAPTERS.length) * 100 : 0}%`,
                      }}
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
                  aria-label="Open the chapter menu"
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

      {/* ── side rail (wide screens) ──────────────────────────────── */}
      {!compact && (
        <AnimatePresence>
          {visible && (
            <motion.aside
              initial={reduced ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : 0.15 }}
              className="fixed top-1/2 right-4 z-[55] hidden -translate-y-1/2 2xl:block"
              aria-hidden="true"
            >
              <ul className="flex flex-col items-end gap-4">
                {CHAPTERS.map((c, i) => (
                  <li key={c.id}>
                    <Link
                      to={c.path}
                      tabIndex={-1}
                      className="group flex items-center gap-3"
                    >
                      <span
                        className={`text-[0.62rem] tracking-[0.24em] uppercase opacity-0 transition-opacity duration-400 group-hover:opacity-100 ${
                          i === index ? 'text-gold' : 'text-ivory-dim/60'
                        }`}
                      >
                        {c.short}
                      </span>
                      <span
                        className={`block h-px transition-all duration-500 ${
                          i === index ? 'w-8 bg-gold' : 'w-3.5 bg-ivory-dim/30 group-hover:w-6'
                        }`}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.aside>
          )}
        </AnimatePresence>
      )}

      {/* ── chapter menu ──────────────────────────────────────────── */}
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
            aria-label="Chapters"
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
              className="absolute inset-y-0 right-0 flex w-[min(88vw,23rem)] flex-col overflow-y-auto border-l border-gold/15 bg-ink/95 p-6 pt-8"
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

              <Link
                to="/"
                onClick={() => cue('select')}
                className="mt-8 border-b border-gold/8 pb-4 text-[0.64rem] tracking-[0.3em] text-ivory-dim/60 uppercase transition-colors hover:text-gold"
              >
                ← The beginning
              </Link>

              <ul className="mt-2">
                {CHAPTERS.map((c, i) => (
                  <li key={c.id}>
                    <NavLink
                      to={c.path}
                      onClick={() => cue('select')}
                      className={({ isActive }) =>
                        `group flex w-full items-baseline gap-4 border-b border-gold/8 py-4 text-left transition-colors ${
                          isActive ? 'text-gold-bright' : 'text-ivory/70'
                        }`
                      }
                    >
                      <span className="font-display text-[0.64rem] text-gold/40 tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-display text-xl font-light transition-transform duration-500 group-hover:translate-x-1">
                        {c.short}
                      </span>
                    </NavLink>
                  </li>
                ))}
              </ul>

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
