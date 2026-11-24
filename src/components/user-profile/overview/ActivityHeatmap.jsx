import { useMemo } from 'react';

import { HoverTooltip } from '../../HoverTooltip';
import { formatNumber } from '../formatNumber';

const LEVEL_CLASSES = ['bg-[#E6EDF4]', 'bg-[#C6E8FF]', 'bg-[#8FD2FF]', 'bg-[#3DB1FF]', 'bg-[#0A74BD]'];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const MONTH_FORMAT = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' });
const DATE_FORMAT = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const MIN_MONTH_GAP = 3;
const DAY_LABEL_WIDTH = 27;
const GAP = 3;
const MAX_CELL = 24;

const toUtcDate = (date) => new Date(`${date}T00:00:00Z`);
const formatPoints = (points) => `${formatNumber(points)} ${points === 1 ? 'point' : 'points'}`;

// Weeks run Sunday to Saturday; the first week is padded so each day lands on its weekday row.
function buildWeeks(days) {
  const padded = [...Array(toUtcDate(days[0].date).getUTCDay()).fill(null), ...days];
  const weeks = [];
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));
  return weeks;
}

// A label goes where a month starts, unless the next month starts too close to fit both.
function buildMonthLabels(weeks) {
  const starts = [];
  weeks.forEach((week, col) => {
    const date = toUtcDate(week.find(Boolean).date);
    if (starts.length === 0 || starts[starts.length - 1].month !== date.getUTCMonth()) {
      starts.push({ col, month: date.getUTCMonth(), label: MONTH_FORMAT.format(date) });
    }
  });
  const labels = {};
  starts.forEach((start, i) => {
    const next = starts[i + 1];
    if (!next || next.col - start.col >= MIN_MONTH_GAP) labels[start.col] = start.label;
  });
  return labels;
}

function ActivityLegend() {
  return (
    <div className="flex items-center justify-end gap-1 text-[11px] text-gray-400">
      Less
      {LEVEL_CLASSES.map((levelClass) => (
        <div key={levelClass} className={`w-[11px] h-[11px] rounded-[3px] ${levelClass}`} />
      ))}
      More
    </div>
  );
}

const WEEK_COLUMN = 'flex-1 min-w-[12px]';

export function ActivityHeatmap({ days }) {
  const { weeks, monthLabels } = useMemo(() => {
    if (!days?.length) return { weeks: [], monthLabels: {} };
    const weeks = buildWeeks(days);
    return { weeks, monthLabels: buildMonthLabels(weeks) };
  }, [days]);

  if (weeks.length === 0) return null;

  // Week columns share the available width, from 12px cells up to MAX_CELL; below that the map scrolls.
  const maxWidth = DAY_LABEL_WIDTH + weeks.length * (MAX_CELL + GAP);

  return (
    <div style={{ maxWidth }}>
      <div className="overflow-x-auto pb-2 [scrollbar-width:thin] [scrollbar-color:#D1D5DB_transparent]
        [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300">
        <div className="flex flex-col gap-1 min-w-max text-[11px] leading-none text-gray-400">
          <div className="flex gap-[3px] h-3">
            <div className="w-[27px] flex-shrink-0" />
            {weeks.map((_, col) => (
              <div key={col} className={`${WEEK_COLUMN} whitespace-nowrap`}>{monthLabels[col]}</div>
            ))}
          </div>
          <div className="flex gap-[3px]">
            <div className="w-[27px] flex-shrink-0 flex flex-col gap-[3px]">
              {DAY_LABELS.map((label, row) => (
                <div key={row} className="flex-1 flex items-center">{label}</div>
              ))}
            </div>
            {weeks.map((week, col) => (
              <div key={col} className={`${WEEK_COLUMN} flex flex-col gap-[3px]`}>
                {week.map((day, row) => (day ? (
                  <HoverTooltip key={day.date}
                    content={<><span className="font-semibold text-gray-700">{formatPoints(day.points)}</span> · {DATE_FORMAT.format(toUtcDate(day.date))}</>}>
                    <div className={`w-full aspect-square rounded-[3px] ${LEVEL_CLASSES[day.level] ?? LEVEL_CLASSES[0]}`} />
                  </HoverTooltip>
                ) : (
                  <div key={`pad-${row}`} className="w-full aspect-square" />
                )))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-1">
        <ActivityLegend />
      </div>
    </div>
  );
}
