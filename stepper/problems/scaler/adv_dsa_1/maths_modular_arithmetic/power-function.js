/* 17. Implement Power Function (Scaler) */
P.push({
  id: 'power-function', title: 'Implement Power Function', level: 'medium', group: 'scaler-modarith', file: 'PowerFunction.java', dir: 'scaler/adv_dsa_1/maths_modular_arithmetic',
  statement: 'Return <code>(A<sup>B</sup>) % C</code>. The answer must never be negative. Constraints: −10⁹ ≤ A ≤ 10⁹, 0 ≤ B ≤ 10⁹, 1 ≤ C ≤ 10⁹.',
  technique: 'Binary exponentiation + % after every multiply', time: 'O(log B)', space: 'O(1)',
  inputs: [{ key: 'a', label: 'A', def: '3', narrow: true }, { key: 'b', label: 'B', def: '13', narrow: true }, { key: 'c', label: 'C', def: '100', narrow: true }],
  samples: [['2', '3', '3'], ['3', '3', '1'], ['3', '13', '100'], ['-1', '1', '20'], ['7', '1000000000', '999999937']],
  code: "public int pow(int A, int B, int C) {\n    long base = ((A % C) + C) % C;     // Java % can be negative for negative A; shift into [0, C)\n    long result = 1 % C;               // 1 % C handles C = 1 (answer is always 0)\n    long b = B; @init\n\n    while (b > 0) { @loop\n        if ((b & 1) == 1) {\n            result = (result * base) % C;   // this bit of B is set: include base @mul\n        }\n        base = (base * base) % C;           // A^(2^k) -> A^(2^(k+1))\n        b >>= 1; @sq\n    }\n    return (int) result; @ret\n}",
  steps: [
    'Write B in binary. 13 = 1101₂ = 8 + 4 + 1, so A¹³ = A⁸ × A⁴ × A¹.',
    'Keep a running <code>base</code> that goes A, A², A⁴, A⁸, … by squaring it once per step.',
    'Read B\'s bits from the lowest up with <code>b &amp; 1</code>. When the bit is 1, multiply <code>base</code> into <code>result</code>. Then square <code>base</code> and shift B right by one.',
    'Because <code>(x × y) % C = ((x % C) × (y % C)) % C</code>, you can take <code>% C</code> after every multiplication. The numbers stay below C, and products stay below C² ≤ 10¹⁸, which fits in <code>long</code>.',
    'Edge cases: Java\'s <code>%</code> keeps the sign of A, so <code>((A % C) + C) % C</code> moves a negative A into [0, C). Starting with <code>result = 1 % C</code> makes C = 1 return 0, and B = 0 returns 1 % C.'
  ],
  cmp: [['Math.pow(A, B) % C', 'O(1)', 'wrong: double overflows / loses precision'], ['Multiply A, B times, % C each time', 'O(B)', 'O(1), 10⁹ steps is too slow'], ['Binary exponentiation', 'O(log B)', 'O(1), about 30 steps']],
  eff: 'B can be 10⁹, so multiplying B times is far too slow. Each squaring doubles the exponent, so about 30 steps reach any B up to 10⁹. Use <code>long</code> for <code>base</code> and <code>result</code>: two values just under 10⁹ multiply to nearly 10¹⁸, which would overflow <code>int</code>.',
  run({ a, b, c }) {
    const A = BigInt(parseInt(a, 10)), B0 = parseInt(b, 10), C = BigInt(parseInt(c, 10));
    if ([a, b, c].some(x => !/^-?\d+$/.test(x.trim()))) throw new Error('A, B and C must be whole numbers.');
    if (B0 < 0 || B0 > 1e9) throw new Error('B must be between 0 and 10⁹.');
    if (C < 1n || C > 1000000000n) throw new Error('C must be between 1 and 10⁹.');
    if (A < -1000000000n || A > 1000000000n) throw new Error('A must be between −10⁹ and 10⁹.');
    let base = ((A % C) + C) % C, result = 1n % C, bb = B0; const F = []; let k = 0;
    const bits = B0.toString(2); const ladder = [];
    const st = (mode) => ({ bits, k, mode, ladder: clone(ladder), result: String(result), base: String(base), B0 });
    const V = () => ({ base: String(base), result: String(result), b: bb, 'b (binary)': bb.toString(2) || '0' });
    F.push({ line: 'init', msg: `base = ((${A} % ${C}) + ${C}) % ${C} = ${base}${A < 0n ? '. A is negative, so add C to make it non-negative' : ''}. result = 1 % ${C} = ${result}. B = ${B0} is ${bits} in binary.`, vars: V(), st: st() });
    while (bb > 0) {
      const set = bb & 1; const before = result;
      if (set) result = (result * base) % C;
      ladder.push({ k, base: String(base), used: !!set });
      F.push({ line: set ? 'mul' : 'loop', msg: set ? `Bit ${k} is 1, so this power is part of B: result = ${before} × ${base} % ${C} = ${result}.` : `Bit ${k} is 0, so this power is not part of B. result stays ${result}.`, vars: V(), st: st(set ? 'mul' : 'skip') });
      const ob = base; base = (base * base) % C; bb = Math.floor(bb / 2); k++;
      F.push({ line: 'sq', msg: `Square base: ${ob}² % ${C} = ${base}, which is A^${2 ** k <= 1e15 ? (2 ** k).toLocaleString('en-US') : '2^' + k} mod C. Shift b right to ${bb}.`, vars: V(), st: st('sq') });
    }
    F.push({ line: 'ret', msg: `b is 0, so every bit of B has been used. That took ${k} loop step${k === 1 ? '' : 's'} instead of ${B0.toLocaleString('en-US')} multiplications.`, vars: V(), st: st(), result: String(result) });
    return F;
  },
  render(st) {
    const L = st.bits.length; const b = [...st.bits];
    const bitIdx = i => L - 1 - i;
    const grid = st.B0 === 0 ? '<span class="empty">B = 0, so there are no bits and the answer is 1 % C</span>' : cells(b, {
      idx: false,
      cls: i => { const k = bitIdx(i); return k === st.k && st.mode !== 'sq' && st.mode ? (b[i] === '1' ? 'cur t2' : 'cur') : k < st.k || (k === st.k && st.mode === 'sq') ? (b[i] === '1' ? 'ok' : 'dim') : b[i] === '1' ? 't1' : ''; },
      top: i => bitIdx(i) === st.k && st.mode && st.mode !== 'sq' ? [['bit ' + st.k, 'c-p2']] : [],
      bot: i => [[String(2 ** bitIdx(i) <= 1e9 ? 2 ** bitIdx(i) : '2^' + bitIdx(i)), 'c-p3']]
    });
    const lad = st.ladder.length ? `<table class="maptbl"><tr><th>k</th><th>A^(2^k) mod C</th><th>bit</th><th>used</th></tr>${st.ladder.map((r, i) => `<tr class="${i === st.ladder.length - 1 && st.mode !== 'sq' ? 'on' : ''}"><td>${r.k}</td><td>${r.base}</td><td>${r.used ? 1 : 0}</td><td>${r.used ? '× into result' : '—'}</td></tr>`).join('')}</table>` : '<span class="empty">empty</span>';
    return block('B in binary (each 1 bit adds its power of 2 to the exponent)', grid)
      + `<div class="row2">${block('base (current A^(2^k) mod C)', `<span class="big c-p1">${st.base}</span>`)}${block('result', `<span class="big c-ok">${st.result}</span>`)}</div>`
      + block('squaring ladder', lad);
  }
});
