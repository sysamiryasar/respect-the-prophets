import { Link } from 'react-router-dom'
import JourneyNav from '../journey/JourneyNav'
import { Grain, Vignette } from '../components/ui'
import { IntroScene, WhyScene } from '../journey/Intro'
import { ImanScene } from '../journey/Iman'
import { ProphetsScene } from '../journey/Prophets'
import { StoriesScene } from '../journey/Stories'
import { TrialsScene, LessonsScene } from '../journey/TrialsLessons'
import { QuranScene } from '../journey/Quran'
import { MuhammadScene, ActionScene, FinalScene } from '../journey/Climax'

/**
 * The whole experience, as one continuous journey.
 *
 * Structure note: nothing here may be wrapped in an `overflow: hidden`
 * container. That would turn it into a scroll container and stop every
 * pinned scene from sticking to the viewport.
 */
export default function JourneyPage() {
  return (
    <>
      {/* One grain and one vignette for the whole journey. Per-section
          copies meant 31 full-viewport composited layers — and the grain's
          blend mode made each of those a real cost on every frame. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[44]">
        <Vignette strength={0.72} />
      </div>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[45]">
        <Grain opacity={0.032} />
      </div>

      <JourneyNav />

      <IntroScene />
      <WhyScene />
      <ImanScene />
      <ProphetsScene />
      <StoriesScene />
      <TrialsScene />
      <LessonsScene />
      <QuranScene />
      <MuhammadScene />
      <ActionScene />
      <FinalScene />

      <footer className="relative z-10 border-t border-gold/10 bg-ink px-5 py-10 text-center">
        <Link
          to="/chapters"
          className="inline-block px-4 py-3 text-[0.64rem] tracking-[0.34em] text-ivory-dim/45 uppercase transition-colors hover:text-gold"
        >
          Prefer it as separate pages? Browse the chapters →
        </Link>
      </footer>
    </>
  )
}
