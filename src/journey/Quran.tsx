import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { VERSES, HADITH } from '../data/content'
import { useJourney } from '../lib/journey'
import { ac } from '../lib/art'
import ParticleField from '../components/visuals/ParticleField'
import Plate from '../components/Plate'
import { GeometricPattern, OrnamentDivider } from '../components/visuals/GeometricPattern'
import { SourceTag } from '../components/ui'
import { Eyebrow, Statement } from './kit'

/**
 * The Words of Allah.
 *
 * Sixteen Qur'anic passages, each carried with its surah and ayah, plus the
 * two hadith kept deliberately separate. Nothing here is paraphrased into
 * scripture: the Arabic is quoted wording and the English is labelled as a
 * translation of meaning.
 */
export function QuranScene() {
  const { reduced, cue } = useJourney()
  const [i, setI] = useState(0)
  const verse = VERSES[i]
  const words = useMemo(() => verse.arabic.split(' '), [verse.arabic])

  const go = useCallback(
    (dir: 1 | -1) => {
      cue('select')
      setI((cur) => (cur + dir + VERSES.length) % VERSES.length)
    },
    [cue],
  )

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      e.stopPropagation()
      go(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      e.stopPropagation()
      go(-1)
    }
  }

  return (
    <section
      id="quran"
      data-scene="quran"
      aria-label="The words of Allah"
      className="cv-screen relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-5 py-20"
    >
      <div aria-hidden="true" className="absolute inset-0">
        <Plate id="ch-quran" opacity={0.62} />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(85% 62% at 50% 40%, rgb(var(--emerald-rgb) / .34), rgb(var(--ink-rgb) / .92) 74%)',
          }}
        />
        <GeometricPattern variant="khatam" opacity={0.04} scale={180} color={ac('#d3ad68')} drift={!reduced} />
        <ParticleField weather="motes" density={0.55} color="#d3ad68" opacity={0.45} />
      </div>

      <div className="relative z-30 w-full max-w-4xl">
        <div className="text-center">
          <Eyebrow>Chapter Eight</Eyebrow>
          <Statement size="md" gilded className="mt-5">
            The Words of Allah
          </Statement>
        </div>

        <OrnamentDivider className="my-8" color={ac('#d3ad68')} />

        {/* ── the verse ────────────────────────────────────────────── */}
        <div
          role="group"
          tabIndex={0}
          onKeyDown={onKey}
          aria-label="Qur'an verses — use the left and right arrow keys to move between them"
          className="surface-glass relative overflow-hidden"
        >
          <span aria-hidden="true" className="absolute top-0 left-0 h-8 w-8 border-t border-l border-gold/40" />
          <span aria-hidden="true" className="absolute top-0 right-0 h-8 w-8 border-t border-r border-gold/40" />
          <span aria-hidden="true" className="absolute bottom-0 left-0 h-8 w-8 border-b border-l border-gold/40" />
          <span aria-hidden="true" className="absolute right-0 bottom-0 h-8 w-8 border-r border-b border-gold/40" />

          <div className="relative min-h-[22rem] px-6 py-10 sm:px-12 sm:py-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={verse.id}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.18 } }}
                transition={{ duration: reduced ? 0 : 0.38 }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <SourceTag kind="quran" />
                  <span className="text-[0.64rem] tracking-[0.3em] text-ivory-dim/45 uppercase">
                    {verse.theme}
                  </span>
                </div>

                <p
                  lang="ar"
                  dir="rtl"
                  className="font-arabic mt-8 flex flex-wrap justify-center gap-x-3 gap-y-1 text-center text-[clamp(1.25rem,3.8vw,2.3rem)] leading-[2] text-gold-soft"
                >
                  {words.map((w, k) => (
                    <motion.span
                      key={`${verse.id}-${k}`}
                      initial={reduced ? false : { opacity: 0, y: 10, filter: 'blur(5px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{
                        duration: 0.6,
                        delay: reduced ? 0 : 0.08 + k * 0.045,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      {w}
                    </motion.span>
                  ))}
                </p>

                <div className="hairline my-8 h-px w-full" aria-hidden="true" />

                <motion.blockquote
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: reduced ? 0 : 0.3 + words.length * 0.018 }}
                  className="font-display mx-auto max-w-2xl text-center text-[clamp(.98rem,2.3vw,1.28rem)] leading-relaxed font-light text-ivory/85 italic"
                >
                  {verse.translation}
                </motion.blockquote>

                <motion.div
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: reduced ? 0 : 0.48 + words.length * 0.018 }}
                  className="mt-7 text-center"
                >
                  <p className="font-display text-base text-gold-soft">
                    {verse.surah}
                    <span className="mx-3 text-gold/40">·</span>
                    <span className="tabular-nums">{verse.reference}</span>
                  </p>
                  <p className="mx-auto mt-3 max-w-lg text-[0.78rem] leading-relaxed text-ivory-dim/60">
                    {verse.context}
                  </p>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between border-t border-gold/15 px-3 py-2 sm:px-5">
            <button
              type="button"
              onClick={() => go(-1)}
              data-cursor="hover"
              aria-label="Previous verse"
              className="group flex cursor-pointer items-center gap-2 px-4 py-3.5 text-[0.65rem] tracking-[0.3em] text-ivory-dim/60 uppercase transition-colors hover:text-gold"
            >
              <ChevronLeft
                size={15}
                strokeWidth={1.4}
                className="transition-transform duration-400 group-hover:-translate-x-1"
              />
              Prev
            </button>
            <p className="font-display text-[0.64rem] tracking-[0.32em] text-gold/55 tabular-nums">
              {String(i + 1).padStart(2, '0')}
              <span className="mx-2 text-gold/25">/</span>
              {String(VERSES.length).padStart(2, '0')}
            </p>
            <button
              type="button"
              onClick={() => go(1)}
              data-cursor="hover"
              aria-label="Next verse"
              className="group flex cursor-pointer items-center gap-2 px-4 py-3.5 text-[0.65rem] tracking-[0.3em] text-ivory-dim/60 uppercase transition-colors hover:text-gold"
            >
              Next
              <ChevronRight
                size={15}
                strokeWidth={1.4}
                className="transition-transform duration-400 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>

        {/* ── jump straight to a verse ─────────────────────────────── */}
        <ul className="mt-7 flex flex-wrap justify-center gap-2">
          {VERSES.map((v, k) => (
            <li key={v.id}>
              <button
                type="button"
                onClick={() => {
                  cue('hover')
                  setI(k)
                }}
                data-cursor="hover"
                aria-current={k === i}
                aria-label={`${v.surah} ${v.reference} — ${v.theme}`}
                className={`cursor-pointer border px-3 py-2.5 text-[0.64rem] tracking-[0.16em] tabular-nums transition-all duration-400 ${
                  k === i
                    ? 'border-gold bg-gold/12 text-gold-bright'
                    : 'border-gold/20 text-ivory-dim/55 hover:border-gold/50 hover:text-gold-soft'
                }`}
              >
                {v.reference}
              </button>
            </li>
          ))}
        </ul>

        {/* ── hadith, kept clearly apart from the Qur'an ───────────── */}
        <div className="mt-14">
          <p className="text-center text-[0.64rem] tracking-[0.38em] text-emerald-mid uppercase">
            And from the prophetic narrations
          </p>
          <p className="mx-auto mt-3 max-w-xl text-center text-[0.72rem] leading-relaxed text-ivory-dim/50">
            Hadith are the recorded words of the Messenger ﷺ. They are kept distinct here from the
            Qur’an, which Muslims hold to be the literal speech of Allah.
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {HADITH.map((h) => (
              <figure key={h.id} className="surface-glass p-6 sm:p-7">
                <SourceTag kind="hadith" />
                <p
                  lang="ar"
                  dir="rtl"
                  className="font-arabic mt-5 text-[clamp(1.05rem,2.4vw,1.4rem)] leading-[2] text-emerald-mid"
                >
                  {h.arabic}
                </p>
                <blockquote className="font-display mt-5 text-[0.92rem] leading-relaxed font-light text-ivory/80 italic">
                  {h.translation}
                </blockquote>
                <figcaption className="mt-4 text-[0.64rem] tracking-[0.24em] text-emerald-mid/80 uppercase">
                  {h.reference}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
