# Virtual Science Lab

An interactive virtual laboratory for **SSLC (Class 10), 1st PUC and 2nd PUC** students, aligned with the Karnataka board practical lists.

- 54 experiments: 6 Physics + 6 Chemistry + 6 Biology for each class
- Every experiment has: **Aim & Theory → live Simulation → Observation table + Graph → Procedure → Viva quiz**
- Students change values with sliders and buttons, the simulation responds live, and readings are recorded into a lab-record style table that plots its own graph (with best-fit line and slope)
- English / ಕನ್ನಡ toggle (menus, titles, aim, theory and apparatus in Kannada)
- Demo login and progress tracking (saved in the browser)

## Demo login

- Username: `student`
- Password: `lab123`

## How to run

You need **Node.js 20.19 or newer** (download the LTS version from https://nodejs.org).

```bash
npm install
npm run dev
```

Then open the link shown in the terminal (usually http://localhost:5173).

To make a production build: `npm run build` (output goes to `dist/`).

## Project structure

```
src/
  App.jsx                 routes, header, language toggle
  i18n.jsx                English / Kannada UI strings
  store.js                demo login + progress (localStorage)
  pages/
    LoginPage.jsx
    ClassPage.jsx         choose SSLC / 1st PUC / 2nd PUC
    SubjectPage.jsx       choose Physics / Chemistry / Biology
    ExperimentListPage.jsx
    ExperimentPage.jsx    the 5 tabs for every experiment
  components/
    Graph.jsx             SVG graph with best-fit line
    Quiz.jsx              viva MCQ quiz
  sims/                   reusable canvas simulations
    physics.jsx           circuit, meter bridge, optical bench, refraction, pendulum, spring, vernier/screw gauge, sonometer, resonance tube
    chemistry.jsx         titration, pH tester, test-tube reaction bench, reaction rate, chromatography, balance, melting point
    biology.jsx           microscope, label-the-diagram, meiosis stage quiz, osmosis, photosynthesis, leaf starch test, respiration, enzyme, genetics, quadrat
  data/
    sslc.js puc1.js puc2.js   the 54 experiments (text, controls, formulas, quiz)
    helpers.js
```

## Adding a new experiment

Each experiment is a plain object in `src/data/*.js`. Pick an existing simulation (`sim: "circuit"`, `"titration"`, `"microscope"`, …), define its `controls`, a `compute(p, x)` function that returns the readings, the `table` columns, an optional `graph`, and the `quiz`. No new page file is needed.
