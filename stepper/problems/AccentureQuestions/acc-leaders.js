/* A7. Superior / Leader Elements (Accenture) */
P.push({
  id: 'acc-leaders', title: 'Superior / Leader Elements', level: 'easy', group: 'accenture', file: 'SuperiorElements.java', dir: 'AccentureQuestions',
  statement: 'An element is a <strong>superior element</strong> (leader) if it is strictly greater than every element to its right. The rightmost element is always one. List them in their original order. Example: [16, 17, 4, 3, 5, 2] \u2192 17 5 2.',
  technique: 'Right-to-left scan with running max', time: 'O(n)', space: 'O(1) extra (besides output)',
  inputs: [{ key: 'a', label: 'arr', def: '16, 17, 4, 3, 5, 2' }],
  samples: [['16, 17, 4, 3, 5, 2'], ['1, 2, 3, 4, 5'], ['5, 4, 3, 2, 1'], ['7, 10, 4, 10, 6, 5, 2']],
  code: "public static List<Integer> superiorElements(int[] arr) {\n    List<Integer> leaders = new ArrayList<>();\n    int n = arr.length;\n    int maxRight = arr[n - 1];\n    leaders.add(maxRight);                 // rightmost is always a leader @init\n    for (int i = n - 2; i >= 0; i--) {\n        if (arr[i] > maxRight) {           // beats everything to its right @check\n            maxRight = arr[i];\n            leaders.add(arr[i]); @add\n        }\n        // otherwise arr[i] is not a leader @skip\n    }\n    Collections.reverse(leaders);          // back to left-to-right order @rev\n    return leaders; @ret\n}",
  steps: [
    'Brute force: for each element, check everything to its right. That is O(n\u00b2).',
    '\u201cGreater than everything to my right\u201d is the same as \u201cgreater than the <em>maximum</em> to my right\u201d.',
    'So scan from the right and keep <code>maxRight</code>. Any element that beats it is a leader, and becomes the new maxRight.',
    'Strictly greater: in [7, 10, 4, 10, 6] the first 10 is not a leader because there is another 10 to its right.',
    'Leaders are found right to left, so reverse the list at the end.'
  ],
  cmp: [['Nested loops', 'O(n\u00b2)', 'O(1)'], ['Right-to-left running max', 'O(n)', 'O(1)']],
  eff: 'Keeping the max of the suffix replaces the inner loop with a single comparison, so each element is looked at once.',
  run({ a }) {
    const A = a.split(/[,\s]+/).filter(Boolean).map(Number); const n = A.length;
    if (!n || A.some(x => !Number.isFinite(x))) throw new Error('Enter a list of numbers.');
    if (n > 14) throw new Error('Use 14 numbers or fewer.');
    const F = []; const L = [n - 1]; let mx = A[n - 1], i = n - 1, mi = n - 1;
    const st = (rev) => ({ A, i, mi, L: [...L], rev });
    F.push({ line: 'init', msg: `The rightmost element ${mx} has nothing to its right, so it is a leader. maxRight = ${mx}.`, vars: { i, maxRight: mx, leaders: `[${mx}]` }, st: st() });
    for (i = n - 2; i >= 0; i--) {
      if (A[i] > mx) {
        F.push({ line: 'check', msg: `${A[i]} > maxRight (${mx}): it beats everything to its right.`, vars: { i, 'arr[i]': A[i], maxRight: mx }, st: st() });
        mx = A[i]; mi = i; L.push(i);
        F.push({ line: 'add', msg: `${A[i]} is a leader. maxRight = ${mx}.`, vars: { i, maxRight: mx, leaders: `[${L.map(k => A[k]).join(', ')}]` }, st: st() });
      } else F.push({ line: 'skip', msg: `${A[i]} \u2264 maxRight (${mx}), so something on its right is at least as big. Not a leader.`, vars: { i, 'arr[i]': A[i], maxRight: mx }, st: st() });
    }
    i = -1; const out = [...L].reverse().map(k => A[k]);
    F.push({ line: 'rev', msg: `Found right to left: [${L.map(k => A[k]).join(', ')}]. Reverse to [${out.join(', ')}].`, vars: { leaders: `[${out.join(', ')}]` }, st: st(true) });
    F.push({ line: 'ret', msg: `Superior elements: ${out.join(' ')}.`, vars: { count: out.length }, st: st(true), result: out.join(' ') });
    return F;
  },
  render(st) {
    const order = st.rev ? [...st.L].reverse() : st.L;
    return block('arr (green = leader)', cells(st.A, { top: k => [...(k === st.i ? [['i', 'c-acc']] : []), ...(k === st.mi && st.i >= 0 ? [['max', 'c-p2']] : [])], cls: k => st.L.includes(k) ? 'ok' : k === st.i ? 'cur t1' : st.i >= 0 && k > st.i ? 'dim' : '' }))
      + block(st.rev ? 'leaders (left \u2192 right)' : 'leaders found so far (right \u2192 left)', tokens(order.map(k => String(st.A[k])), () => 'ok'));
  }
});
