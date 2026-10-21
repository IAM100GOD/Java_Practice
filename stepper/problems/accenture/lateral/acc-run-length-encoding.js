/* A20. Run-Length String Encoding / Compression (Accenture Lateral) */
P.push({
  id: 'acc-run-length-encoding',
  title: 'Run-Length String Encoding',
  level: 'easy',
  group: 'accenture',
  file: 'RunLengthEncoding.java',
  dir: 'accenture/lateral',
  statement: 'Given an input string <code>str</code>, return the run-length encoded string representing contiguous character counts. Example: "aaaabbbccc" \u2192 "a4b3c3", "wwwwaaadexxxxxx" \u2192 "w4a3d1e1x6".',
  technique: 'Single-pass contiguous run counting with StringBuilder',
  time: 'O(n)',
  space: 'O(n) output string',
  inputs: [
    { key: 's', label: 'str', def: 'aaaabbbccc' }
  ],
  samples: [
    ['aaaabbbccc'],
    ['wwwwaaadexxxxxx'],
    ['abcd'],
    ['a'],
    ['aabbbcccccdd']
  ],
  code: "public static String encode(String str) {\n    if (str == null || str.isEmpty()) return \"\"; @empty\n    StringBuilder sb = new StringBuilder(); @init\n    int count = 1; @count\n    for (int i = 0; i < str.length(); i++) {\n        if (i + 1 < str.length() && str.charAt(i) == str.charAt(i + 1)) {\n            count++; @inc\n        } else {\n            sb.append(str.charAt(i)).append(count); @append\n            count = 1; @reset\n        }\n    }\n    return sb.toString(); @ret\n}",
  steps: [
    'Iterate through the string from left to right while keeping a contiguous run <code>count</code>.',
    'At index <code>i</code>, compare <code>str[i]</code> with the next character <code>str[i + 1]</code>.',
    'If identical, increment <code>count</code>.',
    'If different (or at the final character), append <code>str[i]</code> and <code>count</code> to the <code>StringBuilder</code>, then reset <code>count = 1</code>.',
    'Takes linear O(n) time and linear O(n) space for the resulting string.'
  ],
  cmp: [
    ['String concatenation in loop (+)', 'O(n\u00b2)', 'O(n\u00b2) temporary strings'],
    ['Single pass with StringBuilder', 'O(n)', 'O(n) final string']
  ],
  eff: 'StringBuilder avoids quadratic string copying overhead by appending in amortized O(1) per character.',
  run({ s }) {
    const str = String(s ?? '');
    const n = str.length;
    if (n > 25) throw new Error('Use string of length 25 or fewer for visualizer.');

    const F = [];
    if (!n) {
      F.push({
        line: 'empty',
        msg: 'Empty string: return "".',
        vars: { result: '""' },
        st: { s: '', i: -1, count: 0, out: '' },
        result: '""'
      });
      return F;
    }

    let out = '';
    F.push({
      line: 'init',
      msg: 'Initialize StringBuilder sb and count = 1.',
      vars: { str, count: 1 },
      st: { s: str, i: -1, count: 1, out }
    });

    let count = 1;
    for (let i = 0; i < n; i++) {
      const c = str[i];
      const sameAsNext = i + 1 < n && c === str[i + 1];

      if (sameAsNext) {
        count++;
        F.push({
          line: 'inc',
          msg: `char '${c}' at index ${i} matches next char '${str[i + 1]}'. Increment run count \u2192 ${count}.`,
          vars: { i, c: `'${c}'`, count },
          st: { s: str, i, count, out }
        });
      } else {
        out += `${c}${count}`;
        F.push({
          line: 'append',
          msg: `Run ended for '${c}'. Append "${c}${count}" to result \u2192 "${out}".`,
          vars: { i, c: `'${c}'`, runLen: count, sb: `"${out}"` },
          st: { s: str, i, count, out }
        });
        count = 1;
        F.push({
          line: 'reset',
          msg: `Reset count = 1 for the next run.`,
          vars: { count: 1 },
          st: { s: str, i, count: 1, out }
        });
      }
    }

    F.push({
      line: 'ret',
      msg: `Finished encoding: "${out}".`,
      vars: { result: `"${out}"` },
      st: { s: str, i: n - 1, count: 1, out },
      result: out
    });
    return F;
  },
  render(st) {
    const chars = st.s ? st.s.split('') : [];
    let h = block('input string',
      cells(chars, {
        top: k => k === st.i ? [['i', 'c-acc']] : [],
        cls: k => k === st.i ? 'cur t1' : k < st.i ? 'ok' : 'dim'
      })
    );

    h += block('encoded string (StringBuilder)',
      `<div class="chips"><span class="tok ok" style="font-size:1rem;font-weight:600">"${esc(st.out)}"</span><span class="tok t2">current run count: ${st.count}</span></div>`
    );
    return h;
  }
});
