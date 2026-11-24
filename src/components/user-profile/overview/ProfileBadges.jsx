import { useEffect, useMemo, useState } from 'react';

import { getUserBadgeInfo, getUserBadges, updateUserBadges } from '../../../api/users.api';
import { BadgeCard } from './BadgeCard';
import { ProfileBadgesSkeleton } from './ProfileBadgesSkeleton';
import { BADGE_ORDER, capitalize, summarizeBadges, TOTAL_LEVELS } from './summarizeBadges';

const FETCH_DELAY_MS = 1000;

// Awards newly reached levels before reading them.
async function loadOwnerBadges(userId) {
  try {
    const res = await updateUserBadges();
    const newBadges = res.data?.badges;
    if (newBadges?.length > 0) {
      window.dispatchEvent(new CustomEvent('newBadgesEarned', { detail: newBadges }));
    }
  } catch (err) {
    console.error('Failed to update badges:', err);
  }
  const [badgesRes, infoRes] = await Promise.all([getUserBadges(userId), getUserBadgeInfo()]);
  return { badges: badgesRes.data, nextLevels: infoRes.data.next_badge_levels };
}

async function loadVisitorBadges(userId) {
  const res = await getUserBadges(userId);
  return { badges: res.data, nextLevels: null };
}

export function ProfileBadges({ userId, isOwner }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);
    const timer = setTimeout(() => {
      (isOwner ? loadOwnerBadges(userId) : loadVisitorBadges(userId))
        .then((result) => { if (!cancelled) setData(result); })
        .catch((err) => { if (!cancelled) setError(err); });
    }, FETCH_DELAY_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [userId, isOwner]);

  const summary = useMemo(() => data && summarizeBadges(data.badges), [data]);

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center text-sm text-gray-500">
        Could not load badges
      </div>
    );
  }
  if (!summary) return <ProfileBadgesSkeleton withProgress={isOwner} />;

  const { current, earnedCount, lastEarned } = summary;
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-[18px] 2xl:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3.5">
        <div>
          <div className="font-bold text-[15px] text-gray-900">Badges</div>
          <div className="text-xs text-gray-500">Each badge has five levels, from Bronze to Mixelo</div>
        </div>
        <div className="flex flex-wrap gap-x-[18px] gap-y-1 text-xs text-gray-500 tabular-nums">
          <div><span className="font-bold text-gray-900">{earnedCount}</span> of {TOTAL_LEVELS} levels</div>
          {lastEarned && (
            <div>
              Last earned <span className="font-bold text-gray-900">
                {capitalize(lastEarned.badgeType)} {capitalize(lastEarned.level)}
              </span> · {lastEarned.date}
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin] [scrollbar-color:#D1D5DB_transparent]
        [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300
        md:grid md:grid-cols-5 md:gap-3 md:pb-0 2xl:gap-5">
        {BADGE_ORDER.map((badgeType) => (
          <BadgeCard key={badgeType} badgeType={badgeType} current={current[badgeType]}
            showProgress={isOwner} progress={data.nextLevels?.[badgeType]} />
        ))}
      </div>
    </div>
  );
}
