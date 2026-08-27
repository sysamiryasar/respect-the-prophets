import type { ArtKey } from '../../data/prophets'

/**
 * Minimal line emblems for the timeline cards.
 * Objects, architecture and landscape only — never a figure.
 */
const GLYPHS: Record<ArtKey, JSX.Element> = {
  adam: (
    <>
      <circle cx="24" cy="27" r="11" />
      <ellipse cx="24" cy="27" rx="11" ry="4" />
      <path d="M24 16v-6M20 12l4 4 4-4" />
      <path d="M10 40h28" opacity=".5" />
    </>
  ),
  nuh: (
    <>
      <path d="M11 28h26l-4 8H15z" />
      <path d="M24 20V10M24 14h8l-8 6" />
      <path d="M6 40q4.5-4 9 0t9 0 9 0 9 0" />
      <path d="M13 8l1.5 3M31 6l1.5 3M22 5l1.5 3" opacity=".55" />
    </>
  ),
  ibrahim: (
    <>
      <path d="M24 41c-6 0-10-4-10-9 0-6 6-8 6-14 4 3 5 6 5 9 2-1 3-3 3-5 3 3 6 6 6 10 0 5-4 9-10 9z" />
      <path d="M12 12l1.5 3M36 10l1.5 3" opacity=".6" />
      <path d="M8 7l1 2M40 16l1 2" opacity=".4" />
    </>
  ),
  ismail: (
    <>
      <ellipse cx="24" cy="30" rx="12" ry="5" />
      <ellipse cx="24" cy="30" rx="6" ry="2.4" opacity=".6" />
      <path d="M24 24V12M20 16l4-4 4 4" opacity=".7" />
      <path d="M8 40h32M12 36h10M26 36h10" opacity=".6" />
    </>
  ),
  ishaq: (
    <>
      <path d="M6 34h36" />
      <circle cx="24" cy="34" r="9" />
      <path d="M24 34V16M17 20l7-6 7 6" opacity=".55" />
      <path d="M9 40h30" opacity=".45" />
    </>
  ),
  yaqub: (
    <>
      <path d="M18 40V22q0-6 6-6t6 6v18z" />
      <path d="M24 16v-5" />
      <circle cx="24" cy="27" r="3.5" />
      <path d="M10 40h28" opacity=".5" />
    </>
  ),
  yusuf: (
    <>
      <ellipse cx="24" cy="14" rx="10" ry="4" />
      <path d="M14 14v22M34 14v22" />
      <path d="M18 22l12 0M18 28l12 0" opacity=".35" />
      <path d="M6 8l1.5 2M42 8l-1.5 2M24 5v2" opacity=".7" />
    </>
  ),
  musa: (
    <>
      <path d="M20 42L26 8" />
      <path d="M26 8q-4-3-1-6 4 2 1 6z" />
      <path d="M6 34q3 4 3 8M42 34q-3 4-3 8" opacity=".8" />
      <path d="M9 26v16M39 26v16" opacity=".55" />
      <path d="M9 26q4-6 15-6t15 6" opacity=".4" />
    </>
  ),
  harun: (
    <>
      <path d="M8 42q10-12 16-18M40 42q-10-12-16-18" />
      <circle cx="24" cy="20" r="4" />
      <path d="M24 16V7" opacity=".6" />
      <path d="M6 12l4 3M42 12l-4 3" opacity=".45" />
    </>
  ),
  dawud: (
    <>
      <path d="M4 36l10-14 6 8 8-14 16 20z" />
      <path d="M14 14q3-2 6 0 3-2 6 0" opacity=".7" />
      <path d="M4 40h40" opacity=".45" />
    </>
  ),
  sulayman: (
    <>
      <path d="M14 40V22q0-8 10-8t10 8v18" />
      <path d="M8 40h32" />
      <path d="M6 12q6-4 12 0t12 0 12 0" opacity=".6" />
      <path d="M6 18q6-4 12 0t12 0 12 0" opacity=".35" />
    </>
  ),
  yunus: (
    <>
      <path d="M6 14q6-4 12 0t12 0 12 0" opacity=".7" />
      <path d="M6 22q6-4 12 0t12 0 12 0" opacity=".55" />
      <path d="M6 30q6-4 12 0t12 0 12 0" opacity=".4" />
      <path d="M6 38q6-4 12 0t12 0 12 0" opacity=".25" />
      <path d="M20 6h8l-4 26z" opacity=".8" />
    </>
  ),
  zakariyya: (
    <>
      <path d="M14 42V20q0-10 10-10t10 10v22z" />
      <path d="M24 34v-8" />
      <path d="M24 26q-2.5-3 0-5 2.5 2 0 5z" />
      <path d="M8 42h32" opacity=".5" />
    </>
  ),
  yahya: (
    <>
      <path d="M4 42l14-16h12l14 16z" />
      <path d="M14 36h20M18 31h12" opacity=".4" />
      <path d="M9 26q2-8 0-14M39 26q-2-8 0-14" opacity=".6" />
    </>
  ),
  isa: (
    <>
      <path d="M12 42V22q0-10 12-10t12 10v20" />
      <path d="M6 42h36" />
      <path d="M16 30h16M16 35h12" opacity=".45" />
      <path d="M24 8V4" opacity=".5" />
    </>
  ),
  muhammad: (
    <>
      <path d="M17 40V16l14-4v24z" />
      <path d="M31 12l6 3v22l-6 3" opacity=".7" />
      <path d="M17 26l14-3M31 26l6 2" opacity=".9" />
      <path d="M8 42h32" opacity=".5" />
      <path d="M24 8V4M14 10l-2-3M34 10l2-3" opacity=".45" />
    </>
  ),
}

export default function ProphetGlyph({
  id,
  className = '',
  color = 'currentColor',
  strokeWidth = 1.5,
}: {
  id: ArtKey
  className?: string
  color?: string
  strokeWidth?: number
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {GLYPHS[id]}
    </svg>
  )
}
