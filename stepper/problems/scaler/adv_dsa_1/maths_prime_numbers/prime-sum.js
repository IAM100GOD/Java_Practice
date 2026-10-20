/* 29. Prime Sum (Scaler) */
P.push({
  id: 'prime-sum', title: 'Prime Sum', level: 'easy', group: 'scaler-primes', file: 'PrimeSum.java', dir: 'scaler/adv_dsa_1/maths_prime_numbers',
  statement: 'Given an even A &gt; 2, return two primes [a, b] with a + b = A. If there are several, return the one with the smallest a. Constraint: A ≤ 2 × 10⁷.',
  technique: 'Sieve of Eratosthenes + scan from the smallest a', time: 'O(A log log A)', space: 'O(A)',
  inputs: [{ key: 'a', label: 'A', def: '98', narrow: true }],
  samples: [['4'], ['10'], ['28'], ['98'], ['100']],
  code: "public int[] primesum(int A) {\n    boolean[] composite = new boolean[A + 1];\n    for (int i = 2; (long) i * i <= A; i++) {\n        if (!composite[i]) { @prime\n            for (int j = i * i; j <= A; j += i) composite[j] = true; @sieve\n        }\n    }\n    for (int a = 2; a <= A / 2; a++) {\n        if (!composite[a] && !composite[A - a]) return new int[]{a, A - a}; @scan\n    }\n    return new int[0];    // never reached for even A > 2 (Goldbach)\n}",
  steps: [
    '<strong>Sieve of Eratosthenes:</strong> start by assuming every number is prime. For each i that is still prime, mark its multiples i², i² + i, … as composite. Starting at i² works because smaller multiples were already marked by smaller primes. Stop when i² &gt; A.',
    'Now checking whether a number is prime is a single array lookup.',
    '<strong>Smallest pair first:</strong> [a, b] is smaller when a is smaller, so try a = 2, 3, 4, … in order. The first a where both <code>a</code> and <code>A − a</code> are prime is the answer.',
    'Only go up to a ≤ A/2, which keeps a ≤ b. Goldbach\'s conjecture, checked far beyond 2 × 10⁷, guarantees that a pair exists.',
    'In practice the scan stops almost immediately. For every A up to 2 × 10⁷, the smallest a is tiny (A = 2 × 10⁷ gives a = 19).'
  ],
  cmp: [['Trial-divide each candidate a and A − a', 'O(k · √A) for k tries', 'O(1)'], ['Sieve once, then O(1) checks', 'O(A log log A)', 'O(A), 20 MB at the limit']],
  eff: "The sieve does about A log log A ≈ 6 × 10⁷ simple steps at the limit, then every primality check is one array lookup. Because the first valid a is always small, trial division also works here with almost no memory. That makes it a reasonable alternative if 20 MB is too much.",
  run({ a }) {
    const A = parseInt(a, 10);
    if (!/^\d+$/.test(a.trim()) || A < 4 || A % 2) throw new Error('A must be an even number, 4 or more.');
    if (A > 120) throw new Error('The picture only fits A up to 120. The Java code handles up to 2 × 10⁷.');
    const comp = Array(A + 1).fill(false); const F = []; let cur = null, marked = [], pa = null, found = false;
    const st = () => ({ A, comp: [...comp], cur, marked: [...marked], pa, found });
    F.push({ line: 'prime', msg: `Assume 2..${A} are all prime and cross off the composites.`, vars: { A }, st: st() });
    for (let i = 2; i * i <= A; i++) {
      if (comp[i]) continue;
      cur = i; marked = [];
      for (let j = i * i; j <= A; j += i) { if (!comp[j]) marked.push(j); comp[j] = true; }
      F.push({ line: 'sieve', msg: `${i} is prime. Cross off ${i}², ${i}² + ${i}, …: ${marked.length ? marked.join(', ') : 'nothing new'}.`, vars: { i, 'newly crossed': marked.length }, st: st() });
    }
    cur = null; marked = [];
    F.push({ line: 'prime', msg: `The next i has i² > ${A}, so the sieve is done. Every number not crossed off is prime.`, vars: { A }, st: st() });
    for (let x = 2; x <= A / 2; x++) {
      pa = x; const ok = !comp[x] && !comp[A - x];
      if (ok) { found = true; F.push({ line: 'scan', msg: `${x} and ${A - x} are both prime. This is the first a that works, so it is the smallest pair.`, vars: { a: x, 'A − a': A - x }, st: st(), result: `[${x}, ${A - x}]` }); return F; }
      F.push({ line: 'scan', msg: `a = ${x}: ${comp[x] ? `${x} is not prime` : `${x} is prime, but ${A - x} is not`}. Try the next a.`, vars: { a: x, 'A − a': A - x }, st: st() });
    }
    return F;
  },
  render(st) {
    let g = '<div class="scroll"><div class="spiral" style="grid-template-columns:repeat(10, 34px)">';
    for (let x = 1; x <= st.A; x++) {
      const isPair = st.pa != null && (x === st.pa || x === st.A - st.pa);
      const cls = x === 1 ? 'dim' : isPair ? (st.found ? 'cur ok' : st.comp[x] ? 'cur bad' : 'cur t2') : st.marked.includes(x) ? 'bad' : x === st.cur ? 'cur t1' : st.comp[x] ? 'dim' : st.cur === null && st.pa === null ? 't1' : '';
      g += `<div class="cell ${cls}" style="width:34px;height:30px;font-size:.75rem;${st.comp[x] && !isPair ? 'text-decoration:line-through' : ''}">${x}</div>`;
    }
    g += '</div></div>';
    const pair = st.pa != null ? `<div class="row2">${block('a', `<span class="big ${st.comp[st.pa] ? 'c-bad' : 'c-ok'}">${st.pa}</span>`)}${block('A − a', `<span class="big ${st.comp[st.A - st.pa] ? 'c-bad' : 'c-ok'}">${st.A - st.pa}</span>`)}</div>` : '';
    return block(`1 … ${st.A} (crossed out = composite; red = crossed off this step)`, g) + pair;
  }
});
