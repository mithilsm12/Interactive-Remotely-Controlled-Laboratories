import React, { useState } from "react";
import { useLang } from "../i18n.jsx";

export default function Quiz({ quiz, onScore }) {
  const { t } = useLang();
  const [ans, setAns] = useState({});
  const [checked, setChecked] = useState(false);
  const score = quiz.reduce((s, q, i) => s + (ans[i] === q.a ? 1 : 0), 0);
  const allAnswered = Object.keys(ans).length === quiz.length;

  return (
    <div className="space-y-4">
      {quiz.map((q, i) => (
        <div key={i} className="card p-5">
          <p className="font-semibold mb-3"><span className="text-indigo-600 mr-1">Q{i + 1}.</span>{t(q.q)}</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {q.o.map((o, j) => {
              const picked = ans[i] === j;
              let cls = "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50";
              if (picked) cls = "border-indigo-500 bg-indigo-50";
              if (checked && j === q.a) cls = "border-emerald-500 bg-emerald-50";
              else if (checked && picked) cls = "border-rose-400 bg-rose-50";
              return (
                <button key={j} disabled={checked} onClick={() => setAns({ ...ans, [i]: j })}
                  className={`text-left px-4 py-3 rounded-xl border-2 transition text-sm ${cls}`}>
                  <span className="font-bold mr-2 text-slate-400">{String.fromCharCode(65 + j)}</span>{t(o)}
                </button>
              );
            })}
          </div>
          {checked && (
            <p className={`mt-3 text-sm rounded-lg px-3 py-2 ${ans[i] === q.a ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>
              {ans[i] === q.a ? "✅ " : "❌ "}{t(q.e)}
            </p>
          )}
        </div>
      ))}
      <div className="flex items-center gap-3">
        {!checked ? (
          <button className="btn-primary" disabled={!allAnswered} onClick={() => { setChecked(true); onScore?.(score); }}>{t("submit")}</button>
        ) : (
          <>
            <div className={`text-lg font-extrabold ${score >= quiz.length / 2 ? "text-emerald-600" : "text-rose-600"}`}>
              {t("score")}: {score} / {quiz.length} {score === quiz.length ? "🏆" : score >= quiz.length / 2 ? "👍" : "📖"}
            </div>
            <button className="btn-ghost" onClick={() => { setAns({}); setChecked(false); }}>{t("retry")}</button>
          </>
        )}
      </div>
    </div>
  );
}
