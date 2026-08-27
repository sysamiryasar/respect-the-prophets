import { Link } from 'react-router-dom'
import JourneyNav from '../journey/JourneyNav'
import { IntroScene, WhyScene } from '../journey/Intro'
import { ImanScene } from '../journey/Iman'
import { ProphetsScene } from '../journey/Prophets'
import { StoriesScene } from '../journey/Stories'
import { TrialsScene, LessonsScene } from '../journey/TrialsLessons'
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
      <JourneyNav />

      <IntroScene />
      <WhyScene />
      <ImanScene />
      <ProphetsScene />
      <StoriesScene />
      <TrialsScene />
      <LessonsScene />
      <MuhammadScene />
      <ActionScene />
      <FinalScene />

      <footer className="relative z-10 border-t border-gold/10 bg-ink px-5 py-10 text-center">
        <Link
          to="/chapters"
          className="text-[0.64rem] tracking-[0.34em] text-ivory-dim/45 uppercase transition-colors hover:text-gold"
        >
          Prefer it as separate pages? Browse the chapters →
        </Link>
      </footer>
    </>
  )
}
