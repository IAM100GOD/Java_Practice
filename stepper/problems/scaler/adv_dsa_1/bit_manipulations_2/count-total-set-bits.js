/* 15. Count Total Set Bits (Scaler) */
P.push({
  id: 'count-total-set-bits', title: 'Count Total Set Bits', level: 'medium', group: 'scaler-bits2', file: 'CountTotalSetBits.java', dir: 'scaler/adv_dsa_1/bit_manipulations_2',
  statement: 'Given a positive integer A, count the total number of 1 bits in the binary forms of every number from 1 to A. Return it modulo 10⁹+7. Constraints: 1 ≤ A ≤ 10⁹.',
  technique: 'Repeating pattern per bit position', time: 'O(log A)', space: 'O(1)',
  inputs: [{ key: 'a', label: 'A', def: '10', narrow: true }],
  samples: [['3'], ['1'], ['7'], ['10'], ['21']],
  code: "public static int solve(int A) {\n    final long MOD = 1_000_000_007L;\n    long n = (long) A + 1;                        // numbers 0..A\n    long ans = 0; @init\n\n    for (long half = 1; half <= A; half <<= 1) {  // half = 2^i, stop once bit i is above A @bit\n        long cycle = half << 1;                   // pattern length 2^(i+1) @cycle\n        long full = n / cycle; @full\n        long rem = n % cycle; @rem\n        ans += full * half + Math.max(0, rem - half); @add\n    }\n    return (int) (ans % MOD);                     // ans <= ~1.6e10, fits in long @ret\n}",
  steps: [
    'Write 0, 1, 2, …, A in binary and read one bit position down the list. The bits follow a fixed pattern. Bit 0 goes <code>0 1 0 1 …</code>, bit 1 goes <code>0 0 1 1 0 0 1 1 …</code>, and bit i is 2ⁱ zeros followed by 2ⁱ ones, repeating every 2ⁱ⁺¹ numbers.',
    'Count from 0 rather than 1, so the pattern starts cleanly. 0 has no 1 bits, so the answer is unchanged. That makes <code>n = A + 1</code> numbers.',
    'Full cycles: <code>n / 2ⁱ⁺¹</code> complete repeats, each with exactly 2ⁱ ones.',
    'Leftover: <code>n % 2ⁱ⁺¹</code> numbers at the end. Their first 2ⁱ bits are zeros, so they add <code>max(0, leftover − 2ⁱ)</code> ones.',
    'Add this up for every bit position with 2ⁱ ≤ A, which is at most 30 positions.'
  ],
  cmp: [['Loop 1..A, Integer.bitCount(x) each', 'O(A log A)', 'O(1)'], ['Brian Kernighan per number (x &= x−1)', 'O(total set bits)', 'O(1)'], ['Count by the repeating pattern per bit', 'O(log A)', 'O(1)']],
  eff: 'A can be 10⁹, so going through every number takes about 10⁹ steps and is too slow. The pattern lets you count each bit position with one division and one modulo, so the loop runs only about 30 times. The total can reach about 1.6 × 10¹⁰, which is too big for an <code>int</code>, so use <code>long</code> and take the modulo at the end.',
  run({ a }) {
    const A = parseInt(a, 10);
    if (!(A >= 1)) throw new Error('A must be 1 or more.');
    if (A > 40) throw new Error('The picture only fits A up to 40. The Java code handles up to 10⁹.');
    const n = A + 1; let ans = 0; const F = []; const width = A.toString(2).length;
    let bit = -1, half = 0, cycle = 0, full = null, rem = null, stage = null; const added = [];
    const st = () => ({ A, width, bit, half, cycle, full, rem, stage, added: clone(added), ans });
    const V = () => ({ n, half: half || '—', cycle: cycle || '—', full: full ?? '—', rem: rem ?? '—', ans });
    F.push({ line: 'init', msg: `Count over 0..${A}, which is n = ${n} numbers. 0 has no 1 bits, so including it changes nothing, and the pattern starts cleanly at 0.`, vars: V(), st: st() });
    for (half = 1, bit = 0; half <= A; half *= 2, bit++) {
      cycle = 2 * half; full = null; rem = null;
      stage = 'cycle'; F.push({ line: 'cycle', msg: `Bit ${bit}: the pattern is ${half} zero${half > 1 ? 's' : ''} then ${half} one${half > 1 ? 's' : ''}, repeating every ${cycle} numbers. Each block is shaded separately.`, vars: V(), st: st() });
      full = Math.floor(n / cycle); stage = 'full';
      F.push({ line: 'full', msg: `${n} / ${cycle} = ${full} complete cycle${full === 1 ? '' : 's'}, each with ${half} ones: ${full} × ${half} = ${full * half}.`, vars: V(), st: st() });
      rem = n % cycle; stage = 'rem'; const extra = Math.max(0, rem - half);
      F.push({ line: 'rem', msg: rem === 0 ? `${n} % ${cycle} = 0, so there is no leftover part.` : `${n} % ${cycle} = ${rem} leftover numbers. The first ${half} of them are zeros, so they add max(0, ${rem} − ${half}) = ${extra} ones.`, vars: V(), st: st() });
      const c = full * half + extra; ans += c; added.push({ bit, full, half, extra, c }); stage = 'add';
      F.push({ line: 'add', msg: `Bit ${bit} has ${full}×${half} + ${extra} = ${c} ones. ans = ${ans}.`, vars: V(), st: st() });
    }
    const nextHalf = half; bit = -1; half = 0; cycle = 0; full = null; rem = null; stage = null;
    F.push({ line: 'bit', msg: `The next bit value, ${nextHalf}, is greater than A = ${A}, so no number up to A has that bit set. Stop.`, vars: { ...V(), half: nextHalf }, st: st() });
    F.push({ line: 'ret', msg: `${ans} % (10⁹+7) = ${ans % 1000000007}.`, vars: V(), st: st(), result: String(ans % 1000000007) });
    return F;
  },
  render(st) {
    const N = st.A + 1; const bits = [...Array(st.width).keys()].reverse();
    let g = `<div class="scroll"><div class="spiral bitgrid" style="grid-template-columns:auto repeat(${N}, 22px)"><div class="sy">x</div>`;
    for (let x = 0; x < N; x++) g += `<div class="sx"><span style="color:var(--muted);font-weight:400">${x}</span></div>`;
    bits.forEach(b => {
      const active = b === st.bit;
      g += `<div class="sy">${active ? '<span class="c-p2">bit ' + b + ' ▸</span>' : `<span style="color:var(--muted);font-weight:400">bit ${b}</span>`}</div>`;
      for (let x = 0; x < N; x++) {
        const v = (x >> b) & 1; let cls = '';
        if (active) {
          const k = Math.floor(x / st.cycle);
          const inFull = st.full !== null && k < st.full, inRem = st.rem !== null && k >= st.full;
          cls = v ? (inFull ? 't1' : inRem ? 't2' : 'cyc') : (k % 2 ? 'zb' : '');
          if (x % st.cycle === 0 && x) cls += ' cb';
        } else if (st.bit !== -1) cls = 'dim';
        else if (v) cls = 'ok';
        g += `<div class="cell ${cls}">${v}</div>`;
      }
    });
    g += '</div></div>';
    const legend = st.bit >= 0 ? `<div class="chips"><span class="tok" style="border-color:var(--p1);background:var(--p1-soft)">ones in full cycles</span><span class="tok" style="border-color:var(--p2);background:var(--p2-soft)">ones in the leftover</span></div>` : '';
    const list = st.added.length ? tokens(st.added.map(c => `bit ${c.bit}: ${c.full}×${c.half} + ${c.extra} = ${c.c}`), () => 'ok') : '<span class="empty">none yet</span>';
    return block('0..A in binary, one row per bit position', g) + legend + `<div class="row2">${block('ones per bit', list)}${block('ans', `<span class="big c-ok">${st.ans}</span>`)}</div>`;
  }
});
