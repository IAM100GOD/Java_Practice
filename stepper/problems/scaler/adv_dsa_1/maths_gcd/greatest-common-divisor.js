/* 24. Greatest Common Divisor (Scaler) */
P.push({
  id: 'greatest-common-divisor', title: 'Greatest Common Divisor', level: 'easy', group: 'scaler-gcd', file: 'GreatestCommonDivisor.java', dir: 'scaler/adv_dsa_1/maths_gcd',
  statement: 'Return <code>gcd(A, B)</code> for 0 ≤ A, B ≤ 10⁹, without using library functions.',
  technique: "Euclid's algorithm", time: 'O(log min(A, B))', space: 'O(1)',
  inputs: [{ key: 'a', label: 'A', def: '252', narrow: true }, { key: 'b', label: 'B', def: '105', narrow: true }],
  samples: [['4', '6'], ['6', '7'], ['252', '105'], ['0', '9'], ['89', '55']],
  code: "public int gcd(int A, int B) {\n    while (B != 0) { @loop\n        int r = A % B; @mod\n        A = B;\n        B = r; @shift\n    }\n    return A; @ret\n}",
  steps: [
    '<strong>The rule:</strong> <code>gcd(A, B) = gcd(B, A % B)</code>, and <code>gcd(A, 0) = A</code>.',
    '<strong>Why it holds:</strong> write <code>A = q·B + r</code>. Any d that divides A and B also divides <code>r = A − q·B</code>. Any d that divides B and r also divides <code>A = q·B + r</code>. So (A, B) and (B, r) have exactly the same common divisors, and therefore the same greatest one.',
    'In the bars: A is made of q full copies of B plus a leftover r. A tile that fits A and B exactly must also fit r exactly.',
    'Repeat with the smaller pair until the remainder is 0. The last non-zero value is the gcd.',
    'If A &lt; B, the first step just swaps them, because A % B = A. Zero inputs are handled automatically: gcd(A, 0) = A, gcd(0, B) = B, and gcd(0, 0) = 0.'
  ],
  cmp: [['Try every d from min(A, B) down to 1', 'O(min(A, B)) = 10⁹', 'O(1)'], ['Subtraction Euclid: gcd(A − B, B)', 'O(max/min), slow on (10⁹, 1)', 'O(1)'], ["Modulo Euclid", 'O(log min(A, B))', 'O(1)']],
  eff: 'Trying every possible divisor can take 10⁹ steps. Euclid\'s remainder shrinks quickly: after two steps the larger number has at least halved, so even 10⁹ needs at most about 45 steps. The slowest case is two consecutive Fibonacci numbers, such as 89 and 55 (one of the samples), where every quotient is 1.',
  run({ a, b }) {
    if (![a, b].every(x => /^\d+$/.test(x.trim()))) throw new Error('A and B must be non-negative whole numbers.');
    let A = parseInt(a, 10), B = parseInt(b, 10);
    if (A > 1e9 || B > 1e9) throw new Error('A and B must be at most 10⁹.');
    const max = Math.max(A, B, 1); const rows = []; const F = [];
    const st = (cur) => ({ rows: clone(rows), cur, max, A, B });
    F.push({ line: 'loop', msg: B === 0 ? `B is 0, so the loop never runs. gcd(${A}, 0) = ${A}.` : `Start with A = ${A}, B = ${B}. Keep replacing (A, B) with (B, A % B) until B is 0.`, vars: { A, B }, st: st(-1) });
    while (B !== 0) {
      const q = Math.floor(A / B), r = A % B;
      rows.push({ a: A, b: B, q, r });
      F.push({ line: 'mod', msg: q === 0 ? `${A} < ${B}, so ${A} % ${B} = ${A}. This step just swaps them.` : `${A} = ${q} × ${B} + ${r}, so r = ${r}. Any common divisor of ${A} and ${B} also divides ${r}.`, vars: { A, B, r }, st: st(rows.length - 1) });
      A = B; B = r;
      F.push({ line: 'shift', msg: `A = ${A}, B = ${B}. ${B ? `Next: gcd(${A}, ${B}).` : 'B is 0, so stop.'}`, vars: { A, B }, st: st(rows.length - 1) });
    }
    F.push({ line: 'ret', msg: `The last non-zero value is ${A}. Check: ${rows.length ? `${rows[0].a} = ${rows[0].a / (A || 1)} × ${A} and ${rows[0].b} = ${rows[0].b / (A || 1)} × ${A}` : `gcd(${A}, 0) = ${A}`}.`, vars: { A }, st: st(-1), result: String(A) });
    return F;
  },
  render(st) {
    if (!st.rows.length) return block('no steps', `<span class="tok ok">gcd(${st.A}, 0) = ${st.A}</span>`);
    const W = v => (v / st.max * 100);
    const bars = st.rows.map((r, k) => {
      let seg = '';
      for (let j = 0; j < r.q && j < 60; j++) seg += `<div style="width:${W(r.b)}%;background:var(--p1-soft);border-right:2px solid var(--p1);height:100%"></div>`;
      if (r.r) seg += `<div style="width:${W(r.r)}%;background:var(--p2-soft);border:1.5px solid var(--p2);height:100%"></div>`;
      const on = k === st.cur;
      return `<div style="display:grid;grid-template-columns:minmax(0,1fr);gap:3px;padding:6px 8px;border-radius:6px;${on ? 'background:var(--surface-2);' : ''}">
        <div style="font-family:var(--f-mono);font-size:.8rem">${r.a} = ${r.q} × <span class="c-p1">${r.b}</span> + <span class="c-p2">${r.r}</span></div>
        <div style="display:flex;height:16px;width:${W(r.a)}%;min-width:2px;border-radius:3px;overflow:hidden;outline:1px solid var(--line)">${seg}</div>
        <div style="display:flex;height:6px;width:${W(r.b)}%;min-width:2px;background:var(--p1);border-radius:2px;opacity:.55"></div>
      </div>`;
    }).join('');
    return block('each row: A (thick bar) split into q copies of B (blue) plus the remainder r (amber). B is the thin bar underneath', `<div style="display:flex;flex-direction:column;gap:2px">${bars}</div>`)
      + `<div class="row2">${block('steps', `<span class="big">${st.rows.length}</span>`)}</div>`;
  }
});
