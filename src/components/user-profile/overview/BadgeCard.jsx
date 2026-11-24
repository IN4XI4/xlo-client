import { badgeTypeToComponentMap, LEVEL_COLORS, levelOrder } from '../../../globals';
import { capitalize } from './summarizeBadges';

const LOCKED_COLORS = ['#A7A7A7', '#DCDCDC'];
const LEVELS = Object.keys(levelOrder);

function progressColor(nextLevel, current) {
  if (nextLevel) return LEVEL_COLORS[nextLevel.toUpperCase()]?.[0] ?? LOCKED_COLORS[0];
  return current?.colors?.[0] ?? LEVEL_COLORS.MIXELO[0];
}

export function BadgeCard({ badgeType, current, showProgress, progress }) {
  const Medal = badgeTypeToComponentMap[badgeType];
  const [firstColor, secondColor] = current?.colors ?? LOCKED_COLORS;
  const currentRank = current ? levelOrder[current.level] : 0;
  // next_level null means the badge is maxed out: the bar is full.
  const percentage = progress?.next_level ? Math.min(Math.max(progress.percentage ?? 0, 0), 100) : 100;

  return (
    <div className="w-32 flex-shrink-0 md:w-auto bg-[#EEF3F8] rounded-xl p-3 flex flex-col items-center text-center gap-1.5">
      {Medal && (
        <Medal firstColor={firstColor} secondColor={secondColor}
          className={`h-14 w-14 lg:h-[72px] lg:w-[72px] ${current ? '' : 'grayscale opacity-40'}`} />
      )}
      <div className="font-bold text-sm text-gray-900 leading-tight">{capitalize(badgeType)}</div>
      <div className="text-xs font-semibold text-gray-600">{current ? capitalize(current.level) : 'Not earned yet'}</div>
      <div className="flex gap-1 mt-0.5">
        {LEVELS.map((level) => (
          <div key={level} className={`h-1.5 w-[18px] rounded-full ${levelOrder[level] <= currentRank ? '' : 'bg-gray-200'}`}
            style={levelOrder[level] <= currentRank ? { backgroundColor: LEVEL_COLORS[level][0] } : undefined} />
        ))}
      </div>
      {showProgress && (
        <div className="w-full h-[5px] mt-1 rounded-full bg-gray-200 overflow-hidden">
          <div className="h-full rounded-full"
            style={{ width: `${percentage}%`, backgroundColor: progressColor(progress?.next_level, current) }} />
        </div>
      )}
    </div>
  );
}
