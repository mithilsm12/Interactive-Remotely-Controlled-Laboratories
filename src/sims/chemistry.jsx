import React, { useEffect, useRef, useState } from "react";
import { SimCanvas, clamp, rr, text, line, circle, beaker, testTube, bubbles, Panel, rnd } from "./util.jsx";

const W = 640;

/* -------------------------------------------------------------- TITRATION */
const IND = {
  phenolphthalein: { before: [226, 232, 240, 0.35], after: [236, 72, 153] },
  methylorange: { before: [250, 204, 21, 0.75], after: [234, 88, 12] },
  kmno4: { before: [226, 232, 240, 0.3], after: [219, 39, 119] },
};
export function Titration({ exp, x, setX, t }) {
  const o = exp.opts;
  const st = useRef({ v: 0, flow: 0, drops: [], lastPush: 0, flash: 0 });
  const vEq = o.vEq;
  const ind = IND[o.indicator];
  useEffect(() => { st.current.v = 0; setX({ V: 0, end: false }); }, []);
  const push = () => { const v = +st.current.v.toFixed(1); setX({ V: v, end: v >= vEq }); };
  const setFlow = (f) => { st.current.flow = f; if (!f) push(); };
  const drop = () => { st.current.v = Math.min(50, st.current.v + 0.1); st.current.drops.push({ y: 0 }); st.current.flash = 1; push(); };
  const refill = () => { st.current.v = 0; st.current.flow = 0; setX({ V: 0, end: false }); };

  const draw = (ctx, time, dt) => {
    const s = st.current;
    if (s.flow) {
      s.v = Math.min(50, s.v + s.flow * dt);
      if (Math.random() < s.flow * dt * 8) s.drops.push({ y: 0 });
      s.flash = Math.min(1, s.flash + dt * 2);
      if (time - s.lastPush > 0.15) { s.lastPush = time; push(); }
      if (s.v >= 50) { s.flow = 0; push(); }
    }
    s.flash = Math.max(0, s.flash - dt * (o.indicator === "kmno4" ? 0.8 : 1.5));
    // stand
    rr(ctx, 120, 20, 10, 360, 3); ctx.fillStyle = "#475569"; ctx.fill(); rr(ctx, 80, 372, 200, 12, 4); ctx.fill();
    rr(ctx, 120, 110, 90, 8, 3); ctx.fill();
    // burette
    const bx = 200, btop = 30, bh = 250;
    const lvl = btop + (s.v / 50) * bh;
    const tc = o.titrantColor || "rgba(147,197,253,0.55)";
    ctx.fillStyle = tc; ctx.fillRect(bx - 9, lvl, 18, btop + bh - lvl);
    ctx.strokeStyle = "#64748b"; ctx.lineWidth = 2; ctx.strokeRect(bx - 10, btop, 20, bh);
    for (let mL = 0; mL <= 50; mL += 1) { const y = btop + (mL / 50) * bh; line(ctx, bx - 10, y, bx - (mL % 5 ? 4 : 0), y, "#334155", mL % 5 ? 0.6 : 1); if (mL % 10 === 0) text(ctx, `${mL}`, bx - 22, y, { size: 9 }); }
    // tip & stopcock
    ctx.fillStyle = "#64748b"; ctx.beginPath(); ctx.moveTo(bx - 10, btop + bh); ctx.lineTo(bx + 10, btop + bh); ctx.lineTo(bx + 2, btop + bh + 40); ctx.lineTo(bx - 2, btop + bh + 40); ctx.fill();
    rr(ctx, bx - 18, btop + bh + 12, 36, 10, 3); ctx.fillStyle = s.flow ? "#22c55e" : "#1e293b"; ctx.fill();
    // drops
    s.drops.forEach((d) => { d.y += dt * 260; circle(ctx, bx, btop + bh + 44 + d.y, 2.5, tc); });
    s.drops = s.drops.filter((d) => d.y < 30);
    // flask
    const fx = bx, fy = 345;
    const over = s.v - vEq;
    let col;
    if (over >= 0) { const a = clamp(0.35 + over * 0.35, 0.35, 0.9); col = `rgba(${ind.after.join(",")},${a})`; }
    else if (s.flash > 0.05 && s.v > vEq - 3) col = `rgba(${ind.after.join(",")},${s.flash * 0.35})`;
    else col = `rgba(${ind.before.join(",")})`;
    if (over < 0 && o.indicator === "methylorange" && s.v > vEq - 1.5 && s.flash > 0.1) col = "rgba(249,115,22,0.6)";
    ctx.save();
    ctx.beginPath(); ctx.moveTo(fx - 14, fy - 70); ctx.lineTo(fx - 14, fy - 50); ctx.lineTo(fx - 55, fy); ctx.quadraticCurveTo(fx, fy + 12, fx + 55, fy); ctx.lineTo(fx + 14, fy - 50); ctx.lineTo(fx + 14, fy - 70);
    ctx.strokeStyle = "#64748b"; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(fx - 38, fy - 22); ctx.lineTo(fx - 55, fy); ctx.quadraticCurveTo(fx, fy + 12, fx + 55, fy); ctx.lineTo(fx + 38, fy - 22); ctx.closePath();
    ctx.fillStyle = col; ctx.fill(); ctx.restore();
    text(ctx, o.analyteLabel || "Conical flask", fx + 70, fy - 10, { size: 11, align: "left" });
    text(ctx, o.titrantLabel || "Titrant", bx + 18, btop + 6, { size: 11, align: "left" });
    // magnified reading
    rr(ctx, 360, 40, 250, 120, 14); ctx.fillStyle = "#0f172a"; ctx.fill();
    text(ctx, "Burette reading", 485, 62, { size: 12, color: "#94a3b8" });
    text(ctx, `${s.v.toFixed(1)} mL`, 485, 100, { size: 32, color: "#4ade80", weight: 800 });
    text(ctx, `Volume used = ${s.v.toFixed(1)} mL`, 485, 138, { size: 12, color: "#e2e8f0" });
    // status
    let msg, mc;
    if (over >= 0.4) { msg = "Over-shot! Colour too dark — refill and repeat"; mc = "#dc2626"; }
    else if (over >= 0) { msg = "✓ End point — permanent colour change"; mc = "#059669"; }
    else if (s.v > vEq - 2) { msg = "Near end point — add drop by drop!"; mc = "#d97706"; }
    else { msg = "Open the stopcock and swirl"; mc = "#475569"; }
    text(ctx, msg, 485, 190, { size: 13, color: mc, weight: 700 });
    text(ctx, `Indicator: ${o.indicatorLabel}`, 485, 220, { size: 11, color: "#64748b" });
  };
  return (
    <div>
      <SimCanvas draw={draw} w={W} h={390} />
      <Panel>
        <button className="btn-primary" onClick={() => setFlow(2)}>⏩ {t({ en: "Open fast", kn: "ವೇಗವಾಗಿ ತೆರೆಯಿರಿ" })}</button>
        <button className="btn-primary bg-violet-600 hover:bg-violet-700" onClick={() => setFlow(0.4)}>▶ {t({ en: "Open slow", kn: "ನಿಧಾನವಾಗಿ ತೆರೆಯಿರಿ" })}</button>
        <button className="btn-ghost" onClick={() => setFlow(0)}>⏹ {t({ en: "Close", kn: "ಮುಚ್ಚಿರಿ" })}</button>
        <button className="btn-ghost" onClick={drop}>💧 {t({ en: "1 drop", kn: "1 ಹನಿ" })}</button>
        <button className="btn-ghost" onClick={refill}>🔄 {t({ en: "Refill / new trial", kn: "ಮರುಭರ್ತಿ / ಹೊಸ ಪ್ರಯತ್ನ" })}</button>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------- pH TESTER */
export function phColor(pH) {
  const stops = [[0, [190, 18, 60]], [2, [239, 68, 68]], [4, [249, 115, 22]], [5.5, [250, 204, 21]], [7, [34, 197, 94]], [8.5, [20, 184, 166]], [10, [37, 99, 235]], [12, [79, 70, 229]], [14, [126, 34, 206]]];
  const v = clamp(pH, 0, 14);
  for (let i = 0; i < stops.length - 1; i++) {
    const [a, ca] = stops[i], [b, cb] = stops[i + 1];
    if (v <= b) { const k = (v - a) / (b - a); return `rgb(${ca.map((c, j) => Math.round(c + (cb[j] - c) * k)).join(",")})`; }
  }
  return "rgb(126,34,206)";
}
export function PHTester({ exp, p, r, x, setX, t }) {
  const o = exp.opts;
  const sample = o.samples.find((s) => s.k === p.sample) || o.samples[0];
  useEffect(() => { setX({ dipped: false, guess: null }); }, [p.sample, p.dil]);
  const st = useRef({ a: 0 });
  const onPointer = (type, pt) => {
    if (type !== "down" || !x.dipped) return;
    if (pt.y > 330 && pt.y < 370 && pt.x > 40 && pt.x < 600) setX({ guess: Math.round(((pt.x - 40) / 560) * 14) });
  };
  const draw = (ctx, time, dt) => {
    const s = st.current; s.a = x.dipped ? Math.min(1, s.a + dt * 1.5) : 0;
    // rack
    rr(ctx, 30, 220, 300, 16, 4); ctx.fillStyle = "#a16207"; ctx.fill();
    o.samples.slice(0, 6).forEach((sm, i) => {
      const xx = 50 + i * 46, sel = sm.k === sample.k;
      testTube(ctx, xx, sel ? 90 : 120, 26, 110, 0.55, sm.color || "rgba(186,230,253,0.6)");
      if (sel) text(ctx, "▼", xx + 13, 76, { size: 14, color: "#4f46e5" });
    });
    text(ctx, t(sample.l), 180, 258, { size: 14, weight: 800, color: "#4f46e5" });
    // pH paper strip
    const sx = 450, dip = 1 - Math.abs(Math.sin(Math.min(1, s.a) * Math.PI)) * 0.0;
    rr(ctx, sx - 18, 60 + (1 - dip) * 0, 36, 150, 4); ctx.fillStyle = "#fef3c7"; ctx.fill(); ctx.strokeStyle = "#d6d3d1"; ctx.lineWidth = 1; ctx.stroke();
    if (x.dipped) { ctx.globalAlpha = s.a; rr(ctx, sx - 18, 130, 36, 80, 4); ctx.fillStyle = phColor(r.pH); ctx.fill(); ctx.globalAlpha = 1; }
    text(ctx, x.dipped ? t({ en: "Compare with chart ↓", kn: "ಚಾರ್ಟ್‌ನೊಂದಿಗೆ ಹೋಲಿಸಿ ↓" }) : t({ en: "Universal pH paper", kn: "ಸಾರ್ವತ್ರಿಕ pH ಕಾಗದ" }), sx, 228, { size: 12 });
    // chart
    for (let k = 0; k <= 14; k++) {
      const xx = 40 + (k / 14) * 560 - 18;
      rr(ctx, xx, 330, 36, 34, 6); ctx.fillStyle = phColor(k); ctx.fill();
      if (x.guess === k) { ctx.strokeStyle = "#0f172a"; ctx.lineWidth = 3; ctx.stroke(); }
      text(ctx, `${k}`, xx + 18, 347, { size: 12, color: "#fff", weight: 800 });
    }
    text(ctx, "Acidic ←", 70, 312, { size: 12, color: "#dc2626" }); text(ctx, "Neutral", 320, 312, { size: 12, color: "#16a34a" }); text(ctx, "→ Basic", 570, 312, { size: 12, color: "#4f46e5" });
    if (x.dipped && x.guess != null) {
      const ok = Math.abs(x.guess - r.pH) <= 1;
      text(ctx, ok ? `✓ Correct! pH ≈ ${r.pH.toFixed(1)}` : `✗ Look again — compare colours carefully`, 320, 285, { size: 14, color: ok ? "#059669" : "#dc2626", weight: 800 });
    } else if (x.dipped) text(ctx, t({ en: "Click the matching colour on the chart", kn: "ಚಾರ್ಟ್‌ನಲ್ಲಿ ಹೊಂದುವ ಬಣ್ಣವನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ" }), 320, 285, { size: 13, color: "#475569" });
  };
  return (
    <div>
      <SimCanvas draw={draw} w={W} h={380} onPointer={onPointer} cursor={x.dipped ? "pointer" : undefined} />
      <Panel>
        <button className="btn-primary" onClick={() => setX({ dipped: true })}>🧻 {t({ en: "Dip pH paper", kn: "pH ಕಾಗದ ಅದ್ದಿ" })}</button>
        <button className="btn-ghost" onClick={() => setX({ dipped: false, guess: null })}>🔄 {t("reset")}</button>
      </Panel>
    </div>
  );
}

/* ---------------------------------------------- REACTION BENCH (test tubes) */
export function Bench({ exp, p, x, setX, t }) {
  const o = exp.opts;
  const sample = o.samples.find((s) => s.k === p.sample) || o.samples[0];
  const reagent = o.reagents.find((s) => s.k === p.reagent) || o.reagents[0];
  const res = o.react[`${sample.k}|${reagent.k}`] || o.react[`*|${reagent.k}`] || o.react[`${sample.k}|*`] || { obs: { en: "No visible change", kn: "ಯಾವುದೇ ಗೋಚರ ಬದಲಾವಣೆ ಇಲ್ಲ" }, inf: { en: "No reaction", kn: "ಕ್ರಿಯೆ ಇಲ್ಲ" } };
  const st = useRef({ k: 0, pouring: false });
  const [idPick, setIdPick] = useState(null);
  useEffect(() => { st.current = { k: 0, pouring: false }; setX({ tested: false, sampleName: sample.l, reagentName: reagent.l, obs: null, inf: null }); }, [p.sample, p.reagent]);
  useEffect(() => { setIdPick(null); }, [p.sample]);
  const add = () => { st.current.pouring = true; st.current.k = 0; };
  const draw = (ctx, time, dt) => {
    const s = st.current;
    if (s.pouring) { s.k += dt * 0.8; if (s.k >= 1) { s.pouring = false; s.k = 1; setX({ tested: true, obs: res.obs, inf: res.inf, sampleName: sample.l, reagentName: reagent.l }); } }
    const k = x.tested ? 1 : s.k;
    // background bench
    rr(ctx, 0, 350, W, 40, 0); ctx.fillStyle = "#e7e5e4"; ctx.fill();
    // test tube with sample
    const tx = 250, ty = 90, tw = 60, th = 230;
    const baseCol = sample.color || "rgba(186,230,253,0.55)";
    const mixCol = res.c || baseCol;
    const lvl = 0.35 + (res.noAdd ? 0 : 0.15 * k);
    // colour blend
    ctx.save();
    testTube(ctx, tx, ty, tw, th, lvl, k > 0.5 ? mixCol : baseCol);
    if (res.solid && !x.tested) { /* solid sample */ }
    // precipitate
    if (res.ppt && k > 0.3) {
      const a = (k - 0.3) / 0.7;
      const R = rnd(7);
      for (let i = 0; i < 80 * a; i++) {
        const settle = x.tested ? Math.min(1, ((time * 0.3) % 6) / 1.2 + 0.4) : a;
        const px = tx + 10 + R() * (tw - 20), py = ty + th * (1 - lvl) + R() * th * lvl * (1 - settle * 0.85) + th * lvl * settle * 0.75;
        circle(ctx, px, Math.min(py, ty + th - 10), 2 + R() * 2, res.ppt);
      }
    }
    // gas bubbles
    if (res.gas && k > 0.3) bubbles(ctx, tx + 8, ty + th * (1 - lvl), tw - 16, th * lvl - 20, time, res.vigor || 25, "rgba(255,255,255,0.95)", 3);
    // foam (soap)
    if (res.foam != null && k > 0.3) {
      const fh = res.foam * 60 * Math.min(1, (k - 0.3) / 0.7);
      for (let i = 0; i < 30; i++) circle(ctx, tx + 8 + ((i * 37) % (tw - 16)), ty + th * (1 - lvl) - ((i * 13) % Math.max(1, fh)), 5 + (i % 3), "rgba(255,255,255,0.9)", "#cbd5e1", 1);
    }
    // heat glow
    if (res.heat && k > 0.5) { ctx.globalAlpha = 0.25 + 0.15 * Math.sin(time * 4); circle(ctx, tx + tw / 2, ty + th - 40, 50, "#f97316"); ctx.globalAlpha = 1; text(ctx, "🔥 warm", tx + tw + 60, ty + th - 40, { size: 12, color: "#ea580c" }); }
    // solid metal piece
    if (res.metal) { rr(ctx, tx + 18, ty + th - 50, 24, 30, 4); ctx.fillStyle = k > 0.5 && res.coat ? res.coat : res.metal; ctx.fill(); }
    ctx.restore();
    // dropper
    const dy = s.pouring ? 40 + Math.sin(s.k * Math.PI) * 20 : 20;
    rr(ctx, tx + tw / 2 - 7, dy, 14, 50, 4); ctx.fillStyle = reagent.color || "rgba(186,230,253,0.9)"; ctx.fill(); ctx.strokeStyle = "#64748b"; ctx.lineWidth = 1.5; ctx.stroke();
    rr(ctx, tx + tw / 2 - 10, dy - 22, 20, 24, 8); ctx.fillStyle = "#1e293b"; ctx.fill();
    if (s.pouring) circle(ctx, tx + tw / 2, dy + 60 + (s.k * 200) % 40, 3, reagent.color || "#93c5fd");
    text(ctx, t(sample.l), tx + tw / 2, ty + th + 22, { size: 13, weight: 800, color: "#0f172a" });
    rr(ctx, 14, 12, 200, 46, 10); ctx.fillStyle = "#eef2ff"; ctx.fill();
    text(ctx, t({ en: "Adding:", kn: "ಸೇರಿಸುತ್ತಿರುವುದು:" }), 26, 26, { size: 11, align: "left", color: "#64748b" });
    text(ctx, t(reagent.l), 26, 44, { size: 12, align: "left", color: "#4338ca", weight: 800 });
    // observation card
    rr(ctx, 380, 70, 240, 220, 14); ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 1.5; ctx.stroke();
    text(ctx, t({ en: "Observation", kn: "ಅವಲೋಕನ" }), 500, 92, { size: 13, color: "#4f46e5", weight: 800 });
    const wrap = (str, y, color) => {
      const words = str.split(" "); let ln = "", yy = y;
      ctx.font = `500 12px Inter, "Noto Sans Kannada", sans-serif`;
      words.forEach((w) => { const test = ln ? ln + " " + w : w; if (ctx.measureText(test).width > 215) { text(ctx, ln, 392, yy, { size: 12, align: "left", weight: 500, color }); ln = w; yy += 17; } else ln = test; });
      if (ln) text(ctx, ln, 392, yy, { size: 12, align: "left", weight: 500, color }); return yy + 17;
    };
    if (x.tested) {
      let yy = wrap(t(res.obs), 116, "#0f172a");
      text(ctx, t({ en: "Inference", kn: "ತೀರ್ಮಾನ" }), 500, yy + 12, { size: 13, color: "#059669", weight: 800 });
      wrap(t(res.inf), yy + 34, "#065f46");
    } else text(ctx, s.pouring ? "…" : t({ en: "Press “Add reagent”", kn: "“ಕಾರಕ ಸೇರಿಸಿ” ಒತ್ತಿರಿ" }), 500, 160, { size: 12, color: "#94a3b8" });
  };
  const idOk = o.identify && idPick != null ? o.identify.answer[sample.k] === idPick : null;
  return (
    <div>
      <SimCanvas draw={draw} w={W} h={390} />
      <Panel>
        <button className="btn-primary" onClick={add} disabled={x.tested}>💧 {t({ en: "Add reagent", kn: "ಕಾರಕ ಸೇರಿಸಿ" })}</button>
        <button className="btn-ghost" onClick={() => { st.current = { k: 0, pouring: false }; setX({ tested: false }); }}>🔄 {t({ en: "Fresh test tube", kn: "ಹೊಸ ಪರೀಕ್ಷಾ ನಳಿಕೆ" })}</button>
      </Panel>
      {o.identify && (
        <div className="mt-3 rounded-xl bg-violet-50 border border-violet-200 p-3">
          <p className="text-sm font-semibold text-violet-900 mb-2">🕵️ {t(o.identify.prompt)}</p>
          <div className="flex flex-wrap gap-2">
            {o.identify.choices.map((c, i) => (
              <button key={i} onClick={() => setIdPick(i)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border-2 ${idPick === i ? (idOk ? "border-emerald-500 bg-emerald-50" : "border-rose-400 bg-rose-50") : "border-violet-200 bg-white"}`}>{t(c)}</button>
            ))}
          </div>
          {idPick != null && <p className={`text-sm mt-2 font-semibold ${idOk ? "text-emerald-700" : "text-rose-700"}`}>{idOk ? t({ en: "✓ Correct identification!", kn: "✓ ಸರಿಯಾದ ಗುರುತು!" }) : t({ en: "✗ Not quite — run more tests and check the inferences.", kn: "✗ ಸರಿಯಿಲ್ಲ — ಇನ್ನಷ್ಟು ಪರೀಕ್ಷೆ ಮಾಡಿ." })}</p>}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------- RATE OF REACTION (cross) */
export function Rate({ p, r, x, setX, t }) {
  const st = useRef({ t: 0, run: false, speed: 1 });
  useEffect(() => { st.current.t = 0; st.current.run = false; setX({ time: null }); }, [p.conc, p.temp]);
  const draw = (ctx, time, dt) => {
    const s = st.current;
    if (s.run) { s.t += dt * s.speed; if (s.t >= r.tTrue) { s.run = false; setX({ time: +(r.tTrue + (Math.random() - 0.5) * 1.2).toFixed(1) }); } }
    const k = clamp(s.t / r.tTrue, 0, 1);
    // paper with X
    rr(ctx, 160, 300, 320, 60, 6); ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = "#e2e8f0"; ctx.stroke();
    line(ctx, 290, 312, 350, 348, "#0f172a", 8); line(ctx, 350, 312, 290, 348, "#0f172a", 8);
    // flask (seen from top-ish)
    ctx.save();
    ctx.beginPath(); ctx.moveTo(300, 80); ctx.lineTo(300, 140); ctx.lineTo(220, 320); ctx.quadraticCurveTo(320, 340, 420, 320); ctx.lineTo(340, 140); ctx.lineTo(340, 80);
    ctx.strokeStyle = "#64748b"; ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(266, 220); ctx.lineTo(220, 320); ctx.quadraticCurveTo(320, 340, 420, 320); ctx.lineTo(374, 220); ctx.closePath();
    ctx.fillStyle = `rgba(253,224,71,${0.08 + Math.pow(k, 1.4) * 0.92})`; ctx.fill();
    ctx.restore();
    // cross visibility through solution (draw over with turbidity)
    ctx.globalAlpha = Math.pow(k, 1.4) * 0.95; ctx.fillStyle = "#fef08a"; ctx.fillRect(280, 306, 80, 48); ctx.globalAlpha = 1;
    text(ctx, "Na₂S₂O₃ + HCl → S↓ (yellow, turbid)", 320, 50, { size: 13, color: "#a16207" });
    // stopwatch
    rr(ctx, 470, 90, 150, 100, 16); ctx.fillStyle = "#0f172a"; ctx.fill();
    text(ctx, "⏱", 545, 110, { size: 14, color: "#94a3b8" });
    text(ctx, `${s.t.toFixed(1)} s`, 545, 145, { size: 26, color: "#4ade80", weight: 800 });
    if (x.time) text(ctx, "✗ disappeared!", 545, 175, { size: 12, color: "#fbbf24" });
    text(ctx, `${p.temp} °C`, 90, 120, { size: 18, weight: 800, color: p.temp > 35 ? "#dc2626" : "#2563eb" });
    text(ctx, "🌡", 90, 160, { size: 30 });
  };
  return (
    <div>
      <SimCanvas draw={draw} w={W} h={380} />
      <Panel>
        <button className="btn-primary" onClick={() => { st.current.t = 0; st.current.run = true; setX({ time: null }); }}>▶ {t({ en: "Add HCl & start timer", kn: "HCl ಸೇರಿಸಿ ಸಮಯ ಪ್ರಾರಂಭಿಸಿ" })}</button>
        {[1, 5, 10].map((v) => <button key={v} className="btn-ghost text-sm" onClick={() => (st.current.speed = v)}>{v}×</button>)}
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------- CHROMATOGRAPHY */
export function Chroma({ exp, p, x, setX, t }) {
  const o = exp.opts;
  const st = useRef({ t: 0, run: false });
  useEffect(() => { setX({ front: 0, stopped: false }); }, []);
  const front = (tt) => o.maxFront * (1 - Math.exp(-tt / 25));
  const draw = (ctx, time, dt) => {
    const s = st.current;
    if (s.run) { s.t += dt * 3; if (Math.floor(s.t * 4) !== Math.floor((s.t - dt * 3) * 4)) setX({ front: +front(s.t).toFixed(2) }); }
    const f = front(s.t);
    const px = 260, pw = 120, base = 330, ppc = 20; // px per cm
    // jar
    rr(ctx, 210, 40, 220, 330, 14); ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = "rgba(186,230,253,0.5)"; ctx.fillRect(213, base + 10, 214, 357 - base);
    // paper
    ctx.fillStyle = "#fff"; ctx.fillRect(px, 60, pw, base + 30 - 60); ctx.strokeStyle = "#e2e8f0"; ctx.strokeRect(px, 60, pw, base + 30 - 60);
    // wet area
    ctx.fillStyle = "rgba(186,230,253,0.35)"; ctx.fillRect(px, base - f * ppc, pw, f * ppc + 30);
    line(ctx, px, base, px + pw, base, "#64748b", 1, [3, 3]); text(ctx, "Base line", px - 8, base, { size: 10, align: "right" });
    if (f > 0.2) { line(ctx, px, base - f * ppc, px + pw, base - f * ppc, "#2563eb", 1.5, [4, 3]); text(ctx, "Solvent front", px + pw + 8, base - f * ppc, { size: 10, align: "left", color: "#2563eb" }); }
    // spots
    o.components.forEach((c, i) => {
      const d = c.rf * f;
      const cx = px + pw / 2 + (o.spread ? (i - (o.components.length - 1) / 2) * 0 : 0);
      ctx.globalAlpha = 0.85; ctx.fillStyle = c.color;
      ctx.beginPath(); ctx.ellipse(cx, base - d * ppc, 14 + d * 0.8, 7 + d * 0.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
      if (p.spot === i && f > 0.5) { ctx.strokeStyle = "#0f172a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, base - d * ppc, 20 + d, 12 + d * 0.5, 0, 0, Math.PI * 2); ctx.stroke(); }
    });
    // ruler
    for (let c = 0; c <= 13; c++) { const y = base - c * ppc; line(ctx, 470, y, 470 + (c % 5 ? 8 : 14), y, "#475569", 1); text(ctx, `${c}`, 495, y, { size: 10 }); }
    text(ctx, "cm", 495, base - 14 * ppc, { size: 10 });
    text(ctx, `Solvent: ${o.solvent}`, 320, 22, { size: 12, color: "#475569" });
  };
  return (
    <div>
      <SimCanvas draw={draw} w={W} h={380} />
      <Panel>
        <button className="btn-primary" onClick={() => { st.current.run = true; setX({ stopped: false }); }}>▶ {t({ en: "Run solvent", kn: "ದ್ರಾವಕ ಹರಿಸಿ" })}</button>
        <button className="btn-ghost" onClick={() => { st.current.run = false; setX({ front: +front(st.current.t).toFixed(2), stopped: true }); }}>⏹ {t({ en: "Remove paper & mark front", kn: "ಕಾಗದ ತೆಗೆದು ಮುಂಚೂಣಿ ಗುರುತಿಸಿ" })}</button>
        <button className="btn-ghost" onClick={() => { st.current = { t: 0, run: false }; setX({ front: 0, stopped: false }); }}>🔄 {t("reset")}</button>
      </Panel>
    </div>
  );
}

/* ------------------------------------------- BALANCE + STANDARD SOLUTION */
export function Balance({ exp, x, setX, t }) {
  const o = exp.opts;
  useEffect(() => { setX({ mass: 0, water: 0, moved: false }); }, []);
  const addM = (d) => !x.moved && setX({ mass: Math.max(0, +((x.mass || 0) + d).toFixed(2)) });
  const addW = (d) => x.moved && setX({ water: Math.min(o.vol + 20, +((x.water || 0) + d).toFixed(1)) });
  const draw = (ctx) => {
    // balance
    rr(ctx, 40, 230, 250, 110, 14); ctx.fillStyle = "#e2e8f0"; ctx.fill();
    rr(ctx, 80, 300, 170, 30, 6); ctx.fillStyle = "#0f172a"; ctx.fill();
    text(ctx, `${(x.moved ? 0 : x.mass || 0).toFixed(2)} g`, 165, 315, { size: 18, color: "#4ade80", weight: 800 });
    rr(ctx, 90, 210, 150, 14, 6); ctx.fillStyle = "#94a3b8"; ctx.fill();
    if (!x.moved && x.mass > 0) { ctx.fillStyle = "#f8fafc"; ctx.beginPath(); ctx.ellipse(165, 205, 22 + Math.min(20, x.mass * 4), 8 + Math.min(10, x.mass * 2), 0, Math.PI, 0); ctx.fill(); ctx.strokeStyle = "#cbd5e1"; ctx.stroke(); }
    text(ctx, `${o.solute} — target ${o.target.toFixed(2)} g`, 165, 360, { size: 12, color: "#475569" });
    // volumetric flask
    const fx = 460, neckTop = 40, mark = 120, bulbY = 270;
    const fill = clamp((x.water || 0) / o.vol, 0, 1.1);
    ctx.save();
    ctx.beginPath(); ctx.moveTo(fx - 10, neckTop); ctx.lineTo(fx - 10, 200); ctx.bezierCurveTo(fx - 90, 210, fx - 90, 340, fx, 340); ctx.bezierCurveTo(fx + 90, 340, fx + 90, 210, fx + 10, 200); ctx.lineTo(fx + 10, neckTop);
    ctx.save(); ctx.clip();
    const surf = fill <= 1 ? 340 - (340 - 200) * Math.min(1, fill / 0.92) - (fill > 0.92 ? ((fill - 0.92) / 0.08) * (200 - mark) : 0) : mark - (fill - 1) * 400;
    ctx.fillStyle = x.mass && x.moved ? "rgba(191,219,254,0.7)" : "rgba(191,219,254,0.5)"; ctx.fillRect(fx - 100, surf, 200, 400);
    ctx.restore();
    ctx.strokeStyle = "#64748b"; ctx.lineWidth = 2.5; ctx.stroke(); ctx.restore();
    line(ctx, fx - 14, mark, fx + 14, mark, "#dc2626", 2); text(ctx, `${o.vol} mL mark`, fx + 22, mark, { size: 11, align: "left", color: "#dc2626" });
    if (x.moved) text(ctx, `${(x.mass || 0).toFixed(2)} g dissolved`, fx, bulbY + 40, { size: 11, color: "#1e3a8a" });
    // magnified meniscus
    rr(ctx, 540, 60, 90, 90, 45); ctx.fillStyle = "#f8fafc"; ctx.fill(); ctx.strokeStyle = "#94a3b8"; ctx.stroke();
    const dv = (x.water || 0) - o.vol; const my = 105 - clamp(dv * 12, -40, 40);
    ctx.save(); ctx.beginPath(); ctx.arc(585, 105, 44, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = "rgba(147,197,253,0.6)"; ctx.fillRect(540, my, 90, 100);
    ctx.strokeStyle = "#1d4ed8"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(545, my - 6); ctx.quadraticCurveTo(585, my + 8, 625, my - 6); ctx.stroke();
    line(ctx, 545, 105, 625, 105, "#dc2626", 2); ctx.restore();
    text(ctx, "Meniscus", 585, 165, { size: 10, color: "#64748b" });
    const msg = !x.moved ? "Weigh the solute on the balance" : Math.abs(dv) <= 0.5 ? "✓ Lower meniscus touches the mark" : dv > 0.5 ? "Over the mark! Start again" : "Add distilled water up to the mark";
    text(ctx, msg, 320, 20, { size: 14, weight: 800, color: !x.moved ? "#475569" : Math.abs(dv) <= 0.5 ? "#059669" : dv > 0 ? "#dc2626" : "#d97706" });
  };
  return (
    <div>
      <SimCanvas draw={draw} w={W} h={380} />
      <Panel>
        <span className="text-sm font-semibold text-slate-500">{t({ en: "Spatula:", kn: "ಚಮಚ:" })}</span>
        {[1, 0.1, 0.01].map((d) => <button key={d} className="btn-ghost text-sm" disabled={x.moved} onClick={() => addM(d)}>+{d} g</button>)}
        <button className="btn-ghost text-sm" disabled={x.moved} onClick={() => addM(-0.1)}>−0.1 g</button>
        <button className="btn-primary text-sm" disabled={x.moved || !x.mass} onClick={() => setX({ moved: true })}>➡ {t({ en: "Transfer to flask", kn: "ಫ್ಲಾಸ್ಕ್‌ಗೆ ವರ್ಗಾಯಿಸಿ" })}</button>
      </Panel>
      <Panel>
        <span className="text-sm font-semibold text-slate-500">{t({ en: "Water:", kn: "ನೀರು:" })}</span>
        <button className="btn-ghost text-sm" disabled={!x.moved} onClick={() => addW(25)}>+25 mL</button>
        <button className="btn-ghost text-sm" disabled={!x.moved} onClick={() => addW(1)}>+1 mL</button>
        <button className="btn-ghost text-sm" disabled={!x.moved} onClick={() => addW(0.1)}>💧 {t({ en: "drop", kn: "ಹನಿ" })}</button>
        <button className="btn-ghost text-sm" onClick={() => setX({ mass: 0, water: 0, moved: false })}>🔄 {t("reset")}</button>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------- MELTING POINT */
export function Melting({ exp, p, x, setX, t }) {
  const o = exp.opts;
  const sub = o.substances.find((s) => s.k === p.sub) || o.substances[0];
  const st = useRef({ T: 30, run: false });
  useEffect(() => { st.current = { T: 30, run: false }; setX({ T1: null, T2: null, T: 30 }); }, [p.sub, p.rate]);
  const lag = p.rate * 0.6; // thermometer reads high when heating fast
  const draw = (ctx, time, dt) => {
    const s = st.current;
    if (s.run) { s.T += dt * p.rate * 1.2; if (s.T > sub.mp + 25) s.run = false; if (Math.floor(time * 5) !== Math.floor((time - dt) * 5)) setX({ T: +s.T.toFixed(1) }); }
    const sampleT = s.T - lag;
    const melt = clamp((sampleT - (sub.mp - 0.8)) / 1.6, 0, 1);
    // Thiele tube
    ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 16; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(300, 80); ctx.lineTo(300, 300); ctx.arc(360, 300, 60, Math.PI, 0, true); ctx.lineTo(420, 200); ctx.lineTo(310, 160); ctx.stroke();
    ctx.strokeStyle = "rgba(253,230,138,0.8)"; ctx.lineWidth = 11; ctx.stroke(); ctx.lineCap = "butt";
    // flame
    if (s.run) { ctx.fillStyle = `rgba(59,130,246,${0.6 + 0.2 * Math.sin(time * 20)})`; ctx.beginPath(); ctx.ellipse(420, 360, 10, 22 + p.rate, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "rgba(249,115,22,0.8)"; ctx.beginPath(); ctx.ellipse(420, 366, 6, 12 + p.rate * 0.5, 0, 0, Math.PI * 2); ctx.fill(); }
    // thermometer
    rr(ctx, 292, 30, 16, 240, 8); ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = "#64748b"; ctx.lineWidth = 1.5; ctx.stroke();
    const hT = clamp((s.T - 0) / 200, 0, 1) * 200;
    ctx.fillStyle = "#dc2626"; ctx.fillRect(297, 260 - hT, 6, hT); circle(ctx, 300, 266, 9, "#dc2626");
    // capillary with sample
    rr(ctx, 312, 220, 6, 50, 3); ctx.fillStyle = "#f1f5f9"; ctx.fill();
    ctx.fillStyle = melt > 0.99 ? "rgba(254,243,199,0.9)" : "#fff"; ctx.fillRect(313, 255, 4, 14);
    if (melt < 1) { const R = rnd(3); for (let i = 0; i < 10 * (1 - melt); i++) circle(ctx, 314 + R() * 2, 257 + R() * 10, 1.3, "#94a3b8"); }
    text(ctx, melt > 0 && melt < 1 ? "Melting…" : melt >= 1 ? "Clear liquid" : "Solid crystals", 340, 245, { size: 11, align: "left", color: "#7c3aed" });
    // readout
    rr(ctx, 470, 60, 150, 90, 14); ctx.fillStyle = "#0f172a"; ctx.fill();
    text(ctx, "Thermometer", 545, 80, { size: 11, color: "#94a3b8" });
    text(ctx, `${s.T.toFixed(1)} °C`, 545, 115, { size: 26, color: "#f87171", weight: 800 });
    text(ctx, `T₁ = ${x.T1 ?? "—"}  T₂ = ${x.T2 ?? "—"}`, 545, 175, { size: 12 });
    text(ctx, t(sub.l), 120, 60, { size: 14, weight: 800, color: "#4f46e5" });
  };
  return (
    <div>
      <SimCanvas draw={draw} w={W} h={390} />
      <Panel>
        <button className="btn-primary" onClick={() => (st.current.run = !st.current.run)}>🔥 {t({ en: "Heat / pause", kn: "ಕಾಯಿಸಿ / ವಿರಾಮ" })}</button>
        <button className="btn-ghost" onClick={() => setX({ T1: +st.current.T.toFixed(1) })}>📍 {t({ en: "Melting started (T₁)", kn: "ಕರಗಲು ಆರಂಭ (T₁)" })}</button>
        <button className="btn-ghost" onClick={() => setX({ T2: +st.current.T.toFixed(1) })}>📍 {t({ en: "Fully melted (T₂)", kn: "ಸಂಪೂರ್ಣ ಕರಗಿದೆ (T₂)" })}</button>
        <button className="btn-ghost" onClick={() => { st.current = { T: 30, run: false }; setX({ T1: null, T2: null, T: 30 }); }}>🔄 {t("reset")}</button>
      </Panel>
    </div>
  );
}
