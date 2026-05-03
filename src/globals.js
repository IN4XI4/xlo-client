import ExplorerBadge from './components/badges/ExplorerBadge'
import CollaboratorBadge from './components/badges/CollaboratorBadge'
import PopularBadge from './components/badges/PopularBadge'
import VeteranBadge from './components/badges/VeteranBadge'
import StorytellerBadge from './components/badges/StorytellerBadge'

import enFlag from './assets/flags/gb.svg';
import esFlag from './assets/flags/es.svg';
import frFlag from './assets/flags/fr.svg';
import deFlag from './assets/flags/de.svg';
import itFlag from './assets/flags/it.svg';
import ptFlag from './assets/flags/pt.svg';

export const COMMENTOR_LEVEL_1 = 1;
export const CREATOR_LEVEL_1 = 4;
export const CREATOR_LEVEL_2 = 5;
export const CREATOR_LEVEL_3 = 6;
export const PREMIUM = 10;

export const USER_LEVELS = [
  { level: 0,  name: "Basic" },
  { level: 1,  name: "Commentor" },
  { level: 2,  name: "Commentor Lvl 2" },
  { level: 3,  name: "Commentor Lvl 3" },
  { level: 4,  name: "Creator" },
  { level: 5,  name: "Creator Lvl 2" },
  { level: 6,  name: "Creator Lvl 3" },
  { level: 7,  name: "Contributor" },
  { level: 8,  name: "Contributor Lvl 2" },
  { level: 9,  name: "Contributor Lvl 3" },
  { level: 10, name: "Expert" },
  { level: 11, name: "Expert Lvl 2" },
  { level: 12, name: "Expert Lvl 3" },
  { level: 13, name: "Expert Lvl 4" },
  { level: 14, name: "Expert Lvl 5" },
  { level: 15, name: "Mentor" },
  { level: 16, name: "Mentor Lvl 2" },
  { level: 17, name: "Mentor Lvl 3" },
  { level: 18, name: "Mentor Lvl 4" },
  { level: 19, name: "Mentor Lvl 5" },
  { level: 20, name: "Sage" },
  { level: 21, name: "Sage Lvl 2" },
  { level: 22, name: "Sage Lvl 3" },
  { level: 23, name: "Sage Lvl 4" },
  { level: 24, name: "Sage Lvl 5" },
  { level: 25, name: "Mixelo" },
  { level: 26, name: "Mixelo Lvl 2" },
  { level: 27, name: "Mixelo Lvl 3" },
  { level: 28, name: "Mixelo Lvl 4" },
  { level: 29, name: "Mixelo Lvl 5" },
];

export const BLOCK_TYPES = {
  1: "STANDARD",
  2: "MONSTER",
  3: "MENTOR",
  4: "HERO",
  5: "HIGHLIGHT",
  6: "QUOTE",
  7: "FLASHCARD",
  8: "FACT",
  9: "WONDER",
  10: "QUESTION",
  11: "TESTIMONIAL",
  12: "REFLECTION",
  13: "ILLUSTRATION",
  14: "MULTICHOICE",
};


export const levelOrder = { BRONZE: 1, SILVER: 2, GOLD: 3, OBSIDIAN: 4, MIXELO: 5 };

export const LEVEL_COLORS = {
  BRONZE: ["#A97142", "#F0DEA4"],
  SILVER: ["#A7A7A7", "#DCDCDC"],
  GOLD: ["#BC9313", "#E4D4A1"],
  OBSIDIAN: ["#3E2856", "#B2A9BB"],
  MIXELO: ["#3DB1FF", "#B8E3FF"],
};

export const badgeTypeToComponentMap = {
  VETERAN: VeteranBadge,
  STORYTELLER: StorytellerBadge,
  POPULAR: PopularBadge,
  COLLABORATOR: CollaboratorBadge,
  EXPLORER: ExplorerBadge,
};

export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CHF: 'CHF',
  MXN: '$',
};

export const flagMap = {
  EN: enFlag,
  ES: esFlag,
  FR: frFlag,
  DE: deFlag,
  IT: itFlag,
  PT: ptFlag,
};

export const ASSESSMENT_LANGUAGES = [
  { code: "EN", label: "English" },
  { code: "FR", label: "French" },
  { code: "ES", label: "Spanish" },
  { code: "DE", label: "German" },
  { code: "IT", label: "Italian" },
  { code: "PT", label: "Portuguese" },
  { code: "OT", label: "Other" },
];