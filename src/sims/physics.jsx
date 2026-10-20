import React, { useEffect, useRef } from "react";
import { SimCanvas, clamp, rr, text, line, arrow, circle, meter, Panel } from "./util.jsx";

const W = 640, H = 400;
const deg = Math.PI / 180;

/* ------------------------------------------------------------------ CIRCUIT */
function zigzag(ctx, x1, x2, y, color = "#b45309") {
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x1, y);
  const n = 8, step = (x2 - x1) / n;
  for (let i = 0; i < n; i++) ctx.lineTo(x1 + step * (i + 0.5), y + (i % 2 ? 9 : -9));
  ctx.lineTo(x2, y); ctx.stroke(); ctx.restore();
}
export function Circuit({ exp, p, r }) {
  const o = exp.opts || {};
  const L = 80, R = 560, T = 160, B = 330;
  const draw = (ctx, time) => {
    const I = r.I || 0, Imax = o.iMax || 1;
    // wires
    ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(R, T); ctx.lineTo(R, B); ctx.lineTo(L, B); ctx.closePath(); ctx.stroke();
    // flowing charges (conventional current direction shown with arrows)
    const per = 2 * (R - L) + 2 * (B - T);
    const speed = (clamp(Math.abs(I) / Imax, 0, 1.2)) * 140;
    const n = 26;
    for (let i = 0; i < n; i++) {
      let s = ((i / n) * per + time * speed) % per;
      let px, py;
      if (s < R - L) { px = L + s; py = T; } else if ((s -= R - L) < B - T) { px = R; py = T + s; }
      else if ((s -= B - T) < R - L) { px = R - s; py = B; } else { s -= R - L; px = L; py = B - s; }
      if (speed > 1) circle(ctx, px, py, 3.2, "#facc15", "#a16207", 1);
    }
    // component on top wire
    ctx.fillStyle = "#f8fafc"; ctx.fillRect(240, T - 30, 160, 60);
    line(ctx, 240, T, 255, T, "#1e293b", 3); line(ctx, 385, T, 400, T, "#1e293b", 3);
    const comp = o.comp === "seriesParallel" ? p.mode : o.comp;
    if (comp === "resistor" || comp === "wire") {
      zigzag(ctx, 255, 385, T, comp === "wire" ? "#64748b" : "#b45309");
      text(ctx, comp === "wire" ? `${o.wireLabel || "wire"}` : `R = ${p.R ?? o.R} Ω`, 320, T + 26, { size: 12 });
    } else if (comp === "series") {
      zigzag(ctx, 255, 312, T); line(ctx, 312, T, 328, T, "#1e293b", 3); zigzag(ctx, 328, 385, T, "#7c3aed");
      text(ctx, `R₁=${p.R1}Ω`, 284, T + 24, { size: 11 }); text(ctx, `R₂=${p.R2}Ω`, 356, T + 24, { size: 11 });
    } else if (comp === "parallel") {
      line(ctx, 255, T, 265, T, "#1e293b", 3); line(ctx, 375, T, 385, T, "#1e293b", 3);
      line(ctx, 265, T - 18, 265, T + 18, "#1e293b", 3); line(ctx, 375, T - 18, 375, T + 18, "#1e293b", 3);
      zigzag(ctx, 265, 375, T - 18); zigzag(ctx, 265, 375, T + 18, "#7c3aed");
      text(ctx, `R₁=${p.R1}Ω`, 320, T - 38, { size: 11 }); text(ctx, `R₂=${p.R2}Ω`, 320, T + 40, { size: 11 });
    } else if (comp === "diode") {
      const fwd = p.bias !== "reverse";
      line(ctx, 255, T, 385, T, "#1e293b", 3);
      ctx.fillStyle = "#0f172a"; ctx.beginPath();
      if (fwd) { ctx.moveTo(300, T - 16); ctx.lineTo(300, T + 16); ctx.lineTo(332, T); }
      else { ctx.moveTo(340, T - 16); ctx.lineTo(340, T + 16); ctx.lineTo(308, T); }
      ctx.fill(); line(ctx, fwd ? 334 : 306, T - 16, fwd ? 334 : 306, T + 16, "#0f172a", 4);
      text(ctx, fwd ? "p → n (forward)" : "reverse bias", 320, T + 28, { size: 11 });
      if (fwd && I > (o.iMax || 1) * 0.05) circle(ctx, 318, T, 26, `rgba(250,204,21,${clamp(I / (o.iMax || 1), 0, 0.5)})`);
    }
    // voltmeter in parallel
    line(ctx, 250, T, 250, 62, "#334155", 2); line(ctx, 250, 62, 286, 62, "#334155", 2);
    line(ctx, 390, T, 390, 62, "#334155", 2); line(ctx, 354, 62, 390, 62, "#334155", 2);
    meter(ctx, 320, 62, 34, r.V || 0, o.vMax || 10, "V", `${(r.V || 0).toFixed(o.vDec ?? 2)} V`, "#059669");
    // ammeter in series
    meter(ctx, R, 245, 34, Math.abs(I), Imax, "A", `${Math.abs(I).toFixed(o.iDec ?? 2)} ${o.iUnit || "A"}`, "#dc2626");
    // battery
    ctx.fillStyle = "#f8fafc"; ctx.fillRect(L - 26, 225, 52, 40);
    for (let k = 0; k < 2; k++) { line(ctx, L - 22, 232 + k * 16, L + 22, 232 + k * 16, "#0f172a", 3); line(ctx, L - 11, 240 + k * 16, L + 11, 240 + k * 16, "#0f172a", 5); }
    text(ctx, "Battery", L - 38, 245, { size: 11, align: "right" });
    // rheostat
    ctx.fillStyle = "#f8fafc"; ctx.fillRect(240, B - 14, 160, 28);
    rr(ctx, 245, B - 10, 150, 20, 5); ctx.fillStyle = "#e2e8f0"; ctx.fill(); ctx.strokeStyle = "#475569"; ctx.lineWidth = 2; ctx.stroke();
    for (let k = 0; k < 24; k++) line(ctx, 250 + k * 6, B - 10, 253 + k * 6, B + 10, "#a16207", 1.5);
    const sx = 250 + 140 * clamp((p[o.rheoKey || "V"] - (o.rheoMin || 0)) / ((o.rheoMax || o.vMax || 10) - (o.rheoMin || 0)), 0, 1);
    rr(ctx, sx - 6, B - 24, 12, 14, 3); ctx.fillStyle = "#4f46e5"; ctx.fill();
    text(ctx, "Rheostat", 320, B + 26, { size: 11 });
    // key
    circle(ctx, 150, B, 5, "#0f172a"); circle(ctx, 180, B, 5, "#0f172a"); line(ctx, 150, B, 182, B - 2, "#0f172a", 3);
    text(ctx, "Key (K)", 165, B + 22, { size: 11 });
    // current direction arrow
    arrow(ctx, 160, T, 200, T, "#dc2626", 2); text(ctx, "I", 180, T - 12, { size: 12, color: "#dc2626" });
  };
  return <SimCanvas draw={draw} w={W} h={H} />;
}

/* ------------------------------------------------------------- METER BRIDGE */
export function Bridge({ exp, p, setP, r }) {
  const o = exp.opts || {};
  const X0 = 70, X1 = 570, WY = 290, len = o.length || 100;
  const toX = (l) => X0 + (l / len) * (X1 - X0);
  const drag = useRef(false);
  const onPointer = (type, pt) => {
    if (type === "down" && Math.abs(pt.y - WY) < 60) drag.current = true;
    if (type === "up") drag.current = false;
    if (drag.current && (type === "down" || type === "move")) {
      const l = clamp(((pt.x - X0) / (X1 - X0)) * len, 1, len - 1);
      setP("l", Math.round(l * 10) / 10);
    }
  };
  const draw = (ctx) => {
    // board
    rr(ctx, 40, 110, 560, 230, 14); ctx.fillStyle = "#fef3c7"; ctx.fill(); ctx.strokeStyle = "#d97706"; ctx.lineWidth = 2; ctx.stroke();
    // scale
    for (let c = 0; c <= len; c += len / 100) {
      const big = Math.round(c) % (len / 10) === 0;
      line(ctx, toX(c), WY + 12, toX(c), WY + (big ? 26 : 18), "#92400e", big ? 1.5 : 0.7);
      if (big) text(ctx, `${Math.round(c)}`, toX(c), WY + 36, { size: 10, color: "#92400e" });
    }
    // wire
    line(ctx, X0, WY, X1, WY, "#b45309", 4);
    if (o.mode === "potentiometer") {
      // driver cell across wire
      line(ctx, X0, WY, X0, 140, "#1e293b", 3); line(ctx, X1, WY, X1, 140, "#1e293b", 3);
      line(ctx, X0, 140, 300, 140, "#1e293b", 3); line(ctx, 340, 140, X1, 140, "#1e293b", 3);
      line(ctx, 305, 128, 305, 152, "#0f172a", 3); line(ctx, 318, 133, 318, 147, "#0f172a", 5);
      line(ctx, 325, 128, 325, 152, "#0f172a", 3); line(ctx, 338, 133, 338, 147, "#0f172a", 5);
      text(ctx, "Driver cell (2 V)", 320, 118, { size: 11 });
      // test cell + galvanometer to jockey
      line(ctx, X0, WY, X0, 215, "#1e293b", 2); line(ctx, X0, 215, 150, 215, "#1e293b", 2);
      line(ctx, 155, 203, 155, 227, "#0f172a", 3); line(ctx, 166, 208, 166, 222, "#0f172a", 5);
      text(ctx, p.cell === "E2" ? (o.cellNames?.[1] || "E₂") : (o.cellNames?.[0] || "E₁"), 160, 195, { size: 11, color: "#7c3aed" });
      line(ctx, 170, 215, 260, 215, "#1e293b", 2);
      meter(ctx, 290, 215, 28, r.defl || 0, 1, "G", null, "#0f172a");
      line(ctx, 318, 215, toX(p.l), 215, "#1e293b", 2); line(ctx, toX(p.l), 215, toX(p.l), WY - 14, "#1e293b", 2);
    } else {
      // copper strips and gaps
      ctx.fillStyle = "#b45309";
      ctx.fillRect(X0 - 6, 150, 8, WY - 150); ctx.fillRect(X1 - 2, 150, 8, WY - 150);
      ctx.fillRect(X0 - 6, 150, 110, 8); ctx.fillRect(X1 - 104, 150, 110, 8); ctx.fillRect(250, 150, 140, 8);
      // R box (left gap)
      rr(ctx, 175, 135, 70, 36, 6); ctx.fillStyle = "#1e293b"; ctx.fill(); text(ctx, `R=${p.R}Ω`, 210, 153, { size: 12, color: "#fff" });
      // X (right gap) coil
      for (let k = 0; k < 7; k++) circle(ctx, 405 + k * 9, 154, 7, null, "#7c3aed", 2);
      text(ctx, "X = ?", 432, 130, { size: 12, color: "#7c3aed" });
      // galvanometer from centre strip to jockey
      line(ctx, 320, 158, 320, 190, "#1e293b", 2);
      meter(ctx, 320, 215, 26, r.defl || 0, 1, "G", null, "#0f172a");
      line(ctx, 320, 241, toX(p.l), WY - 14, "#1e293b", 2);
      text(ctx, "Battery + Key", 320, 360, { size: 11 });
      line(ctx, X0, WY, X0, 350, "#1e293b", 2); line(ctx, X0, 350, 280, 350, "#1e293b", 2); line(ctx, 360, 350, X1, 350, "#1e293b", 2); line(ctx, X1, 350, X1, WY, "#1e293b", 2);
    }
    // jockey
    const jx = toX(p.l);
    ctx.fillStyle = "#4f46e5"; ctx.beginPath(); ctx.moveTo(jx, WY - 2); ctx.lineTo(jx - 9, WY - 22); ctx.lineTo(jx + 9, WY - 22); ctx.fill();
    rr(ctx, jx - 6, WY - 40, 12, 20, 3); ctx.fill();
    text(ctx, `l = ${p.l.toFixed(1)} cm`, jx, WY - 52, { size: 12, color: "#4f46e5", weight: 800 });
    const bal = Math.abs(r.defl || 0) < 0.03;
    text(ctx, bal ? "✓ Null point — no deflection" : (r.defl > 0 ? "Galvanometer deflects → move jockey left" : "Galvanometer deflects → move jockey right"),
      320, 30, { size: 14, color: bal ? "#059669" : "#dc2626", weight: 700 });
    text(ctx, "Drag the jockey along the wire", 320, 56, { size: 11, color: "#64748b", weight: 500 });
  };
  return <SimCanvas draw={draw} w={W} h={380} onPointer={onPointer} cursor="ew-resize" />;
}

/* ---------------------------------------------------- OPTICAL BENCH (u-v) */
function arrowObj(ctx, x, axis, h, color, alpha = 1, dashed) {
  ctx.save(); ctx.globalAlpha = alpha;
  if (dashed) ctx.setLineDash([5, 4]);
  arrow(ctx, x, axis, x, axis - h, color, 3); ctx.restore();
}
export function Optics({ exp, p, r }) {
  const o = exp.opts || {};
  const mirror = o.kind === "concave";
  const axis = 220;
  const f = p.f ?? o.f;
  const sc = mirror ? 6 : 4.2;
  const EX = mirror ? 600 : 250;           // element x
  const objX = mirror ? EX - p.u * sc : EX - p.u * sc;
  const scrX = mirror ? EX - p.s * sc : EX + p.s * sc;
  const v = r.vTrue;
  const imgX = mirror ? EX - v * sc : EX + v * sc;
  const hObj = 40;
  const hImg = v > 0 && isFinite(v) ? clamp((v / p.u) * hObj, 0, 160) : 0;
  const draw = (ctx) => {
    // bench
    rr(ctx, 10, 330, 620, 18, 6); ctx.fillStyle = "#cbd5e1"; ctx.fill();
    for (let c = 0; c <= 100; c += 5) {
      const x = mirror ? EX - c * sc : EX - 60 * sc + c * sc;
      if (x < 12 || x > 628) continue;
      line(ctx, x, 330, x, c % 10 ? 336 : 342, "#475569", 1);
    }
    line(ctx, 10, axis, 630, axis, "#94a3b8", 1, [6, 5]);
    // element
    if (mirror) {
      ctx.save(); ctx.strokeStyle = "#0ea5e9"; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(EX + 180, axis, 180, Math.PI * 0.8, Math.PI * 1.2); ctx.stroke(); ctx.restore();
      text(ctx, "Concave mirror", EX - 10, 70, { size: 12, align: "right" });
    } else {
      ctx.save(); ctx.fillStyle = "rgba(14,165,233,0.25)"; ctx.strokeStyle = "#0284c7"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(EX, axis, 14, 95, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
      text(ctx, "Convex lens", EX, 108, { size: 12 });
    }
    // focal points
    const F1 = mirror ? EX - f * sc : EX + f * sc;
    circle(ctx, F1, axis, 4, "#f59e0b"); text(ctx, "F", F1, axis + 16, { size: 12, color: "#b45309" });
    if (mirror) { const C = EX - 2 * f * sc; circle(ctx, C, axis, 4, "#f59e0b"); text(ctx, "C", C, axis + 16, { size: 12, color: "#b45309" }); }
    else { const F2 = EX - f * sc; circle(ctx, F2, axis, 4, "#f59e0b"); text(ctx, "F", F2, axis + 16, { size: 12, color: "#b45309" });
      const C2 = EX - 2 * f * sc; if (C2 > 10) { circle(ctx, C2, axis, 3, "#fbbf24"); text(ctx, "2F", C2, axis + 16, { size: 11, color: "#b45309" }); } }
    // object (candle / needle)
    arrowObj(ctx, objX, axis, hObj, "#16a34a");
    circle(ctx, objX, axis - hObj - 8, 5, "#f97316"); text(ctx, "Object", objX, axis + 32, { size: 11, color: "#16a34a" });
    // rays from object top
    const top = [objX, axis - hObj];
    ctx.save(); ctx.globalAlpha = 0.9;
    const ray = (pts, color, dash) => { ctx.strokeStyle = color; ctx.lineWidth = 1.8; ctx.setLineDash(dash || []); ctx.beginPath(); ctx.moveTo(...pts[0]); pts.slice(1).forEach((q) => ctx.lineTo(...q)); ctx.stroke(); };
    const real = v > 0 && isFinite(v);
    const ext = (a, b, len) => { const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy); return [b[0] + (dx / d) * len, b[1] + (dy / d) * len]; };
    // ray 1: parallel then through focus
    const hit1 = [EX, axis - hObj];
    const thruF = [F1, axis];
    if (real) {
      ray([top, hit1, [imgX, axis + hImg]], "#ef4444");
      ray([top, mirror ? [EX, axis] : [EX, axis], [imgX, axis + hImg]], "#3b82f6");
    } else {
      const e1 = ext(hit1, thruF, 220); ray([top, hit1, e1], "#ef4444");
      const e2 = ext(top, [EX, axis], 220);
      ray([top, [EX, axis], mirror ? [EX - (e2[0] - EX), e2[1]] : e2], "#3b82f6");
      // virtual image
      const vi = r.vVirt;
      if (vi) {
        const vx = mirror ? EX + vi * sc : EX - vi * sc, vh = (vi / p.u) * hObj;
        ray([hit1, [vx, axis - vh]], "#ef4444", [4, 4]);
        arrowObj(ctx, vx, axis, clamp(vh, 0, 170), "#a855f7", 0.7, true);
        text(ctx, "Virtual, erect image", vx, axis - clamp(vh, 0, 170) - 14, { size: 11, color: "#7e22ce" });
      }
    }
    ctx.restore();
    // screen
    rr(ctx, scrX - 4, axis - 120, 8, 240, 3); ctx.fillStyle = "#f1f5f9"; ctx.fill(); ctx.strokeStyle = "#475569"; ctx.lineWidth = 1.5; ctx.stroke();
    text(ctx, "Screen", scrX, axis - 132, { size: 11 });
    // image on screen (blurred when out of focus)
    if (real && hImg > 0) {
      const sharp = r.sharp || 0;
      if (sharp > 0.02) {
        const blur = (1 - sharp) * 14;
        for (let k = -2; k <= 2; k++) {
          ctx.save(); ctx.globalAlpha = sharp * (k === 0 ? 0.9 : 0.25);
          arrow(ctx, scrX + k * 0.5, axis + k * blur * 0.3, scrX + k * 0.5, axis + hImg * (scrX === imgX ? 1 : 1) + k * blur, "#f97316", 3 + blur * 0.4);
          ctx.restore();
        }
      }
      if (Math.abs(scrX - imgX) > 3) { ctx.save(); ctx.globalAlpha = 0.25; arrow(ctx, imgX, axis, imgX, axis + hImg, "#f97316", 2); ctx.restore(); }
    }
    text(ctx, real ? (r.sharp > 0.9 ? "✓ Sharp image on screen!" : "Move the screen to get a sharp image") : "Object inside F → no real image on screen",
      320, 24, { size: 14, color: real && r.sharp > 0.9 ? "#059669" : "#b45309", weight: 700 });
  };
  return <SimCanvas draw={draw} w={W} h={360} />;
}

/* ------------------------------------------------- REFRACTION (slab/prism) */
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const norm = (a) => { const d = Math.hypot(a[0], a[1]); return [a[0] / d, a[1] / d]; };
function refractVec(d, nrm, n1, n2) { // nrm points against d
  const eta = n1 / n2, cos = -dot(nrm, d), k = 1 - eta * eta * (1 - cos * cos);
  if (k < 0) return null;
  return norm([eta * d[0] + (eta * cos - Math.sqrt(k)) * nrm[0], eta * d[1] + (eta * cos - Math.sqrt(k)) * nrm[1]]);
}
function hitEdge(P, d, poly, skip) {
  let best = null;
  for (let i = 0; i < poly.length; i++) {
    if (i === skip) continue;
    const A = poly[i], B = poly[(i + 1) % poly.length], e = sub(B, A);
    const den = d[0] * e[1] - d[1] * e[0];
    if (Math.abs(den) < 1e-9) continue;
    const w = sub(A, P), t = (w[0] * e[1] - w[1] * e[0]) / den, u = (w[0] * d[1] - w[1] * d[0]) / den;
    if (t > 1e-6 && u >= 0 && u <= 1 && (!best || t < best.t)) best = { t, i, pt: [P[0] + d[0] * t, P[1] + d[1] * t], e };
  }
  return best;
}
function traceThrough(poly, P, d, n, center) {
  const path = [P];
  let h = hitEdge(P, d, poly, -1);
  if (!h) return { path: [P, [P[0] + d[0] * 800, P[1] + d[1] * 800]] };
  path.push(h.pt);
  let nr = norm([-h.e[1], h.e[0]]); if (dot(nr, d) > 0) nr = [-nr[0], -nr[1]];
  let din = refractVec(d, nr, 1, n), cur = h.pt, edge = h.i, tir = false;
  for (let bounce = 0; bounce < 4 && din; bounce++) {
    const h2 = hitEdge(cur, din, poly, edge);
    if (!h2) break;
    path.push(h2.pt);
    let n2 = norm([-h2.e[1], h2.e[0]]); if (dot(n2, din) > 0) n2 = [-n2[0], -n2[1]];
    const out = refractVec(din, n2, n, 1);
    if (out) { path.push([h2.pt[0] + out[0] * 700, h2.pt[1] + out[1] * 700]); return { path, out, tir }; }
    tir = true; const k = 2 * dot(din, n2); din = norm([din[0] - k * n2[0], din[1] - k * n2[1]]); cur = h2.pt; edge = h2.i;
  }
  return { path, tir: true };
}
const SPECTRUM = ["#ef4444", "#f97316", "#facc15", "#22c55e", "#3b82f6", "#4f46e5", "#a855f7"];
export function Refraction({ exp, p, r }) {
  const o = exp.opts || {};
  const n = p.n ?? o.n ?? 1.5;
  const draw = (ctx) => {
    if (o.kind === "slab") {
      const poly = [[170, 140], [470, 140], [470, 260], [170, 260]];
      ctx.fillStyle = "rgba(125,211,252,0.35)"; ctx.strokeStyle = "#0284c7"; ctx.lineWidth = 2;
      ctx.beginPath(); poly.forEach((q, i) => (i ? ctx.lineTo(...q) : ctx.moveTo(...q))); ctx.closePath(); ctx.fill(); ctx.stroke();
      text(ctx, "Glass slab", 440, 248, { size: 11, color: "#0369a1" });
      const P = [260, 140], d = [Math.sin(p.i * deg), Math.cos(p.i * deg)];
      const S = [P[0] - d[0] * 160, P[1] - d[1] * 160];
      line(ctx, 260, 70, 260, 210, "#94a3b8", 1.2, [5, 4]); text(ctx, "Normal", 262, 64, { size: 10, align: "left", color: "#64748b" });
      const tr = traceThrough(poly, S, d, n);
      ctx.strokeStyle = "#dc2626"; ctx.lineWidth = 2.5; ctx.beginPath(); tr.path.forEach((q, i) => (i ? ctx.lineTo(...q) : ctx.moveTo(...q))); ctx.stroke();
      // extension of incident ray (to show lateral shift)
      line(ctx, P[0], P[1], P[0] + d[0] * 220, P[1] + d[1] * 220, "#dc2626", 1, [4, 4]);
      if (tr.path[2]) { const Q = tr.path[2]; line(ctx, Q[0], Q[1] - 70, Q[0], Q[1] + 70, "#94a3b8", 1.2, [5, 4]); }
      // pins
      [[S[0] + d[0] * 40, S[1] + d[1] * 40], [S[0] + d[0] * 120, S[1] + d[1] * 120]].forEach((q, k) => { circle(ctx, q[0], q[1], 5, "#1e293b"); text(ctx, `P${k + 1}`, q[0] - 14, q[1], { size: 10 }); });
      if (tr.path[3]) { const Q = tr.path[2], o2 = tr.out; [[Q[0] + o2[0] * 50, Q[1] + o2[1] * 50], [Q[0] + o2[0] * 110, Q[1] + o2[1] * 110]].forEach((q, k) => { circle(ctx, q[0], q[1], 5, "#1e293b"); text(ctx, `P${k + 3}`, q[0] + 16, q[1], { size: 10 }); }); }
      // angle arcs
      ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(260, 140, 34, -Math.PI / 2 - p.i * deg, -Math.PI / 2); ctx.stroke();
      text(ctx, `i = ${p.i}°`, 236, 96, { size: 12, color: "#b45309" });
      text(ctx, `r = ${(r.r ?? 0).toFixed(1)}°`, 300, 178, { size: 12, color: "#7c3aed" });
      text(ctx, `Lateral shift d = ${(r.d ?? 0).toFixed(2)} cm`, 320, 330, { size: 13, color: "#0f172a" });
      return;
    }
    // prism
    const A = [320, 70], B = [187, 300], C = [453, 300];
    const poly = [A, B, C];
    ctx.fillStyle = "rgba(125,211,252,0.35)"; ctx.strokeStyle = "#0284c7"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(...A); ctx.lineTo(...B); ctx.lineTo(...C); ctx.closePath(); ctx.fill(); ctx.stroke();
    text(ctx, "A = 60°", 320, 100, { size: 11, color: "#0369a1" });
    const M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
    const nin = norm([-(B[1] - A[1]), B[0] - A[0]]); // inward normal for left face
    const inward = dot(nin, sub([320, 220], M)) > 0 ? nin : [-nin[0], -nin[1]];
    const ang = Math.atan2(inward[1], inward[0]) - p.i * deg;
    const d = [Math.cos(ang), Math.sin(ang)];
    const S = [M[0] - d[0] * 180, M[1] - d[1] * 180];
    line(ctx, M[0] - inward[0] * 70, M[1] - inward[1] * 70, M[0] + inward[0] * 60, M[1] + inward[1] * 60, "#94a3b8", 1.2, [5, 4]);
    const white = o.dispersion && p.light === "white";
    const rays = white ? SPECTRUM.map((c, k) => ({ c, n: n - 0.012 + k * 0.006 })) : [{ c: "#dc2626", n }];
    rays.forEach(({ c, n: nn }, k) => {
      const tr = traceThrough(poly, S, d, nn);
      ctx.strokeStyle = white && k > 0 ? c : (white ? "#f8fafc" : c); ctx.lineWidth = white ? 2 : 2.5;
      ctx.beginPath();
      tr.path.forEach((q, i) => { if (white && k > 0 && i < 2) return; if (white && k > 0 && i === 2) { ctx.moveTo(...tr.path[1]); } i ? ctx.lineTo(...q) : ctx.moveTo(...q); });
      ctx.strokeStyle = c; ctx.stroke();
      if (white && k === 0) { ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(...tr.path[0]); ctx.lineTo(...tr.path[1]); ctx.stroke(); }
    });
    if (white) {
      text(ctx, "White light", S[0] + 30, S[1] - 18, { size: 11 });
      text(ctx, "VIBGYOR spectrum on screen", 560, 360, { size: 11, color: "#7c3aed" });
    }
    // extension of incident ray to show deviation
    line(ctx, M[0], M[1], M[0] + d[0] * 340, M[1] + d[1] * 340, "#94a3b8", 1, [4, 4]);
    text(ctx, `i = ${p.i}°`, M[0] - 70, M[1] + 40, { size: 12, color: "#b45309" });
    if (r.tir) text(ctx, "Total internal reflection — no emergent ray (increase i)", 320, 30, { size: 13, color: "#dc2626" });
    else text(ctx, `Deviation δ = ${(r.dev ?? 0).toFixed(1)}°   e = ${(r.e ?? 0).toFixed(1)}°`, 320, 30, { size: 14, color: "#0f172a", weight: 700 });
  };
  return <SimCanvas draw={draw} w={W} h={380} />;
}

/* --------------------------------------------------------------- PENDULUM */
export function Pendulum({ exp, p, x, setX, t: tr }) {
  const st = useRef({ t: 0, run: false, speed: 1, done: false });
  const g = p.g ?? 9.8;
  const T = 2 * Math.PI * Math.sqrt(p.L / 100 / g);
  const N = exp.opts?.N || 20;
  useEffect(() => { st.current = { t: 0, run: false, speed: st.current.speed, done: false }; setX({ tN: null }); }, [p.L, p.g]);
  const start = () => { st.current.t = 0; st.current.run = true; st.current.done = false; setX({ tN: null }); };
  const draw = (ctx, time, dt) => {
    const s = st.current;
    if (s.run) {
      s.t += dt * s.speed;
      if (s.t >= N * T) { s.run = false; s.done = true; const err = (Math.random() - 0.5) * 0.3; setX({ tN: +(N * T + err).toFixed(2) }); }
    }
    const A = (p.amp ?? 5) * deg;
    const th = s.run || s.done ? A * Math.cos((2 * Math.PI * s.t) / T) : A;
    const px = 300, py = 40, Lpx = 60 + p.L * 2.2;
    // stand
    rr(ctx, 120, 30, 360, 12, 4); ctx.fillStyle = "#475569"; ctx.fill(); rr(ctx, 120, 30, 12, 340, 4); ctx.fill(); rr(ctx, 90, 362, 120, 14, 4); ctx.fill();
    const bx = px + Lpx * Math.sin(th), by = py + Lpx * Math.cos(th);
    line(ctx, px, py, px, py + Lpx + 30, "#cbd5e1", 1, [4, 4]);
    line(ctx, px, py, bx, by, "#334155", 2);
    const grad = ctx.createRadialGradient(bx - 5, by - 5, 2, bx, by, 16); grad.addColorStop(0, "#fde68a"); grad.addColorStop(1, "#b45309");
    circle(ctx, bx, by, 15, grad, "#78350f", 2);
    text(ctx, `L = ${p.L} cm`, px + 40, py + Lpx / 2, { size: 12, align: "left", color: "#4f46e5" });
    // stopwatch
    rr(ctx, 470, 80, 150, 120, 16); ctx.fillStyle = "#0f172a"; ctx.fill();
    text(ctx, "⏱ Stopwatch", 545, 100, { size: 12, color: "#94a3b8" });
    text(ctx, `${s.t.toFixed(2)} s`, 545, 135, { size: 26, color: "#4ade80", weight: 800 });
    const cnt = Math.min(N, Math.floor(s.t / T));
    text(ctx, `Oscillations: ${cnt} / ${N}`, 545, 172, { size: 13, color: "#e2e8f0" });
    if (s.done) text(ctx, "✓ Done — record it", 545, 225, { size: 12, color: "#059669" });
  };
  return (
    <div>
      <SimCanvas draw={draw} w={W} h={390} />
      <Panel>
        <button className="btn-primary" onClick={start}>▶ {tr({ en: `Start & count ${N} oscillations`, kn: `ಪ್ರಾರಂಭಿಸಿ ಮತ್ತು ${N} ಆಂದೋಲನ ಎಣಿಸಿ` })}</button>
        {[1, 5, 10].map((v) => <button key={v} className="btn-ghost text-sm" onClick={() => (st.current.speed = v)}>{v}×</button>)}
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------- SPRING (Hooke) */
export function Spring({ p, r }) {
  const st = useRef({ y: 0, v: 0 });
  const draw = (ctx, time, dt) => {
    const target = (r.ext || 0) * 6;
    const s = st.current; const k = 40, c = 3;
    s.v += (-(s.y - target) * k - s.v * c) * dt; s.y += s.v * dt;
    // stand
    rr(ctx, 120, 30, 260, 12, 4); ctx.fillStyle = "#475569"; ctx.fill(); rr(ctx, 120, 30, 12, 340, 4); ctx.fill(); rr(ctx, 90, 362, 140, 14, 4); ctx.fill();
    const top = 42, L0 = 90, bot = top + L0 + s.y;
    ctx.strokeStyle = p.spring === "stiff" ? "#0f766e" : "#64748b"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(300, top);
    const turns = 14;
    for (let i = 1; i <= turns * 2; i++) ctx.lineTo(300 + (i % 2 ? 18 : -18), top + 8 + ((bot - top - 16) * i) / (turns * 2));
    ctx.lineTo(300, bot); ctx.stroke();
    // pointer & hanger
    line(ctx, 300, bot, 420, bot, "#dc2626", 2); circle(ctx, 420, bot, 3, "#dc2626");
    line(ctx, 300, bot, 300, bot + 20, "#334155", 2);
    const m = p.m || 0, nW = Math.round(m / 50);
    rr(ctx, 276, bot + 20, 48, 8, 2); ctx.fillStyle = "#1e293b"; ctx.fill();
    for (let i = 0; i < nW; i++) { rr(ctx, 272, bot + 28 + i * 9, 56, 8, 3); ctx.fillStyle = i % 2 ? "#a16207" : "#ca8a04"; ctx.fill(); }
    text(ctx, `${m} g`, 300, bot + 40 + nW * 9, { size: 12 });
    // scale
    rr(ctx, 430, top + 40, 40, 300, 4); ctx.fillStyle = "#fef9c3"; ctx.fill(); ctx.strokeStyle = "#a16207"; ctx.lineWidth = 1.5; ctx.stroke();
    for (let c = 0; c <= 48; c += 1) {
      const y = top + L0 + c * 6; if (y > top + 338) break;
      line(ctx, 430, y, 430 + (c % 5 ? 8 : 16), y, "#a16207", 1);
      if (c % 5 === 0) text(ctx, `${c}`, 458, y, { size: 10, color: "#78350f" });
    }
    text(ctx, "cm", 450, top + 30, { size: 11 });
    text(ctx, `Extension = ${(r.ext || 0).toFixed(1)} cm`, 540, 120, { size: 14, color: "#dc2626", weight: 800 });
    text(ctx, `Load = ${(r.F || 0).toFixed(2)} N`, 540, 150, { size: 13 });
  };
  return <SimCanvas draw={draw} w={W} h={390} />;
}

/* ------------------------------------------- VERNIER / SCREW GAUGE */
export function Gauge({ exp, p, r }) {
  const vernier = exp.opts?.kind === "vernier";
  const draw = (ctx) => {
    const eff = r.eff; // cm for vernier, mm for screw
    if (vernier) {
      // top: calipers with object
      const s = 50; // px per cm (top view)
      const X0 = 80;
      rr(ctx, 40, 50, 560, 26, 4); ctx.fillStyle = "#cbd5e1"; ctx.fill();
      ctx.fillStyle = "#64748b"; ctx.fillRect(X0 - 14, 50, 14, 110);
      const jx = X0 + eff * s;
      ctx.fillStyle = "#4f46e5"; ctx.fillRect(jx, 50, 14, 110); rr(ctx, jx, 42, 80, 42, 6); ctx.globalAlpha = 0.3; ctx.fill(); ctx.globalAlpha = 1;
      const os = r.size * s;
      ctx.fillStyle = "#f59e0b"; ctx.beginPath(); ctx.ellipse(X0 + os / 2, 125, os / 2, Math.min(30, os / 2), 0, 0, Math.PI * 2); ctx.fill();
      text(ctx, r.gripped ? "Object gripped ✓" : "Close the jaws on the object", 420, 130, { size: 13, color: r.gripped ? "#059669" : "#b45309" });
      // bottom: magnified scale window
      const ppm = 22; // px per mm
      const mmEff = eff * 10;
      const start = Math.floor(mmEff) - 6;
      rr(ctx, 20, 200, 600, 170, 12); ctx.fillStyle = "#f8fafc"; ctx.fill(); ctx.strokeStyle = "#cbd5e1"; ctx.stroke();
      text(ctx, "Magnified view", 70, 214, { size: 11, color: "#64748b" });
      const base = 320 - (mmEff - start) * ppm; // x of mm 'start' so that vernier zero sits at 320
      for (let mm = start; mm <= start + 30; mm++) {
        const x = base + (mm - start) * ppm; if (x < 25 || x > 615) continue;
        if (mm < 0) continue;
        line(ctx, x, 250, x, 250 + (mm % 10 === 0 ? 34 : mm % 5 === 0 ? 26 : 18), "#0f172a", mm % 10 === 0 ? 2 : 1);
        if (mm % 10 === 0) text(ctx, `${mm / 10}`, x, 238, { size: 14, weight: 800 });
      }
      text(ctx, "Main scale (cm)", 560, 228, { size: 10, color: "#64748b" });
      // vernier: 10 divisions = 9 mm
      for (let k = 0; k <= 10; k++) {
        const x = 320 + k * 0.9 * ppm;
        const match = k === r.vsc;
        line(ctx, x, 290, x, 290 + (k % 5 === 0 ? 30 : 20), match ? "#dc2626" : "#4f46e5", match ? 3 : 1.5);
        if (k % 5 === 0) text(ctx, `${k}`, x, 332, { size: 12, color: "#4f46e5" });
      }
      text(ctx, "Vernier scale (LC = 0.01 cm)", 360, 352, { size: 11, color: "#4f46e5" });
      return;
    }
    // Screw gauge
    rr(ctx, 40, 90, 60, 130, 10); ctx.fillStyle = "#475569"; ctx.fill(); // frame
    ctx.beginPath(); ctx.moveTo(70, 220); ctx.quadraticCurveTo(70, 330, 220, 330); ctx.lineTo(460, 330); ctx.lineTo(460, 300); ctx.lineTo(220, 300); ctx.quadraticCurveTo(100, 300, 100, 220); ctx.fill();
    const ppm = 12; // px per mm (top view)
    const anvil = 120;
    ctx.fillStyle = "#94a3b8"; ctx.fillRect(100, 140, anvil - 100, 30);
    const os = r.size * ppm;
    ctx.fillStyle = "#f59e0b"; ctx.fillRect(anvil, 145, os, 20);
    const sp = anvil + eff * ppm;
    ctx.fillStyle = "#94a3b8"; ctx.fillRect(sp, 140, 290 - sp, 30);
    const edge = 300 + eff * 14;
    rr(ctx, 280, 120, 260, 70, 4); ctx.fillStyle = "#e2e8f0"; ctx.fill();
    line(ctx, 280, 155, 540, 155, "#0f172a", 1.5);
    for (let mm = 0; mm <= 15; mm++) { const x = 300 + mm * 14; line(ctx, x, 155, x, 141, "#0f172a", 1.5); if (mm % 5 === 0) text(ctx, `${mm}`, x, 132, { size: 10 }); line(ctx, x + 7, 155, x + 7, 166, "#0f172a", 1); }
    // thimble
    rr(ctx, edge, 112, 90, 86, 8); ctx.fillStyle = "#6366f1"; ctx.fill();
    const csr = r.csd;
    for (let k = -4; k <= 4; k++) {
      const div = (csr + k + 100) % 100; const y = 155 - k * 9;
      line(ctx, edge, y, edge + (div % 5 === 0 ? 18 : 10), y, k === 0 ? "#fde047" : "#fff", k === 0 ? 2.5 : 1.2);
      if (div % 5 === 0) text(ctx, `${div}`, edge + 30, y, { size: 10, color: "#fff" });
    }
    rr(ctx, edge + 90, 135, 50, 40, 6); ctx.fillStyle = "#4338ca"; ctx.fill(); text(ctx, "Ratchet", edge + 115, 205, { size: 10 });
    text(ctx, r.gripped ? "Object gripped ✓ (ratchet clicks)" : "Turn the thimble to grip the object", 320, 60, { size: 13, color: r.gripped ? "#059669" : "#b45309" });
    text(ctx, "Pitch = 1 mm · 100 divisions · LC = 0.01 mm", 320, 370, { size: 11, color: "#64748b" });
  };
  return <SimCanvas draw={draw} w={W} h={390} />;
}

/* ------------------------------------------------------------ SONOMETER */
export function Sonometer({ p, r }) {
  const draw = (ctx, time) => {
    rr(ctx, 30, 220, 560, 70, 10); ctx.fillStyle = "#d6a35c"; ctx.fill(); ctx.strokeStyle = "#92400e"; ctx.lineWidth = 2; ctx.stroke();
    text(ctx, "Sonometer box", 310, 268, { size: 12, color: "#78350f" });
    const b1 = 120, b2 = 120 + p.l * 4.2, y = 200;
    line(ctx, 40, y, 600, y, "#64748b", 1.5);
    // vibrating segment between bridges
    const A = 16 * (r.res || 0) + 1.2 * (r.res > 0.05 ? 1 : 0);
    ctx.strokeStyle = "#0f172a"; ctx.lineWidth = 2; ctx.beginPath();
    for (let k = 0; k <= 60; k++) { const xx = b1 + ((b2 - b1) * k) / 60; const yy = y + A * Math.sin((Math.PI * k) / 60) * Math.sin(time * 40); k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
    ctx.stroke();
    [b1, b2].forEach((bx) => { ctx.fillStyle = "#1e293b"; ctx.beginPath(); ctx.moveTo(bx, y); ctx.lineTo(bx - 9, 220); ctx.lineTo(bx + 9, 220); ctx.fill(); });
    // paper rider
    const mid = (b1 + b2) / 2, jump = r.res > 0.85;
    const ry = jump ? y - 40 - 20 * Math.abs(Math.sin(time * 6)) : y - 2;
    ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.moveTo(mid, ry); ctx.lineTo(mid - 8, ry - 10); ctx.lineTo(mid + 8, ry - 10); ctx.fill();
    text(ctx, jump ? "Paper rider flies off — RESONANCE!" : "Paper rider", mid, ry - 22, { size: 12, color: jump ? "#dc2626" : "#64748b", weight: 700 });
    // pulley & weight
    circle(ctx, 610, y + 8, 12, "#94a3b8", "#334155"); line(ctx, 622, y + 8, 622, 320, "#64748b", 1.5);
    rr(ctx, 606, 320, 32, 40, 4); ctx.fillStyle = "#334155"; ctx.fill(); text(ctx, `${p.M}kg`, 622, 340, { size: 10, color: "#fff" });
    // fork
    const fx = 300, fy = 330; const wob = Math.sin(time * 60) * 2;
    ctx.strokeStyle = "#475569"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(fx - 10 - wob, fy - 70); ctx.lineTo(fx - 10, fy - 10); ctx.quadraticCurveTo(fx, fy, fx + 10, fy - 10); ctx.lineTo(fx + 10 + wob, fy - 70); ctx.stroke();
    line(ctx, fx, fy - 2, fx, fy + 30, "#475569", 5);
    text(ctx, `${p.f} Hz fork`, fx + 60, fy, { size: 12 });
    text(ctx, `Vibrating length l = ${p.l} cm`, 320, 40, { size: 14, weight: 800, color: "#4f46e5" });
    // amplitude bar
    rr(ctx, 40, 70, 200, 14, 7); ctx.fillStyle = "#e2e8f0"; ctx.fill();
    rr(ctx, 40, 70, 200 * (r.res || 0), 14, 7); ctx.fillStyle = r.res > 0.85 ? "#22c55e" : "#f59e0b"; ctx.fill();
    text(ctx, "Wire vibration", 140, 98, { size: 11, color: "#64748b" });
  };
  return <SimCanvas draw={draw} w={W} h={380} />;
}

/* ------------------------------------------------------- RESONANCE TUBE */
export function ResonanceTube({ p, r }) {
  const draw = (ctx, time) => {
    const top = 60, len = 300, tx = 260, tw = 44;
    const ppc = len / 100;
    const wl = top + p.l * ppc;
    // water
    ctx.fillStyle = "rgba(59,130,246,0.35)"; ctx.fillRect(tx, wl, tw, top + len - wl);
    ctx.strokeStyle = "#475569"; ctx.lineWidth = 3; ctx.strokeRect(tx, top, tw, len);
    // standing wave envelope in air column
    const lam = r.lambda || 66;
    ctx.strokeStyle = `rgba(124,58,237,${0.25 + 0.6 * (r.loud || 0)})`; ctx.lineWidth = 2;
    [1, -1].forEach((sg) => {
      ctx.beginPath();
      for (let yy = top - (r.e || 1) * ppc; yy <= wl; yy += 2) {
        const dist = (wl - yy) / ppc; // from water surface (node)
        const a = Math.abs(Math.sin((2 * Math.PI * dist) / lam)) * 16 * (0.3 + (r.loud || 0));
        const xx = tx + tw / 2 + sg * a * Math.sin(time * 30);
        yy === top - (r.e || 1) * ppc ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy);
      }
      ctx.stroke();
    });
    // scale
    for (let c = 0; c <= 100; c += 5) { const yy = top + c * ppc; line(ctx, tx - (c % 10 ? 6 : 12), yy, tx, yy, "#475569", 1); if (c % 10 === 0) text(ctx, `${c}`, tx - 24, yy, { size: 10 }); }
    text(ctx, "cm", tx - 24, top - 14, { size: 10 });
    // reservoir
    rr(ctx, 420, wl - 30, 50, 60, 8); ctx.fillStyle = "rgba(59,130,246,0.5)"; ctx.fill();
    ctx.strokeStyle = "#64748b"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tx + tw / 2, top + len); ctx.quadraticCurveTo(tx + tw / 2, top + len + 30, 380, top + len + 20); ctx.quadraticCurveTo(445, top + len, 445, wl + 30); ctx.stroke();
    text(ctx, "Reservoir", 445, wl - 40, { size: 11 });
    // fork
    const wob = Math.sin(time * 60) * 2;
    ctx.strokeStyle = "#475569"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(tx + 6 - wob, 10); ctx.lineTo(tx + 6, 40); ctx.quadraticCurveTo(tx + tw / 2, 50, tx + tw - 6, 40); ctx.lineTo(tx + tw - 6 + wob, 10); ctx.stroke();
    text(ctx, `${p.f} Hz`, tx + tw + 40, 26, { size: 12 });
    text(ctx, `Air column l = ${p.l.toFixed(1)} cm`, 520, 120, { size: 14, weight: 800, color: "#4f46e5" });
    // loudness meter
    text(ctx, "Loudness", 520, 170, { size: 12, color: "#64748b" });
    for (let k = 0; k < 10; k++) { rr(ctx, 470 + k * 10, 190, 8, 40, 2); ctx.fillStyle = k < Math.round((r.loud || 0) * 10) ? (k > 7 ? "#22c55e" : "#f59e0b") : "#e2e8f0"; ctx.fill(); }
    if ((r.loud || 0) > 0.8) { text(ctx, "🔊 Loud boom — resonance!", 520, 260, { size: 13, color: "#059669", weight: 800 });
      for (let k = 1; k <= 3; k++) { ctx.strokeStyle = `rgba(34,197,94,${0.6 - k * 0.15})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(tx + tw / 2, top, 10 + k * 14 + (time * 30) % 14, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); } }
  };
  return <SimCanvas draw={draw} w={W} h={400} />;
}
