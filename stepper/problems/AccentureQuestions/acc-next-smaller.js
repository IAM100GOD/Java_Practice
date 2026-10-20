/* A3. Next Smaller Element (Accenture) */
P.push({
  id: 'acc-next-smaller', title: 'Next Smaller Element', level: 'medium', group: 'accenture', file: 'NextSmallerElement.java', dir: 'AccentureQuestions',
  statement: 'For each element, output the first element to its right that is strictly smaller, or −1 if there is none.',
  technique: 'Monotonic stack, scan right to left', time: 'O(N)', space: 'O(N)',
  inputs: [{ key: 'a', label: 'arr', def: '4, 8, 5, 2, 25' }],
  samples: [['4, 8, 5, 2, 25'], ['13, 7, 6, 12'], ['1, 2, 3, 4'], ['5, 4, 3, 2, 1']],
  code: "public static int[] nextSmaller(int[] arr) {\n    int n = arr.length;\n    int[] result = new int[n];\n    Stack<Integer> stack = new Stack<>(); @init\n    for (int i = n - 1; i >= 0; i--) {\n        while (!stack.isEmpty() && stack.peek() >= arr[i]) {\n            stack.pop();                      // can never be an answer for arr[i] or anything left of it @pop\n        }\n        result[i] = stack.isEmpty() ? -1 : stack.peek(); @ans\n        stack.push(arr[i]); @push\n    }\n    return result; @ret\n}",
  steps: [
    'Brute force scans right from every index: O(N²).',
    'Scan from the right and keep a stack of candidates. Anything ≥ arr[i] is useless from now on, because arr[i] is both smaller and closer for every element to the left.',
    'After popping, the top (if any) is the next smaller element. Then push arr[i] as a candidate.',
    'Each element is pushed and popped at most once, so the whole thing is O(N).'
  ],
  cmp: [['Nested loops', 'O(N²)', 'O(1)'], ['Monotonic stack', 'O(N)', 'O(N)']],
  eff: 'The stack stays increasing from bottom to top. Amortised, every element costs one push and at most one pop.',
  run({ a }) {
    const A = a.split(/[,\s]+/).filter(Boolean).map(Number); const n = A.length;
    if (!n || A.some(x => !Number.isFinite(x))) throw new Error('Enter a list of numbers.');
    if (n > 14) throw new Error('Use 14 numbers or fewer.');
    const F = []; const res = Array(n).fill(''); const stack = []; let i = -1;
    const st = () => ({ A, res: [...res], stack: [...stack], i });
    F.push({ line: 'init', msg: 'Empty stack. Scan from the right.', vars: { n }, st: st() });
    for (i = n - 1; i >= 0; i--) {
      while (stack.length && stack[stack.length - 1] >= A[i]) { const p = stack.pop(); F.push({ line: 'pop', msg: `${p} ≥ ${A[i]}, so pop ${p}.`, vars: { i, 'arr[i]': A[i], popped: p }, st: st() }); }
      res[i] = stack.length ? stack[stack.length - 1] : -1;
      F.push({ line: 'ans', msg: stack.length ? `Top ${res[i]} < ${A[i]}: result[${i}] = ${res[i]}.` : `Stack empty: result[${i}] = -1.`, vars: { i, 'arr[i]': A[i], 'result[i]': res[i] }, st: st() });
      stack.push(A[i]);
      F.push({ line: 'push', msg: `Push ${A[i]}. Stack (bottom→top): [${stack.join(', ')}].`, vars: { i, stack: `[${stack.join(', ')}]` }, st: st() });
    }
    i = -1;
    F.push({ line: 'ret', msg: 'Done.', vars: {}, st: st(), result: res.join(' ') });
    return F;
  },
  render(st) {
    return block('arr', cells(st.A, { top: k => k === st.i ? [['i', 'c-acc']] : [], cls: k => k === st.i ? 'cur t1' : k > st.i && st.i >= 0 ? 'dim' : '' }))
      + block('result', cells(st.res.map(x => x === '' ? '·' : x), { noTop: true, cls: k => st.res[k] === '' ? '' : 'ok' }))
      + block('stack (bottom → top)', tokens(st.stack.map(String), k => k === st.stack.length - 1 ? 'ok' : ''));
  }
});
