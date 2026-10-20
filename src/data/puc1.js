import { L, mean, q, sel, opt, sl, col, nature, noChange, benchCols, benchControls, focusControls } from "./helpers.js";

const VOBJ = { sphere: [1.87, "Metal sphere", "ಲೋಹದ ಗೋಳ"], cyl: [2.46, "Cylinder", "ಸಿಲಿಂಡರ್"], beaker: [3.53, "Small beaker (inner dia.)", "ಸಣ್ಣ ಬೀಕರ್ (ಒಳ ವ್ಯಾಸ)"] };
const SOBJ = { wire: [0.86, "Thin wire", "ತೆಳು ತಂತಿ"], ball: [4.76, "Ball bearing", "ಬಾಲ್ ಬೇರಿಂಗ್"], glass: [2.13, "Glass plate (thickness)", "ಗಾಜಿನ ಫಲಕ (ದಪ್ಪ)"] };
const concordant = (vals) => { const s = [...vals].sort((a, b) => a - b); for (let i = 0; i < s.length - 1; i++) if (Math.abs(s[i + 1] - s[i]) <= 0.1) return (s[i] + s[i + 1]) / 2; return null; };

export default [
  /* ============================ PHYSICS ============================ */
  {
    id: "puc1-vernier", subject: "physics", icon: "📏",
    title: L("Vernier calipers", "ವರ್ನಿಯರ್ ಕ್ಯಾಲಿಪರ್ಸ್"),
    aim: L("To measure the diameter of a small sphere / cylinder using vernier calipers.", "ವರ್ನಿಯರ್ ಕ್ಯಾಲಿಪರ್ಸ್ ಬಳಸಿ ಸಣ್ಣ ಗೋಳ / ಸಿಲಿಂಡರ್‌ನ ವ್ಯಾಸ ಅಳೆಯುವುದು."),
    theory: L(
      "A vernier caliper has a main scale (in mm) and a sliding vernier scale. 10 vernier divisions equal 9 main-scale divisions, so the least count (LC) = 1 MSD − 1 VSD = 0.1 mm = 0.01 cm.\nReading = Main Scale Reading (MSR) + Vernier Scale Coincidence (VSC) × LC. The VSC is the vernier division that lines up exactly with any main-scale division.",
      "ವರ್ನಿಯರ್ ಕ್ಯಾಲಿಪರ್ಸ್‌ನಲ್ಲಿ ಮುಖ್ಯ ಮಾಪಕ (mm) ಮತ್ತು ಜಾರುವ ವರ್ನಿಯರ್ ಮಾಪಕ ಇವೆ. 10 ವರ್ನಿಯರ್ ವಿಭಾಗಗಳು 9 ಮುಖ್ಯ ಮಾಪಕ ವಿಭಾಗಗಳಿಗೆ ಸಮ, ಆದ್ದರಿಂದ ಕನಿಷ್ಠ ಎಣಿಕೆ (LC) = 1 MSD − 1 VSD = 0.1 mm = 0.01 cm.\nಓದು = ಮುಖ್ಯ ಮಾಪಕ ಓದು (MSR) + ವರ್ನಿಯರ್ ಹೊಂದಾಣಿಕೆ (VSC) × LC. ಮುಖ್ಯ ಮಾಪಕದ ಯಾವುದೇ ವಿಭಾಗದೊಂದಿಗೆ ನಿಖರವಾಗಿ ಹೊಂದುವ ವರ್ನಿಯರ್ ವಿಭಾಗವೇ VSC."
    ),
    formula: "LC = 1 MSD − 1 VSD = 0.01 cm\nD = MSR + VSC × LC",
    apparatus: L("Vernier calipers, metal sphere, cylinder, small beaker", "ವರ್ನಿಯರ್ ಕ್ಯಾಲಿಪರ್ಸ್, ಲೋಹದ ಗೋಳ, ಸಿಲಿಂಡರ್, ಸಣ್ಣ ಬೀಕರ್"),
    procedure: [
      "Find the least count of the vernier calipers.",
      "Close the jaws and check for zero error.",
      "Place the object between the jaws and close them gently until they just touch it.",
      "Note the main scale reading just before the vernier zero and the vernier division that coincides.",
      "Repeat at different positions and take the mean diameter.",
    ],
    sim: "gauge", opts: { kind: "vernier" },
    controls: [
      sel("obj", L("Object", "ವಸ್ತು"), Object.entries(VOBJ).map(([k, v]) => opt(k, v[1], v[2])), "sphere"),
      sl("open", L("Slide the movable jaw", "ಚಲಿಸುವ ದವಡೆ ಜಾರಿಸಿ"), 0, 5, 0.01, 4, "cm"),
    ],
    compute: (p) => {
      const size = VOBJ[p.obj][0], eff = Math.max(p.open, size);
      const msr = Math.floor(eff * 10 + 1e-6) / 10, vsc = Math.round((eff - msr) / 0.01) % 10;
      return { size, eff, gripped: p.open <= size + 0.005, msr, vsc, D: msr + vsc * 0.01, objName: L(VOBJ[p.obj][1], VOBJ[p.obj][2]) };
    },
    readouts: [col("msr", L("Main scale reading", "ಮುಖ್ಯ ಮಾಪಕ ಓದು"), "cm", 1), col("vsc", L("Vernier coincidence", "ವರ್ನಿಯರ್ ಹೊಂದಾಣಿಕೆ"), "", 0), col("D", L("Total reading", "ಒಟ್ಟು ಓದು"), "cm", 2)],
    canRecord: (p, r) => r.gripped,
    table: [col("objName", L("Object", "ವಸ್ತು")), col("msr", L("MSR", "MSR"), "cm", 1), col("vsc", L("VSC", "VSC"), "", 0), col("D", L("D = MSR + VSC×LC", "D = MSR + VSC×LC"), "cm", 2)],
    result: (rows) => L(`Mean diameter = ${mean(rows.map((r) => r.D)).toFixed(2)} cm`, `ಸರಾಸರಿ ವ್ಯಾಸ = ${mean(rows.map((r) => r.D)).toFixed(2)} cm`),
    tip: L("Before checking the readout, read the magnified scale yourself and predict the answer!", "ಓದು ನೋಡುವ ಮೊದಲು ವಿಸ್ತರಿಸಿದ ಮಾಪಕವನ್ನು ನೀವೇ ಓದಿ ಉತ್ತರ ಊಹಿಸಿ!"),
    quiz: [
      q("Least count of a common vernier caliper is…", ["0.1 cm", "0.01 cm", "0.001 cm", "1 mm"], 1, "1 MSD − 1 VSD = 1 − 0.9 = 0.1 mm = 0.01 cm."),
      q("MSR = 2.3 cm, VSC = 6. Reading = …", ["2.36 cm", "2.9 cm", "2.306 cm", "8.3 cm"], 0, "2.3 + 6 × 0.01 = 2.36 cm."),
      q("Which jaws measure the inner diameter of a beaker?", ["Lower (outside) jaws", "Upper (inside) jaws", "Tail", "Thimble"], 1, "The upper jaws are for internal measurements."),
      q("If the vernier zero is to the right of the main zero when jaws are closed, the zero error is…", ["Positive", "Negative", "Zero", "Infinite"], 0, "Positive zero error is subtracted from readings."),
    ],
  },
  {
    id: "puc1-screw-gauge", subject: "physics", icon: "🔧",
    title: L("Screw gauge", "ಸ್ಕ್ರೂ ಗೇಜ್"),
    aim: L("To measure the diameter of a wire / thickness of a glass plate using a screw gauge.", "ಸ್ಕ್ರೂ ಗೇಜ್ ಬಳಸಿ ತಂತಿಯ ವ್ಯಾಸ / ಗಾಜಿನ ಫಲಕದ ದಪ್ಪ ಅಳೆಯುವುದು."),
    theory: L(
      "A screw gauge works on the principle of a screw: the spindle moves forward by one pitch for one full rotation of the thimble. With pitch 1 mm and 100 circular divisions, LC = 1/100 = 0.01 mm.\nReading = Pitch Scale Reading (PSR) + Head Scale Coincidence (HSC) × LC. Always use the ratchet to avoid pressing the object too hard.",
      "ಸ್ಕ್ರೂ ಗೇಜ್ ತಿರುಪು ತತ್ವದಲ್ಲಿ ಕೆಲಸ ಮಾಡುತ್ತದೆ: ಥಿಂಬಲ್‌ನ ಒಂದು ಪೂರ್ಣ ಸುತ್ತಿಗೆ ಸ್ಪಿಂಡಲ್ ಒಂದು ಪಿಚ್ ಮುಂದೆ ಸಾಗುತ್ತದೆ. ಪಿಚ್ 1 mm ಮತ್ತು 100 ವೃತ್ತಾಕಾರ ವಿಭಾಗಗಳಿದ್ದರೆ LC = 1/100 = 0.01 mm.\nಓದು = ಪಿಚ್ ಮಾಪಕ ಓದು (PSR) + ಹೆಡ್ ಮಾಪಕ ಹೊಂದಾಣಿಕೆ (HSC) × LC. ವಸ್ತುವನ್ನು ಹೆಚ್ಚು ಒತ್ತದಂತೆ ಯಾವಾಗಲೂ ರ್ಯಾಚೆಟ್ ಬಳಸಿ."
    ),
    formula: "LC = pitch / no. of head divisions = 0.01 mm\nd = PSR + HSC × LC",
    apparatus: L("Screw gauge, wire, glass plate, ball bearing", "ಸ್ಕ್ರೂ ಗೇಜ್, ತಂತಿ, ಗಾಜಿನ ಫಲಕ, ಬಾಲ್ ಬೇರಿಂಗ್"),
    procedure: [
      "Find the pitch and least count of the screw gauge.",
      "Check for zero error with the faces touching.",
      "Place the wire between the anvil and spindle and turn the ratchet until it clicks.",
      "Note PSR and HSC; calculate the diameter.",
      "Repeat at different places along the wire and take the mean.",
    ],
    sim: "gauge", opts: { kind: "screw" },
    controls: [
      sel("obj", L("Object", "ವಸ್ತು"), Object.entries(SOBJ).map(([k, v]) => opt(k, v[1], v[2])), "wire"),
      sl("open", L("Turn the thimble (gap)", "ಥಿಂಬಲ್ ತಿರುಗಿಸಿ (ಅಂತರ)"), 0, 10, 0.01, 6, "mm"),
    ],
    compute: (p) => {
      const size = SOBJ[p.obj][0], eff = Math.max(p.open, size);
      const psr = Math.floor(eff + 1e-6), csd = Math.round((eff - psr) / 0.01) % 100;
      return { size, eff, gripped: p.open <= size + 0.005, psr, csd, d: psr + csd * 0.01, objName: L(SOBJ[p.obj][1], SOBJ[p.obj][2]) };
    },
    readouts: [col("psr", L("Pitch scale reading", "ಪಿಚ್ ಮಾಪಕ ಓದು"), "mm", 0), col("csd", L("Head scale coincidence", "ಹೆಡ್ ಮಾಪಕ ಹೊಂದಾಣಿಕೆ"), "", 0), col("d", L("Total reading", "ಒಟ್ಟು ಓದು"), "mm", 2)],
    canRecord: (p, r) => r.gripped,
    table: [col("objName", L("Object", "ವಸ್ತು")), col("psr", L("PSR", "PSR"), "mm", 0), col("csd", L("HSC", "HSC"), "", 0), col("d", L("d", "d"), "mm", 2)],
    result: (rows) => L(`Mean value = ${mean(rows.map((r) => r.d)).toFixed(2)} mm`, `ಸರಾಸರಿ ಮೌಲ್ಯ = ${mean(rows.map((r) => r.d)).toFixed(2)} mm`),
    quiz: [
      q("Pitch of a screw gauge is…", ["Distance moved per rotation", "Number of divisions", "Length of sleeve", "Zero error"], 0, "Pitch = linear distance moved by spindle in one rotation."),
      q("Pitch 1 mm, 100 head divisions. LC = …", ["0.1 mm", "0.01 mm", "0.001 mm", "1 mm"], 1, "1/100 = 0.01 mm."),
      q("The ratchet is used to…", ["Increase speed", "Avoid excess pressure on the object", "Measure pitch", "Lock the scale"], 1, "It slips once the object is gripped."),
      q("PSR = 2 mm, HSC = 47. Diameter = …", ["2.47 mm", "4.72 mm", "2.047 mm", "49 mm"], 0, "2 + 47 × 0.01 = 2.47 mm."),
    ],
  },
  {
    id: "puc1-pendulum", subject: "physics", icon: "⏱️",
    title: L("Simple pendulum — finding g", "ಸರಳ ಲೋಲಕ — g ಕಂಡುಹಿಡಿಯುವುದು"),
    aim: L("To study the variation of time period with length of a simple pendulum and find acceleration due to gravity g.", "ಸರಳ ಲೋಲಕದ ಉದ್ದದೊಂದಿಗೆ ಆವರ್ತ ಕಾಲದ ಬದಲಾವಣೆ ಅಧ್ಯಯನ ಮಾಡಿ ಗುರುತ್ವ ವೇಗೋತ್ಕರ್ಷ g ಕಂಡುಹಿಡಿಯುವುದು."),
    theory: L(
      "For small angles, a simple pendulum performs simple harmonic motion with period T = 2π√(L/g). T does not depend on the mass of the bob or (for small angles) on the amplitude.\nSquaring: T² = (4π²/g)·L, so the L–T² graph is a straight line. From its slope, g = 4π² / slope.",
      "ಸಣ್ಣ ಕೋನಗಳಿಗೆ ಸರಳ ಲೋಲಕ T = 2π√(L/g) ಆವರ್ತ ಕಾಲದೊಂದಿಗೆ ಸರಳ ಆವರ್ತ ಚಲನೆ ನಡೆಸುತ್ತದೆ. T ಗುಂಡಿನ ದ್ರವ್ಯರಾಶಿ ಅಥವಾ (ಸಣ್ಣ ಕೋನಗಳಿಗೆ) ವಿಸ್ತಾರದ ಮೇಲೆ ಅವಲಂಬಿತವಲ್ಲ.\nವರ್ಗ ಮಾಡಿದಾಗ T² = (4π²/g)·L, ಆದ್ದರಿಂದ L–T² ನಕ್ಷೆ ಸರಳರೇಖೆ. ಅದರ ಇಳಿಜಾರಿನಿಂದ g = 4π² / ಇಳಿಜಾರು."
    ),
    formula: "T = 2π √(L / g)\ng = 4π² L / T²",
    apparatus: L("Clamp stand, split cork, thread, metal bob, stopwatch, metre scale", "ಕ್ಲ್ಯಾಂಪ್ ಸ್ಟ್ಯಾಂಡ್, ಸೀಳಿದ ಬಿರಡೆ, ದಾರ, ಲೋಹದ ಗುಂಡು, ಸ್ಟಾಪ್‌ವಾಚ್, ಮೀಟರ್ ಅಳತೆಪಟ್ಟಿ"),
    procedure: [
      "Suspend the bob with a thread from the split cork; measure effective length L (to centre of bob).",
      "Displace the bob slightly (less than 10°) and release.",
      "Measure the time for 20 oscillations; find T = t/20.",
      "Repeat for at least five different lengths.",
      "Plot L against T² and find g from the slope.",
    ],
    sim: "pendulum", opts: { N: 20 },
    controls: [sl("L", L("Effective length L", "ಪರಿಣಾಮಕಾರಿ ಉದ್ದ L"), 20, 120, 5, 60, "cm"), sl("amp", L("Amplitude", "ವಿಸ್ತಾರ"), 2, 10, 1, 5, "°")],
    compute: (p, x) => { const T = x.tN ? x.tN / 20 : null; return { tN: x.tN, T, T2: T ? T * T : null, g: T ? (4 * Math.PI ** 2 * (p.L / 100)) / (T * T) : null }; },
    readouts: [col("tN", L("Time for 20 osc.", "20 ಆಂದೋಲನಗಳ ಸಮಯ"), "s", 2), col("T", L("Period T", "ಆವರ್ತ ಕಾಲ T"), "s", 3), col("T2", L("T²", "T²"), "s²", 3)],
    canRecord: (p, r, x) => !!x.tN,
    table: [col("L", L("L", "L"), "cm", 0), col("tN", L("t (20 osc.)", "t (20)"), "s", 2), col("T", L("T", "T"), "s", 3), col("T2", L("T²", "T²"), "s²", 3), col("g", L("g", "g"), "m/s²", 2)],
    graph: { x: "L", y: "T2", fit: "linear", slopeMeans: L("slope = 4π²/g (s²/cm) → g = 4π²/(slope×100)", "ಇಳಿಜಾರು = 4π²/g → g = 4π²/(ಇಳಿಜಾರು×100)") },
    result: (rows) => L(`g = ${mean(rows.map((r) => r.g)).toFixed(2)} m/s² (standard 9.8 m/s²)`, `g = ${mean(rows.map((r) => r.g)).toFixed(2)} m/s² (ಪ್ರಮಾಣಿತ 9.8 m/s²)`),
    tip: L("Use 10× speed to save time. Record 5 lengths and see the straight-line L–T² graph.", "ಸಮಯ ಉಳಿಸಲು 10× ವೇಗ ಬಳಸಿ. 5 ಉದ್ದಗಳನ್ನು ದಾಖಲಿಸಿ L–T² ಸರಳರೇಖೆ ನೋಡಿ."),
    quiz: [
      q("If the length of a pendulum is made 4 times, its period becomes…", ["4 times", "2 times", "Half", "Same"], 1, "T ∝ √L → √4 = 2."),
      q("The period of a simple pendulum does NOT depend on…", ["Length", "g", "Mass of bob", "Location on Earth"], 2, "T = 2π√(L/g) has no mass term."),
      q("Why do we time 20 oscillations instead of one?", ["Bob is heavy", "To reduce reaction-time error", "Thread stretches", "To get g directly"], 1, "Errors are divided by 20."),
      q("A seconds pendulum has a period of…", ["1 s", "2 s", "0.5 s", "60 s"], 1, "It takes 1 s for each swing, 2 s for a full oscillation."),
    ],
  },
  {
    id: "puc1-hookes-law", subject: "physics", icon: "🪝",
    title: L("Hooke's law — spring constant", "ಹುಕ್ ನಿಯಮ — ಸ್ಪ್ರಿಂಗ್ ಸ್ಥಿರಾಂಕ"),
    aim: L("To verify Hooke's law and find the spring constant using the load–extension graph.", "ಹುಕ್ ನಿಯಮ ಪರಿಶೀಲಿಸಿ ಹೊರೆ–ಹಿಗ್ಗುವಿಕೆ ನಕ್ಷೆಯಿಂದ ಸ್ಪ್ರಿಂಗ್ ಸ್ಥಿರಾಂಕ ಕಂಡುಹಿಡಿಯುವುದು."),
    theory: L(
      "Within the elastic limit, the extension of a spring is directly proportional to the load applied: F = k·x, where k is the spring constant (stiffness).\nA graph of load F against extension x is a straight line through the origin. Its slope gives k. A stiffer spring has a larger k and stretches less for the same load.",
      "ಸ್ಥಿತಿಸ್ಥಾಪಕ ಮಿತಿಯೊಳಗೆ ಸ್ಪ್ರಿಂಗ್‌ನ ಹಿಗ್ಗುವಿಕೆ ಅನ್ವಯಿಸಿದ ಹೊರೆಗೆ ನೇರ ಅನುಪಾತದಲ್ಲಿರುತ್ತದೆ: F = k·x, ಇಲ್ಲಿ k ಸ್ಪ್ರಿಂಗ್ ಸ್ಥಿರಾಂಕ.\nಹೊರೆ F ಮತ್ತು ಹಿಗ್ಗುವಿಕೆ x ನಕ್ಷೆ ಮೂಲಬಿಂದುವಿನ ಮೂಲಕ ಸರಳರೇಖೆ. ಅದರ ಇಳಿಜಾರು k ನೀಡುತ್ತದೆ. ಗಟ್ಟಿ ಸ್ಪ್ರಿಂಗ್‌ಗೆ k ಹೆಚ್ಚು, ಅದು ಕಡಿಮೆ ಹಿಗ್ಗುತ್ತದೆ."
    ),
    formula: "F = k x\nk = slope of F–x graph",
    apparatus: L("Helical spring, rigid stand, pointer, vertical scale, hanger, slotted weights (50 g each)", "ಸುರುಳಿ ಸ್ಪ್ರಿಂಗ್, ಸ್ಟ್ಯಾಂಡ್, ಸೂಚಕ, ಲಂಬ ಮಾಪಕ, ಹ್ಯಾಂಗರ್, ಸ್ಲಾಟೆಡ್ ತೂಕಗಳು (ತಲಾ 50 g)"),
    procedure: [
      "Suspend the spring from the stand with the pointer moving over the scale.",
      "Note the pointer reading with only the hanger.",
      "Add 50 g at a time and note the pointer reading after it comes to rest.",
      "Calculate extension and load (F = mg) for each step.",
      "Plot F against x and find k from the slope.",
    ],
    sim: "spring",
    controls: [sl("m", L("Load on hanger", "ಹ್ಯಾಂಗರ್ ಮೇಲಿನ ಹೊರೆ"), 0, 500, 50, 100, "g"), sel("spring", L("Spring", "ಸ್ಪ್ರಿಂಗ್"), [opt("soft", "Soft spring", "ಮೃದು ಸ್ಪ್ರಿಂಗ್"), opt("stiff", "Stiff spring", "ಗಟ್ಟಿ ಸ್ಪ್ರಿಂಗ್")], "soft")],
    compute: (p) => { const k = p.spring === "stiff" ? 50 : 25, F = (p.m / 1000) * 9.8; return { F, ext: (F / k) * 100, k }; },
    readouts: [col("F", L("Load F = mg", "ಹೊರೆ F = mg"), "N", 2), col("ext", L("Extension x", "ಹಿಗ್ಗುವಿಕೆ x"), "cm", 1)],
    table: [col("m", L("Mass", "ದ್ರವ್ಯರಾಶಿ"), "g", 0), col("F", L("F", "F"), "N", 2), col("ext", L("x", "x"), "cm", 2)],
    graph: { x: "ext", y: "F", fit: "origin", slopeMeans: L("slope = k in N/cm (×100 for N/m)", "ಇಳಿಜಾರು = k (N/cm, N/m ಗೆ ×100)") },
    result: (rows) => { const r2 = rows.filter((r) => r.ext > 0); return L(`Spring constant k ≈ ${(mean(r2.map((r) => r.F / r.ext)) * 100).toFixed(1)} N/m`, `ಸ್ಪ್ರಿಂಗ್ ಸ್ಥಿರಾಂಕ k ≈ ${(mean(r2.map((r) => r.F / r.ext)) * 100).toFixed(1)} N/m`); },
    quiz: [
      q("Hooke's law is valid only…", ["Beyond the breaking point", "Within the elastic limit", "For liquids", "For gases"], 1, "Proportionality holds only within the elastic limit."),
      q("SI unit of spring constant is…", ["N", "N/m", "N·m", "kg"], 1, "k = F/x → N/m."),
      q("A load of 2 N produces 4 cm extension. k = …", ["0.5 N/m", "50 N/m", "8 N/m", "2 N/m"], 1, "k = 2/0.04 = 50 N/m."),
      q("The F–x graph for an ideal spring is…", ["Parabola", "Straight line through origin", "Hyperbola", "Horizontal line"], 1, "F ∝ x."),
    ],
  },
  {
    id: "puc1-sonometer", subject: "physics", icon: "🎻",
    title: L("Sonometer — frequency and length", "ಸೋನೋಮೀಟರ್ — ಆವೃತ್ತಿ ಮತ್ತು ಉದ್ದ"),
    aim: L("To study the relation between the frequency of a stretched string and its length at constant tension.", "ಸ್ಥಿರ ಸೆಳೆತದಲ್ಲಿ ಎಳೆದ ತಂತಿಯ ಆವೃತ್ತಿ ಮತ್ತು ಉದ್ದದ ನಡುವಿನ ಸಂಬಂಧ ಅಧ್ಯಯನ."),
    theory: L(
      "The fundamental frequency of a stretched string is n = (1/2l)√(T/μ), where l is vibrating length, T the tension and μ the mass per unit length.\nAt constant T, n ∝ 1/l, so n × l is constant. When the string's natural frequency matches the tuning fork, resonance occurs and the paper rider on the wire is thrown off.",
      "ಎಳೆದ ತಂತಿಯ ಮೂಲಭೂತ ಆವೃತ್ತಿ n = (1/2l)√(T/μ), ಇಲ್ಲಿ l ಕಂಪಿಸುವ ಉದ್ದ, T ಸೆಳೆತ ಮತ್ತು μ ಪ್ರತಿ ಏಕಮಾನ ಉದ್ದದ ದ್ರವ್ಯರಾಶಿ.\nಸ್ಥಿರ T ಯಲ್ಲಿ n ∝ 1/l, ಆದ್ದರಿಂದ n × l ಸ್ಥಿರ. ತಂತಿಯ ಸ್ವಾಭಾವಿಕ ಆವೃತ್ತಿ ಶ್ರುತಿ ಕವೆಗೆ ಸಮವಾದಾಗ ಅನುನಾದ ಉಂಟಾಗಿ ತಂತಿಯ ಮೇಲಿನ ಕಾಗದದ ಸವಾರ ಹಾರಿಹೋಗುತ್ತದೆ."
    ),
    formula: "n = (1 / 2l) √(T / μ)\nn × l = constant",
    apparatus: L("Sonometer, set of tuning forks, rubber pad, paper rider, hanger with weights, metre scale", "ಸೋನೋಮೀಟರ್, ಶ್ರುತಿ ಕವೆಗಳ ಗುಚ್ಛ, ರಬ್ಬರ್ ಪ್ಯಾಡ್, ಕಾಗದದ ಸವಾರ, ತೂಕಗಳ ಹ್ಯಾಂಗರ್, ಮೀಟರ್ ಅಳತೆಪಟ್ಟಿ"),
    procedure: [
      "Put a suitable load on the hanger to keep tension constant.",
      "Place a small paper rider at the middle of the wire between the bridges.",
      "Strike a tuning fork on the rubber pad and place its stem on the sonometer box.",
      "Adjust the distance between bridges until the paper rider flies off. Note l.",
      "Repeat with tuning forks of different frequencies.",
    ],
    sim: "sonometer",
    controls: [
      sel("f", L("Tuning fork", "ಶ್ರುತಿ ಕವೆ"), [256, 288, 320, 384, 480, 512].map((v) => opt(v, `${v} Hz`)), 256),
      sl("l", L("Distance between bridges", "ಸೇತುವೆಗಳ ನಡುವಿನ ದೂರ"), 10, 100, 0.5, 40, "cm"),
      sl("M", L("Load (tension)", "ಹೊರೆ (ಸೆಳೆತ)"), 1, 6, 0.5, 4, "kg"),
    ],
    compute: (p) => { const T = p.M * 9.8, fn = (1 / (2 * p.l / 100)) * Math.sqrt(T / 0.0006); const res = Math.exp(-Math.pow((fn - p.f) / (0.012 * p.f), 2)); return { res, resPct: res * 100, nl: p.f * p.l / 100, invL: 100 / p.l }; },
    readouts: [col("resPct", L("Wire vibration", "ತಂತಿಯ ಕಂಪನ"), "%", 0)],
    canRecord: (p, r) => r.res > 0.85,
    table: [col("f", L("n", "n"), "Hz", 0), col("M", L("Load", "ಹೊರೆ"), "kg", 1), col("l", L("l", "l"), "cm", 1), col("invL", L("1/l", "1/l"), "m⁻¹", 3), col("nl", L("n × l", "n × l"), "Hz·m", 1)],
    graph: { x: "invL", y: "f", fit: "origin", slopeMeans: L("slope = n × l (constant)", "ಇಳಿಜಾರು = n × l (ಸ್ಥಿರ)") },
    result: (rows) => L(`n × l ≈ ${mean(rows.map((r) => r.nl)).toFixed(1)} Hz·m (constant) — n ∝ 1/l verified.`, `n × l ≈ ${mean(rows.map((r) => r.nl)).toFixed(1)} Hz·m (ಸ್ಥಿರ) — n ∝ 1/l ಪರಿಶೀಲಿಸಲಾಗಿದೆ.`),
    tip: L("Keep the load fixed and find the resonating length for every fork.", "ಹೊರೆಯನ್ನು ಸ್ಥಿರವಾಗಿಟ್ಟು ಪ್ರತಿ ಕವೆಗೆ ಅನುನಾದ ಉದ್ದ ಕಂಡುಹಿಡಿಯಿರಿ."),
    quiz: [
      q("At constant tension, if l is halved, frequency…", ["Halves", "Doubles", "Stays same", "Becomes four times"], 1, "n ∝ 1/l."),
      q("The paper rider flies off because of…", ["Friction", "Resonance", "Gravity", "Magnetism"], 1, "Maximum amplitude at resonance throws the rider."),
      q("If tension is made 4 times, frequency becomes…", ["4 times", "2 times", "Half", "16 times"], 1, "n ∝ √T."),
      q("Wave on a sonometer wire is…", ["Longitudinal", "Transverse stationary", "Electromagnetic", "Travelling only"], 1, "A stationary transverse wave forms between the bridges."),
    ],
  },
  {
    id: "puc1-resonance-tube", subject: "physics", icon: "🔔",
    title: L("Speed of sound — resonance tube", "ಶಬ್ದದ ವೇಗ — ಅನುನಾದ ನಳಿಕೆ"),
    aim: L("To find the speed of sound in air at room temperature using a resonance tube.", "ಅನುನಾದ ನಳಿಕೆ ಬಳಸಿ ಕೊಠಡಿ ತಾಪದಲ್ಲಿ ಗಾಳಿಯಲ್ಲಿ ಶಬ್ದದ ವೇಗ ಕಂಡುಹಿಡಿಯುವುದು."),
    theory: L(
      "A tube closed at one end by water forms a closed air column. Resonance (a loud sound) occurs when the length of the air column is λ/4 − e, 3λ/4 − e, … where e is the end correction.\nThe difference between the first two resonating lengths is λ/2, so v = nλ = 2n(l₂ − l₁), which removes the end correction.",
      "ಒಂದು ತುದಿ ನೀರಿನಿಂದ ಮುಚ್ಚಿದ ನಳಿಕೆ ಮುಚ್ಚಿದ ಗಾಳಿ ಸ್ತಂಭ ರೂಪಿಸುತ್ತದೆ. ಗಾಳಿ ಸ್ತಂಭದ ಉದ್ದ λ/4 − e, 3λ/4 − e, … ಆದಾಗ ಅನುನಾದ (ಜೋರಾದ ಶಬ್ದ) ಉಂಟಾಗುತ್ತದೆ; e ತುದಿ ತಿದ್ದುಪಡಿ.\nಮೊದಲ ಎರಡು ಅನುನಾದ ಉದ್ದಗಳ ವ್ಯತ್ಯಾಸ λ/2, ಆದ್ದರಿಂದ v = nλ = 2n(l₂ − l₁); ಇದು ತುದಿ ತಿದ್ದುಪಡಿಯನ್ನು ನಿವಾರಿಸುತ್ತದೆ."
    ),
    formula: "l₁ + e = λ/4 ,  l₂ + e = 3λ/4\nv = 2n (l₂ − l₁)",
    apparatus: L("Resonance tube apparatus, reservoir, tuning forks, rubber pad, thermometer", "ಅನುನಾದ ನಳಿಕೆ ಉಪಕರಣ, ಜಲಾಶಯ, ಶ್ರುತಿ ಕವೆಗಳು, ರಬ್ಬರ್ ಪ್ಯಾಡ್, ಉಷ್ಣತಾಮಾಪಕ"),
    procedure: [
      "Fill the tube with water nearly to the top by raising the reservoir.",
      "Hold a vibrating tuning fork above the open end.",
      "Slowly lower the water level until a loud sound is heard — first resonance l₁.",
      "Lower further to get the second resonance l₂.",
      "Calculate v = 2n(l₂ − l₁). Repeat with another fork.",
    ],
    sim: "resonance",
    controls: [sel("f", L("Tuning fork", "ಶ್ರುತಿ ಕವೆ"), [384, 480, 512].map((v) => opt(v, `${v} Hz`)), 512), sl("l", L("Air column length (lower water)", "ಗಾಳಿ ಸ್ತಂಭದ ಉದ್ದ"), 5, 100, 0.1, 10, "cm")],
    compute: (p) => {
      const lambda = 34000 / p.f, e = 1.2;
      const ls = [lambda / 4 - e, (3 * lambda) / 4 - e, (5 * lambda) / 4 - e];
      const loud = Math.max(...ls.map((lk) => Math.exp(-Math.pow((p.l - lk) / 0.8, 2))));
      return { lambda, e, loud, loudPct: loud * 100 };
    },
    readouts: [col("loudPct", L("Loudness", "ಶಬ್ದದ ತೀವ್ರತೆ"), "%", 0)],
    canRecord: (p, r) => r.loud > 0.8,
    table: [col("f", L("n", "n"), "Hz", 0), col("l", L("Resonating length", "ಅನುನಾದ ಉದ್ದ"), "cm", 1)],
    result: (rows) => {
      const vs = [];
      [...new Set(rows.map((r) => r.f))].forEach((f) => { const ls = rows.filter((r) => r.f === f).map((r) => r.l).sort((a, b) => a - b); if (ls.length >= 2 && ls[ls.length - 1] - ls[0] > 10) vs.push((2 * f * (ls[ls.length - 1] - ls[0])) / 100 / (ls.length > 2 ? 1 : 1)); });
      if (!vs.length) return L("Record both the first and second resonance for a fork to calculate v.", "v ಲೆಕ್ಕಹಾಕಲು ಒಂದು ಕವೆಗೆ ಮೊದಲ ಮತ್ತು ಎರಡನೇ ಅನುನಾದ ದಾಖಲಿಸಿ.");
      return L(`Speed of sound v ≈ ${mean(vs).toFixed(0)} m/s`, `ಶಬ್ದದ ವೇಗ v ≈ ${mean(vs).toFixed(0)} m/s`);
    },
    tip: L("Move the water level slowly with the + / − buttons near the loud spots.", "ಜೋರಾದ ಸ್ಥಳಗಳ ಹತ್ತಿರ + / − ಗುಂಡಿಗಳಿಂದ ನಿಧಾನವಾಗಿ ನೀರಿನ ಮಟ್ಟ ಬದಲಿಸಿ."),
    quiz: [
      q("In a closed pipe, the first resonance occurs at…", ["λ/2", "λ/4", "λ", "3λ/2"], 1, "Node at water, antinode near open end: λ/4."),
      q("Why is l₂ − l₁ used?", ["It is longer", "It eliminates end correction", "It is easier", "Water evaporates"], 1, "(l₂ + e) − (l₁ + e) = λ/2."),
      q("End correction e ≈ …", ["0.3 × diameter", "Diameter", "Length/2", "Zero"], 0, "e ≈ 0.3 d for a pipe open at one end."),
      q("Speed of sound in air increases with…", ["Pressure", "Temperature", "Frequency", "Amplitude"], 1, "v ∝ √T (absolute temperature)."),
    ],
  },

  /* ============================ CHEMISTRY ============================ */
  {
    id: "puc1-standard-solution", subject: "chemistry", icon: "⚖️",
    title: L("Preparing a standard solution of oxalic acid", "ಆಕ್ಸಾಲಿಕ್ ಆಮ್ಲದ ಪ್ರಮಾಣಿತ ದ್ರಾವಣ ತಯಾರಿಕೆ"),
    aim: L("To prepare 250 mL of 0.1 M standard oxalic acid solution.", "250 mL 0.1 M ಆಕ್ಸಾಲಿಕ್ ಆಮ್ಲದ ಪ್ರಮಾಣಿತ ದ್ರಾವಣ ತಯಾರಿಸುವುದು."),
    theory: L(
      "A standard solution has an exactly known concentration. Oxalic acid (H₂C₂O₄·2H₂O, molar mass 126 g/mol) is a primary standard because it is pure, stable and not hygroscopic.\nMass needed = Molarity × Molar mass × Volume(L) = 0.1 × 126 × 0.25 = 3.15 g. It is weighed accurately, dissolved and made up exactly to the mark of a 250 mL volumetric flask.",
      "ಪ್ರಮಾಣಿತ ದ್ರಾವಣದ ಸಾಂದ್ರತೆ ನಿಖರವಾಗಿ ತಿಳಿದಿರುತ್ತದೆ. ಆಕ್ಸಾಲಿಕ್ ಆಮ್ಲ (H₂C₂O₄·2H₂O, ಮೋಲಾರ್ ದ್ರವ್ಯರಾಶಿ 126 g/mol) ಶುದ್ಧ, ಸ್ಥಿರ ಮತ್ತು ತೇವಾಂಶ ಹೀರದ ಕಾರಣ ಪ್ರಾಥಮಿಕ ಪ್ರಮಾಣಿತ.\nಅಗತ್ಯ ದ್ರವ್ಯರಾಶಿ = ಮೋಲಾರಿಟಿ × ಮೋಲಾರ್ ದ್ರವ್ಯರಾಶಿ × ಘನಫಲ(L) = 0.1 × 126 × 0.25 = 3.15 g. ಇದನ್ನು ನಿಖರವಾಗಿ ತೂಗಿ ಕರಗಿಸಿ 250 mL ಅಳತೆ ಫ್ಲಾಸ್ಕ್‌ನ ಗುರುತಿನವರೆಗೆ ತುಂಬಿಸಲಾಗುತ್ತದೆ."
    ),
    formula: "w = M × Mw × V / 1000\n= 0.1 × 126 × 250 / 1000 = 3.15 g",
    apparatus: L("Chemical balance, weighing bottle, oxalic acid, funnel, 250 mL volumetric flask, wash bottle", "ರಾಸಾಯನಿಕ ತಕ್ಕಡಿ, ತೂಕದ ಬಾಟಲಿ, ಆಕ್ಸಾಲಿಕ್ ಆಮ್ಲ, ಆಲಿಕೆ, 250 mL ಅಳತೆ ಫ್ಲಾಸ್ಕ್, ವಾಶ್ ಬಾಟಲಿ"),
    procedure: [
      "Weigh exactly 3.15 g of oxalic acid.",
      "Transfer it into the volumetric flask through a funnel; wash the funnel with distilled water into the flask.",
      "Shake to dissolve completely.",
      "Add distilled water up to just below the mark, then drop by drop until the lower meniscus touches the mark.",
      "Stopper and shake to make the solution uniform.",
    ],
    sim: "balance", opts: { solute: "Oxalic acid", Mw: 126, vol: 250, target: 3.15 },
    x0: { mass: 0, water: 0, moved: false },
    compute: (p, x) => ({ M: x.moved && x.water ? (x.mass / 126) / (x.water / 1000) : 0, err: Math.abs(x.mass - 3.15) }),
    readouts: [col("mass", L("Mass weighed", "ತೂಗಿದ ದ್ರವ್ಯರಾಶಿ"), "g", 2), col("water", L("Volume", "ಘನಫಲ"), "mL", 1), col("M", L("Molarity", "ಮೋಲಾರಿಟಿ"), "M", 4)],
    canRecord: (p, r, x) => x.moved && Math.abs((x.water || 0) - 250) <= 0.5,
    table: [col("mass", L("Mass", "ದ್ರವ್ಯರಾಶಿ"), "g", 2), col("water", L("Volume", "ಘನಫಲ"), "mL", 1), col("M", L("Molarity", "ಮೋಲಾರಿಟಿ"), "M", 4)],
    result: (rows) => { const r = rows[rows.length - 1]; return L(`Prepared ${r.M.toFixed(4)} M oxalic acid (target 0.1000 M, error ${Math.abs(r.M - 0.1) < 0.0005 ? "negligible" : (Math.abs(r.M - 0.1) * 1000).toFixed(1) + " mM"}).`, `${r.M.toFixed(4)} M ಆಕ್ಸಾಲಿಕ್ ಆಮ್ಲ ತಯಾರಿಸಲಾಗಿದೆ (ಗುರಿ 0.1000 M).`); },
    tip: L("Can you hit exactly 3.15 g and stop exactly at the 250 mL mark using drops?", "ನಿಖರವಾಗಿ 3.15 g ತೂಗಿ ಹನಿಗಳಿಂದ 250 mL ಗುರುತಿನಲ್ಲಿ ನಿಲ್ಲಿಸಬಲ್ಲಿರಾ?"),
    quiz: [
      q("Molar mass of hydrated oxalic acid is…", ["90 g/mol", "126 g/mol", "63 g/mol", "180 g/mol"], 1, "H₂C₂O₄·2H₂O = 90 + 36 = 126."),
      q("Why is NaOH NOT a primary standard?", ["It is coloured", "It absorbs moisture and CO₂", "It is an acid", "It is too heavy"], 1, "NaOH is hygroscopic and reacts with CO₂."),
      q("Mass of oxalic acid for 100 mL of 0.1 M solution is…", ["1.26 g", "12.6 g", "0.126 g", "3.15 g"], 0, "0.1 × 126 × 0.1 = 1.26 g."),
      q("The reading at the mark is taken at the…", ["Upper meniscus", "Lower meniscus for colourless liquids", "Middle", "Side"], 1, "For clear liquids read the bottom of the meniscus."),
    ],
  },
  {
    id: "puc1-titration-naoh", subject: "chemistry", icon: "🧫",
    title: L("Titration: NaOH vs standard oxalic acid", "ಟೈಟ್ರೇಶನ್: NaOH ವಿರುದ್ಧ ಪ್ರಮಾಣಿತ ಆಕ್ಸಾಲಿಕ್ ಆಮ್ಲ"),
    aim: L("To find the molarity and strength of a given NaOH solution by titrating against 0.1 M oxalic acid.", "0.1 M ಆಕ್ಸಾಲಿಕ್ ಆಮ್ಲದ ವಿರುದ್ಧ ಟೈಟ್ರೇಟ್ ಮಾಡಿ NaOH ದ್ರಾವಣದ ಮೋಲಾರಿಟಿ ಮತ್ತು ಸಾಮರ್ಥ್ಯ ಕಂಡುಹಿಡಿಯುವುದು."),
    theory: L(
      "This is an acid–base (neutralisation) titration. NaOH from the burette is added to a known volume of oxalic acid with phenolphthalein. Phenolphthalein is colourless in acid and turns pink in base, so the first permanent light pink colour marks the end point.\nH₂C₂O₄ + 2NaOH → Na₂C₂O₄ + 2H₂O. Using the mole ratio: M₁V₁/n₁ = M₂V₂/n₂.",
      "ಇದು ಆಮ್ಲ–ಪ್ರತ್ಯಾಮ್ಲ (ತಟಸ್ಥೀಕರಣ) ಟೈಟ್ರೇಶನ್. ಬ್ಯೂರೆಟ್‌ನ NaOH ಅನ್ನು ಫಿನಾಫ್ಥಲೀನ್ ಸಹಿತ ತಿಳಿದ ಘನಫಲದ ಆಕ್ಸಾಲಿಕ್ ಆಮ್ಲಕ್ಕೆ ಸೇರಿಸಲಾಗುತ್ತದೆ. ಫಿನಾಫ್ಥಲೀನ್ ಆಮ್ಲದಲ್ಲಿ ಬಣ್ಣರಹಿತ, ಪ್ರತ್ಯಾಮ್ಲದಲ್ಲಿ ಗುಲಾಬಿ; ಮೊದಲ ಶಾಶ್ವತ ತಿಳಿ ಗುಲಾಬಿ ಬಣ್ಣ ಅಂತ್ಯಬಿಂದು.\nH₂C₂O₄ + 2NaOH → Na₂C₂O₄ + 2H₂O. ಮೋಲ್ ಅನುಪಾತ: M₁V₁/n₁ = M₂V₂/n₂."
    ),
    formula: "M(NaOH) = 2 × M(acid) × V(acid) / V(NaOH)\nStrength = M × 40 g/L",
    apparatus: L("Burette, pipette (10 mL), conical flask, burette stand, white tile, 0.1 M oxalic acid, NaOH, phenolphthalein", "ಬ್ಯೂರೆಟ್, ಪಿಪೆಟ್ (10 mL), ಶಂಖಾಕಾರದ ಫ್ಲಾಸ್ಕ್, ಸ್ಟ್ಯಾಂಡ್, ಬಿಳಿ ಟೈಲ್, 0.1 M ಆಕ್ಸಾಲಿಕ್ ಆಮ್ಲ, NaOH, ಫಿನಾಫ್ಥಲೀನ್"),
    procedure: [
      "Rinse and fill the burette with NaOH; note the initial reading (0.0 mL).",
      "Pipette 10 mL of oxalic acid into a conical flask; add 2 drops of phenolphthalein.",
      "Add NaOH from the burette while swirling; near the end point add drop by drop.",
      "Stop at the first permanent pale pink colour; note the final reading.",
      "Repeat until two concordant readings (within 0.1 mL) are obtained.",
    ],
    sim: "titration", opts: { indicator: "phenolphthalein", indicatorLabel: "Phenolphthalein (colourless → pink)", vEq: 20.4, titrantLabel: "NaOH (unknown)", analyteLabel: "10 mL 0.1 M oxalic acid + phenolphthalein" },
    compute: (p, x) => ({ V: x.V || 0, vol: x.V || 0, init: 0, M: x.V ? (2 * 0.1 * 10) / x.V : null }),
    readouts: [col("V", L("Burette reading", "ಬ್ಯೂರೆಟ್ ಓದು"), "mL", 1)],
    canRecord: (p, r, x) => !!x.end,
    table: [col("init", L("Initial", "ಪ್ರಾರಂಭ"), "mL", 1), col("V", L("Final", "ಅಂತಿಮ"), "mL", 1), col("vol", L("Volume of NaOH", "NaOH ಘನಫಲ"), "mL", 1)],
    result: (rows) => { const c = concordant(rows.map((r) => r.V)); if (!c) return L("Repeat the titration until two readings agree within 0.1 mL.", "ಎರಡು ಓದುಗಳು 0.1 mL ಒಳಗೆ ಹೊಂದುವವರೆಗೆ ಪುನರಾವರ್ತಿಸಿ."); const M = (2 * 0.1 * 10) / c; return L(`Concordant volume = ${c.toFixed(1)} mL → M(NaOH) = ${M.toFixed(4)} M, strength = ${(M * 40).toFixed(2)} g/L`, `ಸಮನ್ವಯ ಘನಫಲ = ${c.toFixed(1)} mL → M(NaOH) = ${M.toFixed(4)} M, ಸಾಮರ್ಥ್ಯ = ${(M * 40).toFixed(2)} g/L`); },
    tip: L("Do a rough fast run first, then go slow and add single drops near the end point.", "ಮೊದಲು ವೇಗದ ಅಂದಾಜು ಓಟ ಮಾಡಿ, ನಂತರ ಅಂತ್ಯಬಿಂದುವಿನ ಹತ್ತಿರ ಒಂದೊಂದೇ ಹನಿ ಸೇರಿಸಿ."),
    quiz: [
      q("Phenolphthalein in basic solution is…", ["Colourless", "Pink", "Yellow", "Blue"], 1, "Pink in base, colourless in acid."),
      q("Concordant readings differ by not more than…", ["1 mL", "0.1 mL", "0.5 mL", "2 mL"], 1, "Standard practice is ≤ 0.1 mL."),
      q("Basicity of oxalic acid is…", ["1", "2", "3", "4"], 1, "It has two replaceable H⁺."),
      q("Why is the conical flask placed on a white tile?", ["To keep it cool", "To see the colour change clearly", "To weigh it", "To avoid spills"], 1, "White background makes the faint pink easy to see."),
    ],
  },
  {
    id: "puc1-titration-hcl", subject: "chemistry", icon: "🟠",
    title: L("Titration: HCl vs standard Na₂CO₃", "ಟೈಟ್ರೇಶನ್: HCl ವಿರುದ್ಧ ಪ್ರಮಾಣಿತ Na₂CO₃"),
    aim: L("To find the molarity of a given HCl solution using 0.05 M sodium carbonate and methyl orange indicator.", "0.05 M ಸೋಡಿಯಂ ಕಾರ್ಬೊನೇಟ್ ಮತ್ತು ಮೀಥೈಲ್ ಆರೆಂಜ್ ಸೂಚಕ ಬಳಸಿ HCl ದ್ರಾವಣದ ಮೋಲಾರಿಟಿ ಕಂಡುಹಿಡಿಯುವುದು."),
    theory: L(
      "Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂. Sodium carbonate is a weak base, so methyl orange (yellow in base, orange-red in acid) is used. The end point is the change from yellow to orange-red.\nMole ratio Na₂CO₃ : HCl = 1 : 2, so M(HCl) = 2 × M(Na₂CO₃) × V(Na₂CO₃) / V(HCl).",
      "Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂. ಸೋಡಿಯಂ ಕಾರ್ಬೊನೇಟ್ ದುರ್ಬಲ ಪ್ರತ್ಯಾಮ್ಲ, ಆದ್ದರಿಂದ ಮೀಥೈಲ್ ಆರೆಂಜ್ (ಪ್ರತ್ಯಾಮ್ಲದಲ್ಲಿ ಹಳದಿ, ಆಮ್ಲದಲ್ಲಿ ಕಿತ್ತಳೆ-ಕೆಂಪು) ಬಳಸಲಾಗುತ್ತದೆ. ಹಳದಿಯಿಂದ ಕಿತ್ತಳೆ-ಕೆಂಪಿಗೆ ಬದಲಾವಣೆ ಅಂತ್ಯಬಿಂದು.\nಮೋಲ್ ಅನುಪಾತ Na₂CO₃ : HCl = 1 : 2."
    ),
    formula: "M(HCl) = 2 × 0.05 × 10 / V(HCl)",
    apparatus: L("Burette, pipette, conical flask, 0.05 M Na₂CO₃, HCl, methyl orange", "ಬ್ಯೂರೆಟ್, ಪಿಪೆಟ್, ಶಂಖಾಕಾರದ ಫ್ಲಾಸ್ಕ್, 0.05 M Na₂CO₃, HCl, ಮೀಥೈಲ್ ಆರೆಂಜ್"),
    procedure: [
      "Fill the burette with HCl.",
      "Pipette 10 mL Na₂CO₃ into a flask and add 1–2 drops of methyl orange (yellow).",
      "Titrate with HCl until the colour changes from yellow to orange-red.",
      "Note the volume and repeat for concordant readings.",
    ],
    sim: "titration", opts: { indicator: "methylorange", indicatorLabel: "Methyl orange (yellow → orange-red)", vEq: 10.6, titrantLabel: "HCl (unknown)", analyteLabel: "10 mL 0.05 M Na₂CO₃ + methyl orange" },
    compute: (p, x) => ({ V: x.V || 0, init: 0 }),
    readouts: [col("V", L("Burette reading", "ಬ್ಯೂರೆಟ್ ಓದು"), "mL", 1)],
    canRecord: (p, r, x) => !!x.end,
    table: [col("init", L("Initial", "ಪ್ರಾರಂಭ"), "mL", 1), col("V", L("Final = volume of HCl", "ಅಂತಿಮ = HCl ಘನಫಲ"), "mL", 1)],
    result: (rows) => { const c = concordant(rows.map((r) => r.V)); if (!c) return L("Get two readings within 0.1 mL.", "0.1 mL ಒಳಗಿನ ಎರಡು ಓದುಗಳನ್ನು ಪಡೆಯಿರಿ."); const M = (2 * 0.05 * 10) / c; return L(`Concordant volume ${c.toFixed(1)} mL → M(HCl) = ${M.toFixed(4)} M, strength = ${(M * 36.5).toFixed(2)} g/L`, `ಸಮನ್ವಯ ಘನಫಲ ${c.toFixed(1)} mL → M(HCl) = ${M.toFixed(4)} M`); },
    quiz: [
      q("Methyl orange in acidic solution is…", ["Yellow", "Orange-red/pink", "Colourless", "Blue"], 1, "It turns red/orange in acid."),
      q("Why is phenolphthalein not used here?", ["It is expensive", "CO₂ formed makes the end point unclear", "It is red", "It reacts with HCl"], 1, "Methyl orange works in the acidic range where the end point lies."),
      q("Moles of HCl reacting with 1 mol Na₂CO₃ = …", ["1", "2", "3", "0.5"], 1, "Na₂CO₃ + 2HCl."),
      q("Na₂CO₃ solution is…", ["Acidic", "Basic", "Neutral", "Amphoteric"], 1, "It is the salt of a strong base and weak acid."),
    ],
  },
  {
    id: "puc1-ph-dilution", subject: "chemistry", icon: "🍊",
    title: L("pH of fruit juices and effect of dilution", "ಹಣ್ಣಿನ ರಸಗಳ pH ಮತ್ತು ದುರ್ಬಲೀಕರಣದ ಪರಿಣಾಮ"),
    aim: L("To determine the pH of fruit juices and study how dilution changes the pH of acids and bases.", "ಹಣ್ಣಿನ ರಸಗಳ pH ಕಂಡುಹಿಡಿದು ದುರ್ಬಲೀಕರಣ ಆಮ್ಲ ಮತ್ತು ಪ್ರತ್ಯಾಮ್ಲಗಳ pH ಅನ್ನು ಹೇಗೆ ಬದಲಿಸುತ್ತದೆ ಎಂದು ಅಧ್ಯಯನ."),
    theory: L(
      "Fruit juices contain weak organic acids (citric, malic, tartaric), so their pH is below 7.\nDiluting a strong acid ten times raises its pH by about 1 unit; diluting a strong base ten times lowers its pH by about 1. Weak acids change less, because more of the acid ionises on dilution. On dilution every solution moves towards pH 7.",
      "ಹಣ್ಣಿನ ರಸಗಳಲ್ಲಿ ದುರ್ಬಲ ಸಾವಯವ ಆಮ್ಲಗಳು (ಸಿಟ್ರಿಕ್, ಮ್ಯಾಲಿಕ್, ಟಾರ್ಟಾರಿಕ್) ಇರುವುದರಿಂದ pH 7 ಕ್ಕಿಂತ ಕಡಿಮೆ.\nಪ್ರಬಲ ಆಮ್ಲವನ್ನು ಹತ್ತು ಪಟ್ಟು ದುರ್ಬಲಗೊಳಿಸಿದರೆ pH ಸುಮಾರು 1 ಘಟಕ ಹೆಚ್ಚುತ್ತದೆ; ಪ್ರಬಲ ಪ್ರತ್ಯಾಮ್ಲದ pH ಸುಮಾರು 1 ಕಡಿಮೆಯಾಗುತ್ತದೆ. ದುರ್ಬಲ ಆಮ್ಲಗಳಲ್ಲಿ ಬದಲಾವಣೆ ಕಡಿಮೆ. ದುರ್ಬಲೀಕರಣದಲ್ಲಿ ಎಲ್ಲಾ ದ್ರಾವಣಗಳು pH 7 ಕಡೆಗೆ ಸಾಗುತ್ತವೆ."
    ),
    formula: "pH = −log[H⁺]\n10× dilution of strong acid: pH + 1",
    apparatus: L("Fruit juices, 0.1 M HCl, 0.1 M NaOH, pH paper, test tubes, measuring cylinder, distilled water", "ಹಣ್ಣಿನ ರಸಗಳು, 0.1 M HCl, 0.1 M NaOH, pH ಕಾಗದ, ಪರೀಕ್ಷಾ ನಳಿಕೆಗಳು, ಅಳತೆ ಸಿಲಿಂಡರ್, ಬಟ್ಟಿ ನೀರು"),
    procedure: [
      "Find the pH of each fruit juice with pH paper.",
      "Take 1 mL of 0.1 M HCl and dilute to 10 mL; find pH. Dilute 10× again and test.",
      "Repeat the dilution series with NaOH.",
      "Tabulate pH against dilution.",
    ],
    sim: "ph",
    opts: { samples: [
      { k: "lemon", l: L("Lemon juice", "ನಿಂಬೆ ರಸ"), pH: 2.3, color: "rgba(254,240,138,0.7)" },
      { k: "orange", l: L("Orange juice", "ಕಿತ್ತಳೆ ರಸ"), pH: 3.6, color: "rgba(253,186,116,0.8)" },
      { k: "apple", l: L("Apple juice", "ಸೇಬು ರಸ"), pH: 3.4, color: "rgba(254,215,170,0.7)" },
      { k: "tomato", l: L("Tomato juice", "ಟೊಮ್ಯಾಟೊ ರಸ"), pH: 4.3, color: "rgba(248,113,113,0.7)" },
      { k: "hcl", l: L("0.1 M HCl", "0.1 M HCl"), pH: 1, color: "rgba(226,232,240,0.7)" },
      { k: "naoh", l: L("0.1 M NaOH", "0.1 M NaOH"), pH: 13, color: "rgba(226,232,240,0.7)" },
    ] },
    controls: [
      sel("sample", L("Sample", "ಮಾದರಿ"), [opt("lemon", "Lemon", "ನಿಂಬೆ"), opt("orange", "Orange", "ಕಿತ್ತಳೆ"), opt("apple", "Apple", "ಸೇಬು"), opt("tomato", "Tomato", "ಟೊಮ್ಯಾಟೊ"), opt("hcl", "0.1 M HCl"), opt("naoh", "0.1 M NaOH")], "lemon"),
      sel("dil", L("Dilution", "ದುರ್ಬಲೀಕರಣ"), [opt(1, "None"), opt(10, "10×"), opt(100, "100×"), opt(1000, "1000×")], 1),
    ],
    compute: (p, x) => {
      const base = { lemon: 2.3, orange: 3.6, apple: 3.4, tomato: 4.3, hcl: 1, naoh: 13 }[p.sample];
      const names = { lemon: L("Lemon juice", "ನಿಂಬೆ ರಸ"), orange: L("Orange juice", "ಕಿತ್ತಳೆ ರಸ"), apple: L("Apple juice", "ಸೇಬು ರಸ"), tomato: L("Tomato juice", "ಟೊಮ್ಯಾಟೊ ರಸ"), hcl: L("0.1 M HCl"), naoh: L("0.1 M NaOH") };
      const lg = Math.log10(p.dil);
      const pH = p.sample === "hcl" ? Math.min(6.9, base + lg) : p.sample === "naoh" ? Math.max(7.1, base - lg) : Math.min(6.8, base + 0.5 * lg);
      return { pH, sampleName: names[p.sample], nature: nature(pH), pHshown: x.dipped ? pH : null, dilName: `${p.dil}×` };
    },
    readouts: [col("pHshown", L("pH (from chart)", "pH (ಚಾರ್ಟ್‌ನಿಂದ)"), "", 1), col("nature", L("Nature", "ಸ್ವಭಾವ"))],
    canRecord: (p, r, x) => !!x.dipped,
    table: [col("sampleName", L("Sample", "ಮಾದರಿ")), col("dil", L("Dilution", "ದುರ್ಬಲೀಕರಣ"), "×", 0), col("pH", L("pH", "pH"), "", 1), col("nature", L("Nature", "ಸ್ವಭಾವ"))],
    graph: { x: "dil", y: "pH", fit: "curve", note: L("Plot one sample at a time for a clear dilution curve.", "ಸ್ಪಷ್ಟ ವಕ್ರರೇಖೆಗಾಗಿ ಒಂದು ಬಾರಿಗೆ ಒಂದೇ ಮಾದರಿ ದಾಖಲಿಸಿ.") },
    quiz: [
      q("pH of 0.001 M HCl is…", ["1", "2", "3", "11"], 2, "[H⁺] = 10⁻³ → pH 3."),
      q("On dilution, the pH of NaOH solution…", ["Increases", "Decreases towards 7", "Stays 14", "Becomes 0"], 1, "[OH⁻] falls so pH moves down towards 7."),
      q("Lemon juice is acidic due to…", ["Acetic acid", "Citric acid", "Tartaric acid only", "HCl"], 1, "Citric acid."),
      q("Can dilution make an acid basic?", ["Yes", "No — it only approaches pH 7", "Only HCl", "Only weak acids"], 1, "Water itself is neutral."),
    ],
  },
  (() => {
    const samples = [
      { k: "A", l: L("Salt A", "ಲವಣ A"), color: "rgba(241,245,249,0.8)" },
      { k: "B", l: L("Salt B", "ಲವಣ B"), color: "rgba(241,245,249,0.8)" },
      { k: "C", l: L("Salt C", "ಲವಣ C"), color: "rgba(241,245,249,0.8)" },
      { k: "D", l: L("Salt D", "ಲವಣ D"), color: "rgba(241,245,249,0.8)" },
    ];
    const reagents = [
      { k: "dilh2so4", l: L("Dilute H₂SO₄", "ದುರ್ಬಲ H₂SO₄"), color: "rgba(226,232,240,0.9)" },
      { k: "conch2so4", l: L("Conc. H₂SO₄ (warm)", "ಸಾರ H₂SO₄ (ಬಿಸಿ)"), color: "rgba(226,232,240,0.9)" },
      { k: "agno3", l: L("AgNO₃ solution", "AgNO₃ ದ್ರಾವಣ"), color: "rgba(226,232,240,0.9)" },
      { k: "bacl2", l: L("BaCl₂ solution", "BaCl₂ ದ್ರಾವಣ"), color: "rgba(226,232,240,0.9)" },
      { k: "ring", l: L("FeSO₄ + conc. H₂SO₄ (ring test)", "FeSO₄ + ಸಾರ H₂SO₄ (ಉಂಗುರ ಪರೀಕ್ಷೆ)"), color: "rgba(187,247,208,0.9)" },
    ];
    return {
      id: "puc1-anion-analysis", subject: "chemistry", icon: "🔎",
      title: L("Salt analysis — identifying anions", "ಲವಣ ವಿಶ್ಲೇಷಣೆ — ಋಣ ಅಯಾನುಗಳ ಗುರುತಿಸುವಿಕೆ"),
      aim: L("To identify the anion (acid radical) present in the given salts by systematic tests.", "ವ್ಯವಸ್ಥಿತ ಪರೀಕ್ಷೆಗಳಿಂದ ಕೊಟ್ಟ ಲವಣಗಳಲ್ಲಿರುವ ಋಣ ಅಯಾನು (ಆಮ್ಲ ರ್ಯಾಡಿಕಲ್) ಗುರುತಿಸುವುದು."),
      theory: L(
        "Anions are detected by preliminary tests with dilute and concentrated H₂SO₄, followed by confirmatory tests.\nCarbonate gives brisk effervescence of CO₂ with dilute H₂SO₄. Chloride gives HCl fumes with conc. H₂SO₄ and a white curdy precipitate with AgNO₃ (soluble in NH₄OH). Sulphate gives a white precipitate with BaCl₂ that is insoluble in HCl. Nitrate gives a brown ring with FeSO₄ and conc. H₂SO₄.",
        "ಋಣ ಅಯಾನುಗಳನ್ನು ದುರ್ಬಲ ಮತ್ತು ಸಾರ H₂SO₄ ಪ್ರಾಥಮಿಕ ಪರೀಕ್ಷೆಗಳು ಹಾಗೂ ದೃಢೀಕರಣ ಪರೀಕ್ಷೆಗಳಿಂದ ಪತ್ತೆಹಚ್ಚಲಾಗುತ್ತದೆ.\nಕಾರ್ಬೊನೇಟ್ ದುರ್ಬಲ H₂SO₄ ನೊಂದಿಗೆ CO₂ ತೀವ್ರ ಗುಳ್ಳೆಗಳನ್ನು ನೀಡುತ್ತದೆ. ಕ್ಲೋರೈಡ್ ಸಾರ H₂SO₄ ನೊಂದಿಗೆ HCl ಹೊಗೆ ಮತ್ತು AgNO₃ ನೊಂದಿಗೆ ಬಿಳಿ ಮೊಸರಿನಂತಹ ಅವಕ್ಷೇಪ (NH₄OH ನಲ್ಲಿ ಕರಗುವ) ನೀಡುತ್ತದೆ. ಸಲ್ಫೇಟ್ BaCl₂ ನೊಂದಿಗೆ HCl ನಲ್ಲಿ ಕರಗದ ಬಿಳಿ ಅವಕ್ಷೇಪ ನೀಡುತ್ತದೆ. ನೈಟ್ರೇಟ್ FeSO₄ ಮತ್ತು ಸಾರ H₂SO₄ ನೊಂದಿಗೆ ಕಂದು ಉಂಗುರ ನೀಡುತ್ತದೆ."
      ),
      apparatus: L("Test tubes, test-tube holder, burner, salt samples, dil. & conc. H₂SO₄, AgNO₃, BaCl₂, FeSO₄, NH₄OH", "ಪರೀಕ್ಷಾ ನಳಿಕೆಗಳು, ಹಿಡಿಕೆ, ಬರ್ನರ್, ಲವಣ ಮಾದರಿಗಳು, ದುರ್ಬಲ ಮತ್ತು ಸಾರ H₂SO₄, AgNO₃, BaCl₂, FeSO₄, NH₄OH"),
      procedure: [
        "Note colour, smell and solubility of the salt.",
        "Add dilute H₂SO₄ to a pinch of the salt — look for effervescence.",
        "If no result, warm with conc. H₂SO₄ — look for fumes or brown gas.",
        "Prepare the water extract and do confirmatory tests (AgNO₃, BaCl₂, ring test).",
        "Report the anion present.",
      ],
      sim: "bench",
      opts: {
        samples, reagents,
        react: {
          "A|dilh2so4": { gas: true, vigor: 60, obs: L("Brisk effervescence; colourless gas turns lime water milky", "ತೀವ್ರ ಗುಳ್ಳೆಗಳು; ಬಣ್ಣರಹಿತ ಅನಿಲ ಸುಣ್ಣದ ನೀರನ್ನು ಹಾಲಿನಂತೆ ಮಾಡುತ್ತದೆ"), inf: L("CO₃²⁻ may be present", "CO₃²⁻ ಇರಬಹುದು") },
          "A|bacl2": { ppt: "#f8fafc", obs: L("White ppt, dissolves in dil. HCl with effervescence", "ಬಿಳಿ ಅವಕ್ಷೇಪ, ದುರ್ಬಲ HCl ನಲ್ಲಿ ಗುಳ್ಳೆಗಳೊಂದಿಗೆ ಕರಗುತ್ತದೆ"), inf: L("CO₃²⁻ confirmed", "CO₃²⁻ ದೃಢ") },
          "A|agno3": { ppt: "#fefce8", obs: L("Yellowish-white ppt soluble in HNO₃", "HNO₃ ನಲ್ಲಿ ಕರಗುವ ಹಳದಿ-ಬಿಳಿ ಅವಕ್ಷೇಪ"), inf: L("Not chloride (carbonate interferes)", "ಕ್ಲೋರೈಡ್ ಅಲ್ಲ") },
          "B|conch2so4": { gas: true, vigor: 20, heat: true, obs: L("Colourless pungent fumes; dense white fumes with NH₃ rod", "ಬಣ್ಣರಹಿತ ತೀಕ್ಷ್ಣ ಹೊಗೆ; NH₃ ಕಡ್ಡಿಯ ಬಳಿ ದಟ್ಟ ಬಿಳಿ ಹೊಗೆ"), inf: L("HCl gas — Cl⁻ may be present", "HCl ಅನಿಲ — Cl⁻ ಇರಬಹುದು") },
          "B|agno3": { ppt: "#ffffff", obs: L("White curdy ppt, soluble in NH₄OH", "NH₄OH ನಲ್ಲಿ ಕರಗುವ ಬಿಳಿ ಮೊಸರಿನಂತಹ ಅವಕ್ಷೇಪ"), inf: L("Cl⁻ confirmed (AgCl)", "Cl⁻ ದೃಢ (AgCl)") },
          "C|bacl2": { ppt: "#ffffff", obs: L("White ppt insoluble in conc. HCl", "ಸಾರ HCl ನಲ್ಲಿ ಕರಗದ ಬಿಳಿ ಅವಕ್ಷೇಪ"), inf: L("SO₄²⁻ confirmed (BaSO₄)", "SO₄²⁻ ದೃಢ (BaSO₄)") },
          "D|conch2so4": { gas: true, vigor: 15, heat: true, c: "rgba(180,83,9,0.35)", obs: L("Light brown fumes on heating with Cu turnings", "ತಾಮ್ರದ ಚೂರುಗಳೊಂದಿಗೆ ಬಿಸಿಮಾಡಿದಾಗ ತಿಳಿ ಕಂದು ಹೊಗೆ"), inf: L("NO₂ — NO₃⁻ may be present", "NO₂ — NO₃⁻ ಇರಬಹುದು") },
          "D|ring": { c: "rgba(187,247,208,0.6)", ppt: "#7c2d12", obs: L("Brown ring at the junction of the two layers", "ಎರಡು ಪದರಗಳ ಸಂಧಿಯಲ್ಲಿ ಕಂದು ಉಂಗುರ"), inf: L("NO₃⁻ confirmed", "NO₃⁻ ದೃಢ") },
        },
        identify: { prompt: L("Which anion is present in the CURRENT salt?", "ಪ್ರಸ್ತುತ ಲವಣದಲ್ಲಿ ಯಾವ ಋಣ ಅಯಾನು ಇದೆ?"), choices: [L("Carbonate CO₃²⁻"), L("Chloride Cl⁻"), L("Sulphate SO₄²⁻"), L("Nitrate NO₃⁻")], answer: { A: 0, B: 1, C: 2, D: 3 } },
      },
      controls: benchControls(samples, reagents),
      canRecord: (p, r, x) => !!x.tested,
      table: benchCols,
      tip: L("Be a detective: run tests on each unknown salt and identify all four.", "ಪತ್ತೇದಾರರಾಗಿ: ಪ್ರತಿ ಅಜ್ಞಾತ ಲವಣ ಪರೀಕ್ಷಿಸಿ ನಾಲ್ಕನ್ನೂ ಗುರುತಿಸಿ."),
      quiz: [
        q("Brown ring test is used to detect…", ["Cl⁻", "SO₄²⁻", "NO₃⁻", "CO₃²⁻"], 2, "Brown ring = [Fe(H₂O)₅NO]²⁺."),
        q("AgCl precipitate is soluble in…", ["Water", "NH₄OH", "HNO₃", "Alcohol"], 1, "Forms soluble [Ag(NH₃)₂]⁺."),
        q("BaSO₄ is…", ["Soluble in HCl", "Insoluble in HCl", "Yellow", "A gas"], 1, "This distinguishes sulphate from carbonate."),
        q("Dense white fumes with NH₃ are due to…", ["NH₄Cl", "NaCl", "Cl₂", "HNO₃"], 0, "HCl + NH₃ → NH₄Cl."),
      ],
    };
  })(),
  {
    id: "puc1-melting-point", subject: "chemistry", icon: "🌡️",
    title: L("Melting point of an organic compound", "ಸಾವಯವ ಸಂಯುಕ್ತದ ದ್ರವನ ಬಿಂದು"),
    aim: L("To determine the melting point of a given organic compound and identify it.", "ಕೊಟ್ಟ ಸಾವಯವ ಸಂಯುಕ್ತದ ದ್ರವನ ಬಿಂದು ಕಂಡುಹಿಡಿದು ಗುರುತಿಸುವುದು."),
    theory: L(
      "A pure crystalline solid melts sharply at a fixed temperature (range ≤ 1 °C). Impurities lower the melting point and widen the range, so melting point tells both identity and purity.\nThe sample in a sealed capillary is heated slowly in a Thiele tube. Heating too fast makes the thermometer lag behind the sample, giving a wrong (higher) reading.",
      "ಶುದ್ಧ ಹರಳು ಘನವು ನಿಗದಿತ ತಾಪದಲ್ಲಿ ತೀಕ್ಷ್ಣವಾಗಿ ಕರಗುತ್ತದೆ (ವ್ಯಾಪ್ತಿ ≤ 1 °C). ಕಲ್ಮಶಗಳು ದ್ರವನ ಬಿಂದುವನ್ನು ಕಡಿಮೆ ಮಾಡಿ ವ್ಯಾಪ್ತಿ ಹೆಚ್ಚಿಸುತ್ತವೆ; ಹೀಗಾಗಿ ದ್ರವನ ಬಿಂದು ಗುರುತು ಮತ್ತು ಶುದ್ಧತೆ ಎರಡನ್ನೂ ತಿಳಿಸುತ್ತದೆ.\nಮುಚ್ಚಿದ ಕೇಶನಾಳಿಕೆಯಲ್ಲಿನ ಮಾದರಿಯನ್ನು ಥೀಲೆ ನಳಿಕೆಯಲ್ಲಿ ನಿಧಾನವಾಗಿ ಕಾಯಿಸಲಾಗುತ್ತದೆ. ವೇಗವಾಗಿ ಕಾಯಿಸಿದರೆ ಉಷ್ಣತಾಮಾಪಕ ಹಿಂದುಳಿದು ತಪ್ಪಾದ (ಹೆಚ್ಚಿನ) ಓದು ಬರುತ್ತದೆ."
    ),
    formula: "Melting point = (T₁ + T₂) / 2",
    apparatus: L("Thiele tube, liquid paraffin, thermometer, capillary tubes, burner, compound", "ಥೀಲೆ ನಳಿಕೆ, ದ್ರವ ಪ್ಯಾರಾಫಿನ್, ಉಷ್ಣತಾಮಾಪಕ, ಕೇಶನಾಳಿಕೆಗಳು, ಬರ್ನರ್, ಸಂಯುಕ್ತ"),
    procedure: [
      "Seal one end of a capillary and fill 2–3 mm with the powdered compound.",
      "Attach it to the thermometer so the sample is beside the bulb.",
      "Heat the side arm of the Thiele tube slowly (about 2 °C per minute near the melting point).",
      "Note T₁ when the solid starts to melt and T₂ when it becomes a clear liquid.",
    ],
    sim: "melting",
    opts: { substances: [
      { k: "naph", l: L("Naphthalene", "ನ್ಯಾಫ್ಥಲೀನ್"), mp: 80 },
      { k: "acet", l: L("Unknown compound X", "ಅಜ್ಞಾತ ಸಂಯುಕ್ತ X"), mp: 114 },
      { k: "benz", l: L("Benzoic acid", "ಬೆಂಜೋಯಿಕ್ ಆಮ್ಲ"), mp: 122 },
      { k: "urea", l: L("Urea", "ಯೂರಿಯಾ"), mp: 133 },
    ] },
    controls: [
      sel("sub", L("Compound", "ಸಂಯುಕ್ತ"), [opt("naph", "Naphthalene", "ನ್ಯಾಫ್ಥಲೀನ್"), opt("acet", "Unknown X", "ಅಜ್ಞಾತ X"), opt("benz", "Benzoic acid", "ಬೆಂಜೋಯಿಕ್ ಆಮ್ಲ"), opt("urea", "Urea", "ಯೂರಿಯಾ")], "naph"),
      sl("rate", L("Heating rate", "ಕಾಯಿಸುವ ದರ"), 1, 10, 1, 4, "°C/min"),
    ],
    compute: (p, x) => ({ mp: x.T1 && x.T2 ? (x.T1 + x.T2) / 2 : null, subName: { naph: L("Naphthalene", "ನ್ಯಾಫ್ಥಲೀನ್"), acet: L("Unknown X", "ಅಜ್ಞಾತ X"), benz: L("Benzoic acid", "ಬೆಂಜೋಯಿಕ್ ಆಮ್ಲ"), urea: L("Urea", "ಯೂರಿಯಾ") }[p.sub] }),
    readouts: [col("T", L("Thermometer", "ಉಷ್ಣತಾಮಾಪಕ"), "°C", 1), col("mp", L("Melting point", "ದ್ರವನ ಬಿಂದು"), "°C", 1)],
    canRecord: (p, r, x) => x.T1 != null && x.T2 != null,
    table: [col("subName", L("Compound", "ಸಂಯುಕ್ತ")), col("rate", L("Rate", "ದರ"), "°C/min", 0), col("T1", L("T₁", "T₁"), "°C", 1), col("T2", L("T₂", "T₂"), "°C", 1), col("mp", L("m.p.", "ದ್ರ.ಬಿ."), "°C", 1)],
    result: (rows) => L(`Recorded m.p. values: ${rows.map((r) => r.mp.toFixed(1) + " °C").join(", ")}. Compare with: naphthalene 80, acetanilide 114, benzoic acid 122, urea 133 °C.`, `ದಾಖಲಾದ ದ್ರವನ ಬಿಂದುಗಳು: ${rows.map((r) => r.mp.toFixed(1) + " °C").join(", ")}. ಹೋಲಿಸಿ: ನ್ಯಾಫ್ಥಲೀನ್ 80, ಅಸಿಟನಿಲೈಡ್ 114, ಬೆಂಜೋಯಿಕ್ ಆಮ್ಲ 122, ಯೂರಿಯಾ 133 °C.`),
    tip: L("Measure the same compound at 2 °C/min and at 10 °C/min. Which is closer to the true value?", "ಒಂದೇ ಸಂಯುಕ್ತವನ್ನು 2 °C/min ಮತ್ತು 10 °C/min ನಲ್ಲಿ ಅಳೆಯಿರಿ. ಯಾವುದು ನಿಜ ಮೌಲ್ಯಕ್ಕೆ ಹತ್ತಿರ?"),
    quiz: [
      q("Impurities generally ___ the melting point.", ["Raise", "Lower", "Don't change", "Double"], 1, "Impurities depress and broaden the melting range."),
      q("Liquid paraffin is used in the Thiele tube because it…", ["Is cheap", "Has a high boiling point", "Is coloured", "Freezes easily"], 1, "It can be heated well above 150 °C safely."),
      q("A pure compound melts over a range of…", ["Less than 1 °C", "10 °C", "20 °C", "No range"], 0, "Sharp melting is a sign of purity."),
      q("Heating too fast gives a reading that is…", ["Too low", "Too high", "Exact", "Negative"], 1, "The thermometer lags behind the sample."),
    ],
  },

  /* ============================ BIOLOGY ============================ */
  {
    id: "puc1-osmosis", subject: "biology", icon: "🥔",
    title: L("Osmosis — potato osmometer", "ಅಭಿಸರಣ — ಆಲೂಗಡ್ಡೆ ಅಭಿಸರಣಮಾಪಕ"),
    aim: L("To demonstrate osmosis using a potato osmometer.", "ಆಲೂಗಡ್ಡೆ ಅಭಿಸರಣಮಾಪಕ ಬಳಸಿ ಅಭಿಸರಣವನ್ನು ಪ್ರದರ್ಶಿಸುವುದು."),
    theory: L(
      "Osmosis is the movement of water molecules from a region of lower solute concentration (hypotonic) to higher solute concentration (hypertonic) through a semi-permeable membrane.\nThe living cells of the potato act as the semi-permeable membrane. Water from the beaker enters the sugar solution in the cavity, so the level in the cavity rises. With plain water in the cavity there is no rise.",
      "ಅಭಿಸರಣವು ಅರೆ-ಪ್ರವೇಶ್ಯ ಪೊರೆಯ ಮೂಲಕ ಕಡಿಮೆ ದ್ರಾವ್ಯ ಸಾಂದ್ರತೆಯ (ಹೈಪೋಟಾನಿಕ್) ಪ್ರದೇಶದಿಂದ ಹೆಚ್ಚು ಸಾಂದ್ರತೆಯ (ಹೈಪರ್‌ಟಾನಿಕ್) ಪ್ರದೇಶಕ್ಕೆ ನೀರಿನ ಅಣುಗಳ ಚಲನೆ.\nಆಲೂಗಡ್ಡೆಯ ಜೀವಂತ ಕೋಶಗಳು ಅರೆ-ಪ್ರವೇಶ್ಯ ಪೊರೆಯಾಗಿ ವರ್ತಿಸುತ್ತವೆ. ಬೀಕರ್‌ನ ನೀರು ಕುಳಿಯಲ್ಲಿನ ಸಕ್ಕರೆ ದ್ರಾವಣಕ್ಕೆ ಪ್ರವೇಶಿಸಿ ಮಟ್ಟ ಏರುತ್ತದೆ. ಕುಳಿಯಲ್ಲಿ ಕೇವಲ ನೀರಿದ್ದರೆ ಏರಿಕೆ ಇಲ್ಲ."
    ),
    apparatus: L("Large potato, knife, beaker, sugar solution, pin, water", "ದೊಡ್ಡ ಆಲೂಗಡ್ಡೆ, ಚಾಕು, ಬೀಕರ್, ಸಕ್ಕರೆ ದ್ರಾವಣ, ಪಿನ್, ನೀರು"),
    procedure: [
      "Peel a potato, cut one end flat and scoop out a cavity from the other end.",
      "Fill the cavity half with concentrated sugar solution and mark the level with a pin.",
      "Place the potato in a beaker of water.",
      "Observe the level in the cavity after some time.",
      "Set up a control with water in the cavity.",
    ],
    sim: "osmosis",
    controls: [sl("conc", L("Sugar concentration in cavity", "ಕುಳಿಯಲ್ಲಿ ಸಕ್ಕರೆ ಸಾಂದ್ರತೆ"), 0, 1, 0.1, 0.6, "M")],
    x0: { time: 0 },
    compute: (p, x) => { const riseAt = (m) => 40 * p.conc * (1 - Math.exp(-m / 45)); return { riseAt, rise: riseAt(x.time || 0), t: x.time || 0 }; },
    readouts: [col("t", L("Time", "ಸಮಯ"), "min", 0), col("rise", L("Rise in level", "ಮಟ್ಟದ ಏರಿಕೆ"), "mm", 1)],
    table: [col("conc", L("Sugar", "ಸಕ್ಕರೆ"), "M", 1), col("t", L("Time", "ಸಮಯ"), "min", 0), col("rise", L("Rise", "ಏರಿಕೆ"), "mm", 1)],
    graph: { x: "t", y: "rise", fit: "curve" },
    result: (rows) => L(`Maximum rise recorded = ${Math.max(...rows.map((r) => r.rise)).toFixed(1)} mm — water entered the cavity by osmosis.`, `ದಾಖಲಾದ ಗರಿಷ್ಠ ಏರಿಕೆ = ${Math.max(...rows.map((r) => r.rise)).toFixed(1)} mm — ಅಭಿಸರಣದಿಂದ ನೀರು ಕುಳಿಯೊಳಗೆ ಪ್ರವೇಶಿಸಿದೆ.`),
    tip: L("Record every 15 minutes. Then repeat with 0 M sugar as a control.", "ಪ್ರತಿ 15 ನಿಮಿಷಕ್ಕೆ ದಾಖಲಿಸಿ. ನಂತರ 0 M ಸಕ್ಕರೆಯೊಂದಿಗೆ ನಿಯಂತ್ರಣ ಪ್ರಯೋಗ ಮಾಡಿ."),
    quiz: [
      q("In the potato osmometer, the semi-permeable membrane is…", ["Potato skin only", "Living cells of potato", "Beaker wall", "Sugar"], 1, "Living cell membranes are selectively permeable."),
      q("Water moves from…", ["Hypertonic to hypotonic", "Hypotonic to hypertonic", "Both ways equally", "Not at all"], 1, "Water moves towards higher solute concentration."),
      q("If the potato is boiled first, the level will…", ["Rise faster", "Not rise", "Fall", "Double"], 1, "Boiling kills cells; membranes lose semi-permeability."),
      q("Raisins swell in water due to…", ["Diffusion", "Endosmosis", "Exosmosis", "Transpiration"], 1, "Water enters the raisin cells."),
    ],
  },
  {
    id: "puc1-plasmolysis", subject: "biology", icon: "🟣",
    title: L("Plasmolysis in Rhoeo leaf cells", "ರಿಯೋ ಎಲೆ ಕೋಶಗಳಲ್ಲಿ ಜೀವದ್ರವ್ಯ ಕುಗ್ಗುವಿಕೆ"),
    aim: L("To study plasmolysis in epidermal peels of Rhoeo leaves in different salt concentrations.", "ವಿವಿಧ ಉಪ್ಪಿನ ಸಾಂದ್ರತೆಗಳಲ್ಲಿ ರಿಯೋ ಎಲೆಯ ಸಿಪ್ಪೆಯ ಕೋಶಗಳಲ್ಲಿ ಜೀವದ್ರವ್ಯ ಕುಗ್ಗುವಿಕೆ ಅಧ್ಯಯನ."),
    theory: L(
      "When a plant cell is placed in a hypertonic solution, water leaves the vacuole by exosmosis. The protoplast shrinks and pulls away from the cell wall — this is plasmolysis.\nThe concentration at which about 50% of the cells are plasmolysed is called incipient plasmolysis; it is roughly isotonic with the cell sap. Placing the cells back in water reverses the process (deplasmolysis).",
      "ಸಸ್ಯ ಕೋಶವನ್ನು ಹೈಪರ್‌ಟಾನಿಕ್ ದ್ರಾವಣದಲ್ಲಿಟ್ಟಾಗ ಬಹಿರಭಿಸರಣದಿಂದ ನೀರು ರಸಧಾನಿಯಿಂದ ಹೊರಬರುತ್ತದೆ. ಜೀವದ್ರವ್ಯ ಕುಗ್ಗಿ ಕೋಶಭಿತ್ತಿಯಿಂದ ಬೇರ್ಪಡುತ್ತದೆ — ಇದೇ ಜೀವದ್ರವ್ಯ ಕುಗ್ಗುವಿಕೆ.\nಸುಮಾರು 50% ಕೋಶಗಳು ಕುಗ್ಗುವ ಸಾಂದ್ರತೆಯನ್ನು ಆರಂಭಿಕ ಜೀವದ್ರವ್ಯ ಕುಗ್ಗುವಿಕೆ ಎನ್ನುತ್ತಾರೆ; ಇದು ಕೋಶರಸಕ್ಕೆ ಸಮಸಾಂದ್ರ. ಕೋಶಗಳನ್ನು ಮತ್ತೆ ನೀರಿನಲ್ಲಿಟ್ಟರೆ ಪ್ರಕ್ರಿಯೆ ಹಿಮ್ಮುಖವಾಗುತ್ತದೆ."
    ),
    apparatus: L("Rhoeo leaves, NaCl solutions (0–0.8 M), watch glasses, slides, cover slips, forceps, microscope", "ರಿಯೋ ಎಲೆಗಳು, NaCl ದ್ರಾವಣಗಳು (0–0.8 M), ವಾಚ್ ಗ್ಲಾಸ್‌ಗಳು, ಸ್ಲೈಡ್‌ಗಳು, ಕವರ್ ಸ್ಲಿಪ್‌ಗಳು, ಚಿಮುಟ, ಸೂಕ್ಷ್ಮದರ್ಶಕ"),
    procedure: [
      "Peel the lower epidermis of a Rhoeo leaf (purple cells).",
      "Place pieces in watch glasses containing different NaCl concentrations for 10 minutes.",
      "Mount each peel in the same solution and observe under the microscope.",
      "Count the total and plasmolysed cells in a field; calculate % plasmolysis.",
      "Plot % plasmolysis against concentration.",
    ],
    sim: "microscope",
    opts: { specimen: "plasmolysis", find: [{ type: "plasmolysed", l: L("a plasmolysed cell", "ಕುಗ್ಗಿದ ಕೋಶ") }, { type: "turgid", l: L("a turgid cell", "ಸ್ಫೀತ ಕೋಶ") }] },
    controls: [sl("conc", L("NaCl concentration", "NaCl ಸಾಂದ್ರತೆ"), 0, 0.8, 0.05, 0.3, "M"), ...focusControls],
    x0: { field: 1 },
    compute: (p, x) => { const P = x.counts?.plasmolysed || 0, T = x.total || 0; return { P, T, pct: T ? (P / T) * 100 : 0 }; },
    readouts: [col("T", L("Cells in view", "ಕಾಣುವ ಕೋಶಗಳು"), "", 0), col("P", L("Plasmolysed", "ಕುಗ್ಗಿದವು"), "", 0), col("pct", L("% plasmolysis", "% ಕುಗ್ಗುವಿಕೆ"), "%", 1)],
    canRecord: (p) => Math.abs(p.focus - 50) < 12,
    table: [col("conc", L("NaCl", "NaCl"), "M", 2), col("T", L("Total", "ಒಟ್ಟು"), "", 0), col("P", L("Plasmolysed", "ಕುಗ್ಗಿದವು"), "", 0), col("pct", L("%", "%"), "%", 1)],
    graph: { x: "conc", y: "pct", fit: "curve" },
    result: (rows) => { const s = [...rows].sort((a, b) => a.conc - b.conc); const r = s.find((q2) => q2.pct >= 50); return r ? L(`Incipient plasmolysis (~50%) at about ${r.conc.toFixed(2)} M NaCl`, `ಆರಂಭಿಕ ಕುಗ್ಗುವಿಕೆ (~50%) ಸುಮಾರು ${r.conc.toFixed(2)} M NaCl ನಲ್ಲಿ`) : L("Increase the concentration until at least half the cells are plasmolysed.", "ಕನಿಷ್ಠ ಅರ್ಧ ಕೋಶಗಳು ಕುಗ್ಗುವವರೆಗೆ ಸಾಂದ್ರತೆ ಹೆಚ್ಚಿಸಿ."); },
    tip: L("Record at 0, 0.1, 0.2 … 0.8 M to get a full S-shaped curve.", "ಸಂಪೂರ್ಣ S-ಆಕಾರದ ವಕ್ರರೇಖೆಗೆ 0, 0.1, 0.2 … 0.8 M ನಲ್ಲಿ ದಾಖಲಿಸಿ."),
    quiz: [
      q("Plasmolysis occurs in a…", ["Hypotonic solution", "Hypertonic solution", "Isotonic solution", "Pure water"], 1, "Water leaves the cell into the stronger solution."),
      q("The space between the cell wall and shrunken protoplast is filled with…", ["Air", "External solution", "Cytoplasm", "Nothing"], 1, "The cell wall is freely permeable."),
      q("Rhoeo leaves are used because…", ["They are cheap", "The coloured cell sap is easy to see", "They have no wall", "They are dead"], 1, "Purple anthocyanin in the vacuole makes shrinkage visible."),
      q("Recovery of a plasmolysed cell in water is called…", ["Exosmosis", "Deplasmolysis", "Imbibition", "Wilting"], 1, "Endosmosis restores turgidity."),
    ],
  },
  {
    id: "puc1-mitosis", subject: "biology", icon: "🧅",
    title: L("Mitosis in onion root tip", "ಈರುಳ್ಳಿ ಬೇರಿನ ತುದಿಯಲ್ಲಿ ಸಮವಿಭಜನೆ"),
    aim: L("To study the stages of mitosis in onion root tip cells and calculate the mitotic index.", "ಈರುಳ್ಳಿ ಬೇರಿನ ತುದಿ ಕೋಶಗಳಲ್ಲಿ ಸಮವಿಭಜನೆಯ ಹಂತಗಳನ್ನು ಅಧ್ಯಯನ ಮಾಡಿ ಸಮವಿಭಜನಾ ಸೂಚ್ಯಂಕ ಲೆಕ್ಕಹಾಕುವುದು."),
    theory: L(
      "Root tips have actively dividing meristem cells. Mitosis has four stages: prophase (chromatin condenses into chromosomes), metaphase (chromosomes line up at the equator), anaphase (sister chromatids move to opposite poles) and telophase (two nuclei form, cell plate appears).\nMost cells are in interphase. Mitotic index = (number of dividing cells / total cells) × 100.",
      "ಬೇರಿನ ತುದಿಗಳಲ್ಲಿ ಸಕ್ರಿಯವಾಗಿ ವಿಭಜಿಸುವ ವರ್ಧನ ಅಂಗಾಂಶ ಕೋಶಗಳಿವೆ. ಸಮವಿಭಜನೆಯಲ್ಲಿ ನಾಲ್ಕು ಹಂತಗಳು: ಪ್ರೋಫೇಸ್ (ವರ್ಣತಂತುಗಳು ಸಾಂದ್ರಗೊಳ್ಳುತ್ತವೆ), ಮೆಟಾಫೇಸ್ (ವರ್ಣತಂತುಗಳು ಸಮಭಾಜಕದಲ್ಲಿ ಸಾಲಾಗುತ್ತವೆ), ಅನಾಫೇಸ್ (ಸೋದರ ವರ್ಣತಂತುಕಗಳು ವಿರುದ್ಧ ಧ್ರುವಗಳಿಗೆ ಸಾಗುತ್ತವೆ) ಮತ್ತು ಟೀಲೋಫೇಸ್ (ಎರಡು ಕೋಶಕೇಂದ್ರಗಳು, ಕೋಶ ಫಲಕ).\nಹೆಚ್ಚಿನ ಕೋಶಗಳು ಅಂತರಾವಸ್ಥೆಯಲ್ಲಿರುತ್ತವೆ. ಸಮವಿಭಜನಾ ಸೂಚ್ಯಂಕ = (ವಿಭಜಿಸುತ್ತಿರುವ ಕೋಶಗಳು / ಒಟ್ಟು ಕೋಶಗಳು) × 100."
    ),
    formula: "Mitotic index = dividing cells / total cells × 100",
    apparatus: L("Onion bulb, water, fixative, 1N HCl, acetocarmine, slide, cover slip, watch glass, microscope", "ಈರುಳ್ಳಿ ಗೆಡ್ಡೆ, ನೀರು, ಸ್ಥಿರೀಕರಣ ದ್ರವ, 1N HCl, ಅಸಿಟೋಕಾರ್ಮಿನ್, ಸ್ಲೈಡ್, ಕವರ್ ಸ್ಲಿಪ್, ವಾಚ್ ಗ್ಲಾಸ್, ಸೂಕ್ಷ್ಮದರ್ಶಕ"),
    procedure: [
      "Grow onion roots in water for 3–6 days; cut 1–2 cm root tips in the morning.",
      "Fix them, then hydrolyse in 1N HCl for a few minutes.",
      "Stain with acetocarmine, place on a slide and squash gently under a cover slip.",
      "Observe under the microscope and identify the stages.",
      "Count cells in each stage and calculate the mitotic index.",
    ],
    sim: "microscope",
    opts: { specimen: "mitosis", find: [
      { type: "prophase", l: L("a cell in prophase", "ಪ್ರೋಫೇಸ್ ಕೋಶ") }, { type: "metaphase", l: L("a cell in metaphase", "ಮೆಟಾಫೇಸ್ ಕೋಶ") },
      { type: "anaphase", l: L("a cell in anaphase", "ಅನಾಫೇಸ್ ಕೋಶ") }, { type: "telophase", l: L("a cell in telophase", "ಟೀಲೋಫೇಸ್ ಕೋಶ") },
    ] },
    controls: focusControls,
    x0: { field: 1 },
    compute: (p, x) => {
      const c = x.counts || {}; const T = x.total || 0;
      const div = (c.prophase || 0) + (c.metaphase || 0) + (c.anaphase || 0) + (c.telophase || 0);
      return { T, I: c.interphase || 0, Pr: c.prophase || 0, Me: c.metaphase || 0, An: c.anaphase || 0, Te: c.telophase || 0, MI: T ? (div / T) * 100 : 0, fieldNo: x.field || 1 };
    },
    readouts: [col("T", L("Total cells", "ಒಟ್ಟು ಕೋಶಗಳು"), "", 0), col("I", L("Interphase", "ಅಂತರಾವಸ್ಥೆ"), "", 0), col("MI", L("Mitotic index", "ಸಮವಿಭಜನಾ ಸೂಚ್ಯಂಕ"), "%", 1)],
    canRecord: (p) => Math.abs(p.focus - 50) < 12,
    table: [col("fieldNo", L("Field", "ಕ್ಷೇತ್ರ"), "", 0), col("I", L("Inter", "ಅಂತರ"), "", 0), col("Pr", L("Pro", "ಪ್ರೋ"), "", 0), col("Me", L("Meta", "ಮೆಟಾ"), "", 0), col("An", L("Ana", "ಅನಾ"), "", 0), col("Te", L("Telo", "ಟೀಲೋ"), "", 0), col("MI", L("MI", "MI"), "%", 1)],
    result: (rows) => L(`Mean mitotic index = ${mean(rows.map((r) => r.MI)).toFixed(1)} %`, `ಸರಾಸರಿ ಸಮವಿಭಜನಾ ಸೂಚ್ಯಂಕ = ${mean(rows.map((r) => r.MI)).toFixed(1)} %`),
    tip: L("Use the 40× objective to identify stages clearly — click the cell the target asks for.", "ಹಂತಗಳನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಗುರುತಿಸಲು 40× ಬಳಸಿ — ಕೇಳಿದ ಕೋಶವನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ."),
    quiz: [
      q("Chromosomes are best counted at…", ["Prophase", "Metaphase", "Anaphase", "Telophase"], 1, "They are most condensed and aligned at metaphase."),
      q("The stain used for onion root tips is…", ["Safranin", "Acetocarmine", "Iodine", "Eosin"], 1, "Acetocarmine stains chromosomes red."),
      q("Why is the root tip treated with HCl?", ["To stain", "To soften tissue / separate cells", "To kill bacteria", "To grow roots"], 1, "Hydrolysis dissolves the middle lamella."),
      q("Sister chromatids separate in…", ["Prophase", "Metaphase", "Anaphase", "Interphase"], 2, "Centromeres split at anaphase."),
    ],
  },
  (() => {
    const samples = [
      { k: "starch", l: L("Starch solution", "ಪಿಷ್ಟ ದ್ರಾವಣ"), color: "rgba(241,245,249,0.9)" },
      { k: "glucose", l: L("Glucose solution", "ಗ್ಲೂಕೋಸ್ ದ್ರಾವಣ"), color: "rgba(241,245,249,0.7)" },
      { k: "egg", l: L("Egg albumin", "ಮೊಟ್ಟೆಯ ಆಲ್ಬುಮಿನ್"), color: "rgba(254,252,232,0.9)" },
      { k: "oil", l: L("Groundnut oil", "ಕಡಲೆಕಾಯಿ ಎಣ್ಣೆ"), color: "rgba(253,224,71,0.6)" },
      { k: "milk", l: L("Milk (unknown)", "ಹಾಲು (ಅಜ್ಞಾತ)"), color: "rgba(255,255,255,0.95)" },
    ];
    const reagents = [
      { k: "iodine", l: L("Iodine solution", "ಅಯೋಡಿನ್ ದ್ರಾವಣ"), color: "rgba(146,64,14,0.9)" },
      { k: "benedict", l: L("Benedict's reagent + heat", "ಬೆನೆಡಿಕ್ಟ್ ಕಾರಕ + ಬಿಸಿ"), color: "rgba(59,130,246,0.9)" },
      { k: "biuret", l: L("Biuret (NaOH + CuSO₄)", "ಬೈಯುರೆಟ್ (NaOH + CuSO₄)"), color: "rgba(96,165,250,0.9)" },
      { k: "sudan", l: L("Sudan III", "ಸುಡಾನ್ III"), color: "rgba(220,38,38,0.9)" },
    ];
    const pos = {
      "starch|iodine": { c: "rgba(30,27,75,0.85)", obs: L("Blue-black colour", "ನೀಲಿ-ಕಪ್ಪು ಬಣ್ಣ"), inf: L("Starch present", "ಪಿಷ್ಟ ಇದೆ") },
      "glucose|benedict": { c: "rgba(234,88,12,0.6)", ppt: "#c2410c", heat: true, obs: L("Blue → green → yellow → brick-red ppt", "ನೀಲಿ → ಹಸಿರು → ಹಳದಿ → ಇಟ್ಟಿಗೆ-ಕೆಂಪು ಅವಕ್ಷೇಪ"), inf: L("Reducing sugar present", "ಅಪಕರ್ಷಕ ಸಕ್ಕರೆ ಇದೆ") },
      "egg|biuret": { c: "rgba(147,51,234,0.55)", obs: L("Violet / purple colour", "ನೇರಳೆ ಬಣ್ಣ"), inf: L("Protein present", "ಪ್ರೋಟೀನ್ ಇದೆ") },
      "oil|sudan": { c: "rgba(239,68,68,0.6)", obs: L("Red-stained oil layer floats on top", "ಕೆಂಪು ಬಣ್ಣದ ಎಣ್ಣೆ ಪದರ ಮೇಲೆ ತೇಲುತ್ತದೆ"), inf: L("Fat / oil present", "ಕೊಬ್ಬು / ಎಣ್ಣೆ ಇದೆ") },
      "milk|biuret": { c: "rgba(147,51,234,0.45)", obs: L("Violet colour", "ನೇರಳೆ ಬಣ್ಣ"), inf: L("Protein (casein) present", "ಪ್ರೋಟೀನ್ (ಕೇಸೀನ್) ಇದೆ") },
      "milk|benedict": { c: "rgba(234,179,8,0.55)", ppt: "#ea580c", heat: true, obs: L("Yellow-orange ppt", "ಹಳದಿ-ಕಿತ್ತಳೆ ಅವಕ್ಷೇಪ"), inf: L("Reducing sugar (lactose) present", "ಅಪಕರ್ಷಕ ಸಕ್ಕರೆ (ಲ್ಯಾಕ್ಟೋಸ್) ಇದೆ") },
      "milk|sudan": { c: "rgba(252,165,165,0.6)", obs: L("Red-stained fat droplets", "ಕೆಂಪು ಬಣ್ಣದ ಕೊಬ್ಬಿನ ಹನಿಗಳು"), inf: L("Fat present", "ಕೊಬ್ಬು ಇದೆ") },
      "milk|iodine": { c: "rgba(217,119,6,0.4)", obs: L("Brown/yellow (no blue-black)", "ಕಂದು/ಹಳದಿ (ನೀಲಿ-ಕಪ್ಪು ಇಲ್ಲ)"), inf: L("Starch absent", "ಪಿಷ್ಟ ಇಲ್ಲ") },
    };
    const react = {};
    samples.forEach((s) => reagents.forEach((r2) => {
      const k = `${s.k}|${r2.k}`;
      react[k] = pos[k] || { c: r2.k === "iodine" ? "rgba(217,119,6,0.4)" : r2.k === "benedict" ? "rgba(59,130,246,0.45)" : r2.k === "biuret" ? "rgba(96,165,250,0.45)" : s.color, heat: r2.k === "benedict", obs: L(r2.k === "iodine" ? "Remains brown/yellow" : r2.k === "benedict" ? "Remains blue" : r2.k === "biuret" ? "Remains blue" : "No red layer", r2.k === "iodine" ? "ಕಂದು/ಹಳದಿಯಾಗಿಯೇ ಉಳಿಯುತ್ತದೆ" : r2.k === "sudan" ? "ಕೆಂಪು ಪದರ ಇಲ್ಲ" : "ನೀಲಿಯಾಗಿಯೇ ಉಳಿಯುತ್ತದೆ"), inf: L("Negative test", "ನಕಾರಾತ್ಮಕ ಪರೀಕ್ಷೆ") };
    }));
    return {
      id: "puc1-food-tests", subject: "biology", icon: "🥛",
      title: L("Tests for starch, sugar, protein and fat", "ಪಿಷ್ಟ, ಸಕ್ಕರೆ, ಪ್ರೋಟೀನ್ ಮತ್ತು ಕೊಬ್ಬಿನ ಪರೀಕ್ಷೆಗಳು"),
      aim: L("To test for the presence of starch, reducing sugar, protein and fat in food samples.", "ಆಹಾರ ಮಾದರಿಗಳಲ್ಲಿ ಪಿಷ್ಟ, ಅಪಕರ್ಷಕ ಸಕ್ಕರೆ, ಪ್ರೋಟೀನ್ ಮತ್ತು ಕೊಬ್ಬಿನ ಇರುವಿಕೆ ಪರೀಕ್ಷಿಸುವುದು."),
      theory: L(
        "Iodine turns starch blue-black. Benedict's reagent (blue) gives a brick-red precipitate on heating with reducing sugars like glucose. The Biuret test gives a violet colour with proteins due to peptide bonds. Sudan III stains fats and oils red.\nThese tests let us find which biomolecules are present in a food.",
        "ಅಯೋಡಿನ್ ಪಿಷ್ಟವನ್ನು ನೀಲಿ-ಕಪ್ಪಾಗಿಸುತ್ತದೆ. ಬೆನೆಡಿಕ್ಟ್ ಕಾರಕ (ನೀಲಿ) ಗ್ಲೂಕೋಸ್‌ನಂತಹ ಅಪಕರ್ಷಕ ಸಕ್ಕರೆಗಳೊಂದಿಗೆ ಬಿಸಿ ಮಾಡಿದಾಗ ಇಟ್ಟಿಗೆ-ಕೆಂಪು ಅವಕ್ಷೇಪ ನೀಡುತ್ತದೆ. ಬೈಯುರೆಟ್ ಪರೀಕ್ಷೆ ಪೆಪ್ಟೈಡ್ ಬಂಧಗಳಿಂದಾಗಿ ಪ್ರೋಟೀನ್‌ಗಳೊಂದಿಗೆ ನೇರಳೆ ಬಣ್ಣ ನೀಡುತ್ತದೆ. ಸುಡಾನ್ III ಕೊಬ್ಬು ಮತ್ತು ಎಣ್ಣೆಗಳನ್ನು ಕೆಂಪಾಗಿಸುತ್ತದೆ.\nಈ ಪರೀಕ್ಷೆಗಳಿಂದ ಆಹಾರದಲ್ಲಿ ಯಾವ ಜೈವಿಕ ಅಣುಗಳಿವೆ ಎಂದು ತಿಳಿಯಬಹುದು."
      ),
      apparatus: L("Test tubes, water bath, iodine, Benedict's reagent, NaOH, CuSO₄, Sudan III, food samples", "ಪರೀಕ್ಷಾ ನಳಿಕೆಗಳು, ನೀರಿನ ತೊಟ್ಟಿ, ಅಯೋಡಿನ್, ಬೆನೆಡಿಕ್ಟ್ ಕಾರಕ, NaOH, CuSO₄, ಸುಡಾನ್ III, ಆಹಾರ ಮಾದರಿಗಳು"),
      procedure: [
        "Take 2 mL of each food sample in separate test tubes.",
        "Starch: add 2 drops of iodine.",
        "Sugar: add 2 mL Benedict's reagent and heat in a water bath for 5 minutes.",
        "Protein: add 2 mL NaOH and 2 drops of 1% CuSO₄.",
        "Fat: add Sudan III and shake; let it stand.",
      ],
      sim: "bench",
      opts: { samples, reagents, react },
      controls: benchControls(samples, reagents),
      canRecord: (p, r, x) => !!x.tested,
      table: benchCols,
      tip: L("Find out which nutrients are present in the unknown milk sample.", "ಅಜ್ಞಾತ ಹಾಲಿನ ಮಾದರಿಯಲ್ಲಿ ಯಾವ ಪೋಷಕಾಂಶಗಳಿವೆ ಎಂದು ಕಂಡುಹಿಡಿಯಿರಿ."),
      quiz: [
        q("Benedict's test is positive for…", ["Starch", "Reducing sugars", "Fats", "Proteins"], 1, "Glucose, fructose, lactose, maltose reduce Cu²⁺ to Cu₂O."),
        q("Biuret test detects…", ["Peptide bonds", "Glycosidic bonds", "Ester bonds", "Hydrogen bonds"], 0, "Cu²⁺ complexes with peptide bonds."),
        q("Iodine test is positive for…", ["Glucose", "Starch", "Oil", "Albumin"], 1, "Starch–iodine complex is blue-black."),
        q("Sudan III stains fats…", ["Blue", "Red", "Green", "Black"], 1, "Sudan III is a red lipid stain."),
      ],
    };
  })(),
  {
    id: "puc1-photosynthesis-rate", subject: "biology", icon: "💡",
    title: L("Rate of photosynthesis — light and CO₂", "ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆಯ ದರ — ಬೆಳಕು ಮತ್ತು CO₂"),
    aim: L("To study the effect of light intensity, light colour and CO₂ concentration on the rate of photosynthesis in Hydrilla.", "ಹೈಡ್ರಿಲ್ಲಾದಲ್ಲಿ ಬೆಳಕಿನ ತೀವ್ರತೆ, ಬಣ್ಣ ಮತ್ತು CO₂ ಸಾಂದ್ರತೆಯ ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ ದರದ ಮೇಲಿನ ಪರಿಣಾಮ ಅಧ್ಯಯನ."),
    theory: L(
      "Hydrilla is an aquatic plant that releases oxygen bubbles from its cut end during photosynthesis. The number of bubbles per minute is a measure of the rate.\nLight intensity falls as the square of distance from the lamp (I ∝ 1/d²). Rate increases with light and CO₂ (supplied as NaHCO₃) until another factor becomes limiting — Blackman's law of limiting factors. Green light is least effective because chlorophyll reflects it.",
      "ಹೈಡ್ರಿಲ್ಲಾ ಜಲಸಸ್ಯ; ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆಯ ವೇಳೆ ಕತ್ತರಿಸಿದ ತುದಿಯಿಂದ ಆಮ್ಲಜನಕದ ಗುಳ್ಳೆಗಳನ್ನು ಬಿಡುತ್ತದೆ. ನಿಮಿಷಕ್ಕೆ ಗುಳ್ಳೆಗಳ ಸಂಖ್ಯೆ ದರದ ಅಳತೆ.\nಬೆಳಕಿನ ತೀವ್ರತೆ ದೀಪದಿಂದ ದೂರದ ವರ್ಗದಂತೆ ಕಡಿಮೆಯಾಗುತ್ತದೆ (I ∝ 1/d²). ಬೆಳಕು ಮತ್ತು CO₂ (NaHCO₃ ರೂಪದಲ್ಲಿ) ಹೆಚ್ಚಿದಂತೆ ದರ ಹೆಚ್ಚುತ್ತದೆ, ಇನ್ನೊಂದು ಅಂಶ ಮಿತಿಗೊಳಿಸುವವರೆಗೆ — ಬ್ಲ್ಯಾಕ್‌ಮನ್‌ನ ಮಿತಿಗೊಳಿಸುವ ಅಂಶಗಳ ನಿಯಮ. ಹಸಿರು ಬೆಳಕು ಕಡಿಮೆ ಪರಿಣಾಮಕಾರಿ, ಏಕೆಂದರೆ ಹರಿತ್ತು ಅದನ್ನು ಪ್ರತಿಫಲಿಸುತ್ತದೆ."
    ),
    formula: "Light intensity ∝ 1 / d²",
    apparatus: L("Hydrilla twigs, beaker, funnel, test tube, NaHCO₃, lamp, coloured filters, stopwatch, metre scale", "ಹೈಡ್ರಿಲ್ಲಾ ಕೊಂಬೆಗಳು, ಬೀಕರ್, ಆಲಿಕೆ, ಪರೀಕ್ಷಾ ನಳಿಕೆ, NaHCO₃, ದೀಪ, ಬಣ್ಣದ ಫಿಲ್ಟರ್‌ಗಳು, ಸ್ಟಾಪ್‌ವಾಚ್, ಮೀಟರ್ ಅಳತೆಪಟ್ಟಿ"),
    procedure: [
      "Place Hydrilla under an inverted funnel in a beaker of water with a pinch of NaHCO₃.",
      "Keep a lamp at a known distance; wait 5 minutes for the plant to adjust.",
      "Count the bubbles released in one minute; repeat three times.",
      "Change the distance (or filter / NaHCO₃) and repeat.",
      "Plot rate against distance or light intensity.",
    ],
    sim: "photosynthesis",
    controls: [
      sl("d", L("Lamp distance", "ದೀಪದ ದೂರ"), 10, 50, 5, 20, "cm"),
      sl("co2", L("NaHCO₃ added", "ಸೇರಿಸಿದ NaHCO₃"), 0, 2, 0.25, 1, "g"),
      sel("light", L("Light colour", "ಬೆಳಕಿನ ಬಣ್ಣ"), [opt("white", "White", "ಬಿಳಿ"), opt("red", "Red", "ಕೆಂಪು"), opt("blue", "Blue", "ನೀಲಿ"), opt("green", "Green", "ಹಸಿರು")], "white"),
    ],
    compute: (p, x) => {
      const I = Math.pow(20 / p.d, 2), cf = { white: 1, red: 0.9, blue: 0.8, green: 0.25 }[p.light];
      return { rateTrue: 70 * (I / (I + 0.6)) * ((p.co2 + 0.1) / (p.co2 + 0.5)) * cf, count: x.count, relI: 100 / (p.d * p.d) * 100, lightName: L(p.light) };
    },
    readouts: [col("count", L("Bubbles per minute", "ನಿಮಿಷಕ್ಕೆ ಗುಳ್ಳೆಗಳು"), "", 0), col("relI", L("Relative light intensity (100/d²)", "ಸಾಪೇಕ್ಷ ಬೆಳಕಿನ ತೀವ್ರತೆ"), "", 2)],
    canRecord: (p, r, x) => x.count != null,
    table: [col("d", L("Distance", "ದೂರ"), "cm", 0), col("lightName", L("Light", "ಬೆಳಕು")), col("co2", L("NaHCO₃", "NaHCO₃"), "g", 2), col("relI", L("Rel. intensity", "ಸಾಪೇಕ್ಷ ತೀವ್ರತೆ"), "", 2), col("count", L("Bubbles/min", "ಗುಳ್ಳೆ/ನಿ."), "", 0)],
    graph: { x: "d", y: "count", fit: "curve", note: L("Rate falls as the lamp is moved away.", "ದೀಪ ದೂರ ಸರಿದಂತೆ ದರ ಕಡಿಮೆಯಾಗುತ್ತದೆ.") },
    tip: L("Keep NaHCO₃ = 0 and see how the rate is limited even in bright light.", "NaHCO₃ = 0 ಇಟ್ಟು ಪ್ರಕಾಶಮಾನ ಬೆಳಕಿನಲ್ಲೂ ದರ ಹೇಗೆ ಮಿತಿಗೊಳ್ಳುತ್ತದೆ ನೋಡಿ."),
    quiz: [
      q("Gas released by Hydrilla during photosynthesis is…", ["CO₂", "O₂", "N₂", "H₂"], 1, "Oxygen comes from splitting of water."),
      q("NaHCO₃ is added to the water to…", ["Kill microbes", "Supply CO₂", "Change colour", "Provide light"], 1, "It releases CO₂ in water."),
      q("If the lamp distance is doubled, light intensity becomes…", ["Half", "One-fourth", "Double", "Same"], 1, "I ∝ 1/d²."),
      q("Least photosynthesis occurs in…", ["Red light", "Blue light", "Green light", "White light"], 2, "Green is reflected by chlorophyll."),
    ],
  },
  {
    id: "puc1-enzyme-amylase", subject: "biology", icon: "🧬",
    title: L("Effect of temperature and pH on salivary amylase", "ಲಾಲಾರಸ ಅಮೈಲೇಸ್ ಮೇಲೆ ತಾಪ ಮತ್ತು pH ಪರಿಣಾಮ"),
    aim: L("To study the effect of temperature and pH on the activity of salivary amylase on starch.", "ಪಿಷ್ಟದ ಮೇಲೆ ಲಾಲಾರಸ ಅಮೈಲೇಸ್ ಚಟುವಟಿಕೆಯ ಮೇಲೆ ತಾಪ ಮತ್ತು pH ಪರಿಣಾಮ ಅಧ್ಯಯನ."),
    theory: L(
      "Salivary amylase breaks down starch into maltose. A drop of the mixture is tested with iodine every minute. When starch is fully digested, iodine no longer gives a blue colour — this is the achromic point.\nThe enzyme works fastest at its optimum (about 37 °C and pH 6.8). Low temperature slows it; high temperature (above ~50 °C) denatures the enzyme permanently. The rate can be taken as 1/achromic time.",
      "ಲಾಲಾರಸ ಅಮೈಲೇಸ್ ಪಿಷ್ಟವನ್ನು ಮಾಲ್ಟೋಸ್ ಆಗಿ ವಿಭಜಿಸುತ್ತದೆ. ಪ್ರತಿ ನಿಮಿಷ ಮಿಶ್ರಣದ ಒಂದು ಹನಿಯನ್ನು ಅಯೋಡಿನ್‌ನಿಂದ ಪರೀಕ್ಷಿಸಲಾಗುತ್ತದೆ. ಪಿಷ್ಟ ಸಂಪೂರ್ಣ ಜೀರ್ಣವಾದಾಗ ಅಯೋಡಿನ್ ನೀಲಿ ಬಣ್ಣ ನೀಡುವುದಿಲ್ಲ — ಇದು ವರ್ಣರಹಿತ ಬಿಂದು.\nಕಿಣ್ವವು ಅನುಕೂಲತಮ ಸ್ಥಿತಿಯಲ್ಲಿ (ಸುಮಾರು 37 °C ಮತ್ತು pH 6.8) ವೇಗವಾಗಿ ಕೆಲಸ ಮಾಡುತ್ತದೆ. ಕಡಿಮೆ ತಾಪ ಅದನ್ನು ನಿಧಾನಗೊಳಿಸುತ್ತದೆ; ಹೆಚ್ಚು ತಾಪ (~50 °C ಮೇಲೆ) ಕಿಣ್ವವನ್ನು ಶಾಶ್ವತವಾಗಿ ವಿಕೃತಗೊಳಿಸುತ್ತದೆ."
    ),
    formula: "Rate ∝ 1 / (time to achromic point)",
    apparatus: L("1% starch, saliva (amylase), iodine, spot tile, test tubes, water baths at different temperatures, buffers, stopwatch", "1% ಪಿಷ್ಟ, ಲಾಲಾರಸ (ಅಮೈಲೇಸ್), ಅಯೋಡಿನ್, ಸ್ಪಾಟ್ ಟೈಲ್, ಪರೀಕ್ಷಾ ನಳಿಕೆಗಳು, ವಿವಿಧ ತಾಪದ ನೀರಿನ ತೊಟ್ಟಿಗಳು, ಬಫರ್‌ಗಳು, ಸ್ಟಾಪ್‌ವಾಚ್"),
    procedure: [
      "Put drops of iodine in each depression of a spot tile.",
      "Keep starch and diluted saliva separately at the chosen temperature for 5 minutes.",
      "Mix them and start the stopwatch.",
      "Every minute, put one drop of the mixture into the next iodine spot.",
      "Note the time when the iodine no longer turns blue (achromic point). Repeat at other temperatures / pH.",
    ],
    sim: "enzyme",
    controls: [sl("temp", L("Temperature", "ತಾಪ"), 0, 80, 5, 37, "°C"), sl("pH", L("pH (buffer)", "pH (ಬಫರ್)"), 4, 10, 0.5, 7, "")],
    x0: { tAch: null },
    compute: (p, x) => {
      const fT = p.temp <= 40 ? Math.exp(-Math.pow((p.temp - 37) / 16, 2)) : Math.exp(-Math.pow((p.temp - 37) / 8, 2));
      const fpH = Math.exp(-Math.pow((p.pH - 6.8) / 1.3, 2));
      const k = 0.55 * fT * fpH, tAchTrue = k > 0 ? Math.log(10) / k : Infinity;
      return { k, tAchTrue: tAchTrue <= 29 ? tAchTrue : null, tAch: x.tAch, rate: x.tAch ? 100 / x.tAch : null };
    },
    readouts: [col("tAch", L("Achromic point", "ವರ್ಣರಹಿತ ಬಿಂದು"), "min", 1), col("rate", L("Rate (100/t)", "ದರ (100/t)"), "", 1)],
    canRecord: (p, r, x) => !!x.tAch,
    table: [col("temp", L("Temp", "ತಾಪ"), "°C", 0), col("pH", L("pH", "pH"), "", 1), col("tAch", L("Achromic time", "ವರ್ಣರಹಿತ ಸಮಯ"), "min", 1), col("rate", L("Rate", "ದರ"), "", 1)],
    graph: { x: "temp", y: "rate", fit: "curve", note: L("Rate rises to an optimum then falls sharply.", "ದರ ಅನುಕೂಲತಮದವರೆಗೆ ಏರಿ ನಂತರ ತೀವ್ರವಾಗಿ ಇಳಿಯುತ್ತದೆ.") },
    tip: L("At 70 °C the iodine never stops turning blue. Why?", "70 °C ನಲ್ಲಿ ಅಯೋಡಿನ್ ಯಾವಾಗಲೂ ನೀಲಿಯಾಗುತ್ತದೆ. ಏಕೆ?"),
    quiz: [
      q("The achromic point is reached when…", ["Iodine turns blue-black", "Iodine no longer gives blue colour", "Starch is formed", "pH is 7"], 1, "All starch has been digested."),
      q("Optimum temperature of human enzymes is about…", ["0 °C", "25 °C", "37 °C", "80 °C"], 2, "Body temperature."),
      q("At very high temperature enzymes are…", ["Activated", "Denatured", "Multiplied", "Unchanged"], 1, "The protein loses its 3-D shape."),
      q("Salivary amylase converts starch to…", ["Glucose", "Maltose", "Sucrose", "Fat"], 1, "Amylase produces maltose."),
    ],
  },
];
