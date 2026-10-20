/* A10. Sum of Second Largest (Even) & Second Smallest (Odd) (Accenture) */
P.push({
  id: 'acc-second-even-odd', title: '2nd Largest (Even) + 2nd Smallest (Odd)', level: 'easy', group: 'accenture', file: 'SecondLargestSmallestSum.java', dir: 'AccentureQuestions',
  statement: 'Split the array by <strong>position</strong>: even indexes (0, 2, 4, \u2026) and odd indexes (1, 3, 5, \u2026). Return (second largest of the even-index elements) + (second smallest of the odd-index elements). Example: [3, 2, 1, 7, 5, 4] \u2192 even [3, 1, 5] \u2192 3, odd [2, 7, 4] \u2192 4 \u2192 7. If a group has fewer than 2 elements, return \u22121.',
  technique: 'One pass, top-2 trackers per parity', time: 'O(n)', space: 'O(1)',
  inputs: [{ key: 'a', label: 'arr', def: '3, 2, 1, 7, 5, 4' }],
  samples: [['3, 2, 1, 7, 5, 4'], ['8, 1, 9, 6, 2, 3, 7, 5'], ['4, 4, 4, 4'], ['1, 2, 3']],
  code: "public static int sumSecondLargestSmallest(int[] arr) {\n    int n = arr.length;\n    if (n < 4) return -1; @short\n    int max1 = MIN, max2 = MIN;   // even positions\n    int min1 = MAX, min2 = MAX;   // odd positions @init\n    for (int i = 0; i < n; i++) {\n        int x = arr[i];\n        if (i % 2 == 0) {\n            if (x > max1) { max2 = max1; max1 = x; } @emax1\n            else if (x > max2) { max2 = x; } @emax2\n        } else {\n            if (x < min1) { min2 = min1; min1 = x; } @omin1\n            else if (x < min2) { min2 = x; } @omin2\n        }\n        // otherwise x is not in its group's top two: skip @skip\n    }\n    return max2 + min2; @ret\n}",
  steps: [
    '\u201cEven/odd\u201d refers to the <em>index</em>, not the value.',
    'Simple way: build two lists, sort both, take evens[len\u22122] and odds[1]. That is O(n log n).',
    'Better: one pass. For even indexes keep the two largest (max1 \u2265 max2); for odd indexes keep the two smallest (min1 \u2264 min2).',
    'Same update rule as \u201ctwo smallest\u201d: if x beats the best, the old best slides to second place; else if it beats only second place, replace that.',
    'Answer = max2 + min2. Duplicates count by position, so [4, 4, 4, 4] gives 4 + 4 = 8.'
  ],
  cmp: [['Split + sort both halves', 'O(n log n)', 'O(n)'], ['One pass with 4 trackers', 'O(n)', 'O(1)']],
  eff: 'Only the top two of each group matter, so four variables replace the two sorted lists.',
  run({ a }) {
    const A = a.split(/[,\s]+/).filter(Boolean).map(Number); const n = A.length;
    if (A.some(x => !Number.isInteger(x))) throw new Error('Enter integers.');
    if (n > 14) throw new Error('Use 14 numbers or fewer.');
    const F = []; let M1 = -Infinity, M2 = -Infinity, m1 = Infinity, m2 = Infinity, iM1 = -1, iM2 = -1, im1 = -1, im2 = -1, i = -1;
    const f = v => v === Infinity ? '+\u221e' : v === -Infinity ? '\u2212\u221e' : v;
    const V = () => ({ i, max1: f(M1), max2: f(M2), min1: f(m1), min2: f(m2) });
    const st = () => ({ A, i, iM1, iM2, im1, im2 });
    if (n < 4) { F.push({ line: 'short', msg: `n = ${n} < 4, so one of the groups has fewer than 2 elements. Return -1.`, vars: { n, result: -1 }, st: st(), result: '-1' }); return F; }
    F.push({ line: 'init', msg: 'Even trackers start at \u2212\u221e, odd trackers at +\u221e.', vars: V(), st: st() });
    for (i = 0; i < n; i++) {
      const x = A[i];
      if (i % 2 === 0) {
        if (x > M1) { M2 = M1; iM2 = iM1; M1 = x; iM1 = i; F.push({ line: 'emax1', msg: `i = ${i} (even): ${x} is the new largest. max2 = ${f(M2)}, max1 = ${x}.`, vars: V(), st: st() }); }
        else if (x > M2) { M2 = x; iM2 = i; F.push({ line: 'emax2', msg: `i = ${i} (even): ${x} \u2264 max1 but > old max2. max2 = ${x}.`, vars: V(), st: st() }); }
        else F.push({ line: 'skip', msg: `i = ${i} (even): ${x} is not in the top two. Skip.`, vars: V(), st: st() });
      } else {
        if (x < m1) { m2 = m1; im2 = im1; m1 = x; im1 = i; F.push({ line: 'omin1', msg: `i = ${i} (odd): ${x} is the new smallest. min2 = ${f(m2)}, min1 = ${x}.`, vars: V(), st: st() }); }
        else if (x < m2) { m2 = x; im2 = i; F.push({ line: 'omin2', msg: `i = ${i} (odd): ${x} \u2265 min1 but < old min2. min2 = ${x}.`, vars: V(), st: st() }); }
        else F.push({ line: 'skip', msg: `i = ${i} (odd): ${x} is not in the bottom two. Skip.`, vars: V(), st: st() });
      }
    }
    i = -1;
    F.push({ line: 'ret', msg: `2nd largest at even positions = ${M2}, 2nd smallest at odd positions = ${m2}. Sum = ${M2 + m2}.`, vars: { max2: M2, min2: m2, result: M2 + m2 }, st: st(), result: String(M2 + m2) });
    return F;
  },
  render(st) {
    const ev = st.A.map((v, k) => [v, k]).filter(([, k]) => k % 2 === 0), od = st.A.map((v, k) => [v, k]).filter(([, k]) => k % 2 === 1);
    const all = cells(st.A, { top: k => k === st.i ? [['i', 'c-acc']] : [], cls: k => k === st.i ? 'cur t1' : k % 2 === 0 ? 't2' : '' });
    const tag = (k) => k === st.iM1 ? [['max1', 'c-p2']] : k === st.iM2 ? [['max2', 'c-ok']] : k === st.im1 ? [['min1', 'c-p2']] : k === st.im2 ? [['min2', 'c-ok']] : [];
    const sub = (arr, lbl) => block(lbl, cells(arr.map(([v]) => v), { top: j => tag(arr[j][1]), bot: j => [[`[${arr[j][1]}]`, 'c-muted']], idx: false, cls: j => { const k = arr[j][1]; return k === st.iM2 || k === st.im2 ? 'ok' : k === st.i ? 'cur t1' : ''; } }));
    return block('arr (shaded = even index)', all) + `<div class="row2">${sub(ev, 'even positions \u2192 want 2nd largest')}${sub(od, 'odd positions \u2192 want 2nd smallest')}</div>`;
  }
});
