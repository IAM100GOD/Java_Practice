/* 31. Prime Subsequences (Scaler) */
P.push({
  id: 'prime-subsequences', title: 'Prime Subsequences', level: 'easy', group: 'scaler-primes', file: 'PrimeSubsequences.java', dir: 'scaler/adv_dsa_1/maths_prime_numbers',
  statement: 'Count the non-empty subsequences of A that contain only prime numbers, modulo 10⁹+7. Constraints: N ≤ 10³, A[i] ≤ 10⁶.',
  technique: 'Sieve, count primes k, answer 2ᵏ − 1', time: 'O(M log log M + N)', space: 'O(M), M = max(A)',
  inputs: [{ key: 'a', label: 'A', def: '1, 2, 3, 4, 5, 9' }],
  samples: [['1, 2, 3'], ['2, 2'], ['1, 4, 6'], ['1, 2, 3, 4, 5, 9'], ['7, 11, 13, 1, 17']],
  code: "public int solve(int[] A) {\n    final long MOD = 1_000_000_007L;\n    int max = 2;\n    for (int x : A) max = Math.max(max, x);\n\n    boolean[] composite = new boolean[max + 1];\n    composite[0] = composite[1] = true;                  // 0 and 1 are not prime\n    for (int i = 2; (long) i * i <= max; i++) {\n        if (!composite[i]) {\n            for (int j = i * i; j <= max; j += i) composite[j] = true; @sieve\n        }\n    }\n\n    int k = 0;\n    for (int x : A) if (!composite[x]) k++; @check\n\n    long ways = 1;\n    for (int i = 0; i < k; i++) ways = ways * 2 % MOD;   // 2^k: each prime is in or out @dbl\n    return (int) ((ways - 1 + MOD) % MOD);               // minus the empty subsequence @ret\n}",
  steps: [
    'A subsequence picks, for each position, "take" or "skip". A prime subsequence takes only prime elements, so it is just a choice among the <strong>prime positions</strong>.',
    'Sieve up to max(A) so each primality check is one lookup. Mark 0 and 1 as not prime by hand, because the sieve loop never touches them.',
    'Count the primes, k. Each of them is independently in or out, which gives <code>2ᵏ</code> choices. Subtract 1 for the empty subsequence.',
    'Repeated values count separately, because subsequences are chosen by position. [2, 2] has 3: the first 2, the second 2, and both.',
    'Build 2ᵏ by doubling with <code>% MOD</code> each time, since k can be 1000. Fast power also works. 2ᵏ mod p is never 0, so subtracting 1 never goes negative, but <code>+ MOD</code> is a cheap safeguard.'
  ],
  cmp: [['Enumerate all 2ᴺ subsequences, check each', 'O(2ᴺ · N)', 'O(N)'], ['Count primes k, return 2ᵏ − 1', 'O(M log log M + N)', 'O(M)']],
  eff: 'With N = 1000 there are 2¹⁰⁰⁰ subsequences, so listing them is impossible. Seeing that a valid subsequence is any non-empty subset of the prime positions turns the problem into counting primes and one power of 2. The sieve to 10⁶ is about 3 million steps. Trial division up to √A[i] for each element would also be fast enough here.',
  run({ a }) {
    const A = a.split(/[,\s]+/).filter(Boolean).map(Number);
    if (!A.length || A.some(x => !Number.isInteger(x) || x < 1 || x > 1e6)) throw new Error('A must be whole numbers from 1 to 10⁶.');
    if (A.length > 12) throw new Error('Use 12 numbers or fewer so the picture fits.');
    const isP = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
    const prime = A.map(isP); const F = []; let i = -1, k = 0, ways = 1, phase = 'check'; const pos = [];
    const st = () => ({ A, prime, i, k, ways, phase, pos: [...pos] });
    F.push({ line: 'sieve', msg: `Sieve up to max(A) = ${Math.max(...A)}. After that, checking whether a number is prime is one lookup. 0 and 1 are not prime.`, vars: { max: Math.max(...A) }, st: st() });
    for (i = 0; i < A.length; i++) {
      if (prime[i]) { k++; pos.push(i); }
      F.push({ line: 'check', msg: prime[i] ? `${A[i]} is prime, so it can be in a prime subsequence. k = ${k}.` : `${A[i]} is not prime. Any subsequence that takes it is ruled out, so leave it out.`, vars: { i, x: A[i], k }, st: st() });
    }
    i = -1; phase = 'pow';
    for (let j = 0; j < k; j++) { ways = ways * 2 % 1000000007;
      F.push({ line: 'dbl', msg: `Prime #${j + 1} (${A[pos[j]]}) can be in or out, which doubles the choices: ways = ${ways}.`, vars: { k, [`ways (2^${j + 1})`]: ways }, st: { ...st(), upto: j } }); }
    phase = 'done';
    const ans = (ways - 1 + 1000000007) % 1000000007;
    F.push({ line: 'ret', msg: k ? `2^${k} − 1 = ${ans}. Subtract 1 for the empty subsequence.` : 'No element is prime, so the only all-prime subsequence is the empty one, which does not count. Answer: 0.', vars: { k, answer: ans }, st: st(), result: String(ans) });
    return F;
  },
  render(st) {
    const grid = cells(st.A.map(String), { wide: true,
      cls: j => j > st.i && st.phase === 'check' ? '' : st.prime[j] ? (j === st.i ? 'cur ok' : 'ok') : (j === st.i ? 'cur bad' : 'bad'),
      top: j => j === st.i ? [['i', 'c-acc']] : [],
      bot: j => (j <= st.i || st.phase !== 'check') ? [[st.prime[j] ? 'prime' : 'no', st.prime[j] ? 'c-ok' : 'c-bad']] : [] });
    let subs = '';
    const k = st.pos.length;
    if (st.phase !== 'check' && k > 0 && k <= 4) {
      const list = [];
      for (let m = 1; m < (1 << k); m++) list.push('[' + st.pos.filter((_, b) => m >> b & 1).map(p => st.A[p]).join(', ') + ']');
      subs = block(`all ${list.length} prime subsequences (each prime in or out, not all out)`, tokens(list, () => 'ok'));
    } else if (st.phase !== 'check' && k > 4) subs = block('prime subsequences', `<span class="empty">2^${k} − 1 of them, too many to list</span>`);
    return block('A (green = prime, red = not prime)', grid)
      + `<div class="row2">${block('k (primes)', `<span class="big c-ok">${st.k}</span>`)}${block('ways = 2^k mod p', `<span class="big">${st.phase === 'check' ? '…' : st.ways}</span>`)}</div>` + subs;
  }
});
