/* 28. All GCD Pair (Scaler) */
P.push({
  id: 'all-gcd-pair', title: 'All GCD Pair', level: 'medium', group: 'scaler-gcd', file: 'AllGCDPair.java', dir: 'scaler/adv_dsa_1/maths_gcd',
  statement: 'A contains <code>gcd(B[i], B[j])</code> for every ordered pair (i, j) of some hidden array B, including i = j. Recover B. For example, B = {2, 8, 10} gives A = {2, 2, 2, 2, 8, 2, 2, 2, 10}. Constraints: N ≤ 10⁴.',
  technique: 'Greedy from the largest value + multiset of counts', time: 'O(N log N)', space: 'O(N)',
  inputs: [{ key: 'a', label: 'A', def: '2, 2, 2, 2, 8, 2, 2, 2, 10' }],
  samples: [['2, 2, 2, 2, 8, 2, 2, 2, 10'], ['5, 5, 5, 15'], ['6, 2, 3, 2, 4, 1, 3, 1, 9'], ['12, 6, 4, 6, 18, 2, 4, 2, 8']],
  code: "public int[] solve(int[] A) {\n    Arrays.sort(A);\n    Map<Integer, Integer> count = new HashMap<>();\n    for (int x : A) count.merge(x, 1, Integer::sum); @sort\n\n    List<Integer> res = new ArrayList<>();\n    for (int i = A.length - 1; i >= 0; i--) {\n        int x = A[i];\n        if (count.get(x) == 0) continue;           // already explained as some pair's gcd @skip\n        count.merge(x, -1, Integer::sum);          // the (x, x) entry @self\n        for (int r : res) {\n            count.merge(gcd(x, r), -2, Integer::sum);   // the (x, r) and (r, x) entries @pair\n        }\n        res.add(x); @add\n    }\n\n    int[] out = new int[res.size()];\n    for (int k = 0; k < out.length; k++) out[k] = res.get(out.length - 1 - k);   // ascending\n    return out; @ret\n}\n\nprivate int gcd(int a, int b) {\n    while (b != 0) {\n        int t = a % b;\n        a = b;\n        b = t;\n    }\n    return a;\n}",
  steps: [
    'A is an m × m table of gcds read out in any order. The diagonal holds <code>gcd(x, x) = x</code>, which is each original number, and every other value appears twice, once as (x, y) and once as (y, x).',
    '<strong>Key fact:</strong> <code>gcd(x, y) ≤ min(x, y)</code>. So the largest value in A cannot be the gcd of two different numbers bigger than it. It must be an original number.',
    'Keep a count of every value (a multiset). Go through A from largest to smallest. If a value\'s count is already 0, it was already accounted for as some pair\'s gcd, so skip it.',
    'Otherwise it is a new original number x. Remove one x (its diagonal entry), and for every number r found earlier, remove <code>gcd(x, r)</code> twice, for the (x, r) and (r, x) entries.',
    'Repeat until all of A is used up. Each value chosen is the largest one still unaccounted for, so the fact above applies at every step.'
  ],
  cmp: [['Try every subset of values as B, rebuild, compare', 'exponential', '—'], ['Greedy largest-first with a count map', 'O(N log N + m² log M)', 'O(N)']],
  eff: 'Sorting costs O(N log N). There are m = √N original numbers, so the pairwise gcd removals total m² = N, each O(log M). Without the count map, each gcd entry would have to be found and deleted from a list, costing O(N) per removal.',
  gcd(a, b) { while (b) { [a, b] = [b, a % b]; } return a; },
  run({ a }) {
    const A0 = a.split(/[,\s]+/).filter(Boolean).map(Number); const N = A0.length; const m = Math.round(Math.sqrt(N));
    if (!N || A0.some(x => !Number.isInteger(x) || x < 1)) throw new Error('A must be positive whole numbers.');
    if (m * m !== N) throw new Error(`A has ${N} values, but a full gcd table has m × m entries (1, 4, 9, 16, …).`);
    if (N > 36) throw new Error('Use 36 values (a 6 × 6 table) or fewer so the picture fits.');
    const A = [...A0].sort((x, y) => x - y); const total = {}; A.forEach(x => total[x] = (total[x] || 0) + 1);
    const count = { ...total }; const res = []; const table = {}; const F = []; let i = -1, x = null, hot = {};
    const st = () => ({ A, total, count: { ...count }, res: [...res], table: { ...table }, i, x, hot: { ...hot }, m });
    F.push({ line: 'sort', msg: `Sort A and count each value: ${Object.keys(count).map(k => `${k}×${count[k]}`).join(', ')}. A has ${N} = ${m}² entries, so B has ${m} numbers.`, vars: { N, m }, st: st() });
    for (i = N - 1; i >= 0; i--) {
      x = A[i]; hot = {};
      if (count[x] === 0) { F.push({ line: 'skip', msg: `${x}: its count is 0, so every copy is already explained as a pair's gcd. Skip.`, vars: { i, x, [`count[${x}]`]: 0 }, st: st() }); continue; }
      count[x]--; table[`${res.length},${res.length}`] = x; hot = { [x]: 1 };
      F.push({ line: 'self', msg: `${x} is the largest value not yet explained, so it must be an original number. Remove one ${x} for its diagonal entry gcd(${x}, ${x}).`, vars: { i, x, [`count[${x}]`]: count[x] }, st: st() });
      res.forEach((r, j) => { const g = this.gcd(x, r); count[g] -= 2; table[`${res.length},${j}`] = g; table[`${j},${res.length}`] = g; hot = { [g]: 2 };
        F.push({ line: 'pair', msg: `gcd(${x}, ${r}) = ${g} appears twice in A, as (${x}, ${r}) and (${r}, ${x}). Remove two ${g}s.`, vars: { x, r, g, [`count[${g}]`]: count[g] }, st: st() }); });
      res.push(x); hot = {};
      F.push({ line: 'add', msg: `Add ${x} to the answer: [${res.join(', ')}].`, vars: { res: `[${res.join(', ')}]` }, st: st() });
    }
    i = -1; x = null;
    const out = [...res].reverse();
    F.push({ line: 'ret', msg: `Every entry of A is accounted for. B = [${out.join(', ')}].`, vars: { res: `[${out.join(', ')}]` }, st: st(), result: `[${out.join(', ')}]` });
    return F;
  },
  render(st) {
    const used = {}; for (const k in st.total) used[k] = st.total[k] - st.count[k];
    const seen = {};
    const grid = cells(st.A.map(String), { wide: true, noTop: false,
      cls: k => { const v = st.A[k]; const rank = seen[v] = (seen[v] || 0) + 1;
        const state = rank > used[v] ? '' : rank > used[v] - (st.hot[v] || 0) ? 't2' : 'dim';
        return [k === st.i ? 'cur' : '', state].join(' '); },
      top: k => k === st.i ? [['i', 'c-acc']] : [] });
    const n = st.res.length + (st.x != null && st.table[`${st.res.length},${st.res.length}`] !== undefined ? 1 : 0);
    const hdr = [...st.res]; if (n > st.res.length) hdr.push(st.x);
    let t = '<span class="empty">no numbers found yet</span>';
    if (n) {
      t = `<div class="scroll"><table class="maptbl"><tr><th></th>${hdr.map(v => `<th>${v}</th>`).join('')}</tr>`;
      for (let r = 0; r < n; r++) { t += `<tr><th>${hdr[r]}</th>`; for (let c = 0; c < n; c++) { const v = st.table[`${r},${c}`]; t += `<td style="${r === c ? 'font-weight:600;color:var(--ok)' : ''}">${v ?? ''}</td>`; } t += '</tr>'; }
      t += '</table></div>';
    }
    const ms = Object.keys(st.count).sort((p, q) => q - p).map(k => `${k} × ${st.count[k]}`);
    return block('A sorted (faded = already explained, amber = removed this step; scanned right to left)', grid)
      + `<div class="row2">${block('count left', tokens(ms, j => +ms[j].split(' × ')[1] ? '' : 'ok'))}${block('rebuilt gcd table', t)}</div>`
      + block('original numbers found', tokens(st.res.map(String), j => j === st.res.length - 1 ? 'new' : 'ok'));
  }
});
