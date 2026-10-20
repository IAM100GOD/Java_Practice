/* 4. Palindrome */
P.push({
  id: 'palindrome', title: 'Palindrome', level: 'easy', file: 'Palindrome.java',
  statement: 'Return <code>true</code> if the string reads the same forwards and backwards, ignoring case, spaces and punctuation.',
  technique: 'Two pointers that skip non-alphanumerics', time: 'O(n)', space: 'O(1)',
  inputs: [{ key: 's', label: 's', def: 'A man, a plan, a canal: Panama' }],
  samples: [['A man, a plan, a canal: Panama'], ['never odd or even'], ['race a car']],
  code: "public static boolean isPalindrome(String s) {\n    int left = 0, right = s.length() - 1; @init\n    while (left < right) {\n        while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++; @skipL\n        while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--; @skipR\n        if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) { @cmp\n            return false; @fail\n        }\n        left++;\n        right--; @move\n    }\n    return true; @ret\n}",
  steps: [
    'Put <code>left</code> at the start and <code>right</code> at the end of the original string.',
    'Move <code>left</code> forward past anything that is not a letter or digit. Do the same for <code>right</code>, moving backward.',
    'Compare the two characters in lowercase. If they differ, it is not a palindrome.',
    'If they match, move both pointers inward and repeat until they meet.'
  ],
  cmp: [['Build a cleaned lowercase copy, then reverse and compare', 'O(n)', 'O(n)'], ['Two pointers on the original string', 'O(n)', 'O(1)']],
  eff: 'Both approaches are linear, but the two-pointer version never allocates a cleaned copy or a reversed copy, and it stops at the first mismatch instead of building everything first.',
  run({ s }) {
    const F = []; let l = 0, r = s.length - 1; const okSet = [], skip = []; const al = c => /[a-z0-9]/i.test(c);
    const V = () => ({ left: l, right: r, 's[left]': s[l] != null ? `'${s[l]}'` : '—', 's[right]': s[r] != null ? `'${s[r]}'` : '—' });
    const st = (bad = null) => ({ a: [...s], l, r, ok: [...okSet], skip: [...skip], bad });
    F.push({ line: 'init', msg: 'Pointers start at both ends of the original string. No cleaned copy is made.', vars: V(), st: st() });
    while (l < r) {
      while (l < r && !al(s[l])) { skip.push(l); F.push({ line: 'skipL', msg: `'${vis(s[l])}' is not a letter or digit. Move left past it.`, vars: V(), st: st() }); l++; }
      while (l < r && !al(s[r])) { skip.push(r); F.push({ line: 'skipR', msg: `'${vis(s[r])}' is not a letter or digit. Move right past it.`, vars: V(), st: st() }); r--; }
      if (s[l].toLowerCase() !== s[r].toLowerCase()) { F.push({ line: 'fail', msg: `'${s[l]}' and '${s[r]}' differ, so this is not a palindrome.`, vars: V(), st: st([l, r]), result: 'false', bad: true }); return F; }
      okSet.push(l, r);
      F.push({ line: 'cmp', msg: l === r ? 'Both pointers are on the same character.' : `'${s[l]}' and '${s[r]}' match (ignoring case). Move both inward.`, vars: V(), st: st() });
      l++; r--;
    }
    F.push({ line: 'ret', msg: 'The pointers met without a mismatch.', vars: V(), st: st(), result: 'true' });
    return F;
  },
  render(st) {
    return block('s', cells(st.a, {
      cls: i => st.bad && st.bad.includes(i) ? 'bad' : st.ok.includes(i) ? 'ok' : st.skip.includes(i) ? 'dim' : '',
      top: i => [...(i === st.l ? [['L', 'c-p1']] : []), ...(i === st.r ? [['R', 'c-p3']] : [])]
    })) + `<div class="chips"><span class="tok ok">match</span><span class="tok">skipped (dashed)</span><span class="tok bad">mismatch</span></div>`;
  }
});
