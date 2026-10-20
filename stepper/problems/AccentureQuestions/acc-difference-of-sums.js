/* A1. Difference of Sums (Accenture) */
P.push({
  id: 'acc-difference-of-sums', title: 'Difference of Sums', level: 'easy', group: 'accenture', file: 'DifferenceOfSums.java', dir: 'AccentureQuestions',
  statement: 'Implement <code>differenceofSum(n, m)</code>. Over the integers 1..m, add up those NOT divisible by n and those that ARE divisible by n. Return (sum not divisible − sum divisible). Example: n = 4, m = 20 → 150 − 60 = 90.',
  technique: 'Arithmetic series formulas', time: 'O(1)', space: 'O(1)',
  inputs: [{ key: 'n', label: 'n', def: '4', narrow: true }, { key: 'm', label: 'm', def: '20', narrow: true }],
  samples: [['4', '20'], ['3', '10'], ['1', '5'], ['7', '6']],
  code: "public static int differenceofSum(int n, int m) {\n    int totalSum = m * (m + 1) / 2; @total\n    int k = m / n;                              // how many multiples of n @k\n    int sumDivisible = n * (k * (k + 1) / 2); @div\n    int sumNotDivisible = totalSum - sumDivisible; @notdiv\n    return sumNotDivisible - sumDivisible; @ret\n}",
  steps: [
    'The brute-force way loops i = 1..m and adds i to one of two buckets. That works, but there is a formula for both buckets.',
    '<code>1 + 2 + … + m = m(m+1)/2</code> gives the total.',
    'The multiples of n up to m are n, 2n, …, kn where <code>k = m / n</code> (integer division). Their sum is <code>n × k(k+1)/2</code>.',
    'Everything else is not divisible: <code>total − sumDivisible</code>. Then subtract.'
  ],
  cmp: [['Loop 1..m with i % n check', 'O(m)', 'O(1)'], ['Arithmetic series formulas', 'O(1)', 'O(1)']],
  eff: 'The loop is fine for small m, but the formula answers instantly for any m. Watch for int overflow once m exceeds about 46,000 (m² > 2³¹); use long in that case.',
  run({ n, m }) {
    const N = parseInt(n, 10), M = parseInt(m, 10);
    if (!(N >= 1) || !(M >= 1)) throw new Error('n and m must be positive integers.');
    if (M > 40) throw new Error('Use m ≤ 40 so the picture fits.');
    const F = []; const nums = Array.from({ length: M }, (_, i) => i + 1);
    const totalSum = M * (M + 1) / 2, k = Math.floor(M / N), sd = N * (k * (k + 1) / 2), snd = totalSum - sd;
    const st = (phase) => ({ nums, N, phase });
    F.push({ line: 'total', msg: `Sum of 1..${M} = ${M}×${M + 1}/2 = ${totalSum}.`, vars: { n: N, m: M, totalSum }, st: st('total') });
    F.push({ line: 'k', msg: `k = ${M} / ${N} = ${k}: there are ${k} multiples of ${N} up to ${M}.`, vars: { totalSum, k }, st: st('div') });
    F.push({ line: 'div', msg: `Multiples: ${nums.filter(x => x % N === 0).join(' + ') || 'none'} = ${N} × (${k}×${k + 1}/2) = ${sd}.`, vars: { totalSum, k, sumDivisible: sd }, st: st('div') });
    F.push({ line: 'notdiv', msg: `The rest: ${totalSum} − ${sd} = ${snd}.`, vars: { totalSum, sumDivisible: sd, sumNotDivisible: snd }, st: st('both') });
    F.push({ line: 'ret', msg: `Return ${snd} − ${sd} = ${snd - sd}.`, vars: { sumNotDivisible: snd, sumDivisible: sd, result: snd - sd }, st: st('both'), result: String(snd - sd) });
    return F;
  },
  render(st) {
    const cls = i => { const d = st.nums[i] % st.N === 0; return st.phase === 'total' ? 't1' : d ? 't2' : st.phase === 'both' ? 'ok' : 'dim'; };
    return block(`1..${st.nums.length} (orange = divisible by ${st.N}, green = not divisible)`, cells(st.nums, { idx: false, noTop: true, cls }));
  }
});
