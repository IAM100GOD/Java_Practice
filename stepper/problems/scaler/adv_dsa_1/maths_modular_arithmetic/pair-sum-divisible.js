/* 19. Pair Sum divisible by M (Scaler) */
P.push({
  id: 'pair-sum-divisible', title: 'Pair Sum Divisible by M', level: 'medium', group: 'scaler-modarith', file: 'PairSumDivisibleByM.java', dir: 'scaler/adv_dsa_1/maths_modular_arithmetic',
  statement: 'Count the pairs (i &lt; j) whose sum <code>A[i] + A[j]</code> is divisible by B. Return the count modulo 10⁹+7. Constraints: N ≤ 10⁵, A[i] ≤ 10⁹, B ≤ 10⁶.',
  technique: 'Remainder buckets + complement lookup', time: 'O(N + B)', space: 'O(B)',
  inputs: [{ key: 'a', label: 'A', def: '1, 2, 3, 4, 5' }, { key: 'b', label: 'B', def: '2', narrow: true }],
  samples: [['1, 2, 3, 4, 5', '2'], ['5, 17, 100, 11', '28'], ['3, 7, 11, 4, 9, 2, 14, 6', '7'], ['6, 6, 6, 6', '3']],
  code: "public int solve(int[] A, int B) {\n    final long MOD = 1_000_000_007L;\n    long[] count = new long[B];          // count[r] = earlier numbers with remainder r\n    long ans = 0; @init\n\n    for (int x : A) {\n        int r = x % B;\n        int need = (B - r) % B;          // % B turns \"B - 0\" into 0 @need\n        ans = (ans + count[need]) % MOD; @add\n        count[r]++; @record\n    }\n    return (int) ans; @ret\n}",
  steps: [
    '<strong>Only remainders matter.</strong> <code>(x + y) % B == 0</code> exactly when <code>(x % B + y % B) % B == 0</code>. So 17 and 11 with B = 28 behave the same as any other pair with remainders 17 and 11.',
    'A number with remainder <code>r</code> needs a partner with remainder <code>(B − r) % B</code>. For B = 7, remainder 3 needs 4. Remainder 0 needs 0, which is what the final <code>% B</code> handles, because B − 0 = B would be out of range.',
    'Walk the array once. For each x, first add <code>count[need]</code>: the earlier numbers it pairs with. Then increment <code>count[r]</code>.',
    'Looking only at <strong>earlier</strong> numbers counts each pair once, as i &lt; j, and never pairs a number with itself.',
    'Keep <code>count</code> and <code>ans</code> as <code>long</code> and take the modulo. N = 10⁵ equal numbers make about 5 × 10⁹ pairs, which overflows <code>int</code>.'
  ],
  cmp: [['Check every pair (i, j)', 'O(N²) = 10¹⁰', 'O(1)'], ['Count remainders, then combine buckets r with B − r', 'O(N + B)', 'O(B)'], ['One pass with complement lookup', 'O(N + B)', 'O(B)']],
  eff: "With N = 10⁵, checking every pair takes about 5 × 10⁹ checks, which is too slow. Grouping by remainder replaces that with one array lookup per number. It's the same idea as Two Sum with a hash map, except the key is the remainder instead of the value. B ≤ 10⁶, so a plain <code>long[B]</code> array works and is faster than a HashMap.",
  run({ a, b }) {
    const A = a.split(/[,\s]+/).filter(Boolean).map(Number), B = parseInt(b, 10);
    if (!A.length || A.some(x => !Number.isInteger(x) || x < 1 || x > 1e9)) throw new Error('A must be whole numbers from 1 to 10⁹.');
    if (!(B >= 1 && B <= 1e6)) throw new Error('B must be between 1 and 10⁶.');
    if (A.length > 14) throw new Error('Use 14 numbers or fewer so the picture fits.');
    const count = {}; let ans = 0; const F = []; const pairs = [];
    let i = -1, r = null, need = null, stage = null; const rem = A.map(x => x % B);
    const cnt = k => count[k] || 0;
    const st = () => ({ A, rem, B, count: { ...count }, i, r, need, stage, pairs: clone(pairs), ans });
    const V = () => ({ x: i >= 0 ? A[i] : '—', r: r ?? '—', need: need ?? '—', 'count[need]': need != null ? cnt(need) : '—', ans });
    F.push({ line: 'init', msg: `count[] has ${B} slots, one for each remainder 0..${B - 1}. They all start at 0.`, vars: V(), st: st() });
    for (i = 0; i < A.length; i++) {
      r = A[i] % B; need = (B - r) % B; stage = 'need';
      F.push({ line: 'need', msg: `${A[i]} % ${B} = ${r}. A partner must have remainder (${B} − ${r}) % ${B} = ${need}${r === 0 ? ', so multiples of B pair with each other' : ''}.`, vars: V(), st: st() });
      const got = cnt(need); ans += got; stage = 'add';
      for (let j = 0; j < i; j++) if (rem[j] === need) pairs.push([A[j], A[i]]);
      F.push({ line: 'add', msg: got ? `Bucket ${need} holds ${got} earlier number${got > 1 ? 's' : ''}, so ${A[i]} makes ${got} new pair${got > 1 ? 's' : ''}. ans = ${ans}.` : `Bucket ${need} is empty, so ${A[i]} makes no pairs with earlier numbers.`, vars: V(), st: st() });
      count[r] = cnt(r) + 1; stage = 'record';
      F.push({ line: 'record', msg: `Put ${A[i]} in bucket ${r}, so later numbers can pair with it. count[${r}] = ${count[r]}.`, vars: V(), st: st() });
    }
    i = -1; r = null; need = null; stage = null;
    F.push({ line: 'ret', msg: `Every number was checked against the earlier ones once. ${ans} pair${ans === 1 ? '' : 's'}.`, vars: V(), st: st(), result: String(ans % 1000000007) });
    return F;
  },
  render(st) {
    const grid = cells(st.A.map(String), {
      wide: true,
      cls: k => st.i === -1 ? '' : k === st.i ? 'cur t2' : k > st.i ? 'dim' : st.rem[k] === st.need && st.stage !== 'need' ? 'ok' : '',
      top: k => k === st.i ? [['x', 'c-p2']] : [],
      bot: k => [['r=' + st.rem[k], 'c-p3']]
    });
    const all = st.B <= 14;
    let keys = all ? [...Array(st.B).keys()] : [...new Set([...Object.keys(st.count).map(Number), ...(st.need != null ? [st.need] : []), ...(st.r != null ? [st.r] : [])])].sort((x, y) => x - y);
    let bk = '', prev = -1;
    keys.forEach(rr => {
      if (!all && rr > prev + 1) bk += '<div class="bk"><span class="ch" style="color:var(--muted)">…</span></div>';
      const c = st.count[rr] || 0, isNeed = rr === st.need;
      const style = isNeed ? 'style="outline:2px solid var(--ok);outline-offset:2px;border-radius:4px"' : '';
      bk += `<div class="bk ${rr === st.r && st.stage === 'record' ? 'on' : ''}" ${style}><span class="ch">${rr}</span><span class="ct">${c}</span>${'<span class="sq"></span>'.repeat(c)}</div>`;
      prev = rr;
    });
    if (!all && prev < st.B - 1) bk += '<div class="bk"><span class="ch" style="color:var(--muted)">…</span></div>';
    const label = all ? 'count[r] buckets (green outline = the remainder needed now)' : `count[r] buckets, showing only the non-empty ones and the one being looked up, out of ${st.B} (green outline = needed now)`;
    return block('A (r = remainder mod B)', grid)
      + block(label, keys.length ? `<div class="scroll"><div class="buckets" style="min-height:70px">${bk}</div></div>` : '<span class="empty">all buckets are 0</span>')
      + `<div class="row2">${block('pairs found', tokens(st.pairs.map(p => `(${p[0]}, ${p[1]})`), () => 'ok'))}${block('ans', `<span class="big c-ok">${st.ans}</span>`)}</div>`;
  }
});
