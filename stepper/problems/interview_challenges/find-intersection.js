/* 3. Find Intersection */
P.push({
  id: 'find-intersection', title: 'Find Intersection', level: 'easy', file: 'FindIntersection.java',
  statement: 'Given two strings of sorted, comma-separated numbers, return the numbers found in both, comma-separated. Return <code>"false"</code> if there are none.',
  technique: 'Two pointers on sorted lists (merge step)', time: 'O(n + m)', space: 'O(1) besides the output',
  inputs: [{ key: 'a', label: 'strArr[0]', def: '1, 3, 4, 7, 13' }, { key: 'b', label: 'strArr[1]', def: '1, 2, 4, 13, 15' }],
  samples: [['1, 3, 4, 7, 13', '1, 2, 4, 13, 15'], ['1, 3, 9, 10, 17, 18', '1, 4, 9, 10'], ['2, 4', '1, 3']],
  code: "public static String findIntersection(String[] strArr) {\n    String[] a = strArr[0].split(\",\\\\s*\");\n    String[] b = strArr[1].split(\",\\\\s*\");\n    int i = 0, j = 0; @init\n    StringBuilder result = new StringBuilder();\n\n    while (i < a.length && j < b.length) {\n        int x = Integer.parseInt(a[i]);\n        int y = Integer.parseInt(b[j]); @read\n        if (x == y) {\n            if (result.length() > 0) result.append(',');\n            result.append(x);\n            i++;\n            j++; @eq\n        } else if (x < y) {\n            i++;             // x can't appear later in b, skip it @lt\n        } else {\n            j++;             // y can't appear later in a, skip it @gt\n        }\n    }\n    return result.length() == 0 ? \"false\" : result.toString(); @ret\n}",
  steps: [
    'Split both strings into number arrays. They are already sorted.',
    'Start pointer <code>i</code> at the beginning of A and <code>j</code> at the beginning of B.',
    'If <code>A[i] == B[j]</code>, the number is in both lists: add it and move both pointers.',
    'If <code>A[i] &lt; B[j]</code>, A[i] cannot appear later in B because B only gets bigger, so move <code>i</code>. Otherwise move <code>j</code>.',
    'Stop when either list runs out. Return the matches, or <code>"false"</code>.'
  ],
  cmp: [['For each number in A, scan all of B', 'O(n·m)', 'O(1)'], ['Put A in a HashSet, look up each of B', 'O(n + m)', 'O(n)'], ['Two pointers (uses the sorted order)', 'O(n + m)', 'O(1)']],
  eff: 'The sorted order is the key. Each comparison permanently throws away at least one number, so there are at most n + m comparisons and no extra memory is needed.',
  parse({ a, b }) {
    const p = s => s.split(/,\s*/).filter(x => x.trim() !== '').map(x => { const n = Number(x.trim()); if (!Number.isInteger(n)) throw new Error(`"${x}" is not a whole number.`); return n; });
    return { A: p(a), B: p(b) };
  },
  run(inp) {
    const { A, B } = this.parse(inp); const F = []; let i = 0, j = 0; const res = [], mA = [], mB = [];
    const V = () => ({ i, j, x: A[i] ?? '—', y: B[j] ?? '—', result: q(res.join(',')) });
    const st = (hot = null) => ({ A, B, i, j, mA: [...mA], mB: [...mB], res: [...res], hot });
    F.push({ line: 'init', msg: 'Both pointers start at index 0.', vars: V(), st: st() });
    while (i < A.length && j < B.length) {
      const x = A[i], y = B[j];
      if (x === y) { res.push(x); mA.push(i); mB.push(j); F.push({ line: 'eq', msg: `${x} == ${y}. It is in both lists, so add it and move both pointers.`, vars: V(), st: st('eq') }); i++; j++; }
      else if (x < y) { F.push({ line: 'lt', msg: `${x} < ${y}. Everything after ${y} in B is bigger, so ${x} cannot match. Move i.`, vars: V(), st: st('lt') }); i++; }
      else { F.push({ line: 'gt', msg: `${x} > ${y}. ${y} cannot match anything later in A. Move j.`, vars: V(), st: st('gt') }); j++; }
    }
    F.push({ line: 'ret', msg: `${i >= A.length ? 'A' : 'B'} ran out, so nothing else can match.`, vars: V(), st: st(), result: res.length ? q(res.join(',')) : '"false"', bad: !res.length });
    return F;
  },
  render(st) {
    const row = (arr, p, m, name, col) => cells(arr, {
      wide: true,
      cls: k => m.includes(k) ? 'ok' : k < p ? 'dim' : k === p ? 'cur' : '',
      top: k => k === p ? [[name, col]] : []
    });
    return block('A', row(st.A, st.i, st.mA, 'i', 'c-p1')) + block('B', row(st.B, st.j, st.mB, 'j', 'c-p3')) + block('result', tokens(st.res.map(String), () => 'ok'));
  }
});
