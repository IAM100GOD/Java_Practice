/* A11. Max Vowels in Substring of Length k (Accenture) */
P.push({
  id: 'acc-max-vowels', title: 'Max Vowels in Substring', level: 'medium', group: 'accenture', file: 'MaxVowelsSubstring.java', dir: 'AccentureQuestions',
  statement: 'Given a string <code>s</code> and an integer <code>k</code>, return the maximum number of vowels (a, e, i, o, u) in any contiguous substring of length k. Example: s = "abciiidef", k = 3 \u2192 3 ("iii").',
  technique: 'Fixed-size sliding window', time: 'O(n)', space: 'O(1)',
  inputs: [{ key: 's', label: 's', def: 'abciiidef' }, { key: 'k', label: 'k', def: '3', narrow: true }],
  samples: [['abciiidef', '3'], ['aeiou', '2'], ['leetcode', '3'], ['rhythms', '4'], ['tryhard', '4']],
  code: "public static int maxVowels(String s, int k) {\n    int n = s.length(), count = 0;\n    for (int i = 0; i < k; i++)\n        if (isVowel(s.charAt(i))) count++;   // first window @first\n    int best = count; @best0\n    for (int i = k; i < n; i++) {\n        if (isVowel(s.charAt(i))) count++;      // char entering @in\n        if (isVowel(s.charAt(i - k))) count--;  // char leaving @out\n        best = Math.max(best, count); @max\n    }\n    return best; @ret\n}",
  steps: [
    'Brute force recounts every window of length k: O(n\u00b7k).',
    'Neighbouring windows share k\u22121 characters. Sliding right by one only <em>adds</em> s[i] and <em>removes</em> s[i\u2212k].',
    'So count the vowels in the first window once, then update the count with +1/\u22121 as the window slides.',
    'Track the best count seen. You can stop early if best reaches k, since no window can have more than k vowels.'
  ],
  cmp: [['Recount every window', 'O(n\u00b7k)', 'O(1)'], ['Prefix sums of vowel counts', 'O(n)', 'O(n)'], ['Sliding window', 'O(n)', 'O(1)']],
  eff: 'Each character enters the window once and leaves once, so the work is linear and needs only a counter.',
  run({ s, k }) {
    s = s.trim(); const n = s.length; const K = parseInt(k, 10);
    if (!n) throw new Error('Enter a string.'); if (!(K >= 1) || K > n) throw new Error(`k must be between 1 and ${n}.`); if (n > 24) throw new Error('Use 24 characters or fewer.');
    const isV = c => 'aeiouAEIOU'.includes(c); const ch = [...s]; const F = [];
    let count = 0, best = 0, L = 0, R = K - 1, bL = 0, inI = -1, outI = -1;
    const st = () => ({ ch, L, R, bL, K, inI, outI });
    for (let i = 0; i < K; i++) if (isV(ch[i])) count++;
    F.push({ line: 'first', msg: `First window "${ch.slice(0, K).join('')}" (0..${K - 1}) has ${count} vowel(s).`, vars: { count }, st: st() });
    best = count;
    F.push({ line: 'best0', msg: `best = ${best}.`, vars: { count, best }, st: st() });
    for (let i = K; i < n; i++) {
      L = i - K + 1; R = i; inI = i; outI = i - K;
      const a = isV(ch[i]), b = isV(ch[i - K]);
      if (a) count++;
      F.push({ line: 'in', msg: `'${ch[i]}' enters${a ? ` and is a vowel: count = ${count}` : ' (not a vowel)'}.`, vars: { i, count, best }, st: st() });
      if (b) count--;
      F.push({ line: 'out', msg: `'${ch[i - K]}' leaves${b ? ` and was a vowel: count = ${count}` : ' (not a vowel)'}.`, vars: { i, count, best }, st: st() });
      if (count > best) { best = count; bL = L; }
      F.push({ line: 'max', msg: `Window "${ch.slice(L, R + 1).join('')}" has ${count}. best = ${best}.`, vars: { i, count, best }, st: st() });
    }
    inI = outI = -1;
    F.push({ line: 'ret', msg: `Best window: "${ch.slice(bL, bL + K).join('')}" with ${best} vowel(s).`, vars: { result: best }, st: { ...st(), L: bL, R: bL + K - 1 }, result: String(best) });
    return F;
  },
  render(st) {
    const isV = c => 'aeiouAEIOU'.includes(c);
    const grid = cells(st.ch, { top: k => [...(k === st.L ? [['L', 'c-acc']] : []), ...(k === st.R ? [['R', 'c-acc']] : [])], bot: k => k === st.outI ? [['out', 'c-bad']] : k === st.inI ? [['in', 'c-ok']] : [], cls: k => k >= st.L && k <= st.R ? (isV(st.ch[k]) ? 'ok' : 't1') : k === st.outI ? 'dim' : isV(st.ch[k]) ? 't2' : '' });
    return block(`window of length ${st.K} (green = vowel inside window)`, grid) + block('best window so far', tokens([st.ch.slice(st.bL, st.bL + st.K).join('')], () => 'ok'));
  }
});
