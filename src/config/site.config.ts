export const siteConfig = {
  birthday: {
    name: 'Jeel',
    nickname: 'Chiku',
    day: 5,
    month: 4, // April (1-indexed for display, but Date uses 0-indexed — see dateUtils)
    birthYear: 2002,
    age: 24,
    hinglishMessage:
      "Ohh my god! It is your birthday Jeel. You have turned 24 years dodhi this year",
    countingMessage:
      "I am counting so that you don't have get jealous seeing other's birthday or cry when your birthday will come again",
  },

  text: {
    heroGreeting: 'Happy Birthday,',
    heroName: 'Chiku',
    blessing:
      'May god bless you and life gives you all the happiness. May this birthday be your best birthday ever',
    quoteBreak:
      'Eat healthy not my brain, sleep nicely, fart less, and live life like muchu, muchu',
    closing: 'I will always love you chiku no matter whether it is day or night, yeesterday, today, or tomorrow, and everyday. My job is to always distrub you so do not get annoyed. Also, please don\'t do something wrong to me just because you want my share of the property. Whether you choose Actual Science (certificate course) as your career, whether you make us walk 5 km to eat some bad food dish (to be noted in the list), or whether you chose a Muslim husband, I will always be standing behind you to support you. Your best loving brother, Parshv', // ← FILL THIS IN: your personal closing message to Jeel
    memeVideoLabels: {
      bholaBaba: 'Bhola Baba',
      liveLife: 'Live Life',
    },
  },

  music: {
    defaultVolume: 0.25,     // background music volume (0–1)
    duckedVolume: 0.05,      // background volume while gift sound plays
    giftSoundVolume: 0.8,    // curse.mp3 volume
    autoplayOnFirstInteraction: true,
  },

  hashtags: [
    '#Chiku',
    '#Noob',
    '#Shruti',
    '#Hopari',
    '#AithiGoid',
    '#Choita',
    '#Padodi',
    '#Hagrid',
    '#MarkHenry',
  ],

  media: {
    // Change order here to reorder photos — components read from this config
    soloGallery1: [
      { src: 'solo_1.jpeg', size: 'tall' as const },
      { src: 'solo_2.jpeg', size: 'normal' as const },
      { src: 'solo_3.jpeg', size: 'normal' as const },
      { src: 'solo_4.jpeg', size: 'wide' as const },
      { src: 'solo_5.jpeg', size: 'normal' as const },
      { src: 'solo_6.jpeg', size: 'normal' as const },
      { src: 'solo_19.jpeg', size: 'normal' as const },
    ],
    soloGallery2: [
      { src: 'solo_7.jpeg', size: 'normal' as const },
      { src: 'solo_9.jpeg', size: 'normal' as const },
      { src: 'main.jpeg', size: 'normal' as const },
      { src: 'solo_8.jpeg', size: 'wide' as const },
      { src: 'solo_12.jpeg', size: 'normal' as const },
      { src: 'solo_11.jpeg', size: 'normal' as const },
      { src: 'solo_10.jpeg', size: 'wide' as const },
    ],
    soloGallery3: [
      { src: 'solo_13.jpeg', size: 'normal' as const },
      { src: 'solo_14.jpeg', size: 'tall' as const },
      { src: 'solo_15.jpeg', size: 'normal' as const },
      { src: 'solo_16.jpeg', size: 'normal' as const },
      { src: 'solo_18.jpeg', size: 'tall' as const },
      { src: 'solo_17.jpeg', size: 'wide' as const },
    ],
    familyFilmstrip1: [
      'family_1.jpeg', 'family_2.jpeg', 'family_3.jpeg', 'family_4.jpeg', 'family_5.jpeg',
      'family_6.jpeg', 'family_7.jpeg', 'family_8.jpeg', 'family_9.jpeg', 'family_10.jpeg',
    ],
    familyFilmstrip2: [
      'family_11.jpeg', 'family_12.jpeg', 'family_13.jpeg', 'family_14.jpeg', 'family_15.jpeg',
      'family_16.jpeg', 'family_17.jpeg', 'family_18.jpeg', 'family_19.jpeg', 'family_20.jpeg',
    ],
    // Note: funny_2.jpeg and funny_2.mp4 share base name — extensions are explicit
    funnyPhotos: ['funny_1.jpeg', 'funny_2.jpeg', 'funny_3.jpeg', 'funny_4.jpeg'],
    funnyVideos: ['funny_2.mp4', 'funny_5.mp4', 'funny_6.mp4', 'funny_7.mp4'],
    memeVideos: ['bhola_baba.mp4', 'live_life.mp4'],
  },

  timeline: [
    { year: '2002', title: 'The Beginning', description: 'A legend was adopted on April 5th. The only one to dare to poop outside Ashish uncle\'s house' },
    { year: '2008', title: 'School Days', description: 'Dedka killer. Tataram Tatram' },
    { year: '2014', title: 'Teenage Era', description: 'Silent Topper, AithiGodi, Multiple proposals, Kaam Chor' },
    { year: '2019', title: 'College Begins', description: 'Gold Medalist, Fukara giri, Drugs, Alcohol, Smoking, and Gambling, GU Alumni' },
    { year: '2023', title: 'Adulting Begins', description: 'Athed Umar ki Auraat! Working for Milliman and earning big bucks for me to spend. Need to marry immediately otherwise Mom is going to find someone on Patidar app hidden on her phone.' },
    { year: '2026', title: 'Turning 24', description: 'Best birthday yet because your brother made a website for you (the only gift I could afford and make).' },
  ],

  loveCards: [
    'Your money',
    'Your credit card and credit score',
    'Your skincare products',
    "Your laptop when I didn't have one",
    'Your decision making skills',
    'You turning boring days into memories',
    'Your stupid and cringy sense of humor',
    'You make the whole family better',
    "I am lucky you're my sister",
  ],
} as const

export type PhotoSize = 'normal' | 'tall' | 'wide'
export type PhotoEntry = { src: string; size: PhotoSize }
export type TimelineItem = { year: string; title: string; description: string }
