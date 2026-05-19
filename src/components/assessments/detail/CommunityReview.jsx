import { FaPlus } from 'react-icons/fa';
import { Tooltip } from 'flowbite-react';

function getDifficultyColor(value) {
  if (value <= 3) return 'text-green-400';
  if (value < 7) return 'text-yellow-400';
  return 'text-red-400';
}

export function CommunityReview({ assessment, canRate, onRateDifficulty }) {
  const pill = "bg-[#E6E2FF] text-[#846EFF] rounded-full px-2 py-0.5 text-sm font-medium w-fit";
  const label = "text-gray-500 text-sm";
  const row = "grid grid-cols-2 gap-2 py-1.5";

  return (
    <div className="mt-4 border-gray-200">
      <div className="font-semibold text-[#3DB1FF] mb-3">Community-based review</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <div>
          <div className={row}>
            <div className="flex items-center gap-2">
              <div className={label}>Difficulty rating</div>
              {canRate && (
                <Tooltip content="Rate difficulty">
                  <button type="button" className="bg-[#1C64F2] p-1 rounded-full text-white flex items-center text-xs" onClick={onRateDifficulty}>
                    <FaPlus />
                  </button>
                </Tooltip>
              )}
            </div>
            <div className={pill}>
              {assessment.user_difficulty_rating != null
                ? <span className=
                  {getDifficultyColor(assessment.user_difficulty_rating)}>
                  {assessment.user_difficulty_rating.toFixed(2)} / 10
                </span>
                : '—'}
            </div>
          </div>
          <div className={row}>
            <div className={label}>Total attempts</div>
            <div className={pill}>{assessment.attempts_count}</div>
          </div>
        </div>
        <div>
          <div className={row}>
            <div className={label}>Average score</div>
            <div className={pill}>
              {assessment.average_score != null ? assessment.average_score.toFixed(2)
                : '—'} / 100</div>
          </div>
        </div>
      </div>
    </div>
  );
}
