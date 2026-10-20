/* 33. Prime Addition (Scaler) */
P.push({
  id: 'prime-addition', title: 'Prime Addition', level: 'easy', group: 'scaler-primes', file: 'PrimeAddition.java', dir: 'scaler/adv_dsa_1/maths_prime_numbers',
  statement: 'N is even. Return the minimum number of primes (repeats allowed) that add up to N. Constraint: 2 ≤ N ≤ 10⁹.',
  technique: "Goldbach's conjecture", time: 'O(1)', space: 'O(1)',
  inputs: [{ key: 'a', label: 'N', def: '26', narrow: true }],
  samples: [['26'], ['2'], ['4'], ['98'], ['1000000000']],
  code: "public int solve(int A) {\n    if (A == 2) return 1;    // 2 is itself prime @one\n    return 2;                // Goldbach: every even number > 2 is a sum of two primes @two\n}",
  steps: [
    '<strong>Can 1 prime work?</strong> Only if N itself is prime. The only even prime is 2, so N = 2 gives 1.',
    '<strong>N &gt; 2 even:</strong> N is divisible by 2, so it is not prime and 1 is impossible.',
    "<strong>2 always works.</strong> Goldbach's conjecture says every even number &gt; 2 is a sum of two primes. It has not been proven, but computers have verified it up to 4 × 10¹⁸, far beyond 10⁹. The Java file also checks it for every even N up to 10⁷.",
    'So the answer is 1 when N = 2, and 2 otherwise. You never need to find the actual primes.',
    "(For comparison: an odd N would need 1 if prime, 2 if N − 2 is prime, otherwise 3, by the weak Goldbach conjecture, which is proven. This problem only gives even N.)"
  ],
  cmp: [['DP over sums using all primes ≤ N', 'O(N · π(N)), impossible for 10⁹', 'O(N)'], ['Recognise Goldbach', 'O(1)', 'O(1)']],
  eff: 'A "minimum number of primes" problem looks like coin change or DP, but with N up to 10⁹ that is far too slow. The mathematical shortcut, that one prime only works for 2 and two always work, gives the answer immediately. The visualization finds an actual pair anyway, to show that one exists.',
  run({ a }) {
    const N = parseInt(a, 10);
    if (!/^\d+$/.test(a.trim()) || N < 2 || N % 2 || N > 1e9) throw new Error('N must be even, between 2 and 10⁹.');
    const ip = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
    const F = []; const tries = [];
    const st = (pair = null, mode = 'check') => ({ N, tries: clone(tries), pair, mode });
    if (N === 2) { F.push({ line: 'one', msg: 'N = 2 is itself prime, so one prime is enough.', vars: { N }, st: st([2], 'one'), result: '1' }); return F; }
    F.push({ line: 'one', msg: `${N} is even and greater than 2, so it is divisible by 2 and is not prime. One prime cannot add up to it.`, vars: { N, 'N == 2': false }, st: st() });
    let x = 2;
    while (!(ip(x) && ip(N - x))) { tries.push([x, N - x, ip(x), ip(N - x)]); x++; if (tries.length > 40) break; }
    tries.push([x, N - x, true, true]);
    F.push({ line: 'two', msg: `By Goldbach, two primes always work. One such pair: ${x} + ${N - x} = ${N}, found after trying a = 2..${x}. The code returns 2 without searching.`, vars: { N, a: x, 'N − a': N - x }, st: st([x, N - x], 'two'), result: '2' });
    return F;
  },
  render(st) {
    const list = st.tries.slice(-8).map(([p, q, okp, okq]) => `${p}${okp ? '' : '✗'} + ${q}${okq ? '' : '✗'}`);
    const pair = st.pair ? `<div class="chips" style="align-items:center;font-size:1.1rem">${st.pair.map(p => `<span class="tok ok" style="font-size:1rem">${p}</span>`).join(' + ')} = <span class="tok">${st.N}</span></div>` : '';
    return `<div class="row2">${block('N', `<span class="big">${st.N}</span>`)}${block('is N prime?', `<span class="big ${st.N === 2 ? 'c-ok' : 'c-bad'}">${st.N === 2 ? 'yes' : 'no (even)'}</span>`)}${block('minimum primes', `<span class="big c-ok">${st.mode === 'one' ? 1 : st.mode === 'two' ? 2 : '…'}</span>`)}</div>`
      + (st.pair ? block(st.mode === 'one' ? 'one prime' : 'a Goldbach pair', pair) : '')
      + (st.tries.length > 1 ? block('pairs tried (✗ = not prime), last few', tokens(list, i => i === list.length - 1 ? 'ok' : '')) : '');
  }
});
