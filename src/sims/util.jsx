import React, { useEffect, useRef } from "react";

// Canvas with a fixed logical size, crisp on retina, animated every frame.
// draw(ctx, time, dt) is always the latest function passed in.
export function SimCanvas({ draw, w = 640, h = 400, onPointer, className = "", cursor }) {
  const ref = useRef(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;
  const ptrRef = useRef(onPointer);
  ptrRef.current = onPointer;

  useEffect(() => {
    const c = ref.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = w * dpr; c.height = h * dpr;
    const ctx = c.getContext("2d");
    let raf, last = performance.now(), t = 0;
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      try { drawRef.current(ctx, t, dt); } catch (e) { console.error(e); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [w, h]);

  const pos = (e) => {
    const b = ref.current.getBoundingClientRect();
    return { x: ((e.clientX - b.left) / b.width) * w, y: ((e.clientY - b.top) / b.height) * h };
  };
  const handlers = onPointer ? {
    onPointerDown: (e) => { ref.current.setPointerCapture(e.pointerId); ptrRef.current?.("down", pos(e), e); },
    onPointerMove: (e) => ptrRef.current?.("move", pos(e), e),
    onPointerUp: (e) => ptrRef.current?.("up", pos(e), e),
  } : {};
  return <canvas ref={ref} {...handlers} className={`w-full h-auto rounded-xl bg-gradient-to-b from-slate-50 to-white ${className}`} style={{ aspectRatio: `${w}/${h}`, cursor }} />;
}

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, k) => a + (b - a) * k;
export const rnd = (seed) => { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = (s * 16807) % 2147483647) / 2147483647; };

export function rr(ctx, x, y, w, h, r = 8) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
export function text(ctx, s, x, y, { size = 13, color = "#334155", align = "center", weight = 600, base = "middle" } = {}) {
  ctx.font = `${weight} ${size}px Inter, "Noto Sans Kannada", sans-serif`;
  ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = base; ctx.fillText(s, x, y);
}
export function line(ctx, x1, y1, x2, y2, color = "#334155", w = 2, dash) {
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore();
}
export function arrow(ctx, x1, y1, x2, y2, color = "#334155", w = 2) {
  line(ctx, x1, y1, x2, y2, color, w);
  const a = Math.atan2(y2 - y1, x2 - x1), s = 8;
  ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - s * Math.cos(a - 0.4), y2 - s * Math.sin(a - 0.4));
  ctx.lineTo(x2 - s * Math.cos(a + 0.4), y2 - s * Math.sin(a + 0.4)); ctx.fill();
}
export function circle(ctx, x, y, r, fill, stroke, lw = 2) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
}

// Analog meter with needle
export function meter(ctx, x, y, r, value, max, label, unit, color = "#4f46e5") {
  circle(ctx, x, y, r, "#fff", "#334155", 3);
  ctx.save();
  for (let i = 0; i <= 10; i++) {
    const a = Math.PI * (1.15 + 0.7 * (i / 10));
    line(ctx, x + Math.cos(a) * r * 0.72, y + Math.sin(a) * r * 0.72, x + Math.cos(a) * r * 0.86, y + Math.sin(a) * r * 0.86, "#94a3b8", i % 5 ? 1 : 2);
  }
  const k = clamp(value / max, -0.05, 1.05);
  const a = Math.PI * (1.15 + 0.7 * k);
  line(ctx, x, y + r * 0.2, x + Math.cos(a) * r * 0.82, y + Math.sin(a) * r * 0.82, "#e11d48", 2.5);
  circle(ctx, x, y + r * 0.2, 3.5, "#334155");
  ctx.restore();
  text(ctx, label, x, y + r * 0.5, { size: 15, weight: 800, color });
  if (unit != null) text(ctx, unit, x, y + r + 14, { size: 12, color: "#0f172a", weight: 700 });
}

// Beaker (open glass) with liquid level 0..1
export function beaker(ctx, x, y, w, h, level, liquid = "rgba(59,130,246,0.35)", label) {
  ctx.save();
  if (level > 0) {
    ctx.fillStyle = liquid;
    rr(ctx, x + 3, y + h * (1 - level), w - 6, h * level - 3, 6); ctx.fill();
  }
  ctx.strokeStyle = "#64748b"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x - 4, y); ctx.lineTo(x, y + 4); ctx.lineTo(x, y + h - 8);
  ctx.quadraticCurveTo(x, y + h, x + 8, y + h); ctx.lineTo(x + w - 8, y + h);
  ctx.quadraticCurveTo(x + w, y + h, x + w, y + h - 8); ctx.lineTo(x + w, y); ctx.stroke();
  for (let i = 1; i < 5; i++) line(ctx, x + w - 14, y + (h * i) / 5, x + w - 3, y + (h * i) / 5, "#94a3b8", 1);
  ctx.restore();
  if (label) text(ctx, label, x + w / 2, y + h + 16, { size: 12 });
}

// Test tube, level 0..1
export function testTube(ctx, x, y, w, h, level, liquid, label) {
  ctx.save();
  if (level > 0) {
    ctx.fillStyle = liquid;
    ctx.beginPath();
    const top = y + h * (1 - level);
    ctx.moveTo(x + 2, top); ctx.lineTo(x + w - 2, top); ctx.lineTo(x + w - 2, y + h - w / 2);
    ctx.arc(x + w / 2, y + h - w / 2, w / 2 - 2, 0, Math.PI); ctx.closePath(); ctx.fill();
  }
  ctx.strokeStyle = "#64748b"; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + h - w / 2);
  ctx.arc(x + w / 2, y + h - w / 2, w / 2, Math.PI, 0, true); ctx.lineTo(x + w, y); ctx.stroke();
  ctx.restore();
  if (label) text(ctx, label, x + w / 2, y + h + 14, { size: 11 });
}

export function bubbles(ctx, x, y, w, h, t, n, color = "rgba(255,255,255,0.85)", seed = 1) {
  const R = rnd(seed);
  for (let i = 0; i < n; i++) {
    const bx = x + R() * w, sp = 20 + R() * 40, ph = R() * h;
    const by = y + h - ((t * sp + ph) % h);
    circle(ctx, bx + Math.sin(t * 3 + i) * 2, by, 1.5 + R() * 2.5, null, color, 1.2);
  }
}

export function Panel({ children }) {
  return <div className="flex flex-wrap gap-2 items-center mt-3 px-1">{children}</div>;
}
