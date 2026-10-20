import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { useLang } from "../i18n.jsx";
import { progress } from "../store.js";
import { CLASSES, SUBJECTS, SUBJECT_STYLE, list } from "../data/index.js";
import { Crumbs } from "./SubjectPage.jsx";

export default function ExperimentListPage() {
  const { cls, subject } = useParams();
  const { t } = useLang();
  if (!CLASSES.includes(cls) || !SUBJECTS.includes(subject)) return <Navigate to="/" replace />;
  const prog = progress.all();
  const st = SUBJECT_STYLE[subject];
  return (
    <div>
      <Crumbs items={[{ to: "/", label: t("home") }, { to: `/c/${cls}`, label: t(cls) }, { label: t(subject) }]} />
      <h1 className="text-2xl font-extrabold mb-6">{st.icon} {t(subject)} — {t("chooseExp")}</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list(cls, subject).map((e, i) => {
          const p = prog[e.id];
          const done = progress.isDone(p);
          return (
            <Link key={e.id} to={`/e/${e.id}`} className="card p-5 flex gap-4 hover:-translate-y-0.5 hover:shadow-lg transition">
              <div className={`w-14 h-14 shrink-0 rounded-2xl ${st.soft} grid place-items-center text-3xl`}>{e.icon}</div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-400">#{i + 1}</div>
                <h3 className="font-bold leading-snug">{t(e.title)}</h3>
                <div className="flex gap-2 mt-2 text-xs">
                  {done ? <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-semibold">✓ {t("completed")}</span>
                    : p?.visited ? <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 font-semibold">…</span> : null}
                  {p?.quiz != null && <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold">{t("score")}: {p.quiz}/{p.total}</span>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
