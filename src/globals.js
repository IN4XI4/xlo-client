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
export const CREATOR_LEVEL_1 = 2;
export const CREATOR_LEVEL_2 = 3;
export const CREATOR_LEVEL_3 = 4;
export const PREMIUM = 5;

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

export const flagMap = {
  EN: enFlag,
  ES: esFlag,
  FR: frFlag,
  DE: deFlag,
  IT: itFlag,
  PT: ptFlag,
};