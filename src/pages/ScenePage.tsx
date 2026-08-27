import { useCallback, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, LayoutGrid } from 'lucide-react'
import { SCENE_ORDER, PROPHET_BY_ID, type ArtKey } from '../data/prophets'
import { SCENES, VERSES } from '../data/content'
import { useJourney } from '../lib/journey'
import Plate from '../components/Plate'
import SceneArt from '../components/visuals/SceneArt'
import ParticleField from '../components/visuals/ParticleField'
import { OrnamentDivider } from '../components/visuals/GeometricPattern'
import SceneStepper, { type Step } from '../components/SceneStepper'
import { Grain, GoldButton, SourceTag, Vignette } from '../components/ui'

/**
 * One cinematic scene, presented as a stage rather than a scroll.
 *
 * The artwork behind reacts to the beat you are on — Musa's sea parts, Ibrahim's
 * fire cools into light, Yusuf's well becomes prison, palace, then stars — but
 * the reader controls the pace, not the scrollbar.
 */
export default function ScenePage() {
  const { id } = useParams<{ id: string }>()
  const { reduced, cue } = useJourney()
  const [progress, setProgress] = useState(0)

  const onStep = useCallback((_i: number, p: number) => setProgress(p), [])

  const key = id as ArtKey | undefined
  const valid = key && SCENE_ORDER.includes(key)
  if (!valid) return <Navigate to="/stories" replace />

  const prophet = PROPHET_BY_ID[key]
  const scene = SCENES[key]
  const order = SCENE_ORDER.indexOf(key)
  const prev = order > 0 ? SCENE_ORDER[order - 1] : null
  const next = order < SCENE_ORDER.length - 1 ? SCENE_ORDER[order + 1] : null
  const verse = scene.verseId ? VERSES.find((v) => v.id === scene.verseId) : undefined

  const steps: Step[] = [
    {
      content: (
        <div>
          <p className="font-arabic text-3xl sm:text-5xl" style={{ color: prophet.accent }} lang="ar">
            {prophet.arabic}
          </p>
          <h1 className="font-display mt-5 text-[clamp(2.4rem,10vw,6.5rem)] leading-none font-light uppercase">
            {prophet.name}
            <span className="ml-3 align-middle text-[0.28em] tracking-normal text-gold/60">
              {prophet.honorific}
            </span>
          </h1>
          <OrnamentDivider className="mt-8" color={prophet.accent} />
          <p className="mt-8 text-[0.68rem] tracking-[0.38em] text-ivory-dim/55 uppercase">
            {prophet.epithet}
          </p>
        </div>
      ),
    },
    ...scene.beats.map((b) => ({
      label: b.label,
      content: (
        <p className="font-display text-[clamp(1.3rem,4.2vw,2.6rem)] leading-[1.4] font-light text-ivory/92">
          {b.text}
        </p>
      ),
    })),
    {
      label: 'The lesson',
      content: (
        <p className="font-display text-[clamp(1.25rem,3.8vw,2.3rem)] leading-[1.45] font-light text-ivory/90 italic">
          {scene.lesson}
        </p>
      ),
      after: (
        <div className="mx-auto max-w-xl">
          {verse && (
            <div className="border-t border-gold/15 pt-8">
              <SourceTag kind="quran" />
              <p
                lang="ar"
                dir="rtl"
                className="font-arabic mt-5 text-[clamp(1.1rem,2.8vw,1.6rem)] leading-[2]"
                style={{ color: prophet.accent }}
              >
                {verse.arabic}
              </p>
              <p className="mt-4 text-[0.66rem] tracking-[0.3em] text-gold/55 uppercase">
                {verse.surah} · {verse.reference}
              </p>
            </div>
          )}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to={`/prophets/${key}`} onClick={() => cue('select')}>
              <GoldButton size="sm">Full page on {prophet.name}</GoldButton>
            </Link>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="relative min-h-[100svh]">
      {/* ── the stage backdrop ─────────────────────────────────────── */}
      <div aria-hidden="true" className="fixed inset-0 -z-10">
        <Plate id={key} priority opacity={0.95} />
        <div className="absolute inset-0 opacity-80">
          <SceneArt art={key} progress={progress} accent={prophet.accent} />
        </div>
        <div
          className="absolute inset-0 transition-colors duration-1000"
          style={{
            background:
              'linear-gradient(to bottom, rgba(4,7,11,.4), rgba(4,7,11,.62) 45%, rgba(4,7,11,.92))',
          }}
        />
        <ParticleField weather={prophet.weather} density={0.95} color={prophet.accent} opacity={0.6} />
        <Vignette strength={0.85} />
        <Grain opacity={0.034} />
      </div>

      {/* ── scene chrome ───────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 px-5 pt-28 sm:px-10 sm:pt-32">
        <div className="flex items-center gap-4">
          <span
            className="font-display text-[0.64rem] tracking-[0.34em] tabular-nums"
            style={{ color: prophet.accent }}
          >
            Scene {String(order + 1).padStart(2, '0')} / {SCENE_ORDER.length}
          </span>
          <span aria-hidden="true" className="h-px w-8 opacity-25" style={{ background: prophet.accent }} />
          <span className="text-[0.62rem] tracking-[0.3em] text-ivory-dim/45 uppercase">
            {scene.kicker}
          </span>
        </div>
        <Link
          to="/stories"
          onClick={() => cue('select')}
          data-cursor="hover"
          className="inline-flex items-center gap-2 py-2.5 text-[0.62rem] tracking-[0.32em] text-ivory-dim/50 uppercase transition-colors hover:text-gold"
        >
          <LayoutGrid size={12} strokeWidth={1.5} aria-hidden="true" />
          All scenes
        </Link>
      </div>

      {/* ── the scene ──────────────────────────────────────────────── */}
      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: reduced ? 0 : 0.2 }}
        className="relative z-10 mx-auto max-w-4xl px-5 pb-10 sm:px-8"
      >
        <SceneStepper
          steps={steps}
          accent={prophet.accent}
          onStep={onStep}
          label={`Scene ${order + 1}: ${prophet.name} ${prophet.honorific}`}
        />
      </motion.div>

      {/* ── prev / next scene ──────────────────────────────────────── */}
      <footer className="relative z-10 mt-16 border-t border-gold/12 bg-ink/60 backdrop-blur-sm">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-px sm:grid-cols-2">
          {prev ? (
            <SceneLink id={prev} dir="prev" />
          ) : (
            <Link
              to="/stories"
              data-cursor="hover"
              className="group flex items-center gap-5 p-8 transition-colors duration-500 hover:bg-ivory/[.03] sm:p-10"
            >
              <ArrowLeft size={20} strokeWidth={1.2} className="shrink-0 text-gold/60" />
              <span>
                <span className="block text-[0.62rem] tracking-[0.32em] text-ivory-dim/40 uppercase">
                  Back to
                </span>
                <span className="font-display mt-1.5 block text-xl font-light text-ivory/85">
                  All seven scenes
                </span>
              </span>
            </Link>
          )}
          {next ? (
            <SceneLink id={next} dir="next" />
          ) : (
            <Link
              to="/quran"
              data-cursor="hover"
              className="group flex items-center justify-end gap-5 p-8 text-right transition-colors duration-500 hover:bg-ivory/[.03] sm:p-10"
            >
              <span>
                <span className="block text-[0.62rem] tracking-[0.32em] text-gold/70 uppercase">
                  Next chapter
                </span>
                <span className="font-display mt-1.5 block text-xl font-light text-ivory">
                  The Words of Allah
                </span>
              </span>
              <ArrowRight size={20} strokeWidth={1.2} className="shrink-0 text-gold" />
            </Link>
          )}
        </div>
      </footer>
    </div>
  )
}

function SceneLink({ id, dir }: { id: ArtKey; dir: 'prev' | 'next' }) {
  const { cue } = useJourney()
  const p = PROPHET_BY_ID[id]
  const isNext = dir === 'next'
  return (
    <Link
      to={`/stories/${id}`}
      onClick={() => cue('select')}
      data-cursor="hover"
      className={`group relative flex items-center gap-5 overflow-hidden p-8 transition-colors duration-500 hover:bg-ivory/[.03] sm:p-10 ${
        isNext ? 'justify-end text-right' : ''
      }`}
    >
      <Plate id={id} opacity={0.16} className="transition-opacity duration-700 group-hover:opacity-40" />
      {!isNext && (
        <ArrowLeft
          size={20}
          strokeWidth={1.2}
          className="relative shrink-0 text-gold/60 transition-transform duration-500 group-hover:-translate-x-1.5"
        />
      )}
      <span className="relative min-w-0">
        <span className="block text-[0.62rem] tracking-[0.32em] text-ivory-dim/40 uppercase">
          {isNext ? 'Next scene' : 'Previous scene'}
        </span>
        <span className="font-display mt-1.5 block truncate text-xl font-light text-ivory/85 sm:text-2xl">
          {p.name} {p.honorific}
        </span>
      </span>
      {isNext && (
        <ArrowRight
          size={20}
          strokeWidth={1.2}
          className="relative shrink-0 transition-transform duration-500 group-hover:translate-x-1.5"
          style={{ color: p.accent }}
        />
      )}
    </Link>
  )
}
