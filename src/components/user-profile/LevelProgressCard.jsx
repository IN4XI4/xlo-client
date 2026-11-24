import { formatNumber } from './formatNumber';

// Current level and progress towards the next one (logged-in viewers only).
export function LevelProgressCard({ levelProgress }) {
  const { level_name, points, next_level_name, next_level_points } = levelProgress;
  const isMaxLevel = !next_level_name || !next_level_points;
  const percentage = isMaxLevel ? 100 : Math.min(100, Math.round((points / next_level_points) * 100));

  return (
    <div className="rounded-xl border border-gray-200 bg-[#EEF3F8] px-3.5 py-3">
      <div className="flex items-baseline justify-between gap-2">
        <div className="min-w-0">
          <div className="text-xs text-gray-500">Current level</div>
          <div className="font-bold text-gray-900 truncate">{level_name}</div>
        </div>
        <div className="flex-shrink-0 text-xs text-gray-500 tabular-nums">
          {isMaxLevel ? `${formatNumber(points)} pts` : `${formatNumber(points)} / ${formatNumber(next_level_points)} pts`}
        </div>
      </div>
      <div className="mt-2 h-2 rounded-full bg-gray-200 overflow-hidden">
        {/* Dynamic width can't be expressed with Tailwind classes */}
        <div className="h-full rounded-full bg-[#3DB1FF]" style={{ width: `${percentage}%` }} />
      </div>
      <div className="mt-1.5 text-xs text-gray-500">
        {isMaxLevel
          ? 'Highest level reached'
          : `${formatNumber(next_level_points - points)} points to ${next_level_name}`}
      </div>
    </div>
  );
}
