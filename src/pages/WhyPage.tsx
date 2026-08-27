import { useRef } from 'react'
import { motion } from 'framer-motion'
import { INTRO_LINES, INTRO_TEACHINGS, VERSES } from '../data/content'
import { CHAPTER_BY_PATH } from '../data/chapters'
import { useJourney } from '../lib/journey'
import ChapterPage from '../components/ChapterPage'
import { Reveal, SourceTag, useInViewSafe } from '../components/ui'

const CH = CHAPTER_BY_PATH['/why']
const VERSE = VERSES.find((v) => v.id === 'v-2-285')!

export default function WhyPage() {
  const { reduced } = useJourney()
  const statementRef = useRef<HTMLDivElement>(null)
  const statementIn = useInViewSafe(statementRef, { once: true, amount: 0.5 })

  return (
    <ChapterPage chapter={CH} weather="motes">
      {/* line-by-line intro */}
      <div className="mx-auto max-w-3xl space-y-8 text-center">
        {INTRO_LINES.map((line, i) => (
          <Reveal key={line} delay={i * 0.12} amount={0.5}>
            <p className="font-display text-[clamp(1.15rem,2.9vw,1.85rem)] leading-relaxed font-light text-ivory/80">
              {line}
            </p>
          </Reveal>
        ))}
      </div>

      {/* what they taught */}
      <Reveal className="mt-24" delay={0.1}>
        <p className="text-center text-[0.64rem] tracking-[0.4em] text-gold/60 uppercase">
          What every one of them taught
        </p>
      </Reveal>

      <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-px overflow-hidden border border-gold/12 bg-gold/12 sm:grid-cols-2 lg:grid-cols-3">
        {INTRO_TEACHINGS.map((t, i) => (
          <Reveal as="li" key={t.title} delay={0.05 * i} y={16} amount={0.2}>
            <div className="group h-full bg-ink/85 p-7 transition-colors duration-500 hover:bg-emerald-deep/40">
              <span className="font-display text-[0.62rem] tracking-[0.34em] text-gold/50 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 className="font-display mt-3 text-2xl font-light text-gold-soft transition-transform duration-500 group-hover:translate-x-1">
                {t.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ivory-dim/75">{t.body}</p>
            </div>
          </Reveal>
        ))}
      </ul>

      {/* the dramatic statement */}
      <div ref={statementRef} className="relative mt-36 mb-8 text-center">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          initial={reduced ? false : { opacity: 0, scale: 0.6 }}
          animate={statementIn ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
          transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: 'radial-gradient(circle, rgba(211,173,104,.16), transparent 66%)' }}
        />

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 30, filter: 'blur(14px)' }}
          animate={
            statementIn || reduced
              ? { opacity: 1, y: 0, filter: 'blur(0px)' }
              : { opacity: 0, y: 30, filter: 'blur(14px)' }
          }
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-display relative mx-auto max-w-3xl text-[clamp(1.5rem,4.6vw,3rem)] leading-tight font-light text-ivory/50"
        >
          “We do not believe in some Prophets and reject others.”
        </motion.p>

        <motion.div
          initial={reduced ? false : { scaleX: 0 }}
          animate={statementIn || reduced ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.2, delay: reduced ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="hairline mx-auto my-10 h-px w-56 origin-center"
          aria-hidden="true"
        />

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 40, filter: 'blur(20px)', scale: 0.94 }}
          animate={
            statementIn || reduced
              ? { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }
              : { opacity: 0, y: 40, filter: 'blur(20px)', scale: 0.94 }
          }
          transition={{ duration: 1.8, delay: reduced ? 0 : 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-gilded anim-shimmer relative text-[clamp(2.2rem,7.5vw,5.5rem)] leading-[0.98] font-light uppercase"
        >
          We believe
          <br />
          in them all.
        </motion.p>
      </div>

      {/* the verse that says it */}
      <Reveal className="mt-28" delay={0.1}>
        <figure className="surface-glass relative mx-auto max-w-3xl p-8 sm:p-12">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-40"
            style={{
              background:
                'linear-gradient(140deg, rgba(211,173,104,.08), transparent 45%, rgba(13,58,51,.14))',
            }}
          />
          <div className="relative">
            <SourceTag kind="quran" />
            <p
              lang="ar"
              dir="rtl"
              className="font-arabic mt-7 text-[clamp(1.35rem,3.6vw,2.15rem)] leading-[2.1] text-gold-soft"
            >
              {VERSE.arabic}
            </p>
            <div className="hairline my-8 h-px w-full" aria-hidden="true" />
            <blockquote className="font-display text-[clamp(1rem,2.2vw,1.3rem)] leading-relaxed font-light text-ivory/80 italic">
              {VERSE.translation}
            </blockquote>
            <figcaption className="mt-6 text-[0.64rem] tracking-[0.32em] text-gold/60 uppercase">
              {VERSE.surah} · {VERSE.reference}
            </figcaption>
          </div>
        </figure>
      </Reveal>
    </ChapterPage>
  )
}
