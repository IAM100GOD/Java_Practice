/* A5. Binary String Operations (Accenture) */
P.push({
  id: 'acc-binary-ops', title: 'Binary String Operations', level: 'easy', group: 'accenture', file: 'BinaryStringOperations.java', dir: 'AccentureQuestions',
  statement: 'The string alternates binary digits and operators: <code>A</code> = AND, <code>B</code> = OR, <code>C</code> = XOR. Evaluate strictly left to right (no precedence) and return the final bit. Return \u22121 if the string is null. Example: "1C0C1C1A0B1" \u2192 1.',
  technique: 'Running accumulator, step by 2', time: 'O(n)', space: 'O(1)',
  inputs: [{ key: 's', label: 'str', def: '1C0C1C1A0B1' }],
  samples: [['1C0C1C1A0B1'], ['0C1A1B1C1B0A0'], ['1A0'], ['1']],
  code: "public static int operationsBinaryString(String str) {\n    if (str == null || str.length() == 0) return -1; @null\n    int res = str.charAt(0) - '0'; @init\n    for (int i = 1; i < str.length(); i += 2) {\n        char op = str.charAt(i);\n        int nextVal = str.charAt(i + 1) - '0'; @read\n        if (op == 'A') res = res & nextVal; @and\n        else if (op == 'B') res = res | nextVal; @or\n        else if (op == 'C') res = res ^ nextVal; @xor\n    }\n    return res; @ret\n}",
  steps: [
    'Digits sit at even indexes (0, 2, 4, \u2026) and operators at odd indexes (1, 3, 5, \u2026).',
    'Start with the first digit as the running result.',
    'Jump 2 at a time: read the operator at i and the digit at i+1, and fold it into the result.',
    '<code>ch - \'0\'</code> turns the character \'0\'/\'1\' into the number 0/1.',
    'There is no operator precedence here: AND is not done before OR, everything is strictly left to right.'
  ],
  cmp: [['Build an expression tree / stack', 'O(n)', 'O(n)'], ['Running accumulator', 'O(n)', 'O(1)']],
  eff: 'Since evaluation is left to right with no precedence, the previous result is all you need to remember. One variable is enough.',
  run({ s }) {
    s = s.trim();
    if (!s.length) { return [{ line: 'null', msg: 'Empty string: return -1.', vars: { result: -1 }, st: { s, i: -1, res: null, hist: [] }, result: '-1' }]; }
    if (!/^[01]([ABC][01])*$/.test(s)) throw new Error('Format must be digit, op, digit, op, \u2026 with digits 0/1 and ops A/B/C, ending on a digit.');
    if (s.length > 31) throw new Error('Use 31 characters or fewer.');
    const F = []; let res = +s[0]; const hist = []; let i = 0;
    const st = () => ({ s, i, res, hist: [...hist] });
    F.push({ line: 'init', msg: `res starts as the first digit, ${res}.`, vars: { res }, st: st() });
    const names = { A: ['AND', '&', (a, b) => a & b], B: ['OR', '|', (a, b) => a | b], C: ['XOR', '^', (a, b) => a ^ b] };
    for (i = 1; i < s.length; i += 2) {
      const op = s[i], v = +s[i + 1];
      F.push({ line: 'read', msg: `i = ${i}: operator '${op}' (${names[op][0]}), next digit ${v}.`, vars: { i, op, nextVal: v, res }, st: st() });
      const before = res; res = names[op][2](res, v);
      hist.push(`${before} ${names[op][0]} ${v} = ${res}`);
      F.push({ line: { A: 'and', B: 'or', C: 'xor' }[op], msg: `res = ${before} ${names[op][1]} ${v} = ${res}.`, vars: { i, op, nextVal: v, res }, st: st() });
    }
    i = -1;
    F.push({ line: 'ret', msg: `All operators applied. Return ${res}.`, vars: { result: res }, st: st(), result: String(res) });
    return F;
  },
  render(st) {
    const ch = [...st.s];
    const grid = ch.length ? cells(ch, { top: k => k === st.i ? [['op', 'c-acc']] : k === st.i + 1 && st.i > 0 ? [['next', 'c-p2']] : [], cls: k => st.i === -1 ? 'dim' : k === st.i ? 'cur t1' : k === st.i + 1 ? 't2' : k < st.i ? 'dim' : '' }) : '<span class="empty">empty</span>';
    return block('expression (A = AND, B = OR, C = XOR)', grid)
      + block(`res = ${st.res === null ? '\u2014' : st.res}`, '')
      + block('steps so far', tokens(st.hist, k => k === st.hist.length - 1 ? 'ok' : ''));
  }
});
