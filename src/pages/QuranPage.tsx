import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { VERSES, HADITH } from '../data/content'
import { CHAPTER_BY_PATH } from '../data/chapters'
import { useJourney } from '../lib/journey'
import ChapterPage from '../components/ChapterPage'
import { Reveal, SourceTag } from '../components/ui'

const CH = CHAPTER_BY_PATH['/quran']

export default function QuranPage() {
  const { reduced, cue } = useJourney()
  const [i, setI] = useState(0)
  const verse = VERSES[i]

  const go = useCallback(
    (dir: 1 | -1) => {
      cue('select')
      setI((cur) => (cur + dir + VERSES.length) % VERSES.length)
    },
    [cue],
  )

  const words = useMemo(() => verse.arabic.split(' '), [verse.arabic])

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
    <ChapterPage chapter={CH} weather="motes">
      <Reveal>
        <div
          role="group"
          tabIndex={0}
          onKeyDown={onKey}
          aria-label="Qur'an verses — use left and right arrow keys to move between verses"
          className="surface-glass relative overflow-hidden"
        >
          <span aria-hidden="true" className="absolute top-0 left-0 h-8 w-8 border-t border-l border-gold/35" />
          <span aria-hidden="true" className="absolute top-0 right-0 h-8 w-8 border-t border-r border-gold/35" />
          <span aria-hidden="true" className="absolute bottom-0 left-0 h-8 w-8 border-b border-l border-gold/35" />
          <span aria-hidden="true" className="absolute right-0 bottom-0 h-8 w-8 border-r border-b border-gold/35" />

          <div className="relative min-h-[26rem] px-6 py-12 sm:px-14 sm:py-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={verse.id}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.2 } }}
                transition={{ duration: reduced ? 0 : 0.4 }}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <SourceTag kind="quran" />
                  <span className="text-[0.64rem] tracking-[0.3em] text-ivory-dim/40 uppercase">
                    {verse.theme}
                  </span>
                </div>

                <p
                  lang="ar"
                  dir="rtl"
                  className="font-arabic mt-10 flex flex-wrap justify-center gap-x-3 gap-y-2 text-center text-[clamp(1.35rem,4.2vw,2.6rem)] leading-[2.05] text-gold-soft"
                >
                  {words.map((w, k) => (
                    <motion.span
                      key={`${verse.id}-${k}`}
                      initial={reduced ? false : { opacity: 0, y: 12, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{
                        duration: 0.7,
                        delay: reduced ? 0 : 0.1 + k * 0.055,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      {w}
                    </motion.span>
                  ))}
                </p>

                <div className="hairline my-10 h-px w-full" aria-hidden="true" />

                <motion.blockquote
                  initial={reduced ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: reduced ? 0 : 0.35 + words.length * 0.02 }}
                  className="font-display mx-auto max-w-2xl text-center text-[clamp(1rem,2.4vw,1.35rem)] leading-relaxed font-light text-ivory/85 italic"
                >
                  {verse.translation}
                </motion.blockquote>

                <motion.div
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.9, delay: reduced ? 0 : 0.55 + words.length * 0.02 }}
                  className="mt-9 text-center"
                >
                  <p className="font-display text-base text-gold-soft">
                    {verse.surah}
                    <span className="mx-3 text-gold/40">·</span>
                    <span className="tabular-nums">{verse.reference}</span>
                  </p>
                  <p className="mx-auto mt-4 max-w-lg text-[0.78rem] leading-relaxed text-ivory-dim/55">
                    {verse.context}
                  </p>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between border-t border-gold/12 px-4 py-3 sm:px-6">
            <button
              type="button"
              onClick={() => go(-1)}
              data-cursor="hover"
              aria-label="Previous verse"
              className="group flex cursor-pointer items-center gap-2 px-4 py-3.5 text-[0.65rem] tracking-[0.3em] text-ivory-dim/55 uppercase transition-colors hover:text-gold"
            >
              <ChevronLeft
                size={15}
                strokeWidth={1.4}
                className="transition-transform duration-400 group-hover:-translate-x-1"
              />
              Prev
            </button>

            <p className="font-display text-[0.62rem] tracking-[0.32em] text-gold/50 tabular-nums">
              {String(i + 1).padStart(2, '0')}
              <span className="mx-2 text-gold/25">/</span>
              {String(VERSES.length).padStart(2, '0')}
            </p>

            <button
              type="button"
              onClick={() => go(1)}
              data-cursor="hover"
              aria-label="Next verse"
              className="group flex cursor-pointer items-center gap-2 px-4 py-3.5 text-[0.65rem] tracking-[0.3em] text-ivory-dim/55 uppercase transition-colors hover:text-gold"
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
      </Reveal>

      <Reveal delay={0.15} className="mt-10">
        <ul className="flex flex-wrap justify-center gap-2">
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
                className={`cursor-pointer border px-3.5 py-2.5 text-[0.65rem] tracking-[0.18em] tabular-nums transition-all duration-400 ${
                  k === i
                    ? 'border-gold bg-gold/12 text-gold-bright'
                    : 'border-gold/15 text-ivory-dim/50 hover:border-gold/45 hover:text-gold-soft'
                }`}
              >
                {v.reference}
              </button>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.1} className="mt-24">
        <div className="text-center">
          <h2 className="text-[0.64rem] tracking-[0.4em] text-emerald-200/50 uppercase">
            And from the prophetic narrations
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[0.72rem] leading-relaxed text-ivory-dim/45">
            Hadith are the recorded words and practice of the Messenger ﷺ. They are kept distinct
            here from the Qur’an, which Muslims hold to be the literal speech of Allah.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden border border-emerald-300/12 bg-emerald-300/12 sm:grid-cols-2">
          {HADITH.map((h) => (
            <figure key={h.id} className="bg-ink/85 p-8 sm:p-10">
              <SourceTag kind="hadith" />
              <p
                lang="ar"
                dir="rtl"
                className="font-arabic mt-7 text-[clamp(1.15rem,2.8vw,1.6rem)] leading-[2] text-emerald-100/85"
              >
                {h.arabic}
              </p>
              <div
                aria-hidden="true"
                className="my-6 h-px w-full"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(110,231,183,.28), transparent)',
                }}
              />
              <blockquote className="font-display text-[0.98rem] leading-relaxed font-light text-ivory/80 italic">
                {h.translation}
              </blockquote>
              <figcaption className="mt-5 text-[0.66rem] tracking-[0.26em] text-emerald-200/55 uppercase">
                {h.reference}
              </figcaption>
              <p className="mt-4 text-[0.76rem] leading-relaxed text-ivory-dim/50">{h.context}</p>
            </figure>
          ))}
        </div>
      </Reveal>
    </ChapterPage>
  )
}
