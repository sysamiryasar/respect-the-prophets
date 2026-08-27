import { useCallback, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, BookOpen, LayoutGrid } from 'lucide-react'
import { PROPHETS, PROPHET_BY_ID, type ArtKey } from '../data/prophets'
import { SCENES, VERSES } from '../data/content'
import { useJourney } from '../lib/journey'
import Plate from '../components/Plate'
import SceneArt from '../components/visuals/SceneArt'
import ParticleField from '../components/visuals/ParticleField'
import { GeometricPattern, OrnamentDivider } from '../components/visuals/GeometricPattern'
import ProphetGlyph from '../components/visuals/ProphetGlyph'
import SceneStepper, { type Step } from '../components/SceneStepper'
import { Grain, SourceTag, Vignette } from '../components/ui'

export default function ProphetPage() {
  const { id } = useParams<{ id: string }>()
  const { reduced, cue } = useJourney()
  const [progress, setProgress] = useState(0)

  const onStep = useCallback((_i: number, p: number) => setProgress(p), [])

  const prophet = id && id in PROPHET_BY_ID ? PROPHET_BY_ID[id as ArtKey] : null
  if (!prophet) return <Navigate to="/prophets" replace />

  const scene = SCENES[prophet.id]
  const index = PROPHETS.findIndex((p) => p.id === prophet.id)
  const prev = index > 0 ? PROPHETS[index - 1] : null
  const next = index < PROPHETS.length - 1 ? PROPHETS[index + 1] : null
  const verse = scene?.verseId ? VERSES.find((v) => v.id === scene.verseId) : undefined

  const steps: Step[] = scene
    ? scene.beats.map((b) => ({
        label: b.label,
        content: (
          <p className="font-display text-[clamp(1.25rem,3.8vw,2.3rem)] leading-[1.42] font-light text-ivory/90">
            {b.text}
          </p>
        ),
      }))
    : [
        {
          label: 'The story',
          content: (
            <p className="font-display text-[clamp(1.15rem,3.2vw,1.9rem)] leading-[1.5] font-light text-ivory/88">
              {prophet.description}
            </p>
          ),
        },
      ]

  steps.push({
    label: 'The lesson',
    content: (
      <p className="font-display text-[clamp(1.2rem,3.6vw,2.15rem)] leading-[1.45] font-light text-ivory/90 italic">
        {scene?.lesson ?? prophet.lesson}
      </p>
    ),
    after: verse ? (
      <div className="mx-auto max-w-xl border-t border-gold/15 pt-8">
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
    ) : undefined,
  })

  return (
    <div className="relative min-h-[100svh]">
      {/* ── backdrop: raster plate, then live symbolic art on top ──── */}
      <div aria-hidden="true" className="fixed inset-0 -z-10">
        <Plate id={prophet.id} priority opacity={0.9} />
        <div className="absolute inset-0 opacity-70">
          <SceneArt art={prophet.id} progress={progress} accent={prophet.accent} />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(4,7,11,.42), rgba(4,7,11,.74) 50%, rgba(4,7,11,.95))',
          }}
        />
        <ParticleField weather={prophet.weather} density={0.85} color={prophet.accent} opacity={0.5} />
        <GeometricPattern variant="khatam" opacity={0.028} scale={165} color={prophet.accent} />
        <Vignette strength={0.8} />
        <Grain opacity={0.032} />
      </div>

      <div className="relative z-10 px-5 pt-28 pb-8 sm:px-8 sm:pt-36">
        {/* ── title ────────────────────────────────────────────────── */}
        <motion.header
          initial={reduced ? false : { opacity: 0, y: 24, filter: 'blur(14px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <Link
            to="/prophets"
            onClick={() => cue('select')}
            data-cursor="hover"
            className="inline-flex items-center gap-2 py-2.5 text-[0.62rem] tracking-[0.32em] text-ivory-dim/50 uppercase transition-colors hover:text-gold"
          >
            <LayoutGrid size={12} strokeWidth={1.5} aria-hidden="true" />
            All messengers
          </Link>

          <p
            className="font-arabic mt-8 text-3xl sm:text-5xl"
            style={{ color: prophet.accent }}
            lang="ar"
          >
            {prophet.arabic}
          </p>
          <h1 className="font-display mt-5 text-[clamp(2.3rem,9vw,6rem)] leading-none font-light uppercase">
            {prophet.name}
            <span className="ml-3 align-middle text-[0.3em] tracking-normal text-gold/60">
              {prophet.honorific}
            </span>
          </h1>
          <OrnamentDivider className="mt-8" color={prophet.accent} />
          <p className="mt-8 text-[0.68rem] tracking-[0.3em] text-ivory-dim/60 uppercase">
            {prophet.epithet}
          </p>
          <p className="mt-3 text-[0.62rem] tracking-[0.28em] text-ivory-dim/35 tabular-nums uppercase">
            {String(index + 1).padStart(2, '0')} of {PROPHETS.length}
          </p>
        </motion.header>

        {/* ── the symbols ──────────────────────────────────────────── */}
        <div className="mx-auto mt-16 max-w-4xl">
          <SceneHeading accent={prophet.accent}>The scene</SceneHeading>
          <ul className="mt-8 flex flex-wrap justify-center gap-3">
            {prophet.symbols.map((s, i) => (
              <motion.li
                key={s}
                initial={reduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: reduced ? 0 : 0.3 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="border px-4 py-2 text-[0.66rem] tracking-[0.2em] uppercase backdrop-blur-sm"
                style={{
                  borderColor: `${prophet.accent}33`,
                  color: `${prophet.accent}dd`,
                  background: `${prophet.accent}0d`,
                }}
              >
                {s}
              </motion.li>
            ))}
          </ul>
          <p className="mx-auto mt-8 max-w-lg text-center text-[0.66rem] leading-relaxed text-ivory-dim/40">
            The story is told through place, object and light. In keeping with Islamic practice, no
            Prophet is depicted.
          </p>
        </div>

        {/* ── the scene, one beat at a time ────────────────────────── */}
        <div className="mx-auto mt-14 max-w-4xl">
          <SceneStepper
            steps={steps}
            accent={prophet.accent}
            onStep={onStep}
            label={`The story of ${prophet.name} ${prophet.honorific}, told one beat at a time`}
          />
        </div>

        {/* ── themes ───────────────────────────────────────────────── */}
        <div className="mx-auto mt-20 max-w-4xl">
          <SceneHeading accent={prophet.accent}>Themes</SceneHeading>
          <ul className="mt-8 flex flex-wrap justify-center gap-2.5">
            {prophet.themes.map((t) => (
              <li
                key={t}
                className="border border-ivory-dim/15 px-3.5 py-1.5 text-[0.64rem] tracking-[0.22em] text-ivory-dim/60 uppercase"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* ── references ───────────────────────────────────────────── */}
        <div className="mx-auto mt-20 max-w-3xl">
          <SceneHeading accent={prophet.accent}>Where to read more</SceneHeading>
          <ul className="mt-10 divide-y divide-gold/10 border-y border-gold/10">
            {prophet.quran.map((q) => (
              <li key={q.ref} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-5">
                <BookOpen
                  size={14}
                  strokeWidth={1.4}
                  className="shrink-0"
                  style={{ color: prophet.accent }}
                  aria-hidden="true"
                />
                <span className="font-display text-base text-gold-soft">{q.surah}</span>
                <span className="text-[0.7rem] tracking-[0.18em] text-gold/50 tabular-nums">
                  {q.ref}
                </span>
                <span className="w-full text-[0.82rem] leading-relaxed text-ivory-dim/65 sm:w-auto sm:flex-1">
                  {q.note}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── prev / next prophet ────────────────────────────────────── */}
      <footer className="relative z-10 mt-20 border-t border-gold/12 bg-ink/60 backdrop-blur-sm">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-px sm:grid-cols-2">
          {prev ? (
            <ProphetLink prophet={prev} dir="prev" />
          ) : (
            <Link
              to="/prophets"
              data-cursor="hover"
              className="group flex items-center gap-5 p-8 transition-colors duration-500 hover:bg-ivory/[.03] sm:p-10"
            >
              <ArrowLeft size={20} strokeWidth={1.2} className="shrink-0 text-gold/60" />
              <span>
                <span className="block text-[0.62rem] tracking-[0.32em] text-ivory-dim/40 uppercase">
                  Back to
                </span>
                <span className="font-display mt-1.5 block text-xl font-light text-ivory/85">
                  The timeline
                </span>
              </span>
            </Link>
          )}
          {next ? (
            <ProphetLink prophet={next} dir="next" />
          ) : (
            <Link
              to="/stories"
              data-cursor="hover"
              className="group flex items-center justify-end gap-5 p-8 text-right transition-colors duration-500 hover:bg-ivory/[.03] sm:p-10"
            >
              <span>
                <span className="block text-[0.62rem] tracking-[0.32em] text-gold/70 uppercase">
                  Next chapter
                </span>
                <span className="font-display mt-1.5 block text-xl font-light text-ivory">
                  Seven Scenes
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

function ProphetLink({ prophet, dir }: { prophet: (typeof PROPHETS)[number]; dir: 'prev' | 'next' }) {
  const { cue } = useJourney()
  const isNext = dir === 'next'
  return (
    <Link
      to={`/prophets/${prophet.id}`}
      onClick={() => cue('select')}
      data-cursor="hover"
      className={`group flex items-center gap-5 p-8 transition-colors duration-500 hover:bg-ivory/[.03] sm:p-10 ${
        isNext ? 'justify-end text-right' : ''
      }`}
    >
      {!isNext && (
        <ArrowLeft
          size={20}
          strokeWidth={1.2}
          className="shrink-0 text-gold/60 transition-transform duration-500 group-hover:-translate-x-1.5"
        />
      )}
      <span className="min-w-0">
        <span className="block text-[0.62rem] tracking-[0.32em] text-ivory-dim/40 uppercase">
          {isNext ? 'Next messenger' : 'Previous messenger'}
        </span>
        <span className="font-display mt-1.5 block truncate text-xl font-light text-ivory/85 sm:text-2xl">
          {prophet.name} {prophet.honorific}
        </span>
      </span>
      {isNext && (
        <ProphetGlyph
          id={prophet.id}
          className="h-6 w-6 shrink-0 transition-transform duration-500 group-hover:translate-x-1.5"
          color={prophet.accent}
        />
      )}
    </Link>
  )
}

function SceneHeading({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <span
        aria-hidden="true"
        className="h-px w-10 sm:w-20"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}66)` }}
      />
      <h2
        className="text-center text-[0.64rem] tracking-[0.42em] uppercase"
        style={{ color: `${accent}cc` }}
      >
        {children}
      </h2>
      <span
        aria-hidden="true"
        className="h-px w-10 sm:w-20"
        style={{ background: `linear-gradient(270deg, transparent, ${accent}66)` }}
      />
    </div>
  )
}
