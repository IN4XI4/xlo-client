import { useEffect, useState } from 'react';

import { getUserActivity } from '../../../api/users.api';
import { formatNumber } from '../formatNumber';
import { ActivityHeatmap } from './ActivityHeatmap';
import { LearningActivitySkeleton } from './LearningActivitySkeleton';

const FETCH_DELAY_MS = 1000;

const formatDays = (n) => `${formatNumber(n)} ${n === 1 ? 'day' : 'days'}`;

export function LearningActivity({ userId }) {
  const [activity, setActivity] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      getUserActivity(userId)
        .then((res) => { if (!cancelled) setActivity(res.data); })
        .catch((err) => { if (!cancelled) setError(err); });
    }, FETCH_DELAY_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [userId]);

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center text-sm text-gray-500">
        Could not load activity
      </div>
    );
  }
  if (!activity) return <LearningActivitySkeleton />;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-[18px] min-w-0">
      <div className="mb-3.5">
        <div className="font-bold text-[15px] text-gray-900">Learning activity</div>
        <div className="text-xs text-gray-500">Daily activity, last 26 weeks</div>
      </div>
      <ActivityHeatmap days={activity.days} />
      <div className="flex flex-wrap gap-x-6 gap-y-3 mt-3 tabular-nums">
        {[
          [formatDays(activity.current_streak), 'Current streak'],
          [formatDays(activity.longest_streak), 'Longest streak'],
          [formatNumber(activity.cards_read), 'Cards read'],
          [formatNumber(activity.stories_viewed), 'Stories viewed'],
        ].map(([value, label]) => (
          <div key={label}>
            <div className="text-lg font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
