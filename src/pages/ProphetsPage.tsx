import { ac } from '../lib/art'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PROPHETS } from '../data/prophets'
import { CHAPTER_BY_PATH } from '../data/chapters'
import { useJourney } from '../lib/journey'
import ChapterPage from '../components/ChapterPage'
import ProphetCard from '../components/ProphetCard'
import { Reveal } from '../components/ui'

const CH = CHAPTER_BY_PATH['/prophets']

export default function ProphetsPage() {
  const { compact, reduced, cue } = useJourney()
  const railRef = useRef<HTMLDivElement>(null)
  const [rail, setRail] = useState({ progress: 0, atStart: true, atEnd: false })

  const measure = useCallback(() => {
    const el = railRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setRail({
      progress: max > 4 ? el.scrollLeft / max : 0,
      atStart: el.scrollLeft <= 4,
      atEnd: max > 4 ? el.scrollLeft >= max - 4 : true,
    })
  }, [])

  useEffect(() => {
    const el = railRef.current
    if (!el) return
    measure()
    el.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      el.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [measure, compact])

  const nudge = (dir: 1 | -1) => {
    const el = railRef.current
    if (!el) return
    cue('hover')
    el.scrollBy({
      left: dir * Math.max(280, el.clientWidth * 0.72),
      behavior: reduced ? 'auto' : 'smooth',
    })
  }

  const onRailKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      e.stopPropagation()
      nudge(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      e.stopPropagation()
      nudge(-1)
    }
  }

  return (
    <ChapterPage chapter={CH} weather="stars" wide className="!px-0 sm:!px-0">
      <div className="px-5 sm:px-8">
        <Reveal>
          <p className="mx-auto max-w-xl border border-gold/12 bg-ink/60 px-6 py-4 text-center text-[0.72rem] leading-relaxed text-ivory-dim/55">
            <span className="text-gold/70">A note on order:</span> this path follows the sequence in
            which these prophets are traditionally presented. It is not a precise chronology — the
            exact dates of most of these lives are not established, and the Qur’an does not present
            them as a timeline.
          </p>
        </Reveal>
      </div>

      {/* ═══ Desktop / tablet: the celestial rail ═════════════════════ */}
      {!compact && (
        <div className="relative mt-16">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[3.25rem] z-10">
            <div className="relative h-px w-full bg-gradient-to-r from-transparent via-gold/25 to-transparent">
              <div
                className="absolute inset-y-0 left-0 bg-gold/70 transition-[width] duration-300 ease-out"
                style={{ width: `${rail.progress * 100}%` }}
              />
            </div>
          </div>

          <div
            ref={railRef}
            onKeyDown={onRailKey}
            tabIndex={0}
            role="region"
            aria-label="Timeline of the Messengers — scroll horizontally"
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-[max(1.25rem,calc(50vw-30rem))] pt-24 pb-10"
          >
            {PROPHETS.map((p, i) => (
              <div key={p.id} className="relative snap-center">
                <div aria-hidden="true" className="absolute -top-[5.5rem] left-1/2 z-10 -translate-x-1/2">
                  <span
                    className="relative block h-2.5 w-2.5 rotate-45 border"
                    style={{
                      borderColor: ac(p.accent),
                      background: p.ululAzm ? ac(p.accent) : 'transparent',
                      boxShadow: p.ululAzm ? `0 0 18px ${ac(p.accent)}` : 'none',
                    }}
                  />
                  <span className="mt-3 block text-center text-[0.62rem] tracking-[0.24em] text-ivory-dim/35 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <ProphetCard prophet={p} index={i} priority={i < 3} />
              </div>
            ))}
            <div aria-hidden="true" className="w-[max(1.25rem,calc(50vw-30rem))] shrink-0" />
          </div>

          <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-5 sm:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => nudge(-1)}
                disabled={rail.atStart}
                data-cursor="hover"
                aria-label="Previous prophets"
                className="flex h-11 w-11 cursor-pointer items-center justify-center border border-gold/25 text-gold/70 transition-all duration-400 hover:border-gold hover:text-gold-bright disabled:cursor-default disabled:opacity-25"
              >
                <ChevronLeft size={18} strokeWidth={1.4} />
              </button>
              <button
                type="button"
                onClick={() => nudge(1)}
                disabled={rail.atEnd}
                data-cursor="hover"
                aria-label="Next prophets"
                className="flex h-11 w-11 cursor-pointer items-center justify-center border border-gold/25 text-gold/70 transition-all duration-400 hover:border-gold hover:text-gold-bright disabled:cursor-default disabled:opacity-25"
              >
                <ChevronRight size={18} strokeWidth={1.4} />
              </button>
            </div>
            <p className="text-[0.62rem] tracking-[0.32em] text-ivory-dim/35 uppercase">
              Drag or scroll · select a card to open that prophet
            </p>
            <p className="font-display text-[0.62rem] tracking-[0.3em] text-gold/45 tabular-nums">
              {String(Math.round(rail.progress * (PROPHETS.length - 1)) + 1).padStart(2, '0')} /{' '}
              {PROPHETS.length}
            </p>
          </div>
        </div>
      )}

      {/* ═══ Mobile: the same path, turned upright ════════════════════ */}
      {compact && (
        <div className="relative mx-auto mt-14 max-w-lg px-5">
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-[1.55rem] w-px bg-gradient-to-b from-transparent via-gold/25 to-transparent"
          />
          <ol className="space-y-8">
            {PROPHETS.map((p, i) => (
              <li key={p.id} className="relative pl-12">
                <span
                  aria-hidden="true"
                  className="absolute top-8 left-[1.05rem] block h-2.5 w-2.5 rotate-45 border"
                  style={{
                    borderColor: ac(p.accent),
                    background: p.ululAzm ? ac(p.accent) : 'transparent',
                    boxShadow: p.ululAzm ? `0 0 14px ${ac(p.accent)}` : 'none',
                  }}
                />
                <Reveal y={18} amount={0.15}>
                  <ProphetCard prophet={p} index={i} orientation="vertical" priority={i < 2} />
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      )}
    </ChapterPage>
  )
}
