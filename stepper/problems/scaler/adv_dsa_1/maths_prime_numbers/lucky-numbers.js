/* 30. Lucky Numbers (Scaler) */
P.push({
  id: 'lucky-numbers', title: 'Lucky Numbers', level: 'easy', group: 'scaler-primes', file: 'LuckyNumbers.java', dir: 'scaler/adv_dsa_1/maths_prime_numbers',
  statement: 'A lucky number has exactly 2 <em>distinct</em> prime divisors. Count the lucky numbers from 1 to A. Constraint: A ≤ 50,000.',
  technique: 'Sieve that counts distinct prime factors', time: 'O(A log log A)', space: 'O(A)',
  inputs: [{ key: 'a', label: 'A', def: '30', narrow: true }],
  samples: [['8'], ['12'], ['30'], ['60']],
  code: "public int solve(int A) {\n    int[] cnt = new int[A + 1];\n    for (int i = 2; i <= A; i++) {\n        if (cnt[i] == 0) {                                   // no smaller prime divides i -> i is prime @prime\n            for (int j = i; j <= A; j += i) cnt[j]++; @mark\n        }\n    }\n    int lucky = 0;\n    for (int x = 1; x <= A; x++) {\n        if (cnt[x] == 2) lucky++; @count\n    }\n    return lucky; @ret\n}",
  steps: [
    '<strong>Distinct means each prime counts once.</strong> 12 = 2² × 3 has the distinct primes {2, 3}, so it is lucky. 8 = 2³ has only {2}, and 30 = 2 × 3 × 5 has three.',
    'Keep <code>cnt[x]</code> = number of distinct primes found that divide x. Go through i = 2..A in order.',
    'If <code>cnt[i]</code> is still 0 when you reach i, no smaller prime divides it, so i is prime. Add 1 to cnt of every multiple of i: i, 2i, 3i, …',
    'Each prime adds exactly 1 to each of its multiples, however many times it divides them, so cnt[x] ends up as the number of <em>distinct</em> prime factors of x.',
    'Finally count the x with <code>cnt[x] == 2</code>.'
  ],
  cmp: [['Factor every x ≤ A by trial division', 'O(A √A) ≈ 10⁷', 'O(1)'], ['Sieve with a distinct-prime counter', 'O(A log log A)', 'O(A)']],
  eff: 'Each prime p visits A/p multiples, and the sum of A/p over primes p ≤ A is about A log log A, which is close to linear. This is the Sieve of Eratosthenes, but instead of only marking numbers as composite, it counts how many primes reach each one. The same idea computes many per-number facts at once: number of prime factors, smallest prime factor, and so on.',
  run({ a }) {
    const A = parseInt(a, 10);
    if (!/^\d+$/.test(a.trim()) || A < 1) throw new Error('A must be a positive whole number.');
    if (A > 100) throw new Error('The picture only fits A up to 100. The Java code handles up to 50,000.');
    const cnt = Array(A + 1).fill(0); const F = []; let cur = null, hit = [], x = null, lucky = 0; const primes = [];
    const st = (phase) => ({ A, cnt: [...cnt], cur, hit: [...hit], x, lucky, phase, primes: [...primes] });
    F.push({ line: 'prime', msg: 'All counts start at 0. Go through i = 2, 3, … and add 1 to every multiple of each prime found.', vars: { A }, st: st('sieve') });
    for (let i = 2; i <= A; i++) {
      if (cnt[i] !== 0) continue;
      cur = i; hit = []; primes.push(i);
      for (let j = i; j <= A; j += i) { cnt[j]++; hit.push(j); }
      F.push({ line: 'mark', msg: `cnt[${i}] is 0, so ${i} is prime. Add 1 to its multiples: ${hit.length > 12 ? hit.slice(0, 12).join(', ') + ', …' : hit.join(', ')}.`, vars: { i, multiples: hit.length }, st: st('sieve') });
    }
    cur = null; hit = [];
    for (x = 1; x <= A; x++) if (cnt[x] === 2) { lucky++; F.push({ line: 'count', msg: `cnt[${x}] = 2, so ${x} is lucky. lucky = ${lucky}.`, vars: { x, [`cnt[${x}]`]: 2, lucky }, st: st('count') }); }
    x = null;
    F.push({ line: 'ret', msg: `${lucky} number${lucky === 1 ? '' : 's'} from 1 to ${A} ${lucky === 1 ? 'has' : 'have'} exactly 2 distinct prime divisors.`, vars: { lucky }, st: st('done'), result: String(lucky) });
    return F;
  },
  render(st) {
    let g = '<div class="scroll"><div class="spiral" style="grid-template-columns:repeat(10, 40px)">';
    for (let v = 1; v <= st.A; v++) {
      const c = st.cnt[v]; const isHit = st.hit.includes(v);
      const cls = v === st.x ? 'cur ok' : isHit ? (v === st.cur ? 'cur t2' : 't2') : st.phase !== 'sieve' && c === 2 && (st.x === null || v < st.x) ? 'ok' : c === 1 ? 't1' : c === 2 ? 't3' : c >= 3 ? 'dim' : '';
      g += `<div class="cell ${cls}" style="width:40px;height:36px;display:flex;flex-direction:column;line-height:1.1;font-size:.78rem"><span>${v}</span><span style="font-size:.6rem;opacity:.8">${v === 1 ? '' : c}</span></div>`;
    }
    g += '</div></div>';
    return block('1 … A, small number = cnt (distinct primes found so far). Amber = this prime\'s multiples; green = exactly 2', g)
      + `<div class="row2">${block('primes so far', tokens(st.primes.map(String), i => i === st.primes.length - 1 && st.phase === 'sieve' ? 'new' : ''))}${block('lucky', `<span class="big c-ok">${st.lucky}</span>`)}</div>`;
  }
});
