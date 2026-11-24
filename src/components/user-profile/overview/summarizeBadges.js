import { levelOrder } from '../../../globals';

export const BADGE_ORDER = ['STORYTELLER', 'EXPLORER', 'VETERAN', 'POPULAR', 'COLLABORATOR'];
export const TOTAL_LEVELS = BADGE_ORDER.length * Object.keys(levelOrder).length;

export const capitalize = (text) => text.charAt(0) + text.slice(1).toLowerCase();

const DATE_FORMAT =new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export function summarizeBadges(badges) {
  const current = {};
  let lastEarned = null;

  for (const badge of badges) {
    const level = badge.level?.toUpperCase();
    const best = current[badge.badge_type];
    if (!best || (levelOrder[level] ?? 0) > (levelOrder[best.level] ?? 0)) {
      current[badge.badge_type] = { level, colors: badge.level_colors };
    }
    if (!lastEarned || new Date(badge.awarded_at) > new Date(lastEarned.awarded_at)) {
      lastEarned = { ...badge, level };
    }
  }

  return {
    current,
    earnedCount: badges.length,
    lastEarned: lastEarned && {
      badgeType: lastEarned.badge_type,
      level: lastEarned.level,
      date: DATE_FORMAT.format(new Date(lastEarned.awarded_at)),
    },
  };
}
