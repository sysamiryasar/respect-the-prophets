import { useMotionValue, type MotionValue } from 'framer-motion'
import { setArtMode } from './art'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

type MotionPref = 'full' | 'reduced'
type Theme = 'dark' | 'light'

interface JourneyState {
  /** Parchment or night. Mirrored onto <html data-theme> for CSS. */
  theme: Theme
  setTheme: (t: Theme) => void
  toggleTheme: () => void

  /** True when animation should be damped — either OS preference or user toggle. */
  reduced: boolean
  motionPref: MotionPref
  setMotionPref: (p: MotionPref) => void
  toggleMotion: () => void

  /** Ambient audio bed. Never autoplays. */
  soundOn: boolean
  toggleSound: () => void
  /** Fire a short interaction tone. No-ops when sound is off. */
  cue: (kind: CueKind) => void

  /** Index of the section currently filling the viewport. */
  activeIndex: number
  setActiveIndex: (i: number) => void

  /**
   * 0–1 progress through the whole document.
   *
   * A MotionValue, not state, on purpose: this changes on every scroll
   * frame, and holding it in state meant the context value changed 60x a
   * second and re-rendered the entire journey with it.
   */
  progress: MotionValue<number>

  /** True once the user has passed the hero gate. */
  entered: boolean
  enter: () => void
  restart: () => void

  /** Coarse pointer (touch) — used to disable the custom cursor and thin particles. */
  coarse: boolean
  /** Small viewport — used to reduce particle density. */
  compact: boolean
}

export type CueKind = 'hover' | 'select' | 'open' | 'close' | 'reveal'

const JourneyContext = createContext<JourneyState | null>(null)

function readInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem('rtp:theme')
  if (stored === 'dark' || stored === 'light') return stored
  // The experience is authored light-first; honour an explicit OS preference.
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function readInitialMotion(): MotionPref {
  if (typeof window === 'undefined') return 'full'
  const stored = window.localStorage.getItem('rtp:motion')
  if (stored === 'full' || stored === 'reduced') return stored
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduced' : 'full'
}

function useMediaQuery(query: string, initial = false) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? initial : window.matchMedia(query).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme)
  const [motionPref, setMotionPrefState] = useState<MotionPref>(readInitialMotion)
  const [soundOn, setSoundOn] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const progress = useMotionValue(0)
  const [entered, setEntered] = useState(false)

  const coarse = useMediaQuery('(hover: none), (pointer: coarse)')
  const compact = useMediaQuery('(max-width: 767px)')

  const reduced = motionPref === 'reduced'

  /* --- theme drives both CSS tokens and the generated artwork -------- */
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('rtp:theme', theme)
    setArtMode(theme)
  }, [theme])

  const setTheme = useCallback((t: Theme) => setThemeState(t), [])
  const toggleTheme = useCallback(
    () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark')),
    [],
  )

  /* --- motion preference is mirrored onto <html> so CSS can react ---- */
  useEffect(() => {
    document.documentElement.dataset.motion = motionPref
    window.localStorage.setItem('rtp:motion', motionPref)
  }, [motionPref])

  const setMotionPref = useCallback((p: MotionPref) => setMotionPrefState(p), [])
  const toggleMotion = useCallback(
    () => setMotionPrefState((p) => (p === 'full' ? 'reduced' : 'full')),
    [],
  )

  /* --- scroll progress, rAF-throttled ------------------------------- */
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      progress.set(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* --- audio: a tiny synthesised ambience, built only on demand ------ */
  const audioRef = useRef<AmbientAudio | null>(null)

  const toggleSound = useCallback(() => {
    setSoundOn((on) => {
      const next = !on
      if (next) {
        audioRef.current ??= new AmbientAudio()
        void audioRef.current.start()
      } else {
        audioRef.current?.stop()
      }
      return next
    })
  }, [])

  const cue = useCallback(
    (kind: CueKind) => {
      if (!soundOn) return
      audioRef.current?.cue(kind)
    },
    [soundOn],
  )

  useEffect(() => () => audioRef.current?.dispose(), [])

  const enter = useCallback(() => setEntered(true), [])
  const restart = useCallback(() => {
    setEntered(false)
    setActiveIndex(0)
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }, [reduced])

  const value = useMemo<JourneyState>(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      reduced,
      motionPref,
      setMotionPref,
      toggleMotion,
      soundOn,
      toggleSound,
      cue,
      activeIndex,
      setActiveIndex,
      progress,
      entered,
      enter,
      restart,
      coarse,
      compact,
    }),
    [
      theme,
      setTheme,
      toggleTheme,
      reduced,
      motionPref,
      setMotionPref,
      toggleMotion,
      soundOn,
      toggleSound,
      cue,
      activeIndex,
      progress,
      entered,
      enter,
      restart,
      coarse,
      compact,
    ],
  )

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useJourney() {
  const ctx = useContext(JourneyContext)
  if (!ctx) throw new Error('useJourney must be used inside <JourneyProvider>')
  return ctx
}

/* ================================================================== *
 * Ambient audio
 *
 * The brief asks for a "sound-design-ready architecture" with no
 * autoplay. Rather than ship megabytes of audio files, this synthesises
 * a soft wind/drone bed with the Web Audio API — zero network cost, and
 * the same interface a real cinematic stem set would use later:
 *
 *     audio.start() / audio.stop() / audio.cue('select')
 *
 * To swap in real recordings, replace `buildBed()` with buffer sources
 * loaded from /audio/*.webm. Nothing else needs to change.
 * ================================================================== */

class AmbientAudio {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private nodes: AudioNode[] = []
  private running = false

  private ensure() {
    if (this.ctx) return this.ctx
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    this.ctx = new Ctor()
    this.master = this.ctx.createGain()
    this.master.gain.value = 0
    this.master.connect(this.ctx.destination)
    return this.ctx
  }

  async start() {
    const ctx = this.ensure()
    if (!ctx || !this.master) return
    if (ctx.state === 'suspended') await ctx.resume()
    if (!this.running) {
      this.buildBed(ctx, this.master)
      this.running = true
    }
    this.master.gain.cancelScheduledValues(ctx.currentTime)
    this.master.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 1.6)
  }

  stop() {
    const ctx = this.ctx
    if (!ctx || !this.master) return
    this.master.gain.cancelScheduledValues(ctx.currentTime)
    this.master.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.8)
  }

  /** Soft wind (filtered noise) + a low sustained drone, both very quiet. */
  private buildBed(ctx: AudioContext, out: GainNode) {
    // --- filtered pink-ish noise = wind -----------------------------
    const seconds = 4
    const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let last = 0
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1
      last = (last + 0.02 * white) / 1.02
      data[i] = last * 3.2
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    noise.loop = true

    const windFilter = ctx.createBiquadFilter()
    windFilter.type = 'bandpass'
    windFilter.frequency.value = 420
    windFilter.Q.value = 0.7

    const windGain = ctx.createGain()
    windGain.gain.value = 0.5

    // slow gusting
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.06
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.32
    lfo.connect(lfoGain).connect(windGain.gain)

    noise.connect(windFilter).connect(windGain).connect(out)

    // --- low drone --------------------------------------------------
    const droneGain = ctx.createGain()
    droneGain.gain.value = 0.09
    for (const f of [55, 82.5, 110]) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = f
      const g = ctx.createGain()
      g.gain.value = f === 55 ? 0.8 : 0.22
      osc.connect(g).connect(droneGain)
      osc.start()
      this.nodes.push(osc)
    }
    droneGain.connect(out)

    noise.start()
    lfo.start()
    this.nodes.push(noise, lfo, windFilter, windGain, droneGain, lfoGain)
  }

  /** Short, tasteful interaction tone. */
  cue(kind: CueKind) {
    const ctx = this.ctx
    if (!ctx || ctx.state !== 'running') return
    const map: Record<CueKind, [number, number, number]> = {
      hover: [880, 0.02, 0.09],
      select: [523.25, 0.06, 0.36],
      open: [392, 0.07, 0.5],
      close: [261.63, 0.05, 0.42],
      reveal: [659.25, 0.045, 0.6],
    }
    const [freq, peak, dur] = map[kind]
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.0001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(peak, ctx.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur)
    osc.connect(gain).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + dur + 0.05)
  }

  dispose() {
    for (const n of this.nodes) {
      const s = n as AudioScheduledSourceNode
      try {
        s.stop?.()
      } catch {
        /* already stopped */
      }
      n.disconnect()
    }
    this.nodes = []
    void this.ctx?.close()
    this.ctx = null
    this.running = false
  }
}
