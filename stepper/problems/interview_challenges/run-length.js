/* 6. Run Length Encoding */
P.push({
  id: 'run-length', title: 'Run Length Encoding', level: 'medium', file: 'RunLengthEncoding.java',
  statement: 'Compress a string by writing the length of each run of repeated characters, followed by the character. <code>"aabbc"</code> becomes <code>"2a2b1c"</code>.',
  technique: 'Single pass + StringBuilder', time: 'O(n)', space: 'O(n) for the output',
  inputs: [{ key: 's', label: 'str', def: 'wwwggopp' }],
  samples: [['aabbc'], ['wwwggopp'], ['aabbcde']],
  code: "public static String runLength(String str) {\n    StringBuilder sb = new StringBuilder();\n    int count = 1; @init\n    for (int i = 1; i <= str.length(); i++) {\n        if (i < str.length() && str.charAt(i) == str.charAt(i - 1)) {\n            count++; @same\n        } else {\n            sb.append(count).append(str.charAt(i - 1)); @emit\n            count = 1;\n        }\n    }\n    return sb.toString(); @ret\n}",
  steps: [
    'The first character starts a run of length 1.',
    'Compare each character with the one before it. If it is the same, the run grows.',
    'When the character changes, write <code>count</code> and the previous character, then start a new run at 1.',
    'The loop goes one step past the end (<code>i &lt;= length</code>), so the last run is written without a separate block after the loop.'
  ],
  cmp: [['result += count + ch (String concatenation)', 'O(n²)', 'many temp strings'], ['StringBuilder, one pass', 'O(n)', 'O(n)']],
  eff: 'Every character is looked at once. StringBuilder appends to one growing buffer instead of copying the whole result on each <code>+=</code>. Running the loop one step past the end is a common trick to avoid duplicating the "write last run" code.',
  run({ s }) {
    if (!s.length) throw new Error('Enter at least one character.');
    const F = []; let count = 1, start = 0; const toks = [], runs = [];
    const st = (i, hot) => ({ a: [...s], i, start, toks: [...toks], runs: clone(runs), hot });
    F.push({ line: 'init', msg: `The first character '${s[0]}' starts a run. count = 1.`, vars: { i: 0, count, sb: '""' }, st: st(0) });
    for (let i = 1; i <= s.length; i++) {
      if (i < s.length && s[i] === s[i - 1]) { count++; F.push({ line: 'same', msg: `'${s[i]}' equals the previous character. The run grows to ${count}.`, vars: { i, 'str[i]': `'${s[i]}'`, count, sb: q(toks.join('')) }, st: st(i) }); }
      else {
        toks.push(count + s[i - 1]); runs.push([start, i - 1]);
        F.push({ line: 'emit', msg: i < s.length ? `'${s[i]}' differs from '${s[i - 1]}'. Write "${count}${s[i - 1]}" and start a new run.` : `End of string. Write the last run, "${count}${s[i - 1]}".`, vars: { i, 'str[i]': i < s.length ? `'${s[i]}'` : 'end', count, sb: q(toks.join('')) }, st: st(i, true) });
        count = 1; start = i;
      }
    }
    F.push({ line: 'ret', msg: 'Every run has been written.', vars: { sb: q(toks.join('')) }, st: st(-1), result: q(toks.join('')) });
    return F;
  },
  render(st) {
    const runOf = i => st.runs.findIndex(([a, b]) => i >= a && i <= b);
    return block('str', cells(st.a, {
      cls: i => { const r = runOf(i); return [i === st.i ? 'cur' : '', r >= 0 ? (r % 2 ? 't3' : 't1') : (st.i >= 0 && i >= st.start && i <= st.i && i < st.a.length ? 't2' : '')].join(' '); },
      top: i => i === st.i ? [['i', 'c-acc']] : []
    })) + block('sb', tokens(st.toks, i => i === st.toks.length - 1 && st.hot ? 'new' : ''));
  }
});
