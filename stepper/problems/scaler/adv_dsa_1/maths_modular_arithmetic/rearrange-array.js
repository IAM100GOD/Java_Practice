/* 16. Rearrange Array (Scaler) */
P.push({
  id: 'rearrange-array', title: 'Rearrange Array', level: 'medium', group: 'scaler-modarith', file: 'RearrangeArray.java', dir: 'scaler/adv_dsa_1/maths_modular_arithmetic',
  statement: 'Rearrange the array so that <code>A[i]</code> becomes <code>A[A[i]]</code>, using O(1) extra space. The elements are distinct and each is between 0 and N − 1. Constraint: N ≤ 5 × 10⁴.',
  technique: 'Store two values in one cell: old + new × N', time: 'O(N)', space: 'O(1)',
  inputs: [{ key: 'a', label: 'A', def: '4, 0, 2, 1, 3' }],
  samples: [['1, 0'], ['0, 2, 1, 3'], ['3, 2, 0, 1'], ['4, 0, 2, 1, 3']],
  code: "public void arrange(ArrayList<Integer> A) {\n    int n = A.size(); @init\n    for (int i = 0; i < n; i++) {\n        int old = A.get(i);                          // still un-encoded at this point\n        A.set(i, old + (A.get(old) % n) * n); @encode\n    }\n    for (int i = 0; i < n; i++) {\n        A.set(i, A.get(i) / n); @decode\n    }\n} @ret",
  steps: [
    'The difficulty: if you write <code>A[i] = A[A[i]]</code> directly, you overwrite a value that a later index may still need to read.',
    'Every value is less than N, so one cell can hold two of them as <code>old + new × N</code>. Then <code>% N</code> gives back the old value and <code>/ N</code> gives the new one. This is like storing two digits in base N.',
    'Pass 1: for each i, read the target\'s <strong>old</strong> value with <code>A[A[i]] % N</code>, even if that cell is already encoded, and add it to A[i] multiplied by N. A[i] has not been changed yet when you reach it, so it can be used as an index directly.',
    'Pass 2: divide every cell by N. That removes the old values and leaves only the new ones.',
    'Watch for overflow: the encoded value can reach N² − 1. With N = 5 × 10⁴ that is 2.5 × 10⁹, more than <code>int</code> can hold. The Java file also has <code>arrangeSafe</code>, which stores old in the low 16 bits and new in the high 16 bits instead.'
  ],
  cmp: [['Copy into a new array B[i] = A[A[i]]', 'O(N)', 'O(N)'], ['Follow cycles of the permutation, marking visited', 'O(N)', 'O(N) for marks'], ['Encode old + new × N in place', 'O(N)', 'O(1)']],
  eff: 'Making a copy is easy, but it uses O(N) memory, which the problem does not allow. Encoding lets each cell keep its old value (needed by other indexes) and its new value at the same time, so two passes are enough with no extra array. The same trick, "pack two numbers into one with % and /", comes up in many in-place array problems.',
  run({ a }) {
    const A = a.split(/[,\s]+/).filter(Boolean).map(Number); const n = A.length;
    if (!n || A.some(x => !Number.isInteger(x) || x < 0 || x >= n) || new Set(A).size !== n) throw new Error(`Enter each of 0..N−1 exactly once (here N = ${n}).`);
    if (n > 12) throw new Error('Use 12 numbers or fewer so the picture fits.');
    const orig = [...A]; const F = []; let i = -1, tgt = -1, phase = 'encode';
    const st = () => ({ A: [...A], orig, n, i, tgt, phase });
    F.push({ line: 'init', msg: `n = ${n}. Each cell will temporarily hold old + new × ${n}.`, vars: { n }, st: st() });
    for (i = 0; i < n; i++) {
      tgt = A[i]; const raw = A[tgt]; const old = raw % n;
      A[i] += old * n;
      F.push({ line: 'encode', msg: `i = ${i}: A[i] is still its original value, ${tgt}. Read A[${tgt}] = ${raw}${raw >= n ? `, which is already encoded, but ${raw} % ${n} = ${old} gives its old value` : `, and ${raw} % ${n} = ${old}`}. A[${i}] = ${tgt} + ${old} × ${n} = ${A[i]}.`, vars: { i, 'A[i] (old)': tgt, [`A[${tgt}] % n`]: old, 'A[i] now': A[i] }, st: st() });
    }
    tgt = -1; phase = 'decode';
    for (i = 0; i < n; i++) {
      const before = A[i]; A[i] = Math.floor(A[i] / n);
      F.push({ line: 'decode', msg: `${before} / ${n} = ${A[i]}. Dividing drops the old part and keeps the new one.`, vars: { i, before, 'A[i]': A[i] }, st: st() });
    }
    i = -1;
    F.push({ line: 'ret', msg: 'Every A[i] now equals the original A[A[i]].', vars: { n }, st: st(), result: `[${A.join(', ')}]` });
    return F;
  },
  render(st) {
    const n = st.n;
    let h = '<div class="scroll"><div class="cells">';
    st.A.forEach((v, k) => {
      const enc = v >= n || (st.phase === 'encode' && k < st.i) || (st.phase === 'encode' && k === st.i);
      const old = v % n, nw = Math.floor(v / n);
      const top = [k === st.i ? '<span class="ptr c-acc">i</span>' : '', k === st.tgt ? '<span class="ptr c-p2">A[i]</span>' : ''].join('');
      const cls = st.phase === 'decode' ? (k <= st.i || st.i === -1 ? 'ok' : 't1') : k === st.i ? 'cur t1' : k === st.tgt ? 't2' : enc ? 't1' : '';
      const sub = st.phase === 'encode' && enc
        ? `<span class="ix"><span class="c-p3">old ${old}</span></span><span class="ix"><span class="c-p1">new ${nw}</span></span>`
        : st.phase === 'decode' && v >= n ? `<span class="ix"><span class="c-p3">old ${old}</span></span><span class="ix"><span class="c-p1">new ${nw}</span></span>` : '<span class="ix">&nbsp;</span><span class="ix">&nbsp;</span>';
      h += `<div class="cw"><div class="ptrs">${top}</div><div class="cell wide ${cls}">${v}</div><div class="ix">[${k}]</div>${sub}</div>`;
    });
    h += '</div></div>';
    return block(`A. An encoded cell = old + new × ${n}`, h)
      + `<div class="row2">${block('original A', tokens(st.orig.map(String)))}${block('target A[A[i]]', tokens(st.orig.map(x => String(st.orig[x])), () => 'ok'))}</div>`;
  }
});
