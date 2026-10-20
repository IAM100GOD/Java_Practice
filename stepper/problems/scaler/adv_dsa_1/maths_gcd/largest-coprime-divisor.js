/* 26. Largest Coprime Divisor (Scaler) */
P.push({
  id: 'largest-coprime-divisor', title: 'Largest Coprime Divisor', level: 'medium', group: 'scaler-gcd', file: 'LargestCoprimeDivisor.java', dir: 'scaler/adv_dsa_1/maths_gcd',
  statement: 'Find the largest X such that X divides A (<code>A % X == 0</code>) and X shares no factor with B (<code>gcd(X, B) == 1</code>). Constraints: 1 ≤ A, B ≤ 10⁹.',
  technique: 'Divide out the gcd until it is 1', time: 'O(log² A)', space: 'O(1)',
  inputs: [{ key: 'a', label: 'A', def: '360', narrow: true }, { key: 'b', label: 'B', def: '12', narrow: true }],
  samples: [['30', '12'], ['5', '10'], ['360', '12'], ['1000', '2'], ['77', '30']],
  code: "public int cpFact(int A, int B) {\n    int X = A;\n    int g = gcd(X, B); @init\n    while (g != 1) {\n        X /= g;          // drop the factors X still shares with B @div\n        g = gcd(X, B); @regcd\n    }\n    return X; @ret\n}\n\nprivate int gcd(int a, int b) {\n    while (b != 0) {\n        int t = a % b;\n        a = b;\n        b = t;\n    }\n    return a;\n}",
  steps: [
    '<strong>Think in prime factors.</strong> X divides A, so it is made of A\'s primes. To be coprime with B, X must not use any prime that B also has. To be as large as possible, X keeps every other prime of A at its full power.',
    'So the answer is A with every prime it shares with B removed completely. For example, 360 = 2³ × 3² × 5 and B = 12 = 2² × 3, so remove all the 2s and 3s and keep 5.',
    'You don\'t need to factorize. <code>g = gcd(X, B)</code> is made of exactly the shared primes, so <code>X /= g</code> removes at least one copy of each.',
    'One division may not be enough. With A = 1000 = 2³ × 5³ and B = 2, gcd = 2 removes only one 2. Keep dividing while <code>gcd(X, B) != 1</code>.',
    'When the gcd reaches 1, X has no prime in common with B. Primes that B does not have were never divided out, so this X is the largest possible.'
  ],
  cmp: [['Test every divisor of A from the top', 'O(A) or O(√A) + gcds', 'O(1)'], ['Factorize A, drop primes dividing B', 'O(√A)', 'O(log A)'], ['Divide by gcd(X, B) until it is 1', 'O(log² A)', 'O(1)']],
  eff: 'Each division at least halves X, because g ≥ 2, so the loop runs at most about 30 times for A ≤ 10⁹. Each round is one gcd costing O(log A) steps. That is far cheaper than factorizing, which needs trial division up to √A ≈ 31,623.',
  gcd(a, b) { while (b) { [a, b] = [b, a % b]; } return a; },
  factor(n) { const f = []; for (let p = 2; p * p <= n; p++) { let e = 0; while (n % p === 0) { n /= p; e++; } if (e) f.push([p, e]); } if (n > 1) f.push([n, 1]); return f; },
  run({ a, b }) {
    if (![a, b].every(x => /^\d+$/.test(x.trim()))) throw new Error('A and B must be positive whole numbers.');
    const A = parseInt(a, 10), B = parseInt(b, 10);
    if (A < 1 || B < 1 || A > 1e9 || B > 1e9) throw new Error('A and B must be between 1 and 10⁹.');
    const fA = this.factor(A), fB = this.factor(B); const bPrimes = new Set(fB.map(x => x[0]));
    const F = []; let X = A, g = this.gcd(X, B); const hist = [A];
    const st = () => ({ A, B, X, g, fA, fB, bPrimes: [...bPrimes], fX: this.factor(X), hist: [...hist] });
    F.push({ line: 'init', msg: `X = ${A}. g = gcd(${X}, ${B}) = ${g}.${g === 1 ? ' A already shares no factor with B.' : ` ${g} contains the primes that X and B share.`}`, vars: { X, g }, st: st() });
    while (g !== 1) {
      const before = X; X = X / g; hist.push(X);
      F.push({ line: 'div', msg: `X = ${before} / ${g} = ${X}. This removes one round of the shared primes.`, vars: { X, g }, st: st() });
      g = this.gcd(X, B);
      F.push({ line: 'regcd', msg: `g = gcd(${X}, ${B}) = ${g}. ${g === 1 ? 'Nothing is shared any more, so stop.' : `Still shared (${g}). Some powers are left, so divide again.`}`, vars: { X, g }, st: st() });
    }
    F.push({ line: 'ret', msg: `X = ${X}. It divides ${A}, and gcd(${X}, ${B}) = 1. Every prime of A that B lacks is kept at full power.`, vars: { X }, st: st(), result: String(X) });
    return F;
  },
  render(st) {
    const pw = (p, e) => e > 1 ? `${p}<sup>${e}</sup>` : `${p}`;
    const left = new Map(st.fX.map(([p, e]) => [p, e]));
    const facA = st.fA.length ? st.fA.map(([p, e]) => { const sh = st.bPrimes.includes(p); const rem = left.get(p) || 0;
      return `<span class="tok ${sh ? (rem ? 'bad' : '') : 'ok'}" ${sh && !rem ? 'style="text-decoration:line-through;opacity:.5"' : ''}>${pw(p, e)}${sh ? (rem && rem < e ? ` <small>(${pw(p, rem)} left)</small>` : '') : ''}</span>`; }).join(' × ') : '<span class="tok">1</span>';
    const facB = st.fB.length ? st.fB.map(([p, e]) => `<span class="tok">${pw(p, e)}</span>`).join(' × ') : '<span class="tok">1</span>';
    return block(`A = ${st.A} in prime factors (red = shared with B, still in X; crossed out = removed; green = kept)`, `<div class="chips" style="align-items:center">${facA}</div>`)
      + block(`B = ${st.B}`, `<div class="chips" style="align-items:center">${facB}</div>`)
      + `<div class="row2">${block('X over time', tokens(st.hist.map(String), i => i === st.hist.length - 1 ? 'new' : ''))}${block('g = gcd(X, B)', `<span class="big ${st.g === 1 ? 'c-ok' : 'c-bad'}">${st.g}</span>`)}${block('X', `<span class="big c-ok">${st.X}</span>`)}</div>`;
  }
});
