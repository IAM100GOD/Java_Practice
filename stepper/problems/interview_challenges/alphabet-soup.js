/* 5. Alphabet Soup */
P.push({
  id: 'alphabet-soup', title: 'Alphabet Soup', level: 'easy', file: 'AlphabetSoup.java',
  statement: 'Return the characters of the string sorted in alphabetical order. <code>"coderbyte"</code> becomes <code>"bcdeeorty"</code>.',
  technique: 'Counting sort (fixed alphabet)', time: 'O(n + 128)', space: 'O(128)',
  inputs: [{ key: 's', label: 'str', def: 'coderbyte' }],
  samples: [['coderbyte'], ['hooplah'], ['mississippi']],
  code: "public static String alphabetSoup(String str) {\n    int[] count = new int[128];\n    for (char c : str.toCharArray()) {\n        count[c]++; @count\n    }\n    StringBuilder sb = new StringBuilder(str.length());\n    for (int c = 0; c < 128; c++) {\n        for (int k = 0; k < count[c]; k++) {\n            sb.append((char) c); @emit\n        }\n    }\n    return sb.toString(); @ret\n}",
  steps: [
    'Make an array of 128 counters, one for each ASCII character.',
    'Read each character once and add 1 to its counter. Nothing is compared.',
    'Go through the counters from 0 to 127. Character codes are already in alphabetical order, so the walk is too.',
    'Write each character as many times as it was counted.'
  ],
  cmp: [['Arrays.sort(chars), a comparison sort', 'O(n log n)', 'O(n)'], ['Counting sort over 128 buckets', 'O(n)', 'O(1), fixed 128 ints']],
  eff: 'Comparison sorts cannot beat n log n. Here the alphabet is tiny and fixed, so you can count instead of comparing. The 128-bucket walk costs the same no matter how long the input is.',
  run({ s }) {
    if (/[^\x00-\x7f]/.test(s)) throw new Error('Use ASCII characters only (count[] has 128 slots).');
    const F = []; const cnt = {}; let out = '';
    const keys = [...new Set(s)].sort();
    const st = (i, on, spent) => ({ a: [...s], i, keys, cnt: { ...cnt }, out, on, spent: [...spent] });
    const spent = [];
    for (let i = 0; i < s.length; i++) {
      cnt[s[i]] = (cnt[s[i]] || 0) + 1;
      F.push({ line: 'count', msg: `count['${vis(s[i])}']++ makes it ${cnt[s[i]]}.`, vars: { c: `'${s[i]}'`, [`count['${s[i]}']`]: cnt[s[i]] }, st: st(i, s[i], spent) });
    }
    for (const k of keys) {
      out += k.repeat(cnt[k]); spent.push(k);
      F.push({ line: 'emit', msg: `Bucket '${vis(k)}' (code ${k.charCodeAt(0)}) has ${cnt[k]}, so append ${cnt[k] > 1 ? `${cnt[k]} copies` : 'it once'}.`, vars: { c: k.charCodeAt(0), [`count['${k}']`]: cnt[k], sb: q(out) }, st: st(-1, k, spent) });
    }
    F.push({ line: 'ret', msg: 'Every bucket has been written out in code order. Empty buckets were skipped.', vars: { sb: q(out) }, st: st(-1, null, spent), result: q(out) });
    return F;
  },
  render(st) {
    const bk = st.keys.map(k => `<div class="bk ${st.on === k ? 'on' : ''} ${st.spent.includes(k) && st.on !== k ? 'spent' : ''}"><span class="ch">${esc(vis(k))}</span><span class="ct">${st.cnt[k] || 0}</span>${'<span class="sq"></span>'.repeat(st.cnt[k] || 0)}</div>`).join('');
    return block('str', cells(st.a, { cls: i => i === st.i ? 'cur t2' : i < st.i || st.i === -1 ? 'dim' : '', noTop: true }))
      + block(`count[ ] buckets <span style="text-transform:none;letter-spacing:0">(only non-zero shown, in code order)</span>`, `<div class="scroll"><div class="buckets">${bk}</div></div>`)
      + block('sb (output)', st.out ? cells([...st.out], { cls: () => 'ok', noTop: true }) : '<span class="empty">empty</span>');
  }
});
