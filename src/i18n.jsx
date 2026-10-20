import React, { createContext, useContext, useState, useEffect } from "react";

// UI strings in English and Kannada
export const UI = {
  appName: { en: "Virtual Science Lab", kn: "ವರ್ಚುವಲ್ ವಿಜ್ಞಾನ ಪ್ರಯೋಗಾಲಯ" },
  tagline: {
    en: "Do real science experiments on any device — change values, watch results, record readings.",
    kn: "ಯಾವುದೇ ಸಾಧನದಲ್ಲಿ ನಿಜವಾದ ವಿಜ್ಞಾನ ಪ್ರಯೋಗಗಳನ್ನು ಮಾಡಿ — ಮೌಲ್ಯಗಳನ್ನು ಬದಲಿಸಿ, ಫಲಿತಾಂಶ ನೋಡಿ, ಅವಲೋಕನಗಳನ್ನು ದಾಖಲಿಸಿ.",
  },
  login: { en: "Login", kn: "ಲಾಗಿನ್" },
  logout: { en: "Logout", kn: "ಲಾಗ್ ಔಟ್" },
  username: { en: "Username", kn: "ಬಳಕೆದಾರ ಹೆಸರು" },
  password: { en: "Password", kn: "ಪಾಸ್‌ವರ್ಡ್" },
  demoHint: { en: "Demo login", kn: "ಡೆಮೊ ಲಾಗಿನ್" },
  wrongLogin: { en: "Wrong username or password", kn: "ತಪ್ಪಾದ ಬಳಕೆದಾರ ಹೆಸರು ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್" },
  chooseClass: { en: "Choose your class", kn: "ನಿಮ್ಮ ತರಗತಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ" },
  chooseSubject: { en: "Choose a subject", kn: "ವಿಷಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ" },
  chooseExp: { en: "Choose an experiment", kn: "ಪ್ರಯೋಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ" },
  experiments: { en: "experiments", kn: "ಪ್ರಯೋಗಗಳು" },
  completed: { en: "completed", kn: "ಪೂರ್ಣಗೊಂಡಿದೆ" },
  back: { en: "Back", kn: "ಹಿಂದೆ" },
  home: { en: "Home", kn: "ಮುಖಪುಟ" },
  physics: { en: "Physics", kn: "ಭೌತಶಾಸ್ತ್ರ" },
  chemistry: { en: "Chemistry", kn: "ರಸಾಯನಶಾಸ್ತ್ರ" },
  biology: { en: "Biology", kn: "ಜೀವಶಾಸ್ತ್ರ" },
  sslc: { en: "SSLC (Class 10)", kn: "ಎಸ್.ಎಸ್.ಎಲ್.ಸಿ (10ನೇ ತರಗತಿ)" },
  puc1: { en: "1st PUC (Class 11)", kn: "ಪ್ರಥಮ ಪಿಯುಸಿ (11ನೇ ತರಗತಿ)" },
  puc2: { en: "2nd PUC (Class 12)", kn: "ದ್ವಿತೀಯ ಪಿಯುಸಿ (12ನೇ ತರಗತಿ)" },
  tabTheory: { en: "Aim & Theory", kn: "ಉದ್ದೇಶ ಮತ್ತು ಸಿದ್ಧಾಂತ" },
  tabSim: { en: "Simulation", kn: "ಅನುಕರಣೆ" },
  tabObs: { en: "Observations & Graph", kn: "ಅವಲೋಕನ ಮತ್ತು ನಕ್ಷೆ" },
  tabProc: { en: "Procedure", kn: "ವಿಧಾನ" },
  tabViva: { en: "Viva Quiz", kn: "ಮೌಖಿಕ ಪ್ರಶ್ನೋತ್ತರ" },
  aim: { en: "Aim", kn: "ಉದ್ದೇಶ" },
  theory: { en: "Theory", kn: "ಸಿದ್ಧಾಂತ" },
  formula: { en: "Formula", kn: "ಸೂತ್ರ" },
  apparatus: { en: "Apparatus / Materials", kn: "ಉಪಕರಣಗಳು / ಸಾಮಗ್ರಿಗಳು" },
  controls: { en: "Controls", kn: "ನಿಯಂತ್ರಣಗಳು" },
  readings: { en: "Live readings", kn: "ನೇರ ಅವಲೋಕನಗಳು" },
  record: { en: "Record reading", kn: "ಅವಲೋಕನ ದಾಖಲಿಸಿ" },
  recorded: { en: "Recorded!", kn: "ದಾಖಲಾಗಿದೆ!" },
  clear: { en: "Clear table", kn: "ಕೋಷ್ಟಕ ಅಳಿಸಿ" },
  noRows: {
    en: "No readings yet. Go to the Simulation tab, change the values and press “Record reading”.",
    kn: "ಇನ್ನೂ ಅವಲೋಕನಗಳಿಲ್ಲ. ಅನುಕರಣೆ ಟ್ಯಾಬ್‌ಗೆ ಹೋಗಿ, ಮೌಲ್ಯಗಳನ್ನು ಬದಲಿಸಿ “ಅವಲೋಕನ ದಾಖಲಿಸಿ” ಒತ್ತಿರಿ.",
  },
  trial: { en: "Trial", kn: "ಪ್ರಯತ್ನ" },
  graph: { en: "Graph", kn: "ನಕ್ಷೆ" },
  needTwo: { en: "Record at least 2 readings to draw the graph.", kn: "ನಕ್ಷೆ ಎಳೆಯಲು ಕನಿಷ್ಠ 2 ಅವಲೋಕನಗಳನ್ನು ದಾಖಲಿಸಿ." },
  slope: { en: "Slope of best-fit line", kn: "ಸೂಕ್ತ ರೇಖೆಯ ಇಳಿಜಾರು" },
  mean: { en: "Mean", kn: "ಸರಾಸರಿ" },
  result: { en: "Result", kn: "ಫಲಿತಾಂಶ" },
  submit: { en: "Check answers", kn: "ಉತ್ತರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ" },
  retry: { en: "Try again", kn: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ" },
  score: { en: "Score", kn: "ಅಂಕ" },
  next: { en: "Next experiment", kn: "ಮುಂದಿನ ಪ್ರಯೋಗ" },
  procNote: { en: "Steps as done in the real lab:", kn: "ನಿಜವಾದ ಪ್ರಯೋಗಾಲಯದಲ್ಲಿ ಮಾಡುವ ಹಂತಗಳು:" },
  tryThis: { en: "Try this", kn: "ಇದನ್ನು ಪ್ರಯತ್ನಿಸಿ" },
  search: { en: "Search experiments…", kn: "ಪ್ರಯೋಗಗಳನ್ನು ಹುಡುಕಿ…" },
  progress: { en: "Your progress", kn: "ನಿಮ್ಮ ಪ್ರಗತಿ" },
  welcome: { en: "Welcome", kn: "ಸ್ವಾಗತ" },
  reset: { en: "Reset", kn: "ಮರುಹೊಂದಿಸಿ" },
  play: { en: "Start", kn: "ಪ್ರಾರಂಭಿಸಿ" },
  pause: { en: "Pause", kn: "ವಿರಾಮ" },
};

const LangCtx = createContext({ lang: "en", setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("vsl-lang") || "en"; } catch { return "en"; }
  });
  useEffect(() => {
    try { localStorage.setItem("vsl-lang", lang); } catch {}
    document.documentElement.lang = lang;
  }, [lang]);
  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const { lang, setLang } = useContext(LangCtx);
  // t() accepts a UI key, or an {en, kn} object, or a plain string
  const t = (x) => {
    if (x == null) return "";
    if (typeof x === "string") return UI[x] ? UI[x][lang] || UI[x].en : x;
    return x[lang] || x.en || "";
  };
  return { lang, setLang, t };
}
