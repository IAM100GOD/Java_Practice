/* 11. Min Window Substring */
P.push({
  id: 'min-window', title: 'Min Window Substring', level: 'hard', file: 'MinWindowSubstring.java',
  statement: 'Given strings <code>s</code> and <code>t</code>, find the shortest substring of <code>s</code> that contains every character of <code>t</code>, including repeats.',
  technique: 'Sliding window + frequency table', time: 'O(n + m)', space: 'O(128)',
  inputs: [{ key: 's', label: 'strArr[0] (s)', def: 'ahffaksfajeeubsne' }, { key: 't', label: 'strArr[1] (t)', def: 'jefaa' }],
  samples: [['ahffaksfajeeubsne', 'jefaa'], ['aaffhkksemckelloe', 'fhea'], ['ADOBECODEBANC', 'ABC']],
  code: "public static String minWindow(String s, String t) {\n    int[] need = new int[128];\n    for (char c : t.toCharArray()) need[c]++;\n\n    int missing = t.length();\n    int left = 0, bestStart = 0, bestLen = Integer.MAX_VALUE; @init\n\n    for (int right = 0; right < s.length(); right++) {\n        char r = s.charAt(right);\n        if (need[r] > 0) missing--;     // this char was still needed\n        need[r]--; @grow\n\n        while (missing == 0) {          // window [left..right] is valid\n            if (right - left + 1 < bestLen) {\n                bestLen = right - left + 1;\n                bestStart = left; @best\n            }\n            char l = s.charAt(left);\n            need[l]++;\n            if (need[l] > 0) missing++; // removed a required char, window breaks\n            left++; @shrink\n        }\n    }\n    return bestLen == Integer.MAX_VALUE ? \"\" : s.substring(bestStart, bestStart + bestLen); @ret\n}",
  steps: [
    '<code>need[c]</code> = how many more copies of c the window still needs. A negative value means the window has spare copies. <code>missing</code> = the total number of characters still needed.',
    'Move <code>right</code> forward to grow the window. If the new character was still needed (<code>need &gt; 0</code>), <code>missing</code> drops by one.',
    'When <code>missing == 0</code>, the window contains all of t. Record it if it is the shortest so far.',
    'Then shrink from <code>left</code>. Removing a spare character keeps the window valid. Removing a needed one makes <code>missing</code> 1 again, and you go back to growing.',
    'Each index joins the window once (through right) and leaves once (through left).'
  ],
  cmp: [['Check every substring s[i..j]', 'O(n² · m) or O(n³)', 'O(m)'], ['Sliding window with need[] and missing', 'O(n + m)', 'O(1), 128 ints']],
  eff: 'The <code>missing</code> counter is the important trick. Without it, you would compare the whole frequency table on every step to check whether the window is valid. With it, that check is a single <code>== 0</code>. Both pointers only move forward, so the total work is linear.',
  run({ s, t }) {
    if (!t) throw new Error('t cannot be empty.');
    const F = []; const need = {}; for (const c of t) need[c] = (need[c] || 0) + 1;
    const keys = [...new Set(t)]; const needAll = c => need[c] || 0;
    let missing = t.length, left = 0, bs = 0, bl = Infinity, right = -1;
    const st = (ev = null) => ({ a: [...s], left, right, need: Object.fromEntries(keys.map(k => [k, needAll(k)])), missing, bs, bl: bl === Infinity ? 0 : bl, ev, extra: right >= 0 && !keys.includes(s[right]) ? s[right] : null });
    const V = () => ({ left, right, missing, best: bl === Infinity ? '—' : q(s.substr(bs, bl)) });
    F.push({ line: 'init', msg: `need[] is built from "${t}". ${t.length} characters are missing and the window is empty.`, vars: V(), st: st() });
    for (right = 0; right < s.length; right++) {
      const r = s[right]; const was = needAll(r); if (was > 0) missing--; need[r] = was - 1;
      F.push({ line: 'grow', msg: was > 0 ? `Add '${r}'. It was still needed, so missing drops to ${missing}.` : keys.includes(r) ? `Add '${r}'. There are already enough '${r}', so it is a spare copy (need = ${need[r]}).` : `Add '${r}'. It is not in t, so missing stays ${missing}.`, vars: V(), st: st('grow') });
      while (missing === 0) {
        const len = right - left + 1; let better = false;
        if (len < bl) { bl = len; bs = left; better = true; }
        F.push({ line: 'best', msg: `missing == 0, so "${s.slice(left, right + 1)}" contains all of t (length ${len}). ${better ? 'It is the shortest so far.' : `The best so far (${bl}) is shorter, so keep that one.`}`, vars: V(), st: st('best') });
        const l = s[left]; need[l] = needAll(l) + 1; if (need[l] > 0) missing++;
        left++;
        F.push({ line: 'shrink', msg: need[l] > 0 && keys.includes(l) ? `Remove '${l}' from the left. It was needed, so the window is no longer valid (missing = ${missing}). Grow again.` : `Remove '${l}' from the left. ${keys.includes(l) ? 'It was a spare copy' : 'It is not in t'}, so the window is still valid. Keep shrinking.`, vars: V(), st: st('shrink') });
      }
    }
    right = s.length - 1;
    F.push({ line: 'ret', msg: bl === Infinity ? 'No window ever contained all of t.' : `right has reached the end of s. The shortest window is "${s.substr(bs, bl)}".`, vars: V(), st: st(), result: bl === Infinity ? '""' : q(s.substr(bs, bl)), bad: bl === Infinity });
    return F;
  },
  render(st) {
    const grid = cells(st.a, {
      cls: i => [i >= st.left && i <= st.right ? 'win' : '', st.bl && i >= st.bs && i < st.bs + st.bl ? 'best' : '', i === st.right && st.ev === 'grow' ? 'cur' : ''].join(' '),
      top: i => [...(i === st.left ? [['L', 'c-p1']] : []), ...(i === st.right ? [['R', 'c-p3']] : [])]
    });
    const need = `<div class="need">${Object.entries(st.need).map(([k, v]) => `<div class="${v > 0 ? 'short' : 'full'}"><span>${esc(k)}</span><b>${v}</b></div>`).join('')}</div>`;
    return block('s. Tinted = current window; green underline = best so far', grid)
      + `<div class="row2">${block('need[c] (red = still short)', need)}${block('missing', `<span class="big ${st.missing ? 'c-bad' : 'c-ok'}">${st.missing}</span>`)}${block('best', st.bl ? `<span class="tok ok">${esc(st.a.slice(st.bs, st.bs + st.bl).join(''))}</span>` : '<span class="empty">none yet</span>')}</div>`;
  }
});
