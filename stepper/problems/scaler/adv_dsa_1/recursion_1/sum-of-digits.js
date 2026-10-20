/* 39. Sum of Digits (Scaler) */
P.push({
  id: 'sum-of-digits', title: 'Sum of Digits', level: 'easy', group: 'scaler-rec1', file: 'SumOfDigits.java', dir: 'scaler/adv_dsa_1/recursion_1',
  statement: 'Return the sum of the digits of A, using recursion. Constraint: 1 ≤ A ≤ 10⁹.',
  technique: 'Recursion: last digit + sum of the rest', time: 'O(digits)', space: 'O(digits) call stack',
  inputs: [{ key: 'a', label: 'A', def: '4705', narrow: true }],
  samples: [['46'], ['11'], ['4705'], ['999999999']],
  code: "public int solve(int A) {\n    if (A == 0) return 0;                 // base case: no digits left @base\n    return A % 10 + solve(A / 10);        // last digit + sum of the rest @rec\n}",
  steps: [
    '<strong>Recursion means trusting the same function on a smaller input.</strong> If <code>solve</code> already works for 470, then solve(4705) is just 5 + solve(470).',
    '<code>A % 10</code> is the last digit, and <code>A / 10</code> is the number without it. So <code>solve(A) = A % 10 + solve(A / 10)</code>.',
    '<strong>Base case:</strong> once every digit is removed, A becomes 0 and its digit sum is 0. Without a base case the calls never stop and you get a StackOverflowError.',
    'Calls stack up on the way down (solve(4705) → solve(470) → solve(47) → solve(4) → solve(0)). Each one waits for the call below it.',
    'On the way back up, each waiting call adds its digit to the returned value: 0 → 4 → 11 → 11 → 16.'
  ],
  cmp: [['Convert to String, add each char', 'O(digits)', 'O(digits) string'], ['Loop: sum += A % 10; A /= 10', 'O(digits)', 'O(1)'], ['Recursion (asked for here)', 'O(digits)', 'O(digits) stack']],
  eff: 'All three approaches are linear in the number of digits, at most 10 for A ≤ 10⁹. The recursive version uses one stack frame per digit. That does not matter here, but it is why deep recursion (around 10⁵ or more levels) can overflow the stack while a loop cannot. The point of this problem is to practise thinking in terms of a base case plus a smaller subproblem.',
  run({ a }) {
    if (!/^\d+$/.test(a.trim())) throw new Error('A must be a positive whole number.');
    const A0 = parseInt(a, 10);
    if (A0 < 1 || A0 > 1e9) throw new Error('A must be between 1 and 10⁹.');
    const F = []; const stack = [];
    const snap = () => clone(stack);
    const st = () => ({ A0, stack: snap() });
    const rec = (A) => {
      stack.push({ call: `solve(${A})`, detail: '', state: 'active' });
      if (A === 0) {
        const top = stack[stack.length - 1]; top.state = 'done'; top.value = 0; top.detail = 'base case';
        F.push({ line: 'base', msg: 'A = 0, so no digits are left. This is the base case: return 0 without another call.', vars: { A: 0, 'returns': 0 }, st: st() });
        stack.pop(); return 0;
      }
      const me = stack[stack.length - 1];
      me.detail = `= ${A % 10} + solve(${Math.floor(A / 10)})`;
      F.push({ line: 'rec', msg: `A = ${A} is not 0. Its last digit is ${A} % 10 = ${A % 10}, so call solve(${Math.floor(A / 10)}) for the rest and wait for it.`, vars: { A, 'A % 10': A % 10, 'A / 10': Math.floor(A / 10) }, st: st() });
      me.state = 'waiting';
      const sub = rec(Math.floor(A / 10));
      me.state = 'done'; me.value = A % 10 + sub; me.detail = `= ${A % 10} + ${sub}`;
      F.push({ line: 'rec', msg: `solve(${Math.floor(A / 10)}) returned ${sub}, so solve(${A}) returns ${A % 10} + ${sub} = ${me.value}.`, vars: { A, 'A % 10': A % 10, [`solve(${Math.floor(A / 10)})`]: sub, returns: me.value }, st: st() });
      stack.pop();
      return me.value;
    };
    const res = rec(A0);
    F.push({ line: 'rec', msg: `The first call has returned, so the digit sum of ${A0} is ${res}.`, vars: { result: res }, st: { A0, stack: [{ call: `solve(${A0})`, detail: '', state: 'done', value: res }] }, result: String(res) });
    return F;
  },
  render(st) {
    const digits = String(st.A0).split('');
    const depth = st.stack.length; const removed = Math.max(0, depth - 1);
    const grid = cells(digits, { idx: false, noTop: true, cls: k => k >= digits.length - removed ? 'dim' : k === digits.length - 1 - removed && st.stack.length && st.stack[st.stack.length - 1].state === 'active' ? 'cur t2' : '' });
    return block(`digits of ${st.A0} (faded = already peeled off by the calls above)`, grid) + callStackView(st.stack);
  }
});
