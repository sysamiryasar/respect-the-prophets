import type { PlateId } from './plates'

/**
 * The journey is nine chapters, each its own route. This registry is the
 * single source of truth for ordering, numbering, navigation and the
 * atmospheric plate behind each page.
 */
export interface Chapter {
  /** Route path. */
  path: string
  id: string
  /** Short label for the nav bar. */
  short: string
  /** Full title shown on the page. */
  title: string
  /** The gilded half of the title, rendered in gold. */
  titleAccent?: string
  kicker: string
  /** One line under the title. */
  standfirst: string
  plate: PlateId
  accent: string
}

export const CHAPTERS: Chapter[] = [
  {
    path: '/why',
    id: 'why',
    short: 'Why Respect?',
    title: 'Why do we respect',
    titleAccent: 'the Prophets?',
    kicker: 'Chapter One',
    standfirst:
      'Muslims believe in every prophet Allah sent — not a favoured few. This is where that belief comes from.',
    plate: 'ch-why',
    accent: '#7fd8b4',
  },
  {
    path: '/pillars',
    id: 'pillars',
    short: '6 Pillars',
    title: 'The Six Pillars of',
    titleAccent: 'Iman',
    kicker: 'Chapter Two',
    standfirst:
      'The framework of belief, as described in the well-known narration of Jibril (AS). One of the six is the doorway into everything that follows.',
    plate: 'ch-pillars',
    accent: '#d3ad68',
  },
  {
    path: '/prophets',
    id: 'prophets',
    short: 'Prophets',
    title: 'The',
    titleAccent: 'Messengers of Allah',
    kicker: 'Chapter Three',
    standfirst:
      'The Qur’an names twenty-five prophets and tells us there were many more whose stories were not related to us. Sixteen of them are gathered here.',
    plate: 'ch-prophets',
    accent: '#e7cd9b',
  },
  {
    path: '/stories',
    id: 'stories',
    short: 'Stories',
    title: 'Seven',
    titleAccent: 'Scenes',
    kicker: 'Chapter Four',
    standfirst:
      'Seven lives, each told as its own scene — through landscape, object and light, one beat at a time.',
    plate: 'ch-stories',
    accent: '#c9a2e8',
  },
  {
    path: '/quran',
    id: 'quran',
    short: 'Qur’an',
    title: 'The Words of',
    titleAccent: 'Allah',
    kicker: 'Chapter Five',
    standfirst:
      'Verses of the Qur’an that speak about the prophets — their message, their trials, and what we are told to take from them.',
    plate: 'ch-quran',
    accent: '#d3ad68',
  },
  {
    path: '/lessons',
    id: 'lessons',
    short: 'Lessons',
    title: 'What the Prophets',
    titleAccent: 'Taught Us',
    kicker: 'Chapter Six',
    standfirst:
      'Eight qualities that run through every one of their lives. Select one to sit with it.',
    plate: 'ch-lessons',
    accent: '#8ec6a8',
  },
  {
    path: '/respect',
    id: 'respect',
    short: 'Respect',
    title: 'Respect Is More',
    titleAccent: 'Than Words',
    kicker: 'Chapter Seven',
    standfirst: 'Six things respect actually asks of us. Move through them one at a time.',
    plate: 'ch-respect',
    accent: '#e8cf96',
  },
  {
    path: '/constellation',
    id: 'constellation',
    short: 'Constellation',
    title: 'Constellation of the',
    titleAccent: 'Prophets',
    kicker: 'Chapter Eight',
    standfirst:
      'Different nations. Different centuries. Every line here runs to the same centre.',
    plate: 'ch-constellation',
    accent: '#e7cd9b',
  },
  {
    path: '/final',
    id: 'final',
    short: 'Final Message',
    title: 'One',
    titleAccent: 'Message',
    kicker: 'Chapter Nine',
    standfirst: 'The end of the journey.',
    plate: 'ch-final',
    accent: '#f6e5bf',
  },
]

export const CHAPTER_BY_PATH = Object.fromEntries(CHAPTERS.map((c) => [c.path, c]))

export function chapterIndex(pathname: string) {
  // /prophets/musa still counts as the Prophets chapter
  return CHAPTERS.findIndex((c) => pathname === c.path || pathname.startsWith(`${c.path}/`))
}

export function neighbours(pathname: string) {
  const i = chapterIndex(pathname)
  return {
    index: i,
    prev: i > 0 ? CHAPTERS[i - 1] : null,
    next: i >= 0 && i < CHAPTERS.length - 1 ? CHAPTERS[i + 1] : null,
  }
}
