# Algorithm Stepper

Open `index.html` directly in a browser (double-click works, no server needed).

```
stepper/
├── index.html              page markup + loader
├── css/stepper.css         all styles
├── js/helpers.js           shared render helpers (cells, block, tokens, callStackView, hlJava…) + the P registry
├── js/engine.js            sidebar tree, stepping/playback, URL hash, copy button
├── problems/
│   ├── manifest.js         AUTO-GENERATED list of problem files
│   ├── _TEMPLATE.js        copy this to start a new problem
│   ├── interview_challenges/<id>.js
│   ├── scaler/adv_dsa_1/<topic>/<id>.js
│   └── AccentureQuestions/<id>.js
└── tools/
    ├── build_manifest.py   regenerates problems/manifest.js
    └── check.js            runs every problem + sample headlessly
```

## Adding a problem

1. Copy `problems/_TEMPLATE.js` to `problems/<folder>/<id>.js` and fill it in (`dir` should match the folder).
2. `python3 stepper/tools/build_manifest.py`
3. `node stepper/tools/check.js`
4. Refresh the page.

Shared visual helpers go in `js/helpers.js`; never put them inside a problem file.
