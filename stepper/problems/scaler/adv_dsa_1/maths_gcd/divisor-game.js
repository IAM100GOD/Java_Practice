/* 27. Divisor game (Scaler) */
P.push({
  id: 'divisor-game', title: 'Divisor Game', level: 'easy', group: 'scaler-gcd', file: 'DivisorGame.java', dir: 'scaler/adv_dsa_1/maths_gcd',
  statement: 'Count the positive integers ≤ A that are divisible by both B and C. Constraints: 1 ≤ A, B, C ≤ 10⁹.',
  technique: 'Count multiples of lcm(B, C)', time: 'O(log min(B, C))', space: 'O(1)',
  inputs: [{ key: 'a', label: 'A', def: '50', narrow: true }, { key: 'b', label: 'B', def: '4', narrow: true }, { key: 'c', label: 'C', def: '6', narrow: true }],
  samples: [['12', '3', '2'], ['6', '1', '4'], ['50', '4', '6'], ['40', '8', '12'], ['30', '7', '11']],
  code: "public int solve(int A, int B, int C) {\n    int g = gcd(B, C); @g\n    long lcm = (long) B / g * C;      // divide first; long because lcm can reach 1e18 @lcm\n    return (int) (A / lcm); @ret\n}\n\nprivate int gcd(int a, int b) {\n    while (b != 0) {\n        int t = a % b;\n        a = b;\n        b = t;\n    }\n    return a;\n}",
  steps: [
    '<strong>Divisible by both B and C is the same as divisible by lcm(B, C).</strong> The lcm is the smallest number that is a multiple of both, and every common multiple is a multiple of it.',
    '<strong>Common mistake:</strong> using B × C. That is only right when gcd(B, C) = 1. With B = 4 and C = 6, 12 is divisible by both, but 4 × 6 = 24 would miss it.',
    '<code>lcm(B, C) = B × C / gcd(B, C)</code>. The shared factors would otherwise be counted twice.',
    'The multiples of L up to A are L, 2L, 3L, …, so there are exactly <code>A / L</code> of them (integer division). If L &gt; A, there are none.',
    '<strong>Overflow:</strong> B × C can reach 10¹⁸. Compute <code>(long) B / g * C</code>: divide first, then multiply, in <code>long</code>.'
  ],
  cmp: [['Loop 1..A, test x % B and x % C', 'O(A) = 10⁹', 'O(1)'], ['Loop over multiples of max(B, C)', 'O(A / max(B, C))', 'O(1)'], ['A / lcm(B, C)', 'O(log min(B, C))', 'O(1)']],
  eff: 'Checking every number up to 10⁹ is too slow. The common multiples are evenly spaced, one every lcm(B, C), so counting them is a single division. The gcd for the lcm takes O(log) steps.',
  gcd(a, b) { while (b) { [a, b] = [b, a % b]; } return a; },
  run({ a, b, c }) {
    if (![a, b, c].every(x => /^\d+$/.test(x.trim()))) throw new Error('A, B and C must be positive whole numbers.');
    const A = parseInt(a, 10), B = parseInt(b, 10), C = parseInt(c, 10);
    if ([A, B, C].some(x => x < 1 || x > 1e9)) throw new Error('A, B and C must be between 1 and 10⁹.');
    if (A > 120) throw new Error('The picture only fits A up to 120. The Java code handles up to 10⁹.');
    const F = []; const g = this.gcd(B, C); const L = B / g * C; const ans = Math.floor(A / L);
    const st = (stage, k = 0) => ({ A, B, C, g, L, stage, k, ans });
    F.push({ line: 'g', msg: `gcd(${B}, ${C}) = ${g}.${g > 1 ? ` B and C share the factor ${g}.` : ' B and C share no factor.'}`, vars: { g }, st: st('marks') });
    F.push({ line: 'lcm', msg: `lcm = ${B} / ${g} × ${C} = ${L}.${g > 1 ? ` Using B × C = ${B * C} would be wrong here, because it would skip ${L}.` : ''} Green dots are numbers divisible by both, and they are exactly the multiples of ${L}.`, vars: { g, lcm: L }, st: st('lcm') });
    for (let k = 1; k <= ans; k++) F.push({ line: 'ret', msg: `${k} × ${L} = ${k * L} ≤ ${A}. Count = ${k}.`, vars: { lcm: L, count: k }, st: st('count', k) });
    F.push({ line: 'ret', msg: `${A} / ${L} = ${ans}${ans === 0 ? `. ${L} > ${A}, so nothing up to A is divisible by both` : ''}.`, vars: { lcm: L, 'A / lcm': ans }, st: st('done', ans), result: String(ans) });
    return F;
  },
  render(st) {
    const cols = Math.min(st.A, 20);
    let g = `<div class="scroll"><div class="spiral" style="grid-template-columns:repeat(${cols}, 30px)">`;
    for (let x = 1; x <= st.A; x++) {
      const b = x % st.B === 0, c = x % st.C === 0, both = b && c;
      const counted = both && st.stage !== 'marks' && (st.stage === 'lcm' || x / st.L <= st.k);
      const cls = both ? (counted ? (st.stage === 'count' && x === st.k * st.L ? 'cur ok' : 'ok') : 't2') : b ? 't1' : c ? 't3' : '';
      g += `<div class="cell ${cls}" style="width:30px;height:30px;font-size:.72rem">${x}</div>`;
    }
    g += '</div></div>';
    const legend = `<div class="chips"><span class="tok" style="border-color:var(--p1);background:var(--p1-soft)">divisible by B = ${st.B}</span><span class="tok" style="border-color:var(--p3);background:var(--p3-soft)">divisible by C = ${st.C}</span><span class="tok ok">divisible by both</span></div>`;
    const wrong = st.B * st.C !== st.L ? block('B × C (wrong step size)', `<span class="tok bad">${st.B * st.C}</span>`) : '';
    return block(`1 … ${st.A}`, g) + legend + `<div class="row2">${block('gcd(B, C)', `<span class="big">${st.g}</span>`)}${block('lcm(B, C)', `<span class="big c-ok">${st.stage === 'marks' ? '…' : st.L}</span>`)}${wrong}${block('count', `<span class="big c-ok">${st.stage === 'count' || st.stage === 'done' ? st.k : '…'}</span>`)}</div>`;
  }
});
