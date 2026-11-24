import { useEffect, useState } from 'react';

import { getUserCategories } from '../../../api/users.api';
import { formatNumber } from '../formatNumber';
import { CategoriesReadSkeleton } from './CategoriesReadSkeleton';

const FETCH_DELAY_MS = 1000;
const DEFAULT_COLOR = '#3DB1FF';

const barPercent = (value, max) => (max > 0 ? Math.min((value / max) * 100, 100) : 0);

export function CategoriesRead({ userId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      getUserCategories(userId)
        .then((res) => { if (!cancelled) setData(res.data); })
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
        Could not load categories
      </div>
    );
  }
  if (!data) return <CategoriesReadSkeleton />;

  const isEmpty = data.categories.every((category) => category.stories_read === 0);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-[18px]">
      <div className="mb-3.5">
        <div className="font-bold text-[15px] text-gray-900">Stories read by category</div>
        <div className="text-xs text-gray-500">Stories read in each category</div>
      </div>
      {isEmpty && (
        <div className="mb-3 text-[13px] text-gray-400">No stories read yet</div>
      )}
      <div className="flex flex-col gap-3">
        {data.categories.map((category) => (
          <div key={category.id} className="grid grid-cols-[minmax(0,1fr)_44px] gap-x-2.5 gap-y-1 items-center">
            <div className="col-span-2 text-[13px] text-gray-600 truncate">{category.name}</div>
            <div className="h-2.5 rounded-full bg-[#EEF3F8] overflow-hidden">
              <div className="h-full rounded-full"
                style={{ width: `${barPercent(category.stories_read, data.scale_max)}%`, backgroundColor: category.color || DEFAULT_COLOR }} />
            </div>
            <div className="text-right text-sm leading-none font-bold text-gray-900 tabular-nums">{formatNumber(category.stories_read)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
