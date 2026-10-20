import sslc from "./sslc.js";
import puc1 from "./puc1.js";
import puc2 from "./puc2.js";

export const CLASSES = ["sslc", "puc1", "puc2"];
export const SUBJECTS = ["physics", "chemistry", "biology"];
export const SUBJECT_STYLE = {
  physics: { icon: "⚛️", grad: "from-indigo-500 to-blue-500", soft: "bg-indigo-50 text-indigo-700", ring: "ring-indigo-200" },
  chemistry: { icon: "⚗️", grad: "from-emerald-500 to-teal-500", soft: "bg-emerald-50 text-emerald-700", ring: "ring-emerald-200" },
  biology: { icon: "🌿", grad: "from-rose-500 to-orange-400", soft: "bg-rose-50 text-rose-700", ring: "ring-rose-200" },
};
export const CLASS_STYLE = {
  sslc: { icon: "🎒", grad: "from-sky-500 to-indigo-500" },
  puc1: { icon: "🔬", grad: "from-violet-500 to-fuchsia-500" },
  puc2: { icon: "🎓", grad: "from-amber-500 to-rose-500" },
};

export const EXPERIMENTS = [
  ...sslc.map((e) => ({ ...e, cls: "sslc" })),
  ...puc1.map((e) => ({ ...e, cls: "puc1" })),
  ...puc2.map((e) => ({ ...e, cls: "puc2" })),
];
export const byId = (id) => EXPERIMENTS.find((e) => e.id === id);
export const list = (cls, subject) => EXPERIMENTS.filter((e) => e.cls === cls && (!subject || e.subject === subject));
