/* A9. Move All Hyphens to the Front (Accenture) */
P.push({
  id: 'acc-move-hyphen', title: 'Move Hyphens to Front', level: 'easy', group: 'accenture', file: 'MoveHyphen.java', dir: 'AccentureQuestions',
  statement: 'Write <code>moveHyphen(String str, int n)</code> that moves every <code>-</code> to the beginning of the string, keeping the other characters in their original relative order. Example: "Move-Hyphens-To-Front" \u2192 "---MoveHyphensToFront".',
  technique: 'Two pointers, right to left (stable compaction)', time: 'O(n)', space: 'O(n) char array',
  inputs: [{ key: 's', label: 'str', def: 'Move-Hyp-To-Front' }],
  samples: [['Move-Hyphens-To-Front'], ['Move-Hyp-To-Front'], ['a-b-c'], ['---abc'], ['abc---']],
  code: "public static String moveHyphen(String str, int n) {\n    char[] ch = str.toCharArray();\n    int write = n - 1;                    // next slot for a non-hyphen @init\n    for (int read = n - 1; read >= 0; read--) {\n        if (ch[read] != '-') {\n            ch[write] = ch[read];         // keep it, packed to the right @copy\n            write--;\n        }\n        // hyphen: skip it, write stays put @skip\n    }\n    while (write >= 0) {\n        ch[write] = '-'; write--;         // fill the front with hyphens @fill\n    }\n    return new String(ch); @ret\n}",
  steps: [
    'Easy way: count hyphens, then build "-" \u00d7 count + all other characters. Also O(n).',
    'In-place way: we want non-hyphens packed at the <em>right</em> end, so scan from the right with two pointers.',
    '<code>read</code> visits every character; <code>write</code> marks where the next non-hyphen goes. Non-hyphens are copied to <code>write</code>; hyphens are skipped.',
    '<code>write \u2264 read</code> always, so we never overwrite a character before reading it. Scanning right to left keeps the original order.',
    'After the scan, every slot from 0 to write is filled with <code>-</code>.'
  ],
  cmp: [['Repeatedly remove & insert at front', 'O(n\u00b2)', 'O(n)'], ['Count hyphens + StringBuilder', 'O(n)', 'O(n)'], ['Two pointers right to left', 'O(n)', 'O(1) beyond the array']],
  eff: 'Both linear approaches touch each character a constant number of times. The two-pointer version is the standard in-place pattern (same as \u201cmove zeros to the end\u201d, mirrored).',
  run({ s }) {
    const n = s.length; if (!n) throw new Error('Enter a string.'); if (n > 24) throw new Error('Use 24 characters or fewer.');
    const ch = [...s]; const F = []; let write = n - 1, read = n - 1, phase = 'scan';
    const st = () => ({ ch: [...ch], read, write, phase, n });
    F.push({ line: 'init', msg: `write starts at the last index, ${write}.`, vars: { n, write }, st: st() });
    for (read = n - 1; read >= 0; read--) {
      if (ch[read] !== '-') {
        const c = ch[read]; const w = write; ch[write] = c; write--;
        F.push({ line: 'copy', msg: `ch[${read}] = '${c}' is not a hyphen. Copy it to slot ${w}${w === read ? ' (same slot)' : ''}; write = ${write}.`, vars: { read, write, 'ch[read]': c }, st: { ...st(), read, write: w } });
      } else F.push({ line: 'skip', msg: `ch[${read}] is '-'. Skip it; write stays at ${write}.`, vars: { read, write }, st: st() });
    }
    read = -1; phase = 'fill';
    while (write >= 0) { ch[write] = '-'; F.push({ line: 'fill', msg: `ch[${write}] = '-'.`, vars: { write }, st: st() }); write--; }
    phase = 'done';
    F.push({ line: 'ret', msg: `Result: "${ch.join('')}".`, vars: { result: ch.join('') }, st: st(), result: ch.join('') });
    return F;
  },
  render(st) {
    const grid = cells(st.ch, { top: k => [...(k === st.read ? [['r', 'c-acc']] : []), ...(k === st.write && st.phase !== 'done' ? [['w', 'c-p2']] : [])], cls: k => st.phase === 'done' ? (st.ch[k] === '-' ? 't2' : 'ok') : st.phase === 'fill' && k >= st.write && st.ch[k] === '-' ? 't2' : k > st.write ? 'ok' : k === st.read ? 'cur t1' : st.ch[k] === '-' ? 't2' : '' });
    return block('characters (green = final non-hyphen part, r = read, w = write)', grid);
  }
});
