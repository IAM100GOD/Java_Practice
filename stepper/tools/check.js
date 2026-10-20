#!/usr/bin/env node
/* Smoke test: loads helpers + every problem in the manifest, runs each with its default
   inputs and every sample, and renders every frame. Catches typos/ReferenceErrors without a browser.
   Usage:  node stepper/tools/check.js            (from Java_Practice/)                     */
const fs = require('fs'), vm = require('vm'), path = require('path');
const BASE = path.join(__dirname, '..');
const ctx = { console, window: {}, document: { getElementById: () => null } };
vm.createContext(ctx);
const load = f => vm.runInContext(fs.readFileSync(path.join(BASE, f), 'utf8'), ctx, { filename: f });

load('js/helpers.js');
load('problems/manifest.js');
let fails = 0;
for (const f of ctx.window.PROBLEM_FILES) {
  try { load(f); } catch (e) { fails++; console.log(`LOAD FAIL ${f}: ${e.message}`); }
}
const P = vm.runInContext('P', ctx);
const ids = new Set();
for (const p of P) {
  if (ids.has(p.id)) { fails++; console.log(`DUPLICATE id ${p.id}`); }
  ids.add(p.id);
  for (const k of ['id', 'title', 'level', 'file', 'statement', 'code', 'inputs', 'run', 'render'])
    if (!(k in p)) { fails++; console.log(`MISSING ${k} in ${p.id}`); }
  const cases = [p.inputs.map(i => i.def), ...(p.samples || [])];
  for (const vals of cases) {
    const inp = {}; p.inputs.forEach((i, k) => inp[i.key] = vals[k] ?? '');
    try {
      const F = p.run(inp);
      F.forEach(fr => { p.render(fr.st); if (fr.line && typeof fr.line === 'string' && !p.code.includes('@' + fr.line)) throw new Error(`frame line "@${fr.line}" not tagged in code`); });
    } catch (e) {
      if (/must|Enter|Use |between|Format|non-negative|integers|square/.test(e.message)) continue; // input validation, fine
      fails++; console.log(`RUN FAIL ${p.id} [${vals.join(' | ')}]: ${e.message}`);
    }
  }
}
console.log(`${P.length} problems checked, ${fails} problem(s) found`);
process.exit(fails ? 1 : 0);
