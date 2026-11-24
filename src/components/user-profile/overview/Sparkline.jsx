import { memo, useMemo } from 'react';

const W = 100;
const H = 36;
const PAD = 3;

// Y axis spans the series min to max, not 0, so recent changes stay visible.
function buildPaths(series) {
  const n = series.length;
  const first = series.findIndex((p) => p.value != null);
  if (first === -1) return null;

  const values = series.slice(first).map((p) => p.value).filter((v) => v != null);
  const min = Math.min(...values);
  const range = Math.max(...values) - min;
  const x = (i) => (n === 1 ? W : (i / (n - 1)) * W);
  const y = (v) => (range === 0 ? H / 2 : PAD + (1 - (v - min) / range) * (H - 2 * PAD));

  let line = '';
  let lastX = 0;
  let lastY = 0;
  for (let i = first; i < n; i++) {
    const v = series[i].value;
    if (v == null) continue;
    lastX = x(i);
    lastY = y(v);
    line += `${line ? 'L' : 'M'}${lastX.toFixed(2)} ${lastY.toFixed(2)}`;
  }
  const area = `${line}L${lastX.toFixed(2)} ${H}L${x(first).toFixed(2)} ${H}Z`;
  return { line, area, end: { left: (lastX / W) * 100, top: (lastY / H) * 100 } };
}

export const Sparkline = memo(function Sparkline({ series }) {
  const paths = useMemo(() => buildPaths(series), [series]);
  if (!paths) return null;

  return (
    <div className="relative w-full h-9">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block w-full h-full overflow-visible" aria-hidden="true">
        <path d={paths.area} fill="#3DB1FF" fillOpacity="0.12" />
        <path d={paths.line} fill="none" stroke="#3DB1FF" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
          vectorEffect="non-scaling-stroke" />
      </svg>
      {/* Outside the SVG so the stretched viewBox doesn't turn it into an ellipse. */}
      <div className="absolute w-2 h-2 -ml-1 -mt-1 rounded-full bg-[#3DB1FF]"
        style={{ left: `${paths.end.left}%`, top: `${paths.end.top}%` }} />
    </div>
  );
});
