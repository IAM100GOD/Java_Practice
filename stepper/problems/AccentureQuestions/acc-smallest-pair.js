/* A6. Product of Smallest Pair (Accenture) */
P.push({
  id: 'acc-smallest-pair', title: 'Product of Smallest Pair', level: 'easy', group: 'accenture', file: 'ProductSmallestPair.java', dir: 'AccentureQuestions',
  statement: 'Given a target <code>sum</code> and an array <code>arr</code>, find the two smallest elements. If their sum \u2264 <code>sum</code>, return their product; otherwise return 0. If the array has fewer than 2 elements, return \u22121. Example: sum = 9, arr = [5, 2, 4, 3, 9, 7, 1] \u2192 1 + 2 = 3 \u2264 9 \u2192 2.',
  technique: 'Single pass tracking min1 and min2', time: 'O(n)', space: 'O(1)',
  inputs: [{ key: 't', label: 'sum', def: '9', narrow: true }, { key: 'a', label: 'arr', def: '5, 2, 4, 3, 9, 7, 1' }],
  samples: [['9', '5, 2, 4, 3, 9, 7, 1'], ['4', '8, 3, 6, 2'], ['10', '4, 4, 7'], ['5', '3']],
  code: "public static int productSmallestPair(int sum, int[] arr) {\n    int n = arr.length;\n    if (n < 2) return -1; @short\n    int min1 = Integer.MAX_VALUE, min2 = Integer.MAX_VALUE; @init\n    for (int x : arr) {\n        if (x < min1) { min2 = min1; min1 = x; }   // new smallest @new1\n        else if (x < min2) { min2 = x; }          // new second smallest @new2\n        // otherwise x is not among the two smallest: skip @skip\n    }\n    return (min1 + min2 <= sum) ? min1 * min2 : 0; @ret\n}",
  steps: [
    'Sorting and taking the first two works, but costs O(n log n). We only need two values, so one pass is enough.',
    'Keep <code>min1</code> (smallest) and <code>min2</code> (second smallest), both starting at +\u221e.',
    'If x beats min1, the old min1 slides down to min2 and x takes its place. Else if x beats only min2, replace min2.',
    'At the end, check <code>min1 + min2 \u2264 sum</code> and return the product or 0.',
    'Duplicates are fine: for [4, 4, 7] the pair is 4 and 4, because the second 4 goes into min2.'
  ],
  cmp: [['Check every pair', 'O(n\u00b2)', 'O(1)'], ['Sort, take arr[0], arr[1]', 'O(n log n)', 'O(1)\u2013O(n)'], ['One pass with min1, min2', 'O(n)', 'O(1)']],
  eff: 'Tracking two running minimums touches each element once and does not modify the array, unlike sorting.',
  run({ t, a }) {
    const S = Number(t); const A = a.split(/[,\s]+/).filter(Boolean).map(Number); const n = A.length;
    if (!Number.isInteger(S) || A.some(x => !Number.isInteger(x))) throw new Error('sum and arr must be integers.');
    if (n > 14) throw new Error('Use 14 numbers or fewer.');
    const F = []; let m1 = Infinity, m2 = Infinity, i1 = -1, i2 = -1, k = -1;
    const fmt = v => v === Infinity ? '\u221e' : v;
    const st = () => ({ A, k, i1, i2 });
    if (n < 2) { F.push({ line: 'short', msg: `Only ${n} element(s). Return -1.`, vars: { n, result: -1 }, st: st(), result: '-1' }); return F; }
    F.push({ line: 'init', msg: 'min1 and min2 start at +\u221e so the first values always replace them.', vars: { min1: '\u221e', min2: '\u221e' }, st: st() });
    for (k = 0; k < n; k++) {
      const x = A[k];
      if (x < m1) { const o = m1; m2 = m1; i2 = i1; m1 = x; i1 = k; F.push({ line: 'new1', msg: `${x} < min1 (${fmt(o)}). Old min1 moves to min2; min1 = ${x}.`, vars: { x, min1: m1, min2: fmt(m2) }, st: st() }); }
      else if (x < m2) { const o = m2; m2 = x; i2 = k; F.push({ line: 'new2', msg: `${x} \u2265 min1 (${m1}) but < min2 (${fmt(o)}). min2 = ${x}.`, vars: { x, min1: m1, min2: m2 }, st: st() }); }
      else F.push({ line: 'skip', msg: `${x} is not smaller than min2 (${m2}). Skip.`, vars: { x, min1: m1, min2: m2 }, st: st() });
    }
    k = -1; const ps = m1 + m2, res = ps <= S ? m1 * m2 : 0;
    F.push({ line: 'ret', msg: `Smallest pair: ${m1} and ${m2}. ${m1} + ${m2} = ${ps} ${ps <= S ? `\u2264 ${S}, so return ${m1} \u00d7 ${m2} = ${res}` : `> ${S}, so return 0`}.`, vars: { min1: m1, min2: m2, pairSum: ps, sum: S, result: res }, st: st(), result: String(res) });
    return F;
  },
  render(st) {
    return block('arr', cells(st.A, { top: j => [...(j === st.k ? [['x', 'c-acc']] : []), ...(j === st.i1 ? [['min1', 'c-ok']] : []), ...(j === st.i2 ? [['min2', 'c-p2']] : [])], cls: j => j === st.i1 ? 'ok' : j === st.i2 ? 't2' : j === st.k ? 'cur t1' : st.k >= 0 && j < st.k ? 'dim' : '' }));
  }
});
