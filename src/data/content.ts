import type { ArtKey } from './prophets'

/* ================================================================== *
 * SOURCES
 *
 * Every Arabic passage below is Qur'anic wording with its surah and
 * ayah recorded, or a hadith with its collection recorded. English
 * renderings are conventional translations of meaning, marked as such
 * in the UI. Nothing here is invented, paraphrased into scripture, or
 * presented as revelation when it is not.
 * ================================================================== */

export type SourceKind = 'quran' | 'hadith' | 'teaching'

export interface Verse {
  id: string
  kind: SourceKind
  arabic: string
  translation: string
  surah: string
  reference: string
  /** Why this passage sits in this journey. Educational note, not scripture. */
  context: string
  theme: string
}

export const VERSES: Verse[] = [
  {
    id: 'v-2-285',
    kind: 'quran',
    arabic:
      'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ',
    translation:
      'The Messenger has believed in what was revealed to him from his Lord, and so have the believers. All of them have believed in Allah and His angels and His books and His messengers, saying: “We make no distinction between any of His messengers.”',
    surah: 'Surah Al-Baqarah',
    reference: '2:285',
    context:
      'The verse that makes belief in all of the messengers a single, undivided act of faith.',
    theme: 'All the messengers',
  },
  {
    id: 'v-16-36',
    kind: 'quran',
    arabic: 'وَلَقَدْ بَعَثْنَا فِي كُلِّ أُمَّةٍ رَّسُولًا أَنِ اعْبُدُوا اللَّهَ وَاجْتَنِبُوا الطَّاغُوتَ',
    translation:
      'And We certainly sent into every nation a messenger, saying: “Worship Allah and avoid false objects of worship.”',
    surah: 'Surah An-Nahl',
    reference: '16:36',
    context: 'Different nations, different languages, different centuries — one instruction.',
    theme: 'One message',
  },
  {
    id: 'v-21-25',
    kind: 'quran',
    arabic:
      'وَمَا أَرْسَلْنَا مِن قَبْلِكَ مِن رَّسُولٍ إِلَّا نُوحِي إِلَيْهِ أَنَّهُ لَا إِلَٰهَ إِلَّا أَنَا فَاعْبُدُونِ',
    translation:
      'And We sent not before you any messenger except that We revealed to him that: “There is no deity except Me, so worship Me.”',
    surah: 'Surah Al-Anbiya',
    reference: '21:25',
    context: 'The core of every prophetic mission, stated without exception.',
    theme: 'Tawheed',
  },
  {
    id: 'v-2-37',
    kind: 'quran',
    arabic:
      'فَتَلَقَّىٰ آدَمُ مِن رَّبِّهِ كَلِمَاتٍ فَتَابَ عَلَيْهِ ۚ إِنَّهُ هُوَ التَّوَّابُ الرَّحِيمُ',
    translation:
      'Then Adam received from his Lord some words, and He accepted his repentance. Indeed, it is He who is the Accepting of repentance, the Merciful.',
    surah: 'Surah Al-Baqarah',
    reference: '2:37',
    context: 'The first mistake in human history is answered by the first act of forgiveness.',
    theme: 'Repentance',
  },
  {
    id: 'v-11-41',
    kind: 'quran',
    arabic: 'وَقَالَ ارْكَبُوا فِيهَا بِسْمِ اللَّهِ مَجْرَاهَا وَمُرْسَاهَا ۚ إِنَّ رَبِّي لَغَفُورٌ رَّحِيمٌ',
    translation:
      'And he said: “Embark therein; in the name of Allah is its course and its anchorage. Indeed, my Lord is Forgiving and Merciful.”',
    surah: 'Surah Hud',
    reference: '11:41',
    context: 'Nuh boards the ark after generations of being ignored — still naming Allah.',
    theme: 'Steadfastness',
  },
  {
    id: 'v-21-69',
    kind: 'quran',
    arabic: 'قُلْنَا يَا نَارُ كُونِي بَرْدًا وَسَلَامًا عَلَىٰ إِبْرَاهِيمَ',
    translation: 'We said: “O fire, be coolness and safety upon Ibrahim.”',
    surah: 'Surah Al-Anbiya',
    reference: '21:69',
    context: 'The fire did not stop being fire. It stopped being permitted to harm.',
    theme: 'Trust in Allah',
  },
  {
    id: 'v-26-62',
    kind: 'quran',
    arabic: 'قَالَ كَلَّا ۖ إِنَّ مَعِيَ رَبِّي سَيَهْدِينِ',
    translation: 'He said: “No! Indeed, with me is my Lord; He will guide me.”',
    surah: 'Surah Ash-Shu‘ara',
    reference: '26:62',
    context: 'Musa at the shore — the sea ahead, an army behind, and no visible way through.',
    theme: 'Certainty',
  },
  {
    id: 'v-12-90',
    kind: 'quran',
    arabic: 'إِنَّهُ مَن يَتَّقِ وَيَصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ',
    translation:
      'Indeed, whoever is mindful of Allah and patient — then indeed, Allah does not allow the reward of those who do good to be lost.',
    surah: 'Surah Yusuf',
    reference: '12:90',
    context: 'Yusuf, at the end of a lifetime of betrayal, names the two things that carried him.',
    theme: 'Patience',
  },
  {
    id: 'v-12-92',
    kind: 'quran',
    arabic: 'قَالَ لَا تَثْرِيبَ عَلَيْكُمُ الْيَوْمَ ۖ يَغْفِرُ اللَّهُ لَكُمْ ۖ وَهُوَ أَرْحَمُ الرَّاحِمِينَ',
    translation:
      'He said: “No blame will there be upon you today. Allah will forgive you, and He is the most merciful of the merciful.”',
    surah: 'Surah Yusuf',
    reference: '12:92',
    context: 'The moment he had every right to take revenge — and chose not to.',
    theme: 'Forgiveness',
  },
  {
    id: 'v-21-87',
    kind: 'quran',
    arabic: 'لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
    translation:
      '“There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.”',
    surah: 'Surah Al-Anbiya',
    reference: '21:87',
    context: 'The call of Yunus from within the darkness — answered, and preserved for everyone after him.',
    theme: 'Supplication',
  },
  {
    id: 'v-19-36',
    kind: 'quran',
    arabic: 'وَإِنَّ اللَّهَ رَبِّي وَرَبُّكُمْ فَاعْبُدُوهُ ۚ هَٰذَا صِرَاطٌ مُّسْتَقِيمٌ',
    translation:
      '“And indeed, Allah is my Lord and your Lord, so worship Him. That is a straight path.”',
    surah: 'Surah Maryam',
    reference: '19:36',
    context: 'The words of ‘Isa (AS) — the same call carried by every messenger before him.',
    theme: 'One message',
  },
  {
    id: 'v-21-107',
    kind: 'quran',
    arabic: 'وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ',
    translation: 'And We have not sent you except as a mercy to the worlds.',
    surah: 'Surah Al-Anbiya',
    reference: '21:107',
    context: 'Not a mercy to one tribe, one city, or one century.',
    theme: 'Mercy',
  },
  {
    id: 'v-68-4',
    kind: 'quran',
    arabic: 'وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ',
    translation: 'And indeed, you are of a great moral character.',
    surah: 'Surah Al-Qalam',
    reference: '68:4',
    context: 'Of everything that could have been praised, character was.',
    theme: 'Character',
  },
  {
    id: 'v-33-21',
    kind: 'quran',
    arabic:
      'لَّقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ لِّمَن كَانَ يَرْجُو اللَّهَ وَالْيَوْمَ الْآخِرَ وَذَكَرَ اللَّهَ كَثِيرًا',
    translation:
      'There has certainly been for you in the Messenger of Allah an excellent example — for anyone whose hope is in Allah and the Last Day, and who remembers Allah often.',
    surah: 'Surah Al-Ahzab',
    reference: '33:21',
    context: 'Respect, in the Qur’an’s own framing, is something you follow — not something you say.',
    theme: 'Following the example',
  },
  {
    id: 'v-33-40',
    kind: 'quran',
    arabic:
      'مَّا كَانَ مُحَمَّدٌ أَبَا أَحَدٍ مِّن رِّجَالِكُمْ وَلَٰكِن رَّسُولَ اللَّهِ وَخَاتَمَ النَّبِيِّينَ',
    translation:
      'Muhammad is not the father of any one of your men, but he is the Messenger of Allah and the Seal of the Prophets.',
    surah: 'Surah Al-Ahzab',
    reference: '33:40',
    context: 'The verse Muslims cite for the belief that prophethood ends with Muhammad ﷺ.',
    theme: 'Finality',
  },
  {
    id: 'v-6-90',
    kind: 'quran',
    arabic: 'أُولَٰئِكَ الَّذِينَ هَدَى اللَّهُ ۖ فَبِهُدَاهُمُ اقْتَدِهْ',
    translation:
      'Those are the ones whom Allah has guided, so follow their guidance.',
    surah: 'Surah Al-An‘am',
    reference: '6:90',
    context:
      'Said after a long list of prophets is named — the instruction is to take their guidance as a pattern.',
    theme: 'Following the example',
  },
]

/** Hadith are kept separate and labelled separately — never blended with the Qur'an. */
export const HADITH: Verse[] = [
  {
    id: 'h-bukhari-3443',
    kind: 'hadith',
    arabic: 'الْأَنْبِيَاءُ إِخْوَةٌ لِعَلَّاتٍ، أُمَّهَاتُهُمْ شَتَّىٰ وَدِينُهُمْ وَاحِدٌ',
    translation:
      '“The prophets are brothers of one father; their mothers are different, and their religion is one.”',
    surah: 'Prophetic narration',
    reference: 'Sahih al-Bukhari 3443',
    context:
      'One family, one core religion — the imagery Muslims use for the unity of all the prophets.',
    theme: 'Brotherhood of the prophets',
  },
  {
    id: 'h-adab-273',
    kind: 'hadith',
    arabic: 'إِنَّمَا بُعِثْتُ لِأُتَمِّمَ صَالِحَ الْأَخْلَاقِ',
    translation: '“I was sent only to perfect good character.”',
    surah: 'Prophetic narration',
    reference: 'Al-Adab Al-Mufrad 273; Musnad Ahmad',
    context: 'The mission, summarised by the Messenger ﷺ himself in a single line.',
    theme: 'Character',
  },
]

/* ------------------------------------------------------------------ */
/*  Six pillars of iman — from the narration of Jibril (Sahih Muslim 8) */
/* ------------------------------------------------------------------ */

export interface Pillar {
  id: string
  index: number
  title: string
  arabic: string
  short: string
  body: string
  highlight?: boolean
}

export const PILLARS: Pillar[] = [
  {
    id: 'allah',
    index: 1,
    title: 'Belief in Allah',
    arabic: 'الإيمان بالله',
    short: 'One, without partner, without equal.',
    body:
      'To believe that Allah alone is the Creator and Sustainer, that He alone deserves worship, and that nothing whatsoever resembles Him. Every other pillar rests on this one.',
  },
  {
    id: 'angels',
    index: 2,
    title: 'Belief in His Angels',
    arabic: 'الإيمان بالملائكة',
    short: 'Created from light, never disobeying.',
    body:
      'Angels are creations of Allah who carry out what He commands without weariness or refusal. Among them is Jibril (AS), who carried the revelation to the prophets.',
  },
  {
    id: 'books',
    index: 3,
    title: 'Belief in His Books',
    arabic: 'الإيمان بالكتب',
    short: 'Revelation sent down through the ages.',
    body:
      'The Qur’an names revealed scriptures including the Tawrah given to Musa (AS), the Injil given to ‘Isa (AS), the Zabur given to Dawud (AS), and the scriptures of Ibrahim (AS). Muslims believe the Qur’an is the final revelation, preserved.',
  },
  {
    id: 'messengers',
    index: 4,
    title: 'Belief in His Messengers',
    arabic: 'الإيمان بالرسل',
    short: 'All of them. Not some of them.',
    body:
      'To believe that Allah chose messengers in every nation to convey His guidance, that they were truthful, and that they conveyed what they were given. A Muslim does not accept one messenger and reject another — belief in them is a single act. This is the doorway to everything that follows in this journey.',
    highlight: true,
  },
  {
    id: 'last-day',
    index: 5,
    title: 'Belief in the Last Day',
    arabic: 'الإيمان باليوم الآخر',
    short: 'Every soul will be returned, and asked.',
    body:
      'To believe in resurrection, accountability, and a justice that no one escapes and no one is cheated by. It gives weight to the smallest good deed and the smallest wrong.',
  },
  {
    id: 'qadar',
    index: 6,
    title: 'Belief in Divine Decree',
    arabic: 'الإيمان بالقدر',
    short: 'His knowledge encompasses all of it.',
    body:
      'To believe that Allah knows all things and that nothing occurs outside His will and wisdom, while human beings remain responsible for the choices they make. It is the pillar that turns hardship into something bearable.',
  },
]

/* ------------------------------------------------------------------ */
/*  Lessons grid                                                       */
/* ------------------------------------------------------------------ */

export interface Lesson {
  id: string
  title: string
  arabic: string
  transliteration: string
  short: string
  body: string
  exemplar: string
  reference: string
}

export const LESSONS: Lesson[] = [
  {
    id: 'tawheed',
    title: 'Tawheed',
    arabic: 'تَوْحِيد',
    transliteration: 'tawḥīd',
    short: 'Worship Allah alone.',
    body:
      'Every messenger arrived with the same first sentence: worship Allah, you have no deity other than Him. Everything else a prophet taught — mercy, justice, patience — grows out of this root. It is not one lesson among many; it is the reason there were messengers at all.',
    exemplar: 'Ibrahim (AS) reasoned his way to it and then refused to trade it for safety.',
    reference: 'Qur’an 21:25; 16:36',
  },
  {
    id: 'taqwa',
    title: 'Taqwa',
    arabic: 'تَقْوَىٰ',
    transliteration: 'taqwā',
    short: 'Be conscious of Allah.',
    body:
      'Taqwa is living as though you are seen — because you are. It is the quiet awareness that shapes what you do when no one is checking, and the Qur’an ties it directly to being given a way out of difficulty.',
    exemplar: 'Yusuf (AS) in a locked room, with no witness but Allah.',
    reference: 'Qur’an 12:90',
  },
  {
    id: 'sabr',
    title: 'Sabr',
    arabic: 'صَبْر',
    transliteration: 'ṣabr',
    short: 'Remain patient through hardship.',
    body:
      'Sabr is not passivity and it is not silence about pain. Ya‘qub (AS) wept until his sight went, and still called it beautiful patience — because he brought his grief to Allah rather than to despair.',
    exemplar: 'Nuh (AS) called his people for generations without seeing the result.',
    reference: 'Qur’an 12:18; 12:86',
  },
  {
    id: 'tawakkul',
    title: 'Tawakkul',
    arabic: 'تَوَكُّل',
    transliteration: 'tawakkul',
    short: 'Trust Allah — after you have acted.',
    body:
      'Tawakkul is doing everything within your power and then handing the outcome to the One who controls outcomes. Nuh (AS) still had to build the ark. Musa (AS) still had to walk to the shore.',
    exemplar: 'Musa (AS): “Indeed, with me is my Lord; He will guide me.”',
    reference: 'Qur’an 26:62',
  },
  {
    id: 'sidq',
    title: 'Sidq',
    arabic: 'صِدْق',
    transliteration: 'ṣidq',
    short: 'Speak — and be — the truth.',
    body:
      'Sidq is honesty that goes past speech into character: being the same person in private that you claim to be in public. The Qur’an calls Ibrahim (AS) and Yusuf (AS) ṣiddīq — utterly truthful.',
    exemplar: 'The Messenger ﷺ was called Al-Amin, the trustworthy, before prophethood.',
    reference: 'Qur’an 19:41; 12:46',
  },
  {
    id: 'rahmah',
    title: 'Rahmah',
    arabic: 'رَحْمَة',
    transliteration: 'raḥmah',
    short: 'Show mercy.',
    body:
      'Mercy in the prophetic sense is not weakness — it is strength that chooses restraint. The final Messenger ﷺ is described in the Qur’an not as a mercy to Muslims, or to Arabs, but as a mercy to all the worlds.',
    exemplar: 'Muhammad ﷺ — “a mercy to the worlds.”',
    reference: 'Qur’an 21:107',
  },
  {
    id: 'adl',
    title: 'Adl',
    arabic: 'عَدْل',
    transliteration: '‘adl',
    short: 'Stand for justice.',
    body:
      'Justice in the Qur’an is owed even to those you dislike, and even when the ruling goes against yourself. Dawud (AS) was given kingship and told, in the same breath, to judge between people with truth.',
    exemplar: 'Musa (AS) stood before a tyrant and named the injustice out loud.',
    reference: 'Qur’an 38:26; 5:8',
  },
  {
    id: 'afw',
    title: 'Forgiveness',
    arabic: 'عَفْو',
    transliteration: '‘afw',
    short: 'Pardon when you are able to.',
    body:
      '‘Afw is to erase a wrong you had every right to pursue. It is only possible when you actually hold the power to retaliate — which is exactly the moment Yusuf (AS) let it go.',
    exemplar: 'Yusuf (AS): “No blame will there be upon you today.”',
    reference: 'Qur’an 12:92',
  },
]

/* ------------------------------------------------------------------ */
/*  Cinematic scene beats                                              */
/* ------------------------------------------------------------------ */

export interface SceneBeat {
  label: string
  text: string
}

export interface Scene {
  id: ArtKey
  kicker: string
  beats: SceneBeat[]
  lesson: string
  /** Optional verse id pulled from VERSES to close the scene. */
  verseId?: string
}

export const SCENES: Record<string, Scene> = {
  adam: {
    id: 'adam',
    kicker: 'Where it begins',
    beats: [
      {
        label: 'The beginning',
        text: 'Before nations, before languages, before history had anything to record — there was a command to worship Allah alone.',
      },
      {
        label: 'The teaching',
        text: 'The Qur’an says Adam was taught the names of all things. Human beings were given knowledge, and with it, responsibility.',
      },
      {
        label: 'The slip',
        text: 'He forgot. He slipped. He did not remain there. He received words from his Lord and turned back.',
      },
    ],
    lesson:
      'Humanity did not begin in perfection. It began in a relationship — one that survives mistakes when you return to it.',
    verseId: 'v-2-37',
  },
  nuh: {
    id: 'nuh',
    kicker: 'The long patience',
    beats: [
      {
        label: 'The call',
        text: 'By night and by day. In public and in private. For a span the Qur’an measures in centuries.',
      },
      {
        label: 'The refusal',
        text: 'They put their fingers in their ears and covered themselves with their garments. Almost no one listened.',
      },
      {
        label: 'The ark',
        text: 'He was commanded to build — on dry land, in front of people who mocked every plank of it.',
      },
      {
        label: 'The flood',
        text: 'Then the sky opened and the earth opened, and what he had been building for years became the only safe place on it.',
      },
    ],
    lesson:
      'Patience can mean continuing when almost no one listens. You are answerable for the effort, not for the response.',
    verseId: 'v-11-41',
  },
  ibrahim: {
    id: 'ibrahim',
    kicker: 'Standing alone',
    beats: [
      {
        label: 'The night',
        text: 'He looked at a star, then the moon, then the sun — and refused each one. “I do not love things that set.”',
      },
      {
        label: 'The idols',
        text: 'He broke what his people worshipped and left the largest one standing, so that they would have to answer their own question.',
      },
      {
        label: 'The fire',
        text: 'They built a fire, and threw him into it. The fire was commanded: be coolness, and be peace.',
      },
      {
        label: 'The house',
        text: 'Years later, in a valley without crops or water, he and his son raised the foundations of a house of worship — and prayed that it would be accepted.',
      },
    ],
    lesson:
      'Tawheed, courage, and complete trust. Ibrahim (AS) was one man against a nation, and the Qur’an calls him a nation in himself.',
    verseId: 'v-21-69',
  },
  musa: {
    id: 'musa',
    kicker: 'When there was no way',
    beats: [
      {
        label: 'The valley',
        text: 'A distant fire in the desert night. He went to fetch a burning branch, and was spoken to by his Lord.',
      },
      {
        label: 'The staff',
        text: 'A shepherd’s staff — the most ordinary object in his hand — became the sign he was sent with.',
      },
      {
        label: 'The shore',
        text: 'The sea ahead. Pharaoh’s army closing behind. His people said: “We are surely overtaken.”',
      },
      {
        label: 'The answer',
        text: '“No! Indeed, with me is my Lord; He will guide me.” And the sea was parted, each part like a great towering mountain.',
      },
    ],
    lesson:
      'When the path seemed impossible, Allah opened a way. The certainty came before the miracle, not after it.',
    verseId: 'v-26-62',
  },
  yusuf: {
    id: 'yusuf',
    kicker: 'The most beautiful of narrations',
    beats: [
      {
        label: 'The well',
        text: 'A boy at the bottom of a well, betrayed by his own brothers, watching a circle of daylight far above him.',
      },
      {
        label: 'The refusal',
        text: 'In a locked room, with power and privacy on offer, he refused — and chose prison over betraying his own integrity.',
      },
      {
        label: 'The rise',
        text: 'Years forgotten in a cell. Then a dream no one could read, and a man in prison who could. He was placed over the storehouses of the land.',
      },
      {
        label: 'The pardon',
        text: 'His brothers stood in front of him, not knowing him, entirely in his power. He said: no blame upon you today.',
      },
    ],
    lesson:
      'Allah can turn hardship into something greater than the ease you asked for. Patience, integrity, and forgiveness were the whole road.',
    verseId: 'v-12-92',
  },
  isa: {
    id: 'isa',
    kicker: 'By the permission of Allah',
    beats: [
      {
        label: 'The sign',
        text: 'The Qur’an describes his birth as a sign, and his first words as a declaration: “Indeed, I am the servant of Allah.”',
      },
      {
        label: 'The miracles',
        text: 'Healing, and giving life to the dead. Each one described in the Qur’an with the same qualifier: by the permission of Allah.',
      },
      {
        label: 'The message',
        text: 'Not a new religion — the same call, carried forward: worship Allah, my Lord and your Lord. That is a straight path.',
      },
    ],
    lesson:
      'Mercy, humility, and worship of Allah alone. Muslims hold ‘Isa (AS) in the highest honour as one of the great messengers of Allah.',
    verseId: 'v-19-36',
  },
  muhammad: {
    id: 'muhammad',
    kicker: 'The message completed',
    beats: [
      {
        label: 'Before the message',
        text: 'He was known in Makkah as Al-Amin — the trustworthy — by people who would later oppose him.',
      },
      {
        label: 'The revelation',
        text: 'The Qur’an was revealed over roughly twenty-three years, and Muslims believe it is preserved word for word as it was given.',
      },
      {
        label: 'The years of hardship',
        text: 'Boycott, exile, the loss of family, and the migration to Madinah — a message carried through pressure, not around it.',
      },
      {
        label: 'The character',
        text: 'Of everything the Qur’an could have praised in him, it praised his character. And he said his mission was to perfect it.',
      },
      {
        label: 'The seal',
        text: 'Muslims believe he is the Messenger of Allah and the Seal of the Prophets — the last, sent not to one nation but to all the worlds.',
      },
    ],
    lesson:
      'Mercy, justice, patience, truthfulness, brotherhood, and worship of Allah — the message and the man who lived it.',
    verseId: 'v-21-107',
  },
}

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */

export interface NavItem {
  id: string
  label: string
  short: string
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', short: 'Home' },
  { id: 'why', label: 'Why Respect?', short: 'Why' },
  { id: 'pillars', label: '6 Pillars', short: 'Pillars' },
  { id: 'prophets', label: 'Prophets', short: 'Prophets' },
  { id: 'stories', label: 'Stories', short: 'Stories' },
  { id: 'quran', label: 'Qur’an', short: 'Qur’an' },
  { id: 'lessons', label: 'Lessons', short: 'Lessons' },
  { id: 'final', label: 'Final Message', short: 'Final' },
]

/* ------------------------------------------------------------------ */
/*  "Respect is more than words" — timed reveal lines                  */
/* ------------------------------------------------------------------ */

export const RESPECT_LINES = [
  'It means learning from them.',
  'Living by their teachings.',
  'Following their example.',
  'Standing for truth.',
  'Showing mercy.',
  'Worshipping Allah.',
]

/* ------------------------------------------------------------------ */
/*  Intro section lines                                                */
/* ------------------------------------------------------------------ */

export const INTRO_LINES = [
  'Muslims believe in all of Allah’s prophets and messengers.',
  'They were chosen by Allah to guide humanity.',
  'They came to different nations, in different centuries, speaking different languages.',
  'And they taught the same things.',
]

export const INTRO_TEACHINGS = [
  { title: 'Tawheed', body: 'That Allah alone is worthy of worship.' },
  { title: 'Worship', body: 'That devotion is owed to the Creator, not the creation.' },
  { title: 'Truthfulness', body: 'That your word and your character must match.' },
  { title: 'Justice', body: 'That the truth is told even against yourself.' },
  { title: 'Patience', body: 'That hardship is carried, not fled from.' },
  { title: 'Mercy', body: 'That strength is measured by restraint.' },
  { title: 'Good character', body: 'That how you treat people is the proof of your faith.' },
]
