import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../i18n.jsx";
import { auth, DEMO_USER } from "../store.js";
import { LangToggle } from "../App.jsx";

export default function LoginPage() {
  const { t } = useLang();
  const nav = useNavigate();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (auth.login(u, p)) nav("/"); else setErr(t("wrongLogin"));
  };
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-600 text-white relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/10" />
        <div className="absolute right-24 bottom-10 w-40 h-40 rounded-full bg-white/10" />
        <div className="text-6xl mb-6">🧪 🔭 🌱</div>
        <h1 className="text-4xl font-extrabold leading-tight">{t("appName")}</h1>
        <p className="mt-4 text-lg text-indigo-100 max-w-md">{t("tagline")}</p>
        <div className="mt-8 grid grid-cols-3 gap-3 max-w-md text-center">
          {["sslc", "puc1", "puc2"].map((c) => (
            <div key={c} className="rounded-xl bg-white/15 p-3 text-sm font-semibold">{t(c)}</div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-6">
        <div className="self-end mb-6"><LangToggle /></div>
        <form onSubmit={submit} className="card w-full max-w-sm p-8">
          <div className="lg:hidden text-4xl mb-2">🧪</div>
          <h2 className="text-2xl font-extrabold mb-1">{t("login")}</h2>
          <p className="text-sm text-slate-500 mb-6">{t("appName")}</p>
          <label className="block text-sm font-semibold mb-1">{t("username")}</label>
          <input className="w-full border border-slate-300 rounded-xl px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={u} onChange={(e) => setU(e.target.value)} autoComplete="username" />
          <label className="block text-sm font-semibold mb-1">{t("password")}</label>
          <input type="password" className="w-full border border-slate-300 rounded-xl px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={p} onChange={(e) => setP(e.target.value)} autoComplete="current-password" />
          {err && <p className="text-sm text-rose-600 mb-3">{err}</p>}
          <button className="btn-primary w-full py-3">{t("login")}</button>
          <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
            <b>{t("demoHint")}:</b> {DEMO_USER.username} / {DEMO_USER.password}
            <button type="button" className="ml-2 underline" onClick={() => { setU(DEMO_USER.username); setP(DEMO_USER.password); }}>↵</button>
          </div>
        </form>
      </div>
    </div>
  );
}
