import { Volume2, VolumeX, Waves, Zap } from 'lucide-react'
import { useJourney } from '../lib/journey'

/**
 * Sound and motion controls.
 *
 * Nothing plays until the reader asks for it — no autoplay, ever. The
 * ambient bed is synthesised (see lib/journey.tsx) so the page ships no
 * audio payload, while keeping the interface a real stem set would use.
 */
export default function AudioControls() {
  const { soundOn, toggleSound, motionPref, toggleMotion } = useJourney()

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={toggleSound}
        data-cursor="hover"
        aria-pressed={soundOn}
        aria-label={soundOn ? 'Turn ambient sound off' : 'Turn ambient sound on'}
        title={soundOn ? 'Sound on — ambient wind and tones' : 'Sound off'}
        className={`group relative flex h-9 cursor-pointer items-center gap-2 border px-2.5 transition-all duration-500 sm:px-3 ${
          soundOn
            ? 'border-gold/60 text-gold-bright'
            : 'border-gold/20 text-ivory-dim/55 hover:border-gold/50 hover:text-gold-soft'
        }`}
      >
        {soundOn ? (
          <Volume2 size={14} strokeWidth={1.5} aria-hidden="true" />
        ) : (
          <VolumeX size={14} strokeWidth={1.5} aria-hidden="true" />
        )}
        <span className="hidden text-[0.63rem] tracking-[0.24em] uppercase sm:inline">
          {soundOn ? 'On' : 'Off'}
        </span>
        {soundOn && (
          <span
            aria-hidden="true"
            className="absolute -inset-px border border-gold/25"
            style={{ animation: 'rtp-breathe 3.4s ease-in-out infinite' }}
          />
        )}
      </button>

      <button
        type="button"
        onClick={toggleMotion}
        data-cursor="hover"
        aria-pressed={motionPref === 'reduced'}
        aria-label={
          motionPref === 'reduced'
            ? 'Turn full animation back on'
            : 'Reduce animation across the site'
        }
        title={motionPref === 'reduced' ? 'Reduced motion is on' : 'Full motion'}
        className={`flex h-9 w-9 cursor-pointer items-center justify-center border transition-all duration-500 ${
          motionPref === 'reduced'
            ? 'border-emerald-300/50 text-emerald-200'
            : 'border-gold/20 text-ivory-dim/55 hover:border-gold/50 hover:text-gold-soft'
        }`}
      >
        {motionPref === 'reduced' ? (
          <Waves size={14} strokeWidth={1.5} aria-hidden="true" />
        ) : (
          <Zap size={14} strokeWidth={1.5} aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
