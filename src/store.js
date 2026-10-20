// Small helpers for demo login and progress (saved in this browser only)
const get = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const set = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

export const DEMO_USER = { username: "student", password: "lab123" };

export const auth = {
  user: () => get("vsl-user", null),
  login: (u, p) => {
    if (u.trim().toLowerCase() === DEMO_USER.username && p === DEMO_USER.password) {
      set("vsl-user", { name: u.trim() }); return true;
    }
    return false;
  },
  logout: () => { try { localStorage.removeItem("vsl-user"); } catch {} },
};

// progress: { [expId]: { visited: true, recorded: n, quiz: bestScore, total } }
export const progress = {
  all: () => get("vsl-progress", {}),
  update: (id, patch) => {
    const all = get("vsl-progress", {});
    const cur = all[id] || {};
    const next = { ...cur, ...patch };
    if (patch.quiz != null && cur.quiz != null) next.quiz = Math.max(cur.quiz, patch.quiz);
    all[id] = next; set("vsl-progress", all); return next;
  },
  isDone: (p) => !!p && (p.recorded || 0) >= 1 && p.quiz != null && p.quiz >= Math.ceil((p.total || 1) / 2),
};
