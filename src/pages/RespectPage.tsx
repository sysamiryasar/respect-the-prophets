import { RESPECT_LINES, VERSES } from '../data/content'
import { CHAPTER_BY_PATH } from '../data/chapters'
import ChapterPage from '../components/ChapterPage'
import SceneStepper, { type Step } from '../components/SceneStepper'
import { Reveal, SourceTag } from '../components/ui'

const CH = CHAPTER_BY_PATH['/respect']
const VERSE = VERSES.find((v) => v.id === 'v-6-90')!

export default function RespectPage() {
  const steps: Step[] = [
    {
      content: (
        <p className="font-display text-[clamp(1.4rem,4.4vw,2.8rem)] leading-tight font-light text-ivory/55">
          Respecting the Prophets is not only
          <br />
          about knowing their names.
        </p>
      ),
    },
    ...RESPECT_LINES.map((line) => ({
      content: (
        <p className="font-display text-gilded anim-shimmer text-[clamp(1.9rem,7.5vw,5rem)] leading-[1.05] font-light uppercase">
          {line}
        </p>
      ),
    })),
  ]

  return (
    <ChapterPage chapter={CH} weather="dust">
      <SceneStepper
        steps={steps}
        accent={CH.accent}
        label="Respect is more than words — six things it asks of us"
      />

      <Reveal className="mt-20">
        <figure className="surface-glass p-8 text-center sm:p-12">
          <SourceTag kind="quran" />
          <p
            lang="ar"
            dir="rtl"
            className="font-arabic mt-8 text-[clamp(1.3rem,3.4vw,2rem)] leading-[2.1] text-gold-soft"
          >
            {VERSE.arabic}
          </p>
          <div className="hairline my-7 h-px w-full" aria-hidden="true" />
          <blockquote className="font-display text-[clamp(1rem,2.3vw,1.3rem)] leading-relaxed font-light text-ivory/80 italic">
            {VERSE.translation}
          </blockquote>
          <figcaption className="mt-5 text-[0.66rem] tracking-[0.3em] text-gold/55 uppercase">
            {VERSE.surah} · {VERSE.reference}
          </figcaption>
          <p className="mx-auto mt-5 max-w-md text-[0.75rem] leading-relaxed text-ivory-dim/50">
            {VERSE.context}
          </p>
        </figure>
      </Reveal>
    </ChapterPage>
  )
}
