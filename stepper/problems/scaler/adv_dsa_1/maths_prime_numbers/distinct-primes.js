/* 34. Distinct Primes (Scaler) */
P.push({
  id: 'distinct-primes', title: 'Distinct Primes', level: 'medium', group: 'scaler-primes', file: 'DistinctPrimes.java', dir: 'scaler/adv_dsa_1/maths_prime_numbers',
  statement: 'G is the product of every element of A. Return how many distinct primes divide G. Constraints: N ≤ 10⁵, A[i] ≤ 10⁵.',
  technique: 'Union of each element\'s primes, using an SPF sieve', time: 'O(M log log M + N log M)', space: 'O(M)',
  inputs: [{ key: 'a', label: 'A', def: '12, 35, 18, 49, 22' }],
  samples: [['1, 2, 3, 4'], ['1, 1, 1'], ['30, 49, 11'], ['12, 35, 18, 49, 22']],
  code: "public int solve(int[] A) {\n    int max = 1;\n    for (int x : A) max = Math.max(max, x);\n\n    int[] spf = new int[max + 1];\n    for (int i = 0; i <= max; i++) spf[i] = i;\n    for (int i = 2; (long) i * i <= max; i++) {\n        if (spf[i] == i) {\n            for (int j = i * i; j <= max; j += i)\n                if (spf[j] == j) spf[j] = i; @mark\n        }\n    }\n\n    boolean[] seen = new boolean[max + 1];\n    int count = 0;\n    for (int x : A) { @elem\n        while (x > 1) {\n            int p = spf[x];\n            if (!seen[p]) { seen[p] = true; count++; } @newp\n            while (x % p == 0) x /= p; @div\n        }\n    }\n    return count; @ret\n}",
  steps: [
    '<strong>Don\'t compute G.</strong> 10⁵ numbers up to 10⁵ multiply to something with about 500,000 digits.',
    '<strong>A prime divides a product exactly when it divides at least one of the factors.</strong> So the primes of G are the union of the primes of every A[i].',
    'Build a smallest-prime-factor table up to max(A) once. Factor each A[i] by repeatedly taking <code>p = spf[x]</code> and dividing out every copy of p.',
    'Keep a <code>seen[]</code> array. The first time a prime turns up, mark it and add 1 to <code>count</code>. Later occurrences change nothing.',
    '1s contribute no primes. If every element is 1, G = 1 and the answer is 0.'
  ],
  cmp: [['Multiply into a BigInteger G, then factor G', 'hopeless: ~500,000-digit G', 'huge'], ['Trial-divide each A[i] up to √A[i]', 'O(N √M) ≈ 3 × 10⁷', 'O(primes)'], ['SPF sieve, then factor each in O(log)', 'O(M log log M + N log M)', 'O(M)']],
  eff: 'The key fact is that a prime divides a product exactly when it divides one of the factors, so G never has to be formed. After that it is the factoring pattern from Count of Divisors: sieve once, then factor each number in about log₂(10⁵) ≈ 17 divisions. Trial division up to √A[i] would also pass here, but the sieve is faster.',
  run({ a }) {
    const A = a.split(/[,\s]+/).filter(Boolean).map(Number);
    if (!A.length || A.some(x => !Number.isInteger(x) || x < 1 || x > 1e5)) throw new Error('A must be whole numbers from 1 to 10⁵.');
    if (A.length > 10) throw new Error('Use 10 numbers or fewer so the picture fits.');
    const max = Math.max(...A, 1); const spf = [...Array(max + 1).keys()];
    for (let i = 2; i * i <= max; i++) if (spf[i] === i) for (let j = i * i; j <= max; j += i) if (spf[j] === j) spf[j] = i;
    const F = []; const seen = []; let k = -1, x = null, chain = [], newP = null;
    const st = () => ({ A, k, x, chain: [...chain], seen: [...seen], newP });
    F.push({ line: 'mark', msg: `Build spf[] up to max(A) = ${max}, so each number can be factored by repeatedly dividing by its smallest prime.`, vars: { max }, st: st() });
    for (k = 0; k < A.length; k++) {
      x = A[k]; chain = [x]; newP = null;
      if (x === 1) { F.push({ line: 'elem', msg: '1 has no prime factors. Skip it.', vars: { x: 1 }, st: st() }); continue; }
      while (x > 1) {
        const p = spf[x]; const isNew = !seen.includes(p);
        if (isNew) seen.push(p); newP = p;
        F.push({ line: 'newp', msg: `spf[${x}] = ${p}. ${isNew ? `${p} has not been seen before, so count = ${seen.length}.` : `${p} has already been counted.`}`, vars: { x, p, count: seen.length }, st: { ...st(), isNew } });
        const from = x; while (x % p === 0) x /= p; chain.push(x);
        F.push({ line: 'div', msg: `Divide out every ${p}: ${from} → ${x}.${x === 1 ? ` ${A[k]} is fully factored.` : ''}`, vars: { x, p, count: seen.length }, st: { ...st(), isNew: false } });
      }
    }
    k = -1; x = null; chain = []; newP = null;
    F.push({ line: 'ret', msg: `G's distinct primes are the union of every element's primes: {${[...seen].sort((p, q) => p - q).join(', ')}}.`, vars: { count: seen.length }, st: st(), result: String(seen.length) });
    return F;
  },
  render(st) {
    const grid = cells(st.A.map(String), { wide: true, cls: j => j === st.k ? 'cur t2' : j < st.k || st.k === -1 && st.seen.length ? '' : '', top: j => j === st.k ? [['x', 'c-p2']] : [] });
    const sorted = [...st.seen].sort((p, q) => p - q);
    return block('A', grid)
      + `<div class="row2">${block('dividing down', st.chain.length ? tokens(st.chain.map(String), i => i === st.chain.length - 1 ? 'new' : '') : '<span class="empty">—</span>')}${block('count', `<span class="big c-ok">${st.seen.length}</span>`)}</div>`
      + block('distinct primes of G (seen[])', sorted.length ? tokens(sorted.map(String), i => sorted[i] === st.newP && st.isNew ? 'new' : 'ok') : '<span class="empty">none yet</span>');
  }
});
