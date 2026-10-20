export const L = (en, kn) => ({ en, kn: kn || en });
export const mean = (a) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0);
export const q = (q, o, a, e) => ({ q, o, a, e });
export const sel = (k, l, options, v) => ({ k, l, type: "select", options, v });
export const opt = (v, en, kn) => ({ v, l: L(en, kn) });
export const sl = (k, l, min, max, step, v, u = "") => ({ k, l, min, max, step, v, u });
export const col = (k, l, u = "", d = 2) => ({ k, l, u, d });
export const deg = Math.PI / 180;
export const fx = (v, d = 2) => (isFinite(v) ? v.toFixed(d) : "—");
export const nature = (pH) => (pH < 6.5 ? L("Acidic", "ಆಮ್ಲೀಯ") : pH > 7.5 ? L("Basic", "ಪ್ರತ್ಯಾಮ್ಲೀಯ") : L("Neutral", "ತಟಸ್ಥ"));
export const noChange = { obs: L("No visible change", "ಯಾವುದೇ ಗೋಚರ ಬದಲಾವಣೆ ಇಲ್ಲ"), inf: L("No reaction", "ಯಾವುದೇ ಕ್ರಿಯೆ ಇಲ್ಲ") };
// common columns for bench (test-tube) experiments
export const benchCols = [
  col("sampleName", L("Sample", "ಮಾದರಿ")), col("reagentName", L("Test / reagent", "ಪರೀಕ್ಷೆ / ಕಾರಕ")),
  col("obs", L("Observation", "ಅವಲೋಕನ")), col("inf", L("Inference", "ತೀರ್ಮಾನ")),
];
export const benchControls = (samples, reagents) => [
  sel("sample", L("Sample", "ಮಾದರಿ"), samples.map((s) => ({ v: s.k, l: s.l })), samples[0].k),
  sel("reagent", L("Add / test with", "ಸೇರಿಸಿ / ಪರೀಕ್ಷಿಸಿ"), reagents.map((s) => ({ v: s.k, l: s.l })), reagents[0].k),
];
export const focusControls = [
  sel("mag", L("Objective lens", "ವಸ್ತು ಮಸೂರ"), [opt(10, "10×", "10×"), opt(40, "40×", "40×")], 10),
  sl("focus", L("Fine focus knob", "ಸೂಕ್ಷ್ಮ ಕೇಂದ್ರೀಕರಣ ಗುಂಡಿ"), 0, 100, 1, 20),
];
// Lens / mirror formula helpers (real-is-positive, magnitudes)
export function uv(u, f, s) {
  const real = u > f;
  const vTrue = real ? (u * f) / (u - f) : Infinity;
  const vVirt = real ? null : (u * f) / (f - u);
  const sharp = real ? Math.max(0, 1 - Math.abs(s - vTrue) / (0.06 * vTrue + 1)) : 0;
  return { vTrue, vVirt, sharp, sharpPct: sharp * 100, v: s, f: (u * s) / (u + s), invU: 100 / u, invV: 100 / s };
}
export function prism(i, n, A = 60) {
  const r1 = Math.asin(Math.sin(i * deg) / n) / deg, r2 = A - r1;
  const sinE = n * Math.sin(r2 * deg);
  if (sinE > 1) return { r1, r2, tir: true, e: NaN, dev: NaN };
  const e = Math.asin(sinE) / deg;
  return { r1, r2, e, dev: i + e - A, tir: false };
}
