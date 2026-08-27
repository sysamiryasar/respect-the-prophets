import type { ArtKey } from './prophets'

/* ================================================================== *
 * Content for the cinematic scroll journey.
 *
 * Same rules as everywhere else in this project:
 *  - No Prophet is depicted. Stories are told through environment,
 *    object and light only.
 *  - Nothing religious is invented. Qur'an passages carry surah + ayah;
 *    everything else is written plainly as educational explanation.
 * ================================================================== */

export interface NavSection {
  id: string
  label: string
}

export const JOURNEY_NAV: NavSection[] = [
  { id: 'intro', label: 'Intro' },
  { id: 'why', label: 'Why' },
  { id: 'iman', label: 'Iman' },
  { id: 'prophets', label: 'Prophets' },
  { id: 'stories', label: 'Stories' },
  { id: 'trials', label: 'Trials' },
  { id: 'lessons', label: 'Lessons' },
  { id: 'muhammad', label: 'Muhammad ﷺ' },
  { id: 'action', label: 'Action' },
  { id: 'final', label: 'Final' },
]

/* ------------------------------------------------------------------ */
/*  Section 1 — the four points along the path                         */
/* ------------------------------------------------------------------ */

export interface PathPoint {
  id: string
  title: string
  short: string
  body: string
  accent: string
}

export const PATH_POINTS: PathPoint[] = [
  {
    id: 'believe',
    title: 'Believe',
    short: 'In all of them, without exception.',
    body: 'Belief in the messengers is one of the pillars of iman, and it is indivisible. A Muslim does not accept some prophets and reject others — the Qur’an describes the believers as saying they make no distinction between any of His messengers.',
    accent: '#7fd8b4',
  },
  {
    id: 'honor',
    title: 'Honor',
    short: 'Speak of them as they deserve.',
    body: 'To honour a prophet is to speak of him with dignity, to refuse to mock or belittle him, and to send peace upon him. Respect begins in how we talk about someone when they are not there to hear it.',
    accent: '#e0c58a',
  },
  {
    id: 'learn',
    title: 'Learn',
    short: 'Their lives were recorded to be studied.',
    body: 'Their stories were not preserved as entertainment. The Qur’an says that in their accounts there is a lesson for people of understanding — which means they are meant to be read, thought about, and returned to.',
    accent: '#9fb6e8',
  },
  {
    id: 'follow',
    title: 'Follow',
    short: 'Respect that changes nothing is not respect.',
    body: 'The final step is to actually live differently because of what they taught. The Qur’an points to them and says: those are the ones Allah guided, so follow their guidance.',
    accent: '#d3ad68',
  },
]

/* ------------------------------------------------------------------ */
/*  Section 3 — the seven points on the golden path                    */
/* ------------------------------------------------------------------ */

export interface ConstellationPoint {
  id: ArtKey
  /** Position along the golden path, 0–100 of the viewBox. */
  x: number
  y: number
  /** The environment their story is told through. */
  environment: string
  lesson: string
  summary: string
}

export const PATH_PROPHETS: ConstellationPoint[] = [
  {
    id: 'adam',
    x: 7,
    y: 62,
    environment: 'A garden, then the earth, then first light',
    lesson: 'Repentance',
    summary:
      'The first human and the first prophet, taught the names of all things. When he slipped he did not stay there — he received words from his Lord and turned back.',
  },
  {
    id: 'nuh',
    x: 22,
    y: 34,
    environment: 'Storm clouds, rising flood, and an ark',
    lesson: 'Patience',
    summary:
      'He called his people to worship Allah alone for centuries, and almost no one listened. He was commanded to build on dry land, in front of people who mocked every plank of it.',
  },
  {
    id: 'ibrahim',
    x: 37,
    y: 66,
    environment: 'Night desert, stars, broken idols, and fire',
    lesson: 'Tawheed',
    summary:
      'He reasoned past the star, the moon and the sun to the One who made them, broke the idols of his people, and was thrown into a fire that was commanded to be coolness and peace.',
  },
  {
    id: 'musa',
    x: 52,
    y: 30,
    environment: 'A staff, a desert night, and a sea that opened',
    lesson: 'Trust',
    summary:
      'Sent to the mightiest tyrant of his age with nothing but the truth and a staff. At the shore, with the sea ahead and an army behind, he said: with me is my Lord; He will guide me.',
  },
  {
    id: 'yusuf',
    x: 67,
    y: 64,
    environment: 'A well, prison bars, a palace, and eleven stars',
    lesson: 'Forgiveness',
    summary:
      'Thrown into a well by his own brothers, sold, falsely accused and imprisoned — then placed over the storehouses of the land. When his brothers stood before him, he pardoned them.',
  },
  {
    id: 'isa',
    x: 81,
    y: 36,
    environment: 'Desert light, ancient stone, and an open scroll',
    lesson: 'Mercy',
    summary:
      'A servant and messenger of Allah, given the Injil and supported with clear signs — each one described in the Qur’an as being by the permission of Allah.',
  },
  {
    id: 'muhammad',
    x: 94,
    y: 58,
    environment: 'The Ka’bah, a desert road, and rising dawn',
    lesson: 'Character',
    summary:
      'Muslims believe he is the final Prophet and Messenger, sent with the Qur’an to all of humanity, and described in it as a mercy to the worlds.',
  },
]

/* ------------------------------------------------------------------ */
/*  Section 4 — story beats per environment                            */
/* ------------------------------------------------------------------ */

export interface StoryEnvironment {
  id: ArtKey
  title: string
  environment: string
  /** The line that sits over the scene. */
  line: string
  /** Interactive reveals within the scene. */
  reveals: { title: string; body: string }[]
}

export const STORY_ENVIRONMENTS: StoryEnvironment[] = [
  {
    id: 'adam',
    title: 'Adam',
    environment: 'Garden → Earth → Light',
    line: 'Humanity did not begin in perfection. It began in a relationship.',
    reveals: [
      {
        title: 'Repentance',
        body: 'He slipped, and he did not despair. He received words from his Lord and turned back — and that turning back is the model for everyone after him.',
      },
      {
        title: 'Humility',
        body: 'He was taught the names of all things, and still stood in need of his Lord. Knowledge did not make him self-sufficient.',
      },
      {
        title: 'Obedience',
        body: 'The very first command given to humanity was about worship and trust — and the whole story turns on how that command was answered.',
      },
    ],
  },
  {
    id: 'nuh',
    title: 'Nuh',
    environment: 'Calm ocean → Clouds → Storm → Ark',
    line: 'Patience can mean continuing when almost no one listens.',
    reveals: [
      {
        title: 'Patience',
        body: 'By night and by day, in public and in private, for a span the Qur’an measures in centuries. The result was never his to control.',
      },
      {
        title: 'Steadfastness',
        body: 'He built the ark on dry land while people mocked him for it. Doing the right thing rarely looks reasonable at the time.',
      },
      {
        title: 'Trust',
        body: 'When he finally boarded, he did not name the ship or the weather. He said: in the name of Allah is its course and its anchorage.',
      },
    ],
  },
  {
    id: 'ibrahim',
    title: 'Ibrahim',
    environment: 'Night desert → Stars → Broken idols → Fire → Light',
    line: 'Truth is worth standing alone for.',
    reveals: [
      {
        title: 'The search',
        body: 'He looked at a star, then the moon, then the sun, and refused each one. “I do not love things that set.” He reasoned his way to the One who made them.',
      },
      {
        title: 'Tawheed & Courage',
        body: 'He broke what his people worshipped and left the largest idol standing, so they would have to answer their own question. One man against a nation.',
      },
      {
        title: 'The fire',
        body: 'They built a fire and threw him into it. It was commanded: be coolness, and be peace. The fire did not stop being fire — it stopped being permitted to harm.',
      },
    ],
  },
  {
    id: 'musa',
    title: 'Musa',
    environment: 'Desert night → A staff → The sea opens',
    line: 'When the path seemed impossible, Allah opened a way.',
    reveals: [
      {
        title: 'The staff',
        body: 'A shepherd’s staff — the most ordinary object in his hand — became the sign he was sent with. Allah does not need impressive materials.',
      },
      {
        title: 'The shore',
        body: 'The sea ahead, Pharaoh’s army closing behind. His people said: we are surely overtaken. He said: no — indeed, with me is my Lord; He will guide me.',
      },
      {
        title: 'Trust',
        body: 'The certainty came before the miracle, not after it. He was sure of Allah while the water was still in front of him.',
      },
    ],
  },
  {
    id: 'yusuf',
    title: 'Yusuf',
    environment: 'Well → Prison → Palace',
    line: 'The well is not the end of the story.',
    reveals: [
      {
        title: 'Patience',
        body: 'A boy at the bottom of a well, betrayed by his own brothers, watching a circle of daylight far above him. Years of it, and then years more in a cell.',
      },
      {
        title: 'Integrity',
        body: 'In a locked room, with power and privacy on offer, he refused — and chose prison over betraying who he was. Nobody would have known.',
      },
      {
        title: 'Forgiveness',
        body: 'His brothers stood in front of him, not knowing him, entirely in his power. He said: no blame will there be upon you today.',
      },
      {
        title: 'Trust in Allah',
        body: 'Every step that looked like ruin turned out to be part of the road. He named it himself: whoever is mindful of Allah and patient — no reward is lost.',
      },
    ],
  },
]

/** The three stages Yusuf's journey is dragged through. */
export const YUSUF_STAGES = [
  {
    id: 'well',
    label: 'The Well',
    line: 'Thrown in by his own brothers. A circle of daylight, far out of reach.',
    lesson: 'Patience',
  },
  {
    id: 'prison',
    label: 'The Prison',
    line: 'Falsely accused, and forgotten there for years. He kept teaching tawheed to the inmates.',
    lesson: 'Integrity',
  },
  {
    id: 'palace',
    label: 'The Palace',
    line: 'Placed over the storehouses of the land — and the brothers who sold him came asking for food.',
    lesson: 'Forgiveness',
  },
]

/* ------------------------------------------------------------------ */
/*  Section 5 — the trials                                             */
/* ------------------------------------------------------------------ */

export interface Trial {
  id: ArtKey
  element: string
  prophet: string
  quality: string
  body: string
  accent: string
}

export const TRIALS: Trial[] = [
  {
    id: 'nuh',
    element: 'Storm',
    prophet: 'Nuh (AS)',
    quality: 'Patience',
    body: 'Generations of calling, and almost no one answered. His trial was not a single terrible day — it was the length of it.',
    accent: '#6fb2e0',
  },
  {
    id: 'ibrahim',
    element: 'Fire',
    prophet: 'Ibrahim (AS)',
    quality: 'Courage',
    body: 'A whole people against one man, and a fire built to end him. He did not soften the truth to survive it.',
    accent: '#f0a860',
  },
  {
    id: 'musa',
    element: 'Sea',
    prophet: 'Musa (AS)',
    quality: 'Trust',
    body: 'Water in front, an army behind, and no third option. His certainty arrived before the way did.',
    accent: '#5fd0d8',
  },
]

/* ------------------------------------------------------------------ */
/*  Section 6 — the wheel of character                                 */
/* ------------------------------------------------------------------ */

export interface WheelLesson {
  id: string
  title: string
  arabic: string
  body: string
  reference: string
}

export const WHEEL: WheelLesson[] = [
  {
    id: 'tawheed',
    title: 'Tawheed',
    arabic: 'تَوْحِيد',
    body: 'Worship Allah alone. Every messenger arrived with the same first sentence — it is not one lesson among many, it is the reason there were messengers at all.',
    reference: 'Qur’an 21:25',
  },
  {
    id: 'sabr',
    title: 'Sabr',
    arabic: 'صَبْر',
    body: 'Patience is not silence about pain. Ya‘qub (AS) wept until his sight went and still called it beautiful patience — because he brought his grief to Allah rather than to despair.',
    reference: 'Qur’an 12:18',
  },
  {
    id: 'tawakkul',
    title: 'Tawakkul',
    arabic: 'تَوَكُّل',
    body: 'Do everything in your power, then hand the outcome to the One who controls outcomes. Nuh (AS) still had to build. Musa (AS) still had to walk to the shore.',
    reference: 'Qur’an 26:62',
  },
  {
    id: 'sidq',
    title: 'Truthfulness',
    arabic: 'صِدْق',
    body: 'Honesty that goes past speech into character — being the same person in private that you claim to be in public. The Messenger ﷺ was called Al-Amin before prophethood.',
    reference: 'Qur’an 19:41',
  },
  {
    id: 'rahmah',
    title: 'Mercy',
    arabic: 'رَحْمَة',
    body: 'Not weakness — strength that chooses restraint. The final Messenger ﷺ is described not as a mercy to one tribe or century, but to all the worlds.',
    reference: 'Qur’an 21:107',
  },
  {
    id: 'adl',
    title: 'Justice',
    arabic: 'عَدْل',
    body: 'Owed even to people you dislike, and even when the ruling goes against you. Dawud (AS) was given kingship and told, in the same breath, to judge with truth.',
    reference: 'Qur’an 38:26',
  },
  {
    id: 'afw',
    title: 'Forgiveness',
    arabic: 'عَفْو',
    body: 'To erase a wrong you had every right to pursue. It is only possible when you actually hold the power to retaliate — which is exactly when Yusuf (AS) let it go.',
    reference: 'Qur’an 12:92',
  },
  {
    id: 'tawadu',
    title: 'Humility',
    arabic: 'تَوَاضُع',
    body: 'Sulayman (AS) was given a kingdom unlike any other, and his response to that power was not pride but a prayer to be enabled to be grateful.',
    reference: 'Qur’an 27:19',
  },
]

/* ------------------------------------------------------------------ */
/*  Section 7 — the qualities of the final Messenger ﷺ                 */
/* ------------------------------------------------------------------ */

export interface Quality {
  id: string
  title: string
  body: string
}

export const QUALITIES: Quality[] = [
  {
    id: 'mercy',
    title: 'Mercy',
    body: 'The Qur’an does not describe him as a mercy to Muslims, or to Arabs, or to his own century. It says: to the worlds.',
  },
  {
    id: 'truthfulness',
    title: 'Truthfulness',
    body: 'Makkah called him Al-Amin — the trustworthy — before he ever brought a message. The people who later opposed him had given him that name.',
  },
  {
    id: 'patience',
    title: 'Patience',
    body: 'Boycott, exile, the loss of family, and migration. The message was carried through the pressure, not around it.',
  },
  {
    id: 'justice',
    title: 'Justice',
    body: 'He judged between people by the same standard regardless of who they were related to, and taught that this is exactly where earlier nations had failed.',
  },
  {
    id: 'character',
    title: 'Excellent Character',
    body: 'Of everything the Qur’an could have praised in him, it praised his character — and he said his mission was to perfect it.',
  },
]

/* ------------------------------------------------------------------ */
/*  Section 8 — the five steps upward                                  */
/* ------------------------------------------------------------------ */

export const RESPECT_STEPS = [
  {
    n: '01',
    title: 'Believe',
    body: 'In every messenger Allah sent, without picking and choosing between them.',
  },
  {
    n: '02',
    title: 'Honor',
    body: 'Speak of them with dignity. Send peace upon them. Never make them the subject of a joke.',
  },
  {
    n: '03',
    title: 'Learn',
    body: 'Read their stories properly — what they faced, what they said, and what they refused to do.',
  },
  {
    n: '04',
    title: 'Follow',
    body: 'Take their guidance as a pattern for your own decisions, not just as history you happen to know.',
  },
  {
    n: '05',
    title: 'Live It',
    body: 'Let it change how you treat people, how you handle hardship, and who you are when nobody is checking. This is the whole point.',
  },
]

/* ------------------------------------------------------------------ */
/*  Final scene                                                        */
/* ------------------------------------------------------------------ */

export const FINAL_LINES = [
  'Different times.',
  'Different nations.',
  'Different trials.',
  'One message.',
]
