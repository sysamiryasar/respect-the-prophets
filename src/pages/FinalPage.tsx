import { Link } from 'react-router-dom'
import { RotateCcw } from 'lucide-react'
import { CHAPTER_BY_PATH } from '../data/chapters'
import { useJourney } from '../lib/journey'
import ChapterPage from '../components/ChapterPage'
import SceneStepper, { type Step } from '../components/SceneStepper'
import { OrnamentDivider } from '../components/visuals/GeometricPattern'
import { GoldButton } from '../components/ui'

const CH = CHAPTER_BY_PATH['/final']
const FADE_LINES = ['Different nations.', 'Different times.', 'Different trials.']

export default function FinalPage() {
  const { cue } = useJourney()

  const steps: Step[] = [
    ...FADE_LINES.map((line) => ({
      content: (
        <p className="font-display text-[clamp(1.6rem,6vw,3.4rem)] font-light text-ivory/60">
          {line}
        </p>
      ),
    })),
    {
      content: (
        <p className="font-display text-[clamp(1.9rem,7vw,4rem)] font-light text-gold-soft">
          One message.
        </p>
      ),
    },
    {
      content: (
        <p className="font-display text-gilded anim-shimmer text-[clamp(2.6rem,13vw,9rem)] leading-none font-light uppercase">
          Worship
          <br />
          Allah.
        </p>
      ),
    },
    {
      content: (
        <div className="space-y-3">
          {['Respect the Prophets.', 'Learn from the Prophets.', 'Follow the truth they brought.'].map(
            (l) => (
              <p
                key={l}
                className="font-display text-[clamp(1.05rem,3vw,1.7rem)] leading-relaxed font-light text-ivory/75"
              >
                {l}
              </p>
            ),
          )}
          <p className="font-arabic pt-6 text-xl text-gold/60 sm:text-2xl" lang="ar">
            صَلَّى اللَّهُ عَلَيْهِ وَسَلَّم
          </p>
        </div>
      ),
      after: (
        <Link to="/" onClick={() => cue('open')} className="inline-block">
          <GoldButton arrow="" size="lg">
            <span className="inline-flex items-center gap-3">
              Restart the journey
              <RotateCcw size={14} strokeWidth={1.5} aria-hidden="true" />
            </span>
          </GoldButton>
        </Link>
      ),
    },
  ]

  return (
    <ChapterPage chapter={CH} weather="stars">
      <SceneStepper steps={steps} accent={CH.accent} label="The final message" />

      <div className="mt-20 border-t border-gold/10 pt-10 text-center">
        <OrnamentDivider className="mb-8" />
        <p className="mx-auto max-w-xl text-[0.72rem] leading-relaxed text-ivory-dim/45">
          An educational project. Qur’anic passages are quoted with their surah and ayah; hadith are
          quoted with their collection. English renderings are conventional translations of meaning.
          In keeping with Islamic practice, no Prophet is depicted anywhere in this experience.
        </p>
        <p className="mt-6 text-[0.64rem] tracking-[0.36em] text-gold/35 uppercase">
          Respect the Prophets ﷺ
        </p>
      </div>
    </ChapterPage>
  )
}
