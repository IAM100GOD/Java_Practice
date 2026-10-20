/* 22. Delete one (Scaler) */
P.push({
  id: 'delete-one', title: 'Delete One', level: 'medium', group: 'scaler-gcd', file: 'DeleteOne.java', dir: 'scaler/adv_dsa_1/maths_gcd',
  statement: 'Remove exactly one element from A. Return the largest possible gcd of the remaining N − 1 elements. Constraints: N ≤ 10⁵, A[i] ≤ 10⁹.',
  technique: 'Prefix gcd + suffix gcd', time: 'O(N log M)', space: 'O(N)',
  inputs: [{ key: 'a', label: 'A', def: '12, 15, 18' }],
  samples: [['12, 15, 18'], ['5, 15, 30'], ['24, 36, 7, 60, 84'], ['8, 12, 16, 20, 9, 28']],
  code: "public int solve(int[] A) {\n    int n = A.length;\n    int[] prefix = new int[n], suffix = new int[n];\n\n    prefix[0] = A[0]; @pre0\n    for (int i = 1; i < n; i++) prefix[i] = gcd(prefix[i - 1], A[i]); @pre\n    suffix[n - 1] = A[n - 1]; @suf0\n    for (int i = n - 2; i >= 0; i--) suffix[i] = gcd(suffix[i + 1], A[i]); @suf\n\n    int best = 0;\n    for (int i = 0; i < n; i++) {\n        int left = (i == 0) ? 0 : prefix[i - 1];\n        int right = (i == n - 1) ? 0 : suffix[i + 1];\n        best = Math.max(best, gcd(left, right));    // gcd(0, x) = x @best\n    }\n    return best; @ret\n}\n\nprivate int gcd(int a, int b) {\n    while (b != 0) {\n        int t = a % b;\n        a = b;\n        b = t;\n    }\n    return a;\n}",
  steps: [
    'Removing A[i] leaves two pieces: everything to its left, <code>A[0..i−1]</code>, and everything to its right, <code>A[i+1..n−1]</code>.',
    'The gcd of the whole remainder is <code>gcd(gcd of left piece, gcd of right piece)</code>, because gcd can be combined in any order.',
    'Precompute <code>prefix[i] = gcd(A[0..i])</code> from left to right and <code>suffix[i] = gcd(A[i..n−1])</code> from right to left. Then removing A[i] gives <code>gcd(prefix[i−1], suffix[i+1])</code> with one lookup on each side.',
    'At the ends, one side is empty. Use 0 for it, because <code>gcd(0, x) = x</code>: 0 is divisible by everything, so it has no effect.',
    'Try every i and keep the maximum. gcd uses Euclid\'s algorithm: <code>gcd(a, b) = gcd(b, a % b)</code> until b = 0.'
  ],
  cmp: [['For each i, recompute gcd of the other N−1 elements', 'O(N² log M)', 'O(1)'], ['Prefix + suffix gcd arrays', 'O(N log M)', 'O(N)']],
  eff: 'Recomputing the gcd for each removed element means 10⁵ × 10⁵ = 10¹⁰ steps. Prefix and suffix arrays store the answer for every left piece and every right piece, so each removal costs one gcd call. Euclid\'s algorithm takes O(log M) steps, because the numbers at least halve every two iterations. The same prefix/suffix pattern works for any operation that combines in any order: product without self, max excluding one element, and so on.',
  gcd(a, b) { while (b) { [a, b] = [b, a % b]; } return a; },
  euclid(a, b) { const s = []; while (b) { s.push(`gcd(${a}, ${b})`); [a, b] = [b, a % b]; } s.push(`gcd(${a}, 0) = ${a}`); return s.join(' → '); },
  run({ a }) {
    const A = a.split(/[,\s]+/).filter(Boolean).map(Number); const n = A.length;
    if (n < 2 || A.some(x => !Number.isInteger(x) || x < 1 || x > 1e9)) throw new Error('Enter at least 2 whole numbers from 1 to 10⁹.');
    if (n > 12) throw new Error('Use 12 numbers or fewer so the picture fits.');
    const g = (x, y) => this.gcd(x, y); const pre = Array(n).fill(null), suf = Array(n).fill(null); const F = [];
    let i = -1, best = 0, bestI = -1, phase = 'pre', left = null, right = null, cand = null; const tried = Array(n).fill(null);
    const st = () => ({ A, pre: [...pre], suf: [...suf], i, phase, best, bestI, left, right, cand, tried: [...tried] });
    pre[0] = A[0]; i = 0;
    F.push({ line: 'pre0', msg: `prefix[0] = A[0] = ${A[0]}.`, vars: { i, 'prefix[i]': pre[0] }, st: st() });
    for (i = 1; i < n; i++) { pre[i] = g(pre[i - 1], A[i]);
      F.push({ line: 'pre', msg: `prefix[${i}] = gcd(prefix[${i - 1}], A[${i}]) = gcd(${pre[i - 1]}, ${A[i]}) = ${pre[i]}.  ${this.euclid(pre[i - 1], A[i])}`, vars: { i, 'prefix[i-1]': pre[i - 1], 'A[i]': A[i], 'prefix[i]': pre[i] }, st: st() }); }
    phase = 'suf'; suf[n - 1] = A[n - 1]; i = n - 1;
    F.push({ line: 'suf0', msg: `suffix[${n - 1}] = A[${n - 1}] = ${A[n - 1]}.`, vars: { i, 'suffix[i]': suf[n - 1] }, st: st() });
    for (i = n - 2; i >= 0; i--) { suf[i] = g(suf[i + 1], A[i]);
      F.push({ line: 'suf', msg: `suffix[${i}] = gcd(suffix[${i + 1}], A[${i}]) = gcd(${suf[i + 1]}, ${A[i]}) = ${suf[i]}.`, vars: { i, 'suffix[i+1]': suf[i + 1], 'A[i]': A[i], 'suffix[i]': suf[i] }, st: st() }); }
    phase = 'try';
    for (i = 0; i < n; i++) {
      left = i === 0 ? 0 : pre[i - 1]; right = i === n - 1 ? 0 : suf[i + 1]; cand = g(left, right); tried[i] = cand;
      const better = cand > best; if (better) { best = cand; bestI = i; }
      const lt = i === 0 ? 'nothing on the left (0)' : `prefix[${i - 1}] = ${left}`, rt = i === n - 1 ? 'nothing on the right (0)' : `suffix[${i + 1}] = ${right}`;
      F.push({ line: 'best', msg: `Remove A[${i}] = ${A[i]}: ${lt}, ${rt}. gcd(${left}, ${right}) = ${cand}. ${better ? `New best: ${best}.` : `Best stays ${best}.`}`, vars: { i, left, right, 'gcd(left, right)': cand, best }, st: st() });
    }
    i = -1; phase = 'done'; left = right = cand = null;
    F.push({ line: 'ret', msg: `Removing A[${bestI}] = ${A[bestI]} leaves the largest gcd, ${best}.`, vars: { best }, st: st(), result: String(best) });
    return F;
  },
  render(st) {
    const n = st.A.length; const T = st.phase === 'try';
    const rowA = cells(st.A.map(String), { wide: true,
      cls: k => T && k === st.i ? 'bad' : st.phase === 'done' && k === st.bestI ? 'bad' : T && k < st.i ? 't1' : T && k > st.i ? 't3' : (st.phase === 'pre' || st.phase === 'suf') && k === st.i ? 'cur' : '',
      top: k => T && k === st.i ? [['remove', 'c-bad']] : st.phase === 'done' && k === st.bestI ? [['best to remove', 'c-bad']] : [] });
    const rowP = cells(st.pre.map(v => v == null ? '' : String(v)), { wide: true, noTop: true, idx: false,
      cls: k => st.pre[k] == null ? 'dim' : T && k === st.i - 1 ? 'cur t1' : st.phase === 'pre' && k === st.i ? 'cur t2' : '' });
    const rowS = cells(st.suf.map(v => v == null ? '' : String(v)), { wide: true, noTop: true, idx: false,
      cls: k => st.suf[k] == null ? 'dim' : T && k === st.i + 1 ? 'cur t3' : st.phase === 'suf' && k === st.i ? 'cur t2' : '' });
    const triedRow = cells(st.tried.map(v => v == null ? '' : String(v)), { wide: true, noTop: true, idx: false,
      cls: k => st.tried[k] == null ? 'dim' : k === st.bestI ? 'ok' : '' });
    const calc = T ? `<div class="row2">${block('left piece', `<span class="big c-p1">${st.left}</span>`)}${block('right piece', `<span class="big c-p3">${st.right}</span>`)}${block('gcd(left, right)', `<span class="big">${st.cand}</span>`)}${block('best', `<span class="big c-ok">${st.best}</span>`)}</div>` : '';
    return block('A', rowA) + block('prefix[i] = gcd(A[0..i])', rowP) + block('suffix[i] = gcd(A[i..n−1])', rowS) + block('gcd after removing A[i]', triedRow) + calc;
  }
});
