import { L, mean, q, sel, opt, sl, col, deg, nature, noChange, benchCols, benchControls, focusControls, uv, prism } from "./helpers.js";

const R2 = (v) => Math.round(v * 100) / 100;

export default [
  /* ============================ PHYSICS ============================ */
  {
    id: "sslc-concave-mirror", subject: "physics", icon: "🪞",
    title: L("Focal length of a concave mirror", "ನಿಮ್ನ ದರ್ಪಣದ ಸಂಗಮ ದೂರ"),
    aim: L("To find the focal length of a concave mirror by obtaining real images of an object on a screen.", "ಪರದೆಯ ಮೇಲೆ ವಸ್ತುವಿನ ನೈಜ ಪ್ರತಿಬಿಂಬ ಪಡೆಯುವ ಮೂಲಕ ನಿಮ್ನ ದರ್ಪಣದ ಸಂಗಮ ದೂರ ಕಂಡುಹಿಡಿಯುವುದು."),
    theory: L(
      "A concave mirror converges parallel rays to its principal focus F. When an object is placed beyond F, the mirror forms a real, inverted image that can be caught on a screen.\nThe object distance u, image distance v and focal length f are related by the mirror formula. Moving the object closer to F pushes the image farther away.",
      "ನಿಮ್ನ ದರ್ಪಣವು ಸಮಾಂತರ ಕಿರಣಗಳನ್ನು ಪ್ರಧಾನ ಸಂಗಮ ಬಿಂದು F ನಲ್ಲಿ ಕೇಂದ್ರೀಕರಿಸುತ್ತದೆ. ವಸ್ತುವನ್ನು F ಗಿಂತ ದೂರ ಇಟ್ಟಾಗ ದರ್ಪಣವು ಪರದೆಯ ಮೇಲೆ ಹಿಡಿಯಬಹುದಾದ ನೈಜ, ತಲೆಕೆಳಗಾದ ಪ್ರತಿಬಿಂಬವನ್ನು ಉಂಟುಮಾಡುತ್ತದೆ.\nವಸ್ತು ದೂರ u, ಪ್ರತಿಬಿಂಬ ದೂರ v ಮತ್ತು ಸಂಗಮ ದೂರ f ಗಳು ದರ್ಪಣ ಸೂತ್ರದಿಂದ ಸಂಬಂಧಿಸಲ್ಪಟ್ಟಿವೆ. ವಸ್ತುವನ್ನು F ಹತ್ತಿರ ತಂದಂತೆ ಪ್ರತಿಬಿಂಬ ದೂರ ಸರಿಯುತ್ತದೆ."
    ),
    formula: "1/f = 1/u + 1/v\nf = uv / (u + v)",
    apparatus: L("Concave mirror, mirror stand, candle (object), white screen, metre scale / optical bench", "ನಿಮ್ನ ದರ್ಪಣ, ದರ್ಪಣ ಸ್ಟ್ಯಾಂಡ್, ಮೇಣದಬತ್ತಿ (ವಸ್ತು), ಬಿಳಿ ಪರದೆ, ಮೀಟರ್ ಅಳತೆಪಟ್ಟಿ / ದೃಗ್ವೈಜ್ಞಾನಿಕ ಬೆಂಚ್"),
    procedure: [
      "Fix the concave mirror on the stand at one end of the optical bench.",
      "Place the lighted candle (object) at a distance u in front of the mirror, beyond the focus.",
      "Move the screen back and forth until a sharp, inverted image of the flame appears on it.",
      "Note the distance of the screen from the mirror — this is v.",
      "Repeat for at least three different object distances and calculate f for each.",
      "Take the mean of all values of f.",
    ],
    sim: "optics", opts: { kind: "concave", f: 15 },
    controls: [sl("u", L("Object distance u", "ವಸ್ತು ದೂರ u"), 20, 60, 1, 30, "cm"), sl("s", L("Screen distance from mirror", "ದರ್ಪಣದಿಂದ ಪರದೆಯ ದೂರ"), 15, 70, 0.5, 45, "cm")],
    compute: (p) => uv(p.u, 15, p.s),
    readouts: [col("sharpPct", L("Image sharpness", "ಪ್ರತಿಬಿಂಬದ ಸ್ಪಷ್ಟತೆ"), "%", 0), col("v", L("Image distance v", "ಪ್ರತಿಬಿಂಬ ದೂರ v"), "cm", 1)],
    canRecord: (p, r) => r.sharp > 0.9,
    table: [col("u", L("u", "u"), "cm", 1), col("v", L("v", "v"), "cm", 1), col("f", L("f = uv/(u+v)", "f = uv/(u+v)"), "cm", 2)],
    graph: { x: "u", y: "v", fit: "curve", fromZero: false, note: L("As u decreases towards f, v increases rapidly.", "u ಯು f ಕಡೆಗೆ ಕಡಿಮೆಯಾದಂತೆ v ವೇಗವಾಗಿ ಹೆಚ್ಚುತ್ತದೆ.") },
    result: (rows) => { const f = mean(rows.map((r) => r.f)); return L(`Mean focal length of the concave mirror f = ${f.toFixed(1)} cm`, `ನಿಮ್ನ ದರ್ಪಣದ ಸರಾಸರಿ ಸಂಗಮ ದೂರ f = ${f.toFixed(1)} cm`); },
    tip: L("Place the object exactly at 30 cm (= 2f). Where does the image form, and is it the same size?", "ವಸ್ತುವನ್ನು ನಿಖರವಾಗಿ 30 cm (= 2f) ನಲ್ಲಿ ಇಡಿ. ಪ್ರತಿಬಿಂಬ ಎಲ್ಲಿ ಉಂಟಾಗುತ್ತದೆ, ಅದೇ ಗಾತ್ರವೇ?"),
    quiz: [
      q("Which type of image does a concave mirror form on a screen?", ["Virtual and erect", "Real and inverted", "Virtual and inverted", "Real and erect"], 1, "Only real images can be caught on a screen; real images from a concave mirror are inverted."),
      q("If the object is at C (2f), the image is formed at…", ["F", "Between F and C", "C", "Beyond C"], 2, "At C the image is real, inverted and of the same size, also at C."),
      q("When the object is placed between F and the pole P, the image is…", ["Real and diminished", "Virtual, erect and magnified", "At infinity", "Real and same size"], 1, "Inside F a concave mirror acts like a magnifying (shaving) mirror."),
      q("u = 30 cm and v = 30 cm. The focal length is…", ["60 cm", "30 cm", "15 cm", "7.5 cm"], 2, "f = uv/(u+v) = 900/60 = 15 cm."),
    ],
  },
  {
    id: "sslc-convex-lens", subject: "physics", icon: "🔍",
    title: L("Focal length of a convex lens", "ಪೀನ ಮಸೂರದ ಸಂಗಮ ದೂರ"),
    aim: L("To find the focal length of a convex lens using the u–v method.", "u–v ವಿಧಾನದಿಂದ ಪೀನ ಮಸೂರದ ಸಂಗಮ ದೂರ ಕಂಡುಹಿಡಿಯುವುದು."),
    theory: L(
      "A convex (converging) lens bends parallel light rays to meet at its principal focus. An object kept beyond the focus forms a real, inverted image on the other side of the lens.\nUsing magnitudes of u and v (real-is-positive), f = uv/(u+v). The image moves away from the lens as the object comes closer to F.",
      "ಪೀನ (ಸಂಗಮಿಸುವ) ಮಸೂರವು ಸಮಾಂತರ ಬೆಳಕಿನ ಕಿರಣಗಳನ್ನು ಪ್ರಧಾನ ಸಂಗಮ ಬಿಂದುವಿನಲ್ಲಿ ಸೇರಿಸುತ್ತದೆ. ಸಂಗಮ ಬಿಂದುವಿಗಿಂತ ದೂರದ ವಸ್ತುವು ಮಸೂರದ ಇನ್ನೊಂದು ಬದಿಯಲ್ಲಿ ನೈಜ, ತಲೆಕೆಳಗಾದ ಪ್ರತಿಬಿಂಬ ಉಂಟುಮಾಡುತ್ತದೆ.\nu ಮತ್ತು v ಗಳ ಪರಿಮಾಣ ಬಳಸಿ f = uv/(u+v). ವಸ್ತು F ಹತ್ತಿರ ಬಂದಂತೆ ಪ್ರತಿಬಿಂಬ ಮಸೂರದಿಂದ ದೂರ ಸರಿಯುತ್ತದೆ."
    ),
    formula: "1/f = 1/u + 1/v  (magnitudes)\nP = 1/f (in metres) dioptre",
    apparatus: L("Convex lens, lens holder, candle, screen, optical bench / metre scale", "ಪೀನ ಮಸೂರ, ಮಸೂರ ಹಿಡಿಕೆ, ಮೇಣದಬತ್ತಿ, ಪರದೆ, ದೃಗ್ವೈಜ್ಞಾನಿಕ ಬೆಂಚ್ / ಮೀಟರ್ ಅಳತೆಪಟ್ಟಿ"),
    procedure: [
      "Mount the convex lens vertically on the bench.",
      "Place the candle at a known distance u on one side of the lens (beyond F).",
      "On the other side, move the screen until a sharp inverted image is obtained.",
      "Measure v, the distance of the screen from the lens.",
      "Repeat for different values of u and find f each time; take the mean.",
    ],
    sim: "optics", opts: { kind: "convex", f: 12 },
    controls: [sl("u", L("Object distance u", "ವಸ್ತು ದೂರ u"), 8, 50, 1, 24, "cm"), sl("s", L("Screen distance from lens", "ಮಸೂರದಿಂದ ಪರದೆಯ ದೂರ"), 12, 70, 0.5, 35, "cm")],
    compute: (p) => uv(p.u, 12, p.s),
    readouts: [col("sharpPct", L("Image sharpness", "ಪ್ರತಿಬಿಂಬದ ಸ್ಪಷ್ಟತೆ"), "%", 0), col("v", L("Image distance v", "ಪ್ರತಿಬಿಂಬ ದೂರ v"), "cm", 1)],
    canRecord: (p, r) => r.sharp > 0.9,
    table: [col("u", L("u", "u"), "cm", 1), col("v", L("v", "v"), "cm", 1), col("f", L("f", "f"), "cm", 2)],
    graph: { x: "u", y: "v", fit: "curve", fromZero: false },
    result: (rows) => { const f = mean(rows.map((r) => r.f)); return L(`Focal length f = ${f.toFixed(1)} cm, power P = ${(100 / f).toFixed(1)} D`, `ಸಂಗಮ ದೂರ f = ${f.toFixed(1)} cm, ಸಾಮರ್ಥ್ಯ P = ${(100 / f).toFixed(1)} D`); },
    tip: L("Set u below 12 cm. Why can't you get any image on the screen now?", "u ಅನ್ನು 12 cm ಗಿಂತ ಕಡಿಮೆ ಮಾಡಿ. ಈಗ ಪರದೆಯ ಮೇಲೆ ಪ್ರತಿಬಿಂಬ ಏಕೆ ಬರುವುದಿಲ್ಲ?"),
    quiz: [
      q("The SI unit of power of a lens is…", ["Watt", "Dioptre", "Metre", "Joule"], 1, "P = 1/f with f in metres; unit dioptre (D)."),
      q("A convex lens of f = 12 cm forms a virtual image when the object is…", ["Beyond 2F", "At 2F", "Between F and O", "At F"], 2, "Inside F a convex lens works as a magnifying glass, giving a virtual erect image."),
      q("Power of a convex lens of focal length 25 cm is…", ["+4 D", "−4 D", "+0.25 D", "+25 D"], 0, "P = 1/0.25 m = +4 D (positive for convex)."),
      q("Which ray passes undeviated through a lens?", ["Ray parallel to axis", "Ray through optical centre", "Ray through F", "No ray"], 1, "A ray through the optical centre goes straight through."),
    ],
  },
  {
    id: "sslc-glass-slab", subject: "physics", icon: "🧊",
    title: L("Refraction through a glass slab", "ಗಾಜಿನ ಚಪ್ಪಡಿಯ ಮೂಲಕ ವಕ್ರೀಭವನ"),
    aim: L("To trace the path of a ray of light through a rectangular glass slab and measure the angles of incidence, refraction and emergence.", "ಆಯತಾಕಾರದ ಗಾಜಿನ ಚಪ್ಪಡಿಯ ಮೂಲಕ ಬೆಳಕಿನ ಕಿರಣದ ಪಥವನ್ನು ಗುರುತಿಸಿ ಆಪಾತ, ವಕ್ರೀಭವನ ಮತ್ತು ನಿರ್ಗಮನ ಕೋನಗಳನ್ನು ಅಳೆಯುವುದು."),
    theory: L(
      "When light goes from air into glass it slows down and bends towards the normal; when it comes out it bends away from the normal.\nFor a parallel-sided slab the emergent ray is parallel to the incident ray (e = i) but is shifted sideways — this is called lateral displacement. Snell's law: sin i / sin r = n (refractive index of glass ≈ 1.5).",
      "ಬೆಳಕು ಗಾಳಿಯಿಂದ ಗಾಜಿಗೆ ಹೋದಾಗ ನಿಧಾನವಾಗಿ ಲಂಬದ ಕಡೆಗೆ ಬಾಗುತ್ತದೆ; ಹೊರಬಂದಾಗ ಲಂಬದಿಂದ ದೂರ ಬಾಗುತ್ತದೆ.\nಸಮಾಂತರ ಮುಖಗಳ ಚಪ್ಪಡಿಯಲ್ಲಿ ನಿರ್ಗಮನ ಕಿರಣ ಆಪಾತ ಕಿರಣಕ್ಕೆ ಸಮಾಂತರವಾಗಿರುತ್ತದೆ (e = i), ಆದರೆ ಪಕ್ಕಕ್ಕೆ ಸರಿಯುತ್ತದೆ — ಇದನ್ನು ಪಾರ್ಶ್ವ ಸ್ಥಾನಪಲ್ಲಟ ಎನ್ನುತ್ತಾರೆ. ಸ್ನೆಲ್ ನಿಯಮ: sin i / sin r = n (ಗಾಜಿನ ವಕ್ರೀಭವನ ಸೂಚ್ಯಂಕ ≈ 1.5)."
    ),
    formula: "n = sin i / sin r\nd = t·sin(i − r) / cos r",
    apparatus: L("Rectangular glass slab, drawing board, white paper, pins, protractor, scale, pencil", "ಆಯತಾಕಾರದ ಗಾಜಿನ ಚಪ್ಪಡಿ, ಡ್ರಾಯಿಂಗ್ ಬೋರ್ಡ್, ಬಿಳಿ ಕಾಗದ, ಪಿನ್‌ಗಳು, ಕೋನಮಾಪಕ, ಅಳತೆಪಟ್ಟಿ, ಪೆನ್ಸಿಲ್"),
    procedure: [
      "Fix a white sheet on the drawing board and place the glass slab on it. Trace its outline.",
      "Draw a normal at a point on the top edge and an incident ray at angle i.",
      "Fix two pins P1 and P2 on the incident ray.",
      "Looking through the opposite face, fix pins P3 and P4 so that they appear in line with images of P1 and P2.",
      "Remove the slab, join the points and measure r and e with a protractor.",
      "Repeat for different angles of incidence.",
    ],
    sim: "refraction", opts: { kind: "slab", n: 1.5 },
    controls: [sl("i", L("Angle of incidence i", "ಆಪಾತ ಕೋನ i"), 10, 80, 1, 40, "°")],
    compute: (p) => {
      const n = 1.5, r = Math.asin(Math.sin(p.i * deg) / n) / deg, tk = 6;
      return { r, e: p.i, d: (tk * Math.sin((p.i - r) * deg)) / Math.cos(r * deg), sini: Math.sin(p.i * deg), sinr: Math.sin(r * deg), nCalc: Math.sin(p.i * deg) / Math.sin(r * deg) };
    },
    readouts: [col("r", L("Angle of refraction r", "ವಕ್ರೀಭವನ ಕೋನ r"), "°", 1), col("e", L("Angle of emergence e", "ನಿರ್ಗಮನ ಕೋನ e"), "°", 1), col("d", L("Lateral shift", "ಪಾರ್ಶ್ವ ಸ್ಥಾನಪಲ್ಲಟ"), "cm", 2), col("nCalc", L("sin i / sin r", "sin i / sin r"), "", 3)],
    table: [col("i", L("i", "i"), "°", 0), col("r", L("r", "r"), "°", 1), col("e", L("e", "e"), "°", 1), col("sini", L("sin i", "sin i"), "", 3), col("sinr", L("sin r", "sin r"), "", 3), col("d", L("Shift", "ಸ್ಥಾನಪಲ್ಲಟ"), "cm", 2)],
    graph: { x: "sinr", y: "sini", fit: "origin", slopeMeans: L("slope = refractive index n", "ಇಳಿಜಾರು = ವಕ್ರೀಭವನ ಸೂಚ್ಯಂಕ n") },
    result: (rows) => L(`Angle of emergence equals angle of incidence; n = ${mean(rows.map((r) => r.sini / r.sinr)).toFixed(2)}`, `ನಿರ್ಗಮನ ಕೋನ = ಆಪಾತ ಕೋನ; n = ${mean(rows.map((r) => r.sini / r.sinr)).toFixed(2)}`),
    tip: L("Increase i from 10° to 80°. Does the sideways shift of the ray increase or decrease?", "i ಅನ್ನು 10° ರಿಂದ 80° ಗೆ ಹೆಚ್ಚಿಸಿ. ಕಿರಣದ ಪಾರ್ಶ್ವ ಸ್ಥಾನಪಲ್ಲಟ ಹೆಚ್ಚುತ್ತದೆಯೇ ಕಡಿಮೆಯಾಗುತ್ತದೆಯೇ?"),
    quiz: [
      q("When light enters glass from air it bends…", ["Away from the normal", "Towards the normal", "Does not bend", "Along the surface"], 1, "Glass is optically denser, so light slows and bends towards the normal."),
      q("For a glass slab, the emergent ray is…", ["Perpendicular to the incident ray", "Parallel to the incident ray", "Along the normal", "Reflected back"], 1, "Both faces are parallel, so e = i."),
      q("Refractive index of glass is about…", ["1.0", "1.33", "1.5", "2.42"], 2, "Water ≈ 1.33, glass ≈ 1.5, diamond ≈ 2.42."),
      q("If i = 0°, the ray…", ["Bends a lot", "Goes straight without bending", "Is totally reflected", "Splits into colours"], 1, "Along the normal there is no bending."),
    ],
  },
  {
    id: "sslc-prism", subject: "physics", icon: "🌈",
    title: L("Refraction and dispersion through a prism", "ಪಟ್ಟಕದ ಮೂಲಕ ವಕ್ರೀಭವನ ಮತ್ತು ವಿಭಜನೆ"),
    aim: L("To trace the path of light through a glass prism, measure the angle of deviation and observe dispersion of white light.", "ಗಾಜಿನ ಪಟ್ಟಕದ ಮೂಲಕ ಬೆಳಕಿನ ಪಥ ಗುರುತಿಸಿ, ವಿಚಲನ ಕೋನ ಅಳೆದು ಬಿಳಿ ಬೆಳಕಿನ ವಿಭಜನೆಯನ್ನು ವೀಕ್ಷಿಸುವುದು."),
    theory: L(
      "A prism has two inclined refracting faces. Light bends towards the base at both faces, so the emergent ray is deviated from its original direction by the angle of deviation δ = i + e − A.\nWhite light is made of seven colours. Each colour has a slightly different refractive index, so they bend by different amounts and spread out into a spectrum (VIBGYOR). Violet bends the most, red the least.",
      "ಪಟ್ಟಕಕ್ಕೆ ಎರಡು ಓರೆಯಾದ ವಕ್ರೀಭವನ ಮುಖಗಳಿವೆ. ಎರಡೂ ಮುಖಗಳಲ್ಲಿ ಬೆಳಕು ತಳದ ಕಡೆಗೆ ಬಾಗುವುದರಿಂದ, ನಿರ್ಗಮನ ಕಿರಣವು ಮೂಲ ದಿಕ್ಕಿನಿಂದ δ = i + e − A ಕೋನದಷ್ಟು ವಿಚಲಿತವಾಗುತ್ತದೆ.\nಬಿಳಿ ಬೆಳಕು ಏಳು ಬಣ್ಣಗಳಿಂದಾಗಿದೆ. ಪ್ರತಿ ಬಣ್ಣಕ್ಕೆ ಸ್ವಲ್ಪ ಬೇರೆ ವಕ್ರೀಭವನ ಸೂಚ್ಯಂಕ ಇರುವುದರಿಂದ ಅವು ಬೇರೆ ಬೇರೆ ಪ್ರಮಾಣದಲ್ಲಿ ಬಾಗಿ ರೋಹಿತ (VIBGYOR) ಉಂಟಾಗುತ್ತದೆ. ನೇರಳೆ ಹೆಚ್ಚು, ಕೆಂಪು ಕಡಿಮೆ ಬಾಗುತ್ತದೆ."
    ),
    formula: "δ = i + e − A\nr₁ + r₂ = A",
    apparatus: L("Glass prism, drawing board, white paper, pins, protractor, white light source (for dispersion)", "ಗಾಜಿನ ಪಟ್ಟಕ, ಡ್ರಾಯಿಂಗ್ ಬೋರ್ಡ್, ಬಿಳಿ ಕಾಗದ, ಪಿನ್‌ಗಳು, ಕೋನಮಾಪಕ, ಬಿಳಿ ಬೆಳಕಿನ ಮೂಲ"),
    procedure: [
      "Place the prism on a white sheet and trace its triangular outline.",
      "Draw a normal on one face and an incident ray at angle i; fix pins P1, P2.",
      "Looking through the other face, fix P3, P4 in line with the images of P1, P2.",
      "Join the points, extend the incident and emergent rays and measure δ.",
      "Use a narrow beam of white light to observe the spectrum on a screen.",
    ],
    sim: "refraction", opts: { kind: "prism", n: 1.52, dispersion: true },
    controls: [sl("i", L("Angle of incidence i", "ಆಪಾತ ಕೋನ i"), 30, 75, 1, 45, "°"), sel("light", L("Light", "ಬೆಳಕು"), [opt("red", "Red (single colour)", "ಕೆಂಪು (ಏಕ ಬಣ್ಣ)"), opt("white", "White light", "ಬಿಳಿ ಬೆಳಕು")], "red")],
    compute: (p) => prism(p.i, 1.52),
    canRecord: (p, r) => !r.tir,
    readouts: [col("e", L("Angle of emergence e", "ನಿರ್ಗಮನ ಕೋನ e"), "°", 1), col("dev", L("Deviation δ", "ವಿಚಲನ δ"), "°", 1)],
    table: [col("i", L("i", "i"), "°", 0), col("e", L("e", "e"), "°", 1), col("dev", L("δ", "δ"), "°", 1)],
    graph: { x: "i", y: "dev", fit: "curve", fromZero: false, note: L("δ first decreases, reaches a minimum, then increases.", "δ ಮೊದಲು ಕಡಿಮೆಯಾಗಿ, ಕನಿಷ್ಠ ತಲುಪಿ ನಂತರ ಹೆಚ್ಚುತ್ತದೆ.") },
    result: (rows) => { const m = rows.reduce((a, b) => (b.dev < a.dev ? b : a)); return L(`Smallest deviation recorded δ = ${m.dev.toFixed(1)}° at i = ${m.i}°`, `ದಾಖಲಾದ ಕನಿಷ್ಠ ವಿಚಲನ δ = ${m.dev.toFixed(1)}°, i = ${m.i}° ನಲ್ಲಿ`); },
    tip: L("Switch to white light. Which colour bends the most?", "ಬಿಳಿ ಬೆಳಕಿಗೆ ಬದಲಿಸಿ. ಯಾವ ಬಣ್ಣ ಹೆಚ್ಚು ಬಾಗುತ್ತದೆ?"),
    quiz: [
      q("Splitting of white light into its colours is called…", ["Reflection", "Dispersion", "Scattering", "Diffraction"], 1, "A prism disperses white light into VIBGYOR."),
      q("Which colour deviates the least?", ["Violet", "Blue", "Green", "Red"], 3, "Red has the smallest refractive index in glass, so it deviates least."),
      q("The natural phenomenon caused by dispersion is…", ["Twinkling of stars", "Rainbow", "Blue sky", "Mirage"], 1, "Raindrops act like tiny prisms to make a rainbow."),
      q("For a prism with A = 60°, if i = 50° and e = 40°, δ = …", ["30°", "90°", "150°", "10°"], 0, "δ = i + e − A = 50 + 40 − 60 = 30°."),
    ],
  },
  {
    id: "sslc-ohms-law", subject: "physics", icon: "🔌",
    title: L("Verification of Ohm's law", "ಓಮ್ ನಿಯಮದ ಪರಿಶೀಲನೆ"),
    aim: L("To study the dependence of current (I) on potential difference (V) across a resistor and find its resistance.", "ರೋಧಕದ ಮೇಲಿನ ವಿಭವಾಂತರ (V) ಮತ್ತು ವಿದ್ಯುತ್ ಪ್ರವಾಹ (I) ನಡುವಿನ ಸಂಬಂಧ ಅಧ್ಯಯನ ಮಾಡಿ ರೋಧ ಕಂಡುಹಿಡಿಯುವುದು."),
    theory: L(
      "Ohm's law: at constant temperature, the current through a conductor is directly proportional to the potential difference across it. V = IR, where R is the resistance in ohms (Ω).\nThe ammeter is connected in series and the voltmeter in parallel with the resistor. The V–I graph is a straight line through the origin; its slope gives R.",
      "ಓಮ್ ನಿಯಮ: ಸ್ಥಿರ ತಾಪದಲ್ಲಿ ವಾಹಕದ ಮೂಲಕ ಹರಿಯುವ ವಿದ್ಯುತ್ ಪ್ರವಾಹವು ಅದರ ಎರಡು ತುದಿಗಳ ವಿಭವಾಂತರಕ್ಕೆ ನೇರ ಅನುಪಾತದಲ್ಲಿರುತ್ತದೆ. V = IR, ಇಲ್ಲಿ R ರೋಧ (ಓಮ್, Ω).\nಅಮ್ಮೀಟರ್ ಅನ್ನು ಸರಣಿಯಲ್ಲಿ, ವೋಲ್ಟ್‌ಮೀಟರ್ ಅನ್ನು ಸಮಾಂತರವಾಗಿ ಜೋಡಿಸಲಾಗುತ್ತದೆ. V–I ನಕ್ಷೆ ಮೂಲಬಿಂದುವಿನ ಮೂಲಕ ಹೋಗುವ ಸರಳರೇಖೆ; ಅದರ ಇಳಿಜಾರು R ನೀಡುತ್ತದೆ."
    ),
    formula: "V = I × R\nR = V / I",
    apparatus: L("Battery, resistor, ammeter, voltmeter, rheostat, plug key, connecting wires", "ಬ್ಯಾಟರಿ, ರೋಧಕ, ಅಮ್ಮೀಟರ್, ವೋಲ್ಟ್‌ಮೀಟರ್, ರಿಯೋಸ್ಟಾಟ್, ಪ್ಲಗ್ ಕೀ, ಸಂಪರ್ಕ ತಂತಿಗಳು"),
    procedure: [
      "Connect the battery, key, rheostat, ammeter and resistor in series.",
      "Connect the voltmeter in parallel across the resistor.",
      "Close the key and adjust the rheostat to get a small current. Note V and I.",
      "Change the rheostat to get at least five different pairs of V and I.",
      "Calculate V/I for each and plot a graph of V against I.",
    ],
    sim: "circuit", opts: { comp: "resistor", vMax: 6, iMax: 1.2, rheoKey: "V", rheoMax: 6 },
    controls: [sl("V", L("Rheostat → voltage across R", "ರಿಯೋಸ್ಟಾಟ್ → R ಮೇಲಿನ ವೋಲ್ಟೇಜ್"), 0.5, 6, 0.5, 1.5, "V"), sel("R", L("Resistor", "ರೋಧಕ"), [opt(5, "5 Ω"), opt(10, "10 Ω"), opt(20, "20 Ω")], 5)],
    compute: (p) => ({ V: p.V, I: R2(p.V / p.R), Rcalc: p.V / R2(p.V / p.R) }),
    readouts: [col("V", L("Voltmeter", "ವೋಲ್ಟ್‌ಮೀಟರ್"), "V", 2), col("I", L("Ammeter", "ಅಮ್ಮೀಟರ್"), "A", 2)],
    table: [col("V", L("V", "V"), "V", 2), col("I", L("I", "I"), "A", 2), col("Rcalc", L("R = V/I", "R = V/I"), "Ω", 2)],
    graph: { x: "I", y: "V", fit: "origin", slopeMeans: L("slope = resistance R (Ω)", "ಇಳಿಜಾರು = ರೋಧ R (Ω)") },
    result: (rows) => L(`V/I is constant. Resistance R = ${mean(rows.map((r) => r.Rcalc)).toFixed(2)} Ω — Ohm's law verified.`, `V/I ಸ್ಥಿರವಾಗಿದೆ. ರೋಧ R = ${mean(rows.map((r) => r.Rcalc)).toFixed(2)} Ω — ಓಮ್ ನಿಯಮ ಪರಿಶೀಲಿಸಲಾಗಿದೆ.`),
    tip: L("Keep V the same and change R from 5 Ω to 20 Ω. What happens to the current?", "V ಅನ್ನು ಅದೇ ಇಟ್ಟು R ಅನ್ನು 5 Ω ರಿಂದ 20 Ω ಗೆ ಬದಲಿಸಿ. ಪ್ರವಾಹಕ್ಕೆ ಏನಾಗುತ್ತದೆ?"),
    quiz: [
      q("An ammeter is always connected…", ["In parallel", "In series", "Across the battery", "Anywhere"], 1, "Ammeter measures current, so it must be in series."),
      q("The V–I graph for a resistor at constant temperature is…", ["A curve", "A straight line through origin", "A horizontal line", "A circle"], 1, "V ∝ I gives a straight line through the origin."),
      q("V = 6 V, I = 0.3 A. R = …", ["2 Ω", "1.8 Ω", "20 Ω", "0.05 Ω"], 2, "R = V/I = 6/0.3 = 20 Ω."),
      q("What is the use of the rheostat?", ["To measure voltage", "To vary the current", "To store charge", "To measure resistance"], 1, "A rheostat is a variable resistor used to change the current."),
    ],
  },
  {
    id: "sslc-series-parallel", subject: "physics", icon: "🔗",
    title: L("Resistors in series and parallel", "ಸರಣಿ ಮತ್ತು ಸಮಾಂತರ ಜೋಡಣೆಯಲ್ಲಿ ರೋಧಕಗಳು"),
    aim: L("To find the equivalent resistance of two resistors connected in series and in parallel.", "ಸರಣಿ ಮತ್ತು ಸಮಾಂತರವಾಗಿ ಜೋಡಿಸಿದ ಎರಡು ರೋಧಕಗಳ ಸಮಾನ ರೋಧ ಕಂಡುಹಿಡಿಯುವುದು."),
    theory: L(
      "In series the same current flows through each resistor and the equivalent resistance is the sum: Rs = R₁ + R₂.\nIn parallel the voltage across each resistor is the same and the currents add up, so 1/Rp = 1/R₁ + 1/R₂. The parallel combination is always smaller than the smallest resistor.",
      "ಸರಣಿಯಲ್ಲಿ ಪ್ರತಿ ರೋಧಕದ ಮೂಲಕ ಒಂದೇ ಪ್ರವಾಹ ಹರಿಯುತ್ತದೆ ಮತ್ತು ಸಮಾನ ರೋಧ ಮೊತ್ತವಾಗಿರುತ್ತದೆ: Rs = R₁ + R₂.\nಸಮಾಂತರದಲ್ಲಿ ಪ್ರತಿ ರೋಧಕದ ಮೇಲೆ ಒಂದೇ ವೋಲ್ಟೇಜ್ ಇದ್ದು ಪ್ರವಾಹಗಳು ಸೇರುತ್ತವೆ, ಆದ್ದರಿಂದ 1/Rp = 1/R₁ + 1/R₂. ಸಮಾಂತರ ಜೋಡಣೆಯ ರೋಧ ಅತ್ಯಂತ ಚಿಕ್ಕ ರೋಧಕಕ್ಕಿಂತಲೂ ಕಡಿಮೆ."
    ),
    formula: "Rs = R₁ + R₂\n1/Rp = 1/R₁ + 1/R₂",
    apparatus: L("Two resistors, battery, ammeter, voltmeter, rheostat, key, connecting wires", "ಎರಡು ರೋಧಕಗಳು, ಬ್ಯಾಟರಿ, ಅಮ್ಮೀಟರ್, ವೋಲ್ಟ್‌ಮೀಟರ್, ರಿಯೋಸ್ಟಾಟ್, ಕೀ, ಸಂಪರ್ಕ ತಂತಿಗಳು"),
    procedure: [
      "Connect R₁ and R₂ in series with the ammeter; connect the voltmeter across the combination.",
      "Note V and I and calculate Rs = V/I.",
      "Now connect R₁ and R₂ in parallel and repeat.",
      "Compare the experimental values with the values from the formulas.",
    ],
    sim: "circuit", opts: { comp: "seriesParallel", vMax: 6, iMax: 6, rheoKey: "V", rheoMax: 6 },
    controls: [
      sel("mode", L("Connection", "ಜೋಡಣೆ"), [opt("series", "Series", "ಸರಣಿ"), opt("parallel", "Parallel", "ಸಮಾಂತರ")], "series"),
      sl("R1", L("R₁", "R₁"), 2, 10, 1, 4, "Ω"), sl("R2", L("R₂", "R₂"), 2, 10, 1, 6, "Ω"), sl("V", L("Voltage", "ವೋಲ್ಟೇಜ್"), 1, 6, 0.5, 3, "V"),
    ],
    compute: (p) => {
      const Req = p.mode === "series" ? p.R1 + p.R2 : (p.R1 * p.R2) / (p.R1 + p.R2);
      const I = R2(p.V / Req);
      return { V: p.V, I, Rexp: p.V / I, Rth: Req, modeName: p.mode === "series" ? L("Series", "ಸರಣಿ") : L("Parallel", "ಸಮಾಂತರ") };
    },
    readouts: [col("V", L("Voltmeter", "ವೋಲ್ಟ್‌ಮೀಟರ್"), "V", 2), col("I", L("Ammeter", "ಅಮ್ಮೀಟರ್"), "A", 2), col("Rexp", L("V / I", "V / I"), "Ω", 2)],
    table: [col("modeName", L("Connection", "ಜೋಡಣೆ")), col("R1", L("R₁", "R₁"), "Ω", 0), col("R2", L("R₂", "R₂"), "Ω", 0), col("V", L("V", "V"), "V", 1), col("I", L("I", "I"), "A", 2), col("Rexp", L("R (exp)", "R (ಪ್ರಯೋಗ)"), "Ω", 2), col("Rth", L("R (formula)", "R (ಸೂತ್ರ)"), "Ω", 2)],
    result: (rows) => L(`Experimental and formula values agree within ${Math.max(...rows.map((r) => Math.abs(r.Rexp - r.Rth))).toFixed(2)} Ω.`, `ಪ್ರಯೋಗ ಮತ್ತು ಸೂತ್ರದ ಮೌಲ್ಯಗಳು ${Math.max(...rows.map((r) => Math.abs(r.Rexp - r.Rth))).toFixed(2)} Ω ಒಳಗೆ ಹೊಂದುತ್ತವೆ.`),
    tip: L("With R₁ = R₂ = 4 Ω, compare series and parallel. Is Rp exactly one quarter of Rs?", "R₁ = R₂ = 4 Ω ಇಟ್ಟು ಸರಣಿ ಮತ್ತು ಸಮಾಂತರ ಹೋಲಿಸಿ. Rp ನಿಖರವಾಗಿ Rs ನ ಕಾಲು ಭಾಗವೇ?"),
    quiz: [
      q("Household appliances are connected in…", ["Series", "Parallel", "Both", "Neither"], 1, "Parallel gives each appliance full voltage and independent switching."),
      q("Two 6 Ω resistors in parallel give…", ["12 Ω", "6 Ω", "3 Ω", "36 Ω"], 2, "1/R = 1/6 + 1/6 → R = 3 Ω."),
      q("In a series circuit, which quantity is the same for every resistor?", ["Voltage", "Current", "Power", "Resistance"], 1, "There is only one path, so the same current flows."),
      q("Equivalent resistance in parallel is…", ["More than the largest", "Less than the smallest", "Equal to the sum", "Equal to the average"], 1, "Adding paths always lowers total resistance."),
    ],
  },

  /* ============================ CHEMISTRY ============================ */
  {
    id: "sslc-ph", subject: "chemistry", icon: "🧪",
    title: L("pH of different samples", "ವಿವಿಧ ಮಾದರಿಗಳ pH"),
    aim: L("To find the pH of given samples using universal indicator (pH) paper.", "ಸಾರ್ವತ್ರಿಕ ಸೂಚಕ (pH) ಕಾಗದ ಬಳಸಿ ಕೊಟ್ಟಿರುವ ಮಾದರಿಗಳ pH ಕಂಡುಹಿಡಿಯುವುದು."),
    theory: L(
      "pH is a scale from 0 to 14 that tells how acidic or basic a solution is. pH 7 is neutral, below 7 is acidic and above 7 is basic.\nA universal indicator is a mixture of indicators that shows a different colour at each pH. By matching the colour of the wet pH paper with the colour chart we can read the approximate pH.",
      "pH ಎಂಬುದು ದ್ರಾವಣ ಎಷ್ಟು ಆಮ್ಲೀಯ ಅಥವಾ ಪ್ರತ್ಯಾಮ್ಲೀಯ ಎಂಬುದನ್ನು ತಿಳಿಸುವ 0 ರಿಂದ 14 ರ ಮಾಪಕ. pH 7 ತಟಸ್ಥ, 7 ಕ್ಕಿಂತ ಕಡಿಮೆ ಆಮ್ಲೀಯ, 7 ಕ್ಕಿಂತ ಹೆಚ್ಚು ಪ್ರತ್ಯಾಮ್ಲೀಯ.\nಸಾರ್ವತ್ರಿಕ ಸೂಚಕವು ಹಲವು ಸೂಚಕಗಳ ಮಿಶ್ರಣವಾಗಿದ್ದು ಪ್ರತಿ pH ಗೆ ಬೇರೆ ಬಣ್ಣ ತೋರಿಸುತ್ತದೆ. ಒದ್ದೆಯಾದ pH ಕಾಗದದ ಬಣ್ಣವನ್ನು ಬಣ್ಣದ ಚಾರ್ಟ್‌ನೊಂದಿಗೆ ಹೋಲಿಸಿ pH ತಿಳಿಯಬಹುದು."
    ),
    formula: "pH = −log[H⁺]\npH < 7 acidic · 7 neutral · > 7 basic",
    apparatus: L("Test tubes, test-tube stand, pH paper, standard colour chart, samples (dil. HCl, lemon juice, vinegar, water, NaHCO₃ solution, NaOH)", "ಪರೀಕ್ಷಾ ನಳಿಕೆಗಳು, ಸ್ಟ್ಯಾಂಡ್, pH ಕಾಗದ, ಬಣ್ಣದ ಚಾರ್ಟ್, ಮಾದರಿಗಳು (ದುರ್ಬಲ HCl, ನಿಂಬೆ ರಸ, ವಿನೆಗರ್, ನೀರು, NaHCO₃ ದ್ರಾವಣ, NaOH)"),
    procedure: [
      "Take about 2 mL of each sample in separate clean test tubes and label them.",
      "Dip a strip of pH paper in the first sample (or put a drop on it with a glass rod).",
      "Compare the colour developed with the standard colour chart and note the pH.",
      "Repeat with the other samples using a fresh strip each time.",
      "Classify each sample as acidic, neutral or basic.",
    ],
    sim: "ph",
    opts: { samples: [
      { k: "hcl", l: L("Dilute HCl", "ದುರ್ಬಲ HCl"), pH: 1, color: "rgba(226,232,240,0.7)" },
      { k: "lemon", l: L("Lemon juice", "ನಿಂಬೆ ರಸ"), pH: 2.3, color: "rgba(254,240,138,0.7)" },
      { k: "vinegar", l: L("Vinegar", "ವಿನೆಗರ್"), pH: 3, color: "rgba(254,243,199,0.7)" },
      { k: "water", l: L("Distilled water", "ಬಟ್ಟಿ ಇಳಿಸಿದ ನೀರು"), pH: 7, color: "rgba(186,230,253,0.6)" },
      { k: "soda", l: L("Baking soda solution", "ಅಡಿಗೆ ಸೋಡಾ ದ್ರಾವಣ"), pH: 8.4, color: "rgba(241,245,249,0.8)" },
      { k: "naoh", l: L("Dilute NaOH", "ದುರ್ಬಲ NaOH"), pH: 13, color: "rgba(226,232,240,0.7)" },
    ] },
    controls: [sel("sample", L("Sample", "ಮಾದರಿ"), [opt("hcl", "Dil. HCl", "ದುರ್ಬಲ HCl"), opt("lemon", "Lemon juice", "ನಿಂಬೆ ರಸ"), opt("vinegar", "Vinegar", "ವಿನೆಗರ್"), opt("water", "Water", "ನೀರು"), opt("soda", "Baking soda", "ಅಡಿಗೆ ಸೋಡಾ"), opt("naoh", "Dil. NaOH", "ದುರ್ಬಲ NaOH")], "lemon")],
    compute: (p, x) => {
      const s = { hcl: [1, "Dilute HCl", "ದುರ್ಬಲ HCl"], lemon: [2.3, "Lemon juice", "ನಿಂಬೆ ರಸ"], vinegar: [3, "Vinegar", "ವಿನೆಗರ್"], water: [7, "Distilled water", "ಬಟ್ಟಿ ಇಳಿಸಿದ ನೀರು"], soda: [8.4, "Baking soda solution", "ಅಡಿಗೆ ಸೋಡಾ ದ್ರಾವಣ"], naoh: [13, "Dilute NaOH", "ದುರ್ಬಲ NaOH"] }[p.sample];
      return { pH: s[0], sampleName: L(s[1], s[2]), nature: nature(s[0]), pHshown: x.dipped ? s[0] : null };
    },
    readouts: [col("pHshown", L("pH (from chart)", "pH (ಚಾರ್ಟ್‌ನಿಂದ)"), "", 1), col("nature", L("Nature", "ಸ್ವಭಾವ"))],
    canRecord: (p, r, x) => !!x.dipped,
    table: [col("sampleName", L("Sample", "ಮಾದರಿ")), col("pH", L("pH", "pH"), "", 1), col("nature", L("Nature", "ಸ್ವಭಾವ"))],
    result: (rows) => L(`${rows.filter((r) => r.pH < 7).length} acidic, ${rows.filter((r) => r.pH === 7).length} neutral and ${rows.filter((r) => r.pH > 7).length} basic samples identified.`, `${rows.filter((r) => r.pH < 7).length} ಆಮ್ಲೀಯ, ${rows.filter((r) => r.pH === 7).length} ತಟಸ್ಥ ಮತ್ತು ${rows.filter((r) => r.pH > 7).length} ಪ್ರತ್ಯಾಮ್ಲೀಯ ಮಾದರಿಗಳು ಗುರುತಿಸಲಾಗಿದೆ.`),
    tip: L("Test all six samples, then arrange them in increasing order of pH.", "ಆರೂ ಮಾದರಿಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ, pH ಏರಿಕೆಯ ಕ್ರಮದಲ್ಲಿ ಜೋಡಿಸಿ."),
    quiz: [
      q("A solution turns pH paper green. Its pH is about…", ["2", "7", "10", "13"], 1, "Green on universal indicator means neutral, pH ≈ 7."),
      q("Which has the lowest pH?", ["Water", "Baking soda", "Lemon juice", "NaOH"], 2, "Lemon juice (citric acid) is the most acidic of these."),
      q("Tooth decay starts when the pH in the mouth falls below…", ["5.5", "7", "8.5", "10"], 0, "Below pH 5.5 enamel (calcium phosphate) begins to dissolve."),
      q("Antacids used for acidity are…", ["Strong acids", "Mild bases", "Neutral salts", "Strong bases"], 1, "Mild bases like milk of magnesia neutralise excess stomach acid."),
    ],
  },
  (() => {
    const samples = [
      { k: "cao", l: L("Quicklime (CaO)", "ಸುಣ್ಣದ ಕಲ್ಲು (CaO)"), color: "rgba(241,245,249,0.95)" },
      { k: "feso4", l: L("Ferrous sulphate crystals", "ಫೆರಸ್ ಸಲ್ಫೇಟ್ ಹರಳುಗಳು"), color: "rgba(187,247,208,0.9)" },
      { k: "cuso4", l: L("Copper sulphate solution", "ತಾಮ್ರದ ಸಲ್ಫೇಟ್ ದ್ರಾವಣ"), color: "rgba(56,189,248,0.6)" },
      { k: "na2so4", l: L("Sodium sulphate solution", "ಸೋಡಿಯಂ ಸಲ್ಫೇಟ್ ದ್ರಾವಣ"), color: "rgba(226,232,240,0.6)" },
    ];
    const reagents = [
      { k: "water", l: L("Water", "ನೀರು"), color: "rgba(186,230,253,0.9)" },
      { k: "heat", l: L("Heat strongly", "ತೀವ್ರವಾಗಿ ಕಾಯಿಸಿ"), color: "#f97316" },
      { k: "fe", l: L("Iron nail", "ಕಬ್ಬಿಣದ ಮೊಳೆ"), color: "#78716c" },
      { k: "bacl2", l: L("Barium chloride solution", "ಬೇರಿಯಂ ಕ್ಲೋರೈಡ್ ದ್ರಾವಣ"), color: "rgba(226,232,240,0.9)" },
    ];
    return {
      id: "sslc-reaction-types", subject: "chemistry", icon: "⚗️",
      title: L("Types of chemical reactions", "ರಾಸಾಯನಿಕ ಕ್ರಿಯೆಗಳ ವಿಧಗಳು"),
      aim: L("To perform and identify combination, decomposition, displacement and double displacement reactions.", "ಸಂಯೋಜನೆ, ವಿಭಜನೆ, ಸ್ಥಾನಪಲ್ಲಟ ಮತ್ತು ದ್ವಿ-ಸ್ಥಾನಪಲ್ಲಟ ಕ್ರಿಯೆಗಳನ್ನು ಮಾಡಿ ಗುರುತಿಸುವುದು."),
      theory: L(
        "Combination: two substances join to form one product (CaO + H₂O → Ca(OH)₂, heat released).\nDecomposition: one substance breaks into simpler ones on heating (2FeSO₄ → Fe₂O₃ + SO₂ + SO₃).\nDisplacement: a more reactive metal pushes out a less reactive metal from its salt (Fe + CuSO₄ → FeSO₄ + Cu).\nDouble displacement: two compounds exchange ions, often forming a precipitate (Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl).",
        "ಸಂಯೋಜನೆ: ಎರಡು ವಸ್ತುಗಳು ಸೇರಿ ಒಂದು ಉತ್ಪನ್ನ ಉಂಟಾಗುತ್ತದೆ (CaO + H₂O → Ca(OH)₂, ಶಾಖ ಬಿಡುಗಡೆ).\nವಿಭಜನೆ: ಒಂದು ವಸ್ತು ಕಾಯಿಸಿದಾಗ ಸರಳ ವಸ್ತುಗಳಾಗಿ ಒಡೆಯುತ್ತದೆ (2FeSO₄ → Fe₂O₃ + SO₂ + SO₃).\nಸ್ಥಾನಪಲ್ಲಟ: ಹೆಚ್ಚು ಕ್ರಿಯಾಶೀಲ ಲೋಹ ಕಡಿಮೆ ಕ್ರಿಯಾಶೀಲ ಲೋಹವನ್ನು ಅದರ ಲವಣದಿಂದ ಹೊರಹಾಕುತ್ತದೆ (Fe + CuSO₄ → FeSO₄ + Cu).\nದ್ವಿ-ಸ್ಥಾನಪಲ್ಲಟ: ಎರಡು ಸಂಯುಕ್ತಗಳು ಅಯಾನುಗಳನ್ನು ವಿನಿಮಯ ಮಾಡಿ ಅವಕ್ಷೇಪ ಉಂಟಾಗುತ್ತದೆ (Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl)."
      ),
      apparatus: L("Test tubes, burner, iron nails, CaO, FeSO₄ crystals, CuSO₄, Na₂SO₄ and BaCl₂ solutions", "ಪರೀಕ್ಷಾ ನಳಿಕೆಗಳು, ಬರ್ನರ್, ಕಬ್ಬಿಣದ ಮೊಳೆಗಳು, CaO, FeSO₄ ಹರಳುಗಳು, CuSO₄, Na₂SO₄ ಮತ್ತು BaCl₂ ದ್ರಾವಣಗಳು"),
      procedure: [
        "Add water slowly to a small amount of quicklime in a beaker; touch the beaker.",
        "Heat a few ferrous sulphate crystals in a dry test tube; observe colour and smell.",
        "Dip a clean iron nail in copper sulphate solution for 15–20 minutes.",
        "Mix sodium sulphate and barium chloride solutions in a test tube.",
        "Record observations and identify each reaction type.",
      ],
      sim: "bench",
      opts: {
        samples, reagents,
        react: {
          "cao|water": { c: "rgba(241,245,249,0.95)", heat: true, gas: false, obs: L("Hissing sound, beaker becomes very hot, milky suspension forms", "ಹಿಸ್ ಶಬ್ದ, ಬೀಕರ್ ತುಂಬಾ ಬಿಸಿಯಾಗುತ್ತದೆ, ಹಾಲಿನಂತಹ ತೂಗು ದ್ರವ"), inf: L("Combination (exothermic): CaO + H₂O → Ca(OH)₂", "ಸಂಯೋಜನೆ (ಶಾಖ ಬಿಡುಗಡೆ): CaO + H₂O → Ca(OH)₂") },
          "feso4|heat": { c: "rgba(185,28,28,0.75)", heat: true, gas: true, vigor: 10, noAdd: true, obs: L("Green crystals turn white, then reddish-brown; smell of burning sulphur", "ಹಸಿರು ಹರಳುಗಳು ಬಿಳಿಯಾಗಿ ನಂತರ ಕೆಂಪು-ಕಂದು; ಸುಡುವ ಗಂಧಕದ ವಾಸನೆ"), inf: L("Thermal decomposition: 2FeSO₄ → Fe₂O₃ + SO₂ + SO₃", "ಉಷ್ಣ ವಿಭಜನೆ: 2FeSO₄ → Fe₂O₃ + SO₂ + SO₃") },
          "cuso4|fe": { c: "rgba(134,239,172,0.55)", metal: "#78716c", coat: "#b45309", obs: L("Brown coating on the nail; blue colour of solution fades to pale green", "ಮೊಳೆಯ ಮೇಲೆ ಕಂದು ಲೇಪನ; ದ್ರಾವಣದ ನೀಲಿ ಬಣ್ಣ ತಿಳಿ ಹಸಿರಾಗುತ್ತದೆ"), inf: L("Displacement: Fe + CuSO₄ → FeSO₄ + Cu (iron is more reactive)", "ಸ್ಥಾನಪಲ್ಲಟ: Fe + CuSO₄ → FeSO₄ + Cu (ಕಬ್ಬಿಣ ಹೆಚ್ಚು ಕ್ರಿಯಾಶೀಲ)") },
          "na2so4|bacl2": { ppt: "#f8fafc", c: "rgba(241,245,249,0.85)", obs: L("White precipitate forms immediately", "ತಕ್ಷಣ ಬಿಳಿ ಅವಕ್ಷೇಪ ಉಂಟಾಗುತ್ತದೆ"), inf: L("Double displacement (precipitation): BaSO₄↓ formed", "ದ್ವಿ-ಸ್ಥಾನಪಲ್ಲಟ (ಅವಕ್ಷೇಪನ): BaSO₄↓ ಉಂಟಾಗಿದೆ") },
          "cuso4|bacl2": { ppt: "#f8fafc", c: "rgba(56,189,248,0.5)", obs: L("White precipitate in blue solution", "ನೀಲಿ ದ್ರಾವಣದಲ್ಲಿ ಬಿಳಿ ಅವಕ್ಷೇಪ"), inf: L("Double displacement: BaSO₄↓ (sulphate present)", "ದ್ವಿ-ಸ್ಥಾನಪಲ್ಲಟ: BaSO₄↓ (ಸಲ್ಫೇಟ್ ಇದೆ)") },
          "feso4|fe": noChange, "na2so4|fe": noChange,
        },
        identify: { prompt: L("For the CURRENT sample's main reaction, what type is it?", "ಪ್ರಸ್ತುತ ಮಾದರಿಯ ಮುಖ್ಯ ಕ್ರಿಯೆ ಯಾವ ವಿಧ?"), choices: [L("Combination", "ಸಂಯೋಜನೆ"), L("Decomposition", "ವಿಭಜನೆ"), L("Displacement", "ಸ್ಥಾನಪಲ್ಲಟ"), L("Double displacement", "ದ್ವಿ-ಸ್ಥಾನಪಲ್ಲಟ")], answer: { cao: 0, feso4: 1, cuso4: 2, na2so4: 3 } },
      },
      controls: benchControls(samples, reagents),
      canRecord: (p, r, x) => !!x.tested,
      table: benchCols,
      tip: L("Try the iron nail in sodium sulphate. Why is there no change?", "ಸೋಡಿಯಂ ಸಲ್ಫೇಟ್‌ನಲ್ಲಿ ಕಬ್ಬಿಣದ ಮೊಳೆ ಹಾಕಿ. ಏಕೆ ಬದಲಾವಣೆ ಇಲ್ಲ?"),
      quiz: [
        q("CaO + H₂O → Ca(OH)₂ is an example of…", ["Decomposition", "Combination", "Displacement", "Redox only"], 1, "Two reactants combine into a single product."),
        q("Heating FeSO₄ crystals gives a smell of…", ["Rotten eggs", "Burning sulphur", "Vinegar", "Ammonia"], 1, "SO₂ and SO₃ released smell like burning sulphur."),
        q("The white precipitate in Na₂SO₄ + BaCl₂ is…", ["NaCl", "BaSO₄", "BaCl₂", "Na₂O"], 1, "Barium sulphate is insoluble in water."),
        q("Why does the blue colour of CuSO₄ fade when an iron nail is dipped?", ["Water evaporates", "Cu²⁺ ions are replaced by Fe²⁺", "Nail dissolves fully", "Light bleaches it"], 1, "Iron displaces copper; FeSO₄ is pale green."),
      ],
    };
  })(),
  (() => {
    const samples = [
      { k: "hcl", l: L("Dilute HCl", "ದುರ್ಬಲ HCl"), color: "rgba(226,232,240,0.7)" },
      { k: "naoh", l: L("Dilute NaOH", "ದುರ್ಬಲ NaOH"), color: "rgba(226,232,240,0.7)" },
    ];
    const reagents = [
      { k: "zn", l: L("Zinc granules", "ಸತುವಿನ ಕಣಗಳು"), color: "#94a3b8" },
      { k: "na2co3", l: L("Solid sodium carbonate", "ಘನ ಸೋಡಿಯಂ ಕಾರ್ಬೊನೇಟ್"), color: "rgba(255,255,255,0.95)" },
      { k: "blue", l: L("Blue litmus paper", "ನೀಲಿ ಲಿಟ್ಮಸ್ ಕಾಗದ"), color: "#3b82f6" },
      { k: "red", l: L("Red litmus paper", "ಕೆಂಪು ಲಿಟ್ಮಸ್ ಕಾಗದ"), color: "#ef4444" },
    ];
    return {
      id: "sslc-acid-base-properties", subject: "chemistry", icon: "🫧",
      title: L("Properties of acids and bases", "ಆಮ್ಲಗಳು ಮತ್ತು ಪ್ರತ್ಯಾಮ್ಲಗಳ ಗುಣಗಳು"),
      aim: L("To study the reaction of HCl and NaOH with litmus, zinc metal and solid sodium carbonate.", "HCl ಮತ್ತು NaOH ಗಳ ಲಿಟ್ಮಸ್, ಸತು ಲೋಹ ಮತ್ತು ಘನ ಸೋಡಿಯಂ ಕಾರ್ಬೊನೇಟ್‌ನೊಂದಿಗಿನ ಕ್ರಿಯೆ ಅಧ್ಯಯನ."),
      theory: L(
        "Acids turn blue litmus red; bases turn red litmus blue.\nAcids react with active metals like zinc to give hydrogen gas, which burns with a 'pop' sound. NaOH also reacts with zinc on warming to give H₂ (sodium zincate).\nAcids react with carbonates to give CO₂, which turns lime water milky.",
        "ಆಮ್ಲಗಳು ನೀಲಿ ಲಿಟ್ಮಸ್ ಅನ್ನು ಕೆಂಪಾಗಿಸುತ್ತವೆ; ಪ್ರತ್ಯಾಮ್ಲಗಳು ಕೆಂಪು ಲಿಟ್ಮಸ್ ಅನ್ನು ನೀಲಿಯಾಗಿಸುತ್ತವೆ.\nಆಮ್ಲಗಳು ಸತುವಿನಂತಹ ಕ್ರಿಯಾಶೀಲ ಲೋಹಗಳೊಂದಿಗೆ ಹೈಡ್ರೋಜನ್ ಅನಿಲ ನೀಡುತ್ತವೆ, ಅದು 'ಪಾಪ್' ಶಬ್ದದೊಂದಿಗೆ ಉರಿಯುತ್ತದೆ. NaOH ಕೂಡ ಬಿಸಿಮಾಡಿದಾಗ ಸತುವಿನೊಂದಿಗೆ H₂ ನೀಡುತ್ತದೆ.\nಆಮ್ಲಗಳು ಕಾರ್ಬೊನೇಟ್‌ಗಳೊಂದಿಗೆ CO₂ ನೀಡುತ್ತವೆ, ಅದು ಸುಣ್ಣದ ನೀರನ್ನು ಹಾಲಿನಂತೆ ಮಾಡುತ್ತದೆ."
      ),
      formula: "Zn + 2HCl → ZnCl₂ + H₂↑\nNa₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑",
      apparatus: L("Test tubes, dil. HCl, dil. NaOH, zinc granules, Na₂CO₃, litmus papers, lime water, burning splinter", "ಪರೀಕ್ಷಾ ನಳಿಕೆಗಳು, ದುರ್ಬಲ HCl, ದುರ್ಬಲ NaOH, ಸತುವಿನ ಕಣಗಳು, Na₂CO₃, ಲಿಟ್ಮಸ್ ಕಾಗದಗಳು, ಸುಣ್ಣದ ನೀರು, ಉರಿಯುವ ಕಡ್ಡಿ"),
      procedure: [
        "Put a drop of each solution on red and blue litmus papers; note the colour change.",
        "Add a few zinc granules to dilute HCl. Bring a burning splinter near the mouth.",
        "Add zinc to NaOH solution and warm gently.",
        "Add dilute HCl to solid Na₂CO₃ and pass the gas through lime water.",
      ],
      sim: "bench",
      opts: {
        samples, reagents,
        react: {
          "hcl|zn": { gas: true, vigor: 40, metal: "#94a3b8", obs: L("Brisk effervescence; gas burns with a pop sound", "ತೀವ್ರ ಗುಳ್ಳೆಗಳು; ಅನಿಲ 'ಪಾಪ್' ಶಬ್ದದೊಂದಿಗೆ ಉರಿಯುತ್ತದೆ"), inf: L("Hydrogen gas evolved — acid reacts with metal", "ಹೈಡ್ರೋಜನ್ ಅನಿಲ — ಆಮ್ಲ ಲೋಹದೊಂದಿಗೆ ಕ್ರಿಯೆ") },
          "naoh|zn": { gas: true, vigor: 12, heat: true, metal: "#94a3b8", obs: L("On warming, slow bubbles; gas burns with a pop", "ಬಿಸಿಮಾಡಿದಾಗ ನಿಧಾನ ಗುಳ್ಳೆಗಳು; ಅನಿಲ 'ಪಾಪ್' ಶಬ್ದ"), inf: L("H₂ evolved; Zn + 2NaOH → Na₂ZnO₂ + H₂", "H₂ ಬಿಡುಗಡೆ; Zn + 2NaOH → Na₂ZnO₂ + H₂") },
          "hcl|na2co3": { gas: true, vigor: 60, obs: L("Brisk effervescence; gas turns lime water milky", "ತೀವ್ರ ಗುಳ್ಳೆಗಳು; ಅನಿಲ ಸುಣ್ಣದ ನೀರನ್ನು ಹಾಲಿನಂತೆ ಮಾಡುತ್ತದೆ"), inf: L("CO₂ evolved — acid reacts with carbonate", "CO₂ ಬಿಡುಗಡೆ — ಆಮ್ಲ ಕಾರ್ಬೊನೇಟ್‌ನೊಂದಿಗೆ ಕ್ರಿಯೆ") },
          "naoh|na2co3": noChange,
          "hcl|blue": { c: "rgba(239,68,68,0.35)", obs: L("Blue litmus turns red", "ನೀಲಿ ಲಿಟ್ಮಸ್ ಕೆಂಪಾಗುತ್ತದೆ"), inf: L("Solution is acidic", "ದ್ರಾವಣ ಆಮ್ಲೀಯ") },
          "hcl|red": { obs: L("Red litmus stays red", "ಕೆಂಪು ಲಿಟ್ಮಸ್ ಕೆಂಪಾಗಿಯೇ ಇರುತ್ತದೆ"), inf: L("Not basic", "ಪ್ರತ್ಯಾಮ್ಲೀಯವಲ್ಲ") },
          "naoh|red": { c: "rgba(59,130,246,0.35)", obs: L("Red litmus turns blue", "ಕೆಂಪು ಲಿಟ್ಮಸ್ ನೀಲಿಯಾಗುತ್ತದೆ"), inf: L("Solution is basic", "ದ್ರಾವಣ ಪ್ರತ್ಯಾಮ್ಲೀಯ") },
          "naoh|blue": { obs: L("Blue litmus stays blue", "ನೀಲಿ ಲಿಟ್ಮಸ್ ನೀಲಿಯಾಗಿಯೇ ಇರುತ್ತದೆ"), inf: L("Not acidic", "ಆಮ್ಲೀಯವಲ್ಲ") },
        },
      },
      controls: benchControls(samples, reagents),
      canRecord: (p, r, x) => !!x.tested,
      table: benchCols,
      tip: L("Run all 8 combinations to fill a complete observation table.", "ಸಂಪೂರ್ಣ ಕೋಷ್ಟಕಕ್ಕಾಗಿ ಎಲ್ಲಾ 8 ಸಂಯೋಜನೆಗಳನ್ನು ಮಾಡಿ."),
      quiz: [
        q("The gas that burns with a pop sound is…", ["O₂", "CO₂", "H₂", "N₂"], 2, "Hydrogen burns with a characteristic pop."),
        q("Lime water turns milky due to the formation of…", ["CaCO₃", "CaO", "Ca(OH)₂", "CaCl₂"], 0, "CO₂ + Ca(OH)₂ → CaCO₃ (white, insoluble)."),
        q("Bases turn…", ["Blue litmus red", "Red litmus blue", "Both to green", "No change"], 1, "Bases turn red litmus blue."),
        q("Which metal reacts with both HCl and NaOH to give H₂?", ["Copper", "Zinc", "Silver", "Gold"], 1, "Zinc is amphoteric in nature (reacts with acids and bases)."),
      ],
    };
  })(),
  (() => {
    const samples = [
      { k: "znso4", l: L("ZnSO₄ solution", "ZnSO₄ ದ್ರಾವಣ"), color: "rgba(241,245,249,0.7)" },
      { k: "feso4", l: L("FeSO₄ solution", "FeSO₄ ದ್ರಾವಣ"), color: "rgba(187,247,208,0.7)" },
      { k: "cuso4", l: L("CuSO₄ solution", "CuSO₄ ದ್ರಾವಣ"), color: "rgba(56,189,248,0.6)" },
      { k: "al2so4", l: L("Al₂(SO₄)₃ solution", "Al₂(SO₄)₃ ದ್ರಾವಣ"), color: "rgba(241,245,249,0.7)" },
    ];
    const reagents = [
      { k: "al", l: L("Aluminium strip", "ಅಲ್ಯೂಮಿನಿಯಂ ಪಟ್ಟಿ"), color: "#cbd5e1" },
      { k: "zn", l: L("Zinc strip", "ಸತು ಪಟ್ಟಿ"), color: "#94a3b8" },
      { k: "fe", l: L("Iron strip", "ಕಬ್ಬಿಣದ ಪಟ್ಟಿ"), color: "#78716c" },
      { k: "cu", l: L("Copper strip", "ತಾಮ್ರದ ಪಟ್ಟಿ"), color: "#c2410c" },
    ];
    const rank = { al: 4, zn: 3, fe: 2, cu: 1 }, ionRank = { al2so4: 4, znso4: 3, feso4: 2, cuso4: 1 };
    const react = {};
    const metalCol = { al: "#cbd5e1", zn: "#94a3b8", fe: "#78716c", cu: "#c2410c" };
    const depCol = { cuso4: "#b45309", feso4: "#3f3f46", znso4: "#71717a" };
    const nm = { al: "Al", zn: "Zn", fe: "Fe", cu: "Cu" }, ion = { al2so4: "Al", znso4: "Zn", feso4: "Fe", cuso4: "Cu" };
    samples.forEach((s) => reagents.forEach((m) => {
      const yes = rank[m.k] > ionRank[s.k];
      react[`${s.k}|${m.k}`] = yes
        ? { metal: metalCol[m.k], coat: depCol[s.k], c: s.k === "cuso4" ? "rgba(186,230,253,0.35)" : s.k === "feso4" ? "rgba(241,245,249,0.6)" : s.color, obs: L(`Deposit forms on the ${nm[m.k]} strip; solution colour changes`, `${nm[m.k]} ಪಟ್ಟಿಯ ಮೇಲೆ ಲೇಪನ; ದ್ರಾವಣದ ಬಣ್ಣ ಬದಲಾಗುತ್ತದೆ`), inf: L(`${nm[m.k]} is more reactive than ${ion[s.k]} — displacement`, `${nm[m.k]} ಯು ${ion[s.k]} ಗಿಂತ ಹೆಚ್ಚು ಕ್ರಿಯಾಶೀಲ — ಸ್ಥಾನಪಲ್ಲಟ`) }
        : { metal: metalCol[m.k], obs: L("No change", "ಬದಲಾವಣೆ ಇಲ್ಲ"), inf: L(`${nm[m.k]} is ${m.k === s.k.slice(0, 2) ? "the same metal" : "less reactive than " + ion[s.k]} — no displacement`, `${nm[m.k]} ಕಡಿಮೆ/ಸಮಾನ ಕ್ರಿಯಾಶೀಲ — ಸ್ಥಾನಪಲ್ಲಟ ಇಲ್ಲ`) };
    }));
    return {
      id: "sslc-reactivity-series", subject: "chemistry", icon: "🔩",
      title: L("Reactivity series of metals", "ಲೋಹಗಳ ಕ್ರಿಯಾಶೀಲತಾ ಶ್ರೇಣಿ"),
      aim: L("To arrange Al, Zn, Fe and Cu in decreasing order of reactivity using displacement reactions.", "ಸ್ಥಾನಪಲ್ಲಟ ಕ್ರಿಯೆಗಳನ್ನು ಬಳಸಿ Al, Zn, Fe ಮತ್ತು Cu ಗಳನ್ನು ಕ್ರಿಯಾಶೀಲತೆಯ ಇಳಿಕೆಯ ಕ್ರಮದಲ್ಲಿ ಜೋಡಿಸುವುದು."),
      theory: L(
        "A more reactive metal displaces a less reactive metal from the aqueous solution of its salt. If no change is seen, the metal is less reactive than the metal in the salt.\nBy testing every metal in every solution we can build the reactivity series: Al > Zn > Fe > Cu.",
        "ಹೆಚ್ಚು ಕ್ರಿಯಾಶೀಲ ಲೋಹವು ಕಡಿಮೆ ಕ್ರಿಯಾಶೀಲ ಲೋಹವನ್ನು ಅದರ ಲವಣದ ಜಲೀಯ ದ್ರಾವಣದಿಂದ ಸ್ಥಾನಪಲ್ಲಟಗೊಳಿಸುತ್ತದೆ. ಬದಲಾವಣೆ ಕಾಣದಿದ್ದರೆ ಲೋಹ ಕಡಿಮೆ ಕ್ರಿಯಾಶೀಲ.\nಪ್ರತಿ ಲೋಹವನ್ನು ಪ್ರತಿ ದ್ರಾವಣದಲ್ಲಿ ಪರೀಕ್ಷಿಸಿ ಕ್ರಿಯಾಶೀಲತಾ ಶ್ರೇಣಿ ರಚಿಸಬಹುದು: Al > Zn > Fe > Cu."
      ),
      apparatus: L("Test tubes, sandpaper, Al, Zn, Fe, Cu strips; solutions of Al₂(SO₄)₃, ZnSO₄, FeSO₄, CuSO₄", "ಪರೀಕ್ಷಾ ನಳಿಕೆಗಳು, ಮರಳು ಕಾಗದ, Al, Zn, Fe, Cu ಪಟ್ಟಿಗಳು; Al₂(SO₄)₃, ZnSO₄, FeSO₄, CuSO₄ ದ್ರಾವಣಗಳು"),
      procedure: [
        "Clean the metal strips with sandpaper.",
        "Take each salt solution in four test tubes.",
        "Put one strip of each metal into the solutions and wait.",
        "Note whether a deposit forms or the colour changes.",
        "Use the results to arrange the metals in order of reactivity.",
      ],
      sim: "bench",
      opts: { samples, reagents, react, identify: { prompt: L("From your tests, which metal is the MOST reactive?", "ನಿಮ್ಮ ಪರೀಕ್ಷೆಗಳಿಂದ ಯಾವ ಲೋಹ ಅತಿ ಹೆಚ್ಚು ಕ್ರಿಯಾಶೀಲ?"), choices: [L("Aluminium"), L("Zinc"), L("Iron"), L("Copper")], answer: { znso4: 0, feso4: 0, cuso4: 0, al2so4: 0 } } },
      controls: benchControls(samples, reagents),
      canRecord: (p, r, x) => !!x.tested,
      table: benchCols,
      tip: L("Copper does not react with any of the other solutions. What does that tell you?", "ತಾಮ್ರ ಬೇರೆ ಯಾವ ದ್ರಾವಣದೊಂದಿಗೂ ಕ್ರಿಯೆ ನಡೆಸುವುದಿಲ್ಲ. ಇದರಿಂದ ಏನು ತಿಳಿಯುತ್ತದೆ?"),
      quiz: [
        q("Which pair shows displacement?", ["Cu + ZnSO₄", "Zn + CuSO₄", "Fe + ZnSO₄", "Cu + FeSO₄"], 1, "Zinc is more reactive than copper."),
        q("Correct order of reactivity is…", ["Cu > Fe > Zn > Al", "Al > Zn > Fe > Cu", "Zn > Al > Cu > Fe", "Fe > Cu > Al > Zn"], 1, "Al is most reactive; Cu least among these."),
        q("Why are metal strips cleaned with sandpaper?", ["To make them shiny for photos", "To remove the oxide layer", "To make them thinner", "To add carbon"], 1, "The oxide layer would stop the reaction."),
        q("Copper vessels are used for storing water because copper…", ["Is very reactive", "Does not displace hydrogen from water", "Dissolves easily", "Is an acid"], 1, "Copper is below hydrogen in the series and is quite unreactive."),
      ],
    };
  })(),
  (() => {
    const samples = [
      { k: "soft", l: L("Distilled (soft) water", "ಮೃದು ನೀರು"), color: "rgba(186,230,253,0.5)" },
      { k: "tap", l: L("Tap water", "ನಲ್ಲಿ ನೀರು"), color: "rgba(186,230,253,0.55)" },
      { k: "hard", l: L("Hard water (CaCl₂ / MgSO₄)", "ಗಡಸು ನೀರು (CaCl₂ / MgSO₄)"), color: "rgba(203,213,225,0.6)" },
    ];
    const reagents = [
      { k: "soap", l: L("Soap solution + shake", "ಸಾಬೂನು ದ್ರಾವಣ + ಅಲುಗಾಡಿಸಿ"), color: "rgba(254,249,195,0.9)" },
      { k: "det", l: L("Detergent solution + shake", "ಮಾರ್ಜಕ ದ್ರಾವಣ + ಅಲುಗಾಡಿಸಿ"), color: "rgba(191,219,254,0.9)" },
    ];
    return {
      id: "sslc-soap-hard-water", subject: "chemistry", icon: "🧼",
      title: L("Cleansing action of soap in hard and soft water", "ಗಡಸು ಮತ್ತು ಮೃದು ನೀರಿನಲ್ಲಿ ಸಾಬೂನಿನ ಶುಚಿಗೊಳಿಸುವ ಕ್ರಿಯೆ"),
      aim: L("To compare the foaming capacity of soap and detergent in soft and hard water.", "ಮೃದು ಮತ್ತು ಗಡಸು ನೀರಿನಲ್ಲಿ ಸಾಬೂನು ಮತ್ತು ಮಾರ್ಜಕಗಳ ನೊರೆ ಸಾಮರ್ಥ್ಯ ಹೋಲಿಸುವುದು."),
      theory: L(
        "Soaps are sodium salts of long-chain fatty acids. Hard water contains Ca²⁺ and Mg²⁺ ions that react with soap to form an insoluble, sticky precipitate called scum, so very little lather forms and soap is wasted.\nDetergents are sulphonate or ammonium salts whose calcium and magnesium salts are soluble, so they lather well even in hard water.",
        "ಸಾಬೂನುಗಳು ದೀರ್ಘ ಸರಪಳಿ ಕೊಬ್ಬಿನಾಮ್ಲಗಳ ಸೋಡಿಯಂ ಲವಣಗಳು. ಗಡಸು ನೀರಿನಲ್ಲಿರುವ Ca²⁺ ಮತ್ತು Mg²⁺ ಅಯಾನುಗಳು ಸಾಬೂನಿನೊಂದಿಗೆ ಕರಗದ ಜಿಗುಟಾದ ಅವಕ್ಷೇಪ (ಕಸ / scum) ಉಂಟುಮಾಡುತ್ತವೆ, ಆದ್ದರಿಂದ ನೊರೆ ಕಡಿಮೆ.\nಮಾರ್ಜಕಗಳ ಕ್ಯಾಲ್ಸಿಯಂ ಮತ್ತು ಮೆಗ್ನೀಸಿಯಂ ಲವಣಗಳು ಕರಗುವುದರಿಂದ ಅವು ಗಡಸು ನೀರಿನಲ್ಲೂ ಚೆನ್ನಾಗಿ ನೊರೆ ನೀಡುತ್ತವೆ."
      ),
      apparatus: L("Test tubes with corks, soap solution, detergent solution, soft water, tap water, hard water, scale", "ಬಿರಡೆ ಸಹಿತ ಪರೀಕ್ಷಾ ನಳಿಕೆಗಳು, ಸಾಬೂನು ದ್ರಾವಣ, ಮಾರ್ಜಕ ದ್ರಾವಣ, ಮೃದು, ನಲ್ಲಿ ಮತ್ತು ಗಡಸು ನೀರು, ಅಳತೆಪಟ್ಟಿ"),
      procedure: [
        "Take 10 mL of each water sample in separate test tubes.",
        "Add the same number of drops of soap solution to each.",
        "Close with a cork and shake 10 times. Measure the height of the foam.",
        "Repeat with detergent solution and compare.",
      ],
      sim: "bench",
      opts: {
        samples, reagents,
        react: {
          "soft|soap": { foam: 1, obs: L("Thick lather, about 4 cm high", "ದಪ್ಪ ನೊರೆ, ಸುಮಾರು 4 cm ಎತ್ತರ"), inf: L("Soft water — soap works well", "ಮೃದು ನೀರು — ಸಾಬೂನು ಚೆನ್ನಾಗಿ ಕೆಲಸ ಮಾಡುತ್ತದೆ") },
          "tap|soap": { foam: 0.55, ppt: "rgba(255,255,255,0.7)", obs: L("Moderate lather (~2 cm), slight scum", "ಮಧ್ಯಮ ನೊರೆ (~2 cm), ಸ್ವಲ್ಪ ಕಸ"), inf: L("Tap water is slightly hard", "ನಲ್ಲಿ ನೀರು ಸ್ವಲ್ಪ ಗಡಸು") },
          "hard|soap": { foam: 0.12, ppt: "#f8fafc", c: "rgba(241,245,249,0.8)", obs: L("Very little lather; white curdy scum forms", "ಬಹಳ ಕಡಿಮೆ ನೊರೆ; ಬಿಳಿ ಮೊಸರಿನಂತಹ ಕಸ"), inf: L("Hard water — Ca²⁺/Mg²⁺ form scum with soap", "ಗಡಸು ನೀರು — Ca²⁺/Mg²⁺ ಸಾಬೂನಿನೊಂದಿಗೆ ಕಸ ಉಂಟುಮಾಡುತ್ತದೆ") },
          "soft|det": { foam: 1, obs: L("Thick lather", "ದಪ್ಪ ನೊರೆ"), inf: L("Detergent lathers in soft water", "ಮಾರ್ಜಕ ಮೃದು ನೀರಿನಲ್ಲಿ ನೊರೆ ನೀಡುತ್ತದೆ") },
          "tap|det": { foam: 0.95, obs: L("Thick lather", "ದಪ್ಪ ನೊರೆ"), inf: L("Detergent unaffected by hardness", "ಗಡಸುತನ ಮಾರ್ಜಕದ ಮೇಲೆ ಪರಿಣಾಮ ಬೀರುವುದಿಲ್ಲ") },
          "hard|det": { foam: 0.9, obs: L("Good lather, no scum", "ಉತ್ತಮ ನೊರೆ, ಕಸ ಇಲ್ಲ"), inf: L("Detergents work even in hard water", "ಮಾರ್ಜಕಗಳು ಗಡಸು ನೀರಿನಲ್ಲೂ ಕೆಲಸ ಮಾಡುತ್ತವೆ") },
        },
      },
      controls: benchControls(samples, reagents),
      canRecord: (p, r, x) => !!x.tested,
      table: benchCols,
      quiz: [
        q("Hardness of water is due to…", ["Na⁺ and K⁺", "Ca²⁺ and Mg²⁺", "Cl⁻ and NO₃⁻", "H⁺ ions"], 1, "Calcium and magnesium salts cause hardness."),
        q("The insoluble substance formed by soap in hard water is called…", ["Lather", "Scum", "Micelle", "Ester"], 1, "Scum is the curdy precipitate."),
        q("Soaps are…", ["Sodium salts of fatty acids", "Esters", "Alcohols", "Sulphonic acids"], 0, "Soap = sodium/potassium salt of long-chain carboxylic acid."),
        q("Why do detergents work in hard water?", ["They are acids", "Their Ca/Mg salts are soluble", "They remove Ca²⁺ by evaporation", "They are oils"], 1, "No scum forms with detergents."),
      ],
    };
  })(),
  (() => {
    const samples = [{ k: "acid", l: L("Ethanoic acid (CH₃COOH)", "ಎಥನೋಯಿಕ್ ಆಮ್ಲ (CH₃COOH)"), color: "rgba(241,245,249,0.7)" }];
    const reagents = [
      { k: "smell", l: L("Smell (waft)", "ವಾಸನೆ (ಗಾಳಿ ಬೀಸಿ)"), color: "rgba(255,255,255,0.1)" },
      { k: "water", l: L("Water", "ನೀರು"), color: "rgba(186,230,253,0.9)" },
      { k: "blue", l: L("Blue litmus", "ನೀಲಿ ಲಿಟ್ಮಸ್"), color: "#3b82f6" },
      { k: "nahco3", l: L("Sodium hydrogen carbonate", "ಸೋಡಿಯಂ ಹೈಡ್ರೋಜನ್ ಕಾರ್ಬೊನೇಟ್"), color: "rgba(255,255,255,0.95)" },
      { k: "ester", l: L("Ethanol + conc. H₂SO₄, warm", "ಎಥೆನಾಲ್ + ಸಾರ H₂SO₄, ಬಿಸಿಮಾಡಿ"), color: "rgba(254,243,199,0.9)" },
    ];
    return {
      id: "sslc-ethanoic-acid", subject: "chemistry", icon: "🍶",
      title: L("Properties of ethanoic (acetic) acid", "ಎಥನೋಯಿಕ್ (ಅಸಿಟಿಕ್) ಆಮ್ಲದ ಗುಣಗಳು"),
      aim: L("To study odour, solubility, effect on litmus, reaction with NaHCO₃ and esterification of ethanoic acid.", "ಎಥನೋಯಿಕ್ ಆಮ್ಲದ ವಾಸನೆ, ಕರಗುವಿಕೆ, ಲಿಟ್ಮಸ್ ಮೇಲಿನ ಪರಿಣಾಮ, NaHCO₃ ಜೊತೆ ಕ್ರಿಯೆ ಮತ್ತು ಎಸ್ಟರೀಕರಣ ಅಧ್ಯಯನ."),
      theory: L(
        "Ethanoic acid is a carboxylic acid; 5–8% solution in water is vinegar. It has a sharp vinegar smell, mixes completely with water and is a weak acid (turns blue litmus red).\nWith sodium hydrogen carbonate it gives CO₂. With ethanol in the presence of concentrated sulphuric acid it forms an ester (ethyl ethanoate) with a sweet fruity smell.",
        "ಎಥನೋಯಿಕ್ ಆಮ್ಲ ಒಂದು ಕಾರ್ಬಾಕ್ಸಿಲಿಕ್ ಆಮ್ಲ; ನೀರಿನಲ್ಲಿ ಅದರ 5–8% ದ್ರಾವಣವೇ ವಿನೆಗರ್. ಇದಕ್ಕೆ ತೀಕ್ಷ್ಣ ವಿನೆಗರ್ ವಾಸನೆ ಇದ್ದು ನೀರಿನಲ್ಲಿ ಸಂಪೂರ್ಣ ಬೆರೆಯುತ್ತದೆ; ದುರ್ಬಲ ಆಮ್ಲ (ನೀಲಿ ಲಿಟ್ಮಸ್ ಕೆಂಪಾಗಿಸುತ್ತದೆ).\nಸೋಡಿಯಂ ಹೈಡ್ರೋಜನ್ ಕಾರ್ಬೊನೇಟ್‌ನೊಂದಿಗೆ CO₂ ನೀಡುತ್ತದೆ. ಸಾರ ಸಲ್ಫ್ಯೂರಿಕ್ ಆಮ್ಲದ ಸಮ್ಮುಖದಲ್ಲಿ ಎಥೆನಾಲ್‌ನೊಂದಿಗೆ ಹಣ್ಣಿನ ಸಿಹಿ ವಾಸನೆಯ ಎಸ್ಟರ್ (ಈಥೈಲ್ ಎಥನೋಯೇಟ್) ಉಂಟಾಗುತ್ತದೆ."
      ),
      formula: "CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂\nCH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O",
      apparatus: L("Ethanoic acid, water, blue litmus, NaHCO₃, ethanol, conc. H₂SO₄, test tubes, water bath, lime water", "ಎಥನೋಯಿಕ್ ಆಮ್ಲ, ನೀರು, ನೀಲಿ ಲಿಟ್ಮಸ್, NaHCO₃, ಎಥೆನಾಲ್, ಸಾರ H₂SO₄, ಪರೀಕ್ಷಾ ನಳಿಕೆಗಳು, ನೀರಿನ ತೊಟ್ಟಿ, ಸುಣ್ಣದ ನೀರು"),
      procedure: [
        "Waft the vapours gently towards your nose to note the smell.",
        "Add 2 mL acid to 2 mL water and shake; check if it mixes.",
        "Put a drop on blue litmus paper.",
        "Add acid to NaHCO₃ and pass the gas through lime water.",
        "Warm 1 mL acid + 1 mL ethanol + few drops conc. H₂SO₄ in a water bath; pour into water and smell.",
      ],
      sim: "bench",
      opts: {
        samples, reagents,
        react: {
          "acid|smell": { noAdd: true, obs: L("Sharp, pungent smell of vinegar", "ತೀಕ್ಷ್ಣ ವಿನೆಗರ್ ವಾಸನೆ"), inf: L("Characteristic odour of ethanoic acid", "ಎಥನೋಯಿಕ್ ಆಮ್ಲದ ವಿಶಿಷ್ಟ ವಾಸನೆ") },
          "acid|water": { obs: L("Mixes completely, clear solution", "ಸಂಪೂರ್ಣ ಬೆರೆತು ಸ್ಪಷ್ಟ ದ್ರಾವಣ"), inf: L("Soluble in water in all proportions", "ನೀರಿನಲ್ಲಿ ಎಲ್ಲಾ ಪ್ರಮಾಣದಲ್ಲಿ ಕರಗುತ್ತದೆ") },
          "acid|blue": { c: "rgba(239,68,68,0.3)", obs: L("Blue litmus turns red", "ನೀಲಿ ಲಿಟ್ಮಸ್ ಕೆಂಪಾಗುತ್ತದೆ"), inf: L("Acidic in nature", "ಆಮ್ಲೀಯ ಸ್ವಭಾವ") },
          "acid|nahco3": { gas: true, vigor: 55, obs: L("Brisk effervescence; gas turns lime water milky", "ತೀವ್ರ ಗುಳ್ಳೆಗಳು; ಅನಿಲ ಸುಣ್ಣದ ನೀರನ್ನು ಹಾಲಿನಂತೆ ಮಾಡುತ್ತದೆ"), inf: L("CO₂ released — confirms –COOH group", "CO₂ ಬಿಡುಗಡೆ — –COOH ಗುಂಪು ದೃಢ") },
          "acid|ester": { heat: true, c: "rgba(254,243,199,0.6)", obs: L("Sweet, fruity smell when poured into water", "ನೀರಿಗೆ ಸುರಿದಾಗ ಸಿಹಿ ಹಣ್ಣಿನ ವಾಸನೆ"), inf: L("Ester (ethyl ethanoate) formed — esterification", "ಎಸ್ಟರ್ (ಈಥೈಲ್ ಎಥನೋಯೇಟ್) — ಎಸ್ಟರೀಕರಣ") },
        },
      },
      controls: benchControls(samples, reagents),
      canRecord: (p, r, x) => !!x.tested,
      table: benchCols,
      quiz: [
        q("Vinegar is a dilute solution of…", ["Methanoic acid", "Ethanoic acid", "Citric acid", "Ethanol"], 1, "Vinegar is 5–8% ethanoic acid."),
        q("Esters are known for their…", ["Sour taste", "Fruity smell", "Blue colour", "Explosive nature"], 1, "Esters are used in perfumes and flavours."),
        q("The gas formed with NaHCO₃ is…", ["H₂", "O₂", "CO₂", "SO₂"], 2, "Carbonates/bicarbonates + acid → CO₂."),
        q("Role of conc. H₂SO₄ in esterification is…", ["Oxidising agent", "Catalyst and dehydrating agent", "Reactant", "Indicator"], 1, "It speeds up the reaction and removes water."),
      ],
    };
  })(),

  /* ============================ BIOLOGY ============================ */
  {
    id: "sslc-stomata", subject: "biology", icon: "🍃",
    title: L("Stomata in a leaf peel", "ಎಲೆಯ ಸಿಪ್ಪೆಯಲ್ಲಿ ಪತ್ರರಂಧ್ರಗಳು"),
    aim: L("To prepare a temporary mount of a leaf peel, observe stomata and calculate the stomatal index.", "ಎಲೆಯ ಸಿಪ್ಪೆಯ ತಾತ್ಕಾಲಿಕ ಸ್ಲೈಡ್ ತಯಾರಿಸಿ ಪತ್ರರಂಧ್ರಗಳನ್ನು ವೀಕ್ಷಿಸಿ ಪತ್ರರಂಧ್ರ ಸೂಚ್ಯಂಕ ಲೆಕ್ಕ ಹಾಕುವುದು."),
    theory: L(
      "Stomata are tiny pores, mostly on the lower surface of leaves. Each pore is surrounded by two kidney-shaped guard cells that contain chloroplasts and control opening and closing.\nStomata allow exchange of gases (CO₂ in, O₂ out) and loss of water vapour (transpiration). Stomatal index = S / (S + E) × 100, where S = number of stomata and E = epidermal cells in the same area.",
      "ಪತ್ರರಂಧ್ರಗಳು ಹೆಚ್ಚಾಗಿ ಎಲೆಯ ಕೆಳಮೇಲ್ಮೈಯಲ್ಲಿರುವ ಸೂಕ್ಷ್ಮ ರಂಧ್ರಗಳು. ಪ್ರತಿ ರಂಧ್ರವನ್ನು ಹರಿತ್ತಿನ ಕಣಗಳನ್ನು ಹೊಂದಿರುವ ಎರಡು ಮೂತ್ರಪಿಂಡಾಕಾರದ ಕಾವಲು ಕೋಶಗಳು ಸುತ್ತುವರಿದು ತೆರೆಯುವಿಕೆ-ಮುಚ್ಚುವಿಕೆ ನಿಯಂತ್ರಿಸುತ್ತವೆ.\nಪತ್ರರಂಧ್ರಗಳು ಅನಿಲ ವಿನಿಮಯ (CO₂ ಒಳಗೆ, O₂ ಹೊರಗೆ) ಮತ್ತು ನೀರಾವಿ ನಷ್ಟಕ್ಕೆ (ಬಾಷ್ಪವಿಸರ್ಜನೆ) ಸಹಾಯ ಮಾಡುತ್ತವೆ. ಪತ್ರರಂಧ್ರ ಸೂಚ್ಯಂಕ = S / (S + E) × 100."
    ),
    formula: "Stomatal index = S / (S + E) × 100",
    apparatus: L("Fresh leaf (e.g. Tradescantia/ Bryophyllum), forceps, safranin, glycerine, slide, cover slip, microscope", "ತಾಜಾ ಎಲೆ, ಚಿಮುಟ, ಸಫ್ರಾನಿನ್, ಗ್ಲಿಸರಿನ್, ಸ್ಲೈಡ್, ಕವರ್ ಸ್ಲಿಪ್, ಸೂಕ್ಷ್ಮದರ್ಶಕ"),
    procedure: [
      "Fold the leaf and gently pull out a thin peel from the lower surface with forceps.",
      "Stain it in dilute safranin for a minute and wash off excess stain.",
      "Place the peel in a drop of glycerine on a slide; cover with a cover slip.",
      "Observe under 10× and then 40× objective. Focus using the fine adjustment.",
      "Count stomata and epidermal cells in a field of view; calculate stomatal index.",
    ],
    sim: "microscope",
    opts: { specimen: "stomata", find: [{ type: "stoma", l: L("a stoma (guard cells)", "ಒಂದು ಪತ್ರರಂಧ್ರ (ಕಾವಲು ಕೋಶಗಳು)") }, { type: "epi", l: L("an epidermal cell", "ಒಂದು ಹೊರಚರ್ಮ ಕೋಶ") }] },
    controls: focusControls,
    x0: { field: 1 },
    compute: (p, x) => { const S = x.counts?.stoma || 0, E = x.counts?.epi || 0; return { S, E, SI: S + E ? (S / (S + E)) * 100 : 0, fieldNo: x.field || 1 }; },
    readouts: [col("S", L("Stomata (S)", "ಪತ್ರರಂಧ್ರಗಳು (S)"), "", 0), col("E", L("Epidermal cells (E)", "ಹೊರಚರ್ಮ ಕೋಶಗಳು (E)"), "", 0), col("SI", L("Stomatal index", "ಪತ್ರರಂಧ್ರ ಸೂಚ್ಯಂಕ"), "%", 1)],
    canRecord: (p) => Math.abs(p.focus - 50) < 12,
    table: [col("fieldNo", L("Field", "ಕ್ಷೇತ್ರ"), "", 0), col("mag", L("Objective", "ವಸ್ತು ಮಸೂರ"), "×", 0), col("S", L("S", "S"), "", 0), col("E", L("E", "E"), "", 0), col("SI", L("SI", "SI"), "%", 1)],
    result: (rows) => L(`Mean stomatal index = ${mean(rows.map((r) => r.SI)).toFixed(1)} %`, `ಸರಾಸರಿ ಪತ್ರರಂಧ್ರ ಸೂಚ್ಯಂಕ = ${mean(rows.map((r) => r.SI)).toFixed(1)} %`),
    tip: L("Focus first (record works only when the image is sharp). Then move the slide to 3 fields and take the mean.", "ಮೊದಲು ಕೇಂದ್ರೀಕರಿಸಿ. ನಂತರ ಸ್ಲೈಡ್ ಅನ್ನು 3 ಕ್ಷೇತ್ರಗಳಿಗೆ ಸರಿಸಿ ಸರಾಸರಿ ತೆಗೆದುಕೊಳ್ಳಿ."),
    quiz: [
      q("Guard cells differ from other epidermal cells because they…", ["Have no nucleus", "Contain chloroplasts", "Are dead", "Have no wall"], 1, "Guard cells have chloroplasts and are kidney shaped."),
      q("Stomata are more on the lower surface of a leaf to…", ["Get more light", "Reduce water loss", "Absorb water", "Store food"], 1, "The lower surface is cooler and shaded, reducing transpiration."),
      q("Which stain is used for the leaf peel?", ["Iodine", "Safranin", "Methylene blue only", "Eosin only"], 1, "Dilute safranin stains the cell walls."),
      q("Glycerine is added to the mount to…", ["Stain cells", "Prevent drying", "Kill cells", "Increase magnification"], 1, "Glycerine keeps the peel from drying out."),
    ],
  },
  {
    id: "sslc-light-photosynthesis", subject: "biology", icon: "☀️",
    title: L("Light is necessary for photosynthesis", "ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆಗೆ ಬೆಳಕು ಅಗತ್ಯ"),
    aim: L("To show experimentally that light is necessary for photosynthesis using a leaf partly covered with black paper.", "ಕಪ್ಪು ಕಾಗದದಿಂದ ಭಾಗಶಃ ಮುಚ್ಚಿದ ಎಲೆಯನ್ನು ಬಳಸಿ ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆಗೆ ಬೆಳಕು ಅಗತ್ಯ ಎಂದು ಪ್ರಯೋಗದಿಂದ ತೋರಿಸುವುದು."),
    theory: L(
      "During photosynthesis green leaves make glucose using CO₂, water and sunlight; extra glucose is stored as starch. Iodine turns starch blue-black.\nThe plant is first destarched by keeping it in the dark for 48 hours. A strip of black paper on a leaf stops light from reaching that part, so no starch is made there.",
      "ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆಯಲ್ಲಿ ಹಸಿರು ಎಲೆಗಳು CO₂, ನೀರು ಮತ್ತು ಸೂರ್ಯನ ಬೆಳಕನ್ನು ಬಳಸಿ ಗ್ಲೂಕೋಸ್ ತಯಾರಿಸುತ್ತವೆ; ಹೆಚ್ಚುವರಿ ಗ್ಲೂಕೋಸ್ ಪಿಷ್ಟವಾಗಿ ಸಂಗ್ರಹವಾಗುತ್ತದೆ. ಅಯೋಡಿನ್ ಪಿಷ್ಟವನ್ನು ನೀಲಿ-ಕಪ್ಪಾಗಿಸುತ್ತದೆ.\nಸಸ್ಯವನ್ನು ಮೊದಲು 48 ಗಂಟೆ ಕತ್ತಲಲ್ಲಿಟ್ಟು ಪಿಷ್ಟರಹಿತಗೊಳಿಸಲಾಗುತ್ತದೆ. ಎಲೆಯ ಮೇಲಿನ ಕಪ್ಪು ಕಾಗದದ ಪಟ್ಟಿ ಆ ಭಾಗಕ್ಕೆ ಬೆಳಕು ತಲುಪದಂತೆ ತಡೆಯುವುದರಿಂದ ಅಲ್ಲಿ ಪಿಷ್ಟ ಉಂಟಾಗುವುದಿಲ್ಲ."
    ),
    formula: "6CO₂ + 6H₂O —(light, chlorophyll)→ C₆H₁₂O₆ + 6O₂",
    apparatus: L("Potted plant, black paper strips, clips, beaker, alcohol, water bath, iodine solution, petri dish", "ಕುಂಡದ ಸಸ್ಯ, ಕಪ್ಪು ಕಾಗದದ ಪಟ್ಟಿಗಳು, ಕ್ಲಿಪ್‌ಗಳು, ಬೀಕರ್, ಆಲ್ಕೋಹಾಲ್, ನೀರಿನ ತೊಟ್ಟಿ, ಅಯೋಡಿನ್ ದ್ರಾವಣ, ಪೆಟ್ರಿ ಡಿಶ್"),
    procedure: [
      "Keep a potted plant in the dark for 48 hours to destarch it.",
      "Cover part of a leaf on both sides with black paper strips.",
      "Keep the plant in bright sunlight for 4–6 hours.",
      "Pluck the leaf, remove the paper, boil it in water and then in alcohol (on a water bath) to remove chlorophyll.",
      "Wash and add iodine solution; observe the colour of covered and uncovered parts.",
    ],
    sim: "leaf",
    controls: [
      sel("destarch", L("Destarched in dark for 48 h?", "48 ಗಂಟೆ ಕತ್ತಲಲ್ಲಿಟ್ಟು ಪಿಷ್ಟರಹಿತಗೊಳಿಸಲಾಗಿದೆಯೇ?"), [opt("yes", "Yes", "ಹೌದು"), opt("no", "No", "ಇಲ್ಲ")], "yes"),
      sel("cover", L("Black paper strip", "ಕಪ್ಪು ಕಾಗದದ ಪಟ್ಟಿ"), [opt("strip", "Covered strip", "ಮುಚ್ಚಿದ ಪಟ್ಟಿ"), opt("none", "No cover", "ಮುಚ್ಚಿಲ್ಲ")], "strip"),
      sl("hours", L("Hours in sunlight", "ಸೂರ್ಯನ ಬೆಳಕಿನಲ್ಲಿ ಗಂಟೆಗಳು"), 0, 8, 1, 5, "h"),
    ],
    compute: (p, x) => ({ dName: p.destarch === "yes" ? L("Yes", "ಹೌದು") : L("No", "ಇಲ್ಲ"), covered: x.covered, exposed: x.exposed }),
    readouts: [col("exposed", L("Exposed part", "ತೆರೆದ ಭಾಗ")), col("covered", L("Covered part", "ಮುಚ್ಚಿದ ಭಾಗ"))],
    canRecord: (p, r, x) => (x.step || 0) >= 4,
    table: [col("dName", L("Destarched", "ಪಿಷ್ಟರಹಿತ")), col("hours", L("Sunlight", "ಸೂರ್ಯನ ಬೆಳಕು"), "h", 0), col("exposed", L("Exposed part", "ತೆರೆದ ಭಾಗ")), col("covered", L("Covered part", "ಮುಚ್ಚಿದ ಭಾಗ"))],
    result: () => L("Only the parts that received light turned blue-black — light is necessary for photosynthesis.", "ಬೆಳಕು ಪಡೆದ ಭಾಗಗಳು ಮಾತ್ರ ನೀಲಿ-ಕಪ್ಪಾದವು — ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆಗೆ ಬೆಳಕು ಅಗತ್ಯ."),
    tip: L("Repeat with 'Destarched = No'. Why does the whole leaf turn blue-black now?", "'ಪಿಷ್ಟರಹಿತ = ಇಲ್ಲ' ಆಯ್ಕೆಮಾಡಿ ಮತ್ತೆ ಮಾಡಿ. ಈಗ ಇಡೀ ಎಲೆ ಏಕೆ ನೀಲಿ-ಕಪ್ಪಾಗುತ್ತದೆ?"),
    quiz: [
      q("Why is the plant kept in the dark for 48 hours?", ["To kill it", "To remove stored starch", "To increase chlorophyll", "To open stomata"], 1, "Destarching ensures any starch found later was made during the experiment."),
      q("Leaf is boiled in alcohol to…", ["Kill bacteria", "Remove chlorophyll", "Add starch", "Soften the paper"], 1, "Alcohol dissolves chlorophyll so the iodine colour can be seen."),
      q("Alcohol is heated on a water bath because it is…", ["Toxic", "Highly inflammable", "Very heavy", "Coloured"], 1, "Direct flame could set alcohol on fire."),
      q("Covered part of the leaf turns…", ["Blue-black", "Brown/yellow", "Green", "Red"], 1, "No light → no starch → iodine stays brown."),
    ],
  },
  {
    id: "sslc-respiration", subject: "biology", icon: "🌱",
    title: L("CO₂ is released during respiration", "ಉಸಿರಾಟದಲ್ಲಿ CO₂ ಬಿಡುಗಡೆಯಾಗುತ್ತದೆ"),
    aim: L("To show experimentally that carbon dioxide is given out during respiration by germinating seeds.", "ಮೊಳಕೆಯೊಡೆಯುವ ಬೀಜಗಳು ಉಸಿರಾಟದಲ್ಲಿ ಕಾರ್ಬನ್ ಡೈಆಕ್ಸೈಡ್ ಬಿಡುಗಡೆ ಮಾಡುತ್ತವೆ ಎಂದು ಪ್ರಯೋಗದಿಂದ ತೋರಿಸುವುದು."),
    theory: L(
      "Germinating seeds respire actively: they take in O₂ and give out CO₂. Potassium hydroxide (KOH) kept in the flask absorbs the CO₂ produced.\nAs CO₂ is absorbed, a partial vacuum forms in the flask, so the water in the delivery tube rises. Boiled seeds are dead and do not respire, so water does not rise.",
      "ಮೊಳಕೆಯೊಡೆಯುವ ಬೀಜಗಳು ಸಕ್ರಿಯವಾಗಿ ಉಸಿರಾಡುತ್ತವೆ: O₂ ತೆಗೆದುಕೊಂಡು CO₂ ಬಿಡುಗಡೆ ಮಾಡುತ್ತವೆ. ಫ್ಲಾಸ್ಕ್‌ನಲ್ಲಿಟ್ಟ ಪೊಟ್ಯಾಸಿಯಮ್ ಹೈಡ್ರಾಕ್ಸೈಡ್ (KOH) ಉತ್ಪತ್ತಿಯಾದ CO₂ ಅನ್ನು ಹೀರಿಕೊಳ್ಳುತ್ತದೆ.\nCO₂ ಹೀರಲ್ಪಟ್ಟಂತೆ ಫ್ಲಾಸ್ಕ್‌ನಲ್ಲಿ ಭಾಗಶಃ ನಿರ್ವಾತ ಉಂಟಾಗಿ ನಳಿಕೆಯಲ್ಲಿ ನೀರು ಏರುತ್ತದೆ. ಬೇಯಿಸಿದ ಬೀಜಗಳು ಸತ್ತಿರುವುದರಿಂದ ಉಸಿರಾಡುವುದಿಲ್ಲ; ನೀರು ಏರುವುದಿಲ್ಲ."
    ),
    formula: "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + energy\n2KOH + CO₂ → K₂CO₃ + H₂O",
    apparatus: L("Conical flask, germinating seeds, small test tube with KOH, thread, bent delivery tube, cork, beaker of water, vaseline", "ಶಂಖಾಕಾರದ ಫ್ಲಾಸ್ಕ್, ಮೊಳಕೆಯೊಡೆಯುವ ಬೀಜಗಳು, KOH ಸಹಿತ ಸಣ್ಣ ನಳಿಕೆ, ದಾರ, ಬಾಗಿದ ನಳಿಕೆ, ಬಿರಡೆ, ನೀರಿನ ಬೀಕರ್, ವ್ಯಾಸಲೀನ್"),
    procedure: [
      "Take germinating seeds in a conical flask.",
      "Hang a small test tube with KOH solution inside the flask using a thread.",
      "Close the flask with a cork having a bent delivery tube; make it airtight with vaseline.",
      "Dip the other end of the tube in a beaker of water and mark the initial level.",
      "Observe the water level in the tube after one to two hours.",
    ],
    sim: "respiration",
    controls: [
      sel("seeds", L("Seeds", "ಬೀಜಗಳು"), [opt("germ", "Germinating", "ಮೊಳಕೆಯೊಡೆಯುವ"), opt("boiled", "Boiled", "ಬೇಯಿಸಿದ")], "germ"),
      sel("koh", L("KOH in flask", "ಫ್ಲಾಸ್ಕ್‌ನಲ್ಲಿ KOH"), [opt("yes", "Yes", "ಹೌದು"), opt("no", "No", "ಇಲ್ಲ")], "yes"),
      sl("temp", L("Room temperature", "ಕೊಠಡಿಯ ತಾಪ"), 15, 40, 1, 28, "°C"),
    ],
    x0: { time: 0 },
    compute: (p, x) => {
      const rate = p.seeds === "germ" && p.koh === "yes" ? 0.45 * Math.pow(2, (p.temp - 28) / 10) : p.seeds === "germ" ? 0.02 : 0;
      const riseAt = (m) => Math.min(80, rate * m);
      return { riseAt, rise: riseAt(x.time || 0), t: x.time || 0, setup: L(`${p.seeds === "germ" ? "Germinating" : "Boiled"}, KOH ${p.koh}`, `${p.seeds === "germ" ? "ಮೊಳಕೆಯೊಡೆಯುವ" : "ಬೇಯಿಸಿದ"}, KOH ${p.koh === "yes" ? "ಇದೆ" : "ಇಲ್ಲ"}`) };
    },
    readouts: [col("t", L("Time", "ಸಮಯ"), "min", 0), col("rise", L("Water rise", "ನೀರಿನ ಏರಿಕೆ"), "mm", 1)],
    table: [col("setup", L("Set-up", "ಜೋಡಣೆ")), col("t", L("Time", "ಸಮಯ"), "min", 0), col("rise", L("Rise", "ಏರಿಕೆ"), "mm", 1)],
    graph: { x: "t", y: "rise", fit: "linear" },
    result: (rows) => L(`Water rose up to ${Math.max(...rows.map((r) => r.rise)).toFixed(1)} mm — CO₂ is released during respiration and absorbed by KOH.`, `ನೀರು ${Math.max(...rows.map((r) => r.rise)).toFixed(1)} mm ವರೆಗೆ ಏರಿತು — ಉಸಿರಾಟದಲ್ಲಿ CO₂ ಬಿಡುಗಡೆಯಾಗಿ KOH ಹೀರಿಕೊಳ್ಳುತ್ತದೆ.`),
    tip: L("Start the timer, record every 10 minutes. Then try boiled seeds and 'No KOH' as controls.", "ಸಮಯ ಪ್ರಾರಂಭಿಸಿ, ಪ್ರತಿ 10 ನಿಮಿಷಕ್ಕೆ ದಾಖಲಿಸಿ. ನಂತರ ಬೇಯಿಸಿದ ಬೀಜ ಮತ್ತು 'KOH ಇಲ್ಲ' ಪ್ರಯತ್ನಿಸಿ."),
    quiz: [
      q("KOH is used in this experiment to…", ["Supply O₂", "Absorb CO₂", "Kill seeds", "Provide water"], 1, "KOH absorbs carbon dioxide."),
      q("Water rises in the delivery tube because…", ["Seeds absorb water", "CO₂ is absorbed creating a partial vacuum", "Temperature drops", "O₂ is produced"], 1, "Removal of CO₂ lowers pressure in the flask."),
      q("Why are germinating seeds used?", ["They are cheap", "They respire actively", "They photosynthesise", "They contain KOH"], 1, "Germinating seeds have a high rate of respiration."),
      q("The flask is made airtight so that…", ["Light cannot enter", "Air cannot enter from outside", "Seeds don't grow", "KOH doesn't evaporate"], 1, "Otherwise outside air would cancel the pressure drop."),
    ],
  },
  {
    id: "sslc-reproduction", subject: "biology", icon: "🦠",
    title: L("Binary fission in Amoeba and budding in yeast", "ಅಮೀಬಾದಲ್ಲಿ ದ್ವಿವಿದಳನ ಮತ್ತು ಈಸ್ಟ್‌ನಲ್ಲಿ ಮೊಗ್ಗುವಿಕೆ"),
    aim: L("To study binary fission in Amoeba and budding in yeast with the help of prepared slides.", "ಸಿದ್ಧ ಸ್ಲೈಡ್‌ಗಳ ಸಹಾಯದಿಂದ ಅಮೀಬಾದ ದ್ವಿವಿದಳನ ಮತ್ತು ಈಸ್ಟ್‌ನ ಮೊಗ್ಗುವಿಕೆ ಅಧ್ಯಯನ."),
    theory: L(
      "Asexual reproduction needs only one parent. In binary fission (Amoeba), the nucleus divides first, then the cytoplasm pinches in the middle, giving two identical daughter cells.\nIn budding (yeast), a small outgrowth (bud) forms on the parent cell. The nucleus divides and one part moves into the bud. The bud grows and may separate or form a chain of buds.",
      "ಅಲೈಂಗಿಕ ಸಂತಾನೋತ್ಪತ್ತಿಗೆ ಒಬ್ಬ ಪೋಷಕ ಮಾತ್ರ ಸಾಕು. ದ್ವಿವಿದಳನದಲ್ಲಿ (ಅಮೀಬಾ) ಮೊದಲು ಕೋಶಕೇಂದ್ರ ವಿಭಜನೆಯಾಗಿ, ನಂತರ ಕೋಶದ್ರವ್ಯ ಮಧ್ಯದಲ್ಲಿ ಕಿರಿದಾಗಿ ಎರಡು ಒಂದೇ ರೀತಿಯ ಮರಿ ಕೋಶಗಳು ಉಂಟಾಗುತ್ತವೆ.\nಮೊಗ್ಗುವಿಕೆಯಲ್ಲಿ (ಈಸ್ಟ್) ಪೋಷಕ ಕೋಶದ ಮೇಲೆ ಸಣ್ಣ ಉಬ್ಬು (ಮೊಗ್ಗು) ಬೆಳೆಯುತ್ತದೆ. ಕೋಶಕೇಂದ್ರ ವಿಭಜನೆಯಾಗಿ ಒಂದು ಭಾಗ ಮೊಗ್ಗಿಗೆ ಹೋಗುತ್ತದೆ. ಮೊಗ್ಗು ಬೆಳೆದು ಬೇರ್ಪಡಬಹುದು ಅಥವಾ ಸರಪಳಿ ರೂಪಿಸಬಹುದು."
    ),
    apparatus: L("Prepared slides of Amoeba (binary fission) and yeast (budding), compound microscope", "ಅಮೀಬಾ (ದ್ವಿವಿದಳನ) ಮತ್ತು ಈಸ್ಟ್ (ಮೊಗ್ಗುವಿಕೆ) ಸಿದ್ಧ ಸ್ಲೈಡ್‌ಗಳು, ಸಂಯುಕ್ತ ಸೂಕ್ಷ್ಮದರ್ಶಕ"),
    procedure: [
      "Place the prepared slide of Amoeba on the stage of the microscope.",
      "Focus under low power, then high power.",
      "Observe the stages of binary fission and draw them.",
      "Repeat with the yeast slide and identify the parent cell and buds.",
    ],
    sim: "microscope",
    opts: { specimen: "reproduction", findFor: {
      amoeba: [{ type: "nucleus", l: L("a nucleus", "ಒಂದು ಕೋಶಕೇಂದ್ರ") }, { type: "pseudopodia", l: L("a pseudopodium", "ಒಂದು ಮಿಥ್ಯಪಾದ") }],
      yeast: [{ type: "bud", l: L("the bud", "ಮೊಗ್ಗು") }, { type: "parent", l: L("the parent cell", "ಪೋಷಕ ಕೋಶ") }],
    } },
    controls: [
      sel("org", L("Slide", "ಸ್ಲೈಡ್"), [opt("amoeba", "Amoeba", "ಅಮೀಬಾ"), opt("yeast", "Yeast", "ಈಸ್ಟ್")], "amoeba"),
      sl("stage", L("Time / stage", "ಸಮಯ / ಹಂತ"), 0, 100, 1, 10, "%"),
      sl("focus", L("Fine focus knob", "ಸೂಕ್ಷ್ಮ ಕೇಂದ್ರೀಕರಣ ಗುಂಡಿ"), 0, 100, 1, 40),
    ],
    compute: (p) => {
      const s = p.stage;
      const am = s < 20 ? ["Parent Amoeba with one nucleus", "ಒಂದು ಕೋಶಕೇಂದ್ರದ ಪೋಷಕ ಅಮೀಬಾ"] : s < 50 ? ["Nucleus divides (karyokinesis)", "ಕೋಶಕೇಂದ್ರ ವಿಭಜನೆ"] : s < 85 ? ["Cytoplasm constricts in the middle", "ಕೋಶದ್ರವ್ಯ ಮಧ್ಯದಲ್ಲಿ ಕಿರಿದಾಗುತ್ತದೆ"] : ["Two daughter Amoebae formed", "ಎರಡು ಮರಿ ಅಮೀಬಾಗಳು"];
      const ye = s < 25 ? ["Small bud appears on parent", "ಪೋಷಕದ ಮೇಲೆ ಸಣ್ಣ ಮೊಗ್ಗು"] : s < 60 ? ["Bud grows; nucleus moves into it", "ಮೊಗ್ಗು ಬೆಳೆಯುತ್ತದೆ; ಕೋಶಕೇಂದ್ರ ಒಳಗೆ"] : s < 85 ? ["Bud nearly as big as parent", "ಮೊಗ್ಗು ಪೋಷಕದಷ್ಟು ದೊಡ್ಡದು"] : ["Bud forms its own bud — chain", "ಮೊಗ್ಗಿಗೂ ಮೊಗ್ಗು — ಸರಪಳಿ"];
      const d = p.org === "yeast" ? ye : am;
      return { desc: L(d[0], d[1]), orgName: p.org === "yeast" ? L("Yeast", "ಈಸ್ಟ್") : L("Amoeba", "ಅಮೀಬಾ") };
    },
    readouts: [col("desc", L("What you see", "ನೀವು ನೋಡುವುದು"))],
    table: [col("orgName", L("Organism", "ಜೀವಿ")), col("stage", L("Stage", "ಹಂತ"), "%", 0), col("desc", L("Observation", "ಅವಲೋಕನ"))],
    tip: L("Drag the stage slider slowly from 0 to 100 and record four stages for each organism.", "ಹಂತ ಸ್ಲೈಡರ್ ಅನ್ನು ನಿಧಾನವಾಗಿ 0 ರಿಂದ 100 ಕ್ಕೆ ಎಳೆದು ಪ್ರತಿ ಜೀವಿಗೆ ನಾಲ್ಕು ಹಂತ ದಾಖಲಿಸಿ."),
    quiz: [
      q("In binary fission, what divides first?", ["Cytoplasm", "Nucleus", "Cell wall", "Vacuole"], 1, "Karyokinesis precedes cytokinesis."),
      q("Budding is seen in…", ["Amoeba", "Yeast and Hydra", "Plasmodium", "Paramecium only"], 1, "Yeast and Hydra reproduce by budding."),
      q("Daughter cells formed by binary fission are…", ["Different from parent", "Genetically identical", "Haploid", "Always four"], 1, "Asexual reproduction gives clones."),
      q("Plasmodium reproduces by…", ["Binary fission", "Multiple fission", "Budding", "Spore formation"], 1, "Plasmodium shows multiple fission."),
    ],
  },
  {
    id: "sslc-dicot-seed", subject: "biology", icon: "🫘",
    title: L("Parts of a dicot seed", "ದ್ವಿದಳ ಬೀಜದ ಭಾಗಗಳು"),
    aim: L("To identify the different parts of an embryo of a dicot seed (bean / gram).", "ದ್ವಿದಳ ಬೀಜದ (ಹುರುಳಿ / ಕಡಲೆ) ಭ್ರೂಣದ ವಿವಿಧ ಭಾಗಗಳನ್ನು ಗುರುತಿಸುವುದು."),
    theory: L(
      "A dicot seed has two cotyledons that store food. The seed is covered by a protective seed coat. The hilum is the scar where the seed was attached to the fruit; the micropyle is a tiny pore near it.\nThe embryo axis has a plumule, which grows into the shoot, and a radicle, which grows into the root.",
      "ದ್ವಿದಳ ಬೀಜದಲ್ಲಿ ಆಹಾರ ಸಂಗ್ರಹಿಸುವ ಎರಡು ಬೀಜದಳಗಳಿವೆ. ಬೀಜವನ್ನು ರಕ್ಷಣಾತ್ಮಕ ಬೀಜ ಕವಚ ಆವರಿಸಿದೆ. ಹೈಲಮ್ ಬೀಜ ಫಲಕ್ಕೆ ಅಂಟಿಕೊಂಡಿದ್ದ ಗುರುತು; ಅದರ ಹತ್ತಿರ ಸಣ್ಣ ರಂಧ್ರ ಮೈಕ್ರೋಪೈಲ್.\nಭ್ರೂಣ ಅಕ್ಷದಲ್ಲಿ ಕಾಂಡವಾಗಿ ಬೆಳೆಯುವ ಪ್ಲುಮ್ಯೂಲ್ ಮತ್ತು ಬೇರಾಗಿ ಬೆಳೆಯುವ ರ್ಯಾಡಿಕಲ್ ಇವೆ."
    ),
    apparatus: L("Soaked bean or gram seeds, petri dish, needle, magnifying glass", "ನೆನೆಸಿದ ಹುರುಳಿ ಅಥವಾ ಕಡಲೆ ಬೀಜಗಳು, ಪೆಟ್ರಿ ಡಿಶ್, ಸೂಜಿ, ಭೂತಗನ್ನಡಿ"),
    procedure: [
      "Soak bean seeds in water overnight.",
      "Observe the outside: seed coat, hilum and micropyle.",
      "Gently remove the seed coat and open the two cotyledons.",
      "Observe the embryo axis with a magnifying lens and identify plumule and radicle.",
      "Draw a labelled diagram.",
    ],
    sim: "label", opts: { diagram: "seed" },
    compute: (p, x) => ({ score: x.score || 0, tries: x.tries || 0, part: x.part, ok: x.ok }),
    readouts: [col("score", L("Correct", "ಸರಿ"), "", 0), col("tries", L("Attempts", "ಪ್ರಯತ್ನಗಳು"), "", 0)],
    canRecord: (p, r, x) => !!x.part,
    table: [col("part", L("Part asked", "ಕೇಳಿದ ಭಾಗ")), col("ok", L("Your answer", "ನಿಮ್ಮ ಉತ್ತರ"))],
    result: (rows) => L(`${rows.filter((r) => r.ok?.en?.startsWith("✓")).length} of ${rows.length} parts identified correctly.`, `${rows.length} ರಲ್ಲಿ ${rows.filter((r) => r.ok?.en?.startsWith("✓")).length} ಭಾಗಗಳು ಸರಿಯಾಗಿ ಗುರುತಿಸಲಾಗಿದೆ.`),
    tip: L("Get all five parts right without opening the labels!", "ಹೆಸರುಗಳನ್ನು ತೆರೆಯದೆ ಎಲ್ಲಾ ಐದು ಭಾಗಗಳನ್ನು ಸರಿಯಾಗಿ ಗುರುತಿಸಿ!"),
    quiz: [
      q("Which part of the embryo becomes the root?", ["Plumule", "Radicle", "Cotyledon", "Hilum"], 1, "The radicle grows down into the primary root."),
      q("Food for the growing embryo is stored in…", ["Seed coat", "Cotyledons", "Micropyle", "Plumule"], 1, "In dicots, cotyledons are the food store."),
      q("Water enters the seed mainly through the…", ["Hilum", "Micropyle", "Radicle", "Cotyledon"], 1, "The micropyle is a small pore for water entry."),
      q("How many cotyledons does a dicot seed have?", ["One", "Two", "Three", "None"], 1, "Di = two."),
    ],
  },
  {
    id: "sslc-flower", subject: "biology", icon: "🌺",
    title: L("Parts of a flower (Hibiscus)", "ಹೂವಿನ ಭಾಗಗಳು (ದಾಸವಾಳ)"),
    aim: L("To study the reproductive and non-reproductive parts of a bisexual flower.", "ದ್ವಿಲಿಂಗಿ ಹೂವಿನ ಸಂತಾನೋತ್ಪತ್ತಿ ಮತ್ತು ಸಂತಾನೋತ್ಪತ್ತಿಯೇತರ ಭಾಗಗಳ ಅಧ್ಯಯನ."),
    theory: L(
      "A flower is the reproductive organ of a plant. Sepals (calyx) protect the bud and petals (corolla) attract insects.\nThe stamen is the male part: anther (makes pollen) on a filament. The pistil (carpel) is the female part: stigma (receives pollen), style and ovary (contains ovules). A flower with both stamens and pistil is bisexual.",
      "ಹೂವು ಸಸ್ಯದ ಸಂತಾನೋತ್ಪತ್ತಿ ಅಂಗ. ಪುಷ್ಪಪತ್ರಗಳು ಮೊಗ್ಗನ್ನು ರಕ್ಷಿಸುತ್ತವೆ, ದಳಗಳು ಕೀಟಗಳನ್ನು ಆಕರ್ಷಿಸುತ್ತವೆ.\nಕೇಸರ ಗಂಡು ಭಾಗ: ತಂತುವಿನ ಮೇಲಿನ ಪರಾಗಕೋಶ (ಪರಾಗ ಉತ್ಪಾದನೆ). ಶಲಾಕೆ (ಅಂಡಪ) ಹೆಣ್ಣು ಭಾಗ: ಶಲಾಕಾಗ್ರ (ಪರಾಗ ಸ್ವೀಕರಿಸುತ್ತದೆ), ಶಲಾಕೆ ಮತ್ತು ಅಂಡಕಗಳಿರುವ ಅಂಡಾಶಯ. ಎರಡೂ ಇರುವ ಹೂವು ದ್ವಿಲಿಂಗಿ."
    ),
    apparatus: L("Fresh Hibiscus flower, blade, needle, hand lens, white paper", "ತಾಜಾ ದಾಸವಾಳ ಹೂವು, ಬ್ಲೇಡ್, ಸೂಜಿ, ಭೂತಗನ್ನಡಿ, ಬಿಳಿ ಕಾಗದ"),
    procedure: [
      "Observe the flower and count sepals and petals.",
      "Cut the flower vertically (longitudinal section) with a blade.",
      "Identify stamens with anthers and the pistil with stigma, style and ovary.",
      "Observe ovules inside the ovary with a hand lens.",
      "Draw and label the L.S. of the flower.",
    ],
    sim: "label", opts: { diagram: "flower" },
    compute: (p, x) => ({ score: x.score || 0, tries: x.tries || 0, part: x.part, ok: x.ok }),
    readouts: [col("score", L("Correct", "ಸರಿ"), "", 0), col("tries", L("Attempts", "ಪ್ರಯತ್ನಗಳು"), "", 0)],
    canRecord: (p, r, x) => !!x.part,
    table: [col("part", L("Part asked", "ಕೇಳಿದ ಭಾಗ")), col("ok", L("Your answer", "ನಿಮ್ಮ ಉತ್ತರ"))],
    quiz: [
      q("The male reproductive part of a flower is the…", ["Pistil", "Stamen", "Sepal", "Petal"], 1, "Stamen = anther + filament."),
      q("Pollen grains are produced in the…", ["Stigma", "Ovary", "Anther", "Style"], 2, "Anthers produce pollen."),
      q("After fertilisation the ovary develops into the…", ["Seed", "Fruit", "Flower", "Leaf"], 1, "Ovary → fruit, ovules → seeds."),
      q("Papaya and watermelon flowers are…", ["Bisexual", "Unisexual", "Without petals", "Without ovary"], 1, "They have separate male and female flowers."),
    ],
  },
];
