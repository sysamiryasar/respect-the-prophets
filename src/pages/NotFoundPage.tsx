import { Link } from 'react-router-dom'
import Plate from '../components/Plate'
import ParticleField from '../components/visuals/ParticleField'
import { OrnamentDivider } from '../components/visuals/GeometricPattern'
import { GoldButton, Grain, Kicker, Vignette } from '../components/ui'

export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 text-center">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Plate id="ch-constellation" priority opacity={0.7} />
        <div className="absolute inset-0 bg-ink/70" />
        <ParticleField weather="stars" density={1} color="#e7cd9b" opacity={0.6} />
        <Vignette strength={0.85} />
        <Grain opacity={0.03} />
      </div>

      <Kicker>Off the path</Kicker>
      <h1 className="font-display text-gilded mt-6 text-[clamp(2rem,7vw,4.5rem)] leading-none font-light uppercase">
        Page not found
      </h1>
      <OrnamentDivider className="my-10" />
      <p className="max-w-md text-sm leading-relaxed text-ivory-dim/65">
        There is no chapter at this address. The journey begins at the beginning.
      </p>
      <div className="mt-12 flex flex-wrap justify-center gap-4">
        <Link to="/">
          <GoldButton>Back to the start</GoldButton>
        </Link>
        <Link to="/prophets">
          <GoldButton arrow="">The messengers</GoldButton>
        </Link>
      </div>
    </div>
  )
}
