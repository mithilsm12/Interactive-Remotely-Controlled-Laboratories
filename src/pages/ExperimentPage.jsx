import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { useLang } from "../i18n.jsx";
import { progress } from "../store.js";
import { byId, list, SUBJECT_STYLE } from "../data/index.js";
import { SIMS } from "../sims/index.js";
import Graph from "../components/Graph.jsx";
import Quiz from "../components/Quiz.jsx";
import { Crumbs } from "./SubjectPage.jsx";

const TABS = ["tabTheory", "tabSim", "tabObs", "tabProc", "tabViva"];

export function fmtVal(v, d = 2, t = (x) => x) {
  if (v == null || v === "") return "—";
  if (typeof v === "number") return isFinite(v) ? (d === 0 ? Math.round(v).toString() : v.toFixed(d)) : "∞";
  if (typeof v === "object") return t(v);
  return String(v);
}

function Control({ c, value, onChange }) {
  const { t } = useLang();
  if (c.type === "select") {
    return (
      <div>
        <label className="text-sm font-semibold text-slate-600">{t(c.l)}</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {c.options.map((o) => (
            <button key={String(o.v)} onClick={() => onChange(o.v)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold border-2 transition ${value === o.v ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 hover:border-slate-300"}`}>
              {t(o.l)}
            </button>
          ))}
        </div>
      </div>
    );
  }
  const dec = (c.step + "").split(".")[1]?.length || 0;
  const bump = (dir) => onChange(Math.min(c.max, Math.max(c.min, +(value + dir * c.step).toFixed(dec))));
  return (
    <div>
      <div className="flex justify-between items-baseline">
        <label className="text-sm font-semibold text-slate-600">{t(c.l)}</label>
        <span className="font-mono font-bold text-indigo-700">{value.toFixed(dec)} {c.u}</span>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <button className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold" onClick={() => bump(-1)} aria-label="decrease">−</button>
        <input type="range" min={c.min} max={c.max} step={c.step} value={value} onChange={(e) => onChange(+e.target.value)} className="flex-1" />
        <button className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold" onClick={() => bump(1)} aria-label="increase">+</button>
      </div>
    </div>
  );
}

function ObsTable({ rows, columns, onDelete, compact }) {
  const { t } = useLang();
  if (!rows.length) return <p className="text-sm text-slate-400 py-4 text-center">{t("noRows")}</p>;
  const shown = compact ? rows.slice(-4) : rows;
  const offset = rows.length - shown.length;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-100 text-slate-600">
            <th className="px-3 py-2 text-left">{t("trial")}</th>
            {columns.map((c) => <th key={c.k} className="px-3 py-2 text-left whitespace-nowrap">{t(c.l)}{c.u ? ` (${c.u})` : ""}</th>)}
            {onDelete && <th />}
          </tr>
        </thead>
        <tbody>
          {shown.map((r, i) => (
            <tr key={i + offset} className="border-b border-slate-100">
              <td className="px-3 py-2 font-semibold text-slate-400">{i + offset + 1}</td>
              {columns.map((c) => <td key={c.k} className="px-3 py-2 font-mono">{fmtVal(r[c.k], c.d ?? 2, t)}</td>)}
              {onDelete && <td className="px-2"><button className="text-slate-300 hover:text-rose-500" onClick={() => onDelete(i + offset)}>✕</button></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ExperimentPage() {
  const { id } = useParams();
  return <ExperimentInner key={id} id={id} />;
}

function ExperimentInner({ id }) {
  const exp = byId(id);
  const { t, lang } = useLang();
  const [tab, setTab] = useState(1);
  const init = () => Object.fromEntries((exp?.controls || []).map((c) => [c.k, c.v]));
  const [p, setP] = useState(init);
  const [x, setXState] = useState(() => ({ ...(exp?.x0 || {}) }));
  const [rows, setRows] = useState([]);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (!exp) return;
    setP(init()); setXState({ ...(exp.x0 || {}) }); setRows([]); setTab(1);
    progress.update(exp.id, { visited: true, total: exp.quiz.length });
    window.scrollTo(0, 0);
  }, [id]);

  const setX = (patch) => setXState((s) => ({ ...s, ...(typeof patch === "function" ? patch(s) : patch) }));
  const r = useMemo(() => (exp?.compute ? exp.compute(p, x) : {}), [exp, p, x]);
  if (!exp) return <Navigate to="/" replace />;

  const columns = exp.table || [...(exp.controls || []).filter((c) => c.type !== "select"), ...(exp.readouts || [])];
  const canRecord = exp.canRecord ? exp.canRecord(p, r, x) : true;
  const record = () => {
    const row = { ...p, ...x, ...r };
    const nr = [...rows, row];
    setRows(nr);
    progress.update(exp.id, { recorded: nr.length });
    setFlash(true); setTimeout(() => setFlash(false), 900);
  };
  const Sim = SIMS[exp.sim];
  const st = SUBJECT_STYLE[exp.subject];
  const siblings = list(exp.cls, exp.subject);
  const nextExp = siblings[siblings.findIndex((e) => e.id === exp.id) + 1];
  const result = exp.result && rows.length ? exp.result(rows) : null;

  return (
    <div>
      <Crumbs items={[
        { to: "/", label: t("home") }, { to: `/c/${exp.cls}`, label: t(exp.cls) },
        { to: `/c/${exp.cls}/${exp.subject}`, label: t(exp.subject) }, { label: t(exp.title) },
      ]} />
      <div className="flex items-start gap-4 mb-5">
        <div className={`w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br ${st.grad} grid place-items-center text-4xl shadow`}>{exp.icon}</div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">{t(exp.title)}</h1>
          <p className="text-slate-500 mt-1">{t(exp.aim)}</p>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto mb-5 bg-white p-1 rounded-2xl border border-slate-200">
        {TABS.map((k, i) => (
          <button key={k} onClick={() => setTab(i)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition ${tab === i ? "bg-indigo-600 text-white shadow" : "text-slate-600 hover:bg-slate-100"}`}>
            {t(k)}{k === "tabObs" && rows.length ? ` (${rows.length})` : ""}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <section className="card p-6"><h2 className="font-bold text-indigo-700 mb-2">🎯 {t("aim")}</h2><p>{t(exp.aim)}</p></section>
            <section className="card p-6"><h2 className="font-bold text-indigo-700 mb-2">📘 {t("theory")}</h2>
              {t(exp.theory).split("\n").map((para, i) => <p key={i} className="mb-2 leading-relaxed">{para}</p>)}
            </section>
          </div>
          <div className="space-y-5">
            {exp.formula && <section className="card p-6 bg-gradient-to-br from-indigo-50 to-white"><h2 className="font-bold text-indigo-700 mb-2">🧮 {t("formula")}</h2>
              {exp.formula.split("\n").map((f, i) => <p key={i} className="font-mono text-lg font-semibold">{f}</p>)}</section>}
            <section className="card p-6"><h2 className="font-bold text-indigo-700 mb-2">🧰 {t("apparatus")}</h2><p className="text-sm leading-relaxed">{t(exp.apparatus)}</p></section>
            <button className="btn-primary w-full" onClick={() => setTab(1)}>▶ {t("tabSim")}</button>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="grid lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3 space-y-4">
            <div className="card p-3">{Sim ? <Sim exp={exp} p={p} setP={(k, v) => setP((s) => ({ ...s, [k]: v }))} r={r} x={x} setX={setX} lang={lang} t={t} /> : <p>Missing sim: {exp.sim}</p>}</div>
            {exp.tip && <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900"><b>💡 {t("tryThis")}:</b> {t(exp.tip)}</div>}
          </div>
          <div className="lg:col-span-2 space-y-4">
            {exp.controls?.length > 0 && (
              <section className="card p-5 space-y-4">
                <h2 className="font-bold">🎛️ {t("controls")}</h2>
                {exp.controls.map((c) => <Control key={c.k} c={c} value={p[c.k]} onChange={(v) => setP((s) => ({ ...s, [c.k]: v }))} />)}
              </section>
            )}
            {exp.readouts?.length > 0 && (
              <section className="card p-5">
                <h2 className="font-bold mb-3">📟 {t("readings")}</h2>
                <div className="grid grid-cols-2 gap-2">
                  {exp.readouts.map((c) => (
                    <div key={c.k} className="rounded-xl bg-slate-900 text-emerald-300 px-3 py-2">
                      <div className="text-[11px] text-slate-400 leading-tight">{t(c.l)}</div>
                      <div className="font-mono text-lg font-bold">{fmtVal(r[c.k] ?? x[c.k], c.d ?? 2, t)} <span className="text-xs text-slate-400">{c.u}</span></div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            <section className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <button className="btn-primary flex-1" disabled={!canRecord} onClick={record}>📝 {flash ? t("recorded") : t("record")}</button>
                <button className="btn-ghost" onClick={() => setTab(2)}>📈</button>
              </div>
              <ObsTable rows={rows} columns={columns} compact />
            </section>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="grid lg:grid-cols-2 gap-5">
          <section className="card p-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold">📋 {t("tabObs")}</h2>
              {rows.length > 0 && <button className="text-sm text-rose-600 font-semibold" onClick={() => setRows([])}>{t("clear")}</button>}
            </div>
            <ObsTable rows={rows} columns={columns} onDelete={(i) => setRows(rows.filter((_, j) => j !== i))} />
            {result && <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-4"><b className="text-emerald-800">✅ {t("result")}:</b> <span className="text-emerald-900">{t(result)}</span></div>}
          </section>
          <section className="card p-5">
            <h2 className="font-bold mb-3">📈 {t("graph")}</h2>
            {exp.graph ? <Graph rows={rows} graph={exp.graph} columns={[...columns, ...(exp.graphCols || [])]} />
              : <p className="text-sm text-slate-500">{t(exp.noGraph || { en: "This experiment is recorded as observations and inferences — no graph needed.", kn: "ಈ ಪ್ರಯೋಗವನ್ನು ಅವಲೋಕನ ಮತ್ತು ತೀರ್ಮಾನಗಳಾಗಿ ದಾಖಲಿಸಲಾಗುತ್ತದೆ — ನಕ್ಷೆ ಅಗತ್ಯವಿಲ್ಲ." })}</p>}
          </section>
        </div>
      )}

      {tab === 3 && (
        <section className="card p-6 max-w-3xl">
          <h2 className="font-bold mb-3">🧪 {t("tabProc")}</h2>
          <p className="text-sm text-slate-500 mb-4">{t("procNote")}</p>
          <ol className="space-y-3">
            {exp.procedure.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-7 h-7 shrink-0 rounded-full bg-indigo-100 text-indigo-700 font-bold grid place-items-center text-sm">{i + 1}</span>
                <span className="pt-0.5">{t(s)}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {tab === 4 && <div className="max-w-3xl"><Quiz key={exp.id} quiz={exp.quiz} onScore={(s) => progress.update(exp.id, { quiz: s, total: exp.quiz.length })} /></div>}

      <div className="flex justify-between mt-8">
        <Link to={`/c/${exp.cls}/${exp.subject}`} className="btn-ghost">← {t("back")}</Link>
        {nextExp && <Link to={`/e/${nextExp.id}`} className="btn-primary">{t("next")} →</Link>}
      </div>
    </div>
  );
}
