/* 14. Different Bits Sum Pairwise (Scaler) */
P.push({
  id: 'different-bits-sum', title: 'Different Bits Sum Pairwise', level: 'medium', group: 'scaler-bits1', file: 'DifferentBitsSumPairwise.java', dir: 'scaler/adv_dsa_1/bit_manipulations_1',
  statement: '<code>f(X, Y)</code> is the number of bit positions where X and Y differ, so f(2, 7) = 2 because 010 and 111 differ in two places. Return the sum of <code>f(A[i], A[j])</code> over all ordered pairs (i, j), modulo 10⁹+7. Constraints: N ≤ 10⁵, A[i] ≤ 2³¹ − 1.',
  technique: 'Count ones per bit position', time: 'O(31 · N)', space: 'O(1)',
  inputs: [{ key: 'a', label: 'A', def: '1, 3, 5' }],
  samples: [['1, 3, 5'], ['2, 3'], ['2, 7'], ['4, 9, 12, 6, 1']],
  code: "public static int cntBits(int[] A) {\n    final long MOD = 1_000_000_007L;\n    long n = A.length, ans = 0; @init\n\n    for (int bit = 0; bit < 31; bit++) {               // A[i] <= 2^31 - 1, so bits 0..30\n        long ones = 0; @bit\n        for (int x : A) {\n            if (((x >> bit) & 1) == 1) ones++; @count\n        }\n        ans = (ans + 2 * ones * (n - ones)) % MOD;    // fits in long: 2 * 5e4 * 5e4 at most @add\n    }\n    return (int) ans; @ret\n}",
  steps: [
    'Change the question. Instead of asking "how many bits differ for each pair?", ask "for each bit position, how many pairs differ there?" Both questions add up to the same total.',
    'Fix one bit position. Count how many numbers have a 1 there (<code>ones</code>). The rest have a 0 (<code>zeros = N − ones</code>).',
    'Two numbers differ at that bit only if one has a 1 and the other has a 0. There are <code>ones × zeros</code> such pairs.',
    'The pairs are ordered, so (i, j) and (j, i) both count. Multiply by 2. Pairs where i = j never differ, so they add nothing.',
    'Do this for all 31 bit positions and add the results, taking the modulo as you go. <code>(x &gt;&gt; bit) &amp; 1</code> reads a single bit of x.'
  ],
  cmp: [['Every ordered pair, Integer.bitCount(A[i] ^ A[j])', 'O(N²)', 'O(1)'], ['Count ones per bit, add 2 · ones · zeros', 'O(31 · N)', 'O(1)']],
  eff: 'With N = 10⁵, checking every pair means 10¹⁰ pairs, which is far too slow. Counting per bit needs 31 × 10⁵ ≈ 3 million simple steps. Use <code>long</code> for the arithmetic: 2 × ones × zeros can reach 5 × 10⁹, which overflows <code>int</code>. The modulo keeps <code>ans</code> small.',
  run({ a }) {
    const A = a.split(/[,\s]+/).filter(Boolean).map(Number);
    if (!A.length || A.some(x => !Number.isInteger(x) || x < 1 || x > 2147483647)) throw new Error('Use whole numbers from 1 to 2147483647, separated by commas.');
    if (A.length > 10) throw new Error('Use 10 numbers or fewer so the picture fits.');
    const n = A.length, MOD = 1000000007n; let ans = 0n; const F = [];
    const width = Math.max(...A.map(x => x.toString(2).length));
    const contrib = [];
    let bit = -1, row = -1, ones = 0;
    const st = () => ({ A, width, bit, row, ones, n, contrib: clone(contrib), ans: String(ans) });
    F.push({ line: 'init', msg: `n = ${n} and ans = 0. Each number is shown in binary, one row per number.`, vars: { n, ans: '0' }, st: st() });
    for (bit = 0; bit < 31; bit++) {
      if (bit >= width) {
        row = -1; ones = 0;
        F.push({ line: 'add', msg: `Bits ${width} to 30 are 0 in every number. ones = 0 for each of them, so they add nothing.`, vars: { bit: `${width}..30`, ones: 0, ans: String(ans) }, st: st() });
        break;
      }
      ones = 0; row = -1;
      F.push({ line: 'bit', msg: `Look at bit ${bit} (value ${2 ** bit}) in every number.`, vars: { bit, ones, ans: String(ans) }, st: st() });
      for (row = 0; row < n; row++) {
        const b = (A[row] >> bit) & 1; if (b) ones++;
        F.push({ line: 'count', msg: `(${A[row]} >> ${bit}) & 1 = ${b}. ${b ? `It has a 1 here, so ones = ${ones}.` : 'It has a 0 here.'}`, vars: { bit, x: A[row], ones, ans: String(ans) }, st: st() });
      }
      row = -1;
      const z = n - ones, c = 2 * ones * z; ans = (ans + BigInt(c)) % MOD;
      contrib.push({ bit, ones, z, c });
      F.push({ line: 'add', msg: c ? `${ones} ones and ${z} zeros, so ${ones} × ${z} pairs differ at bit ${bit}, counted in both orders: 2 × ${ones} × ${z} = ${c}. ans = ${ans}.` : `ones = ${ones}, zeros = ${z}. All the numbers agree at bit ${bit}, so it adds 0.`, vars: { bit, ones, zeros: z, 'add': c, ans: String(ans) }, st: st() });
    }
    bit = -1;
    F.push({ line: 'ret', msg: 'Add up what every bit position contributed.', vars: { ans: String(ans) }, st: st(), result: String(ans) });
    return F;
  },
  render(st) {
    const W = st.width; const cols = [...Array(W).keys()].reverse();
    let g = `<div class="scroll"><div class="spiral" style="grid-template-columns:auto repeat(${W}, 34px)"><div></div>`;
    cols.forEach(b => { g += `<div class="sx">${b === st.bit ? '<span class="c-p2">bit</span>' : ''}<span style="color:var(--muted);font-weight:400">${b}</span></div>`; });
    st.A.forEach((x, r) => {
      g += `<div class="sy" style="flex-direction:row;gap:6px;align-items:center">${r === st.row ? '<span class="c-acc">x ▸</span>' : ''}<span style="font-size:.8rem;color:var(--ink);font-weight:400">${x}</span></div>`;
      cols.forEach(b => {
        const v = (x >> b) & 1; const active = b === st.bit;
        const seen = active && (st.row === -1 ? true : r <= st.row);
        const cls = [active && r === st.row ? 'cur' : '', seen ? (v ? 't1' : 't3') : active ? 'win' : st.bit !== -1 || b > st.bit ? '' : '', !active && st.bit !== -1 ? 'dim' : ''].join(' ');
        g += `<div class="cell ${cls}">${v}</div>`;
      });
    });
    g += '</div></div>';
    const zeros = st.n - st.ones;
    const live = st.bit >= 0 ? `<div class="row2">${block('ones (blue)', `<span class="big c-p1">${st.ones}</span>`)}${block('zeros (purple)', `<span class="big c-p3">${st.row === -1 ? zeros : '…'}</span>`)}${block('this bit adds', `<span class="big">${st.row === -1 ? `2×${st.ones}×${zeros} = ${2 * st.ones * zeros}` : '…'}</span>`)}</div>` : '';
    const list = st.contrib.length ? tokens(st.contrib.map(c => `bit ${c.bit}: 2×${c.ones}×${c.z} = ${c.c}`), i => st.contrib[i].c ? 'ok' : '') : '<span class="empty">none yet</span>';
    return block('A in binary (bit 0 on the right)', g) + live + `<div class="row2">${block('added per bit', list)}${block('ans', `<span class="big c-ok">${st.ans}</span>`)}</div>`;
  }
});
