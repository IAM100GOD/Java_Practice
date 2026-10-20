/* 23. Enumerating GCD (Scaler) */
P.push({
  id: 'enumerating-gcd', title: 'Enumerating GCD', level: 'easy', group: 'scaler-gcd', file: 'EnumeratingGCD.java', dir: 'scaler/adv_dsa_1/maths_gcd',
  statement: 'Return <code>gcd(A, A+1, A+2, …, B)</code>. A and B are strings and can be as large as 10¹⁰⁰.',
  technique: 'Consecutive numbers are coprime', time: 'O(digits)', space: 'O(digits)',
  inputs: [{ key: 'a', label: 'A', def: '12' }, { key: 'b', label: 'B', def: '15' }],
  samples: [['1', '3'], ['12', '15'], ['42', '42'], ['99999999999999999999', '100000000000000000000']],
  code: "public String solve(String A, String B) {\n    A = stripZeros(A);\n    B = stripZeros(B); @strip\n    if (A.equals(B)) return A;     // a single number: its gcd is itself @same\n    return \"1\";                    // A and A+1 are both in the range @diff\n}\n\nprivate String stripZeros(String s) {\n    int i = 0;\n    while (i < s.length() - 1 && s.charAt(i) == '0') i++;\n    return s.substring(i);\n}",
  steps: [
    '<strong>Two consecutive numbers share no factor except 1.</strong> If d divides both n and n+1, it also divides their difference, (n+1) − n = 1. The only such d is 1.',
    "Euclid's algorithm shows the same thing: <code>gcd(n+1, n) = gcd(n, 1) = gcd(1, 0) = 1</code>.",
    'If A &lt; B, the range contains A and A+1, so the gcd of the whole range is 1. Adding more numbers can only keep it the same or make it smaller, and it is already 1.',
    'If A = B, the range is just one number, and the gcd of a single number is that number. Return A unchanged.',
    "That's why 100-digit inputs don't need big-number arithmetic. You only compare the two strings, after removing leading zeros so that \"007\" equals \"7\"."
  ],
  cmp: [['Parse into BigInteger, gcd every number in [A, B]', 'up to 10¹⁰⁰ iterations, impossible', 'O(digits)'], ['Compare the strings', 'O(digits)', 'O(1) extra']],
  eff: 'The range can contain up to 10¹⁰⁰ numbers, so going through it is impossible. One mathematical fact settles it: as soon as the range has two numbers, it contains a consecutive pair and the answer is 1. Problems that say "the numbers can be huge" often hide a trick like this.',
  run({ a, b }) {
    const sA = a.trim(), sB = b.trim();
    if (!/^\d+$/.test(sA) || !/^\d+$/.test(sB)) throw new Error('A and B must be digit strings.');
    const A = BigInt(sA), B = BigInt(sB);
    if (A < 1n || A > B) throw new Error('Need 1 ≤ A ≤ B.');
    const F = []; const show = [...Array(Number(B - A > 5n ? 6n : B - A + 1n)).keys()].map(k => String(A + BigInt(k)));
    const st = (mode, euclid = []) => ({ A: String(A), B: String(B), show, more: B - A > 5n, mode, euclid });
    F.push({ line: 'strip', msg: `Remove leading zeros so the two strings can be compared as numbers. A = ${A}, B = ${B}.`, vars: { A: String(A), B: String(B) }, st: st('start') });
    if (A === B) {
      F.push({ line: 'same', msg: `A equals B, so the range holds only ${A}. The gcd of a single number is the number itself.`, vars: { 'A.equals(B)': true }, st: st('same'), result: `"${A}"` });
      return F;
    }
    const n = A, m = A + 1n; const eu = []; let x = m, y = n; while (y) { eu.push(`gcd(${x}, ${y})`); [x, y] = [y, x % y]; } eu.push(`gcd(${x}, 0) = ${x}`);
    F.push({ line: 'diff', msg: `A ≠ B, so the range contains ${n} and ${m}. Any d dividing both also divides ${m} − ${n} = 1, so their gcd is 1, and the gcd of the whole range is 1.`, vars: { 'A.equals(B)': false }, st: st('pair', eu) });
    F.push({ line: 'diff', msg: `Euclid gives the same answer: ${eu.join(' → ')}. The other numbers in the range don't matter.`, vars: { 'A.equals(B)': false }, st: st('euclid', eu), result: '"1"' });
    return F;
  },
  render(st) {
    const items = st.show.concat(st.more ? ['…', st.B] : []);
    const row = `<div class="scroll"><div class="cells">${items.map((v, k) => `<div class="cw"><div class="ptrs">${k === 0 ? '<span class="ptr c-p1">A</span>' : ''}${v === st.B && (k === items.length - 1) ? '<span class="ptr c-p3">B</span>' : ''}</div><div class="cell wide ${(st.mode === 'pair' || st.mode === 'euclid') && k < 2 ? 't2' : st.mode === 'same' ? 'ok' : v === '…' ? 'dim' : ''}" style="min-width:${Math.min(46 + v.length * 4, 260)}px">${esc(v)}</div></div>`).join('')}</div></div>`;
    const proof = st.mode === 'pair' || st.mode === 'euclid'
      ? `<div class="row2">${block('consecutive pair', `<span class="tok new">${esc(st.show[0])}</span> &nbsp;and&nbsp; <span class="tok new">${esc(st.show[1])}</span>`)}${block('their difference', '<span class="big c-ok">1</span>')}</div>`
        + (st.mode === 'euclid' ? block('Euclid on the pair', tokens(st.euclid, i => i === st.euclid.length - 1 ? 'ok' : '')) : '')
      : st.mode === 'same' ? block('range', `<span class="tok ok">just one number, so the gcd is ${esc(st.A)}</span>`) : '';
    return block('the range [A, B]', row) + proof;
  }
});
