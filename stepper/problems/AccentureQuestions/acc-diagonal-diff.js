/* A13. Matrix Diagonal Difference (Accenture) */
P.push({
  id: 'acc-diagonal-diff', title: 'Matrix Diagonal Difference', level: 'easy', group: 'accenture', file: 'DiagonalDifference.java', dir: 'AccentureQuestions',
  statement: 'Given a square matrix of size N \u00d7 N, calculate the absolute difference between the sums of its diagonals (primary diagonal and secondary diagonal). Sample Test Case: [[11, 2, 4], [4, 5, 6], [10, 8, \u221212]] \u2192 Primary: 11 + 5 + (\u221212) = 4, Secondary: 4 + 5 + 10 = 19 \u2192 |4 \u2212 19| = 15.',
  technique: 'Single loop: [i][i] and [i][n\u22121\u2212i]', time: 'O(N)', space: 'O(1)',
  inputs: [{ key: 'm', label: 'matrix (one row per line or ; separated)', def: '11, 2, 4; 4, 5, 6; 10, 8, -12' }],
  samples: [['11, 2, 4; 4, 5, 6; 10, 8, -12'], ['1, 2; 3, 4'], ['1, 2, 3, 4; 5, 6, 7, 8; 9, 10, 11, 12; 13, 14, 15, 16'], ['7']],
  code: "public static int diagonalDifference(int[][] mat) {\n    int n = mat.length, primary = 0, secondary = 0; @init\n    for (int i = 0; i < n; i++) {\n        primary   += mat[i][i];          // top-left -> bottom-right @p\n        secondary += mat[i][n - 1 - i];  // top-right -> bottom-left @s\n    }\n    return Math.abs(primary - secondary); @ret\n}",
  steps: [
    'Primary diagonal cells have <code>row == col</code>: [0][0], [1][1], \u2026',
    'Secondary diagonal cells have <code>row + col == n \u2212 1</code>: [0][n\u22121], [1][n\u22122], \u2026',
    'So one loop over i reaches both: <code>mat[i][i]</code> and <code>mat[i][n\u22121\u2212i]</code>. No need to scan all N\u00b2 cells.',
    'For odd N the centre cell is on both diagonals; it is added to both sums, which is correct here.',
    'Return <code>Math.abs(primary \u2212 secondary)</code>.'
  ],
  cmp: [['Scan all cells, test i==j / i+j==n\u22121', 'O(N\u00b2)', 'O(1)'], ['One loop over i', 'O(N)', 'O(1)']],
  eff: 'Only 2N cells matter, so visiting just those is enough. (Reading the input is still O(N\u00b2).)',
  run({ m }) {
    const rows = m.split(/[;\n]+/).map(r => r.split(/[,\s]+/).filter(Boolean).map(Number)).filter(r => r.length);
    const n = rows.length;
    if (!n || rows.some(r => r.length !== n || r.some(x => !Number.isFinite(x)))) throw new Error('Enter a square matrix: N rows of N numbers each.');
    if (n > 8) throw new Error('Use N \u2264 8.');
    const F = []; let p = 0, s = 0, i = -1;
    const st = () => ({ M: rows, n, i });
    F.push({ line: 'init', msg: `n = ${n}. Both sums start at 0.`, vars: { n, primary: p, secondary: s }, st: st() });
    for (i = 0; i < n; i++) {
      p += rows[i][i];
      F.push({ line: 'p', msg: `primary += mat[${i}][${i}] = ${rows[i][i]} \u2192 ${p}.`, vars: { i, primary: p, secondary: s }, st: { ...st(), cur: [i, i] } });
      s += rows[i][n - 1 - i];
      F.push({ line: 's', msg: `secondary += mat[${i}][${n - 1 - i}] = ${rows[i][n - 1 - i]} \u2192 ${s}.`, vars: { i, primary: p, secondary: s }, st: { ...st(), cur: [i, n - 1 - i] } });
    }
    i = n;
    F.push({ line: 'ret', msg: `|${p} \u2212 ${s}| = ${Math.abs(p - s)}.`, vars: { primary: p, secondary: s, result: Math.abs(p - s) }, st: st(), result: String(Math.abs(p - s)) });
    return F;
  },
  render(st) {
    const { M, n, i, cur } = st;
    const grid = M.map((row, r) => cells(row, { idx: false, noTop: true, wide: true, cls: c => {
      if (cur && cur[0] === r && cur[1] === c) return 'cur t1';
      const onP = r === c, onS = r + c === n - 1, done = r < i || (cur && r === i && (onP || (onS && cur[1] === n - 1 - r)));
      if (onP && onS) return done ? 'ok' : 't2';
      if (onP) return r < i || (cur && r === i) ? 'ok' : 't2';
      if (onS) return r < i || (cur && r === i && cur[1] === c) ? 'ok' : 't2';
      return 'dim';
    } })).join('');
    return block('matrix (shaded = on a diagonal, green = already added)', grid);
  }
});
