import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { LESSONS, type Lesson } from '../data/content'
import { CHAPTER_BY_PATH } from '../data/chapters'
import { useJourney } from '../lib/journey'
import ChapterPage from '../components/ChapterPage'
import ParticleField from '../components/visuals/ParticleField'
import { Reveal } from '../components/ui'

const CH = CHAPTER_BY_PATH['/lessons']

export default function LessonsPage() {
  const { reduced, cue } = useJourney()
  const [open, setOpen] = useState<Lesson | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const restore = useRef<HTMLElement | null>(null)

  const close = useCallback(() => {
    cue('close')
    setOpen(null)
  }, [cue])

  useEffect(() => {
    if (!open) return
    restore.current = document.activeElement as HTMLElement
    document.body.dataset.locked = 'true'
    const t = window.setTimeout(() => closeRef.current?.focus(), 60)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
      delete document.body.dataset.locked
      restore.current?.focus?.()
    }
  }, [open, close])

  return (
    <ChapterPage chapter={CH} weather="stars" wide>
      <ul className="grid grid-cols-1 gap-px overflow-hidden border border-gold/12 bg-gold/12 sm:grid-cols-2 lg:grid-cols-4">
        {LESSONS.map((l, i) => (
          <Reveal as="li" key={l.id} delay={0.04 * i} y={18} amount={0.15}>
            <button
              type="button"
              onClick={() => {
                cue('open')
                setOpen(l)
              }}
              onMouseEnter={() => cue('hover')}
              data-cursor="explore"
              aria-label={`${l.title} — ${l.short}`}
              className="group relative flex h-full w-full cursor-pointer flex-col items-start overflow-hidden bg-ink/85 p-8 text-left transition-colors duration-500 hover:bg-emerald-deep/30"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{
                  background:
                    'radial-gradient(120% 80% at 50% 100%, rgba(211,173,104,.14), transparent 65%)',
                }}
              />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px w-0 bg-gold transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:w-full"
              />

              <span className="font-display relative text-[0.62rem] tracking-[0.34em] text-gold/40 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>

              <span
                className="font-arabic relative mt-6 text-3xl text-gold/55 transition-all duration-700 group-hover:-translate-y-0.5 group-hover:text-gold"
                lang="ar"
              >
                {l.arabic}
              </span>

              <span className="font-display relative mt-3 text-2xl font-light tracking-wide text-ivory uppercase transition-transform duration-700 group-hover:translate-x-1">
                {l.title}
              </span>
              <span className="relative mt-2 text-[0.68rem] tracking-[0.14em] text-gold/50 italic">
                {l.transliteration}
              </span>

              <span className="relative mt-5 block text-sm leading-relaxed text-ivory-dim/70">
                {l.short}
              </span>

              <span className="relative mt-auto flex items-center gap-2 pt-8 text-[0.62rem] tracking-[0.3em] text-gold/0 uppercase transition-colors duration-500 group-hover:text-gold/80 group-focus-visible:text-gold/80">
                Expand
                <span
                  aria-hidden="true"
                  className="transition-transform duration-500 group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </button>
          </Reveal>
        ))}
      </ul>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[85] flex items-center justify-center px-4 py-10"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.4 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${open.title} — expanded`}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="absolute inset-0 cursor-default bg-ink/92 backdrop-blur-xl"
            />
            <ParticleField weather="motes" density={0.8} color="#d3ad68" opacity={0.45} />

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 40, scale: 0.97, filter: 'blur(14px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 24, scale: 0.98, filter: 'blur(10px)' }}
              transition={{ duration: reduced ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="surface-glass relative max-h-full w-full max-w-2xl overflow-y-auto p-8 sm:p-12"
            >
              <span aria-hidden="true" className="absolute top-0 left-0 h-8 w-8 border-t border-l border-gold/40" />
              <span aria-hidden="true" className="absolute right-0 bottom-0 h-8 w-8 border-r border-b border-gold/40" />

              <button
                ref={closeRef}
                type="button"
                onClick={close}
                data-cursor="hover"
                aria-label="Close"
                className="absolute top-5 right-5 cursor-pointer p-2 text-gold/60 transition-colors hover:text-gold-bright"
              >
                <X size={17} strokeWidth={1.5} />
              </button>

              <p className="font-arabic text-4xl text-gold-soft sm:text-5xl" lang="ar">
                {open.arabic}
              </p>
              <h2 className="font-display text-gilded mt-4 text-[clamp(2rem,6vw,3.4rem)] leading-none font-light uppercase">
                {open.title}
              </h2>
              <p className="mt-3 text-[0.68rem] tracking-[0.24em] text-gold/55 italic">
                {open.transliteration} · {open.short}
              </p>

              <div className="hairline my-8 h-px w-full" aria-hidden="true" />

              <p className="text-[0.95rem] leading-relaxed text-ivory/85 sm:text-base">{open.body}</p>

              <div className="mt-9 border-l-2 border-gold/35 pl-5">
                <p className="text-[0.64rem] tracking-[0.32em] text-gold/55 uppercase">
                  Seen most clearly in
                </p>
                <p className="font-display mt-2 text-lg leading-relaxed font-light text-ivory/80 italic">
                  {open.exemplar}
                </p>
              </div>

              <p className="mt-8 text-[0.64rem] tracking-[0.28em] text-gold/45 uppercase">
                {open.reference}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ChapterPage>
  )
}
