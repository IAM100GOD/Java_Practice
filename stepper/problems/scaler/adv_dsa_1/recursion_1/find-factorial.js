/* 43. Find Factorial (Scaler) */
P.push({
  id: 'find-factorial', title: 'Find Factorial', level: 'easy', group: 'scaler-rec1', file: 'FindFactorial.java', dir: 'scaler/adv_dsa_1/recursion_1',
  statement: 'Return A! using recursion. Constraint: 0 ≤ A ≤ 12.',
  technique: 'Linear recursion: A! = A × (A−1)!', time: 'O(A)', space: 'O(A) stack',
  inputs: [{ key: 'a', label: 'A', def: '5', narrow: true }],
  samples: [['4'], ['1'], ['0'], ['5'], ['12']],
  code: "public int solve(int A) {\n    if (A <= 1) return 1;            // 0! = 1! = 1 @base\n    return A * solve(A - 1);         // A! = A * (A-1)! @rec\n}",
  steps: [
    '<strong>Recursive case:</strong> <code>A! = A × (A−1)!</code>. Assume solve(A − 1) is correct, then multiply by A.',
    '<strong>Base case:</strong> <code>A ≤ 1 → 1</code>. 1! = 1, and 0! = 1 because a product of no numbers is 1. Using <code>A ≤ 1</code> instead of <code>A == 1</code> also covers A = 0, which would otherwise recurse into −1, −2, … until the stack overflows.',
    'Calls go down 5 → 4 → 3 → 2 → 1. Then the products come back up: 1 → 2 → 6 → 24 → 120.',
    '<strong>Why A ≤ 12:</strong> 12! = 479,001,600 fits in an <code>int</code>, but 13! = 6,227,020,800 is larger than 2,147,483,647 and would silently overflow into a wrong number.'
  ],
  cmp: [['Loop: res *= i', 'O(A)', 'O(1)'], ['Recursion (asked for)', 'O(A)', 'O(A) stack']],
  eff: 'Both versions do A multiplications. Recursion uses one stack frame per level, which is negligible for A ≤ 12. For bigger factorials you would switch to <code>long</code> (fits up to 20!), BigInteger, or take a remainder at each step, as in the combinatorics problems.',
  run({ a }) {
    if (!/^\d+$/.test(a.trim())) throw new Error('A must be a whole number.');
    const A0 = parseInt(a, 10);
    if (A0 > 12) throw new Error('A must be at most 12; 13! overflows int.');
    const F = []; const stack = [];
    const st = () => ({ stack: clone(stack) });
    const rec = A => {
      stack.push({ call: `solve(${A})`, detail: '', state: 'active' }); const me = stack[stack.length - 1];
      if (A <= 1) { me.state = 'done'; me.value = 1; me.detail = 'base case';
        F.push({ line: 'base', msg: `A = ${A} ≤ 1, which is the base case. ${A}! = 1.`, vars: { A, returns: 1 }, st: st() }); stack.pop(); return 1; }
      me.detail = `= ${A} × solve(${A - 1})`;
      F.push({ line: 'rec', msg: `${A}! = ${A} × ${A - 1}!. Call solve(${A - 1}) and wait for it.`, vars: { A }, st: st() });
      me.state = 'waiting'; const sub = rec(A - 1); me.state = 'done'; me.value = A * sub; me.detail = `= ${A} × ${sub}`;
      F.push({ line: 'rec', msg: `solve(${A - 1}) returned ${sub}, so solve(${A}) returns ${A} × ${sub} = ${A * sub}.`, vars: { A, [`solve(${A - 1})`]: sub, returns: A * sub }, st: st() });
      stack.pop(); return A * sub;
    };
    const r = rec(A0);
    F.push({ line: 'rec', msg: `${A0}! = ${r.toLocaleString('en-US')}.`, vars: { result: r }, st: { stack: [{ call: `solve(${A0})`, detail: '', state: 'done', value: r }] }, result: String(r) });
    return F;
  },
  render(st) { return callStackView(st.stack); }
});
