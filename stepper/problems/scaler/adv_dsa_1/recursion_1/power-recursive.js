/* 41. Implement Power Function, recursive (Scaler) */
P.push({
  id: 'power-recursive', title: 'Power Function (Recursive)', level: 'medium', group: 'scaler-rec1', file: 'PowerFunctionRecursive.java', dir: 'scaler/adv_dsa_1/recursion_1',
  statement: 'Return <code>(A<sup>B</sup>) % C</code>, never negative, using recursion. Constraints: −10⁹ ≤ A ≤ 10⁹, 0 ≤ B ≤ 10⁹, 1 ≤ C ≤ 10⁹.',
  technique: 'Divide and conquer: a^b = (a^(b/2))² (× a if b is odd)', time: 'O(log B)', space: 'O(log B) stack',
  inputs: [{ key: 'a', label: 'A', def: '3', narrow: true }, { key: 'b', label: 'B', def: '13', narrow: true }, { key: 'c', label: 'C', def: '100', narrow: true }],
  samples: [['2', '3', '3'], ['3', '3', '1'], ['3', '13', '100'], ['-1', '1', '20'], ['2', '1000000000', '1000000000']],
  code: "public int pow(int A, int B, int C) {\n    long base = ((A % C) + C) % C;             // -1 % 20 = -1 in Java; make it 19 @norm\n    return (int) power(base, B, C);\n}\n\nprivate long power(long a, int b, int c) {\n    if (b == 0) return 1 % c;                  // a^0 = 1 (and 1 % 1 = 0) @base\n    long half = power(a, b / 2, c);            // ONE recursive call, reused below @half\n    long res = half * half % c;                // < 1e18, fits in long @sq\n    if (b % 2 == 1) res = res * a % c;         // odd b: one extra a @odd\n    return res; @ret\n}",
  steps: [
    '<strong>Split the exponent in half.</strong> <code>a<sup>b</sup> = (a<sup>b/2</sup>)²</code> when b is even, and <code>(a<sup>b/2</sup>)² × a</code> when b is odd, because b/2 rounds down and one a is left over.',
    '<strong>Base case:</strong> <code>a⁰ = 1</code>. Return <code>1 % c</code> so that c = 1 gives 0.',
    'Calls go down 13 → 6 → 3 → 1 → 0, then the results come back up. Each level squares the result it receives and multiplies in a once more if its b was odd.',
    '<strong>Make the recursive call once</strong> and store it in <code>half</code>. Writing <code>power(a, b/2) * power(a, b/2)</code> makes 2 calls per level, which adds up to about B calls in total, no better than multiplying B times.',
    'Before recursing, make a negative A non-negative with <code>((A % C) + C) % C</code>. Take <code>% c</code> after every multiplication, and use <code>long</code> because products reach about 10¹⁸.'
  ],
  cmp: [['Multiply A, B times (loop or naive recursion)', 'O(B)', 'O(1) / O(B) stack'], ['power(b/2) × power(b/2), two calls', 'O(B)', 'O(log B)'], ['One call, square it', 'O(log B)', 'O(log B)'], ['Iterative binary exponentiation', 'O(log B)', 'O(1)']],
  eff: 'Halving b at every call means about log₂(10⁹) ≈ 30 levels. The recursive version and the iterative bit-by-bit version (Power Function in Modular Arithmetic) do the same multiplications: one processes B\'s bits from the top down, the other from the bottom up. The recursive one is often easier to come up with, and the iterative one avoids the call stack.',
  run({ a, b, c }) {
    if (![a, b, c].every(x => /^-?\d+$/.test(x.trim()))) throw new Error('A, B and C must be whole numbers.');
    const A = BigInt(parseInt(a, 10)), B0 = parseInt(b, 10), C = BigInt(parseInt(c, 10));
    if (B0 < 0 || B0 > 1e9 || C < 1n || C > 1000000000n || A < -1000000000n || A > 1000000000n) throw new Error('Need −10⁹ ≤ A ≤ 10⁹, 0 ≤ B ≤ 10⁹, 1 ≤ C ≤ 10⁹.');
    const base = ((A % C) + C) % C; const F = []; const stack = [];
    const st = () => ({ stack: clone(stack) });
    F.push({ line: 'norm', msg: `base = ((${A} % ${C}) + ${C}) % ${C} = ${base}${A < 0n ? '. A was negative, so C is added to make it non-negative' : ''}.`, vars: { base: String(base) }, st: st() });
    const rec = (bb) => {
      stack.push({ call: `power(${base}, ${bb})`, detail: '', state: 'active' }); const me = stack[stack.length - 1];
      if (bb === 0) { me.state = 'done'; me.value = String(1n % C); me.detail = 'base case';
        F.push({ line: 'base', msg: `b = 0, so a⁰ = 1, and the base case returns 1 % ${C} = ${1n % C}.`, vars: { b: 0, returns: String(1n % C) }, st: st() }); stack.pop(); return 1n % C; }
      me.detail = `needs power(${base}, ${Math.floor(bb / 2)})`;
      F.push({ line: 'half', msg: `b = ${bb}. First compute a^${Math.floor(bb / 2)} with one recursive call.`, vars: { b: bb, 'b / 2': Math.floor(bb / 2) }, st: st() });
      me.state = 'waiting';
      const h = rec(Math.floor(bb / 2));
      me.state = 'active'; let res = h * h % C; me.detail = `half = ${h}`;
      F.push({ line: 'sq', msg: `half = ${h}. Square it: ${h}² % ${C} = ${res}.`, vars: { b: bb, half: String(h), res: String(res) }, st: st() });
      if (bb % 2 === 1) { const r0 = res; res = res * base % C;
        F.push({ line: 'odd', msg: `b = ${bb} is odd, so multiply in one more a: ${r0} × ${base} % ${C} = ${res}.`, vars: { b: bb, res: String(res) }, st: st() }); }
      me.state = 'done'; me.value = String(res); me.detail = `= ${h}²${bb % 2 ? ' × ' + base : ''}`;
      F.push({ line: 'ret', msg: `power(${base}, ${bb}) returns ${res}.`, vars: { b: bb, returns: String(res) }, st: st() });
      stack.pop(); return res;
    };
    const r = rec(B0);
    F.push({ line: 'ret', msg: `${A}^${B0} mod ${C} = ${r}. The recursion went ${Math.max(1, Math.floor(Math.log2(B0 || 1)) + 2)} levels deep instead of doing ${B0.toLocaleString('en-US')} multiplications.`, vars: { result: String(r) }, st: { stack: [{ call: `power(${base}, ${B0})`, state: 'done', value: String(r), detail: '' }] }, result: String(r) });
    return F;
  },
  render(st) { return callStackView(st.stack); }
});
