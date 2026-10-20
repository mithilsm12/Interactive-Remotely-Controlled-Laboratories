import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../i18n.jsx";
import { auth, progress } from "../store.js";
import { CLASSES, CLASS_STYLE, EXPERIMENTS, SUBJECT_STYLE, list } from "../data/index.js";

export default function ClassPage() {
  const { t } = useLang();
  const [q, setQ] = useState("");
  const prog = progress.all();
  const done = EXPERIMENTS.filter((e) => progress.isDone(prog[e.id])).length;
  const hits = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return EXPERIMENTS.filter((e) => (e.title.en + " " + e.title.kn).toLowerCase().includes(s)).slice(0, 8);
  }, [q]);
  return (
    <div>
      <section className="rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 text-white p-6 sm:p-10 mb-8 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-16 text-[10rem] opacity-15 select-none">🧪</div>
        <p className="text-indigo-100 font-semibold">{t("welcome")}, {auth.user()?.name} 👋</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold mt-1">{t("appName")}</h1>
        <p className="mt-2 max-w-2xl text-indigo-100">{t("tagline")}</p>
        <div className="mt-6 max-w-md">
          <div className="flex justify-between text-sm mb-1"><span>{t("progress")}</span><span>{done} / {EXPERIMENTS.length} {t("completed")}</span></div>
          <div className="h-2 rounded-full bg-white/25"><div className="h-2 rounded-full bg-white" style={{ width: `${(done / EXPERIMENTS.length) * 100}%` }} /></div>
        </div>
        <div className="mt-6 relative max-w-md">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search")}
            className="w-full rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-white/40" />
          {hits.length > 0 && (
            <div className="absolute z-20 mt-2 w-full card p-2 text-slate-800">
              {hits.map((e) => (
                <Link key={e.id} to={`/e/${e.id}`} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100">
                  <span className="text-xl">{e.icon}</span>
                  <span className="flex-1 text-sm font-semibold">{t(e.title)}</span>
                  <span className="text-xs text-slate-400">{t(e.cls).split(" (")[0]}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <h2 className="text-xl font-bold mb-4">{t("chooseClass")}</h2>
      <div className="grid sm:grid-cols-3 gap-5">
        {CLASSES.map((c) => {
          const exps = list(c);
          const d = exps.filter((e) => progress.isDone(prog[e.id])).length;
          return (
            <Link key={c} to={`/c/${c}`} className="card p-6 hover:-translate-y-1 hover:shadow-lg transition group">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${CLASS_STYLE[c].grad} grid place-items-center text-3xl mb-4`}>{CLASS_STYLE[c].icon}</div>
              <h3 className="text-lg font-extrabold">{t(c)}</h3>
              <p className="text-sm text-slate-500 mt-1">{exps.length} {t("experiments")} · {d} {t("completed")}</p>
              <div className="flex gap-2 mt-4">
                {["physics", "chemistry", "biology"].map((s) => (
                  <span key={s} className={`text-xs px-2 py-1 rounded-lg font-semibold ${SUBJECT_STYLE[s].soft}`}>{SUBJECT_STYLE[s].icon} {t(s)}</span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
