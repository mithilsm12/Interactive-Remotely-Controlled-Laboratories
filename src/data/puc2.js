import { L, mean, q, sel, opt, sl, col, deg, nature, benchCols, benchControls, focusControls, uv, prism } from "./helpers.js";

const R2 = (v) => Math.round(v * 100) / 100;
const concordant = (vals) => { const s = [...vals].sort((a, b) => a - b); for (let i = 0; i < s.length - 1; i++) if (Math.abs(s[i + 1] - s[i]) <= 0.1) return (s[i] + s[i + 1]) / 2; return null; };
const titrCols = (name) => [col("init", L("Initial", "ಪ್ರಾರಂಭ"), "mL", 1), col("V", L("Final", "ಅಂತಿಮ"), "mL", 1), col("vol", L(`Volume of ${name}`, `${name} ಘನಫಲ`), "mL", 1)];

export default [
  /* ============================ PHYSICS ============================ */
  {
    id: "puc2-resistivity", subject: "physics", icon: "🧵",
    title: L("Ohm's law and resistivity of a wire", "ಓಮ್ ನಿಯಮ ಮತ್ತು ತಂತಿಯ ರೋಧಶೀಲತೆ"),
    aim: L("To verify Ohm's law for a wire and determine the resistivity of its material.", "ತಂತಿಗೆ ಓಮ್ ನಿಯಮ ಪರಿಶೀಲಿಸಿ ಅದರ ವಸ್ತುವಿನ ರೋಧಶೀಲತೆ ಕಂಡುಹಿಡಿಯುವುದು."),
    theory: L(
      "For a metallic wire at constant temperature, V ∝ I, so R = V/I is constant.\nResistance depends on the length L and area of cross-section A of the wire: R = ρL/A, where ρ is the resistivity (a property of the material). With diameter d, A = πd²/4, so ρ = RπD²/4L.",
      "ಸ್ಥಿರ ತಾಪದಲ್ಲಿ ಲೋಹದ ತಂತಿಗೆ V ∝ I, ಆದ್ದರಿಂದ R = V/I ಸ್ಥಿರ.\nರೋಧವು ತಂತಿಯ ಉದ್ದ L ಮತ್ತು ಅಡ್ಡಕೊಯ್ತದ ವಿಸ್ತೀರ್ಣ A ಮೇಲೆ ಅವಲಂಬಿತ: R = ρL/A, ಇಲ್ಲಿ ρ ರೋಧಶೀಲತೆ (ವಸ್ತುವಿನ ಗುಣ). ವ್ಯಾಸ d ಆದರೆ A = πd²/4."
    ),
    formula: "R = V / I\nρ = R π d² / (4L)",
    apparatus: L("Constantan wire (d = 0.5 mm), battery, ammeter, voltmeter, rheostat, key, screw gauge, metre scale", "ಕಾನ್‌ಸ್ಟಂಟಾನ್ ತಂತಿ (d = 0.5 mm), ಬ್ಯಾಟರಿ, ಅಮ್ಮೀಟರ್, ವೋಲ್ಟ್‌ಮೀಟರ್, ರಿಯೋಸ್ಟಾಟ್, ಕೀ, ಸ್ಕ್ರೂ ಗೇಜ್, ಮೀಟರ್ ಅಳತೆಪಟ್ಟಿ"),
    procedure: [
      "Measure the diameter of the wire with a screw gauge and its length with a scale.",
      "Connect the wire in series with ammeter, rheostat, key and battery; voltmeter across the wire.",
      "Adjust the rheostat and note V and I for at least five settings.",
      "Plot V vs I and find R from the slope.",
      "Calculate ρ = RπD²/4L.",
    ],
    sim: "circuit", opts: { comp: "wire", wireLabel: "Constantan wire", vMax: 3, iMax: 2.5, rheoKey: "V", rheoMax: 3 },
    controls: [sl("V", L("Rheostat → voltage across wire", "ರಿಯೋಸ್ಟಾಟ್ → ತಂತಿಯ ಮೇಲಿನ ವೋಲ್ಟೇಜ್"), 0.25, 3, 0.25, 1, "V"), sel("Lw", L("Length of wire", "ತಂತಿಯ ಉದ್ದ"), [opt(50, "50 cm"), opt(100, "100 cm")], 100)],
    compute: (p) => {
      const A = Math.PI * Math.pow(0.25e-3, 2), Rw = (49e-8 * (p.Lw / 100)) / A;
      const I = R2(p.V / Rw), Rc = p.V / I;
      return { V: p.V, I, Rc, rho: (Rc * A) / (p.Lw / 100) * 1e8 };
    },
    readouts: [col("V", L("Voltmeter", "ವೋಲ್ಟ್‌ಮೀಟರ್"), "V", 2), col("I", L("Ammeter", "ಅಮ್ಮೀಟರ್"), "A", 2)],
    table: [col("Lw", L("L", "L"), "cm", 0), col("V", L("V", "V"), "V", 2), col("I", L("I", "I"), "A", 2), col("Rc", L("R = V/I", "R = V/I"), "Ω", 2), col("rho", L("ρ", "ρ"), "×10⁻⁸ Ωm", 1)],
    graph: { x: "I", y: "V", fit: "origin", slopeMeans: L("slope = R", "ಇಳಿಜಾರು = R") },
    result: (rows) => L(`Mean ρ = ${mean(rows.map((r) => r.rho)).toFixed(1)} × 10⁻⁸ Ωm (constantan ≈ 49 × 10⁻⁸ Ωm)`, `ಸರಾಸರಿ ρ = ${mean(rows.map((r) => r.rho)).toFixed(1)} × 10⁻⁸ Ωm (ಕಾನ್‌ಸ್ಟಂಟಾನ್ ≈ 49 × 10⁻⁸ Ωm)`),
    tip: L("Change the wire length from 100 cm to 50 cm. R halves — does ρ change?", "ತಂತಿಯ ಉದ್ದವನ್ನು 100 ರಿಂದ 50 cm ಗೆ ಬದಲಿಸಿ. R ಅರ್ಧವಾಗುತ್ತದೆ — ρ ಬದಲಾಗುತ್ತದೆಯೇ?"),
    quiz: [
      q("Resistivity depends on…", ["Length", "Area", "Material and temperature", "Current"], 2, "ρ is a material property."),
      q("If a wire is stretched to double its length, its resistance becomes…", ["Double", "Four times", "Half", "Same"], 1, "L doubles and A halves → R × 4."),
      q("SI unit of resistivity is…", ["Ω", "Ω m", "Ω/m", "S"], 1, "ρ = RA/L → Ω·m."),
      q("Constantan is used for standard resistances because…", ["It is cheap", "Its resistance changes very little with temperature", "It is magnetic", "It melts easily"], 1, "Low temperature coefficient of resistance."),
    ],
  },
  {
    id: "puc2-meter-bridge", subject: "physics", icon: "🌉",
    title: L("Meter bridge — unknown resistance", "ಮೀಟರ್ ಸೇತುವೆ — ಅಜ್ಞಾತ ರೋಧ"),
    aim: L("To find the unknown resistance of a wire using a meter bridge.", "ಮೀಟರ್ ಸೇತುವೆ ಬಳಸಿ ತಂತಿಯ ಅಜ್ಞಾತ ರೋಧ ಕಂಡುಹಿಡಿಯುವುದು."),
    theory: L(
      "A meter bridge works on the principle of the Wheatstone bridge. When the jockey touches the null point on the 100 cm wire, the galvanometer shows no deflection and R/X = l/(100 − l).\nSo X = R(100 − l)/l. The null point is most accurate when it is near the middle of the wire.",
      "ಮೀಟರ್ ಸೇತುವೆ ವೀಟ್‌ಸ್ಟೋನ್ ಸೇತುವೆ ತತ್ವದಲ್ಲಿ ಕೆಲಸ ಮಾಡುತ್ತದೆ. 100 cm ತಂತಿಯ ಶೂನ್ಯ ಬಿಂದುವನ್ನು ಜಾಕಿ ಮುಟ್ಟಿದಾಗ ಗ್ಯಾಲ್ವನೋಮೀಟರ್ ವಿಚಲನ ತೋರಿಸುವುದಿಲ್ಲ ಮತ್ತು R/X = l/(100 − l).\nಆದ್ದರಿಂದ X = R(100 − l)/l. ಶೂನ್ಯ ಬಿಂದು ತಂತಿಯ ಮಧ್ಯದ ಹತ್ತಿರವಿದ್ದಾಗ ಹೆಚ್ಚು ನಿಖರ."
    ),
    formula: "X = R (100 − l) / l",
    apparatus: L("Meter bridge, resistance box, unknown resistance wire, galvanometer, jockey, battery, key", "ಮೀಟರ್ ಸೇತುವೆ, ರೋಧ ಪೆಟ್ಟಿಗೆ, ಅಜ್ಞಾತ ರೋಧ ತಂತಿ, ಗ್ಯಾಲ್ವನೋಮೀಟರ್, ಜಾಕಿ, ಬ್ಯಾಟರಿ, ಕೀ"),
    procedure: [
      "Connect the resistance box in the left gap and the unknown wire X in the right gap.",
      "Connect the galvanometer between the central terminal and the jockey.",
      "Take out a suitable resistance R from the box.",
      "Slide the jockey gently along the wire to find the null point; note l.",
      "Repeat for different R and find the mean X.",
    ],
    sim: "bridge", opts: {},
    controls: [sel("R", L("Resistance from box", "ಪೆಟ್ಟಿಗೆಯಿಂದ ರೋಧ"), [2, 4, 6, 8].map((v) => opt(v, `${v} Ω`)), 4), sl("l", L("Jockey position", "ಜಾಕಿ ಸ್ಥಾನ"), 1, 99, 0.1, 30, "cm")],
    compute: (p) => { const X = 5.3, l0 = (100 * p.R) / (p.R + X); const defl = Math.max(-1, Math.min(1, (p.l - l0) / 8)); return { defl, balanced: Math.abs(p.l - l0) < 0.4, X: (p.R * (100 - p.l)) / p.l, rest: 100 - p.l }; },
    readouts: [col("defl", L("Galvanometer deflection", "ಗ್ಯಾಲ್ವನೋಮೀಟರ್ ವಿಚಲನ"), "", 2)],
    canRecord: (p, r) => r.balanced,
    table: [col("R", L("R", "R"), "Ω", 0), col("l", L("l", "l"), "cm", 1), col("rest", L("100 − l", "100 − l"), "cm", 1), col("X", L("X", "X"), "Ω", 2)],
    result: (rows) => L(`Unknown resistance X = ${mean(rows.map((r) => r.X)).toFixed(2)} Ω`, `ಅಜ್ಞಾತ ರೋಧ X = ${mean(rows.map((r) => r.X)).toFixed(2)} Ω`),
    tip: L("Drag the blue jockey on the wire. Record only when the needle is at zero.", "ತಂತಿಯ ಮೇಲೆ ನೀಲಿ ಜಾಕಿ ಎಳೆಯಿರಿ. ಸೂಜಿ ಶೂನ್ಯದಲ್ಲಿದ್ದಾಗ ಮಾತ್ರ ದಾಖಲಿಸಿ."),
    quiz: [
      q("Meter bridge is based on…", ["Ohm's law", "Wheatstone bridge principle", "Kirchhoff's first law only", "Joule's law"], 1, "Balanced Wheatstone bridge."),
      q("At the null point the galvanometer current is…", ["Maximum", "Zero", "Negative", "Infinite"], 1, "No current flows through G."),
      q("Thick copper strips are used because they have…", ["High resistance", "Negligible resistance", "Magnetic effect", "Low cost"], 1, "End resistance is minimised."),
      q("R = 4 Ω, l = 40 cm. X = …", ["6 Ω", "2.67 Ω", "10 Ω", "1.6 Ω"], 0, "X = 4 × 60/40 = 6 Ω."),
    ],
  },
  {
    id: "puc2-potentiometer", subject: "physics", icon: "🔋",
    title: L("Potentiometer — comparing emfs of two cells", "ವಿಭವಮಾಪಕ — ಎರಡು ಕೋಶಗಳ emf ಹೋಲಿಕೆ"),
    aim: L("To compare the emfs of two primary cells (Leclanché and Daniell) using a potentiometer.", "ವಿಭವಮಾಪಕ ಬಳಸಿ ಎರಡು ಪ್ರಾಥಮಿಕ ಕೋಶಗಳ (ಲೆಕ್ಲಾಂಚೆ ಮತ್ತು ಡೇನಿಯಲ್) emf ಹೋಲಿಸುವುದು."),
    theory: L(
      "A steady current from a driver cell flows through a long uniform wire, so the potential drop per cm (potential gradient k) is constant. When a cell is balanced against the wire, no current flows through the galvanometer and E = k·l.\nFor two cells, E₁/E₂ = l₁/l₂. A potentiometer measures emf without drawing current from the cell, so it is more accurate than a voltmeter.",
      "ಚಾಲಕ ಕೋಶದಿಂದ ಸ್ಥಿರ ಪ್ರವಾಹ ಉದ್ದವಾದ ಏಕರೂಪ ತಂತಿಯ ಮೂಲಕ ಹರಿಯುವುದರಿಂದ ಪ್ರತಿ cm ಗೆ ವಿಭವ ಕುಸಿತ (ವಿಭವ ಪ್ರವಣತೆ k) ಸ್ಥಿರ. ಕೋಶವನ್ನು ತಂತಿಯ ವಿರುದ್ಧ ಸಮತೋಲನಗೊಳಿಸಿದಾಗ ಗ್ಯಾಲ್ವನೋಮೀಟರ್ ಮೂಲಕ ಪ್ರವಾಹ ಇಲ್ಲ ಮತ್ತು E = k·l.\nಎರಡು ಕೋಶಗಳಿಗೆ E₁/E₂ = l₁/l₂. ವಿಭವಮಾಪಕ ಕೋಶದಿಂದ ಪ್ರವಾಹ ಸೆಳೆಯದೆ emf ಅಳೆಯುವುದರಿಂದ ವೋಲ್ಟ್‌ಮೀಟರ್‌ಗಿಂತ ನಿಖರ."
    ),
    formula: "E = k l\nE₁ / E₂ = l₁ / l₂",
    apparatus: L("Potentiometer (400 cm wire), driver battery, Leclanché and Daniell cells, two-way key, galvanometer, jockey, rheostat", "ವಿಭವಮಾಪಕ (400 cm ತಂತಿ), ಚಾಲಕ ಬ್ಯಾಟರಿ, ಲೆಕ್ಲಾಂಚೆ ಮತ್ತು ಡೇನಿಯಲ್ ಕೋಶಗಳು, ದ್ವಿಮಾರ್ಗ ಕೀ, ಗ್ಯಾಲ್ವನೋಮೀಟರ್, ಜಾಕಿ, ರಿಯೋಸ್ಟಾಟ್"),
    procedure: [
      "Connect the driver battery across the potentiometer wire.",
      "Connect both cells (positive to the same end) through a two-way key and galvanometer to the jockey.",
      "Insert the plug for E₁ and find the balancing length l₁.",
      "Switch to E₂ and find l₂.",
      "Repeat by changing the rheostat and calculate E₁/E₂.",
    ],
    sim: "bridge", opts: { mode: "potentiometer", length: 400, cellNames: ["E₁ Leclanché", "E₂ Daniell"] },
    controls: [sel("cell", L("Cell in circuit", "ಸರ್ಕ್ಯೂಟ್‌ನಲ್ಲಿರುವ ಕೋಶ"), [opt("E1", "E₁ Leclanché", "E₁ ಲೆಕ್ಲಾಂಚೆ"), opt("E2", "E₂ Daniell", "E₂ ಡೇನಿಯಲ್")], "E1"), sl("l", L("Jockey position", "ಜಾಕಿ ಸ್ಥಾನ"), 1, 399, 0.1, 150, "cm")],
    compute: (p) => { const E = p.cell === "E1" ? 1.45 : 1.08, k = 2 / 400; return { defl: Math.max(-1, Math.min(1, (k * p.l - E) / 0.06)), balanced: Math.abs(k * p.l - E) < 0.002, cellName: p.cell === "E1" ? L("E₁ (Leclanché)", "E₁ (ಲೆಕ್ಲಾಂಚೆ)") : L("E₂ (Daniell)", "E₂ (ಡೇನಿಯಲ್)") }; },
    readouts: [col("defl", L("Galvanometer deflection", "ಗ್ಯಾಲ್ವನೋಮೀಟರ್ ವಿಚಲನ"), "", 2)],
    canRecord: (p, r) => r.balanced,
    table: [col("cellName", L("Cell", "ಕೋಶ")), col("l", L("Balancing length", "ಸಮತೋಲನ ಉದ್ದ"), "cm", 1)],
    result: (rows) => { const a = rows.filter((r) => r.cell === "E1").map((r) => r.l), b = rows.filter((r) => r.cell === "E2").map((r) => r.l); return a.length && b.length ? L(`E₁/E₂ = l₁/l₂ = ${(mean(a) / mean(b)).toFixed(3)}`, `E₁/E₂ = l₁/l₂ = ${(mean(a) / mean(b)).toFixed(3)}`) : L("Balance both cells to compare them.", "ಹೋಲಿಸಲು ಎರಡೂ ಕೋಶಗಳನ್ನು ಸಮತೋಲನಗೊಳಿಸಿ."); },
    quiz: [
      q("A potentiometer is preferred over a voltmeter because it…", ["Is cheaper", "Draws no current at balance", "Is smaller", "Needs no battery"], 1, "It measures true emf."),
      q("Potential gradient is…", ["Potential per unit length", "Current per length", "Resistance per length", "Emf × length"], 0, "k = V/L."),
      q("To increase sensitivity of a potentiometer we should…", ["Increase potential gradient", "Decrease potential gradient", "Shorten the wire", "Use thicker wire only"], 1, "Smaller k → longer balancing length → more precision."),
      q("The emf of the driver cell must be…", ["Less than test cells", "Greater than test cells", "Equal", "Zero"], 1, "Otherwise no balance point exists."),
    ],
  },
  {
    id: "puc2-convex-lens", subject: "physics", icon: "🔭",
    title: L("Focal length of convex lens — u–v and 1/u–1/v graphs", "ಪೀನ ಮಸೂರದ ಸಂಗಮ ದೂರ — u–v ಮತ್ತು 1/u–1/v ನಕ್ಷೆಗಳು"),
    aim: L("To find the focal length of a convex lens by plotting graphs between u and v and between 1/u and 1/v.", "u ಮತ್ತು v ಹಾಗೂ 1/u ಮತ್ತು 1/v ನಡುವೆ ನಕ್ಷೆಗಳನ್ನು ಎಳೆದು ಪೀನ ಮಸೂರದ ಸಂಗಮ ದೂರ ಕಂಡುಹಿಡಿಯುವುದು."),
    theory: L(
      "For a convex lens, 1/f = 1/u + 1/v (using magnitudes for a real image). A graph of 1/v against 1/u is a straight line with slope −1; it cuts both axes at 1/f.\nIn the u–v graph, the line u = v cuts the curve at (2f, 2f).",
      "ಪೀನ ಮಸೂರಕ್ಕೆ 1/f = 1/u + 1/v (ನೈಜ ಪ್ರತಿಬಿಂಬಕ್ಕೆ ಪರಿಮಾಣ ಬಳಸಿ). 1/u ವಿರುದ್ಧ 1/v ನಕ್ಷೆ −1 ಇಳಿಜಾರಿನ ಸರಳರೇಖೆ; ಅದು ಎರಡೂ ಅಕ್ಷಗಳನ್ನು 1/f ನಲ್ಲಿ ಛೇದಿಸುತ್ತದೆ.\nu–v ನಕ್ಷೆಯಲ್ಲಿ u = v ರೇಖೆ ವಕ್ರರೇಖೆಯನ್ನು (2f, 2f) ನಲ್ಲಿ ಛೇದಿಸುತ್ತದೆ."
    ),
    formula: "1/f = 1/u + 1/v\nf = uv / (u + v)",
    apparatus: L("Optical bench, convex lens, two needles (object and image) or candle and screen", "ದೃಗ್ವೈಜ್ಞಾನಿಕ ಬೆಂಚ್, ಪೀನ ಮಸೂರ, ಎರಡು ಸೂಜಿಗಳು ಅಥವಾ ಮೇಣದಬತ್ತಿ ಮತ್ತು ಪರದೆ"),
    procedure: [
      "Find a rough focal length by focusing a distant object.",
      "Place the object beyond F and adjust the screen/image needle for a sharp image.",
      "Record u and v for at least six positions.",
      "Plot the u–v curve and the 1/u–1/v straight line.",
      "Find f from the intercepts.",
    ],
    sim: "optics", opts: { kind: "convex", f: 15 },
    controls: [sl("u", L("Object distance u", "ವಸ್ತು ದೂರ u"), 10, 55, 1, 30, "cm"), sl("s", L("Screen distance v", "ಪರದೆ ದೂರ v"), 15, 90, 0.5, 40, "cm")],
    compute: (p) => uv(p.u, 15, p.s),
    readouts: [col("sharpPct", L("Image sharpness", "ಪ್ರತಿಬಿಂಬದ ಸ್ಪಷ್ಟತೆ"), "%", 0), col("v", L("v", "v"), "cm", 1)],
    canRecord: (p, r) => r.sharp > 0.9,
    table: [col("u", L("u", "u"), "cm", 1), col("v", L("v", "v"), "cm", 1), col("invU", L("1/u", "1/u"), "m⁻¹", 2), col("invV", L("1/v", "1/v"), "m⁻¹", 2), col("f", L("f", "f"), "cm", 2)],
    graph: { x: "invU", y: "invV", fit: "linear", slopeMeans: L("slope ≈ −1; intercept = 1/f (m⁻¹)", "ಇಳಿಜಾರು ≈ −1; ಛೇದ = 1/f") },
    result: (rows) => L(`f = ${mean(rows.map((r) => r.f)).toFixed(1)} cm`, `f = ${mean(rows.map((r) => r.f)).toFixed(1)} cm`),
    quiz: [
      q("The 1/u–1/v graph for a convex lens is…", ["Parabola", "Straight line with slope −1", "Circle", "Hyperbola"], 1, "1/v = 1/f − 1/u."),
      q("When u = 2f, v = …", ["f", "2f", "∞", "f/2"], 1, "Object at 2F → image at 2F."),
      q("For u = 30 cm, v = 30 cm, f = …", ["30 cm", "15 cm", "60 cm", "10 cm"], 1, "900/60 = 15 cm."),
      q("The image is virtual when the object is…", ["Beyond 2F", "Between F and lens", "At 2F", "At infinity"], 1, "Magnifier condition."),
    ],
  },
  {
    id: "puc2-prism-id", subject: "physics", icon: "🔺",
    title: L("Prism: i–δ curve and refractive index", "ಪಟ್ಟಕ: i–δ ವಕ್ರರೇಖೆ ಮತ್ತು ವಕ್ರೀಭವನ ಸೂಚ್ಯಂಕ"),
    aim: L("To draw the i–δ curve for a prism, find the angle of minimum deviation and the refractive index of glass.", "ಪಟ್ಟಕಕ್ಕೆ i–δ ವಕ್ರರೇಖೆ ಎಳೆದು ಕನಿಷ್ಠ ವಿಚಲನ ಕೋನ ಮತ್ತು ಗಾಜಿನ ವಕ್ರೀಭವನ ಸೂಚ್ಯಂಕ ಕಂಡುಹಿಡಿಯುವುದು."),
    theory: L(
      "As the angle of incidence increases, the deviation first decreases, reaches a minimum value δm and then increases. At minimum deviation the ray passes symmetrically through the prism (i = e, r₁ = r₂ = A/2).\nThe refractive index is n = sin((A + δm)/2) / sin(A/2).",
      "ಆಪಾತ ಕೋನ ಹೆಚ್ಚಿದಂತೆ ವಿಚಲನ ಮೊದಲು ಕಡಿಮೆಯಾಗಿ ಕನಿಷ್ಠ δm ತಲುಪಿ ನಂತರ ಹೆಚ್ಚುತ್ತದೆ. ಕನಿಷ್ಠ ವಿಚಲನದಲ್ಲಿ ಕಿರಣ ಪಟ್ಟಕದ ಮೂಲಕ ಸಮಮಿತೀಯವಾಗಿ ಹೋಗುತ್ತದೆ (i = e, r₁ = r₂ = A/2).\nವಕ್ರೀಭವನ ಸೂಚ್ಯಂಕ n = sin((A + δm)/2) / sin(A/2)."
    ),
    formula: "δ = i + e − A\nn = sin((A + δm)/2) / sin(A/2)",
    apparatus: L("Equilateral glass prism, drawing board, white paper, pins, protractor", "ಸಮಬಾಹು ಗಾಜಿನ ಪಟ್ಟಕ, ಡ್ರಾಯಿಂಗ್ ಬೋರ್ಡ್, ಬಿಳಿ ಕಾಗದ, ಪಿನ್‌ಗಳು, ಕೋನಮಾಪಕ"),
    procedure: [
      "Trace the prism outline and draw normals for different angles of incidence (30° to 60°).",
      "Fix pins on the incident ray and locate the emergent ray with two more pins.",
      "Measure the deviation δ for each i.",
      "Plot δ against i and read δm from the lowest point.",
      "Calculate n.",
    ],
    sim: "refraction", opts: { kind: "prism", n: 1.5 },
    controls: [sl("i", L("Angle of incidence i", "ಆಪಾತ ಕೋನ i"), 30, 70, 1, 35, "°")],
    compute: (p) => prism(p.i, 1.5),
    canRecord: (p, r) => !r.tir,
    readouts: [col("e", L("Angle of emergence e", "ನಿರ್ಗಮನ ಕೋನ e"), "°", 1), col("dev", L("Deviation δ", "ವಿಚಲನ δ"), "°", 1)],
    table: [col("i", L("i", "i"), "°", 0), col("e", L("e", "e"), "°", 1), col("dev", L("δ", "δ"), "°", 1)],
    graph: { x: "i", y: "dev", fit: "curve", fromZero: false },
    result: (rows) => { const m = rows.reduce((a, b) => (b.dev < a.dev ? b : a)); const n = Math.sin(((60 + m.dev) / 2) * deg) / Math.sin(30 * deg); return L(`δm ≈ ${m.dev.toFixed(1)}° → n = ${n.toFixed(3)}`, `δm ≈ ${m.dev.toFixed(1)}° → n = ${n.toFixed(3)}`); },
    tip: L("Record i from 30° to 70° in steps of 5°. Where is the lowest point?", "i ಅನ್ನು 30° ರಿಂದ 70° ವರೆಗೆ 5° ಹಂತಗಳಲ್ಲಿ ದಾಖಲಿಸಿ. ಕನಿಷ್ಠ ಬಿಂದು ಎಲ್ಲಿದೆ?"),
    quiz: [
      q("At minimum deviation…", ["i = 0", "i = e", "e = 90°", "r₁ = 0"], 1, "The path is symmetric."),
      q("For A = 60° and δm = 38°, n ≈ …", ["1.33", "1.5", "1.65", "2.4"], 1, "sin 49°/sin 30° ≈ 1.51."),
      q("The i–δ graph is…", ["Straight line", "U-shaped curve", "Circle", "Horizontal line"], 1, "δ decreases then increases."),
      q("δm for violet light compared to red is…", ["Less", "More", "Same", "Zero"], 1, "Violet has higher n."),
    ],
  },
  {
    id: "puc2-diode", subject: "physics", icon: "💡",
    title: L("Characteristics of a p–n junction diode", "p–n ಸಂಧಿ ಡಯೋಡ್‌ನ ಗುಣಲಕ್ಷಣಗಳು"),
    aim: L("To draw the I–V characteristic curves of a p–n junction diode in forward and reverse bias.", "ಮುಂದಿನ ಮತ್ತು ಹಿಮ್ಮುಖ ಬಯಾಸ್‌ನಲ್ಲಿ p–n ಸಂಧಿ ಡಯೋಡ್‌ನ I–V ಗುಣಲಕ್ಷಣ ವಕ್ರರೇಖೆಗಳನ್ನು ಎಳೆಯುವುದು."),
    theory: L(
      "In forward bias (p to +, n to −) the depletion layer becomes thin. Current is almost zero until the knee (threshold) voltage — about 0.7 V for silicon — and then rises sharply.\nIn reverse bias the depletion layer widens and only a tiny reverse saturation current (µA) flows due to minority carriers. This one-way conduction is used in rectifiers.",
      "ಮುಂದಿನ ಬಯಾಸ್‌ನಲ್ಲಿ (p ಗೆ +, n ಗೆ −) ಕ್ಷೀಣಿತ ಪದರ ತೆಳುವಾಗುತ್ತದೆ. ಮೊಣಕಾಲು (ಮಿತಿ) ವೋಲ್ಟೇಜ್ — ಸಿಲಿಕಾನ್‌ಗೆ ಸುಮಾರು 0.7 V — ವರೆಗೆ ಪ್ರವಾಹ ಬಹುತೇಕ ಶೂನ್ಯ, ನಂತರ ತೀವ್ರವಾಗಿ ಏರುತ್ತದೆ.\nಹಿಮ್ಮುಖ ಬಯಾಸ್‌ನಲ್ಲಿ ಕ್ಷೀಣಿತ ಪದರ ಅಗಲವಾಗುತ್ತದೆ ಮತ್ತು ಅಲ್ಪಸಂಖ್ಯಾತ ವಾಹಕಗಳಿಂದ ಬಹಳ ಸಣ್ಣ ಹಿಮ್ಮುಖ ಸಂತೃಪ್ತ ಪ್ರವಾಹ (µA) ಹರಿಯುತ್ತದೆ. ಈ ಏಕಮುಖ ವಾಹಕತೆ ಸರಿಕಾರಕಗಳಲ್ಲಿ ಬಳಕೆಯಾಗುತ್ತದೆ."
    ),
    formula: "Dynamic resistance r = ΔV / ΔI",
    apparatus: L("p–n junction diode, battery, rheostat, voltmeter, milliammeter, microammeter, key, wires", "p–n ಸಂಧಿ ಡಯೋಡ್, ಬ್ಯಾಟರಿ, ರಿಯೋಸ್ಟಾಟ್, ವೋಲ್ಟ್‌ಮೀಟರ್, ಮಿಲಿಅಮ್ಮೀಟರ್, ಮೈಕ್ರೋಅಮ್ಮೀಟರ್, ಕೀ, ತಂತಿಗಳು"),
    procedure: [
      "Connect the diode in forward bias with a milliammeter in series and voltmeter across it.",
      "Increase the voltage in small steps (0.05 V near the knee) and note I.",
      "Reverse the diode connections and use a microammeter.",
      "Increase reverse voltage and note the very small current.",
      "Plot I against V for both cases.",
    ],
    sim: "circuit", opts: { comp: "diode", vMax: 1, iMax: 50, iUnit: "mA", iDec: 2, rheoKey: "V", rheoMax: 1 },
    controls: [sel("bias", L("Bias", "ಬಯಾಸ್"), [opt("forward", "Forward", "ಮುಂದಿನ"), opt("reverse", "Reverse", "ಹಿಮ್ಮುಖ")], "forward"), sl("V", L("Voltage across diode", "ಡಯೋಡ್ ಮೇಲಿನ ವೋಲ್ಟೇಜ್"), 0, 0.85, 0.05, 0.4, "V")],
    compute: (p) => {
      if (p.bias === "reverse") return { V: -p.V, I: -(0.001 + 0.0005 * p.V), biasName: L("Reverse", "ಹಿಮ್ಮುಖ") };
      return { V: p.V, I: Math.min(80, 0.00002 * (Math.exp(p.V / 0.05) - 1)), biasName: L("Forward", "ಮುಂದಿನ") };
    },
    readouts: [col("V", L("Voltmeter", "ವೋಲ್ಟ್‌ಮೀಟರ್"), "V", 2), col("I", L("Current", "ಪ್ರವಾಹ"), "mA", 3)],
    table: [col("biasName", L("Bias", "ಬಯಾಸ್")), col("V", L("V", "V"), "V", 2), col("I", L("I", "I"), "mA", 3)],
    graph: { x: "V", y: "I", fit: "curve", note: L("Knee voltage ≈ 0.6–0.7 V for silicon.", "ಸಿಲಿಕಾನ್‌ಗೆ ಮೊಣಕಾಲು ವೋಲ್ಟೇಜ್ ≈ 0.6–0.7 V.") },
    tip: L("Record in steps of 0.05 V from 0 to 0.8 V and watch the knee appear in the graph.", "0 ರಿಂದ 0.8 V ವರೆಗೆ 0.05 V ಹಂತಗಳಲ್ಲಿ ದಾಖಲಿಸಿ ನಕ್ಷೆಯಲ್ಲಿ ಮೊಣಕಾಲು ನೋಡಿ."),
    quiz: [
      q("Knee voltage of a silicon diode is about…", ["0.3 V", "0.7 V", "1.5 V", "5 V"], 1, "Germanium ≈ 0.3 V, silicon ≈ 0.7 V."),
      q("In reverse bias the depletion layer…", ["Becomes thinner", "Becomes wider", "Disappears", "Is unchanged"], 1, "Reverse bias widens it."),
      q("Reverse current is due to…", ["Majority carriers", "Minority carriers", "Photons", "Ions"], 1, "Thermally generated minority carriers."),
      q("A diode is mainly used as a…", ["Amplifier", "Rectifier", "Capacitor", "Transformer"], 1, "It conducts in one direction."),
    ],
  },

  /* ============================ CHEMISTRY ============================ */
  {
    id: "puc2-kmno4-oxalic", subject: "chemistry", icon: "🟣",
    title: L("KMnO₄ vs oxalic acid (redox titration)", "KMnO₄ ವಿರುದ್ಧ ಆಕ್ಸಾಲಿಕ್ ಆಮ್ಲ (ರೆಡಾಕ್ಸ್ ಟೈಟ್ರೇಶನ್)"),
    aim: L("To find the molarity and strength of KMnO₄ solution by titrating against 0.05 M oxalic acid.", "0.05 M ಆಕ್ಸಾಲಿಕ್ ಆಮ್ಲದ ವಿರುದ್ಧ ಟೈಟ್ರೇಟ್ ಮಾಡಿ KMnO₄ ದ್ರಾವಣದ ಮೋಲಾರಿಟಿ ಮತ್ತು ಸಾಮರ್ಥ್ಯ ಕಂಡುಹಿಡಿಯುವುದು."),
    theory: L(
      "KMnO₄ is a strong oxidising agent in acidic medium (dil. H₂SO₄). It oxidises oxalic acid to CO₂ and is itself reduced to colourless Mn²⁺.\nKMnO₄ acts as its own indicator: once all oxalic acid is used up, one extra drop gives a permanent light pink colour. The flask is warmed to 60–70 °C because the reaction is slow at room temperature.\n2MnO₄⁻ + 5C₂O₄²⁻ + 16H⁺ → 2Mn²⁺ + 10CO₂ + 8H₂O.",
      "ಆಮ್ಲೀಯ ಮಾಧ್ಯಮದಲ್ಲಿ (ದುರ್ಬಲ H₂SO₄) KMnO₄ ಪ್ರಬಲ ಉತ್ಕರ್ಷಕ. ಇದು ಆಕ್ಸಾಲಿಕ್ ಆಮ್ಲವನ್ನು CO₂ ಆಗಿ ಉತ್ಕರ್ಷಿಸಿ ತಾನು ಬಣ್ಣರಹಿತ Mn²⁺ ಆಗಿ ಅಪಕರ್ಷಿಸಲ್ಪಡುತ್ತದೆ.\nKMnO₄ ಸ್ವಸೂಚಕ: ಆಕ್ಸಾಲಿಕ್ ಆಮ್ಲ ಮುಗಿದ ನಂತರ ಒಂದು ಹೆಚ್ಚುವರಿ ಹನಿ ಶಾಶ್ವತ ತಿಳಿ ಗುಲಾಬಿ ಬಣ್ಣ ನೀಡುತ್ತದೆ. ಕೊಠಡಿ ತಾಪದಲ್ಲಿ ಕ್ರಿಯೆ ನಿಧಾನವಾದ್ದರಿಂದ ಫ್ಲಾಸ್ಕ್ ಅನ್ನು 60–70 °C ಗೆ ಬಿಸಿಮಾಡಲಾಗುತ್ತದೆ."
    ),
    formula: "M(KMnO₄) = (2/5) × M(oxalic) × V(oxalic) / V(KMnO₄)\nStrength = M × 158 g/L",
    apparatus: L("Burette, pipette, conical flask, burner/water bath, 0.05 M oxalic acid, KMnO₄, dil. H₂SO₄", "ಬ್ಯೂರೆಟ್, ಪಿಪೆಟ್, ಶಂಖಾಕಾರದ ಫ್ಲಾಸ್ಕ್, ಬರ್ನರ್, 0.05 M ಆಕ್ಸಾಲಿಕ್ ಆಮ್ಲ, KMnO₄, ದುರ್ಬಲ H₂SO₄"),
    procedure: [
      "Fill the burette with KMnO₄ and read the upper meniscus (dark solution).",
      "Pipette 10 mL oxalic acid into a flask; add a test tube of dil. H₂SO₄ and warm to 60–70 °C.",
      "Titrate with KMnO₄; the pink colour disappears at first.",
      "Stop when a light pink colour persists for 30 seconds.",
      "Repeat for concordant readings.",
    ],
    sim: "titration", opts: { indicator: "kmno4", indicatorLabel: "KMnO₄ itself (colourless → permanent pink)", vEq: 10.1, titrantColor: "rgba(126,34,206,0.85)", titrantLabel: "KMnO₄ (unknown)", analyteLabel: "10 mL 0.05 M oxalic acid + dil. H₂SO₄ (warm)" },
    compute: (p, x) => ({ V: x.V || 0, vol: x.V || 0, init: 0 }),
    readouts: [col("V", L("Burette reading", "ಬ್ಯೂರೆಟ್ ಓದು"), "mL", 1)],
    canRecord: (p, r, x) => !!x.end,
    table: titrCols("KMnO₄"),
    result: (rows) => { const c = concordant(rows.map((r) => r.V)); if (!c) return L("Get two readings within 0.1 mL.", "0.1 mL ಒಳಗಿನ ಎರಡು ಓದುಗಳನ್ನು ಪಡೆಯಿರಿ."); const M = (0.4 * 0.05 * 10) / c; return L(`Concordant ${c.toFixed(1)} mL → M(KMnO₄) = ${M.toFixed(4)} M, strength = ${(M * 158).toFixed(2)} g/L`, `ಸಮನ್ವಯ ${c.toFixed(1)} mL → M(KMnO₄) = ${M.toFixed(4)} M, ಸಾಮರ್ಥ್ಯ = ${(M * 158).toFixed(2)} g/L`); },
    quiz: [
      q("No external indicator is used because KMnO₄ is a…", ["Catalyst", "Self-indicator", "Reducing agent", "Base"], 1, "Its own purple colour shows the end point."),
      q("Why is oxalic acid warmed?", ["To evaporate water", "Reaction is slow at room temperature", "To change colour", "To make CO₂"], 1, "Warming speeds up the reaction."),
      q("Which acid is used to acidify?", ["HCl", "HNO₃", "Dil. H₂SO₄", "Acetic acid"], 2, "HCl gets oxidised; HNO₃ is itself an oxidant."),
      q("Change in oxidation state of Mn is…", ["+7 → +2", "+7 → +4", "+6 → +2", "+4 → +2"], 0, "MnO₄⁻ (+7) → Mn²⁺ (+2)."),
    ],
  },
  {
    id: "puc2-kmno4-mohr", subject: "chemistry", icon: "🧂",
    title: L("KMnO₄ vs Mohr's salt", "KMnO₄ ವಿರುದ್ಧ ಮೋರ್ ಲವಣ"),
    aim: L("To find the molarity of KMnO₄ solution using 0.1 M Mohr's salt (ferrous ammonium sulphate).", "0.1 M ಮೋರ್ ಲವಣ (ಫೆರಸ್ ಅಮೋನಿಯಂ ಸಲ್ಫೇಟ್) ಬಳಸಿ KMnO₄ ದ್ರಾವಣದ ಮೋಲಾರಿಟಿ ಕಂಡುಹಿಡಿಯುವುದು."),
    theory: L(
      "Mohr's salt, FeSO₄·(NH₄)₂SO₄·6H₂O, supplies Fe²⁺ ions, which are oxidised to Fe³⁺ by KMnO₄ in acidic medium.\nMnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O. No heating is needed (heating would oxidise Fe²⁺ by air). KMnO₄ is again the self-indicator.",
      "ಮೋರ್ ಲವಣ FeSO₄·(NH₄)₂SO₄·6H₂O, Fe²⁺ ಅಯಾನುಗಳನ್ನು ನೀಡುತ್ತದೆ; ಆಮ್ಲೀಯ ಮಾಧ್ಯಮದಲ್ಲಿ KMnO₄ ಅವನ್ನು Fe³⁺ ಆಗಿ ಉತ್ಕರ್ಷಿಸುತ್ತದೆ.\nMnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O. ಬಿಸಿ ಮಾಡುವ ಅಗತ್ಯವಿಲ್ಲ (ಬಿಸಿ ಮಾಡಿದರೆ ಗಾಳಿಯಿಂದ Fe²⁺ ಉತ್ಕರ್ಷಣ). KMnO₄ ಮತ್ತೆ ಸ್ವಸೂಚಕ."
    ),
    formula: "M(KMnO₄) = M(Mohr) × V(Mohr) / (5 × V(KMnO₄))",
    apparatus: L("Burette, pipette, conical flask, 0.1 M Mohr's salt, KMnO₄, dil. H₂SO₄", "ಬ್ಯೂರೆಟ್, ಪಿಪೆಟ್, ಶಂಖಾಕಾರದ ಫ್ಲಾಸ್ಕ್, 0.1 M ಮೋರ್ ಲವಣ, KMnO₄, ದುರ್ಬಲ H₂SO₄"),
    procedure: [
      "Fill the burette with KMnO₄.",
      "Pipette 10 mL Mohr's salt solution and add dil. H₂SO₄ (do not heat).",
      "Titrate until a permanent light pink colour appears.",
      "Repeat for concordant readings and calculate.",
    ],
    sim: "titration", opts: { indicator: "kmno4", indicatorLabel: "KMnO₄ itself (pale green → pink)", vEq: 9.5, titrantColor: "rgba(126,34,206,0.85)", titrantLabel: "KMnO₄ (unknown)", analyteLabel: "10 mL 0.1 M Mohr's salt + dil. H₂SO₄" },
    compute: (p, x) => ({ V: x.V || 0, vol: x.V || 0, init: 0 }),
    readouts: [col("V", L("Burette reading", "ಬ್ಯೂರೆಟ್ ಓದು"), "mL", 1)],
    canRecord: (p, r, x) => !!x.end,
    table: titrCols("KMnO₄"),
    result: (rows) => { const c = concordant(rows.map((r) => r.V)); if (!c) return L("Get two readings within 0.1 mL.", "0.1 mL ಒಳಗಿನ ಎರಡು ಓದುಗಳನ್ನು ಪಡೆಯಿರಿ."); const M = (0.1 * 10) / (5 * c); return L(`Concordant ${c.toFixed(1)} mL → M(KMnO₄) = ${M.toFixed(4)} M`, `ಸಮನ್ವಯ ${c.toFixed(1)} mL → M(KMnO₄) = ${M.toFixed(4)} M`); },
    quiz: [
      q("Mohr's salt is preferred over FeSO₄ because it is…", ["Coloured", "Less easily oxidised by air", "Cheaper", "A base"], 1, "Ammonium sulphate stabilises Fe²⁺."),
      q("Moles of Fe²⁺ oxidised by 1 mol MnO₄⁻ = …", ["1", "2", "5", "8"], 2, "Mn gains 5 electrons."),
      q("Why is the Mohr's salt solution not heated?", ["It explodes", "Fe²⁺ gets oxidised by air", "Colour changes", "Water evaporates"], 1, "Heating promotes aerial oxidation."),
      q("A few drops of dil. H₂SO₄ are added to Mohr's salt during preparation to…", ["Prevent hydrolysis", "Change colour", "Act as indicator", "Speed reaction"], 0, "It stops hydrolysis of Fe²⁺."),
    ],
  },
  (() => {
    const samples = ["P", "Q", "R", "S", "T"].map((k) => ({ k, l: L(`Salt ${k}`, `ಲವಣ ${k}`), color: k === "Q" ? "rgba(56,189,248,0.55)" : k === "R" ? "rgba(234,179,8,0.45)" : "rgba(241,245,249,0.8)" }));
    const reagents = [
      { k: "naoh", l: L("NaOH (warm)", "NaOH (ಬಿಸಿ)"), color: "rgba(226,232,240,0.9)" },
      { k: "ferro", l: L("K₄[Fe(CN)₆]", "K₄[Fe(CN)₆]"), color: "rgba(253,224,71,0.9)" },
      { k: "nh4oh", l: L("NH₄OH (excess)", "NH₄OH (ಹೆಚ್ಚು)"), color: "rgba(226,232,240,0.9)" },
      { k: "carb", l: L("(NH₄)₂CO₃", "(NH₄)₂CO₃"), color: "rgba(226,232,240,0.9)" },
      { k: "flame", l: L("Flame test", "ಜ್ವಾಲೆ ಪರೀಕ್ಷೆ"), color: "#f97316" },
    ];
    return {
      id: "puc2-cation-analysis", subject: "chemistry", icon: "🧪",
      title: L("Salt analysis — identifying cations", "ಲವಣ ವಿಶ್ಲೇಷಣೆ — ಧನ ಅಯಾನುಗಳ ಗುರುತಿಸುವಿಕೆ"),
      aim: L("To identify the cation (basic radical) in the given salts: NH₄⁺, Cu²⁺, Fe³⁺, Zn²⁺, Ca²⁺.", "ಕೊಟ್ಟ ಲವಣಗಳಲ್ಲಿ ಧನ ಅಯಾನು (ಪ್ರತ್ಯಾಮ್ಲ ರ್ಯಾಡಿಕಲ್) ಗುರುತಿಸುವುದು: NH₄⁺, Cu²⁺, Fe³⁺, Zn²⁺, Ca²⁺."),
      theory: L(
        "Cations are separated into groups using group reagents and confirmed by specific tests.\nNH₄⁺ gives ammonia gas on warming with NaOH. Cu²⁺ gives a blue precipitate with NaOH and a chocolate-brown precipitate with potassium ferrocyanide. Fe³⁺ gives a reddish-brown precipitate with NaOH and Prussian blue with ferrocyanide. Zn²⁺ gives a white precipitate soluble in excess NaOH/NH₄OH. Ca²⁺ gives a white precipitate with ammonium carbonate and a brick-red flame.",
        "ಧನ ಅಯಾನುಗಳನ್ನು ಗುಂಪು ಕಾರಕಗಳಿಂದ ಗುಂಪುಗಳಾಗಿ ಬೇರ್ಪಡಿಸಿ ವಿಶಿಷ್ಟ ಪರೀಕ್ಷೆಗಳಿಂದ ದೃಢೀಕರಿಸಲಾಗುತ್ತದೆ.\nNH₄⁺ NaOH ನೊಂದಿಗೆ ಬಿಸಿಮಾಡಿದಾಗ ಅಮೋನಿಯಾ ನೀಡುತ್ತದೆ. Cu²⁺ NaOH ನೊಂದಿಗೆ ನೀಲಿ ಅವಕ್ಷೇಪ ಮತ್ತು ಫೆರೋಸಯನೈಡ್‌ನೊಂದಿಗೆ ಚಾಕೊಲೇಟ್-ಕಂದು ಅವಕ್ಷೇಪ ನೀಡುತ್ತದೆ. Fe³⁺ NaOH ನೊಂದಿಗೆ ಕೆಂಪು-ಕಂದು ಮತ್ತು ಫೆರೋಸಯನೈಡ್‌ನೊಂದಿಗೆ ಪ್ರಷ್ಯನ್ ನೀಲಿ ನೀಡುತ್ತದೆ. Zn²⁺ ಹೆಚ್ಚು NaOH/NH₄OH ನಲ್ಲಿ ಕರಗುವ ಬಿಳಿ ಅವಕ್ಷೇಪ ನೀಡುತ್ತದೆ. Ca²⁺ ಅಮೋನಿಯಂ ಕಾರ್ಬೊನೇಟ್‌ನೊಂದಿಗೆ ಬಿಳಿ ಅವಕ್ಷೇಪ ಮತ್ತು ಇಟ್ಟಿಗೆ-ಕೆಂಪು ಜ್ವಾಲೆ ನೀಡುತ್ತದೆ."
      ),
      apparatus: L("Test tubes, burner, platinum wire, NaOH, NH₄OH, K₄[Fe(CN)₆], (NH₄)₂CO₃, conc. HCl, salt samples", "ಪರೀಕ್ಷಾ ನಳಿಕೆಗಳು, ಬರ್ನರ್, ಪ್ಲಾಟಿನಂ ತಂತಿ, NaOH, NH₄OH, K₄[Fe(CN)₆], (NH₄)₂CO₃, ಸಾರ HCl, ಲವಣ ಮಾದರಿಗಳು"),
      procedure: [
        "Prepare the original solution of the salt in water.",
        "Warm a little with NaOH and test the gas with moist red litmus.",
        "Add NaOH drop by drop, then in excess; note the colour of any precipitate.",
        "Do confirmatory tests with K₄[Fe(CN)₆], NH₄OH or (NH₄)₂CO₃ as needed.",
        "Do a flame test with the paste of the salt in conc. HCl.",
      ],
      sim: "bench",
      opts: {
        samples, reagents,
        react: {
          "P|naoh": { gas: true, vigor: 15, heat: true, obs: L("Pungent smell; gas turns moist red litmus blue", "ತೀಕ್ಷ್ಣ ವಾಸನೆ; ಅನಿಲ ಒದ್ದೆ ಕೆಂಪು ಲಿಟ್ಮಸ್ ನೀಲಿಯಾಗಿಸುತ್ತದೆ"), inf: L("NH₃ evolved — NH₄⁺ present", "NH₃ — NH₄⁺ ಇದೆ") },
          "Q|naoh": { ppt: "#0ea5e9", c: "rgba(56,189,248,0.35)", obs: L("Pale blue precipitate", "ತಿಳಿ ನೀಲಿ ಅವಕ್ಷೇಪ"), inf: L("Cu(OH)₂ — Cu²⁺ may be present", "Cu(OH)₂ — Cu²⁺ ಇರಬಹುದು") },
          "Q|ferro": { ppt: "#78350f", obs: L("Chocolate-brown precipitate", "ಚಾಕೊಲೇಟ್-ಕಂದು ಅವಕ್ಷೇಪ"), inf: L("Cu²⁺ confirmed", "Cu²⁺ ದೃಢ") },
          "Q|nh4oh": { c: "rgba(37,99,235,0.75)", obs: L("Deep blue solution", "ಗಾಢ ನೀಲಿ ದ್ರಾವಣ"), inf: L("[Cu(NH₃)₄]²⁺ — Cu²⁺", "[Cu(NH₃)₄]²⁺ — Cu²⁺") },
          "Q|flame": { noAdd: true, c: "rgba(34,197,94,0.5)", obs: L("Green-blue flame", "ಹಸಿರು-ನೀಲಿ ಜ್ವಾಲೆ"), inf: L("Cu²⁺ indicated", "Cu²⁺ ಸೂಚನೆ") },
          "R|naoh": { ppt: "#9a3412", obs: L("Reddish-brown precipitate", "ಕೆಂಪು-ಕಂದು ಅವಕ್ಷೇಪ"), inf: L("Fe(OH)₃ — Fe³⁺ may be present", "Fe(OH)₃ — Fe³⁺ ಇರಬಹುದು") },
          "R|ferro": { c: "rgba(30,64,175,0.85)", ppt: "#1e3a8a", obs: L("Prussian blue colour / ppt", "ಪ್ರಷ್ಯನ್ ನೀಲಿ ಬಣ್ಣ"), inf: L("Fe³⁺ confirmed", "Fe³⁺ ದೃಢ") },
          "R|nh4oh": { ppt: "#9a3412", obs: L("Reddish-brown ppt, insoluble in excess", "ಕೆಂಪು-ಕಂದು ಅವಕ್ಷೇಪ, ಹೆಚ್ಚುವರಿಯಲ್ಲಿ ಕರಗದು"), inf: L("Fe³⁺ (Group III)", "Fe³⁺ (ಗುಂಪು III)") },
          "S|naoh": { c: "rgba(241,245,249,0.6)", obs: L("White ppt, dissolves in excess NaOH", "ಬಿಳಿ ಅವಕ್ಷೇಪ, ಹೆಚ್ಚು NaOH ನಲ್ಲಿ ಕರಗುತ್ತದೆ"), inf: L("Zn²⁺ (amphoteric hydroxide)", "Zn²⁺ (ಉಭಯಧರ್ಮಿ ಹೈಡ್ರಾಕ್ಸೈಡ್)") },
          "S|ferro": { ppt: "#f1f5f9", obs: L("White / bluish-white precipitate", "ಬಿಳಿ / ನೀಲಿ-ಬಿಳಿ ಅವಕ್ಷೇಪ"), inf: L("Zn²⁺ confirmed", "Zn²⁺ ದೃಢ") },
          "S|nh4oh": { obs: L("White ppt soluble in excess", "ಹೆಚ್ಚುವರಿಯಲ್ಲಿ ಕರಗುವ ಬಿಳಿ ಅವಕ್ಷೇಪ"), inf: L("Zn²⁺ indicated", "Zn²⁺ ಸೂಚನೆ") },
          "T|carb": { ppt: "#ffffff", obs: L("White precipitate", "ಬಿಳಿ ಅವಕ್ಷೇಪ"), inf: L("CaCO₃ — Group V (Ca²⁺)", "CaCO₃ — ಗುಂಪು V (Ca²⁺)") },
          "T|flame": { noAdd: true, c: "rgba(234,88,12,0.5)", obs: L("Brick-red flame", "ಇಟ್ಟಿಗೆ-ಕೆಂಪು ಜ್ವಾಲೆ"), inf: L("Ca²⁺ confirmed", "Ca²⁺ ದೃಢ") },
          "T|naoh": { ppt: "rgba(255,255,255,0.7)", obs: L("Slight white turbidity", "ಸ್ವಲ್ಪ ಬಿಳಿ ಮಸುಕು"), inf: L("Ca²⁺ possible", "Ca²⁺ ಇರಬಹುದು") },
          "S|carb": { ppt: "#ffffff", obs: L("White ppt", "ಬಿಳಿ ಅವಕ್ಷೇಪ"), inf: L("Not specific", "ವಿಶಿಷ್ಟವಲ್ಲ") },
          "P|flame": { noAdd: true, obs: L("No characteristic colour", "ವಿಶಿಷ್ಟ ಬಣ್ಣ ಇಲ್ಲ"), inf: L("Not Ca/Cu/Na", "Ca/Cu/Na ಅಲ್ಲ") },
          "R|flame": { noAdd: true, obs: L("No characteristic colour", "ವಿಶಿಷ್ಟ ಬಣ್ಣ ಇಲ್ಲ"), inf: L("—", "—") },
          "S|flame": { noAdd: true, obs: L("No characteristic colour", "ವಿಶಿಷ್ಟ ಬಣ್ಣ ಇಲ್ಲ"), inf: L("—", "—") },
        },
        identify: { prompt: L("Which cation is in the CURRENT salt?", "ಪ್ರಸ್ತುತ ಲವಣದಲ್ಲಿ ಯಾವ ಧನ ಅಯಾನು ಇದೆ?"), choices: [L("NH₄⁺"), L("Cu²⁺"), L("Fe³⁺"), L("Zn²⁺"), L("Ca²⁺")], answer: { P: 0, Q: 1, R: 2, S: 3, T: 4 } },
      },
      controls: benchControls(samples, reagents),
      canRecord: (p, r, x) => !!x.tested,
      table: benchCols,
      tip: L("Identify all five unknown salts using as few tests as possible.", "ಕಡಿಮೆ ಪರೀಕ್ಷೆಗಳಲ್ಲಿ ಎಲ್ಲಾ ಐದು ಅಜ್ಞಾತ ಲವಣಗಳನ್ನು ಗುರುತಿಸಿ."),
      quiz: [
        q("Prussian blue is formed by…", ["Cu²⁺", "Fe³⁺", "Zn²⁺", "Ca²⁺"], 1, "Fe₄[Fe(CN)₆]₃."),
        q("Brick-red flame indicates…", ["Na⁺", "K⁺", "Ca²⁺", "Cu²⁺"], 2, "Calcium gives brick red."),
        q("Group reagent for Group V is…", ["H₂S", "(NH₄)₂CO₃ in NH₄OH", "Dil. HCl", "NH₄OH + NH₄Cl"], 1, "Carbonates of Ca, Sr, Ba precipitate."),
        q("Zn(OH)₂ dissolves in excess NaOH because it is…", ["Acidic", "Basic", "Amphoteric", "Neutral"], 2, "Forms sodium zincate."),
      ],
    };
  })(),
  (() => {
    const samples = [
      { k: "eth", l: L("Compound 1 (ethanol)", "ಸಂಯುಕ್ತ 1 (ಎಥೆನಾಲ್)"), color: "rgba(241,245,249,0.7)" },
      { k: "phe", l: L("Compound 2 (phenol)", "ಸಂಯುಕ್ತ 2 (ಫೀನಾಲ್)"), color: "rgba(254,242,242,0.8)" },
      { k: "ald", l: L("Compound 3 (acetaldehyde)", "ಸಂಯುಕ್ತ 3 (ಅಸಿಟಾಲ್ಡಿಹೈಡ್)"), color: "rgba(241,245,249,0.7)" },
      { k: "ket", l: L("Compound 4 (acetone)", "ಸಂಯುಕ್ತ 4 (ಅಸಿಟೋನ್)"), color: "rgba(241,245,249,0.7)" },
      { k: "acid", l: L("Compound 5 (acetic acid)", "ಸಂಯುಕ್ತ 5 (ಅಸಿಟಿಕ್ ಆಮ್ಲ)"), color: "rgba(241,245,249,0.7)" },
      { k: "ani", l: L("Compound 6 (aniline)", "ಸಂಯುಕ್ತ 6 (ಅನಿಲೀನ್)"), color: "rgba(254,243,199,0.8)" },
    ];
    const reagents = [
      { k: "na", l: L("Sodium metal", "ಸೋಡಿಯಂ ಲೋಹ"), color: "#cbd5e1" },
      { k: "fecl3", l: L("Neutral FeCl₃", "ತಟಸ್ಥ FeCl₃"), color: "rgba(234,179,8,0.9)" },
      { k: "dnp", l: L("2,4-DNP reagent", "2,4-DNP ಕಾರಕ"), color: "rgba(249,115,22,0.9)" },
      { k: "tollens", l: L("Tollens' reagent (warm)", "ಟೊಲೆನ್ಸ್ ಕಾರಕ (ಬಿಸಿ)"), color: "rgba(226,232,240,0.9)" },
      { k: "nahco3", l: L("NaHCO₃ solution", "NaHCO₃ ದ್ರಾವಣ"), color: "rgba(255,255,255,0.9)" },
      { k: "azo", l: L("Azo dye test (NaNO₂/HCl, β-naphthol)", "ಅಜೋ ಬಣ್ಣ ಪರೀಕ್ಷೆ"), color: "rgba(226,232,240,0.9)" },
    ];
    return {
      id: "puc2-functional-groups", subject: "chemistry", icon: "🔬",
      title: L("Tests for organic functional groups", "ಸಾವಯವ ಕ್ರಿಯಾತ್ಮಕ ಗುಂಪುಗಳ ಪರೀಕ್ಷೆ"),
      aim: L("To identify alcoholic, phenolic, aldehydic, ketonic, carboxylic and amino groups in organic compounds.", "ಸಾವಯವ ಸಂಯುಕ್ತಗಳಲ್ಲಿ ಆಲ್ಕೋಹಾಲಿಕ್, ಫೀನಾಲಿಕ್, ಆಲ್ಡಿಹೈಡಿಕ್, ಕೀಟೋನಿಕ್, ಕಾರ್ಬಾಕ್ಸಿಲಿಕ್ ಮತ್ತು ಅಮೈನೋ ಗುಂಪುಗಳನ್ನು ಗುರುತಿಸುವುದು."),
      theory: L(
        "Each functional group gives characteristic reactions.\nAlcohols, phenols and acids liberate H₂ with sodium. Phenol gives a violet colour with neutral FeCl₃. Aldehydes and ketones both give an orange-yellow precipitate with 2,4-DNP; only aldehydes give a silver mirror with Tollens' reagent. Carboxylic acids give brisk effervescence with NaHCO₃. Aromatic primary amines like aniline give an orange-red azo dye.",
        "ಪ್ರತಿ ಕ್ರಿಯಾತ್ಮಕ ಗುಂಪು ವಿಶಿಷ್ಟ ಕ್ರಿಯೆಗಳನ್ನು ನೀಡುತ್ತದೆ.\nಆಲ್ಕೋಹಾಲ್, ಫೀನಾಲ್ ಮತ್ತು ಆಮ್ಲಗಳು ಸೋಡಿಯಂನೊಂದಿಗೆ H₂ ಬಿಡುಗಡೆ ಮಾಡುತ್ತವೆ. ಫೀನಾಲ್ ತಟಸ್ಥ FeCl₃ ನೊಂದಿಗೆ ನೇರಳೆ ಬಣ್ಣ ನೀಡುತ್ತದೆ. ಆಲ್ಡಿಹೈಡ್ ಮತ್ತು ಕೀಟೋನ್ ಎರಡೂ 2,4-DNP ನೊಂದಿಗೆ ಕಿತ್ತಳೆ-ಹಳದಿ ಅವಕ್ಷೇಪ ನೀಡುತ್ತವೆ; ಆಲ್ಡಿಹೈಡ್ ಮಾತ್ರ ಟೊಲೆನ್ಸ್ ಕಾರಕದೊಂದಿಗೆ ಬೆಳ್ಳಿ ಕನ್ನಡಿ ನೀಡುತ್ತದೆ. ಕಾರ್ಬಾಕ್ಸಿಲಿಕ್ ಆಮ್ಲಗಳು NaHCO₃ ನೊಂದಿಗೆ ತೀವ್ರ ಗುಳ್ಳೆಗಳನ್ನು ನೀಡುತ್ತವೆ. ಅನಿಲೀನ್‌ನಂತಹ ಆರೋಮ್ಯಾಟಿಕ್ ಪ್ರಾಥಮಿಕ ಅಮೈನ್‌ಗಳು ಕಿತ್ತಳೆ-ಕೆಂಪು ಅಜೋ ಬಣ್ಣ ನೀಡುತ್ತವೆ."
      ),
      apparatus: L("Test tubes, water bath, Na metal, FeCl₃, 2,4-DNP, Tollens' reagent, NaHCO₃, NaNO₂, HCl, β-naphthol, organic compounds", "ಪರೀಕ್ಷಾ ನಳಿಕೆಗಳು, ನೀರಿನ ತೊಟ್ಟಿ, Na ಲೋಹ, FeCl₃, 2,4-DNP, ಟೊಲೆನ್ಸ್ ಕಾರಕ, NaHCO₃, NaNO₂, HCl, β-ನ್ಯಾಫ್ಥಾಲ್, ಸಾವಯವ ಸಂಯುಕ್ತಗಳು"),
      procedure: [
        "Take 1 mL of the compound in a dry test tube for each test.",
        "Add a small piece of sodium and look for effervescence.",
        "Add neutral FeCl₃ drops and note colour.",
        "Add 2,4-DNP; if positive, warm with Tollens' reagent.",
        "Add NaHCO₃ for acids; perform the azo-dye test for amines.",
      ],
      sim: "bench",
      opts: {
        samples, reagents,
        react: {
          "eth|na": { gas: true, vigor: 20, metal: "#cbd5e1", obs: L("Effervescence; gas burns with pop", "ಗುಳ್ಳೆಗಳು; ಅನಿಲ 'ಪಾಪ್'"), inf: L("Active H (–OH) present", "ಕ್ರಿಯಾಶೀಲ H (–OH) ಇದೆ") },
          "phe|na": { gas: true, vigor: 20, metal: "#cbd5e1", obs: L("Effervescence (H₂)", "ಗುಳ್ಳೆಗಳು (H₂)"), inf: L("Active H present", "ಕ್ರಿಯಾಶೀಲ H ಇದೆ") },
          "acid|na": { gas: true, vigor: 35, metal: "#cbd5e1", obs: L("Vigorous effervescence (H₂)", "ತೀವ್ರ ಗುಳ್ಳೆಗಳು (H₂)"), inf: L("Active H present", "ಕ್ರಿಯಾಶೀಲ H ಇದೆ") },
          "phe|fecl3": { c: "rgba(126,34,206,0.75)", obs: L("Violet colour", "ನೇರಳೆ ಬಣ್ಣ"), inf: L("Phenolic –OH confirmed", "ಫೀನಾಲಿಕ್ –OH ದೃಢ") },
          "acid|fecl3": { c: "rgba(185,28,28,0.5)", obs: L("Buff/red colour", "ಕೆಂಪು ಬಣ್ಣ"), inf: L("Acetate ion indicated", "ಅಸಿಟೇಟ್ ಸೂಚನೆ") },
          "ald|dnp": { ppt: "#f97316", c: "rgba(251,146,60,0.5)", obs: L("Orange-yellow precipitate", "ಕಿತ್ತಳೆ-ಹಳದಿ ಅವಕ್ಷೇಪ"), inf: L("Carbonyl group (C=O) present", "ಕಾರ್ಬೊನಿಲ್ ಗುಂಪು (C=O) ಇದೆ") },
          "ket|dnp": { ppt: "#f97316", c: "rgba(251,146,60,0.5)", obs: L("Orange-yellow precipitate", "ಕಿತ್ತಳೆ-ಹಳದಿ ಅವಕ್ಷೇಪ"), inf: L("Carbonyl group (C=O) present", "ಕಾರ್ಬೊನಿಲ್ ಗುಂಪು (C=O) ಇದೆ") },
          "ald|tollens": { c: "rgba(148,163,184,0.9)", ppt: "#94a3b8", heat: true, obs: L("Shining silver mirror on the inner wall", "ಒಳಗೋಡೆಯ ಮೇಲೆ ಹೊಳೆಯುವ ಬೆಳ್ಳಿ ಕನ್ನಡಿ"), inf: L("Aldehyde (–CHO) confirmed", "ಆಲ್ಡಿಹೈಡ್ (–CHO) ದೃಢ") },
          "ket|tollens": { heat: true, obs: L("No silver mirror", "ಬೆಳ್ಳಿ ಕನ್ನಡಿ ಇಲ್ಲ"), inf: L("Not an aldehyde → ketone", "ಆಲ್ಡಿಹೈಡ್ ಅಲ್ಲ → ಕೀಟೋನ್") },
          "acid|nahco3": { gas: true, vigor: 60, obs: L("Brisk effervescence (CO₂)", "ತೀವ್ರ ಗುಳ್ಳೆಗಳು (CO₂)"), inf: L("Carboxylic acid (–COOH) confirmed", "ಕಾರ್ಬಾಕ್ಸಿಲಿಕ್ ಆಮ್ಲ (–COOH) ದೃಢ") },
          "ani|azo": { c: "rgba(234,88,12,0.75)", ppt: "#dc2626", obs: L("Orange-red dye formed", "ಕಿತ್ತಳೆ-ಕೆಂಪು ಬಣ್ಣ"), inf: L("Aromatic primary amine (–NH₂) confirmed", "ಆರೋಮ್ಯಾಟಿಕ್ ಪ್ರಾಥಮಿಕ ಅಮೈನ್ (–NH₂) ದೃಢ") },
        },
        identify: { prompt: L("Which functional group does the CURRENT compound contain?", "ಪ್ರಸ್ತುತ ಸಂಯುಕ್ತದಲ್ಲಿ ಯಾವ ಕ್ರಿಯಾತ್ಮಕ ಗುಂಪು ಇದೆ?"), choices: [L("Alcohol"), L("Phenol"), L("Aldehyde"), L("Ketone"), L("Carboxylic acid"), L("Amine")], answer: { eth: 0, phe: 1, ald: 2, ket: 3, acid: 4, ani: 5 } },
      },
      controls: benchControls(samples, reagents),
      canRecord: (p, r, x) => !!x.tested,
      table: benchCols,
      quiz: [
        q("Tollens' test distinguishes…", ["Alcohol from phenol", "Aldehyde from ketone", "Acid from ester", "Amine from amide"], 1, "Only aldehydes reduce Ag⁺."),
        q("Violet colour with neutral FeCl₃ indicates…", ["Alcohol", "Phenol", "Ketone", "Amine"], 1, "Phenols form coloured complexes."),
        q("2,4-DNP reacts with…", ["C=O group", "–OH group", "–NH₂ group", "C=C"], 0, "Forms 2,4-dinitrophenylhydrazone."),
        q("Effervescence with NaHCO₃ is shown by…", ["Phenol", "Ethanol", "Acetic acid", "Acetone"], 2, "Carboxylic acids are stronger than carbonic acid."),
      ],
    };
  })(),
  {
    id: "puc2-reaction-rate", subject: "chemistry", icon: "⏳",
    title: L("Effect of concentration and temperature on reaction rate", "ಕ್ರಿಯಾ ದರದ ಮೇಲೆ ಸಾಂದ್ರತೆ ಮತ್ತು ತಾಪದ ಪರಿಣಾಮ"),
    aim: L("To study the effect of concentration and temperature on the rate of reaction between sodium thiosulphate and hydrochloric acid.", "ಸೋಡಿಯಂ ಥಯೋಸಲ್ಫೇಟ್ ಮತ್ತು ಹೈಡ್ರೋಕ್ಲೋರಿಕ್ ಆಮ್ಲದ ಕ್ರಿಯೆಯ ದರದ ಮೇಲೆ ಸಾಂದ್ರತೆ ಮತ್ತು ತಾಪದ ಪರಿಣಾಮ ಅಧ್ಯಯನ."),
    theory: L(
      "Na₂S₂O₃ + 2HCl → 2NaCl + SO₂ + H₂O + S↓. Colloidal sulphur makes the solution turbid. The time taken for a cross mark under the flask to disappear is measured.\nRate ∝ 1/t. Higher concentration means more collisions, so rate increases linearly. A 10 °C rise in temperature roughly doubles the rate (more molecules have energy above activation energy).",
      "Na₂S₂O₃ + 2HCl → 2NaCl + SO₂ + H₂O + S↓. ಕಲಿಲ ಗಂಧಕ ದ್ರಾವಣವನ್ನು ಮಸುಕಾಗಿಸುತ್ತದೆ. ಫ್ಲಾಸ್ಕ್ ಕೆಳಗಿನ ಗುಣಾಕಾರ ಗುರುತು ಮರೆಯಾಗಲು ತೆಗೆದುಕೊಳ್ಳುವ ಸಮಯ ಅಳೆಯಲಾಗುತ್ತದೆ.\nದರ ∝ 1/t. ಹೆಚ್ಚು ಸಾಂದ್ರತೆ ಹೆಚ್ಚು ಘರ್ಷಣೆ, ಆದ್ದರಿಂದ ದರ ರೇಖೀಯವಾಗಿ ಹೆಚ್ಚುತ್ತದೆ. 10 °C ತಾಪ ಏರಿಕೆ ದರವನ್ನು ಸುಮಾರು ದ್ವಿಗುಣಗೊಳಿಸುತ್ತದೆ."
    ),
    formula: "Rate ∝ 1/t\nRate ∝ [Na₂S₂O₃]",
    apparatus: L("Conical flasks, 0.1 M Na₂S₂O₃, 1 M HCl, measuring cylinders, stopwatch, white paper with cross, thermometer, water bath", "ಶಂಖಾಕಾರದ ಫ್ಲಾಸ್ಕ್‌ಗಳು, 0.1 M Na₂S₂O₃, 1 M HCl, ಅಳತೆ ಸಿಲಿಂಡರ್‌ಗಳು, ಸ್ಟಾಪ್‌ವಾಚ್, ಗುಣಾಕಾರ ಗುರುತಿನ ಬಿಳಿ ಕಾಗದ, ಉಷ್ಣತಾಮಾಪಕ, ನೀರಿನ ತೊಟ್ಟಿ"),
    procedure: [
      "Take 10, 20, 30, 40, 50 mL of Na₂S₂O₃ and make each up to 50 mL with water.",
      "Place the flask on a paper with a cross.",
      "Add 10 mL HCl, start the stopwatch and swirl.",
      "Stop when the cross just disappears from view. Note t.",
      "Repeat at different temperatures with a fixed concentration.",
    ],
    sim: "rate",
    controls: [sl("conc", L("Na₂S₂O₃ volume (made to 50 mL)", "Na₂S₂O₃ ಘನಫಲ (50 mL ಗೆ)"), 10, 50, 5, 30, "mL"), sl("temp", L("Temperature", "ತಾಪ"), 20, 60, 5, 25, "°C")],
    compute: (p, x) => ({ tTrue: (1200 / p.conc) * Math.pow(2, -(p.temp - 25) / 10), time: x.time, inv: x.time ? 1000 / x.time : null }),
    readouts: [col("time", L("Time for cross to vanish", "ಗುರುತು ಮರೆಯಾಗುವ ಸಮಯ"), "s", 1), col("inv", L("Rate 1000/t", "ದರ 1000/t"), "s⁻¹", 2)],
    canRecord: (p, r, x) => !!x.time,
    table: [col("conc", L("Na₂S₂O₃", "Na₂S₂O₃"), "mL", 0), col("temp", L("Temp", "ತಾಪ"), "°C", 0), col("time", L("t", "t"), "s", 1), col("inv", L("1000/t", "1000/t"), "s⁻¹", 2)],
    graph: { x: "conc", y: "inv", fit: "origin", note: L("Keep temperature fixed for the concentration graph.", "ಸಾಂದ್ರತೆ ನಕ್ಷೆಗೆ ತಾಪವನ್ನು ಸ್ಥಿರವಾಗಿಡಿ.") },
    tip: L("Keep 30 mL and go from 25 °C to 35 °C. Does the time roughly halve?", "30 mL ಇಟ್ಟು 25 °C ರಿಂದ 35 °C ಗೆ ಹೋಗಿ. ಸಮಯ ಸುಮಾರು ಅರ್ಧವಾಗುತ್ತದೆಯೇ?"),
    quiz: [
      q("The turbidity is due to…", ["SO₂", "NaCl", "Colloidal sulphur", "Water"], 2, "Sulphur precipitates as fine particles."),
      q("Rate of reaction is taken as…", ["t", "1/t", "t²", "log t"], 1, "Shorter time = faster rate."),
      q("Temperature coefficient for most reactions is about…", ["1", "2–3", "10", "0.5"], 1, "Rate doubles or triples per 10 °C."),
      q("Increasing concentration increases rate because…", ["Activation energy falls", "Collision frequency rises", "Catalyst forms", "Temperature rises"], 1, "More particles per volume collide more often."),
    ],
  },
  {
    id: "puc2-chromatography", subject: "chemistry", icon: "🎨",
    title: L("Paper chromatography of leaf pigments", "ಎಲೆ ವರ್ಣದ್ರವ್ಯಗಳ ಕಾಗದ ವರ್ಣರೇಖನ"),
    aim: L("To separate the pigments of a leaf extract by paper chromatography and find their Rf values.", "ಕಾಗದ ವರ್ಣರೇಖನದಿಂದ ಎಲೆಯ ಸಾರದ ವರ್ಣದ್ರವ್ಯಗಳನ್ನು ಬೇರ್ಪಡಿಸಿ ಅವುಗಳ Rf ಮೌಲ್ಯ ಕಂಡುಹಿಡಿಯುವುದು."),
    theory: L(
      "Chromatography separates components of a mixture because they move at different speeds over a stationary phase (paper) carried by a mobile phase (solvent).\nComponents more soluble in the solvent and less attracted to the paper travel farther. Rf = distance moved by the spot / distance moved by the solvent front. Rf is constant for a substance in a given solvent.",
      "ವರ್ಣರೇಖನವು ಮಿಶ್ರಣದ ಘಟಕಗಳನ್ನು ಬೇರ್ಪಡಿಸುತ್ತದೆ, ಏಕೆಂದರೆ ಅವು ಚಲನ ಹಂತ (ದ್ರಾವಕ) ಮೂಲಕ ಸ್ಥಿರ ಹಂತದ (ಕಾಗದ) ಮೇಲೆ ಬೇರೆ ವೇಗದಲ್ಲಿ ಚಲಿಸುತ್ತವೆ.\nದ್ರಾವಕದಲ್ಲಿ ಹೆಚ್ಚು ಕರಗುವ ಮತ್ತು ಕಾಗದಕ್ಕೆ ಕಡಿಮೆ ಆಕರ್ಷಿತ ಘಟಕಗಳು ಹೆಚ್ಚು ದೂರ ಸಾಗುತ್ತವೆ. Rf = ಬಿಂದು ಸಾಗಿದ ದೂರ / ದ್ರಾವಕ ಮುಂಚೂಣಿ ಸಾಗಿದ ದೂರ."
    ),
    formula: "Rf = distance of spot / distance of solvent front",
    apparatus: L("Whatman filter paper strip, chromatography jar, capillary tube, leaf extract in acetone, solvent (petroleum ether : acetone 9:1), pencil, scale", "ವಾಟ್ಮನ್ ಫಿಲ್ಟರ್ ಕಾಗದ ಪಟ್ಟಿ, ವರ್ಣರೇಖನ ಜಾಡಿ, ಕೇಶನಾಳಿಕೆ, ಅಸಿಟೋನ್‌ನಲ್ಲಿ ಎಲೆಯ ಸಾರ, ದ್ರಾವಕ, ಪೆನ್ಸಿಲ್, ಅಳತೆಪಟ್ಟಿ"),
    procedure: [
      "Draw a pencil base line 2 cm from the bottom of the paper strip.",
      "Put a concentrated spot of leaf extract on the base line using a capillary; let it dry and repeat.",
      "Hang the strip in the jar so the solvent is below the base line.",
      "Remove the paper when the solvent has risen well; mark the solvent front.",
      "Measure distances of each pigment and calculate Rf.",
    ],
    sim: "chroma",
    opts: { solvent: "Petroleum ether : acetone (9:1)", maxFront: 11, components: [
      { name: "Carotene", color: "#f59e0b", rf: 0.95 }, { name: "Xanthophyll", color: "#facc15", rf: 0.72 },
      { name: "Chlorophyll a", color: "#0d9488", rf: 0.48 }, { name: "Chlorophyll b", color: "#65a30d", rf: 0.3 },
    ] },
    controls: [sel("spot", L("Measure spot", "ಅಳೆಯಬೇಕಾದ ಬಿಂದು"), [opt(0, "Carotene (orange)", "ಕ್ಯಾರೋಟಿನ್ (ಕಿತ್ತಳೆ)"), opt(1, "Xanthophyll (yellow)", "ಕ್ಸಾಂಥೋಫಿಲ್ (ಹಳದಿ)"), opt(2, "Chlorophyll a (blue-green)", "ಹರಿತ್ತು a (ನೀಲಿ-ಹಸಿರು)"), opt(3, "Chlorophyll b (yellow-green)", "ಹರಿತ್ತು b (ಹಳದಿ-ಹಸಿರು)")], 0)],
    x0: { front: 0, stopped: false },
    compute: (p, x) => {
      const rf = [0.95, 0.72, 0.48, 0.3][p.spot], f = x.front || 0;
      const names = [L("Carotene", "ಕ್ಯಾರೋಟಿನ್"), L("Xanthophyll", "ಕ್ಸಾಂಥೋಫಿಲ್"), L("Chlorophyll a", "ಹರಿತ್ತು a"), L("Chlorophyll b", "ಹರಿತ್ತು b")];
      const d = Math.round(rf * f * 10) / 10;
      return { solventD: f, spotD: d, Rf: f ? d / f : null, pig: names[p.spot] };
    },
    readouts: [col("solventD", L("Solvent front", "ದ್ರಾವಕ ಮುಂಚೂಣಿ"), "cm", 1), col("spotD", L("Spot distance", "ಬಿಂದು ದೂರ"), "cm", 1), col("Rf", L("Rf", "Rf"), "", 2)],
    canRecord: (p, r, x) => !!x.stopped && (x.front || 0) > 3,
    table: [col("pig", L("Pigment", "ವರ್ಣದ್ರವ್ಯ")), col("spotD", L("Spot", "ಬಿಂದು"), "cm", 1), col("solventD", L("Solvent", "ದ್ರಾವಕ"), "cm", 1), col("Rf", L("Rf", "Rf"), "", 2)],
    tip: L("Run the solvent, stop it, then record each of the four pigments.", "ದ್ರಾವಕ ಹರಿಸಿ, ನಿಲ್ಲಿಸಿ, ನಂತರ ನಾಲ್ಕೂ ವರ್ಣದ್ರವ್ಯಗಳನ್ನು ದಾಖಲಿಸಿ."),
    quiz: [
      q("Rf value is always…", ["Greater than 1", "Less than or equal to 1", "Negative", "Zero"], 1, "A spot cannot travel farther than the solvent."),
      q("The base line is drawn with a pencil because…", ["It is cheaper", "Ink would dissolve and move", "Pencil is darker", "It is required by law"], 1, "Graphite does not dissolve in the solvent."),
      q("The pigment that moves farthest is…", ["Chlorophyll b", "Chlorophyll a", "Xanthophyll", "Carotene"], 3, "Carotene is least polar."),
      q("In paper chromatography the stationary phase is…", ["Solvent", "Water held in paper", "Air", "Jar"], 1, "Water adsorbed on cellulose acts as stationary phase."),
    ],
  },

  /* ============================ BIOLOGY ============================ */
  {
    id: "puc2-pollen-germination", subject: "biology", icon: "🌼",
    title: L("Pollen germination on sugar solution", "ಸಕ್ಕರೆ ದ್ರಾವಣದಲ್ಲಿ ಪರಾಗ ಮೊಳಕೆಯೊಡೆಯುವಿಕೆ"),
    aim: L("To study pollen germination on a slide in different sucrose concentrations and find the optimum.", "ವಿವಿಧ ಸುಕ್ರೋಸ್ ಸಾಂದ್ರತೆಗಳಲ್ಲಿ ಸ್ಲೈಡ್ ಮೇಲೆ ಪರಾಗ ಮೊಳಕೆಯೊಡೆಯುವಿಕೆ ಅಧ್ಯಯನ ಮಾಡಿ ಅನುಕೂಲತಮ ಸಾಂದ್ರತೆ ಕಂಡುಹಿಡಿಯುವುದು."),
    theory: L(
      "On the stigma, a pollen grain absorbs water and sugar and grows a pollen tube through one of its germ pores. A sucrose (with boric acid) medium on a slide copies these conditions.\nToo little sugar gives poor germination (grains may burst in water); too much sugar draws water out. The percentage germination is highest at an optimum concentration (about 10%).",
      "ಶಲಾಕಾಗ್ರದ ಮೇಲೆ ಪರಾಗ ಕಣ ನೀರು ಮತ್ತು ಸಕ್ಕರೆ ಹೀರಿ ಮೊಳಕೆ ರಂಧ್ರದ ಮೂಲಕ ಪರಾಗ ನಾಳ ಬೆಳೆಸುತ್ತದೆ. ಸ್ಲೈಡ್ ಮೇಲಿನ ಸುಕ್ರೋಸ್ (ಬೋರಿಕ್ ಆಮ್ಲ ಸಹಿತ) ಮಾಧ್ಯಮ ಈ ಸ್ಥಿತಿಯನ್ನು ಅನುಕರಿಸುತ್ತದೆ.\nಸಕ್ಕರೆ ಕಡಿಮೆಯಾದರೆ ಮೊಳಕೆ ಕಡಿಮೆ (ಕಣಗಳು ಒಡೆಯಬಹುದು); ಹೆಚ್ಚಾದರೆ ನೀರು ಹೊರಸೆಳೆಯಲ್ಪಡುತ್ತದೆ. ಅನುಕೂಲತಮ ಸಾಂದ್ರತೆಯಲ್ಲಿ (ಸುಮಾರು 10%) ಮೊಳಕೆ ಶೇಕಡಾ ಗರಿಷ್ಠ."
    ),
    formula: "% germination = germinated / total × 100",
    apparatus: L("Fresh flowers (e.g. Vinca/ Hibiscus), sucrose solutions (0–30%), boric acid, cavity slides, cover slips, microscope", "ತಾಜಾ ಹೂವುಗಳು, ಸುಕ್ರೋಸ್ ದ್ರಾವಣಗಳು (0–30%), ಬೋರಿಕ್ ಆಮ್ಲ, ಕುಳಿ ಸ್ಲೈಡ್‌ಗಳು, ಕವರ್ ಸ್ಲಿಪ್‌ಗಳು, ಸೂಕ್ಷ್ಮದರ್ಶಕ"),
    procedure: [
      "Put a drop of each sucrose solution on separate slides.",
      "Dust pollen from a fresh flower onto each drop.",
      "Observe after 15, 30 and 45 minutes.",
      "Count germinated and total grains in a field; calculate % germination.",
      "Plot % germination against concentration.",
    ],
    sim: "microscope",
    opts: { specimen: "pollen", find: [{ type: "germinated", l: L("a germinated pollen grain", "ಮೊಳಕೆಯೊಡೆದ ಪರಾಗ ಕಣ") }, { type: "notgerminated", l: L("a non-germinated grain", "ಮೊಳಕೆಯೊಡೆಯದ ಕಣ") }] },
    controls: [sl("sucrose", L("Sucrose concentration", "ಸುಕ್ರೋಸ್ ಸಾಂದ್ರತೆ"), 0, 30, 2, 10, "%"), sl("time", L("Time after sowing", "ಬಿತ್ತಿದ ನಂತರ ಸಮಯ"), 0, 60, 5, 30, "min"), ...focusControls],
    x0: { field: 1 },
    compute: (p, x) => { const G = x.counts?.germinated || 0, T = x.total || 0; return { G, T, pct: T ? (G / T) * 100 : 0 }; },
    readouts: [col("T", L("Grains in view", "ಕಾಣುವ ಕಣಗಳು"), "", 0), col("G", L("Germinated", "ಮೊಳಕೆಯೊಡೆದವು"), "", 0), col("pct", L("% germination", "% ಮೊಳಕೆ"), "%", 1)],
    canRecord: (p) => Math.abs(p.focus - 50) < 12,
    table: [col("sucrose", L("Sucrose", "ಸುಕ್ರೋಸ್"), "%", 0), col("time", L("Time", "ಸಮಯ"), "min", 0), col("T", L("Total", "ಒಟ್ಟು"), "", 0), col("G", L("Germinated", "ಮೊಳಕೆ"), "", 0), col("pct", L("%", "%"), "%", 1)],
    graph: { x: "sucrose", y: "pct", fit: "curve" },
    result: (rows) => { const b = rows.reduce((a, c) => (c.pct > a.pct ? c : a)); return L(`Highest germination ${b.pct.toFixed(0)}% at ${b.sucrose}% sucrose`, `ಗರಿಷ್ಠ ಮೊಳಕೆ ${b.pct.toFixed(0)}% — ${b.sucrose}% ಸುಕ್ರೋಸ್‌ನಲ್ಲಿ`); },
    quiz: [
      q("Boric acid is added to the medium to…", ["Kill pollen", "Promote pollen tube growth", "Colour pollen", "Preserve slide"], 1, "Boron aids pollen germination and tube growth."),
      q("Pollen tube emerges through the…", ["Exine", "Germ pore", "Generative cell", "Stigma"], 1, "The germ pore lacks sporopollenin."),
      q("In very concentrated sugar, pollen…", ["Germinates best", "Loses water and fails", "Bursts", "Turns blue"], 1, "Hypertonic medium draws water out."),
      q("The outer wall of pollen is made of…", ["Cellulose", "Sporopollenin", "Chitin", "Lignin"], 1, "Highly resistant sporopollenin."),
    ],
  },
  {
    id: "puc2-monohybrid", subject: "biology", icon: "🌱",
    title: L("Monohybrid cross — Mendel's 3 : 1 ratio", "ಏಕಸಂಕರ — ಮೆಂಡಲ್‌ನ 3 : 1 ಅನುಪಾತ"),
    aim: L("To verify Mendel's monohybrid ratio using a bead (random gamete) model.", "ಮಣಿ (ಯಾದೃಚ್ಛಿಕ ಲಿಂಗಾಣು) ಮಾದರಿ ಬಳಸಿ ಮೆಂಡಲ್‌ನ ಏಕಸಂಕರ ಅನುಪಾತ ಪರಿಶೀಲಿಸುವುದು."),
    theory: L(
      "In a cross between two heterozygous tall plants (Tt × Tt), each parent forms T and t gametes in equal numbers (law of segregation). Random fusion gives TT : Tt : tt = 1 : 2 : 1, i.e. Tall : Dwarf = 3 : 1 because T is dominant.\nWith small samples the observed ratio differs from 3 : 1 by chance; larger samples come closer.",
      "ಎರಡು ವಿಷಮಯುಗ್ಮಜ ಎತ್ತರದ ಸಸ್ಯಗಳ ಸಂಕರಣದಲ್ಲಿ (Tt × Tt) ಪ್ರತಿ ಪೋಷಕ T ಮತ್ತು t ಲಿಂಗಾಣುಗಳನ್ನು ಸಮ ಸಂಖ್ಯೆಯಲ್ಲಿ ಉಂಟುಮಾಡುತ್ತದೆ (ಪ್ರತ್ಯೇಕೀಕರಣ ನಿಯಮ). ಯಾದೃಚ್ಛಿಕ ಸಂಯೋಗ TT : Tt : tt = 1 : 2 : 1, ಅಂದರೆ ಎತ್ತರ : ಕುಳ್ಳ = 3 : 1, ಏಕೆಂದರೆ T ಪ್ರಬಲ.\nಸಣ್ಣ ಮಾದರಿಗಳಲ್ಲಿ ಆಕಸ್ಮಿಕವಾಗಿ ಅನುಪಾತ 3 : 1 ರಿಂದ ಭಿನ್ನವಾಗಬಹುದು; ದೊಡ್ಡ ಮಾದರಿಗಳು ಹತ್ತಿರ ಬರುತ್ತವೆ."
    ),
    formula: "Tt × Tt → 1 TT : 2 Tt : 1 tt\nPhenotype 3 Tall : 1 Dwarf",
    apparatus: L("Two beakers, 64 red and 64 white beads (or seeds), Punnett square chart", "ಎರಡು ಬೀಕರ್‌ಗಳು, 64 ಕೆಂಪು ಮತ್ತು 64 ಬಿಳಿ ಮಣಿಗಳು, ಪನೆಟ್ ಚೌಕ ಚಾರ್ಟ್"),
    procedure: [
      "Put equal numbers of red (T) and white (t) beads in each beaker (each beaker = one parent's gametes).",
      "Without looking, pick one bead from each beaker and record the pair.",
      "Return the beads, mix and repeat 64 or more times.",
      "Count genotypes and phenotypes and calculate the ratio.",
    ],
    sim: "genetics", opts: { type: "mono" },
    controls: [
      sel("p1", L("Parent 1", "ಪೋಷಕ 1"), [opt("TT", "TT"), opt("Tt", "Tt"), opt("tt", "tt")], "Tt"),
      sel("p2", L("Parent 2", "ಪೋಷಕ 2"), [opt("TT", "TT"), opt("Tt", "Tt"), opt("tt", "tt")], "Tt"),
      sl("n", L("Number of offspring", "ಸಂತತಿಗಳ ಸಂಖ್ಯೆ"), 20, 200, 20, 100),
    ],
    compute: (p, x) => { const T = x.counts?.Tall || 0, D = x.counts?.Dwarf || 0; return { Tall: T, Dwarf: D, ratio: D ? (T / D).toFixed(2) + " : 1" : T ? "all Tall" : "—", cross: `${p.p1} × ${p.p2}` }; },
    readouts: [col("Tall", L("Tall", "ಎತ್ತರ"), "", 0), col("Dwarf", L("Dwarf", "ಕುಳ್ಳ"), "", 0), col("ratio", L("Tall : Dwarf", "ಎತ್ತರ : ಕುಳ್ಳ"))],
    canRecord: (p, r, x) => !!x.crossed,
    table: [col("cross", L("Cross", "ಸಂಕರ")), col("n", L("n", "n"), "", 0), col("Tall", L("Tall", "ಎತ್ತರ"), "", 0), col("Dwarf", L("Dwarf", "ಕುಳ್ಳ"), "", 0), col("ratio", L("Ratio", "ಅನುಪಾತ"))],
    tip: L("Cross Tt × Tt with 20 offspring, then 200. Which one is closer to 3 : 1? Also try Tt × tt (test cross).", "Tt × Tt ಅನ್ನು 20, ನಂತರ 200 ಸಂತತಿಗಳೊಂದಿಗೆ ಮಾಡಿ. ಯಾವುದು 3 : 1 ಗೆ ಹತ್ತಿರ? Tt × tt (ಪರೀಕ್ಷಾ ಸಂಕರ) ಕೂಡ ಪ್ರಯತ್ನಿಸಿ."),
    quiz: [
      q("Genotypic ratio of a monohybrid F₂ is…", ["3 : 1", "1 : 2 : 1", "9 : 3 : 3 : 1", "1 : 1"], 1, "TT : Tt : tt."),
      q("A test cross is a cross with the…", ["Dominant parent", "Recessive parent", "F₁ itself", "Wild plant"], 1, "Tt × tt gives 1 : 1."),
      q("Law of segregation is also called…", ["Law of purity of gametes", "Law of dominance", "Law of independent assortment", "Law of linkage"], 0, "Each gamete carries only one allele."),
      q("Mendel worked on…", ["Drosophila", "Garden pea", "Maize", "Snapdragon"], 1, "Pisum sativum."),
    ],
  },
  {
    id: "puc2-dihybrid", subject: "biology", icon: "🟡",
    title: L("Dihybrid cross — 9 : 3 : 3 : 1", "ದ್ವಿಸಂಕರ — 9 : 3 : 3 : 1"),
    aim: L("To demonstrate Mendel's law of independent assortment using a dihybrid cross of seed shape and colour.", "ಬೀಜದ ಆಕಾರ ಮತ್ತು ಬಣ್ಣದ ದ್ವಿಸಂಕರ ಬಳಸಿ ಮೆಂಡಲ್‌ನ ಸ್ವತಂತ್ರ ವಿಂಗಡಣೆ ನಿಯಮ ಪ್ರದರ್ಶಿಸುವುದು."),
    theory: L(
      "Round (R) is dominant over wrinkled (r) and yellow (Y) over green (y). An F₁ plant RrYy forms four kinds of gametes — RY, Ry, rY, ry — in equal numbers because the two genes assort independently.\nRandom fusion gives 16 combinations and the phenotypic ratio Round-Yellow : Round-Green : Wrinkled-Yellow : Wrinkled-Green = 9 : 3 : 3 : 1.",
      "ಗುಂಡು (R) ಸುಕ್ಕಿಗಿಂತ (r) ಮತ್ತು ಹಳದಿ (Y) ಹಸಿರಿಗಿಂತ (y) ಪ್ರಬಲ. F₁ ಸಸ್ಯ RrYy ನಾಲ್ಕು ಬಗೆಯ ಲಿಂಗಾಣುಗಳನ್ನು — RY, Ry, rY, ry — ಸಮ ಸಂಖ್ಯೆಯಲ್ಲಿ ಉಂಟುಮಾಡುತ್ತದೆ, ಏಕೆಂದರೆ ಎರಡು ಜೀನ್‌ಗಳು ಸ್ವತಂತ್ರವಾಗಿ ವಿಂಗಡಿಸಲ್ಪಡುತ್ತವೆ.\nಯಾದೃಚ್ಛಿಕ ಸಂಯೋಗ 16 ಸಂಯೋಜನೆಗಳು ಮತ್ತು ಗುಂಡು-ಹಳದಿ : ಗುಂಡು-ಹಸಿರು : ಸುಕ್ಕು-ಹಳದಿ : ಸುಕ್ಕು-ಹಸಿರು = 9 : 3 : 3 : 1 ಅನುಪಾತ ನೀಡುತ್ತದೆ."
    ),
    formula: "RrYy × RrYy → 9 : 3 : 3 : 1",
    apparatus: L("Four colours/shapes of beads or seeds, two containers, Punnett square chart", "ನಾಲ್ಕು ಬಣ್ಣ/ಆಕಾರದ ಮಣಿಗಳು ಅಥವಾ ಬೀಜಗಳು, ಎರಡು ಡಬ್ಬಗಳು, ಪನೆಟ್ ಚೌಕ ಚಾರ್ಟ್"),
    procedure: [
      "Prepare equal numbers of RY, Ry, rY and ry gamete beads in each of two containers.",
      "Pick one from each container randomly and record the zygote.",
      "Repeat many times.",
      "Count the four phenotypes and compare with 9 : 3 : 3 : 1.",
    ],
    sim: "genetics", opts: { type: "di" },
    controls: [
      sel("p1", L("Parent 1", "ಪೋಷಕ 1"), [opt("RrYy", "RrYy"), opt("RRYY", "RRYY"), opt("rryy", "rryy")], "RrYy"),
      sel("p2", L("Parent 2", "ಪೋಷಕ 2"), [opt("RrYy", "RrYy"), opt("RRYY", "RRYY"), opt("rryy", "rryy")], "RrYy"),
      sl("n", L("Number of offspring", "ಸಂತತಿಗಳ ಸಂಖ್ಯೆ"), 16, 320, 16, 160),
    ],
    compute: (p, x) => {
      const c = x.counts || {}, RY = c["Round-Yellow"] || 0, Rg = c["Round-Green"] || 0, wY = c["Wrinkled-Yellow"] || 0, wg = c["Wrinkled-Green"] || 0, N = RY + Rg + wY + wg;
      const exp = [9, 3, 3, 1].map((k) => (k / 16) * N);
      const chi = N ? [RY, Rg, wY, wg].reduce((s, o, i) => s + (o - exp[i]) ** 2 / exp[i], 0) : null;
      return { RY, Rg, wY, wg, chi, cross: `${p.p1} × ${p.p2}` };
    },
    readouts: [col("RY", L("Round-Yellow", "ಗುಂಡು-ಹಳದಿ"), "", 0), col("Rg", L("Round-Green", "ಗುಂಡು-ಹಸಿರು"), "", 0), col("wY", L("Wrinkled-Yellow", "ಸುಕ್ಕು-ಹಳದಿ"), "", 0), col("wg", L("Wrinkled-Green", "ಸುಕ್ಕು-ಹಸಿರು"), "", 0)],
    canRecord: (p, r, x) => !!x.crossed,
    table: [col("cross", L("Cross", "ಸಂಕರ")), col("RY", L("RY", "RY"), "", 0), col("Rg", L("Ry", "Ry"), "", 0), col("wY", L("rY", "rY"), "", 0), col("wg", L("ry", "ry"), "", 0), col("chi", L("χ² vs 9:3:3:1", "χ²"), "", 2)],
    result: (rows) => { const r = rows[rows.length - 1]; return r.chi != null ? L(`χ² = ${r.chi.toFixed(2)} ${r.chi < 7.81 ? "< 7.81 → fits 9 : 3 : 3 : 1 (p > 0.05)" : "> 7.81 → does not fit 9 : 3 : 3 : 1"}`, `χ² = ${r.chi.toFixed(2)} ${r.chi < 7.81 ? "< 7.81 → 9 : 3 : 3 : 1 ಗೆ ಹೊಂದುತ್ತದೆ" : "> 7.81 → ಹೊಂದುವುದಿಲ್ಲ"}`) : L("—"); },
    quiz: [
      q("Number of gamete types from RrYy is…", ["2", "4", "8", "16"], 1, "RY, Ry, rY, ry."),
      q("Phenotypic ratio of a dihybrid F₂ is…", ["3 : 1", "9 : 3 : 3 : 1", "1 : 2 : 1", "1 : 1 : 1 : 1"], 1, "Classic Mendelian ratio."),
      q("Ratio of RrYy × rryy (test cross) is…", ["9 : 3 : 3 : 1", "1 : 1 : 1 : 1", "3 : 1", "1 : 2 : 1"], 1, "Each gamete type shows."),
      q("Independent assortment holds when genes are on…", ["The same chromosome close together", "Different chromosomes", "Mitochondria", "Ribosomes"], 1, "Linked genes do not assort independently."),
    ],
  },
  {
    id: "puc2-quadrat", subject: "biology", icon: "🟩",
    title: L("Population density and frequency by quadrat method", "ಕ್ವಾಡ್ರಾಟ್ ವಿಧಾನದಿಂದ ಜನಸಂಖ್ಯೆ ಸಾಂದ್ರತೆ ಮತ್ತು ಆವರ್ತನ"),
    aim: L("To study population density and frequency of plant species using the quadrat method.", "ಕ್ವಾಡ್ರಾಟ್ ವಿಧಾನ ಬಳಸಿ ಸಸ್ಯ ಪ್ರಭೇದಗಳ ಜನಸಂಖ್ಯೆ ಸಾಂದ್ರತೆ ಮತ್ತು ಆವರ್ತನ ಅಧ್ಯಯನ."),
    theory: L(
      "A quadrat is a square frame (here 1 m × 1 m) placed at random in an area to sample the vegetation.\nDensity = total number of individuals of a species / (number of quadrats studied × area of quadrat). Frequency (%) = number of quadrats in which the species occurs / total quadrats × 100. Frequency tells how widely a species is spread; density tells how crowded it is.",
      "ಕ್ವಾಡ್ರಾಟ್ ಒಂದು ಚೌಕ ಚೌಕಟ್ಟು (ಇಲ್ಲಿ 1 m × 1 m); ಸಸ್ಯವರ್ಗದ ಮಾದರಿಗಾಗಿ ಪ್ರದೇಶದಲ್ಲಿ ಯಾದೃಚ್ಛಿಕವಾಗಿ ಇಡಲಾಗುತ್ತದೆ.\nಸಾಂದ್ರತೆ = ಪ್ರಭೇದದ ಒಟ್ಟು ವ್ಯಕ್ತಿಗಳು / (ಅಧ್ಯಯನ ಮಾಡಿದ ಕ್ವಾಡ್ರಾಟ್‌ಗಳು × ಕ್ವಾಡ್ರಾಟ್ ವಿಸ್ತೀರ್ಣ). ಆವರ್ತನ (%) = ಪ್ರಭೇದ ಕಂಡುಬಂದ ಕ್ವಾಡ್ರಾಟ್‌ಗಳು / ಒಟ್ಟು ಕ್ವಾಡ್ರಾಟ್‌ಗಳು × 100. ಆವರ್ತನ ಹರಡಿಕೆಯನ್ನು, ಸಾಂದ್ರತೆ ದಟ್ಟಣೆಯನ್ನು ತಿಳಿಸುತ್ತದೆ."
    ),
    formula: "Density = total individuals / (quadrats × area)\nFrequency % = quadrats with species / total × 100",
    apparatus: L("Quadrat frame (1 m²), measuring tape, nails, thread, notebook", "ಕ್ವಾಡ್ರಾಟ್ ಚೌಕಟ್ಟು (1 m²), ಅಳತೆ ಟೇಪ್, ಮೊಳೆಗಳು, ದಾರ, ನೋಟ್‌ಬುಕ್"),
    procedure: [
      "Select a grassland area and place the quadrat at random.",
      "Count the individuals of each species inside the quadrat.",
      "Repeat for at least 10 quadrats.",
      "Calculate density and frequency for each species.",
    ],
    sim: "quadrat",
    compute: (p, x) => ({ nA: x.nA, nB: x.nB, nC: x.nC, qn: x.placed || 0 }),
    readouts: [col("nA", L("Grass (A)", "ಹುಲ್ಲು (A)"), "", 0), col("nB", L("Daisy (B)", "ಡೈಸಿ (B)"), "", 0), col("nC", L("Clover (C)", "ಕ್ಲೋವರ್ (C)"), "", 0)],
    canRecord: (p, r, x) => !!x.q,
    table: [col("nA", L("A", "A"), "", 0), col("nB", L("B", "B"), "", 0), col("nC", L("C", "C"), "", 0)],
    result: (rows) => {
      const n = rows.length; const f = (k) => ((rows.filter((r) => r[k] > 0).length / n) * 100).toFixed(0); const d = (k) => (rows.reduce((s, r) => s + r[k], 0) / n).toFixed(1);
      return L(`Density per m² — A: ${d("nA")}, B: ${d("nB")}, C: ${d("nC")}. Frequency — A: ${f("nA")}%, B: ${f("nB")}%, C: ${f("nC")}%.`, `ಪ್ರತಿ m² ಸಾಂದ್ರತೆ — A: ${d("nA")}, B: ${d("nB")}, C: ${d("nC")}. ಆವರ್ತನ — A: ${f("nA")}%, B: ${f("nB")}%, C: ${f("nC")}%.`);
    },
    tip: L("Throw at least 10 quadrats at random. Daisies grow in clumps — compare their density and frequency.", "ಕನಿಷ್ಠ 10 ಕ್ವಾಡ್ರಾಟ್ ಯಾದೃಚ್ಛಿಕವಾಗಿ ಎಸೆಯಿರಿ. ಡೈಸಿಗಳು ಗುಂಪುಗಳಲ್ಲಿ ಬೆಳೆಯುತ್ತವೆ — ಅವುಗಳ ಸಾಂದ್ರತೆ ಮತ್ತು ಆವರ್ತನ ಹೋಲಿಸಿ."),
    quiz: [
      q("Quadrats should be placed…", ["Only where plants are many", "At random", "Only at edges", "In a line"], 1, "Random placement avoids bias."),
      q("A species found in 4 out of 10 quadrats has frequency…", ["4%", "40%", "10%", "0.4%"], 1, "4/10 × 100."),
      q("Density is expressed as…", ["Number per unit area", "Percentage", "Weight", "Height"], 0, "Individuals per m²."),
      q("A clumped species usually has…", ["High frequency, low density", "Low frequency, high local density", "Equal values", "Zero density"], 1, "Found in few quadrats, but many in each."),
    ],
  },
  {
    id: "puc2-soil-ph", subject: "biology", icon: "🟤",
    title: L("pH of different soil samples", "ವಿವಿಧ ಮಣ್ಣಿನ ಮಾದರಿಗಳ pH"),
    aim: L("To study the pH of soil samples collected from different sites.", "ವಿವಿಧ ಸ್ಥಳಗಳಿಂದ ಸಂಗ್ರಹಿಸಿದ ಮಣ್ಣಿನ ಮಾದರಿಗಳ pH ಅಧ್ಯಯನ."),
    theory: L(
      "Soil pH affects which nutrients are available to plants and which plants can grow. Most crops grow best between pH 6 and 7.5.\nRed and laterite soils (common in Karnataka) are often acidic; black cotton soil is slightly alkaline. Acidic soils are treated with lime and alkaline soils with gypsum.",
      "ಮಣ್ಣಿನ pH ಸಸ್ಯಗಳಿಗೆ ಲಭ್ಯವಾಗುವ ಪೋಷಕಾಂಶಗಳು ಮತ್ತು ಬೆಳೆಯಬಲ್ಲ ಸಸ್ಯಗಳ ಮೇಲೆ ಪರಿಣಾಮ ಬೀರುತ್ತದೆ. ಹೆಚ್ಚಿನ ಬೆಳೆಗಳು pH 6 ರಿಂದ 7.5 ರಲ್ಲಿ ಚೆನ್ನಾಗಿ ಬೆಳೆಯುತ್ತವೆ.\nಕೆಂಪು ಮತ್ತು ಜಂಬಿಟ್ಟಿಗೆ ಮಣ್ಣುಗಳು (ಕರ್ನಾಟಕದಲ್ಲಿ ಸಾಮಾನ್ಯ) ಹೆಚ್ಚಾಗಿ ಆಮ್ಲೀಯ; ಕಪ್ಪು ಹತ್ತಿ ಮಣ್ಣು ಸ್ವಲ್ಪ ಪ್ರತ್ಯಾಮ್ಲೀಯ. ಆಮ್ಲೀಯ ಮಣ್ಣಿಗೆ ಸುಣ್ಣ, ಪ್ರತ್ಯಾಮ್ಲೀಯ ಮಣ್ಣಿಗೆ ಜಿಪ್ಸಮ್ ಬಳಸಲಾಗುತ್ತದೆ."
    ),
    apparatus: L("Soil samples, beakers, distilled water, filter paper, funnel, pH paper / universal indicator", "ಮಣ್ಣಿನ ಮಾದರಿಗಳು, ಬೀಕರ್‌ಗಳು, ಬಟ್ಟಿ ನೀರು, ಫಿಲ್ಟರ್ ಕಾಗದ, ಆಲಿಕೆ, pH ಕಾಗದ / ಸಾರ್ವತ್ರಿಕ ಸೂಚಕ"),
    procedure: [
      "Mix 10 g of each soil with 20 mL distilled water and stir well.",
      "Allow to settle and filter.",
      "Test the filtrate with pH paper and compare with the colour chart.",
      "Tabulate pH and nature of each soil.",
    ],
    sim: "ph",
    opts: { samples: [
      { k: "garden", l: L("Garden soil", "ತೋಟದ ಮಣ್ಣು"), pH: 6.8, color: "rgba(120,53,15,0.35)" },
      { k: "red", l: L("Red soil", "ಕೆಂಪು ಮಣ್ಣು"), pH: 5.6, color: "rgba(185,28,28,0.35)" },
      { k: "laterite", l: L("Laterite soil", "ಜಂಬಿಟ್ಟಿಗೆ ಮಣ್ಣು"), pH: 5.0, color: "rgba(194,65,12,0.35)" },
      { k: "black", l: L("Black cotton soil", "ಕಪ್ಪು ಹತ್ತಿ ಮಣ್ಣು"), pH: 8.2, color: "rgba(41,37,36,0.35)" },
      { k: "saline", l: L("Saline/alkaline soil", "ಲವಣ/ಕ್ಷಾರ ಮಣ್ಣು"), pH: 9.2, color: "rgba(214,211,209,0.6)" },
      { k: "compost", l: L("Compost", "ಕಾಂಪೋಸ್ಟ್"), pH: 7.2, color: "rgba(68,64,60,0.35)" },
    ] },
    controls: [sel("sample", L("Soil sample", "ಮಣ್ಣಿನ ಮಾದರಿ"), [opt("garden", "Garden", "ತೋಟ"), opt("red", "Red", "ಕೆಂಪು"), opt("laterite", "Laterite", "ಜಂಬಿಟ್ಟಿಗೆ"), opt("black", "Black cotton", "ಕಪ್ಪು ಹತ್ತಿ"), opt("saline", "Saline", "ಲವಣ"), opt("compost", "Compost", "ಕಾಂಪೋಸ್ಟ್")], "red")],
    compute: (p, x) => {
      const m = { garden: [6.8, "Garden soil", "ತೋಟದ ಮಣ್ಣು"], red: [5.6, "Red soil", "ಕೆಂಪು ಮಣ್ಣು"], laterite: [5.0, "Laterite soil", "ಜಂಬಿಟ್ಟಿಗೆ ಮಣ್ಣು"], black: [8.2, "Black cotton soil", "ಕಪ್ಪು ಹತ್ತಿ ಮಣ್ಣು"], saline: [9.2, "Saline/alkaline soil", "ಲವಣ/ಕ್ಷಾರ ಮಣ್ಣು"], compost: [7.2, "Compost", "ಕಾಂಪೋಸ್ಟ್"] }[p.sample];
      return { pH: m[0], sampleName: L(m[1], m[2]), nature: nature(m[0]), pHshown: x.dipped ? m[0] : null };
    },
    readouts: [col("pHshown", L("pH (from chart)", "pH (ಚಾರ್ಟ್‌ನಿಂದ)"), "", 1), col("nature", L("Nature", "ಸ್ವಭಾವ"))],
    canRecord: (p, r, x) => !!x.dipped,
    table: [col("sampleName", L("Soil", "ಮಣ್ಣು")), col("pH", L("pH", "pH"), "", 1), col("nature", L("Nature", "ಸ್ವಭಾವ"))],
    quiz: [
      q("Acidic soils are corrected by adding…", ["Gypsum", "Lime", "Urea", "Sand"], 1, "Lime (CaCO₃/CaO) neutralises acidity."),
      q("Black cotton soil is generally…", ["Strongly acidic", "Slightly alkaline", "Neutral always", "pH 2"], 1, "Rich in Ca and Mg carbonates."),
      q("Most crops prefer a soil pH of…", ["3–4", "6–7.5", "9–10", "12"], 1, "Near neutral."),
      q("Why is the soil mixed with distilled water?", ["To kill microbes", "Tap water may change pH", "To make mud", "For colour"], 1, "Distilled water is neutral."),
    ],
  },
  {
    id: "puc2-meiosis", subject: "biology", icon: "🧫",
    title: L("Identifying stages of meiosis", "ಅರೆವಿದಳನದ ಹಂತಗಳ ಗುರುತಿಸುವಿಕೆ"),
    aim: L("To identify the stages of meiosis in permanent slides of flower bud anthers.", "ಹೂವಿನ ಮೊಗ್ಗಿನ ಪರಾಗಕೋಶದ ಶಾಶ್ವತ ಸ್ಲೈಡ್‌ಗಳಲ್ಲಿ ಅರೆವಿದಳನದ ಹಂತಗಳನ್ನು ಗುರುತಿಸುವುದು."),
    theory: L(
      "Meiosis is a reduction division that produces four haploid cells from one diploid cell. Meiosis I separates homologous chromosomes: in prophase I homologues pair and cross over, they line up as pairs in metaphase I and move apart in anaphase I.\nMeiosis II is like mitosis: sister chromatids separate in anaphase II, giving four haploid nuclei in telophase II.",
      "ಅರೆವಿದಳನವು ಒಂದು ದ್ವಿಗುಣ ಕೋಶದಿಂದ ನಾಲ್ಕು ಏಕಗುಣ ಕೋಶಗಳನ್ನು ಉಂಟುಮಾಡುವ ಕ್ಷೀಣ ವಿಭಜನೆ. ಅರೆವಿದಳನ I ಸಮರೂಪಿ ವರ್ಣತಂತುಗಳನ್ನು ಬೇರ್ಪಡಿಸುತ್ತದೆ: ಪ್ರೋಫೇಸ್ I ನಲ್ಲಿ ಜೋಡಿಯಾಗಿ ಅಡ್ಡಹಾಯುವಿಕೆ, ಮೆಟಾಫೇಸ್ I ನಲ್ಲಿ ಜೋಡಿಯಾಗಿ ಸಾಲು, ಅನಾಫೇಸ್ I ನಲ್ಲಿ ಬೇರ್ಪಡುವಿಕೆ.\nಅರೆವಿದಳನ II ಸಮವಿಭಜನೆಯಂತೆ: ಅನಾಫೇಸ್ II ನಲ್ಲಿ ಸೋದರ ವರ್ಣತಂತುಕಗಳು ಬೇರ್ಪಟ್ಟು ಟೀಲೋಫೇಸ್ II ನಲ್ಲಿ ನಾಲ್ಕು ಏಕಗುಣ ಕೋಶಕೇಂದ್ರಗಳು."
    ),
    apparatus: L("Permanent slides of meiotic stages (onion/ grasshopper testis/ flower bud), compound microscope", "ಅರೆವಿದಳನ ಹಂತಗಳ ಶಾಶ್ವತ ಸ್ಲೈಡ್‌ಗಳು, ಸಂಯುಕ್ತ ಸೂಕ್ಷ್ಮದರ್ಶಕ"),
    procedure: [
      "Place a permanent slide under the microscope and focus under low power.",
      "Switch to high power and locate dividing cells.",
      "Identify the stage using key features (pairs vs single chromosomes, number of nuclei).",
      "Draw and label each stage.",
    ],
    sim: "stagequiz",
    compute: (p, x) => ({ correct: x.correct || 0, total: x.total || 0, shown: x.shown, said: x.said, ok: x.ok }),
    readouts: [col("correct", L("Correct", "ಸರಿ"), "", 0), col("total", L("Slides seen", "ನೋಡಿದ ಸ್ಲೈಡ್‌ಗಳು"), "", 0)],
    canRecord: (p, r, x) => !!x.shown,
    table: [col("shown", L("Actual stage", "ನಿಜವಾದ ಹಂತ")), col("said", L("Your answer", "ನಿಮ್ಮ ಉತ್ತರ")), col("ok", L("✓/✗", "✓/✗"))],
    result: (rows) => L(`${rows.filter((r) => r.ok?.en === "✓").length} / ${rows.length} stages identified correctly.`, `${rows.length} ರಲ್ಲಿ ${rows.filter((r) => r.ok?.en === "✓").length} ಹಂತಗಳು ಸರಿಯಾಗಿ ಗುರುತಿಸಲಾಗಿದೆ.`),
    tip: L("Look for pairs of chromosomes (meiosis I) vs single chromosomes (meiosis II).", "ಜೋಡಿ ವರ್ಣತಂತುಗಳು (ಅರೆವಿದಳನ I) ಮತ್ತು ಏಕ ವರ್ಣತಂತುಗಳು (ಅರೆವಿದಳನ II) ಗಮನಿಸಿ."),
    quiz: [
      q("Crossing over occurs during…", ["Prophase I", "Metaphase II", "Anaphase II", "Telophase I"], 0, "In pachytene of prophase I."),
      q("Homologous chromosomes separate in…", ["Anaphase I", "Anaphase II", "Metaphase I", "Prophase II"], 0, "Meiosis I is the reductional division."),
      q("Meiosis produces…", ["2 diploid cells", "4 haploid cells", "4 diploid cells", "2 haploid cells"], 1, "Reduction division."),
      q("Meiosis occurs in…", ["Root tip", "Anther and ovule", "Leaf", "Stem tip"], 1, "In reproductive organs, forming gametes/spores."),
    ],
  },
];
