/* 35. Compute nCr % m (Scaler) */
P.push({
  id: 'ncr-mod-m', title: 'Compute nCr % m', level: 'medium', group: 'scaler-comb', file: 'ComputeNCrModM.java', dir: 'scaler/adv_dsa_1/maths_combinatorics',
  statement: 'Return <code>C(A, B) % C</code>, that is nCr % m. m does <strong>not</strong> have to be prime. Constraints: A × B ≤ 10⁶, B ≤ A, C ≤ 10⁶.',
  technique: "Pascal's triangle (additions only, valid for any m)", time: 'O(n · r)', space: 'O(r)',
  inputs: [{ key: 'a', label: 'A (n)', def: '6', narrow: true }, { key: 'b', label: 'B (r)', def: '3', narrow: true }, { key: 'c', label: 'C (m)', def: '7', narrow: true }],
  samples: [['5', '2', '13'], ['6', '2', '13'], ['6', '3', '7'], ['10', '3', '12']],
  code: "public int solve(int A, int B, int C) {\n    int[] dp = new int[B + 1];\n    dp[0] = 1 % C;                                   // C(i, 0) = 1; 1 % C handles C = 1 @init\n    for (int i = 1; i <= A; i++) {\n        for (int j = Math.min(i, B); j >= 1; j--) {   // right to left: dp[j-1] is still row i-1\n            dp[j] = (dp[j] + dp[j - 1]) % C; @add\n        }\n    }\n    return dp[B]; @ret\n}",
  steps: [
    '<strong>Why not n! / (r!(n−r)!)?</strong> Dividing under a modulus means multiplying by a modular inverse, and r! only has one mod m when gcd(r!, m) = 1. With m = 12 and r = 3, 3! = 6 shares a factor with 12, so there is no inverse.',
    "<strong>Pascal's rule needs only addition:</strong> <code>C(i, j) = C(i−1, j−1) + C(i−1, j)</code>, with C(i, 0) = 1. Addition works under any modulus, so take <code>% m</code> at every step.",
    'You only need columns 0..r, and only the previous row. Keep a single array <code>dp[0..r]</code> and rebuild it row by row.',
    'Update j from <strong>right to left</strong>. dp[j] needs the old dp[j−1], and going right to left means dp[j−1] has not been overwritten yet in this row.',
    'Start with <code>dp[0] = 1 % m</code> so that m = 1 correctly gives 0. The constraint A × B ≤ 10⁶ is chosen exactly so that this O(n·r) table fits the time limit.'
  ],
  cmp: [['n! / (r!(n−r)!) with inverses', 'O(n)', 'wrong unless m is prime (or coprime)'], ['Full 2D Pascal table', 'O(n · r)', 'O(n · r)'], ['One-row Pascal, right to left', 'O(n · r)', 'O(r)']],
  eff: 'The inverse formula is faster, but it is only correct for prime m (as in later problems, where m = 10⁹+7). For any m, building the triangle by addition is safe. Reusing one row brings memory from n × r down to r + 1, and updating right to left is the same trick used in 0/1 knapsack.',
  run({ a, b, c }) {
    if (![a, b, c].every(x => /^\d+$/.test(x.trim()))) throw new Error('A, B and C must be positive whole numbers.');
    const n = parseInt(a, 10), r = parseInt(b, 10), m = parseInt(c, 10);
    if (n < 1 || r < 1 || r > n || m < 1) throw new Error('Need 1 ≤ B ≤ A and C ≥ 1.');
    if (n > 12) throw new Error('The picture only fits A up to 12. The Java code handles A × B up to 10⁶.');
    const dp = Array(r + 1).fill(0); dp[0] = 1 % m; const rows = [[...dp]]; const F = [];
    const exact = (nn, rr) => { let v = 1n; for (let k = 1; k <= rr; k++) v = v * BigInt(nn - rr + k) / BigInt(k); return v; };
    const st = (i, j) => ({ n, r, m, rows: clone(rows), dp: [...dp], i, j });
    F.push({ line: 'init', msg: `dp = row 0 of the triangle: C(0, 0) = 1, and everything to its right is 0.`, vars: { 'dp[0]': dp[0] }, st: st(0, -1) });
    for (let i = 1; i <= n; i++) {
      for (let j = Math.min(i, r); j >= 1; j--) {
        const old = dp[j], left = dp[j - 1]; dp[j] = (dp[j] + dp[j - 1]) % m;
        F.push({ line: 'add', msg: `C(${i}, ${j}) = C(${i - 1}, ${j - 1}) + C(${i - 1}, ${j}) = ${left} + ${old} = ${left + old}${left + old >= m ? `, and ${left + old} % ${m} = ${dp[j]}` : ''}.`, vars: { i, j, 'dp[j-1]': left, 'dp[j] (old)': old, 'dp[j]': dp[j] }, st: st(i, j) });
      }
      rows.push([...dp]);
    }
    F.push({ line: 'ret', msg: `dp[${r}] = C(${n}, ${r}) % ${m} = ${dp[r]}. The exact value is ${exact(n, r)}, and ${exact(n, r)} % ${m} = ${exact(n, r) % BigInt(m)}.`, vars: { [`dp[${r}]`]: dp[r] }, st: st(-1, -1), result: String(dp[r]) });
    return F;
  },
  render(st) {
    let g = `<div class="scroll"><div class="spiral" style="grid-template-columns:auto repeat(${st.r + 1}, 40px)"><div class="sy">i \\ j</div>`;
    for (let j = 0; j <= st.r; j++) g += `<div class="sx"><span style="color:var(--muted);font-weight:400">${j}</span></div>`;
    for (let i = 0; i <= st.n; i++) {
      g += `<div class="sy"><span style="${i === st.i ? 'color:var(--p2)' : 'color:var(--muted);font-weight:400'}">${i}</span></div>`;
      for (let j = 0; j <= st.r; j++) {
        let v = '', cls = '';
        if (j > i) cls = 'dim';                                       // C(i, j) = 0 for j > i
        else if (i < st.rows.length) v = st.rows[i][j];               // finished rows
        else if (i === st.i) {                                        // row being built, right to left
          if (j === 0) v = st.dp[0];
          else if (j === st.j) { v = st.dp[j]; cls = 'cur t2'; }
          else if (j > st.j) v = st.dp[j];                            // already updated this row
        }
        if (i === st.i - 1 && (j === st.j || j === st.j - 1)) cls = 't1';
        if (i === st.n && j === st.r && st.i === -1) cls = 'ok';
        g += `<div class="cell ${cls}" style="width:40px;height:30px;font-size:.78rem">${v}</div>`;
      }
    }
    g += '</div></div>';
    return block(`Pascal's triangle mod ${st.m}, columns 0..r (blue = the two cells being added, amber = result)`, g)
      + block('dp[] (the single row kept in memory)', cells(st.dp.map(String), { wide: true, noTop: true, cls: j => j === st.j ? 't2' : j === st.j - 1 ? 't1' : '' }));
  }
});
