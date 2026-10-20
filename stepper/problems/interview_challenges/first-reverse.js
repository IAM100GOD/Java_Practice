/* 2. First Reverse */
P.push({
  id: 'first-reverse', title: 'First Reverse', level: 'easy', file: 'FirstReverse.java',
  statement: 'Return the input string in reverse order. <code>"Hello World"</code> becomes <code>"dlroW olleH"</code>.',
  technique: 'Two pointers, swap in place', time: 'O(n)', space: 'O(n) for the char[] (Java strings are immutable)',
  inputs: [{ key: 's', label: 'str', def: 'Hello World' }],
  samples: [['Hello World'], ['coderbyte'], ['I Love Code']],
  code: "public static String firstReverse(String str) {\n    char[] chars = str.toCharArray();\n    int left = 0, right = chars.length - 1; @init\n    while (left < right) { @loop\n        char tmp = chars[left];\n        chars[left] = chars[right];\n        chars[right] = tmp; @swap\n        left++;\n        right--; @move\n    }\n    return new String(chars); @ret\n}",
  steps: [
    'Copy the string into a <code>char[]</code>, since Java strings cannot be changed.',
    'Put <code>left</code> on the first character and <code>right</code> on the last.',
    'Swap the two characters, then move both pointers one step toward the middle.',
    'Stop when the pointers meet or cross. The middle character of an odd-length string stays where it is.',
    'Build a new string from the array.'
  ],
  cmp: [['result = str.charAt(i) + result in a loop', 'O(n²)', 'O(n²) garbage'], ['Two-pointer swap on a char[]', 'O(n)', 'O(n)']],
  eff: 'Each swap fixes two characters at once, so it takes n/2 swaps. Concatenating strings in a loop copies the whole string each time, which is why it is quadratic. <code>new StringBuilder(str).reverse()</code> does the same job as this loop.',
  run({ s }) {
    const a = [...s]; let l = 0, r = a.length - 1; const F = [];
    const V = () => ({ left: l, right: r, 'chars[left]': a[l] != null ? `'${a[l]}'` : '—', 'chars[right]': a[r] != null ? `'${a[r]}'` : '—' });
    const st = (sw = null, fin = false) => ({ a: [...a], l, r, sw, fin });
    F.push({ line: 'init', msg: `left = 0 and right = ${r}, the two ends of the array.`, vars: V(), st: st() });
    while (l < r) {
      F.push({ line: 'loop', msg: `left (${l}) < right (${r}), so there is still a pair to swap.`, vars: V(), st: st() });
      const x = a[l], y = a[r]; [a[l], a[r]] = [a[r], a[l]];
      F.push({ line: 'swap', msg: `Swap '${vis(x)}' and '${vis(y)}'.`, vars: V(), st: st([l, r]) });
      l++; r--;
      F.push({ line: 'move', msg: `Move both pointers inward: left = ${l}, right = ${r}.`, vars: V(), st: st() });
    }
    F.push({ line: 'ret', msg: 'The pointers met, so every character is in place.', vars: V(), st: st(null, true), result: q(a.join('')) });
    return F;
  },
  render(st) {
    return block('chars[]', cells(st.a, {
      cls: i => st.fin || i < st.l || i > st.r ? 'ok' : st.sw && st.sw.includes(i) ? 't2' : '',
      top: i => [...(i === st.l && !st.fin ? [['left', 'c-p1']] : []), ...(i === st.r && !st.fin ? [['right', 'c-p3']] : [])]
    }));
  }
});
