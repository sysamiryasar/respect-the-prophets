import { ac } from '../lib/art'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SCENE_ORDER, PROPHET_BY_ID } from '../data/prophets'
import { SCENES } from '../data/content'
import { CHAPTER_BY_PATH } from '../data/chapters'
import { useJourney } from '../lib/journey'
import ChapterPage from '../components/ChapterPage'
import Plate from '../components/Plate'
import ProphetGlyph from '../components/visuals/ProphetGlyph'
import { Reveal } from '../components/ui'

const CH = CHAPTER_BY_PATH['/stories']
const MotionLink = motion.create(Link)

export default function StoriesPage() {
  const { reduced, cue } = useJourney()

  return (
    <ChapterPage chapter={CH} weather="dust" wide>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SCENE_ORDER.map((id, i) => {
          const p = PROPHET_BY_ID[id]
          const scene = SCENES[id]
          return (
            <Reveal as="li" key={id} delay={i * 0.06} y={20} amount={0.15}>
              <MotionLink
                to={`/stories/${id}`}
                onClick={() => cue('open')}
                onMouseEnter={() => cue('hover')}
                data-cursor="explore"
                aria-label={`Scene ${i + 1}: ${p.name} ${p.honorific} — ${scene.kicker}`}
                className="group relative block h-full overflow-hidden border border-gold/15 transition-colors duration-500 hover:border-gold/45"
                whileHover={reduced ? undefined : { y: -6 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* the plate is the card */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Plate
                    id={id}
                    priority={i < 3}
                    opacity={0.85}
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                    className="transition-transform duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to bottom, rgb(var(--ink-rgb) / calc(.15 * var(--scrim-k))), rgb(var(--ink-rgb) / calc(.55 * var(--scrim-k))) 55%, rgb(var(--ink-rgb) / calc(.92 * var(--scrim-k))))',
                    }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(80% 60% at 50% 80%, ${ac(p.accent)}26, transparent 70%)`,
                    }}
                  />

                  <span className="absolute top-5 left-5 flex items-center gap-3">
                    <span
                      className="font-display text-[0.62rem] tracking-[0.34em] tabular-nums"
                      style={{ color: ac(p.accent) }}
                    >
                      Scene {String(i + 1).padStart(2, '0')}
                    </span>
                  </span>

                  <span
                    className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border transition-transform duration-700 group-hover:scale-110"
                    style={{
                      borderColor: `${ac(p.accent)}44`,
                      background: `radial-gradient(circle, ${ac(p.accent)}1f, transparent 70%)`,
                    }}
                  >
                    <ProphetGlyph id={id} className="h-5 w-5" color={ac(p.accent)} />
                  </span>

                  <span className="absolute right-5 bottom-4 left-5">
                    <span className="font-arabic block text-lg" style={{ color: `${ac(p.accent)}cc` }} lang="ar">
                      {p.arabic}
                    </span>
                    <span className="font-display mt-1 block text-3xl leading-none font-light text-ivory uppercase">
                      {p.name}
                      <span className="ml-2 align-middle text-[0.32em] tracking-normal text-gold/60">
                        {p.honorific}
                      </span>
                    </span>
                  </span>
                </div>

                <div className="relative bg-ink/80 p-6 backdrop-blur-sm">
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-0 h-px w-0 transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:w-full"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${ac(p.accent)}, transparent)`,
                    }}
                  />
                  <p className="text-[0.64rem] tracking-[0.28em] uppercase" style={{ color: `${ac(p.accent)}aa` }}>
                    {scene.kicker}
                  </p>
                  <p className="font-display mt-3 text-[1.02rem] leading-relaxed text-ivory/80 italic">
                    “{p.lesson}”
                  </p>
                  <p className="mt-5 flex items-center gap-2 text-[0.62rem] tracking-[0.3em] text-ivory-dim/45 uppercase transition-colors duration-500 group-hover:text-gold">
                    {scene.beats.length + 1} beats
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-500 group-hover:translate-x-1.5"
                    >
                      →
                    </span>
                  </p>
                </div>
              </MotionLink>
            </Reveal>
          )
        })}
      </ul>

      <Reveal className="mt-16" delay={0.1}>
        <p className="mx-auto max-w-xl text-center text-[0.72rem] leading-relaxed text-ivory-dim/45">
          Each scene advances one beat at a time — click, use the arrow keys, or swipe. Nothing
          scrolls away from you.
        </p>
      </Reveal>
    </ChapterPage>
  )
}
