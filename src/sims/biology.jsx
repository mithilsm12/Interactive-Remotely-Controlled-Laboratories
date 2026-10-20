import React, { useEffect, useMemo, useRef, useState } from "react";
import { SimCanvas, clamp, rr, text, line, circle, beaker, testTube, bubbles, Panel, rnd } from "./util.jsx";

const W = 640;
const CX = 320, CY = 190, FR = 170; // microscope field

/* ---------------------------------------------------------- MICROSCOPE */
function genObjects(spec, p, seed) {
  const R = rnd(seed * 97 + 13);
  const objs = [];
  if (spec === "stomata") {
    const cw = 52, ch = 40;
    for (let i = -6; i <= 6; i++) for (let j = -5; j <= 5; j++) {
      const x = i * cw + (j % 2 ? cw / 2 : 0) + (R() - 0.5) * 10, y = j * ch + (R() - 0.5) * 8;
      const isS = R() < 0.18;
      objs.push({ x, y, type: isS ? "stoma" : "epi", r: isS ? 15 : 22, rot: R() * Math.PI, open: R() > 0.3 });
    }
  } else if (spec === "mitosis") {
    const cw = 46, ch = 34;
    for (let i = -7; i <= 7; i++) for (let j = -6; j <= 6; j++) {
      const u = R();
      const type = u < 0.68 ? "interphase" : u < 0.8 ? "prophase" : u < 0.87 ? "metaphase" : u < 0.93 ? "anaphase" : "telophase";
      objs.push({ x: i * cw + (j % 2 ? 8 : 0), y: j * ch, w: cw - 3, h: ch - 3, type, r: 18, rot: R() });
    }
  } else if (spec === "plasmolysis") {
    const cw = 60, ch = 34, conc = p.conc ?? 0;
    for (let i = -6; i <= 6; i++) for (let j = -6; j <= 6; j++) {
      const thr = 0.22 + R() * 0.2;
      const k = clamp((conc - thr) / 0.25, 0, 1);
      objs.push({ x: i * cw + (j % 2 ? cw / 2 : 0), y: j * ch, w: cw - 4, h: ch - 4, k, type: k > 0.05 ? "plasmolysed" : "turgid", r: 18 });
    }
  } else if (spec === "pollen") {
    const s = p.sucrose ?? 10, tm = p.time ?? 30;
    const g = (s <= 0 ? 0.1 : Math.exp(-Math.pow((s - 10) / 8, 2)) * 0.85 + 0.05) * (1 - Math.exp(-tm / 25));
    for (let i = 0; i < 70; i++) {
      const a = R() * Math.PI * 2, d = Math.sqrt(R()) * 360;
      const germ = R() < g;
      objs.push({ x: Math.cos(a) * d, y: Math.sin(a) * d * 0.8, type: germ ? "germinated" : "notgerminated", r: 13, ang: R() * Math.PI * 2, len: germ ? (15 + R() * 25) * (tm / 30) * (s > 25 ? 0.5 : 1) : 0, burst: s < 2 && R() < 0.3 });
    }
  }
  return objs;
}

function drawCell(ctx, o, spec, zoom, time, p) {
  const s = zoom;
  if (spec === "stomata") {
    if (o.type === "epi") {
      ctx.strokeStyle = "#65a30d"; ctx.lineWidth = 1.5; ctx.fillStyle = "rgba(236,252,203,0.6)";
      ctx.beginPath();
      for (let k = 0; k <= 24; k++) { const a = (k / 24) * Math.PI * 2; const rr2 = o.r * s * (1 + 0.12 * Math.sin(a * 5 + o.rot * 3)); const xx = Math.cos(a) * rr2 * 1.25, yy = Math.sin(a) * rr2 * 0.95; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
      ctx.closePath(); ctx.fill(); ctx.stroke();
    } else {
      ctx.save(); ctx.rotate(o.rot);
      [-1, 1].forEach((sg) => { ctx.fillStyle = "#4d7c0f"; ctx.beginPath(); ctx.ellipse(sg * 6 * s, 0, 6 * s, 14 * s, 0, 0, Math.PI * 2); ctx.fill();
        for (let k = 0; k < 4; k++) circle(ctx, sg * 6 * s, (-9 + k * 6) * s, 1.6 * s, "#a3e635"); });
      ctx.fillStyle = "#1c1917"; ctx.beginPath(); ctx.ellipse(0, 0, (o.open ? 2.2 : 0.8) * s, 9 * s, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  } else if (spec === "mitosis") {
    const w = o.w * s, h = o.h * s;
    ctx.fillStyle = "rgba(254,226,226,0.6)"; ctx.strokeStyle = "#be123c"; ctx.lineWidth = 1.2; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.strokeRect(-w / 2, -h / 2, w, h);
    const ch = "#7f1d1d";
    if (o.type === "interphase") { circle(ctx, 0, 0, 7 * s, "rgba(190,18,60,0.45)", "#9f1239", 1); circle(ctx, 1.5 * s, -1 * s, 2 * s, "#7f1d1d"); }
    else if (o.type === "prophase") { circle(ctx, 0, 0, 8 * s, "rgba(190,18,60,0.15)", "#9f1239", 0.8); ctx.strokeStyle = ch; ctx.lineWidth = 1.6 * s * 0.6; for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(-6 * s + k * 3 * s, -5 * s); ctx.bezierCurveTo(-2 * s + k * s, 0, -6 * s + k * 3 * s, 2 * s, -3 * s + k * 2 * s, 6 * s); ctx.stroke(); } }
    else if (o.type === "metaphase") { ctx.fillStyle = ch; for (let k = -3; k <= 3; k++) ctx.fillRect(-1.5 * s, k * 2.6 * s - 1, 3 * s, 2 * s); line(ctx, -w / 2 + 3, 0, -2 * s, 0, "rgba(127,29,29,0.25)", 0.8); }
    else if (o.type === "anaphase") { ctx.strokeStyle = ch; ctx.lineWidth = 1.5; for (let k = -2; k <= 2; k++) { [-1, 1].forEach((sg) => { ctx.beginPath(); ctx.moveTo(sg * 5 * s, k * 2.5 * s); ctx.lineTo(sg * 9 * s, k * 2.5 * s - 2 * s); ctx.moveTo(sg * 5 * s, k * 2.5 * s); ctx.lineTo(sg * 9 * s, k * 2.5 * s + 2 * s); ctx.stroke(); }); } }
    else { circle(ctx, -w / 4, 0, 5 * s, "rgba(190,18,60,0.45)", "#9f1239", 1); circle(ctx, w / 4, 0, 5 * s, "rgba(190,18,60,0.45)", "#9f1239", 1); line(ctx, 0, -h / 2, 0, h / 2, "#be123c", 1.5, [3, 2]); }
  } else if (spec === "plasmolysis") {
    const w = o.w * s, h = o.h * s;
    ctx.strokeStyle = "#4c1d95"; ctx.lineWidth = 1.5; ctx.strokeRect(-w / 2, -h / 2, w, h);
    const sh = 1 - o.k * 0.55;
    ctx.fillStyle = "rgba(147,51,234,0.55)";
    if (o.k < 0.05) ctx.fillRect(-w / 2 + 1, -h / 2 + 1, w - 2, h - 2);
    else { ctx.beginPath(); ctx.ellipse(o.k > 0.6 ? 0 : -w * 0.05, 0, (w / 2) * sh, (h / 2) * sh, 0, 0, Math.PI * 2); ctx.fill(); }
    circle(ctx, -w * 0.25 * sh, 0, 2.5 * s, "#3b0764");
  } else if (spec === "pollen") {
    if (o.burst) { ctx.fillStyle = "rgba(251,191,36,0.35)"; ctx.beginPath(); ctx.arc(0, 0, o.r * s * 1.3, 0, Math.PI * 2); ctx.fill(); }
    if (o.len > 0) { ctx.strokeStyle = "#ca8a04"; ctx.lineWidth = 2.5 * s * 0.5; ctx.beginPath(); ctx.moveTo(0, 0); const ex = Math.cos(o.ang) * (o.r + o.len) * s, ey = Math.sin(o.ang) * (o.r + o.len) * s; ctx.quadraticCurveTo(ex * 0.5 + 6 * s, ey * 0.5 - 6 * s, ex, ey); ctx.stroke(); }
    circle(ctx, 0, 0, o.r * s, "#facc15", "#a16207", 1.5);
    for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; line(ctx, Math.cos(a) * o.r * s, Math.sin(a) * o.r * s, Math.cos(a) * (o.r + 3) * s, Math.sin(a) * (o.r + 3) * s, "#a16207", 1); }
    circle(ctx, -3 * s, -2 * s, 3 * s, "rgba(161,98,7,0.6)"); circle(ctx, 4 * s, 3 * s, 2 * s, "rgba(161,98,7,0.6)");
  }
}

export function Microscope({ exp, p, x, setX, t }) {
  const o = exp.opts;
  const spec = o.specimen;
  const zoom = p.mag === 40 ? 2.5 : 1;
  const field = x.field || 1;
  const objs = useMemo(() => (spec === "reproduction" ? [] : genObjects(spec, p, field)), [spec, field, p.conc, p.sucrose, p.time]);
  const visible = objs.filter((ob) => Math.hypot(ob.x * zoom, ob.y * zoom) < FR - 6);
  const [findIdx, setFindIdx] = useState(0);
  const [fb, setFb] = useState(null);
  useEffect(() => {
    const counts = {}; visible.forEach((ob) => (counts[ob.type] = (counts[ob.type] || 0) + 1));
    setX({ counts, total: visible.length });
  }, [objs, zoom]);
  const finds = (o.findFor && o.findFor[p.org]) || o.find || [];
  const target = finds[findIdx % Math.max(1, finds.length)];
  const blur = Math.abs((p.focus ?? 50) - 50) / 8;

  const onPointer = (type, pt) => {
    if (type !== "down" || !target) return;
    const lx = pt.x - CX, ly = pt.y - CY;
    if (Math.hypot(lx, ly) > FR) return;
    let hit = null;
    if (spec === "reproduction") { const hs = reproHotspots(p); hit = hs.find((h) => Math.hypot(h.x - lx, h.y - ly) < h.r); }
    else hit = visible.find((ob) => Math.hypot(ob.x * zoom - lx, ob.y * zoom - ly) < ob.r * zoom * 1.1);
    if (hit && hit.type === target.type) { setFb({ ok: true, at: pt }); setX({ found: (x.found || 0) + 1 }); setFindIdx((i) => i + 1); }
    else setFb({ ok: false, at: pt });
    setTimeout(() => setFb(null), 900);
  };

  const draw = (ctx, time) => {
    ctx.fillStyle = "#0f172a"; ctx.fillRect(0, 0, W, 380);
    ctx.save(); ctx.beginPath(); ctx.arc(CX, CY, FR, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = spec === "plasmolysis" ? "#faf5ff" : spec === "pollen" ? "#f0fdf4" : "#fffbeb"; ctx.fillRect(CX - FR, CY - FR, FR * 2, FR * 2);
    if ("filter" in ctx && blur > 0.3) ctx.filter = `blur(${blur.toFixed(1)}px)`;
    if (spec === "reproduction") drawRepro(ctx, p, time);
    else visible.forEach((ob) => { ctx.save(); ctx.translate(CX + ob.x * zoom, CY + ob.y * zoom); drawCell(ctx, ob, spec, zoom, time, p); ctx.restore(); });
    ctx.filter = "none";
    if (blur > 0.3) { ctx.fillStyle = `rgba(255,255,255,${clamp(blur / 10, 0, 0.6)})`; ctx.fillRect(CX - FR, CY - FR, FR * 2, FR * 2); }
    // vignette
    const g = ctx.createRadialGradient(CX, CY, FR * 0.7, CX, CY, FR); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,0.35)"); ctx.fillStyle = g; ctx.fillRect(CX - FR, CY - FR, FR * 2, FR * 2);
    ctx.restore();
    circle(ctx, CX, CY, FR, null, "#334155", 6);
    text(ctx, `${p.mag || 10}× objective`, 70, 30, { size: 12, color: "#cbd5e1" });
    text(ctx, blur > 1.5 ? "Turn the fine adjustment (focus) knob" : "In focus ✓", 570, 30, { size: 12, color: blur > 1.5 ? "#fbbf24" : "#4ade80" });
    if (target) {
      rr(ctx, 170, 344, 300, 28, 14); ctx.fillStyle = "#4f46e5"; ctx.fill();
      text(ctx, `🎯 ${t({ en: "Click on", kn: "ಕ್ಲಿಕ್ ಮಾಡಿ" })}: ${t(target.l)}`, 320, 358, { size: 13, color: "#fff", weight: 700 });
    }
    if (fb) text(ctx, fb.ok ? "✓" : "✗", fb.at.x, fb.at.y - 16, { size: 26, color: fb.ok ? "#4ade80" : "#f87171", weight: 900 });
    text(ctx, `${t({ en: "Found", kn: "ಕಂಡುಹಿಡಿದದ್ದು" })}: ${x.found || 0}`, 70, 358, { size: 12, color: "#cbd5e1" });
  };
  return (
    <div>
      <SimCanvas draw={draw} w={W} h={380} onPointer={onPointer} cursor="crosshair" />
      {spec !== "reproduction" && <Panel>
        <button className="btn-ghost" onClick={() => setX({ field: field + 1 })}>🔀 {t({ en: "Move slide (new field of view)", kn: "ಸ್ಲೈಡ್ ಸರಿಸಿ (ಹೊಸ ದೃಷ್ಟಿ ಕ್ಷೇತ್ರ)" })}</button>
      </Panel>}
    </div>
  );
}

// Binary fission (Amoeba) and budding (Yeast)
function reproHotspots(p) {
  const k = (p.stage ?? 0) / 100;
  if (p.org === "yeast") return [{ x: -40, y: 10, r: 55, type: "parent" }, { x: 40 + 40 * k, y: -30 - 20 * k, r: 18 + 30 * k, type: "bud" }, { x: -40, y: 10, r: 14, type: "nucleus" }];
  const sep = 70 * k;
  return [{ x: -sep, y: 0, r: 16, type: "nucleus" }, { x: sep, y: 0, r: 16, type: "nucleus" }, { x: -sep - 80, y: -40, r: 25, type: "pseudopodia" }, { x: sep + 80, y: 40, r: 25, type: "pseudopodia" }];
}
function drawRepro(ctx, p, time) {
  const k = (p.stage ?? 0) / 100;
  ctx.save(); ctx.translate(CX, CY);
  if (p.org === "yeast") {
    circle(ctx, -40, 10, 55, "rgba(253,230,138,0.8)", "#a16207", 2); circle(ctx, -40, 10, 14, "rgba(161,98,7,0.5)", "#78350f", 1.5);
    circle(ctx, -20, 30, 9, "rgba(255,255,255,0.7)");
    const br = 8 + 40 * k;
    circle(ctx, 30 + 40 * k, -25 - 20 * k, br, "rgba(253,230,138,0.85)", "#a16207", 2);
    if (k > 0.5) circle(ctx, 30 + 40 * k, -25 - 20 * k, 8 * k, "rgba(161,98,7,0.5)", "#78350f", 1);
    if (k > 0.85) { const b2 = 6 + (k - 0.85) * 60; circle(ctx, 80 + 40 * k, -70 - 10 * k, b2, "rgba(253,230,138,0.85)", "#a16207", 1.5); }
  } else {
    const sep = 70 * k, pinch = clamp(k * 1.4 - 0.4, 0, 1);
    ctx.fillStyle = "rgba(191,219,254,0.75)"; ctx.strokeStyle = "#1d4ed8"; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let a = 0; a <= Math.PI * 2 + 0.01; a += 0.05) {
      const wob = 1 + 0.15 * Math.sin(a * 4 + time * 1.2) + 0.25 * Math.max(0, Math.cos(a - 3.8)) * (1 - pinch);
      let rx = 120 + sep * 0.6, ry = 70 * (1 - 0.8 * pinch * Math.pow(Math.abs(Math.cos(a)) < 0.25 ? 1 : 0, 1));
      const xx = Math.cos(a) * rx * wob, yy = Math.sin(a) * ry * wob * (pinch > 0.2 ? clamp(Math.abs(Math.cos(a)) * 1.6, 1 - pinch * 0.9, 1) : 1);
      a === 0 ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
    if (pinch > 0.95) line(ctx, 0, -20, 0, 20, "#1d4ed8", 2);
    circle(ctx, -sep, 0, 15, "rgba(30,64,175,0.5)", "#1e3a8a", 1.5);
    if (k > 0.15) circle(ctx, sep, 0, 15, "rgba(30,64,175,0.5)", "#1e3a8a", 1.5);
    for (let i = 0; i < 6; i++) circle(ctx, -60 + i * 25, (i % 2 ? 30 : -30), 5, "rgba(255,255,255,0.8)", "#93c5fd", 1);
  }
  ctx.restore();
  text(ctx, p.org === "yeast" ? "Yeast — budding" : "Amoeba — binary fission", 320, 30, { size: 14, color: "#fff", weight: 800 });
}

/* --------------------------------------------------- LABEL THE DIAGRAM */
const DIAGRAMS = {
  seed: {
    draw(ctx) {
      // bean seed split open (two cotyledons) with embryo axis
      ctx.fillStyle = "#fde68a"; ctx.strokeStyle = "#a16207"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(250, 200, 150, 105, -0.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); // cotyledon
      ctx.fillStyle = "#fef3c7"; ctx.beginPath(); ctx.ellipse(420, 210, 120, 95, 0.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); // other cotyledon
      ctx.strokeStyle = "#7c2d12"; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(250, 200, 160, 115, -0.2, 0.2, 1.2); ctx.stroke(); // seed coat edge
      ctx.fillStyle = "#86efac"; ctx.beginPath(); ctx.ellipse(180, 150, 28, 14, -0.7, 0, Math.PI * 2); ctx.fill(); // plumule
      ctx.fillStyle = "#4ade80"; ctx.beginPath(); ctx.moveTo(165, 160); ctx.lineTo(120, 230); ctx.lineTo(132, 236); ctx.lineTo(178, 168); ctx.fill(); // radicle
      ctx.fillStyle = "#78350f"; ctx.beginPath(); ctx.ellipse(110, 260, 14, 8, 0.3, 0, Math.PI * 2); ctx.fill(); // micropyle region / hilum
    },
    parts: [
      { type: "cotyledon", l: { en: "Cotyledon", kn: "ಬೀಜದಳ" }, x: 290, y: 230, r: 60 },
      { type: "plumule", l: { en: "Plumule (future shoot)", kn: "ಪ್ಲುಮ್ಯೂಲ್ (ಭವಿಷ್ಯದ ಕಾಂಡ)" }, x: 180, y: 150, r: 24 },
      { type: "radicle", l: { en: "Radicle (future root)", kn: "ರ್ಯಾಡಿಕಲ್ (ಭವಿಷ್ಯದ ಬೇರು)" }, x: 140, y: 205, r: 22 },
      { type: "seedcoat", l: { en: "Seed coat", kn: "ಬೀಜ ಕವಚ" }, x: 355, y: 120, r: 26 },
      { type: "hilum", l: { en: "Hilum / Micropyle", kn: "ಹೈಲಮ್ / ಮೈಕ್ರೋಪೈಲ್" }, x: 110, y: 260, r: 18 },
    ],
  },
  flower: {
    draw(ctx) {
      // longitudinal section of a hibiscus-like flower
      ctx.fillStyle = "#86efac"; ctx.beginPath(); ctx.moveTo(310, 370); ctx.lineTo(330, 370); ctx.lineTo(328, 300); ctx.lineTo(312, 300); ctx.fill(); // pedicel
      ctx.fillStyle = "#22c55e"; ctx.beginPath(); ctx.moveTo(320, 300); ctx.quadraticCurveTo(260, 290, 250, 250); ctx.lineTo(300, 270); ctx.fill(); ctx.beginPath(); ctx.moveTo(320, 300); ctx.quadraticCurveTo(380, 290, 390, 250); ctx.lineTo(340, 270); ctx.fill(); // sepals
      ctx.fillStyle = "#f472b6"; ctx.strokeStyle = "#be185d"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(300, 275); ctx.bezierCurveTo(180, 240, 120, 120, 200, 80); ctx.bezierCurveTo(250, 90, 290, 180, 312, 260); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(340, 275); ctx.bezierCurveTo(460, 240, 520, 120, 440, 80); ctx.bezierCurveTo(390, 90, 350, 180, 328, 260); ctx.fill(); ctx.stroke(); // petals
      ctx.fillStyle = "#fef3c7"; ctx.strokeStyle = "#a16207"; ctx.beginPath(); ctx.ellipse(320, 262, 18, 22, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); // ovary
      circle(ctx, 314, 262, 4, "#86efac"); circle(ctx, 326, 268, 4, "#86efac"); // ovules
      line(ctx, 320, 240, 320, 90, "#d97706", 4); // style
      [-10, 0, 10].forEach((d) => circle(ctx, 320 + d, 84, 6, "#dc2626")); // stigma
      for (let k = 0; k < 6; k++) { const yy = 150 + k * 14; line(ctx, 320, yy, 300 - (k % 2) * 10, yy - 12, "#facc15", 2); circle(ctx, 298 - (k % 2) * 10, yy - 14, 4, "#eab308"); line(ctx, 320, yy, 340 + (k % 2) * 10, yy - 12, "#facc15", 2); circle(ctx, 342 + (k % 2) * 10, yy - 14, 4, "#eab308"); }
    },
    parts: [
      { type: "petal", l: { en: "Petal (corolla)", kn: "ದಳ (ಪುಷ್ಪಪಾತ್ರ)" }, x: 190, y: 150, r: 45 },
      { type: "sepal", l: { en: "Sepal (calyx)", kn: "ಪುಷ್ಪಪತ್ರ" }, x: 262, y: 270, r: 22 },
      { type: "stigma", l: { en: "Stigma", kn: "ಶಲಾಕಾಗ್ರ" }, x: 320, y: 84, r: 18 },
      { type: "style", l: { en: "Style", kn: "ಶಲಾಕೆ" }, x: 320, y: 115, r: 10 },
      { type: "anther", l: { en: "Anther (stamen)", kn: "ಪರಾಗಕೋಶ (ಕೇಸರ)" }, x: 300, y: 150, r: 14 },
      { type: "ovary", l: { en: "Ovary", kn: "ಅಂಡಾಶಯ" }, x: 320, y: 262, r: 20 },
      { type: "pedicel", l: { en: "Pedicel (stalk)", kn: "ತೊಟ್ಟು" }, x: 320, y: 345, r: 18 },
    ],
  },
};
export function LabelDiagram({ exp, x, setX, t }) {
  const D = DIAGRAMS[exp.opts.diagram];
  const [order, setOrder] = useState(() => D.parts.map((_, i) => i));
  const [idx, setIdx] = useState(0);
  const [fb, setFb] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const target = D.parts[order[idx % order.length]];
  useEffect(() => { setX({ score: 0, tries: 0, part: null, ok: null }); }, []);
  const onPointer = (type, pt) => {
    if (type !== "down") return;
    const hit = D.parts.find((p) => Math.hypot(p.x - pt.x, p.y - pt.y) < p.r);
    const ok = hit && hit.type === target.type;
    setX({ tries: (x.tries || 0) + 1, score: (x.score || 0) + (ok ? 1 : 0), part: target.l, ok: ok ? { en: "✓ Correct", kn: "✓ ಸರಿ" } : { en: "✗ Wrong", kn: "✗ ತಪ್ಪು" } });
    setFb({ ok, at: pt }); setTimeout(() => setFb(null), 800);
    if (ok) setIdx((i) => i + 1);
  };
  const draw = (ctx) => {
    D.draw(ctx);
    if (showAll) D.parts.forEach((p) => { circle(ctx, p.x, p.y, 4, "#0f172a"); rr(ctx, p.x + 8, p.y - 10, ctx.measureText(t(p.l)).width + 16, 20, 6); ctx.fillStyle = "rgba(15,23,42,0.8)"; ctx.fill(); text(ctx, t(p.l), p.x + 16, p.y, { size: 11, color: "#fff", align: "left" }); });
    rr(ctx, 170, 6, 300, 30, 15); ctx.fillStyle = "#4f46e5"; ctx.fill();
    text(ctx, `🎯 ${t({ en: "Click on", kn: "ಕ್ಲಿಕ್ ಮಾಡಿ" })}: ${t(target.l)}`, 320, 21, { size: 13, color: "#fff", weight: 700 });
    if (fb) text(ctx, fb.ok ? "✓" : "✗", fb.at.x, fb.at.y - 14, { size: 26, color: fb.ok ? "#16a34a" : "#dc2626", weight: 900 });
  };
  return (
    <div>
      <SimCanvas draw={draw} w={W} h={380} onPointer={onPointer} cursor="crosshair" />
      <Panel>
        <button className="btn-ghost" onClick={() => setShowAll((s) => !s)}>🏷️ {t({ en: "Show / hide all labels", kn: "ಎಲ್ಲಾ ಹೆಸರುಗಳನ್ನು ತೋರಿಸಿ / ಮರೆಮಾಡಿ" })}</button>
        <button className="btn-ghost" onClick={() => { setOrder([...order].sort(() => Math.random() - 0.5)); setIdx(0); setX({ score: 0, tries: 0 }); }}>🔀 {t({ en: "Shuffle & restart", kn: "ಮರುಆರಂಭಿಸಿ" })}</button>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------ STAGE QUIZ (meiosis) */
const MEIOSIS = [
  { k: "P1", l: { en: "Prophase I", kn: "ಪ್ರೋಫೇಸ್ I" } }, { k: "M1", l: { en: "Metaphase I", kn: "ಮೆಟಾಫೇಸ್ I" } },
  { k: "A1", l: { en: "Anaphase I", kn: "ಅನಾಫೇಸ್ I" } }, { k: "T1", l: { en: "Telophase I", kn: "ಟೀಲೋಫೇಸ್ I" } },
  { k: "M2", l: { en: "Metaphase II", kn: "ಮೆಟಾಫೇಸ್ II" } }, { k: "A2", l: { en: "Anaphase II", kn: "ಅನಾಫೇಸ್ II" } },
  { k: "T2", l: { en: "Telophase II", kn: "ಟೀಲೋಫೇಸ್ II" } },
];
function chrom(ctx, x, y, color, rot = 0, pair = true) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = color;
  rr(ctx, -3, -14, 6, 28, 3); ctx.fill(); if (pair) { rr(ctx, 4, -14, 6, 28, 3); ctx.fill(); circle(ctx, 3.5, 0, 3, "#0f172a"); }
  ctx.restore();
}
function drawMeiosis(ctx, k, time) {
  const cell = (cx, cy, rx, ry) => { ctx.fillStyle = "rgba(254,243,199,0.8)"; ctx.strokeStyle = "#a16207"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); };
  const R = "#dc2626", B = "#2563eb";
  if (k === "P1") { cell(320, 190, 150, 120); ctx.setLineDash([4, 4]); circle(ctx, 320, 190, 80, null, "#a16207", 1.5); ctx.setLineDash([]);
    chrom(ctx, 290, 170, R, 0.4); chrom(ctx, 302, 170, B, 0.4); chrom(ctx, 340, 210, R, -0.6); chrom(ctx, 352, 210, B, -0.6); text(ctx, "Homologues pair (synapsis), crossing over", 320, 345, { size: 12, color: "#64748b" }); }
  else if (k === "M1") { cell(320, 190, 150, 120); line(ctx, 320, 80, 320, 300, "#cbd5e1", 1, [4, 4]);
    [[150], [230]].forEach(([y], i) => { chrom(ctx, 306, y - 0, i ? B : R, Math.PI / 2); chrom(ctx, 334, y, i ? R : B, Math.PI / 2); }); }
  else if (k === "A1") { cell(320, 190, 170, 115); [[-1, 150], [1, 230]].forEach(([s, y], i) => { chrom(ctx, 320 - 80, y, i ? B : R, Math.PI / 2); chrom(ctx, 320 + 80, y, i ? R : B, Math.PI / 2); }); line(ctx, 240, 190, 400, 190, "#cbd5e1", 1, [4, 4]); }
  else if (k === "T1") { cell(220, 190, 95, 100); cell(420, 190, 95, 100); chrom(ctx, 210, 180, R); chrom(ctx, 235, 200, B); chrom(ctx, 410, 180, B); chrom(ctx, 435, 200, R); }
  else if (k === "M2") { [[180], [460]].forEach(([cx], j) => { cell(cx, 190, 90, 110); line(ctx, cx, 90, cx, 290, "#cbd5e1", 1, [4, 4]); chrom(ctx, cx - 4, 160, j ? B : R, Math.PI / 2); chrom(ctx, cx - 4, 220, j ? R : B, Math.PI / 2); }); }
  else if (k === "A2") { [[180], [460]].forEach(([cx], j) => { cell(cx, 190, 100, 105); [-45, 45].forEach((d) => { chrom(ctx, cx + d, 165, j ? B : R, Math.PI / 2, false); chrom(ctx, cx + d, 215, j ? R : B, Math.PI / 2, false); }); }); }
  else { [[160, 120], [300, 120], [340, 260], [480, 260]].forEach(([cx, cy], j) => { cell(cx, cy, 60, 55); chrom(ctx, cx - 8, cy, j % 2 ? R : B, 0.3, false); chrom(ctx, cx + 8, cy, j % 2 ? B : R, -0.3, false); }); text(ctx, "4 haploid cells", 320, 350, { size: 12, color: "#64748b" }); }
}
export function StageQuiz({ x, setX, t }) {
  const [cur, setCur] = useState(() => Math.floor(Math.random() * MEIOSIS.length));
  const [pick, setPick] = useState(null);
  useEffect(() => { setX({ correct: 0, total: 0 }); }, []);
  const answer = (i) => {
    if (pick != null) return; setPick(i);
    const ok = i === cur;
    setX({ correct: (x.correct || 0) + (ok ? 1 : 0), total: (x.total || 0) + 1, shown: MEIOSIS[cur].l, said: MEIOSIS[i].l, ok: ok ? { en: "✓", kn: "✓" } : { en: "✗", kn: "✗" } });
  };
  const next = () => { setPick(null); setCur((c) => (c + 1 + Math.floor(Math.random() * (MEIOSIS.length - 1))) % MEIOSIS.length); };
  const draw = (ctx, time) => { ctx.fillStyle = "#fffbeb"; ctx.fillRect(0, 0, W, 380); drawMeiosis(ctx, MEIOSIS[cur].k, time); text(ctx, t({ en: "Which stage of meiosis is this?", kn: "ಇದು ಅರೆವಿದಳನದ ಯಾವ ಹಂತ?" }), 320, 24, { size: 15, weight: 800 }); };
  return (
    <div>
      <SimCanvas draw={draw} w={W} h={380} />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
        {MEIOSIS.map((m, i) => (
          <button key={m.k} onClick={() => answer(i)}
            className={`px-3 py-2 rounded-xl border-2 text-sm font-semibold ${pick == null ? "border-slate-200 hover:border-indigo-300" : i === cur ? "border-emerald-500 bg-emerald-50" : i === pick ? "border-rose-400 bg-rose-50" : "border-slate-200 opacity-60"}`}>{t(m.l)}</button>
        ))}
        <button className="btn-primary" onClick={next} disabled={pick == null}>{t({ en: "Next slide →", kn: "ಮುಂದಿನ ಸ್ಲೈಡ್ →" })}</button>
      </div>
    </div>
  );
}

/* ----------------------------------------------- TIMED SETUPS (generic) */
function useTimer(deps, onReset) {
  const st = useRef({ t: 0, run: false, speed: 10 });
  useEffect(() => { st.current.t = 0; st.current.run = false; onReset?.(); }, deps);
  return st;
}
function Controls({ st, t, x, setX, label, extra }) {
  return (
    <Panel>
      <button className="btn-primary" onClick={() => { st.current.run = !st.current.run; }}>⏯ {t(label || { en: "Start / pause", kn: "ಪ್ರಾರಂಭ / ವಿರಾಮ" })}</button>
      {[5, 10, 30].map((v) => <button key={v} className="btn-ghost text-sm" onClick={() => (st.current.speed = v)}>{v}×</button>)}
      <button className="btn-ghost" onClick={() => { st.current.t = 0; st.current.run = false; setX({ time: 0 }); }}>🔄 {t("reset")}</button>
      {extra}
    </Panel>
  );
}

/* OSMOSIS — potato osmometer */
export function Osmosis({ p, r, x, setX, t }) {
  const st = useTimer([p.conc], () => setX({ time: 0 }));
  const draw = (ctx, time, dt) => {
    const s = st.current;
    if (s.run) { s.t += (dt * s.speed) / 60; if (Math.floor(s.t * 2) !== Math.floor((s.t - (dt * s.speed) / 60) * 2)) setX({ time: +s.t.toFixed(1) }); if (s.t >= 120) s.run = false; }
    const rise = r.riseAt ? r.riseAt(s.t) : 0;
    beaker(ctx, 150, 140, 340, 220, 0.6, "rgba(147,197,253,0.45)", "Water (hypotonic)");
    // potato
    ctx.fillStyle = "#e7c27d"; ctx.strokeStyle = "#a16207"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(250, 110); ctx.lineTo(390, 110); ctx.lineTo(380, 300); ctx.quadraticCurveTo(320, 320, 260, 300); ctx.closePath(); ctx.fill(); ctx.stroke();
    // cavity
    const base = 170, cav = 270;
    ctx.fillStyle = "#fef3c7"; ctx.fillRect(285, base - 50, 70, cav - base + 50);
    const lvl = base - rise * 1.6;
    ctx.fillStyle = `rgba(234,179,8,${0.25 + (p.conc || 0) * 0.4})`; ctx.fillRect(287, lvl, 66, cav - lvl);
    line(ctx, 280, base, 360, base, "#dc2626", 2); circle(ctx, 280, base, 4, "#dc2626"); text(ctx, "Pin (initial level)", 200, base, { size: 11, color: "#dc2626" });
    // arrows of water entering
    if (s.run && (p.conc || 0) > 0) for (let k = 0; k < 4; k++) { const yy = 200 + k * 20; const off = (time * 20 + k * 8) % 20; text(ctx, "→", 255 + off, yy, { size: 14, color: "#2563eb" }); text(ctx, "←", 385 - off, yy, { size: 14, color: "#2563eb" }); }
    rr(ctx, 470, 40, 150, 90, 14); ctx.fillStyle = "#0f172a"; ctx.fill();
    text(ctx, `${s.t.toFixed(0)} min`, 545, 70, { size: 22, color: "#4ade80", weight: 800 });
    text(ctx, `Rise = ${rise.toFixed(1)} mm`, 545, 105, { size: 13, color: "#e2e8f0" });
    text(ctx, `Sucrose in cavity: ${(p.conc || 0).toFixed(1)} M`, 320, 30, { size: 13, weight: 700, color: "#a16207" });
  };
  return <div><SimCanvas draw={draw} w={W} h={390} /><Controls st={st} t={t} x={x} setX={setX} /></div>;
}

/* PHOTOSYNTHESIS — Hydrilla bubbles */
export function Photosynthesis({ p, r, x, setX, t }) {
  const st = useRef({ t: 0, counting: false, n: 0, acc: 0, bubbles: [] });
  useEffect(() => { st.current.counting = false; st.current.n = 0; setX({ count: null }); }, [p.d, p.co2, p.light]);
  const draw = (ctx, time, dt) => {
    const s = st.current;
    const rate = r.rateTrue || 0; // per min
    s.acc += (rate / 60) * dt * 6; // shown 6× faster
    while (s.acc >= 1) { s.acc -= 1; s.bubbles.push({ y: 0, x: (Math.random() - 0.5) * 4 }); if (s.counting) s.n++; }
    if (s.counting) { s.t += dt * 6; if (s.t >= 60) { s.counting = false; setX({ count: s.n }); } }
    // lamp
    const lx = 520 - (50 - p.d) * 0 , beakerX = 160;
    const lampX = beakerX + 140 + p.d * 5;
    const col = { white: "255,250,220", red: "248,113,113", blue: "96,165,250", green: "74,222,128" }[p.light || "white"];
    const glow = ctx.createRadialGradient(lampX, 150, 5, lampX, 150, 220); glow.addColorStop(0, `rgba(${col},0.55)`); glow.addColorStop(1, `rgba(${col},0)`);
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, 380);
    rr(ctx, lampX - 10, 110, 40, 80, 10); ctx.fillStyle = "#334155"; ctx.fill(); circle(ctx, lampX, 150, 18, `rgb(${col})`);
    line(ctx, lampX + 20, 190, lampX + 20, 360, "#334155", 4);
    text(ctx, `${p.d} cm`, (beakerX + 140 + lampX) / 2, 360, { size: 12, color: "#475569" });
    line(ctx, beakerX + 140, 345, lampX, 345, "#94a3b8", 1, [4, 3]);
    beaker(ctx, beakerX, 120, 140, 220, 0.85, "rgba(147,197,253,0.4)");
    // inverted funnel & test tube
    ctx.strokeStyle = "#64748b"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(beakerX + 20, 320); ctx.lineTo(beakerX + 62, 260); ctx.lineTo(beakerX + 62, 200); ctx.moveTo(beakerX + 120, 320); ctx.lineTo(beakerX + 78, 260); ctx.lineTo(beakerX + 78, 200); ctx.stroke();
    testTube(ctx, beakerX + 58, 80, 24, 130, 0.92, "rgba(147,197,253,0.4)");
    // hydrilla
    ctx.strokeStyle = "#15803d"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(beakerX + 70, 320); ctx.lineTo(beakerX + 70, 250); ctx.stroke();
    for (let k = 0; k < 8; k++) { const yy = 315 - k * 9; line(ctx, beakerX + 70, yy, beakerX + 70 + (k % 2 ? 14 : -14), yy - 6, "#22c55e", 2); }
    s.bubbles.forEach((b) => { b.y += dt * 90; circle(ctx, beakerX + 70 + b.x, 250 - b.y, 3, null, "#e0f2fe", 1.5); });
    s.bubbles = s.bubbles.filter((b) => b.y < 150);
    rr(ctx, 30, 30, 160, 80, 14); ctx.fillStyle = "#0f172a"; ctx.fill();
    text(ctx, s.counting ? `${s.t.toFixed(0)} s / 60 s` : "Bubble counter", 110, 52, { size: 12, color: "#94a3b8" });
    text(ctx, `${s.counting ? s.n : x.count ?? "—"}`, 110, 85, { size: 26, color: "#4ade80", weight: 800 });
  };
  return (
    <div>
      <SimCanvas draw={draw} w={W} h={380} />
      <Panel><button className="btn-primary" onClick={() => { st.current.counting = true; st.current.t = 0; st.current.n = 0; setX({ count: null }); }}>⏱ {t({ en: "Count bubbles for 1 minute", kn: "1 ನಿಮಿಷ ಗುಳ್ಳೆಗಳನ್ನು ಎಣಿಸಿ" })}</button></Panel>
    </div>
  );
}

/* LEAF STARCH TEST — light is necessary */
export function LeafStarch({ p, x, setX, t }) {
  useEffect(() => { setX({ step: 0 }); }, [p.destarch, p.cover, p.hours]);
  const step = x.step || 0;
  const STEPS = [
    { en: "1. Expose to sunlight", kn: "1. ಸೂರ್ಯನ ಬೆಳಕಿಗೆ ಇಡಿ" }, { en: "2. Pluck & boil in water", kn: "2. ಕಿತ್ತು ನೀರಿನಲ್ಲಿ ಕುದಿಸಿ" },
    { en: "3. Boil in alcohol", kn: "3. ಆಲ್ಕೋಹಾಲ್‌ನಲ್ಲಿ ಕುದಿಸಿ" }, { en: "4. Add iodine", kn: "4. ಅಯೋಡಿನ್ ಹಾಕಿ" },
  ];
  const starchIn = (covered) => (p.destarch === "no" ? 1 : covered ? 0 : clamp(p.hours / 4, 0, 1));
  const draw = (ctx, time) => {
    const lx = 230, ly = 200;
    const leafPath = () => { ctx.beginPath(); ctx.moveTo(lx - 170, ly); ctx.bezierCurveTo(lx - 100, ly - 130, lx + 120, ly - 120, lx + 170, ly); ctx.bezierCurveTo(lx + 120, ly + 120, lx - 100, ly + 130, lx - 170, ly); ctx.closePath(); };
    const base = step < 3 ? (step === 2 ? "#ecfccb" : "#22c55e") : null;
    ctx.save(); leafPath(); ctx.clip();
    if (step < 4 || !base) {
      if (step >= 4) {
        // iodine result
        const cov = starchIn(true), exp = starchIn(false);
        const col = (k) => `rgb(${Math.round(180 - 150 * k)},${Math.round(120 - 100 * k)},${Math.round(40 + 40 * k)})`;
        ctx.fillStyle = col(exp); ctx.fillRect(lx - 180, ly - 140, 360, 280);
        if (p.cover !== "none") { ctx.fillStyle = col(cov); ctx.fillRect(lx - 40, ly - 140, 80, 280); }
      } else {
        ctx.fillStyle = step >= 3 ? "#f7fee7" : step === 2 ? "#4ade80" : "#16a34a"; ctx.fillRect(lx - 180, ly - 140, 360, 280);
      }
    }
    ctx.restore();
    leafPath(); ctx.strokeStyle = "#14532d"; ctx.lineWidth = 2.5; ctx.stroke();
    line(ctx, lx - 170, ly, lx + 170, ly, step >= 4 ? "#78350f" : "#14532d", 2);
    for (let k = -3; k <= 3; k++) if (k) { line(ctx, lx + k * 40, ly, lx + k * 40 + 30, ly - 60, "#14532d", 1); line(ctx, lx + k * 40, ly, lx + k * 40 + 30, ly + 60, "#14532d", 1); }
    line(ctx, lx - 170, ly, lx - 230, ly + 20, "#14532d", 4);
    // black paper strip
    if (p.cover !== "none" && step < 2) { ctx.fillStyle = "rgba(15,23,42,0.92)"; ctx.fillRect(lx - 40, ly - 115, 80, 230); text(ctx, "Black paper", lx, ly - 125, { size: 11 }); }
    // sun
    if (step === 1) { circle(ctx, 560, 60, 30, "#facc15"); for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2 + time * 0.3; line(ctx, 560 + Math.cos(a) * 38, 60 + Math.sin(a) * 38, 560 + Math.cos(a) * 52, 60 + Math.sin(a) * 52, "#f59e0b", 3); } text(ctx, `${p.hours} h`, 560, 110, { size: 13, weight: 800 }); }
    if (step === 3) { text(ctx, "Chlorophyll removed — leaf is pale", 230, 360, { size: 12, color: "#65a30d" }); }
    if (step >= 4) {
      text(ctx, "Blue-black = starch present", 520, 150, { size: 12, color: "#1e3a8a" }); circle(ctx, 430, 150, 8, "rgb(30,20,80)");
      text(ctx, "Brown = no starch", 505, 180, { size: 12, color: "#92400e" }); circle(ctx, 430, 180, 8, "rgb(180,120,40)");
    }
    text(ctx, p.destarch === "no" ? "⚠ Plant NOT destarched" : "Plant destarched (kept in dark 48 h)", 230, 24, { size: 13, color: p.destarch === "no" ? "#dc2626" : "#475569", weight: 700 });
  };
  return (
    <div>
      <SimCanvas draw={draw} w={W} h={380} />
      <div className="flex flex-wrap gap-2 mt-3">
        {STEPS.map((s, i) => (
          <button key={i} onClick={() => setX({ step: i + 1, covered: starchIn(true) > 0.5 ? { en: "Blue-black", kn: "ನೀಲಿ-ಕಪ್ಪು" } : { en: "Brown", kn: "ಕಂದು" }, exposed: starchIn(false) > 0.5 ? { en: "Blue-black", kn: "ನೀಲಿ-ಕಪ್ಪು" } : { en: "Brown", kn: "ಕಂದು" } })}
            disabled={i > step} className={`px-3 py-2 rounded-xl text-sm font-semibold border-2 ${step > i ? "border-emerald-400 bg-emerald-50" : i === step ? "border-indigo-500 bg-indigo-50" : "border-slate-200 opacity-50"}`}>{t(s)}</button>
        ))}
        <button className="btn-ghost text-sm" onClick={() => setX({ step: 0 })}>🔄 {t("reset")}</button>
      </div>
    </div>
  );
}

/* RESPIRATION — CO2 released */
export function Respiration({ p, r, x, setX, t }) {
  const st = useTimer([p.seeds, p.koh, p.temp], () => setX({ time: 0 }));
  const draw = (ctx, time, dt) => {
    const s = st.current;
    if (s.run) { const d = (dt * s.speed) / 60; s.t += d; if (Math.floor(s.t * 2) !== Math.floor((s.t - d) * 2)) setX({ time: +s.t.toFixed(1) }); if (s.t > 120) s.run = false; }
    const rise = r.riseAt ? r.riseAt(s.t) : 0;
    // conical flask
    ctx.strokeStyle = "#64748b"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(150, 100); ctx.lineTo(150, 160); ctx.lineTo(80, 320); ctx.quadraticCurveTo(170, 335, 260, 320); ctx.lineTo(190, 160); ctx.lineTo(190, 100); ctx.stroke();
    const R = rnd(5); for (let i = 0; i < 40; i++) { const sx = 100 + R() * 140, sy = 300 + R() * 18; ctx.fillStyle = p.seeds === "boiled" ? "#a8a29e" : "#d9f99d"; ctx.beginPath(); ctx.ellipse(sx, sy, 7, 4, R(), 0, Math.PI * 2); ctx.fill(); if (p.seeds !== "boiled") line(ctx, sx, sy, sx + 4, sy - 8, "#65a30d", 1.5); }
    text(ctx, p.seeds === "boiled" ? "Boiled seeds" : "Germinating seeds", 170, 350, { size: 12 });
    if (p.koh === "yes") { line(ctx, 170, 110, 170, 200, "#94a3b8", 1); testTube(ctx, 160, 200, 20, 60, 0.6, "rgba(226,232,240,0.9)"); text(ctx, "KOH", 200, 240, { size: 11, align: "left" }); }
    rr(ctx, 140, 88, 60, 16, 4); ctx.fillStyle = "#78350f"; ctx.fill(); // cork
    // bent tube to beaker
    ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(180, 96); ctx.lineTo(180, 50); ctx.lineTo(430, 50); ctx.lineTo(430, 300); ctx.stroke();
    ctx.strokeStyle = "rgba(59,130,246,0.85)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(430, 300); ctx.lineTo(430, 300 - rise * 2); ctx.stroke();
    beaker(ctx, 380, 250, 100, 100, 0.6, "rgba(147,197,253,0.45)", "Water");
    for (let k = 0; k <= 10; k++) { const yy = 300 - k * 20; line(ctx, 438, yy, 446, yy, "#475569", 1); if (k % 5 === 0) text(ctx, `${k * 10}`, 458, yy, { size: 10 }); }
    rr(ctx, 490, 40, 140, 90, 14); ctx.fillStyle = "#0f172a"; ctx.fill();
    text(ctx, `${s.t.toFixed(0)} min`, 560, 70, { size: 22, color: "#4ade80", weight: 800 });
    text(ctx, `Water rise ${rise.toFixed(1)} mm`, 560, 105, { size: 12, color: "#e2e8f0" });
  };
  return <div><SimCanvas draw={draw} w={W} h={380} /><Controls st={st} t={t} x={x} setX={setX} /></div>;
}

/* ENZYME — salivary amylase spot test */
export function Enzyme({ p, r, x, setX, t }) {
  const st = useTimer([p.temp, p.pH], () => setX({ tAch: null, time: 0 }));
  const draw = (ctx, time, dt) => {
    const s = st.current;
    if (s.run) { const d = (dt * s.speed) / 60; s.t += d; if (s.t >= 30) s.run = false; const tA = r.tAchTrue; if (tA && s.t >= tA && !x.tAch) setX({ tAch: +tA.toFixed(1) }); if (Math.floor(s.t) !== Math.floor(s.t - d)) setX({ time: Math.floor(s.t) }); }
    const starchAt = (m) => Math.exp(-(r.k || 0) * m);
    // water bath
    rr(ctx, 30, 90, 200, 200, 14); ctx.fillStyle = p.temp > 50 ? "rgba(248,113,113,0.35)" : p.temp < 15 ? "rgba(147,197,253,0.6)" : "rgba(251,191,36,0.3)"; ctx.fill(); ctx.strokeStyle = "#64748b"; ctx.lineWidth = 2; ctx.stroke();
    testTube(ctx, 110, 60, 40, 200, 0.6, `rgba(226,232,240,0.9)`); text(ctx, "Starch + amylase", 130, 305, { size: 11 });
    text(ctx, `${p.temp} °C · pH ${p.pH}`, 130, 330, { size: 14, weight: 800, color: "#4f46e5" });
    // spot tile 6x5
    rr(ctx, 270, 60, 340, 280, 16); ctx.fillStyle = "#f8fafc"; ctx.fill(); ctx.strokeStyle = "#cbd5e1"; ctx.stroke();
    for (let m = 0; m < 30; m++) {
      const cx = 305 + (m % 6) * 54, cy = 95 + Math.floor(m / 6) * 52;
      circle(ctx, cx, cy, 20, "#fff", "#cbd5e1", 1.5);
      if (m <= s.t) {
        const k = starchAt(m);
        circle(ctx, cx, cy, 16, `rgb(${Math.round(30 + 170 * (1 - k))},${Math.round(30 + 110 * (1 - k))},${Math.round(90 - 40 * (1 - k))})`);
      }
      text(ctx, `${m}`, cx, cy + 28, { size: 9, color: "#94a3b8" });
    }
    text(ctx, "Spot tile — 1 drop of mixture + iodine every minute", 440, 40, { size: 12, color: "#475569" });
    if (x.tAch) text(ctx, `✓ Achromic point at ${x.tAch} min (no blue colour)`, 440, 360, { size: 13, color: "#059669", weight: 800 });
  };
  return <div><SimCanvas draw={draw} w={W} h={380} /><Controls st={st} t={t} x={x} setX={setX} /></div>;
}

/* GENETICS — monohybrid / dihybrid with beads */
export function Genetics({ exp, p, x, setX, t }) {
  const di = exp.opts.type === "di";
  const [kids, setKids] = useState([]);
  useEffect(() => { setKids([]); setX({ crossed: false }); }, [p.p1, p.p2, p.n]);
  const gam = (g) => (di ? [g[0] + g[2], g[0] + g[3], g[1] + g[2], g[1] + g[3]] : [g[0], g[1]]);
  const cross = () => {
    const a = gam(p.p1), b = gam(p.p2), out = [];
    for (let i = 0; i < p.n; i++) {
      const ga = a[Math.floor(Math.random() * a.length)], gb = b[Math.floor(Math.random() * b.length)];
      out.push(di ? ga[0] + gb[0] + ga[1] + gb[1] : ga + gb);
    }
    setKids(out);
    const counts = {};
    out.forEach((k) => { const ph = pheno(k); counts[ph] = (counts[ph] || 0) + 1; });
    setX({ crossed: true, counts });
  };
  const pheno = (g) => di ? `${/R/.test(g.slice(0, 2)) ? "Round" : "Wrinkled"}-${/Y/.test(g.slice(2)) ? "Yellow" : "Green"}` : /T/.test(g) ? "Tall" : "Dwarf";
  const draw = (ctx) => {
    const a = gam(p.p1), b = gam(p.p2);
    // Punnett square
    const n = a.length, sz = di ? 46 : 70, ox = 40, oy = 60;
    text(ctx, "Punnett square", ox + (sz * (n + 1)) / 2, 30, { size: 13, weight: 800 });
    for (let i = 0; i < n; i++) { text(ctx, b[i] || "", ox + sz * (i + 1) + sz / 2, oy + sz / 2, { size: 13, color: "#be185d", weight: 800 }); text(ctx, a[i], ox + sz / 2, oy + sz * (i + 1) + sz / 2, { size: 13, color: "#2563eb", weight: 800 }); }
    for (let i = 0; i < n; i++) for (let j = 0; j < b.length; j++) {
      const g = di ? a[i][0] + b[j][0] + a[i][1] + b[j][1] : a[i] + b[j];
      const sorted = di ? [g.slice(0, 2).split("").sort().join(""), g.slice(2).split("").sort().join("")].join("") : g.split("").sort().join("");
      const ph = pheno(g);
      rr(ctx, ox + sz * (j + 1) + 2, oy + sz * (i + 1) + 2, sz - 4, sz - 4, 6);
      ctx.fillStyle = ph.startsWith("Tall") || ph === "Round-Yellow" ? "#dcfce7" : ph === "Dwarf" || ph === "Wrinkled-Green" ? "#fee2e2" : "#fef9c3"; ctx.fill();
      text(ctx, sorted, ox + sz * (j + 1.5), oy + sz * (i + 1.5), { size: di ? 11 : 14 });
    }
    // offspring
    const gx = di ? 290 : 280;
    text(ctx, `F₂ offspring (${kids.length})`, gx + 160, 30, { size: 13, weight: 800 });
    kids.slice(0, 200).forEach((k, i) => {
      const cx = gx + 14 + (i % 20) * 16, cy = 60 + Math.floor(i / 20) * 30;
      const ph = pheno(k);
      if (di) { const yel = ph.includes("Yellow"), rnd2 = ph.includes("Round"); ctx.fillStyle = yel ? "#facc15" : "#4ade80"; ctx.beginPath(); if (rnd2) ctx.arc(cx, cy, 6, 0, Math.PI * 2); else { for (let a2 = 0; a2 < Math.PI * 2; a2 += 0.4) { const rr3 = 6 + (Math.round(a2 / 0.4) % 2 ? -2 : 0); ctx.lineTo(cx + Math.cos(a2) * rr3, cy + Math.sin(a2) * rr3); } } ctx.fill(); }
      else { const tall = ph === "Tall"; line(ctx, cx, cy + 12, cx, cy + (tall ? -12 : 4), "#15803d", 2); circle(ctx, cx - 3, cy + (tall ? -6 : 6), 3, "#22c55e"); circle(ctx, cx + 3, cy + (tall ? 0 : 8), 3, "#22c55e"); }
    });
    if (!kids.length) text(ctx, t({ en: "Press “Cross” to produce offspring", kn: "ಸಂತತಿ ಪಡೆಯಲು “ಸಂಕರಣ” ಒತ್ತಿರಿ" }), gx + 160, 180, { size: 13, color: "#94a3b8" });
  };
  return (
    <div>
      <SimCanvas draw={draw} w={W} h={380} />
      <Panel><button className="btn-primary" onClick={cross}>🧬 {t({ en: "Cross (pick gametes at random)", kn: "ಸಂಕರಣ (ಯಾದೃಚ್ಛಿಕ ಲಿಂಗಾಣುಗಳು)" })}</button></Panel>
    </div>
  );
}

/* QUADRAT — population density & frequency */
export function Quadrat({ p, x, setX, t }) {
  const plants = useMemo(() => {
    const R = rnd(42), arr = [];
    for (let i = 0; i < 70; i++) arr.push({ x: 20 + R() * 600, y: 20 + R() * 300, s: "A" });
    for (let c = 0; c < 4; c++) { const cx = 80 + R() * 480, cy = 60 + R() * 220; for (let i = 0; i < 12; i++) arr.push({ x: cx + (R() - 0.5) * 80, y: cy + (R() - 0.5) * 60, s: "B" }); }
    for (let i = 0; i < 25; i++) arr.push({ x: 20 + R() * 600, y: 20 + R() * 300, s: "C" });
    return arr;
  }, []);
  const size = 70; // 1 m × 1 m
  const place = (qx, qy) => {
    qx = clamp(qx, size / 2, 640 - size / 2); qy = clamp(qy, size / 2, 340 - size / 2);
    const inside = plants.filter((pl) => Math.abs(pl.x - qx) < size / 2 && Math.abs(pl.y - qy) < size / 2);
    const c = { A: 0, B: 0, C: 0 }; inside.forEach((pl) => c[pl.s]++);
    setX({ q: { x: qx, y: qy }, nA: c.A, nB: c.B, nC: c.C, placed: (x.placed || 0) + 1 });
  };
  const onPointer = (type, pt) => { if (type === "down") place(pt.x, pt.y); };
  const draw = (ctx) => {
    ctx.fillStyle = "#dcfce7"; ctx.fillRect(0, 0, 640, 340);
    plants.forEach((pl) => {
      if (pl.s === "A") { for (let k = -1; k <= 1; k++) line(ctx, pl.x, pl.y + 6, pl.x + k * 4, pl.y - 6, "#16a34a", 2); }
      else if (pl.s === "B") { circle(ctx, pl.x, pl.y, 5, "#facc15", "#ca8a04", 1); circle(ctx, pl.x, pl.y, 2, "#ea580c"); }
      else { circle(ctx, pl.x, pl.y, 6, "#a855f7"); circle(ctx, pl.x + 4, pl.y - 3, 4, "#c084fc"); }
    });
    if (x.q) { ctx.strokeStyle = "#dc2626"; ctx.lineWidth = 3; ctx.strokeRect(x.q.x - size / 2, x.q.y - size / 2, size, size); text(ctx, "1 m²", x.q.x, x.q.y - size / 2 - 10, { size: 11, color: "#dc2626" }); }
    rr(ctx, 0, 340, 640, 40, 0); ctx.fillStyle = "#fff"; ctx.fill();
    text(ctx, "🌱 Grass (A)", 90, 360, { size: 12 }); text(ctx, "🌼 Daisy (B)", 260, 360, { size: 12 }); text(ctx, "🟣 Clover (C)", 430, 360, { size: 12 });
    text(ctx, t({ en: "Click to drop the quadrat", kn: "ಕ್ವಾಡ್ರಾಟ್ ಇಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ" }), 580, 360, { size: 11, color: "#64748b" });
  };
  return (
    <div>
      <SimCanvas draw={draw} w={W} h={380} onPointer={onPointer} cursor="crosshair" />
      <Panel><button className="btn-primary" onClick={() => place(Math.random() * 640, Math.random() * 340)}>🎲 {t({ en: "Random throw", kn: "ಯಾದೃಚ್ಛಿಕ ಎಸೆತ" })}</button></Panel>
    </div>
  );
}
