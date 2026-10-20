import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { useLang } from "../i18n.jsx";
import { progress } from "../store.js";
import { CLASSES, SUBJECTS, SUBJECT_STYLE, list } from "../data/index.js";

export function Crumbs({ items }) {
  return (
    <nav className="text-sm text-slate-500 mb-4 flex flex-wrap items-center gap-1">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-slate-300">/</span>}
          {it.to ? <Link to={it.to} className="hover:text-indigo-600 font-medium">{it.label}</Link> : <span className="text-slate-700 font-semibold">{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export default function SubjectPage() {
  const { cls } = useParams();
  const { t } = useLang();
  if (!CLASSES.includes(cls)) return <Navigate to="/" replace />;
  const prog = progress.all();
  return (
    <div>
      <Crumbs items={[{ to: "/", label: t("home") }, { label: t(cls) }]} />
      <h1 className="text-2xl font-extrabold mb-6">{t("chooseSubject")}</h1>
      <div className="grid sm:grid-cols-3 gap-5">
        {SUBJECTS.map((s) => {
          const exps = list(cls, s);
          const d = exps.filter((e) => progress.isDone(prog[e.id])).length;
          return (
            <Link key={s} to={`/c/${cls}/${s}`} className="card overflow-hidden hover:-translate-y-1 hover:shadow-lg transition">
              <div className={`h-28 bg-gradient-to-br ${SUBJECT_STYLE[s].grad} grid place-items-center text-6xl`}>{SUBJECT_STYLE[s].icon}</div>
              <div className="p-5">
                <h3 className="text-lg font-extrabold">{t(s)}</h3>
                <p className="text-sm text-slate-500">{exps.length} {t("experiments")} · {d} {t("completed")}</p>
                <div className="flex flex-wrap gap-1 mt-3">{exps.map((e) => <span key={e.id} title={e.title.en} className="text-lg">{e.icon}</span>)}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
