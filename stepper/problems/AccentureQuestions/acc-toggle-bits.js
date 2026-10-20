/* A12. Toggle Bits MSB to LSB (Accenture) */
P.push({
  id: 'acc-toggle-bits', title: 'Toggle Bits (MSB to LSB)', level: 'easy', group: 'accenture', file: 'ToggleBits.java', dir: 'AccentureQuestions',
  statement: 'Given an integer N, invert every bit of its binary representation from the most significant 1 down to the LSB, and return the decimal value. Example: 10 = 1010 \u2192 0101 = 5.',
  technique: 'XOR with an all-ones mask of the same length', time: 'O(log N)', space: 'O(1)',
  inputs: [{ key: 'n', label: 'N', def: '10', narrow: true }],
  samples: [['10'], ['5'], ['1'], ['8'], ['255'], ['0']],
  code: "public static int toggleBits(int n) {\n    if (n == 0) return 1;                // \"0\" -> \"1\" @zero\n    int mask = 0, temp = n; @init\n    while (temp > 0) {\n        mask = (mask << 1) | 1;          // one more 1-bit @grow\n        temp >>= 1;\n    }\n    return n ^ mask;                     // x ^ 1 flips x @xor\n}",
  steps: [
    'Inverting a bit is XOR with 1: <code>0 ^ 1 = 1</code>, <code>1 ^ 1 = 0</code>.',
    '<code>~n</code> would also flip the leading zeros of the 32-bit int and give a negative number, so we need a mask that covers only N\u2019s real bits.',
    'Build the mask by shifting in one 1-bit for every bit of N (shift a copy of N right until it is 0).',
    'For 10 = 1010 the mask is 1111, and 1010 ^ 1111 = 0101 = 5.',
    'Shortcut: <code>mask = Integer.highestOneBit(n) * 2 - 1</code>.'
  ],
  cmp: [['Convert to String, flip chars, parse', 'O(log N)', 'O(log N)'], ['Flip bit by bit with a loop', 'O(log N)', 'O(1)'], ['Mask + one XOR', 'O(log N) to build mask', 'O(1)']],
  eff: 'N has about log\u2082N bits, so every approach is tiny. The mask trick is the cleanest: one XOR does all the flipping.',
  run({ n }) {
    if (!/^\d+$/.test(n.trim())) throw new Error('N must be a non-negative integer.');
    const N = parseInt(n, 10); if (N > 2 ** 30) throw new Error('Use N \u2264 2\u00b3\u2070.');
    const F = []; const bin = N.toString(2); const L = bin.length;
    const pad = v => v.toString(2).padStart(L, '0');
    if (N === 0) { F.push({ line: 'zero', msg: 'N = 0 is binary "0"; flipping it gives "1". Return 1.', vars: { N, result: 1 }, st: { L: 1, rows: [['N', '0'], ['result', '1']], hi: -1 }, result: '1' }); return F; }
    let mask = 0, temp = N;
    const rows = () => [['N', bin], ['temp', temp ? temp.toString(2).padStart(L, ' ') : ''.padStart(L, ' ')], ['mask', mask ? pad(mask) : ''.padStart(L, '0')]];
    F.push({ line: 'init', msg: `N = ${N} = ${bin}\u2082 has ${L} bits. Start with mask = 0, temp = N.`, vars: { N, temp, mask }, st: { L, rows: rows(), hi: -1 } });
    let step = 0;
    while (temp > 0) {
      mask = (mask << 1) | 1; temp >>= 1; step++;
      F.push({ line: 'grow', msg: `mask = (mask << 1) | 1 = ${mask.toString(2)}\u2082; temp >>= 1 \u2192 ${temp ? temp.toString(2) + '\u2082' : '0'}.`, vars: { temp, mask, 'mask (bin)': mask.toString(2) }, st: { L, rows: rows(), hi: L - step } });
    }
    const res = N ^ mask;
    F.push({ line: 'xor', msg: `${bin} ^ ${pad(mask)} = ${pad(res)}\u2082 = ${res}.`, vars: { N, mask, result: res }, st: { L, rows: [['N', bin], ['mask', pad(mask)], ['N ^ mask', pad(res)]], hi: -2 }, result: String(res) });
    return F;
  },
  render(st) {
    return st.rows.map(([lbl, bits]) => block(lbl, cells([...bits], { idx: lbl === st.rows[0][0], noTop: true, cls: k => bits[k] === ' ' ? 'dim' : st.hi === -2 && lbl === 'N ^ mask' ? 'ok' : lbl === 'mask' && bits[k] === '1' ? (st.hi === k ? 'cur t1' : 't2') : bits[k] === '1' ? 't1' : '' }))).join('');
  }
});
