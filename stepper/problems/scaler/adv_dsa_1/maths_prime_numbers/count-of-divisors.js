/* 20. Count of divisors (Scaler) */
P.push({
  id: 'count-of-divisors', title: 'Count of Divisors', level: 'medium', group: 'scaler-primes', file: 'CountOfDivisors.java', dir: 'scaler/adv_dsa_1/maths_prime_numbers',
  statement: 'For every element of A, return how many divisors it has, in the same order. Constraints: N ≤ 10⁵, A[i] ≤ 10⁶.',
  technique: 'Smallest-prime-factor sieve + (e₁+1)(e₂+1)…', time: 'O(M log log M + N log M)', space: 'O(M), M = max(A)',
  inputs: [{ key: 'a', label: 'A', def: '8, 9, 10, 12' }],
  samples: [['2, 3, 4, 5'], ['8, 9, 10'], ['8, 9, 10, 12'], ['36, 48, 60, 1']],
  code: "public int[] solve(int[] A) {\n    int max = 1;\n    for (int x : A) max = Math.max(max, x);\n\n    int[] spf = new int[max + 1];\n    for (int i = 0; i <= max; i++) spf[i] = i;\n    for (int i = 2; (long) i * i <= max; i++) {\n        if (spf[i] == i) {                              // i is prime @prime\n            for (int j = i * i; j <= max; j += i) {\n                if (spf[j] == j) spf[j] = i;            // first (smallest) prime to reach j @mark\n            }\n        }\n    }\n\n    int[] res = new int[A.length];\n    for (int k = 0; k < A.length; k++) {\n        int x = A[k], count = 1; @query\n        while (x > 1) {\n            int p = spf[x], e = 0;\n            while (x % p == 0) { x /= p; e++; } @divide\n            count *= (e + 1); @multiply\n        }\n        res[k] = count; @store\n    }\n    return res; @ret\n}",
  steps: [
    '<strong>The divisor formula.</strong> Write x as prime powers: <code>x = p₁<sup>e₁</sup> × p₂<sup>e₂</sup> × …</code>. A divisor uses each prime 0 to eᵢ times, choosing independently, so the count is <code>(e₁+1)(e₂+1)…</code>. For example, 12 = 2² × 3¹ gives 3 × 2 = 6 divisors.',
    'That leaves the question of how to factor 10⁵ numbers quickly. Build a <strong>smallest prime factor</strong> table once, up to max(A).',
    'Sieve: start with <code>spf[i] = i</code>. For each prime i (one where <code>spf[i]</code> is still i), go through its multiples from i² and set <code>spf[j] = i</code> wherever j has not been marked yet. Smaller primes are processed first, so a number keeps its smallest prime.',
    'Factoring: repeatedly divide x by <code>spf[x]</code>. Count how many times each prime divides it to get the exponent e, and multiply <code>count</code> by e + 1.',
    'Every division at least halves x, so factoring takes O(log x) steps. 1 has no prime factors, so its count stays at 1.'
  ],
  cmp: [['For each x, test d = 1..x', 'O(N · M) = 10¹¹', 'O(1)'], ['For each x, test d up to √x (pairs d, x/d)', 'O(N √M) = 10⁸', 'O(1)'], ['SPF sieve once, then factor each x', 'O(M log log M + N log M)', 'O(M)']],
  eff: 'The sieve costs about 10⁶ steps once, and then every query is about 20 divisions. Checking up to √x for each element would be about 10⁸ steps. The sieve pays off because there are many queries and their values are capped at 10⁶. Another option is a divisor-count sieve: for each i, add 1 to every multiple of i. That takes O(M log M) and gives the answer directly.',
  run({ a }) {
    const A = a.split(/[,\s]+/).filter(Boolean).map(Number);
    if (!A.length || A.some(x => !Number.isInteger(x) || x < 1)) throw new Error('A must be positive whole numbers.');
    const max = Math.max(...A);
    if (max > 60) throw new Error('The picture only fits values up to 60. The Java code handles up to 10⁶.');
    if (A.length > 10) throw new Error('Use 10 numbers or fewer.');
    const spf = [...Array(max + 1).keys()]; const F = []; const res = [];
    let cur = null, marked = [], k = -1, chain = [], factors = [], count = null, x = null;
    const st = () => ({ max, spf: [...spf], cur, marked: [...marked], A, k, chain: clone(chain), factors: clone(factors), count, x, res: [...res] });
    F.push({ line: 'prime', msg: `Build spf[] up to max(A) = ${max}. Every spf[i] starts as i.`, vars: { max }, st: st() });
    for (let i = 2; i * i <= max; i++) {
      if (spf[i] !== i) continue;
      cur = i; marked = [];
      for (let j = i * i; j <= max; j += i) if (spf[j] === j) { spf[j] = i; marked.push(j); }
      F.push({ line: 'mark', msg: `${i} is prime. Go through its multiples from ${i}² = ${i * i}${marked.length ? `: ${marked.join(', ')} get spf = ${i}` : ''}. Multiples that already have a smaller spf keep it.`, vars: { i, 'newly marked': marked.length }, st: st() });
    }
    cur = null; marked = [];
    F.push({ line: 'prime', msg: `The next i would have i² > ${max}, so the sieve is done. Any number whose spf is still itself is prime.`, vars: { max }, st: st() });
    for (k = 0; k < A.length; k++) {
      x = A[k]; count = 1; chain = [x]; factors = [];
      F.push({ line: 'query', msg: `Factor ${x}. count starts at 1.${x === 1 ? ' 1 has no prime factors, so its answer is 1.' : ''}`, vars: { x, count }, st: st() });
      while (x > 1) {
        const p = spf[x]; let e = 0; const from = x;
        while (x % p === 0) { x /= p; e++; chain.push(x); }
        factors.push([p, e]);
        F.push({ line: 'divide', msg: `spf[${from}] = ${p}. Divide by ${p} while possible: ${from} → ${x}, ${e} time${e > 1 ? 's' : ''}, so ${p}^${e}.`, vars: { p, e, x, count }, st: st() });
        count *= e + 1;
        F.push({ line: 'multiply', msg: `${p}^${e} allows ${e + 1} choices (${p}⁰…${p}^${e}). count = ${count}.`, vars: { p, e, x, count }, st: st() });
      }
      res.push(count);
      F.push({ line: 'store', msg: `${A[k]} = ${factors.map(([p, e]) => e > 1 ? `${p}^${e}` : p).join(' × ') || '1'}, so it has ${factors.map(([, e]) => `(${e}+1)`).join('') || '1'} = ${count} divisors.`, vars: { [`res[${k}]`]: count }, st: st() });
    }
    k = -1; count = null; x = null; chain = []; factors = [];
    F.push({ line: 'ret', msg: 'Each number used the shared sieve, so no number was searched for divisors one by one.', vars: { res: `[${res.join(', ')}]` }, st: st(), result: `[${res.join(', ')}]` });
    return F;
  },
  render(st) {
    const primes = []; for (let i = 2; i <= st.max; i++) if (st.spf[i] === i) primes.push(i);
    const pc = p => ['t1', 't2', 't3', 'ok'][primes.indexOf(p) % 4];
    const inChain = new Set(st.chain);
    let g = '<div class="scroll"><div class="spiral" style="grid-template-columns:repeat(10, 46px)">';
    for (let i = 1; i <= st.max; i++) {
      const s = st.spf[i];
      const cls = i === 1 ? 'dim' : st.marked.includes(i) ? 'cur ' + pc(st.cur) : i === st.cur ? 'cur' : st.k >= 0 && inChain.has(i) && i > 1 ? 'cur t2' : st.k >= 0 ? '' : pc(s);
      g += `<div class="cell ${cls}" style="width:46px;height:42px;display:flex;flex-direction:column;line-height:1.1"><span>${i}</span><span style="font-size:.6rem;opacity:.75">${i === 1 ? '' : s === i ? 'prime' : 'spf ' + s}</span></div>`;
    }
    g += '</div></div>';
    const fac = st.k >= 0 ? `<div class="row2">${block('dividing down', tokens(st.chain.map(String), i => i === st.chain.length - 1 ? 'new' : ''))}${block('prime powers', st.factors.length ? tokens(st.factors.map(([p, e]) => `${p}^${e} → ×${e + 1}`), () => 'ok') : '<span class="empty">none yet</span>')}${block('count', `<span class="big c-ok">${st.count}</span>`)}</div>` : '';
    return block(st.k >= 0 ? `spf[] table. Factoring A[${st.k}] = ${st.A[st.k]}; the numbers it passes through are highlighted` : 'spf[] table (cells are colored by their smallest prime factor)', g)
      + fac + `<div class="row2">${block('A', tokens(st.A.map(String), i => i === st.k ? 'new' : ''))}${block('res', tokens(st.res.map(String), () => 'ok'))}</div>`;
  }
});
