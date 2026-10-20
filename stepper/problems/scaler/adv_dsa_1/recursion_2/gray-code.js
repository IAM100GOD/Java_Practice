/* 47. Gray Code (Scaler) */
P.push({
  id: 'gray-code', title: 'Gray Code', level: 'medium', group: 'scaler-rec2', file: 'GrayCode.java', dir: 'scaler/adv_dsa_1/recursion_2',
  statement: 'Return the A-bit gray code sequence. It starts at 0, and each value differs from the previous one in exactly one bit. Constraint: A ≤ 16.',
  technique: 'Recursion: reflect the (A−1)-bit code and set the new top bit', time: 'O(2ᴬ)', space: 'O(2ᴬ)',
  inputs: [{ key: 'a', label: 'A', def: '3', narrow: true }],
  samples: [['1'], ['2'], ['3'], ['4']],
  code: "public int[] grayCode(int A) {\n    if (A == 0) return new int[]{0}; @base\n    int[] prev = grayCode(A - 1); @rec\n    int m = prev.length;\n    int[] res = new int[2 * m];\n    for (int i = 0; i < m; i++) {\n        res[i] = prev[i];                                // first half: old codes, top bit 0\n        res[2 * m - 1 - i] = prev[i] | (1 << (A - 1));   // second half: mirrored, top bit 1 @fill\n    }\n    return res; @ret\n}",
  steps: [
    '<strong>Base case:</strong> 0 bits gives the sequence [0].',
    '<strong>Recursive case:</strong> take gray(A−1). The first half of the answer is that list unchanged, with a new top bit of 0. The second half is the same list <strong>in reverse</strong>, with the new top bit set: <code>| (1 &lt;&lt; (A−1))</code>.',
    'Within each half, neighbours already differ by one bit, because gray(A−1) is a gray code.',
    'At the join, the last code of the first half and the first code of the reversed half have <strong>the same</strong> lower A−1 bits, since reversing puts the same code next to itself. Only the new top bit differs, so it is still one bit.',
    'Fill both halves in one loop: <code>res[i] = prev[i]</code> and <code>res[2m−1−i] = prev[i] | topBit</code>. The result equals the formula <code>i ^ (i &gt;&gt; 1)</code>, which the Java file uses as a check.'
  ],
  cmp: [['Backtracking: flip one bit, avoid repeats', 'O(2ᴬ · A)', 'O(2ᴬ)'], ['Reflect and prefix (recursion)', 'O(2ᴬ)', 'O(2ᴬ)'], ['Formula g(i) = i ^ (i >> 1)', 'O(2ᴬ)', 'O(2ᴬ) output only']],
  eff: 'There are 2ᴬ codes in the output, so O(2ᴬ) is the best possible. Reflect-and-prefix touches each code once per level it appears in, about 2ᴬ⁺¹ writes in total, and the recursion is only A deep. The mirror trick is the whole insight: reversing a list puts matching neighbours next to each other at the join, so adding one bit keeps every step a single-bit change.',
  run({ a }) {
    if (!/^\d+$/.test(a.trim())) throw new Error('A must be a whole number.');
    const A = parseInt(a, 10);
    if (A < 1 || A > 4) throw new Error('The picture fits A from 1 to 4. The Java code handles up to 16.');
    const F = []; const levels = [];
    const st = (k, extra = {}) => ({ A, levels: clone(levels), k, ...extra });
    const rec = n => {
      if (n === 0) { levels.push({ n: 0, codes: [0] }); F.push({ line: 'base', msg: 'gray(0) = [0], the base case. Now build upward one bit at a time.', vars: { A: 0, size: 1 }, st: st(0) }); return [0]; }
      F.push({ line: 'rec', msg: `gray(${n}) needs gray(${n - 1}) first.`, vars: { A: n }, st: st(n) });
      const prev = rec(n - 1); const m = prev.length; const res = Array(2 * m).fill(null);
      for (let i = 0; i < m; i++) {
        res[i] = prev[i]; res[2 * m - 1 - i] = prev[i] | (1 << (n - 1));
        F.push({ line: 'fill', msg: `i = ${i}: res[${i}] = ${prev[i].toString(2).padStart(n - 1 || 1, '0')} (top bit 0). res[${2 * m - 1 - i}] = the same code with the new top bit set = ${res[2 * m - 1 - i].toString(2).padStart(n, '0')} (${res[2 * m - 1 - i]}).`, vars: { A: n, i, 'prev[i]': prev[i], [`res[${i}]`]: res[i], [`res[${2 * m - 1 - i}]`]: res[2 * m - 1 - i] }, st: st(n, { building: { n, codes: [...res], prev: [...prev], i } }) });
      }
      levels.push({ n, codes: [...res] });
      F.push({ line: 'ret', msg: `gray(${n}) = [${res.join(', ')}]. At the join (${res[m - 1].toString(2).padStart(n, '0')} → ${res[m].toString(2).padStart(n, '0')}) only the new top bit changes.`, vars: { A: n, size: res.length }, st: st(n) });
      return res;
    };
    const out = rec(A);
    F.push({ line: 'ret', msg: `The ${A}-bit gray code has ${out.length} values, and each neighbouring pair differs in exactly one bit.`, vars: { size: out.length }, st: st(A), result: `[${out.join(', ')}]` });
    return F;
  },
  render(st) {
    const show = (n, codes, prevLen, hi) => {
      const rows = codes.map((c, i) => {
        if (c === null) return `<div class="jl" style="color:var(--muted)">${'·'.repeat(Math.max(n, 1))}</div>`;
        const bits = c.toString(2).padStart(Math.max(n, 1), '0');
        const top = n > 0 ? `<span class="${i >= prevLen ? 'c-p2' : 'c-p1'}" style="font-weight:700">${bits[0]}</span>${bits.slice(1)}` : bits;
        const diff = i > 0 && codes[i - 1] !== null ? (codes[i - 1] ^ c) : 0;
        return `<div class="jl ${hi && hi.includes(i) ? 'cur' : ''}" ${i === prevLen && n > 0 ? 'style="border-top:2px dashed var(--p2)"' : ''}>${top}  <span style="color:var(--muted)">= ${c}${diff ? '   flips bit ' + Math.log2(diff) : ''}</span></div>`;
      }).join('');
      return `<div class="jbox" style="min-width:200px">${rows}</div>`;
    };
    const blocks = st.levels.map(L => block(`gray(${L.n})`, show(L.n, L.codes, L.codes.length / 2))).join('');
    const build = st.building ? block(`building gray(${st.building.n}): top half copied, bottom half mirrored (dashed line = join)`, show(st.building.n, st.building.codes, st.building.codes.length / 2, [st.building.i, st.building.codes.length - 1 - st.building.i])) : '';
    return `<div class="row2">${blocks}${build}</div>`;
  }
});
