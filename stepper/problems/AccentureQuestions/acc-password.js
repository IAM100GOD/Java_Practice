/* A4. Password Validator (Accenture) */
P.push({
  id: 'acc-password', title: 'Password Validator', level: 'easy', group: 'accenture', file: 'PasswordValidator.java', dir: 'AccentureQuestions',
  statement: 'Write <code>checkPassword(String str, int n)</code>. Return 1 if the password is valid, else 0. Rules: (1) length \u2265 4, (2) at least one digit, (3) at least one capital letter A\u2013Z, (4) no space or <code>/</code>, (5) must not start with a digit.',
  technique: 'Early exits + single pass with flags', time: 'O(n)', space: 'O(1)',
  inputs: [{ key: 's', label: 'str', def: 'aA1_67' }],
  samples: [['aA1_67'], ['a987 abC012'], ['1Abc'], ['Ab1'], ['abcd'], ['Pass/1']],
  code: "public static int checkPassword(String str, int n) {\n    if (str == null || n < 4) return 0;             // rule 1 @len\n    if (Character.isDigit(str.charAt(0))) return 0;  // rule 5 @first\n    boolean hasDigit = false, hasCapital = false; @init\n    for (int i = 0; i < n; i++) {\n        char ch = str.charAt(i); @ch\n        if (ch == ' ' || ch == '/') return 0;        // rule 4 @bad\n        if (Character.isDigit(ch)) hasDigit = true; @digit\n        if (Character.isUpperCase(ch)) hasCapital = true; @cap\n    }\n    return (hasDigit && hasCapital) ? 1 : 0; @ret\n}",
  steps: [
    'Cheap checks first: length and the first character can reject a password without a loop.',
    'Then one pass over the characters. A space or slash fails immediately.',
    'Digits and capitals are \u201cat least one\u201d rules, so just set a flag when you see one.',
    'After the loop the password is valid only if both flags are true.'
  ],
  cmp: [['Separate loop per rule', 'O(5n)', 'O(1)'], ['Regex', 'O(n)', 'O(1)'], ['Single pass with flags', 'O(n)', 'O(1)']],
  eff: 'All approaches are linear; a single pass with early exits touches each character at most once and stops as soon as a forbidden character appears.',
  run({ s }) {
    const n = s.length; if (n > 30) throw new Error('Use 30 characters or fewer.');
    const F = []; let hasDigit = false, hasCapital = false, i = -1; const bad = [];
    const isD = c => /[0-9]/.test(c), isU = c => /[A-Z]/.test(c);
    const st = (rules) => ({ s, i, hasDigit, hasCapital, bad: [...bad], rules });
    const R = { len: '', first: '', bad: '', digit: '', cap: '' };
    const done = (line, msg, res) => { F.push({ line, msg, vars: { n, hasDigit, hasCapital, result: res }, st: st({ ...R }), result: String(res) }); return F; };
    if (n < 4) { R.len = 'bad'; return done('len', `Length ${n} < 4. Rule 1 fails, return 0.`, 0); }
    R.len = 'ok'; F.push({ line: 'len', msg: `Length ${n} \u2265 4. Rule 1 OK.`, vars: { n }, st: st({ ...R }) });
    if (isD(s[0])) { R.first = 'bad'; i = 0; return done('first', `First character '${s[0]}' is a digit. Rule 5 fails, return 0.`, 0); }
    R.first = 'ok'; F.push({ line: 'first', msg: `First character '${s[0]}' is not a digit. Rule 5 OK.`, vars: { n }, st: st({ ...R }) });
    F.push({ line: 'init', msg: 'Start the scan with both flags false.', vars: { hasDigit, hasCapital }, st: st({ ...R }) });
    for (i = 0; i < n; i++) {
      const ch = s[i];
      if (ch === ' ' || ch === '/') { bad.push(i); R.bad = 'bad'; return done('bad', `str[${i}] is ${ch === ' ' ? 'a space' : "'/'"}. Rule 4 fails, return 0.`, 0); }
      if (isD(ch)) { const was = hasDigit; hasDigit = true; R.digit = 'ok'; F.push({ line: 'digit', msg: `'${ch}' is a digit${was ? ' (flag already set)' : '. hasDigit = true'}.`, vars: { i, ch, hasDigit, hasCapital }, st: st({ ...R }) }); }
      else if (isU(ch)) { const was = hasCapital; hasCapital = true; R.cap = 'ok'; F.push({ line: 'cap', msg: `'${ch}' is a capital${was ? ' (flag already set)' : '. hasCapital = true'}.`, vars: { i, ch, hasDigit, hasCapital }, st: st({ ...R }) }); }
      else F.push({ line: 'ch', msg: `'${ch}' is allowed but is neither a digit nor a capital.`, vars: { i, ch, hasDigit, hasCapital }, st: st({ ...R }) });
    }
    i = -1; R.bad = 'ok'; R.digit = hasDigit ? 'ok' : 'bad'; R.cap = hasCapital ? 'ok' : 'bad';
    const res = hasDigit && hasCapital ? 1 : 0;
    return done('ret', res ? 'No forbidden characters, and both a digit and a capital were found. Return 1.' : `Scan finished but ${!hasDigit ? 'no digit' : ''}${!hasDigit && !hasCapital ? ' and ' : ''}${!hasCapital ? 'no capital letter' : ''} was found. Return 0.`, res);
  },
  render(st) {
    const chars = [...st.s];
    const grid = chars.length ? cells(chars, { top: k => k === st.i ? [['i', 'c-acc']] : [], cls: k => st.bad.includes(k) ? 'bad' : k === st.i ? 'cur t1' : /[0-9]/.test(chars[k]) ? 't2' : /[A-Z]/.test(chars[k]) ? 'ok' : '' }) : '<span class="empty">empty</span>';
    const names = [['len', '1. length \u2265 4'], ['digit', '2. has a digit'], ['cap', '3. has a capital'], ['bad', '4. no space or /'], ['first', '5. does not start with a digit']];
    const r = st.rules || {};
    return block('password characters', grid) + block('rules', tokens(names.map(([k, l]) => `${r[k] === 'ok' ? '\u2713' : r[k] === 'bad' ? '\u2717' : '\u2026'} ${l}`), j => r[names[j][0]] || ''));
  }
});
