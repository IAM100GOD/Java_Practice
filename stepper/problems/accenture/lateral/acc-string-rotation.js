/* A16. Check if One String is a Rotation of Another (Accenture Lateral) */
P.push({
  id: 'acc-string-rotation',
  title: 'Check String Rotation',
  level: 'easy',
  group: 'accenture',
  file: 'StringRotation.java',
  dir: 'accenture/lateral',
  statement: 'Given two strings <code>s1</code> and <code>s2</code>, determine if <code>s2</code> is a valid circular rotation of <code>s1</code>. Achieve this in linear time without brute-force substring generation loops. Example: s1 = "ABCD", s2 = "CDAB" \u2192 true.',
  technique: 'Concatenation trick: (s1 + s1).contains(s2)',
  time: 'O(n)',
  space: 'O(n)',
  inputs: [
    { key: 's1', label: 's1', def: 'ABCD' },
    { key: 's2', label: 's2', def: 'CDAB' }
  ],
  samples: [
    ['ABCD', 'CDAB'],
    ['ABCD', 'ACBD'],
    ['waterbottle', 'erbottlewat'],
    ['hello', 'llohe'],
    ['abc', 'abcd']
  ],
  code: "public static boolean isRotation(String s1, String s2) {\n    if (s1 == null || s2 == null) return false; @null\n    if (s1.length() != s2.length()) return false; @len\n    String doubled = s1 + s1; @double\n    return doubled.contains(s2); @contains\n}",
  steps: [
    'If <code>s1</code> and <code>s2</code> have different lengths, <code>s2</code> cannot be a rotation of <code>s1</code>.',
    'Imagine rotating <code>s1 = "ABCD"</code> circularly: rotations are "ABCD", "BCDA", "CDAB", "DABC".',
    'Notice what happens when we concatenate <code>s1</code> with itself: <code>s1 + s1 = "ABCDABCD"</code>.',
    'Every possible rotation of <code>s1</code> of length n is a contiguous substring of <code>s1 + s1</code>!',
    'Therefore, if <code>s1.length() == s2.length()</code>, <code>s2</code> is a rotation if and only if <code>(s1 + s1).contains(s2)</code>.',
    'This executes in O(n) time and O(n) auxiliary space using standard substring matching.'
  ],
  cmp: [
    ['Generate and test all n cyclic shifts', 'O(n\u00b2)', 'O(n)'],
    ['Concatenate (s1 + s1) and substring search', 'O(n)', 'O(n)']
  ],
  eff: 'Leveraging string concatenation reduces all rotation tests into a single substring search.',
  run({ s1, s2 }) {
    const str1 = String(s1 || '');
    const str2 = String(s2 || '');
    if (str1.length > 20 || str2.length > 20) throw new Error('Use strings of length 20 or fewer.');

    const F = [];
    F.push({
      line: 'null',
      msg: `Checking inputs: s1 = "${str1}", s2 = "${str2}".`,
      vars: { s1: `"${str1}"`, s2: `"${str2}"` },
      st: { s1: str1, s2: str2, doubled: '', matchIdx: -1, phase: 'init' }
    });

    if (str1.length !== str2.length) {
      F.push({
        line: 'len',
        msg: `Lengths do not match: s1.length (${str1.length}) \u2260 s2.length (${str2.length}). Cannot be a rotation. Return false.`,
        vars: { 's1.length': str1.length, 's2.length': str2.length, result: false },
        st: { s1: str1, s2: str2, doubled: '', matchIdx: -1, phase: 'len-mismatch' },
        result: 'false'
      });
      return F;
    }

    F.push({
      line: 'len',
      msg: `Lengths match (${str1.length} == ${str2.length}). Proceeding to concatenation check.`,
      vars: { 's1.length': str1.length, 's2.length': str2.length },
      st: { s1: str1, s2: str2, doubled: '', matchIdx: -1, phase: 'len-ok' }
    });

    const doubled = str1 + str1;
    F.push({
      line: 'double',
      msg: `doubled = s1 + s1 = "${str1}" + "${str1}" = "${doubled}". All rotations of s1 are embedded in this doubled string.`,
      vars: { doubled: `"${doubled}"` },
      st: { s1: str1, s2: str2, doubled, matchIdx: -1, phase: 'doubled' }
    });

    const matchIdx = doubled.indexOf(str2);
    if (matchIdx !== -1) {
      F.push({
        line: 'contains',
        msg: `"${str2}" is found in "${doubled}" at index ${matchIdx}! Rotating s1 by ${matchIdx} places produces s2. Return true.`,
        vars: { contains: true, rotationShift: matchIdx, result: true },
        st: { s1: str1, s2: str2, doubled, matchIdx, phase: 'matched' },
        result: 'true'
      });
    } else {
      F.push({
        line: 'contains',
        msg: `"${str2}" is NOT found in "${doubled}". It is not a valid circular rotation. Return false.`,
        vars: { contains: false, result: false },
        st: { s1: str1, s2: str2, doubled, matchIdx: -1, phase: 'not-matched' },
        result: 'false'
      });
    }

    return F;
  },
  render(st) {
    const s1Chars = st.s1.split('');
    const s2Chars = st.s2.split('');
    const dChars = st.doubled ? st.doubled.split('') : [];

    let h = block('s1', cells(s1Chars, { cls: () => 't1' }))
          + block('s2 (target rotation)', cells(s2Chars, { cls: () => st.phase === 'matched' ? 'ok' : 't2' }));

    if (st.doubled) {
      h += block(`s1 + s1 = "${st.doubled}" (highlight = match at index ${st.matchIdx})`,
        cells(dChars, {
          top: k => {
            if (st.matchIdx !== -1 && k === st.matchIdx) return [['start', 'c-ok']];
            if (st.matchIdx !== -1 && k === st.matchIdx + st.s2.length - 1) return [['end', 'c-ok']];
            return [];
          },
          cls: k => {
            if (st.matchIdx !== -1 && k >= st.matchIdx && k < st.matchIdx + st.s2.length) return 'ok';
            return 'dim';
          }
        })
      );
    }

    const statusPill = st.phase === 'matched'
      ? '<span class="tok ok">s2 is a valid rotation of s1!</span>'
      : st.phase === 'not-matched' || st.phase === 'len-mismatch'
        ? '<span class="tok bad">Not a rotation</span>'
        : '<span class="tok">Checking...</span>';

    h += block('status', `<div class="chips">${statusPill}<span class="tok">s1 len: ${st.s1.length}</span><span class="tok">s2 len: ${st.s2.length}</span>${st.matchIdx !== -1 ? `<span class="tok ok">shift offset: ${st.matchIdx}</span>` : ''}</div>`);
    return h;
  }
});
