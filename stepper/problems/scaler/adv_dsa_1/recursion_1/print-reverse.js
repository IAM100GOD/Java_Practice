/* 44. Print reverse string (Scaler) */
P.push({
  id: 'print-reverse', title: 'Print Reverse String', level: 'easy', group: 'scaler-rec1', file: 'PrintReverseString.java', dir: 'scaler/adv_dsa_1/recursion_1',
  statement: 'Read a string S from standard input and print its characters in reverse order, using recursion. Constraint: |S| ≤ 1000.',
  technique: 'Print after the recursive call (unwinding order)', time: 'O(n)', space: 'O(n) stack',
  inputs: [{ key: 's', label: 'S (stdin)', def: 'cool' }],
  samples: [['cool'], ['scaler'], ['a'], ['recursion']],
  code: "static void printReverse(String s, int i) {\n    if (i == s.length()) return;          // base case: nothing left to print @base\n    printReverse(s, i + 1);               // first print everything after i, reversed @rec\n    System.out.print(s.charAt(i));        // then s[i], which comes after all of them @print\n}\n\npublic static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String s = sc.nextLine().trim();\n    printReverse(s, 0); @main\n    System.out.println();\n}",
  steps: [
    '<code>printReverse(s, i)</code> prints characters i to the end of the string, in reverse.',
    '<strong>Base case:</strong> <code>i == length</code> means there is nothing left, so return without printing.',
    '<strong>The trick is the order:</strong> first call <code>printReverse(s, i + 1)</code> to print everything after i, then print <code>s[i]</code>. Because the print comes after the call, s[i] is printed after all the later characters.',
    'So the calls go in from left to right (c → o → o → l), and nothing is printed yet. The prints happen as the calls return, from right to left: l, o, o, c.',
    'If you swapped the two lines, printing first and calling second, the string would come out in normal order. Using an index avoids copying with <code>substring</code>, which would cost O(n²) in total.'
  ],
  cmp: [['new StringBuilder(s).reverse()', 'O(n)', 'O(n)'], ['Recurse on s.substring(1)', 'O(n²) (copies)', 'O(n²) total'], ['Recurse on an index, print after the call', 'O(n)', 'O(n) stack']],
  eff: 'Each character takes one call and one print. Printing after the call means the stack does the reversing: the deepest call (the last character) finishes first. Passing an index instead of <code>s.substring(1)</code> avoids copying the rest of the string at every level.',
  run({ s }) {
    if (!s.length) throw new Error('S cannot be empty.');
    if (s.length > 12) throw new Error('Use 12 characters or fewer so the picture fits.');
    const F = []; const stack = []; let out = '';
    const st = (i) => ({ s, i, out, stack: clone(stack) });
    const rec = i => {
      stack.push({ call: `printReverse(s, ${i})`, detail: i < s.length ? `s[${i}] = '${s[i]}'` : 'past the end', state: 'active' }); const me = stack[stack.length - 1];
      if (i === s.length) { me.state = 'done'; me.value = 'returns'; F.push({ line: 'base', msg: `i = ${i} equals the length. Nothing is left, so return. This is the base case, and printing starts as the calls return.`, vars: { i, printed: q(out) }, st: st(i) }); stack.pop(); return; }
      F.push({ line: 'rec', msg: `i = ${i} ('${s[i]}'). Before printing it, call printReverse(s, ${i + 1}) to print everything after it.`, vars: { i, 's[i]': `'${s[i]}'`, printed: q(out) }, st: st(i) });
      me.state = 'waiting'; rec(i + 1); me.state = 'active';
      out += s[i];
      F.push({ line: 'print', msg: `The call for i = ${i + 1} has returned, so everything after '${s[i]}' is printed. Now print '${s[i]}'. Output: "${out}".`, vars: { i, 's[i]': `'${s[i]}'`, printed: q(out) }, st: st(i) });
      me.state = 'done'; me.value = 'returns'; stack.pop();
    };
    rec(0);
    F.push({ line: 'main', msg: `Done. "${s}" was printed as "${out}".`, vars: { printed: q(out) }, st: st(-1), result: out });
    return F;
  },
  render(st) {
    const grid = cells([...st.s], { cls: k => st.out.length && k >= st.s.length - st.out.length ? 'ok' : k === st.i ? 'cur t2' : '', top: k => k === st.i ? [['i', 'c-acc']] : [] });
    return block('S (green = already printed)', grid) + block('stdout', st.out ? cells([...st.out], { idx: false, noTop: true, cls: k => k === st.out.length - 1 ? 't2' : 'ok' }) : '<span class="empty">nothing printed yet</span>') + callStackView(st.stack);
  }
});
