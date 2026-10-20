import React from "react";
import { HashRouter, Routes, Route, Navigate, Outlet, Link, useNavigate } from "react-router-dom";
import { LangProvider, useLang } from "./i18n.jsx";
import { auth } from "./store.js";
import LoginPage from "./pages/LoginPage.jsx";
import ClassPage from "./pages/ClassPage.jsx";
import SubjectPage from "./pages/SubjectPage.jsx";
import ExperimentListPage from "./pages/ExperimentListPage.jsx";
import ExperimentPage from "./pages/ExperimentPage.jsx";

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex rounded-xl bg-slate-100 p-1 text-sm font-semibold" role="group" aria-label="Language">
      {[["en", "English"], ["kn", "ಕನ್ನಡ"]].map(([k, l]) => (
        <button key={k} onClick={() => setLang(k)}
          className={`px-3 py-1 rounded-lg transition ${lang === k ? "bg-white shadow text-indigo-700" : "text-slate-500 hover:text-slate-700"}`}>
          {l}
        </button>
      ))}
    </div>
  );
}

function Layout() {
  const { t } = useLang();
  const nav = useNavigate();
  if (!auth.user()) return <Navigate to="/login" replace />;
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-slate-800 min-w-0">
            <span className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-indigo-600 to-fuchsia-500 grid place-items-center text-white text-lg">🧪</span>
            <span className="truncate hidden sm:block">{t("appName")}</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <LangToggle />
            <button className="btn-ghost text-sm px-3" onClick={() => { auth.logout(); nav("/login"); }}>{t("logout")}</button>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6"><Outlet /></main>
      <footer className="text-center text-xs text-slate-400 py-6">Virtual Science Lab · SSLC · 1st PUC · 2nd PUC</footer>
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<Layout />}>
            <Route path="/" element={<ClassPage />} />
            <Route path="/c/:cls" element={<SubjectPage />} />
            <Route path="/c/:cls/:subject" element={<ExperimentListPage />} />
            <Route path="/e/:id" element={<ExperimentPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </LangProvider>
  );
}
