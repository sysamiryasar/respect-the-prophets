import { useState } from 'react'
import { PLATES, PLATE_WIDTHS } from '../data/plates'

interface Props {
  /** Base name of the plate, e.g. "musa" or "ch-quran". */
  id: string
  /** Rendered eagerly for the page you are on; lazily for cards further down. */
  priority?: boolean
  className?: string
  /** Extra opacity applied once loaded. */
  opacity?: number
  /** `sizes` hint for the responsive source set. */
  sizes?: string
}

/**
 * An atmospheric backdrop image.
 *
 * Ships AVIF with a WebP fallback at two widths, and blurs up from a ~1 kB
 * inline placeholder so a plate never pops in. The symbolic vector artwork is
 * layered on top of this by the scene components.
 *
 * Swapping in your own artwork: drop `public/img/<id>-1600.webp` (and
 * optionally `-1600.avif`, `-800.*`) and it is used with no code change.
 */
export default function Plate({
  id,
  priority = false,
  className = '',
  opacity = 1,
  sizes = '100vw',
}: Props) {
  const plate = PLATES[id]
  const [loaded, setLoaded] = useState(false)

  const srcSet = (ext: string) =>
    PLATE_WIDTHS.map((w) => `/img/${id}-${w}.${ext} ${w}w`).join(', ')

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* blur-up placeholder */}
      {plate && (
        <img
          src={plate.lqip}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl transition-opacity duration-1000"
          style={{ opacity: loaded ? 0 : opacity }}
        />
      )}
      <picture>
        <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
        <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
        <img
          src={`/img/${id}-1600.webp`}
          alt=""
          width={1600}
          height={900}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
          style={{ opacity: loaded ? opacity : 0 }}
        />
      </picture>
    </div>
  )
}
