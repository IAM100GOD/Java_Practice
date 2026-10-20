/* 40. Is magic? (Scaler) */
P.push({
  id: 'is-magic', title: 'Is Magic?', level: 'easy', group: 'scaler-rec1', file: 'IsMagic.java', dir: 'scaler/adv_dsa_1/recursion_1',
  statement: 'Keep replacing A with the sum of its digits until one digit is left. Return 1 if that digit is 1, otherwise 0. Constraint: 1 ≤ A ≤ 10⁹.',
  technique: 'Recursion on the digit sum (digital root)', time: 'O(log A)', space: 'O(log A) stack',
  inputs: [{ key: 'a', label: 'A', def: '83557', narrow: true }],
  samples: [['83557'], ['1291'], ['1'], ['999999999'], ['1000000000']],
  code: "public int solve(int A) {\n    if (A < 10) return A == 1 ? 1 : 0;       // single digit: magic only if it's 1 @single\n    return solve(sumOfDigits(A));            // shrink to the digit sum and repeat @shrink\n}\n\nprivate int sumOfDigits(int A) {\n    if (A == 0) return 0;\n    return A % 10 + sumOfDigits(A / 10);\n}",
  steps: [
    '<strong>Base case:</strong> a single digit (A &lt; 10) cannot shrink further. It is magic exactly when it is 1.',
    '<strong>Recursive case:</strong> replace A with its digit sum, a smaller number, and ask the same question: <code>solve(sumOfDigits(A))</code>.',
    '<code>sumOfDigits</code> is itself recursive (Q1): last digit + sumOfDigits(the rest), with sumOfDigits(0) = 0.',
    'The numbers shrink very fast: any A ≤ 10⁹ has a digit sum ≤ 81, then ≤ 16, then a single digit. So there are only a few levels.',
    'Shortcut: the final digit, called the digital root, equals <code>1 + (A − 1) % 9</code>, because a number and its digit sum leave the same remainder mod 9. So A is magic exactly when <code>A % 9 == 1</code>. The Java file uses this to check the recursive answer.'
  ],
  cmp: [['Loop: while (A ≥ 10) A = digitSum(A)', 'O(log A)', 'O(1)'], ['Recursion (asked for)', 'O(log A)', 'O(log A) stack'], ['Digital root: A % 9 == 1', 'O(1)', 'O(1)']],
  eff: 'Each level shrinks a d-digit number to at most 9d, so there are only about 3 to 4 levels for A ≤ 10⁹, with one digit sum each. The mod-9 rule skips the work entirely. It holds because 10 ≡ 1 (mod 9), so every digit counts the same as its face value mod 9.',
  run({ a }) {
    if (!/^\d+$/.test(a.trim())) throw new Error('A must be a positive whole number.');
    const A0 = parseInt(a, 10);
    if (A0 < 1 || A0 > 1e9) throw new Error('A must be between 1 and 10⁹.');
    const F = []; const stack = []; const chain = [A0];
    const ds = x => String(x).split('').reduce((s, c) => s + +c, 0);
    const st = () => ({ stack: clone(stack), chain: [...chain] });
    const rec = (A) => {
      stack.push({ call: `solve(${A})`, detail: '', state: 'active' });
      const me = stack[stack.length - 1];
      if (A < 10) {
        const r = A === 1 ? 1 : 0; me.state = 'done'; me.value = r; me.detail = 'single digit';
        F.push({ line: 'single', msg: `${A} is a single digit, which is the base case. ${A === 1 ? 'It is 1, so return 1 (magic).' : 'It is not 1, so return 0.'}`, vars: { A, returns: r }, st: st() });
        stack.pop(); return r;
      }
      const s = ds(A); chain.push(s); me.detail = `→ solve(${s})`;
      F.push({ line: 'shrink', msg: `${A} has more than one digit. sumOfDigits(${A}) = ${String(A).split('').join(' + ')} = ${s}. Call solve(${s}).`, vars: { A, 'sumOfDigits(A)': s }, st: st() });
      me.state = 'waiting';
      const r = rec(s);
      me.state = 'done'; me.value = r;
      F.push({ line: 'shrink', msg: `solve(${s}) returned ${r}, so solve(${A}) returns ${r} as well.`, vars: { A, returns: r }, st: st() });
      stack.pop(); return r;
    };
    const res = rec(A0);
    F.push({ line: 'shrink', msg: `${chain.join(' → ')}. The last digit is ${chain[chain.length - 1]}, so ${res ? 'A is magic' : 'A is not magic'}. Check: ${A0} % 9 = ${A0 % 9}.`, vars: { result: res, 'A % 9': A0 % 9 }, st: { stack: [{ call: `solve(${A0})`, detail: '', state: 'done', value: res }], chain }, result: String(res), bad: !res });
    return F;
  },
  render(st) {
    const last = st.chain[st.chain.length - 1];
    return block('digit-sum chain', tokens(st.chain.map(String), i => i === st.chain.length - 1 ? (last < 10 ? (last === 1 ? 'ok' : 'bad') : 'new') : ''))
      + callStackView(st.stack);
  }
});
