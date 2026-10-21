/* A17. Longest Substring Without Repeating Characters (Accenture Lateral) */
P.push({
  id: 'acc-longest-unique-sub',
  title: 'Longest Substring Without Repeating Characters',
  level: 'medium',
  group: 'accenture',
  file: 'LongestSubstringWithoutRepeating.java',
  dir: 'accenture/lateral',
  statement: 'Given a string <code>s</code>, find the length of the longest substring without duplicate characters. Commonly asked in Accenture lateral assessments and Zoom technical rounds. Example: s = "abcabcbb" \u2192 "abc" of length 3.',
  technique: 'Sliding window [left..right] with last-seen character index map',
  time: 'O(n)',
  space: 'O(min(m, n))',
  inputs: [
    { key: 's', label: 's', def: 'abcabcbb' }
  ],
  samples: [
    ['abcabcbb'],
    ['bbbbb'],
    ['pwwkew'],
    ['dvdf'],
    ['abba'],
    ['']
  ],
  code: "public static int lengthOfLongestSubstring(String s) {\n    if (s == null || s.isEmpty()) return 0; @empty\n    Map<Character, Integer> lastSeen = new HashMap<>(); @init\n    int maxLen = 0, left = 0;\n    for (int right = 0; right < s.length(); right++) {\n        char c = s.charAt(right); @char\n        if (lastSeen.containsKey(c)) {\n            left = Math.max(left, lastSeen.get(c) + 1); @shift\n        }\n        lastSeen.put(c, right); @put\n        maxLen = Math.max(maxLen, right - left + 1); @max\n    }\n    return maxLen; @ret\n}",
  steps: [
    'Brute force checks all substrings for duplicate characters, which takes O(n\u00b3) or O(n\u00b2) time.',
    'Instead, use a <strong>sliding window</strong> [left..right] representing a valid substring without duplicates.',
    'Maintain a <code>lastSeen</code> map storing each character and its most recent index.',
    'As the <code>right</code> pointer expands the window, if character <code>c</code> was already seen inside [left..right], jump <code>left</code> to <code>lastSeen.get(c) + 1</code>.',
    'Update <code>lastSeen.put(c, right)</code> and track the maximum window length <code>maxLen = max(maxLen, right - left + 1)</code>.',
    'Both pointers only move forward, achieving optimal O(n) linear time.'
  ],
  cmp: [
    ['Check all substrings with Set', 'O(n\u00b2)', 'O(n)'],
    ['Sliding window with Set (step-by-step shrink)', 'O(2n)', 'O(min(m, n))'],
    ['Optimized sliding window with lastSeen map', 'O(n)', 'O(min(m, n))']
  ],
  eff: 'Storing the previous index of each character lets left jump directly past duplicates instead of shrinking one cell at a time.',
  run({ s }) {
    const str = String(s ?? '');
    const n = str.length;
    if (n > 25) throw new Error('Use string of length 25 or fewer for visualizer.');

    const F = [];
    if (!n) {
      F.push({
        line: 'empty',
        msg: 'String is empty. Longest non-repeating substring length is 0.',
        vars: { length: 0, result: 0 },
        st: { s: '', left: 0, right: -1, maxLen: 0, map: {}, curC: '' },
        result: '0'
      });
      return F;
    }

    const lastSeen = {};
    let maxLen = 0, left = 0;

    F.push({
      line: 'init',
      msg: `Starting sliding window: left = 0, maxLen = 0, lastSeen = {}.`,
      vars: { left, maxLen },
      st: { s: str, left, right: -1, maxLen, map: { ...lastSeen }, curC: '' }
    });

    for (let right = 0; right < n; right++) {
      const c = str[right];
      F.push({
        line: 'char',
        msg: `right = ${right}, char = '${c}'. Check if '${c}' has occurred in the current window [${left}..${right}].`,
        vars: { right, c: `'${c}'`, left, maxLen },
        st: { s: str, left, right, maxLen, map: { ...lastSeen }, curC: c }
      });

      if (c in lastSeen) {
        const prevIdx = lastSeen[c];
        if (prevIdx >= left) {
          left = prevIdx + 1;
          F.push({
            line: 'shift',
            msg: `'${c}' was previously at index ${prevIdx} (\u2265 left ${left - 1}). Shift left pointer to ${prevIdx + 1}.`,
            vars: { c: `'${c}'`, prevIdx, newLeft: left },
            st: { s: str, left, right, maxLen, map: { ...lastSeen }, curC: c }
          });
        }
      }

      lastSeen[c] = right;
      F.push({
        line: 'put',
        msg: `Record lastSeen['${c}'] = ${right}.`,
        vars: { c: `'${c}'`, index: right },
        st: { s: str, left, right, maxLen, map: { ...lastSeen }, curC: c }
      });

      const curLen = right - left + 1;
      const updated = curLen > maxLen;
      maxLen = Math.max(maxLen, curLen);

      F.push({
        line: 'max',
        msg: `Current window "${str.slice(left, right + 1)}" length = ${curLen}. maxLen = ${maxLen}${updated ? ' (new maximum!)' : ''}.`,
        vars: { left, right, curLen, maxLen },
        st: { s: str, left, right, maxLen, map: { ...lastSeen }, curC: c }
      });
    }

    F.push({
      line: 'ret',
      msg: `Finished scanning string. Longest substring without repeating characters has length ${maxLen}.`,
      vars: { maxLen, result: maxLen },
      st: { s: str, left, right: n - 1, maxLen, map: { ...lastSeen }, curC: '' },
      result: String(maxLen)
    });

    return F;
  },
  render(st) {
    const chars = st.s ? st.s.split('') : [];
    const windowStr = st.right >= st.left && st.right >= 0 ? st.s.slice(st.left, st.right + 1) : '';

    let h = block('characters (highlight = current sliding window [left..right])',
      cells(chars, {
        top: k => {
          if (k === st.left && k === st.right) return [['L/R', 'c-ok']];
          if (k === st.left) return [['L', 'c-p2']];
          if (k === st.right) return [['R', 'c-acc']];
          return [];
        },
        cls: k => {
          if (k >= st.left && k <= st.right) return 'ok';
          return 'dim';
        }
      })
    );

    const mapTokens = Object.keys(st.map).length
      ? Object.entries(st.map).map(([ch, idx]) => `<span class="tok ${ch === st.curC ? 'cur t1' : ''}">'${ch}' \u2192 idx ${idx}</span>`).join('')
      : '<span class="empty">empty</span>';

    h += block('sliding window status',
      `<div class="chips"><span class="tok ok">current window: "${esc(windowStr)}" (len: ${windowStr.length})</span><span class="tok cur t1">maxLen so far: ${st.maxLen}</span><span class="tok">L: ${st.left}</span><span class="tok">R: ${st.right >= 0 ? st.right : '-'}</span></div>`
    );

    h += block('lastSeen HashMap (char \u2192 last index)', `<div class="chips">${mapTokens}</div>`);
    return h;
  }
});
