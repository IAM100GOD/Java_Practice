/* 21. Very Large Power (Scaler) */
P.push({
  id: 'very-large-power', title: 'Very Large Power', level: 'medium', group: 'scaler-primes', file: 'VeryLargePower.java', dir: 'scaler/adv_dsa_1/maths_prime_numbers',
  statement: 'Return <code>A<sup>B!</sup> % (10⁹+7)</code>. Constraints: 1 ≤ A, B ≤ 5 × 10⁵.',
  technique: "Fermat: reduce the exponent mod (p − 1)", time: 'O(B + log p)', space: 'O(1)',
  inputs: [{ key: 'a', label: 'A', def: '2', narrow: true }, { key: 'b', label: 'B', def: '13', narrow: true }],
  samples: [['1', '1'], ['2', '2'], ['2', '3'], ['2', '13'], ['7', '20']],
  code: "public int solve(int A, int B) {\n    final long MOD = 1_000_000_007L;\n    long exp = 1; @init\n    for (int i = 2; i <= B; i++) {\n        exp = exp * i % (MOD - 1);              // exp < 1e9+6, i <= 5e5: product fits in long @fact\n    }\n    return (int) power(A, exp, MOD); @call\n}\n\nprivate long power(long base, long exp, long mod) {\n    long result = 1 % mod;\n    base %= mod; @pinit\n    while (exp > 0) { @loop\n        if ((exp & 1) == 1) result = result * base % mod; @mul\n        base = base * base % mod;\n        exp >>= 1; @sq\n    }\n    return result; @ret\n}",
  steps: [
    '<strong>B! cannot be computed directly.</strong> 13! is already 6,227,020,800, and 500000! has about 2.6 million digits. The exponent has to be made smaller first.',
    "<strong>Fermat's little theorem.</strong> p = 10⁹+7 is prime and A ≤ 5 × 10⁵ &lt; p, so <code>A<sup>p−1</sup> ≡ 1 (mod p)</code>.",
    'Each full block of (p − 1) in the exponent multiplies the result by 1, so only the leftover part matters: <code>A<sup>B!</sup> ≡ A<sup>B! mod (p−1)</sup> (mod p)</code>.',
    'Build <code>B! mod (p − 1)</code> one factor at a time: <code>exp = exp × i % (p − 1)</code> for i = 2..B. The <code>%</code> can be taken after every multiplication because the exponent is only needed modulo p − 1.',
    'Then compute <code>A<sup>exp</sup> mod p</code> with the fast power from earlier.',
    '<strong>Common mistake:</strong> reducing the exponent with <code>% p</code> instead of <code>% (p − 1)</code>. The base is reduced mod p, but the exponent repeats every p − 1, so it must be reduced mod p − 1.'
  ],
  cmp: [['Compute B! exactly, then power', 'impossible: ~2.6M-digit exponent', 'huge'], ['Raise to 2, then 3, …, then B: (((A²)³)…)ᴮ', 'O(B log B)', 'O(1)'], ['B! mod (p−1), then one fast power', 'O(B + log p)', 'O(1)']],
  eff: "The loop that builds B! mod (p − 1) runs about 5 × 10⁵ times, and the fast power adds about 30 steps. Use <code>long</code>: exp is just under 10⁹ and i is at most 5 × 10⁵, so their product (about 5 × 10¹⁴) overflows <code>int</code>. Raising the result to 2, then 3, and so on up to B also gives the right answer, and the Java file uses it as a test, but it needs a full fast power at every step.",
  run({ a, b }) {
    if (![a, b].every(x => /^\d+$/.test(x.trim()))) throw new Error('A and B must be positive whole numbers.');
    const An = parseInt(a, 10), Bn = parseInt(b, 10);
    if (An < 1 || An > 5e5 || Bn < 1 || Bn > 5e5) throw new Error('A and B must be between 1 and 5 × 10⁵.');
    if (Bn > 25) throw new Error('The picture only fits B up to 25. The Java code handles up to 5 × 10⁵.');
    const MOD = 1000000007n, PM = MOD - 1n; const F = [];
    let exp = 1n, real = 1n, i = 1; const rows = [{ i: 1, real: '1', exp: '1' }];
    const fst = () => ({ phase: 'fact', rows: clone(rows), i });
    F.push({ line: 'init', msg: `exp = 1, which is 1! mod (p − 1). p − 1 = 1,000,000,006.`, vars: { exp: '1', 'p − 1': String(PM) }, st: fst() });
    for (i = 2; i <= Bn; i++) {
      real *= BigInt(i); const before = exp; exp = exp * BigInt(i) % PM;
      rows.push({ i, real: String(real), exp: String(exp) });
      F.push({ line: 'fact', msg: `exp = ${before} × ${i} % (p − 1) = ${exp}.${real >= PM ? ` The real ${i}! = ${real.toLocaleString('en-US')} has gone past p − 1, but only its remainder is needed.` : ''}`, vars: { i, exp: String(exp), [`${i}! (real)`]: real > 10n ** 15n ? real.toString().slice(0, 6) + '… (' + real.toString().length + ' digits)' : String(real) }, st: fst() });
    }
    const E = Number(exp); let base = BigInt(An) % MOD, result = 1n, ee = E, k = 0; const bits = E.toString(2); const ladder = [];
    const pst = mode => ({ phase: 'pow', bits, k, mode, ladder: clone(ladder), result: String(result), base: String(base), B0: E, rows: clone(rows), A: An, Bn });
    F.push({ line: 'call', msg: `By Fermat, ${An}^(${Bn}!) ≡ ${An}^${E} (mod p). Now compute that with fast power.`, vars: { A: An, exp: E }, st: pst() });
    F.push({ line: 'pinit', msg: `base = ${base}, result = 1, exp = ${E} (${bits} in binary).`, vars: { base: String(base), result: '1', exp: E }, st: pst() });
    while (ee > 0) {
      const set = ee & 1; const before = result;
      if (set) result = result * base % MOD;
      ladder.push({ k, base: String(base), used: !!set });
      F.push({ line: set ? 'mul' : 'loop', msg: set ? `Bit ${k} is 1: result = ${before} × ${base} % p = ${result}.` : `Bit ${k} is 0, so result stays ${result}.`, vars: { base: String(base), result: String(result), exp: ee }, st: pst(set ? 'mul' : 'skip') });
      const ob = base; base = base * base % MOD; ee = Math.floor(ee / 2); k++;
      F.push({ line: 'sq', msg: `Square base: ${ob}² % p = ${base}. Shift exp right to ${ee}.`, vars: { base: String(base), result: String(result), exp: ee }, st: pst('sq') });
    }
    F.push({ line: 'ret', msg: `${An}^(${Bn}!) mod (10⁹+7) = ${result}.`, vars: { result: String(result) }, st: pst(), result: String(result) });
    return F;
  },
  render(st) {
    const tbl = `<div class="scroll"><table class="maptbl"><tr><th>i</th><th>i! (real)</th><th>exp = i! mod (p−1)</th></tr>${st.rows.map((r, j) => `<tr class="${st.phase === 'fact' && j === st.rows.length - 1 ? 'on' : ''}"><td>${r.i}</td><td>${r.real.length > 22 ? r.real.slice(0, 10) + '… (' + r.real.length + ' digits)' : Number(r.real).toLocaleString('en-US')}</td><td>${r.exp}</td></tr>`).join('')}</table></div>`;
    if (st.phase === 'fact') return block('building B! mod (p − 1), one factor at a time', tbl);
    const pw = P.find(p => p.id === 'power-function').render(st).replace('B in binary (each 1 bit adds its power of 2 to the exponent)', `exp = ${st.Bn}! mod (p − 1) = ${st.B0} in binary`);
    return `<div class="tok" style="align-self:flex-start">${st.A}<sup>${st.Bn}!</sup> ≡ ${st.A}<sup>${st.B0}</sup> (mod 10⁹+7)</div>` + pw;
  }
});
