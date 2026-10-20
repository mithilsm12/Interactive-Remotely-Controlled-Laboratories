import React from "react";
import { useLang } from "../i18n.jsx";

// Least-squares straight line
export function linFit(pts, throughOrigin = false) {
  const n = pts.length;
  if (n < 2) return null;
  if (throughOrigin) {
    const sxy = pts.reduce((s, p) => s + p[0] * p[1], 0);
    const sxx = pts.reduce((s, p) => s + p[0] * p[0], 0);
    return sxx ? { m: sxy / sxx, c: 0 } : null;
  }
  const sx = pts.reduce((s, p) => s + p[0], 0), sy = pts.reduce((s, p) => s + p[1], 0);
  const sxx = pts.reduce((s, p) => s + p[0] * p[0], 0), sxy = pts.reduce((s, p) => s + p[0] * p[1], 0);
  const d = n * sxx - sx * sx;
  if (!d) return null;
  const m = (n * sxy - sx * sy) / d;
  return { m, c: (sy - m * sx) / n };
}

function niceTicks(min, max, count = 5) {
  if (min === max) { min -= 1; max += 1; }
  const span = max - min;
  const step0 = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(step0)));
  const step = [1, 2, 2.5, 5, 10].map((k) => k * mag).find((s) => span / s <= count) || 10 * mag;
  const lo = Math.floor(min / step) * step, hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(+v.toFixed(10));
  return { lo, hi, ticks };
}
const fmt = (v) => (Math.abs(v) >= 1000 || (Math.abs(v) < 0.01 && v !== 0) ? v.toExponential(1) : +v.toFixed(3));

export default function Graph({ rows, graph, columns }) {
  const { t } = useLang();
  const xc = columns.find((c) => c.k === graph.x), yc = columns.find((c) => c.k === graph.y);
  const pts = rows.map((r) => [Number(r[graph.x]), Number(r[graph.y])]).filter((p) => isFinite(p[0]) && isFinite(p[1]));
  if (pts.length < 2) return <div className="h-64 grid place-items-center text-slate-400 text-sm text-center px-6 border-2 border-dashed rounded-2xl">{t("needTwo")}</div>;

  const W = 560, H = 340, L = 64, R = 20, T = 20, B = 52;
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const zero = graph.fromZero !== false;
  const X = niceTicks(zero ? Math.min(0, ...xs) : Math.min(...xs), Math.max(...xs));
  const Y = niceTicks(zero ? Math.min(0, ...ys) : Math.min(...ys), Math.max(...ys));
  const sx = (v) => L + ((v - X.lo) / (X.hi - X.lo)) * (W - L - R);
  const sy = (v) => H - B - ((v - Y.lo) / (Y.hi - Y.lo)) * (H - T - B);
  const fit = graph.fit === "linear" || graph.fit === "origin" ? linFit(pts, graph.fit === "origin") : null;
  const sorted = [...pts].sort((a, b) => a[0] - b[0]);

  // smooth curve through sorted points (Catmull-Rom → Bezier)
  const curve = () => {
    const P = sorted.map(([x, y]) => [sx(x), sy(y)]);
    let d = `M${P[0][0]},${P[0][1]}`;
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2;
      d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
    }
    return d;
  };
  const lab = (c) => `${t(c.l)}${c.u ? ` (${c.u})` : ""}`;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto bg-white rounded-2xl border border-slate-200">
        {X.ticks.map((v) => (
          <g key={"x" + v}>
            <line x1={sx(v)} x2={sx(v)} y1={T} y2={H - B} stroke="#eef2f7" />
            <text x={sx(v)} y={H - B + 16} fontSize="11" textAnchor="middle" fill="#64748b">{fmt(v)}</text>
          </g>
        ))}
        {Y.ticks.map((v) => (
          <g key={"y" + v}>
            <line x1={L} x2={W - R} y1={sy(v)} y2={sy(v)} stroke="#eef2f7" />
            <text x={L - 8} y={sy(v) + 4} fontSize="11" textAnchor="end" fill="#64748b">{fmt(v)}</text>
          </g>
        ))}
        <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke="#94a3b8" />
        <line x1={L} x2={L} y1={T} y2={H - B} stroke="#94a3b8" />
        <text x={(L + W - R) / 2} y={H - 10} fontSize="12" textAnchor="middle" fill="#334155" fontWeight="600">{lab(xc)}</text>
        <text transform={`translate(16 ${(T + H - B) / 2}) rotate(-90)`} fontSize="12" textAnchor="middle" fill="#334155" fontWeight="600">{lab(yc)}</text>
        {fit && (
          <line x1={sx(X.lo)} y1={sy(fit.m * X.lo + fit.c)} x2={sx(X.hi)} y2={sy(fit.m * X.hi + fit.c)}
            stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 4" clipPath="url(#clip)" />
        )}
        {graph.fit === "curve" && <path d={curve()} fill="none" stroke="#6366f1" strokeWidth="2.5" />}
        <clipPath id="clip"><rect x={L} y={T} width={W - L - R} height={H - T - B} /></clipPath>
        {pts.map(([x, y], i) => (
          <circle key={i} cx={sx(x)} cy={sy(y)} r="5" fill="#4f46e5" stroke="white" strokeWidth="2"><title>{`(${fmt(x)}, ${fmt(y)})`}</title></circle>
        ))}
      </svg>
      {fit && (
        <p className="mt-2 text-sm text-slate-600">
          {t("slope")}: <b className="text-amber-600">{fmt(fit.m)}</b>
          {graph.slopeMeans && <> — {t(graph.slopeMeans)}</>}
        </p>
      )}
      {graph.note && <p className="mt-1 text-sm text-slate-500">{t(graph.note)}</p>}
    </div>
  );
}
