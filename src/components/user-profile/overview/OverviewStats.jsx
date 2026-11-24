import { useEffect, useState } from 'react';

import { getProfileStats } from '../../../api/users.api';
import { formatNumber } from '../formatNumber';
import { Sparkline } from './Sparkline';
import { StatCard } from './StatCard';
import { StatCardSkeleton } from './StatCardSkeleton';

const CARD_COUNT = 4;
const MIN_ATTEMPTS_FOR_TREND = 3;

function counterCard(key, label, stat, days, { noun, emptyMessage }) {
  if (stat.total === 0) {
    return { key, label, value: '0', message: emptyMessage };
  }
  const detail = stat.in_period > 0
    ? <><span className="text-[#1D8F4E] font-semibold">+{formatNumber(stat.in_period)}</span> in the last {days} days</>
    : `No new ${noun} in the last ${days} days`;
  return { key, label, value: formatNumber(stat.total), detail, children: <Sparkline series={stat.series} /> };
}

function passRateCard(passRate) {
  const label = 'Assessment pass rate';
  if (passRate.value == null) {
    return { key: 'pass_rate', label, value: '—', message: "You haven't taken any assessments yet" };
  }
  const detail = `${formatNumber(passRate.passed)} passed of ${formatNumber(passRate.attempts)} ${passRate.attempts === 1 ? 'attempt' : 'attempts'}`;
  const message = passRate.attempts < MIN_ATTEMPTS_FOR_TREND ? 'Take a few more assessments to see your trend' : null;
  return {
    key: 'pass_rate', label, value: `${Math.round(passRate.value)}%`, detail, message,
    children: <Sparkline series={passRate.series} />,
  };
}

const CARD_INFO = {
  points: "Total points you've earned on Mixelo.",
  stories_viewed: "Different stories you've viewed. Opening the same story again doesn't count.",
  likes_received: 'Likes other users gave your stories and comments.',
  pass_rate: 'Share of your assessment attempts you passed.',
};

function buildCards(stats) {
  const cards = [
    counterCard('points', 'Points', stats.points, stats.days,
      { noun: 'points', emptyMessage: "You haven't earned any points yet" }),
    counterCard('stories_viewed', 'Stories viewed', stats.stories_viewed, stats.days,
      { noun: 'stories viewed', emptyMessage: "You haven't viewed any stories yet" }),
    counterCard('likes_received', 'Likes received', stats.likes_received, stats.days,
      { noun: 'likes', emptyMessage: "You haven't received any likes yet" }),
    passRateCard(stats.pass_rate),
  ];
  return cards.map((card) => ({ ...card, info: CARD_INFO[card.key] }));
}

const FETCH_DELAY_MS = 500;

export function OverviewStats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      getProfileStats()
        .then((res) => { if (!cancelled) setStats(res.data); })
        .catch((err) => { if (!cancelled) setError(err); });
    }, FETCH_DELAY_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center text-sm text-gray-500">
        Could not load your stats
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
      {stats
        ? buildCards(stats).map(({ key, ...card }) => <StatCard key={key} {...card} />)
        : Array.from({ length: CARD_COUNT }).map((_, i) => <StatCardSkeleton key={i} />)}
    </div>
  );
}
