/**
 * Charts drawn as PLAIN SVG.
 *
 * No chart library is installed in this project (package.json has no recharts /
 * chart.js), and the ground rules allow either "the library already in
 * package.json, otherwise plain SVG". So: plain SVG, on the existing palette.
 */
import React from "react";

/** A single-series line chart with a soft area fill. */
export function LineChart({ points = [], color = "#16a34a", height = 120, unit = "", emptyLabel = "No data yet" }) {
  const values = points.map((p) => Number(p.value)).filter((v) => Number.isFinite(v));
  if (values.length < 2) {
    return (
      <div className="h-[120px] flex items-center justify-center text-[11px] font-sans text-slate-400 border border-dashed border-slate-200 rounded-xl">
        {emptyLabel}
      </div>
    );
  }

  const width = 320;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stepX = width / (values.length - 1);
  const pad = 8;

  const coords = values.map((value, index) => {
    const x = index * stepX;
    const y = height - pad - ((value - min) / span) * (height - pad * 2);
    return { x, y, value, label: points[index] && points[index].label };
  });

  const line = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;

  return (
    <div className="space-y-1">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }} role="img" aria-label="Trend chart">
        <path d={area} fill={color} opacity="0.10" />
        <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {coords.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r="2.5" fill="#fff" stroke={color} strokeWidth="1.5" />
        ))}
      </svg>
      <div className="flex justify-between text-[9px] font-sans text-slate-400">
        <span>{(points[0] && points[0].label) || ""}</span>
        <span>
          {min}
          {unit} – {max}
          {unit}
        </span>
        <span>{(points[points.length - 1] && points[points.length - 1].label) || ""}</span>
      </div>
    </div>
  );
}

/** Compact vertical bars, used for daily adherence / steps / sleep. */
export function BarChart({ bars = [], color = "#16a34a", height = 110, unit = "", emptyLabel = "No data yet" }) {
  const values = bars.map((b) => Number(b.value)).filter((v) => Number.isFinite(v));
  if (!values.length) {
    return (
      <div className="h-[110px] flex items-center justify-center text-[11px] font-sans text-slate-400 border border-dashed border-slate-200 rounded-xl">
        {emptyLabel}
      </div>
    );
  }
  const max = Math.max(...values, 1);

  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {bars.map((bar, index) => {
        const value = Number(bar.value) || 0;
        const pct = Math.max((value / max) * 100, value > 0 ? 4 : 0);
        return (
          <div key={index} className="flex-1 flex flex-col items-center justify-end h-full gap-1 min-w-0">
            <span className="text-[8px] font-mono text-slate-500 leading-none">{value > 0 ? value : ""}</span>
            <div
              className="w-full rounded-t-md"
              style={{ height: `${pct}%`, backgroundColor: color, opacity: 0.85 }}
              title={`${bar.label || ""}: ${value}${unit}`}
            />
            <span className="text-[8px] font-sans text-slate-400 truncate w-full text-center">{bar.label || ""}</span>
          </div>
        );
      })}
    </div>
  );
}

/** Small progress bar used by vouchers / challenges. */
export function ProgressBar({ value = 0, max = 100, color = "#16a34a" }) {
  const pct = Math.min(Math.max(max > 0 ? (Number(value) / Number(max)) * 100 : 0, 0), 100);
  return (
    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}
