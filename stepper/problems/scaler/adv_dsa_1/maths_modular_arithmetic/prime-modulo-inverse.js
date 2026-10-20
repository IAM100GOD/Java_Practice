/* 18. Prime Modulo Inverse (Scaler) */
P.push({
  id: 'prime-modulo-inverse', title: 'Prime Modulo Inverse', level: 'medium', group: 'scaler-modarith', file: 'PrimeModuloInverse.java', dir: 'scaler/adv_dsa_1/maths_modular_arithmetic',
  statement: 'Given A and a prime B with gcd(A, B) = 1, find <code>A<sup>−1</sup> mod B</code>: the X with <code>(A × X) % B = 1</code>. Constraints: 1 ≤ A, B ≤ 10⁹.',
  technique: "Fermat's little theorem + fast power", time: 'O(log B)', space: 'O(1)',
  inputs: [{ key: 'a', label: 'A', def: '6', narrow: true }, { key: 'b', label: 'B (prime)', def: '23', narrow: true }],
  samples: [['3', '5'], ['6', '23'], ['10', '17'], ['1000000000', '999999937']],
  code: "public int solve(int A, int B) {\n    return (int) power(A % B, B - 2, B);   // A can be larger than B, reduce it first @fermat\n}\n\nprivate long power(long base, long exp, long mod) {\n    long result = 1 % mod;\n    base %= mod; @init\n    while (exp > 0) { @loop\n        if ((exp & 1) == 1) result = result * base % mod; @mul\n        base = base * base % mod;          // < 10^18, fits in long\n        exp >>= 1; @sq\n    }\n    return result; @ret\n}",
  steps: [
    '<strong>What an inverse is.</strong> Dividing by A in mod-B arithmetic means multiplying by the X where <code>A × X ≡ 1 (mod B)</code>. That X is A⁻¹.',
    "<strong>Fermat's little theorem.</strong> If B is prime and B does not divide A, then <code>A<sup>B−1</sup> ≡ 1 (mod B)</code>.",
    'Split one A off: <code>A × A<sup>B−2</sup> ≡ 1 (mod B)</code>. That matches the definition above, so <code>A<sup>B−2</sup> mod B</code> is the inverse.',
    'Compute <code>A<sup>B−2</sup> mod B</code> with the binary exponentiation from the Power Function problem: square the base, and multiply it in when the current bit of the exponent is 1.',
    'Reduce A with <code>A % B</code> first, because A can be larger than B. Use <code>long</code> so products below 10¹⁸ do not overflow.'
  ],
  cmp: [['Try X = 1, 2, … until A·X % B == 1', 'O(B), up to 10⁹', 'O(1)'], ['Extended Euclid (works for any coprime B)', 'O(log B)', 'O(1) iterative'], ["Fermat: A^(B−2) mod B, fast power", 'O(log B)', 'O(1)']],
  eff: "Searching for X means checking up to 10⁹ candidates. Fermat's theorem turns the search into a single power calculation, and fast exponentiation does that in about 30 loop steps. It only works because B is prime. For a composite modulus, use the extended Euclidean algorithm instead.",
  isPrime(n) { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; },
  run({ a, b }) {
    if (![a, b].every(x => /^\d+$/.test(x.trim()))) throw new Error('A and B must be positive whole numbers.');
    const An = parseInt(a, 10), Bn = parseInt(b, 10);
    if (An < 1 || An > 1e9 || Bn < 1 || Bn > 1e9) throw new Error('A and B must be between 1 and 10⁹.');
    if (!this.isPrime(Bn)) throw new Error(`${Bn} is not prime. Fermat's theorem needs a prime B.`);
    if (An % Bn === 0) throw new Error(`${Bn} divides ${An}, so gcd(A, B) ≠ 1 and there is no inverse.`);
    const A = BigInt(An), B = BigInt(Bn), E = Bn - 2; const F = [];
    let base = A % B, result = 1n % B, ee = E, k = 0; const bits = E.toString(2); const ladder = [];
    const st = mode => ({ bits, k, mode, ladder: clone(ladder), result: String(result), base: String(base), B0: E });
    const V = () => ({ base: String(base), result: String(result), exp: ee, 'exp (binary)': ee.toString(2) || '0' });
    F.push({ line: 'fermat', msg: `B = ${Bn} is prime, so by Fermat ${An}^${Bn - 1} ≡ 1 (mod ${Bn}). Therefore ${An} × ${An}^${E} ≡ 1, and the answer is ${An}^${E} mod ${Bn}. ${An > Bn ? `First reduce A: ${An} % ${Bn} = ${base}.` : ''}`, vars: { A: An, B: Bn, 'exp = B − 2': E }, st: st() });
    F.push({ line: 'init', msg: `Fast power with base = ${base}, exp = ${E} (${bits} in binary), result = ${result}.`, vars: V(), st: st() });
    while (ee > 0) {
      const set = ee & 1; const before = result;
      if (set) result = (result * base) % B;
      ladder.push({ k, base: String(base), used: !!set });
      F.push({ line: set ? 'mul' : 'loop', msg: set ? `Bit ${k} of exp is 1: result = ${before} × ${base} % ${Bn} = ${result}.` : `Bit ${k} of exp is 0, so result stays ${result}.`, vars: V(), st: st(set ? 'mul' : 'skip') });
      const ob = base; base = (base * base) % B; ee = Math.floor(ee / 2); k++;
      F.push({ line: 'sq', msg: `Square base: ${ob}² % ${Bn} = ${base}. Shift exp right to ${ee}.`, vars: V(), st: st('sq') });
    }
    const check = (A % B) * result % B;
    F.push({ line: 'ret', msg: `Check: (${An} × ${result}) % ${Bn} = ${check}. ${check === 1n ? 'It equals 1, so this is the inverse.' : ''}`, vars: { X: String(result), 'A·X % B': String(check) }, st: st(), result: String(result), bad: check !== 1n });
    return F;
  },
  render(st) { return P.find(p => p.id === 'power-function').render(st).replace('B in binary (each 1 bit adds its power of 2 to the exponent)', 'exp = B − 2 in binary (each 1 bit adds its power of 2 to the exponent)'); }
});
