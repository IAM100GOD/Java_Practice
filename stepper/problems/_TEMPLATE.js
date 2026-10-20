/* TEMPLATE: copy to problems/<source folder>/<id>.js, fill in, then run
     python3 tools/build_manifest.py   and   node tools/check.js
   Files starting with "_" are ignored by the manifest. */
P.push({
  id: 'my-problem',                 // unique, used in the URL hash
  title: 'My Problem',
  level: 'easy',                    // easy | medium | hard (sidebar dot colour)
  file: 'MyProblem.java',           // Java file name shown in the header
  dir: 'AccentureQuestions',        // source folder; decides where it appears in the sidebar tree
  statement: 'Problem statement. HTML allowed, e.g. <code>x</code>.',
  technique: 'Short technique name', time: 'O(n)', space: 'O(1)',
  inputs: [{ key: 'a', label: 'arr', def: '1, 2, 3' }],          // add narrow: true for short fields
  samples: [['1, 2, 3'], ['4, 5']],                               // one array of values per sample
  // Tag a line with "@name" at the end; frames point to it with line: 'name'.
  code: "public static int solve(int[] arr) {\n    int sum = 0; @init\n    for (int x : arr) sum += x; @add\n    return sum; @ret\n}",
  steps: ['Explanation bullet 1.', 'Explanation bullet 2.'],
  cmp: [['Approach', 'Time', 'Space']],
  eff: 'Why the chosen approach is efficient.',
  run({ a }) {
    const A = a.split(/[,\s]+/).filter(Boolean).map(Number);
    if (A.some(x => !Number.isFinite(x))) throw new Error('Enter numbers.');
    const F = []; let sum = 0, i = -1;
    const st = () => ({ A, i, sum });                                // state snapshot passed to render()
    F.push({ line: 'init', msg: 'sum = 0.', vars: { sum }, st: st() });
    for (i = 0; i < A.length; i++) { sum += A[i]; F.push({ line: 'add', msg: `sum = ${sum}.`, vars: { i, sum }, st: st() }); }
    i = -1;
    F.push({ line: 'ret', msg: `Return ${sum}.`, vars: { result: sum }, st: st(), result: String(sum) });
    return F;
  },
  render(st) {
    // helpers from js/helpers.js: cells(items, {top, bot, cls, idx, noTop, wide}), block(label, html), tokens(arr, cls), callStackView(frames)
    return block('arr', cells(st.A, { top: k => k === st.i ? [['i', 'c-acc']] : [], cls: k => k === st.i ? 'cur t1' : k < st.i ? 'ok' : '' }));
  }
});
