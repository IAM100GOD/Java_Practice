/* A8. Rat Count House (Accenture) */
P.push({
  id: 'acc-rat-count', title: 'Rat Count House', level: 'easy', group: 'accenture', file: 'RatCountHouse.java', dir: 'AccentureQuestions',
  statement: 'There are <code>r</code> rats and each eats <code>unit</code> food. <code>arr[i]</code> is the food in house i, visited in order from index 0. Return the minimum number of houses needed to feed all rats, \u22121 if all the food is not enough, and 0 if the array is null or empty. Example: r = 7, unit = 2, arr = [2, 8, 3, 5, 7, 4, 1, 2] \u2192 need 14 \u2192 4.',
  technique: 'Running (prefix) sum with early exit', time: 'O(n)', space: 'O(1)',
  inputs: [{ key: 'r', label: 'r', def: '7', narrow: true }, { key: 'u', label: 'unit', def: '2', narrow: true }, { key: 'a', label: 'arr', def: '2, 8, 3, 5, 7, 4, 1, 2' }],
  samples: [['7', '2', '2, 8, 3, 5, 7, 4, 1, 2'], ['5', '1', '1, 1, 1'], ['0', '3', '4, 2'], ['3', '3', '9, 1'], ['2', '2', '']],
  code: "public static int ratCount(int r, int unit, int[] arr) {\n    if (arr == null || arr.length == 0) return 0; @empty\n    long needed = (long) r * unit; @need\n    long food = 0;\n    for (int i = 0; i < arr.length; i++) {\n        food += arr[i]; @add\n        if (food >= needed) return i + 1;   // houses 0..i are enough @done\n    }\n    return -1;                              // not enough food anywhere @fail\n}",
  steps: [
    'Total food required is <code>r \u00d7 unit</code>.',
    'Houses must be taken in order from index 0, so just keep adding food house by house.',
    'The first moment the running total reaches the requirement, the answer is the number of houses used, <code>i + 1</code>.',
    'If the loop ends without reaching it, there is not enough food: return \u22121.',
    'Use <code>long</code> for the product and sum so large inputs do not overflow.'
  ],
  cmp: [['Sum all, then rescan', 'O(n)', 'O(1)'], ['Running sum with early exit', 'O(n)', 'O(1)']],
  eff: 'One pass, and it stops as soon as enough food has been collected.',
  run({ r, u, a }) {
    const R = Number(r), U = Number(u); const A = a.split(/[,\s]+/).filter(Boolean).map(Number); const n = A.length;
    if (!Number.isInteger(R) || !Number.isInteger(U) || R < 0 || U < 0 || A.some(x => !Number.isInteger(x) || x < 0)) throw new Error('r, unit and arr must be non-negative integers.');
    if (n > 14) throw new Error('Use 14 houses or fewer.');
    const F = []; const need = R * U; let food = 0, i = -1, hit = -1;
    const st = () => ({ A, i, food, need, hit });
    if (!n) { F.push({ line: 'empty', msg: 'The array is empty. Return 0.', vars: { result: 0 }, st: st(), result: '0' }); return F; }
    F.push({ line: 'need', msg: `${R} rats \u00d7 ${U} food each = ${need} food needed.`, vars: { r: R, unit: U, needed: need }, st: st() });
    for (i = 0; i < n; i++) {
      food += A[i];
      F.push({ line: 'add', msg: `House ${i} has ${A[i]}. food = ${food}.`, vars: { i, 'arr[i]': A[i], food, needed: need }, st: st() });
      if (food >= need) { hit = i; F.push({ line: 'done', msg: `${food} \u2265 ${need}. Houses 0..${i} are enough: return ${i + 1}.`, vars: { i, food, needed: need, result: i + 1 }, st: st(), result: String(i + 1) }); return F; }
    }
    i = -1;
    F.push({ line: 'fail', msg: `All houses give only ${food} < ${need}. Return -1.`, vars: { food, needed: need, result: -1 }, st: st(), result: '-1' });
    return F;
  },
  render(st) {
    const pct = st.need ? Math.min(100, Math.round(st.food / st.need * 100)) : 100;
    const bar = `<div style="height:14px;border-radius:7px;background:var(--surface-2);overflow:hidden"><div style="height:100%;width:${pct}%;background:${st.food >= st.need ? 'var(--ok)' : 'var(--p2)'};transition:width .25s"></div></div>`;
    return block('food in each house', cells(st.A, { top: k => k === st.i ? [['i', 'c-acc']] : [], cls: k => st.hit >= 0 && k <= st.hit ? 'ok' : k === st.i ? 'cur t1' : st.i >= 0 && k < st.i ? 't2' : st.i >= 0 ? '' : 'dim' }))
      + block(`collected ${st.food} / needed ${st.need}`, bar);
  }
});
