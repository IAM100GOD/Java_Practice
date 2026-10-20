/* 36. Compute nCr % p (Scaler) */
P.push({
  id: 'ncr-mod-p', title: 'Compute nCr % p', level: 'medium', group: 'scaler-comb', file: 'ComputeNCrModP.java', dir: 'scaler/adv_dsa_1/maths_combinatorics',
  statement: 'Return <code>C(A, B) % C</code>, where C = p is prime and p ≥ n. For this problem 1 also counts as prime. Constraints: n ≤ 10⁶, p ≤ 10⁹+7.',
  technique: "Numerator / r! with a Fermat inverse", time: 'O(min(r, n−r) + log p)', space: 'O(1)',
  inputs: [{ key: 'a', label: 'A (n)', def: '10', narrow: true }, { key: 'b', label: 'B (r)', def: '7', narrow: true }, { key: 'c', label: 'C (p)', def: '13', narrow: true }],
  samples: [['5', '2', '13'], ['6', '2', '13'], ['10', '7', '13'], ['7', '3', '7'], ['1', '1', '1']],
  code: "public int solve(int A, int B, int C) {\n    if (C == 1) return 0;                            // everything is 0 mod 1 @one\n    long p = C;\n    int r = Math.min(B, A - B);                      // C(n, r) = C(n, n - r); keeps r < p @sym\n    long num = 1, den = 1;\n    for (int k = 1; k <= r; k++) {\n        num = num * (A - r + k) % p;                 // n * (n-1) * ... * (n-r+1)\n        den = den * k % p;                           // r! @loop\n    }\n    return (int) (num * power(den, p - 2, p) % p);   // Fermat: den^-1 = den^(p-2) @inv\n}\n\nprivate long power(long base, long exp, long mod) {\n    long result = 1 % mod;\n    base %= mod;\n    while (exp > 0) {\n        if ((exp & 1) == 1) result = result * base % mod;\n        base = base * base % mod;\n        exp >>= 1;\n    }\n    return result;\n}",
  steps: [
    '<code>C(n, r) = n·(n−1)·…·(n−r+1) / r!</code>. Under a modulus, "divide by r!" means "multiply by the inverse of r!".',
    "<strong>Fermat's little theorem</strong> gives the inverse when p is prime: <code>x<sup>−1</sup> ≡ x<sup>p−2</sup> (mod p)</code>, as long as p does not divide x. Compute it with fast power.",
    'r! has an inverse only if none of its factors 1..r is a multiple of p. Use <code>C(n, r) = C(n, n−r)</code> to make r ≤ n/2. Since p ≥ n, r is then less than p, so r! is always invertible.',
    'If p equals n, the numerator includes the factor p, so the result is 0 for 0 &lt; r &lt; n. That is correct, because p divides C(p, r).',
    'p = 1 is a special case. Everything mod 1 is 0, and Fermat\'s formula would need the exponent p − 2 = −1, so return 0 up front.'
  ],
  cmp: [["Pascal's triangle (as for nCr % m)", 'O(n · r) = 5 × 10¹¹ here', 'O(r)'], ['Precompute all factorials + inverse factorials', 'O(n + log p) once', 'O(n), best for many queries'], ['Numerator × inverse(r!), r = min(r, n−r)', 'O(min(r, n−r) + log p)', 'O(1)']],
  eff: "Here n can be 10⁶ and r can be 5 × 10⁵, so Pascal's triangle would need about 5 × 10¹¹ additions. Because p is prime, division is allowed again through Fermat's inverse: about 5 × 10⁵ multiplications plus one fast power of about 30 steps (5 ms in Java). For many nCr queries, precompute fact[] and invFact[] once, and then each query is O(1).",
  run({ a, b, c }) {
    if (![a, b, c].every(x => /^\d+$/.test(x.trim()))) throw new Error('A, B and C must be positive whole numbers.');
    const n = parseInt(a, 10), r0 = parseInt(b, 10), p = parseInt(c, 10);
    if (n < 1 || r0 < 1 || r0 > n || p < 1) throw new Error('Need 1 ≤ B ≤ A and C ≥ 1.');
    const isP = x => { if (x < 2) return x === 1; for (let d = 2; d * d <= x; d++) if (x % d === 0) return false; return true; };
    if (!isP(p) || p < n) throw new Error('C must be prime (or 1) and at least A.');
    if (n > 40) throw new Error('The picture only fits A up to 40. The Java code handles up to 10⁶.');
    const F = []; const P_ = BigInt(p);
    const st = (extra) => ({ n, r0, p, r: null, k: 0, num: '1', den: '1', numF: [], denF: [], inv: null, ans: null, ...extra });
    if (p === 1) { F.push({ line: 'one', msg: 'p = 1, and every number mod 1 is 0. Return 0. Fermat would need the exponent p − 2 = −1, which is why this case is handled first.', vars: { p }, st: st({}), result: '0' }); return F; }
    F.push({ line: 'one', msg: `p = ${p} is prime, so Fermat's theorem gives inverses mod p.`, vars: { p }, st: st({}) });
    const r = Math.min(r0, n - r0);
    F.push({ line: 'sym', msg: r !== r0 ? `C(${n}, ${r0}) = C(${n}, ${n - r0}), so use r = ${r}: fewer factors, and r < p means r! has an inverse.` : `r = min(${r0}, ${n - r0}) = ${r}. That is already ≤ n/2, so r < p and r! has an inverse.`, vars: { r }, st: st({ r }) });
    let num = 1n, den = 1n; const numF = [], denF = [];
    for (let k = 1; k <= r; k++) {
      num = num * BigInt(n - r + k) % P_; den = den * BigInt(k) % P_; numF.push(n - r + k); denF.push(k);
      F.push({ line: 'loop', msg: `k = ${k}: num ×= ${n - r + k}, giving ${num}. den ×= ${k}, giving ${den} (both mod ${p}).${n - r + k === p ? ` The factor ${p} makes the numerator 0 mod p.` : ''}`, vars: { k, num: String(num), den: String(den) }, st: st({ r, k, num: String(num), den: String(den), numF: [...numF], denF: [...denF] }) });
    }
    const pw = (bb, e) => { let res = 1n; bb %= P_; while (e > 0n) { if (e & 1n) res = res * bb % P_; bb = bb * bb % P_; e >>= 1n; } return res; };
    const inv = pw(den, P_ - 2n); const ans = num * inv % P_;
    F.push({ line: 'inv', msg: `den⁻¹ = ${den}^(${p}−2) mod ${p} = ${inv}. Check: ${den} × ${inv} % ${p} = ${den * inv % P_}.`, vars: { den: String(den), 'den^(p-2)': String(inv) }, st: st({ r, k: r, num: String(num), den: String(den), numF, denF, inv: String(inv) }) });
    const exact = (() => { let v = 1n; for (let k = 1; k <= r; k++) v = v * BigInt(n - r + k) / BigInt(k); return v; })();
    F.push({ line: 'inv', msg: `${num} × ${inv} % ${p} = ${ans}. Check against the exact value: C(${n}, ${r0}) = ${exact}, and ${exact} % ${p} = ${exact % P_}.`, vars: { answer: String(ans) }, st: st({ r, k: r, num: String(num), den: String(den), numF, denF, inv: String(inv), ans: String(ans) }), result: String(ans) });
    return F;
  },
  render(st) {
    const frac = st.r == null ? '' : `<div style="display:inline-grid;gap:4px;font-family:var(--f-mono);font-size:.85rem;text-align:center">
      <div>${st.numF.length ? st.numF.map(x => `<span class="${x === st.p ? 'c-bad' : 'c-p1'}">${x}</span>`).join(' × ') : '1'}</div>
      <div style="border-top:1.5px solid var(--ink)"></div>
      <div>${st.denF.length ? st.denF.map(x => `<span class="c-p3">${x}</span>`).join(' × ') : '1'}</div></div>`;
    return `<div class="row2">${block('n, r, p', `<span class="tok">n = ${st.n}</span> <span class="tok">r = ${st.r0}${st.r != null && st.r !== st.r0 ? ` → ${st.r}` : ''}</span> <span class="tok">p = ${st.p}</span>`)}</div>`
      + (st.r != null ? block(`C(${st.n}, ${st.r}) = numerator / r!`, frac) : '')
      + `<div class="row2">${block('num mod p', `<span class="big c-p1">${st.num}</span>`)}${block('den = r! mod p', `<span class="big c-p3">${st.den}</span>`)}${block('den⁻¹ = den^(p−2)', `<span class="big">${st.inv ?? '…'}</span>`)}${block('answer', `<span class="big c-ok">${st.ans ?? '…'}</span>`)}</div>`;
  }
});
