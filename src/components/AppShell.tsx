import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CHAPTERS, chapterIndex } from '../data/chapters'
import { useJourney } from '../lib/journey'
import Navigation from './Navigation'
import CustomCursor from './CustomCursor'

export default function AppShell() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { reduced, setActiveIndex } = useJourney()
  const [wipe, setWipe] = useState(false)
  const firstRender = useRef(true)

  /* ── every route change starts at the top ───────────────────────── */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])

  /* ── keep the nav counter in step with the route ────────────────── */
  useEffect(() => {
    setActiveIndex(chapterIndex(pathname))
  }, [pathname, setActiveIndex])

  /* ── the transition veil ────────────────────────────────────────── */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (reduced) return
    setWipe(true)
    const t = window.setTimeout(() => setWipe(false), 720)
    return () => window.clearTimeout(t)
  }, [pathname, reduced])

  /* ── chapter-to-chapter keyboard shortcuts ──────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey || e.defaultPrevented) return
      const i = chapterIndex(pathname)
      if (e.key === 'ArrowRight' && i >= 0 && i < CHAPTERS.length - 1) {
        e.preventDefault()
        navigate(CHAPTERS[i + 1].path)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        navigate(i > 0 ? CHAPTERS[i - 1].path : '/')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pathname, navigate])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to the content
      </a>

      <CustomCursor />
      <Navigation />

      <AnimatePresence mode="wait">
        <motion.main
          id="main"
          key={pathname}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0, transition: { duration: 0.22 } }}
          transition={{ duration: 0.55, delay: reduced ? 0 : 0.14, ease: [0.16, 1, 0.3, 1] }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      {/* Cinematic wipe between chapters: a dark curtain crosses the frame
          with a thin gilded leading edge. */}
      <AnimatePresence>
        {wipe && (
          <motion.div
            key="wipe"
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <motion.div
              className="absolute inset-0 bg-ink"
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={{ clipPath: ['inset(0 0% 0 0)', 'inset(0 0 0 100%)'] }}
              transition={{ duration: 0.72, times: [0.42, 1], ease: [0.65, 0, 0.35, 1] }}
            />
            <motion.div
              className="absolute inset-y-0 w-[3px]"
              style={{
                background:
                  'linear-gradient(to bottom, transparent, #f6e5bf, #d3ad68, transparent)',
                boxShadow: '0 0 40px 10px rgba(211,173,104,.5)',
              }}
              initial={{ left: '-2%' }}
              animate={{ left: ['100%', '102%'] }}
              transition={{ duration: 0.72, times: [0.42, 1], ease: [0.65, 0, 0.35, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
