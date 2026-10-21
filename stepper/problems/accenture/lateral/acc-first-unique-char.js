/* A19. First Unique / Non-Repeating Character (Accenture Lateral) */
P.push({
  id: 'acc-first-unique-char',
  title: 'First Unique Character in String',
  level: 'easy',
  group: 'accenture',
  file: 'FirstNonRepeatingChar.java',
  dir: 'accenture/lateral',
  statement: 'Given a string <code>s</code>, find the first non-repeating character and return its index. If none exists, return \u22121. Lateral interviewers frequently ask for both an O(n) array pass and a Java 8 Streams one-liner. Example: "accenture" \u2192 \'a\' at index 0.',
  technique: 'Two-pass frequency counting: O(n) time, O(1) space',
  time: 'O(n)',
  space: 'O(1) (ASCII 256 array)',
  inputs: [
    { key: 's', label: 's', def: 'accenture' }
  ],
  samples: [
    ['accenture'],
    ['aabbcc'],
    ['loveaccenture'],
    ['leetcode'],
    ['z']
  ],
  code: "public static int firstUniqCharIndex(String s) {\n    int[] freq = new int[256]; @init\n    for (int i = 0; i < s.length(); i++) {\n        freq[s.charAt(i)]++; @count\n    }\n    for (int i = 0; i < s.length(); i++) {\n        if (freq[s.charAt(i)] == 1) return i; @found\n    }\n    return -1; @none\n}",
  steps: [
    'A brute-force comparison of each character against all others takes O(n\u00b2) time.',
    '<strong>Pass 1:</strong> Count frequencies of each character using a frequency table (or LinkedHashMap).',
    '<strong>Pass 2:</strong> Scan the string from left to right. The first character whose frequency is 1 is our answer!',
    'Java 8 Stream variant: <code>s.chars().mapToObj(c -> (char)c).collect(groupingBy(identity(), LinkedHashMap::new, counting())).entrySet().stream().filter(e -> e.getValue() == 1L).map(Map.Entry::getKey).findFirst().orElse(\'_\')</code>.'
  ],
  cmp: [
    ['Nested loops checking all pairs', 'O(n\u00b2)', 'O(1)'],
    ['Two-pass frequency array', 'O(n)', 'O(1)'],
    ['Java 8 Streams (LinkedHashMap)', 'O(n)', 'O(k) where k \u2264 256']
  ],
  eff: 'Two linear scans over the string and a fixed 256-element frequency table yield an optimal O(n) runtime.',
  run({ s }) {
    const str = String(s ?? '');
    const n = str.length;
    if (n > 25) throw new Error('Use string of length 25 or fewer for visualizer.');

    const F = [];
    if (!n) {
      F.push({
        line: 'none',
        msg: 'Empty string: return -1.',
        vars: { result: -1 },
        st: { s: '', i: -1, freq: {}, phase: 'none' },
        result: '-1'
      });
      return F;
    }

    const freq = {};
    F.push({
      line: 'init',
      msg: 'Initialize frequency table.',
      vars: { length: n },
      st: { s: str, i: -1, freq: { ...freq }, phase: 'init' }
    });

    // Pass 1: count frequencies
    for (let i = 0; i < n; i++) {
      const c = str[i];
      freq[c] = (freq[c] || 0) + 1;
      F.push({
        line: 'count',
        msg: `Pass 1 (Counting): char '${c}' at index ${i} \u2192 freq['${c}'] = ${freq[c]}.`,
        vars: { i, c: `'${c}'`, count: freq[c] },
        st: { s: str, i, freq: { ...freq }, phase: 'count' }
      });
    }

    // Pass 2: find first unique
    for (let i = 0; i < n; i++) {
      const c = str[i];
      const count = freq[c];
      if (count === 1) {
        F.push({
          line: 'found',
          msg: `Pass 2 (Lookup): char '${c}' at index ${i} has freq == 1! First non-repeating character found. Return ${i}.`,
          vars: { i, c: `'${c}'`, result: i },
          st: { s: str, i, freq: { ...freq }, phase: 'found' },
          result: String(i)
        });
        return F;
      } else {
        F.push({
          line: 'count',
          msg: `Pass 2 (Lookup): char '${c}' at index ${i} has freq = ${count} (\u2260 1). Skip.`,
          vars: { i, c: `'${c}'`, count },
          st: { s: str, i, freq: { ...freq }, phase: 'lookup' }
        });
      }
    }

    F.push({
      line: 'none',
      msg: 'All characters in the string have duplicates. Return -1.',
      vars: { result: -1 },
      st: { s: str, i: -1, freq: { ...freq }, phase: 'none' },
      result: '-1'
    });
    return F;
  },
  render(st) {
    const chars = st.s ? st.s.split('') : [];
    let h = block('string characters',
      cells(chars, {
        top: k => k === st.i ? [[st.phase === 'found' ? 'first!' : 'i', st.phase === 'found' ? 'c-ok' : 'c-acc']] : [],
        cls: k => st.phase === 'found' && k === st.i ? 'ok' : k === st.i ? 'cur t1' : (st.freq[chars[k]] === 1 ? 't2' : 'dim')
      })
    );

    const freqChips = Object.entries(st.freq).map(([ch, cnt]) =>
      `<span class="tok ${cnt === 1 ? 'ok' : ''}">${esc(ch)}: ${cnt}</span>`
    ).join('');

    h += block('frequencies', `<div class="chips">${freqChips || '<span class="empty">empty</span>'}</div>`);
    return h;
  }
});
