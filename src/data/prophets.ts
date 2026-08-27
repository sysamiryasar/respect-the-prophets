/**
 * Prophet data.
 *
 * Content policy for this file:
 *  - Qur'an references are chapter:verse pointers to real passages. Nothing is invented.
 *  - Descriptions are educational summaries, not scripture, and are written as such.
 *  - `symbols` drive the artwork. No entry describes a face, body or human figure —
 *    the visual language is landscape, object, architecture and light only.
 */

export type ArtKey =
  | 'adam'
  | 'nuh'
  | 'ibrahim'
  | 'ismail'
  | 'ishaq'
  | 'yaqub'
  | 'yusuf'
  | 'musa'
  | 'harun'
  | 'dawud'
  | 'sulayman'
  | 'yunus'
  | 'zakariyya'
  | 'yahya'
  | 'isa'
  | 'muhammad'

export interface QuranRef {
  surah: string
  ref: string
  note: string
}

export interface Prophet {
  id: ArtKey
  name: string
  honorific: string
  arabic: string
  epithet: string
  /** One-line hook shown on the timeline card. */
  lesson: string
  /** Short educational summary. */
  description: string
  /** Symbolic objects / places used for the artwork. Never figures. */
  symbols: string[]
  themes: string[]
  quran: QuranRef[]
  /** Accent hue used by the scene grading. */
  accent: string
  /** Secondary / ambient hue. */
  ambient: string
  /** Ambient particle behaviour for the detail scene. */
  weather: 'stars' | 'rain' | 'sand' | 'dust' | 'embers' | 'motes'
  /** One of the five messengers of firm resolve (ulu al-'azm). */
  ululAzm?: boolean
  /** Position on the constellation map, in a 0–100 viewBox space. */
  star: { x: number; y: number; mag: number }
}

export const PROPHETS: Prophet[] = [
  {
    id: 'adam',
    name: 'Adam',
    honorific: '(AS)',
    arabic: 'آدَم',
    epithet: 'The first human — the first to be taught',
    lesson: 'To slip is human. To turn back in repentance is prophetic.',
    description:
      'The Qur’an describes Adam as the first human being and the first prophet, taught the names of all things and placed on earth with a purpose. When he slipped, he did not despair — he received words of repentance from his Lord and turned back to Him.',
    symbols: ['Forming earth', 'A garden without figures', 'First light', 'Falling leaves', 'Open sky'],
    themes: ['Repentance', 'Humility', 'Knowledge', 'Human dignity'],
    quran: [
      { surah: 'Al-Baqarah', ref: '2:30–37', note: 'Taught the names; the words of repentance' },
      { surah: 'Al-A’raf', ref: '7:19–23', note: 'The trial, and the turning back' },
      { surah: 'Ta-Ha', ref: '20:115–122', note: 'Forgetting, then being chosen and guided' },
    ],
    accent: '#7fd8b4',
    ambient: '#0a2a2a',
    weather: 'motes',
    star: { x: 8, y: 30, mag: 1 },
  },
  {
    id: 'nuh',
    name: 'Nuh',
    honorific: '(AS)',
    arabic: 'نُوح',
    epithet: 'The long patience',
    lesson: 'Patience can mean continuing when almost no one listens.',
    description:
      'Nuh called his people to worship Allah alone for centuries — by night and by day, in public and in private. Few believed. He was commanded to build the ark, and the flood came: a reminder that the effort belongs to us, and the outcome belongs to Allah.',
    symbols: ['The ark', 'Rain', 'Rising waves', 'Storm clouds', 'A distant shore'],
    themes: ['Steadfastness', 'Calling to Allah', 'Trust', 'Perseverance'],
    quran: [
      { surah: 'Nuh', ref: '71:1–28', note: 'The calling, night and day' },
      { surah: 'Hud', ref: '11:25–49', note: 'The ark, the flood, and the appeal for his son' },
      { surah: 'Al-‘Ankabut', ref: '29:14', note: 'The length of his mission' },
    ],
    accent: '#6fb2e0',
    ambient: '#08182c',
    weather: 'rain',
    ululAzm: true,
    star: { x: 18, y: 58, mag: 1.35 },
  },
  {
    id: 'ibrahim',
    name: 'Ibrahim',
    honorific: '(AS)',
    arabic: 'إِبْرَاهِيم',
    epithet: 'Khalil of the Most Merciful',
    lesson: 'Truth is worth standing alone for.',
    description:
      'Ibrahim reasoned past the star, the moon and the sun to the One who made them. He confronted the idols of his people and was thrown into the fire — and the fire was commanded to be coolness and peace. With his son he later raised the foundations of the House.',
    symbols: ['Night stars', 'The moon', 'Broken idols', 'A wall of fire turning to light', 'Stone foundations'],
    themes: ['Tawheed', 'Courage', 'Sacrifice', 'Reason'],
    quran: [
      { surah: 'Al-An‘am', ref: '6:75–79', note: 'The star, the moon, the sun — and the One who made them' },
      { surah: 'Al-Anbiya', ref: '21:51–70', note: 'The idols, and the fire made cool' },
      { surah: 'Al-Baqarah', ref: '2:124–129', note: 'Raising the foundations of the House' },
    ],
    accent: '#f0a860',
    ambient: '#2a1206',
    weather: 'embers',
    ululAzm: true,
    star: { x: 30, y: 24, mag: 1.6 },
  },
  {
    id: 'ismail',
    name: 'Isma’il',
    honorific: '(AS)',
    arabic: 'إِسْمَاعِيل',
    epithet: 'True to his promise',
    lesson: 'Real submission answers before it is forced to.',
    description:
      'The Qur’an praises Isma’il as one who was true to his promise, and who used to enjoin prayer and zakah upon his family. He stood with his father through the greatest of trials, and together they raised the foundations of the Ka’bah.',
    symbols: ['A dry valley', 'A spring in barren ground', 'Stone foundations', 'A ram'],
    themes: ['Obedience', 'Truthfulness', 'Sacrifice', 'Family'],
    quran: [
      { surah: 'Maryam', ref: '19:54–55', note: 'True to his promise; enjoining prayer on his family' },
      { surah: 'As-Saffat', ref: '37:100–107', note: 'The great trial, and its ransom' },
      { surah: 'Al-Baqarah', ref: '2:127', note: 'Raising the House with Ibrahim' },
    ],
    accent: '#e0c58a',
    ambient: '#20180c',
    weather: 'sand',
    star: { x: 40, y: 40, mag: 1.1 },
  },
  {
    id: 'ishaq',
    name: 'Ishaq',
    honorific: '(AS)',
    arabic: 'إِسْحَاق',
    epithet: 'The promised glad tiding',
    lesson: 'Allah’s promise arrives on Allah’s timing, not ours.',
    description:
      'Ishaq was given to Ibrahim as glad tidings in old age, when hope by ordinary measures had passed. The Qur’an names him among the righteous, and places prophethood among his descendants.',
    symbols: ['Dawn over low hills', 'Olive branches', 'A quiet tent', 'Distant light'],
    themes: ['Hope', 'Divine promise', 'Righteousness', 'Legacy'],
    quran: [
      { surah: 'Hud', ref: '11:71', note: 'The glad tiding of Ishaq' },
      { surah: 'As-Saffat', ref: '37:112–113', note: 'A prophet from among the righteous' },
      { surah: 'Maryam', ref: '19:49', note: 'Granted, and made a prophet' },
    ],
    accent: '#c8d7a8',
    ambient: '#141c10',
    weather: 'motes',
    star: { x: 47, y: 20, mag: 1 },
  },
  {
    id: 'yaqub',
    name: 'Ya’qub',
    honorific: '(AS)',
    arabic: 'يَعْقُوب',
    epithet: 'Beautiful patience',
    lesson: 'Grief is not a lack of faith. Complaining to Allah alone is faith.',
    description:
      'Ya’qub lost a son, and then a second, and his eyes turned white from sorrow. Yet he said that he complained of his grief and sorrow only to Allah, and he never told his family to stop hoping in the mercy of Allah.',
    symbols: ['An empty road', 'A worn garment', 'Lamplight in a doorway', 'Wheat fields'],
    themes: ['Beautiful patience', 'Hope', 'Fatherhood', 'Reliance on Allah'],
    quran: [
      { surah: 'Yusuf', ref: '12:18', note: '“So patience is most fitting”' },
      { surah: 'Yusuf', ref: '12:86–87', note: 'Complaining only to Allah; never despairing of His mercy' },
      { surah: 'Al-Baqarah', ref: '2:132–133', note: 'His counsel to his sons' },
    ],
    accent: '#d9a97e',
    ambient: '#1d1410',
    weather: 'dust',
    star: { x: 52, y: 52, mag: 1.15 },
  },
  {
    id: 'yusuf',
    name: 'Yusuf',
    honorific: '(AS)',
    arabic: 'يُوسُف',
    epithet: 'The most beautiful of narrations',
    lesson: 'The well is not the end of the story.',
    description:
      'Thrown into a well, sold, falsely accused, imprisoned — and then entrusted with the storehouses of the land. When his brothers finally stood before him, he chose forgiveness. The Qur’an calls his account the most beautiful of narrations.',
    symbols: ['A well and the light above it', 'Prison bars', 'Palace arches', 'Eleven stars'],
    themes: ['Patience', 'Forgiveness', 'Integrity', 'Divine planning'],
    quran: [
      { surah: 'Yusuf', ref: '12:4', note: 'The dream of eleven stars' },
      { surah: 'Yusuf', ref: '12:90', note: 'Whoever is mindful of Allah and patient — no reward is lost' },
      { surah: 'Yusuf', ref: '12:92', note: '“No blame upon you today”' },
    ],
    accent: '#e9c56b',
    ambient: '#191026',
    weather: 'motes',
    star: { x: 62, y: 30, mag: 1.5 },
  },
  {
    id: 'musa',
    name: 'Musa',
    honorific: '(AS)',
    arabic: 'مُوسَىٰ',
    epithet: 'The one Allah spoke to directly',
    lesson: 'When the path seemed impossible, Allah opened a way.',
    description:
      'Sent to the mightiest tyrant of his age with nothing but the truth and a staff. At the shore, with the sea ahead and the army behind, he said: “No — indeed, with me is my Lord; He will guide me.” Then the sea was parted.',
    symbols: ['A staff', 'The parted sea', 'Desert night', 'A mountain and a light', 'Tablets'],
    themes: ['Courage', 'Justice', 'Trust in Allah', 'Standing against oppression'],
    quran: [
      { surah: 'Ash-Shu‘ara', ref: '26:62', note: '“Indeed, with me is my Lord; He will guide me”' },
      { surah: 'Ash-Shu‘ara', ref: '26:63', note: 'The command to strike the sea' },
      { surah: 'Ta-Ha', ref: '20:9–36', note: 'The fire, the valley, and the commissioning' },
    ],
    accent: '#5fd0d8',
    ambient: '#04202c',
    weather: 'sand',
    ululAzm: true,
    star: { x: 72, y: 55, mag: 1.75 },
  },
  {
    id: 'harun',
    name: 'Harun',
    honorific: '(AS)',
    arabic: 'هَارُون',
    epithet: 'The helper, given eloquence',
    lesson: 'Truth needs those who support it, not only those who speak it.',
    description:
      'When Musa asked for a helper from his family, Allah gave him his brother Harun and strengthened them both. Harun held a people together in his brother’s absence, and refused to let division tear them apart.',
    symbols: ['Two paths converging', 'Desert encampment', 'A mountain pass', 'Lantern light'],
    themes: ['Support', 'Eloquence', 'Unity', 'Gentleness'],
    quran: [
      { surah: 'Ta-Ha', ref: '20:29–36', note: 'The prayer for a helper, and its answer' },
      { surah: 'Al-Qasas', ref: '28:34–35', note: 'Strengthened by his brother' },
      { surah: 'Maryam', ref: '19:53', note: 'Granted as a prophet out of mercy' },
    ],
    accent: '#8ec6a8',
    ambient: '#0c1f1c',
    weather: 'sand',
    star: { x: 78, y: 44, mag: 1.1 },
  },
  {
    id: 'dawud',
    name: 'Dawud',
    honorific: '(AS)',
    arabic: 'دَاوُود',
    epithet: 'Given the Zabur; the mountains echoed with him',
    lesson: 'Strength is a trust. Judge justly with it.',
    description:
      'Dawud was given kingship, wisdom and the Zabur. The mountains and the birds were made to echo his praise of Allah, iron was made pliant in his hands, and he was commanded to judge between people with justice.',
    symbols: ['Mountains at dusk', 'Shaped iron', 'Birds in flight', 'Echoing valleys'],
    themes: ['Justice', 'Gratitude', 'Worship', 'Responsibility'],
    quran: [
      { surah: 'Sad', ref: '38:17–26', note: 'Praise echoed by mountains; the command to judge justly' },
      { surah: 'Al-Anbiya', ref: '21:79–80', note: 'Understanding, and the craft of armour' },
      { surah: 'Saba', ref: '34:10–11', note: 'Iron made pliant; the call to gratitude' },
    ],
    accent: '#9fb6e8',
    ambient: '#101830',
    weather: 'motes',
    star: { x: 86, y: 62, mag: 1.3 },
  },
  {
    id: 'sulayman',
    name: 'Sulayman',
    honorific: '(AS)',
    arabic: 'سُلَيْمَان',
    epithet: 'The kingdom that bowed to gratitude',
    lesson: 'The greater the gift, the deeper the gratitude.',
    description:
      'Sulayman was given a kingdom unlike any other — the wind, the jinn, and an understanding of the speech of birds. His response to that power was not pride, but a prayer to be enabled to be grateful.',
    symbols: ['A throne hall', 'Wind over water', 'A hoopoe in flight', 'Colonnades of light'],
    themes: ['Gratitude', 'Wisdom', 'Humility in power', 'Justice'],
    quran: [
      { surah: 'An-Naml', ref: '27:15–19', note: 'Knowledge, the ant, and the prayer for gratitude' },
      { surah: 'Sad', ref: '38:30–35', note: 'An excellent servant, ever turning back' },
      { surah: 'Al-Anbiya', ref: '21:81–82', note: 'The wind made subject to him' },
    ],
    accent: '#c9a2e8',
    ambient: '#1a1030',
    weather: 'motes',
    star: { x: 92, y: 40, mag: 1.25 },
  },
  {
    id: 'yunus',
    name: 'Yunus',
    honorific: '(AS)',
    arabic: 'يُونُس',
    epithet: 'The call from within the depths',
    lesson: 'No darkness is too deep for a sincere call.',
    description:
      'Yunus left his people, and was swallowed by the fish. From within layered darkness he called out: there is no deity except You; exalted are You; indeed I have been of the wrongdoers. He was answered — and so, the Qur’an says, are the believers saved.',
    symbols: ['Deep ocean layers', 'A single shaft of light underwater', 'A gourd vine', 'Shoreline at dawn'],
    themes: ['Supplication', 'Repentance', 'Hope', 'Returning to Allah'],
    quran: [
      { surah: 'Al-Anbiya', ref: '21:87–88', note: 'The call from the darkness, and the answer' },
      { surah: 'As-Saffat', ref: '37:139–148', note: 'The fish, the shore, and a people who believed' },
      { surah: 'Yunus', ref: '10:98', note: 'A town whose faith benefited it' },
    ],
    accent: '#4fc0b0',
    ambient: '#04202a',
    weather: 'motes',
    star: { x: 66, y: 72, mag: 1.2 },
  },
  {
    id: 'zakariyya',
    name: 'Zakariyya',
    honorific: '(AS)',
    arabic: 'زَكَرِيَّا',
    epithet: 'The quiet prayer',
    lesson: 'Call upon Allah in private — and never call upon Him in vain.',
    description:
      'Zakariyya called upon his Lord with a hidden, private supplication, when his bones had grown weak and his head had turned white with age. He was given Yahya — a name, the Qur’an says, that no one had carried before him.',
    symbols: ['A prayer niche', 'Candlelight', 'Bare branches in bloom', 'Arched windows'],
    themes: ['Supplication', 'Hope', 'Sincerity', 'Patience'],
    quran: [
      { surah: 'Maryam', ref: '19:2–11', note: 'The hidden call, and the glad tiding of Yahya' },
      { surah: 'Al Imran', ref: '3:38–41', note: 'The prayer in the sanctuary' },
      { surah: 'Al-Anbiya', ref: '21:89–90', note: 'Those who call upon Allah in hope and awe' },
    ],
    accent: '#a8c8d8',
    ambient: '#0c1620',
    weather: 'motes',
    star: { x: 56, y: 82, mag: 1 },
  },
  {
    id: 'yahya',
    name: 'Yahya',
    honorific: '(AS)',
    arabic: 'يَحْيَىٰ',
    epithet: 'Given wisdom while still a child',
    lesson: 'Take hold of the truth with strength — at any age.',
    description:
      'Yahya was told to hold to the Scripture with strength, and was given sound judgement while still a boy. The Qur’an describes him as pure, mindful of Allah, and dutiful to his parents — never a tyrant, and never disobedient.',
    symbols: ['A river at first light', 'An open scroll', 'Reeds', 'Cool green shade'],
    themes: ['Devotion', 'Purity', 'Courage', 'Honouring parents'],
    quran: [
      { surah: 'Maryam', ref: '19:12–15', note: 'Wisdom as a child; tenderness and purity' },
      { surah: 'Al Imran', ref: '3:39', note: 'Confirming a word from Allah' },
      { surah: 'Al-Anbiya', ref: '21:90', note: 'Hastening to good deeds' },
    ],
    accent: '#8fd6b8',
    ambient: '#0a1e1a',
    weather: 'motes',
    star: { x: 44, y: 88, mag: 1 },
  },
  {
    id: 'isa',
    name: '‘Isa',
    honorific: '(AS)',
    arabic: 'عِيسَىٰ',
    epithet: 'A servant and messenger of Allah',
    lesson: 'Every miracle happened by the permission of Allah.',
    description:
      'The Qur’an describes ‘Isa, son of Maryam, as a servant and messenger of Allah, given the Injil and supported with clear signs. The miracles he performed are described each time as being by the permission of Allah. His message was the message of every prophet before him: worship Allah, my Lord and your Lord.',
    symbols: ['Soft desert light', 'Ancient stone arches', 'An open scroll', 'A laid table', 'Olive groves'],
    themes: ['Tawheed', 'Mercy', 'Humility', 'Calling to righteousness'],
    quran: [
      { surah: 'Maryam', ref: '19:30–33', note: '“Indeed, I am the servant of Allah”' },
      { surah: 'Maryam', ref: '19:36', note: '“Allah is my Lord and your Lord, so worship Him”' },
      { surah: 'Al-Ma’idah', ref: '5:110', note: 'The signs, each by the permission of Allah' },
    ],
    accent: '#bcd8e8',
    ambient: '#0e1826',
    weather: 'motes',
    ululAzm: true,
    star: { x: 34, y: 72, mag: 1.5 },
  },
  {
    id: 'muhammad',
    name: 'Muhammad',
    honorific: 'ﷺ',
    arabic: 'مُحَمَّد',
    epithet: 'The Seal of the Prophets — a mercy to all the worlds',
    lesson: 'The message completed; the character that carried it.',
    description:
      'Muslims believe Muhammad ﷺ is the final Prophet and Messenger, sent with the Qur’an to all of humanity. The Qur’an describes him as a mercy to the worlds, as being upon an exalted standard of character, and as an excellent example for whoever hopes in Allah and the Last Day.',
    symbols: [
      'The Ka’bah',
      'A desert road at night',
      'Madinah-inspired arches',
      'A dome silhouette',
      'An open mus’haf',
      'Rising dawn',
    ],
    themes: ['Mercy', 'Truthfulness', 'Justice', 'Character', 'Brotherhood'],
    quran: [
      { surah: 'Al-Anbiya', ref: '21:107', note: '“We sent you only as a mercy to the worlds”' },
      { surah: 'Al-Qalam', ref: '68:4', note: '“Indeed, you are of a great moral character”' },
      { surah: 'Al-Ahzab', ref: '33:21, 33:40', note: 'An excellent example; the Seal of the Prophets' },
    ],
    accent: '#e8cf96',
    ambient: '#0d1a1c',
    weather: 'stars',
    ululAzm: true,
    star: { x: 50, y: 8, mag: 2.4 },
  },
]

export const PROPHET_BY_ID = Object.fromEntries(PROPHETS.map((p) => [p.id, p])) as Record<
  ArtKey,
  Prophet
>

/** Prophets that have a full-screen cinematic scene of their own. */
export const SCENE_ORDER: ArtKey[] = ['adam', 'nuh', 'ibrahim', 'musa', 'yusuf', 'isa', 'muhammad']
