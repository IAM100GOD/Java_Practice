/* A22. Spiral Matrix Traversal (Accenture Lateral) */
P.push({
  id: 'acc-spiral-matrix-traversal',
  title: 'Spiral Matrix Traversal',
  level: 'medium',
  group: 'accenture',
  file: 'SpiralMatrixTraversal.java',
  dir: 'accenture/lateral',
  statement: 'Given an M \u00d7 N matrix, return all elements in spiral order (outer perimeter inward clockwise). Example: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] \u2192 [1, 2, 3, 6, 9, 8, 7, 4, 5].',
  technique: 'Four boundaries (top, bottom, left, right) peeling perimeter layers',
  time: 'O(M \u00d7 N)',
  space: 'O(1) auxiliary (excluding output list)',
  inputs: [
    { key: 'm', label: 'matrix (one row per line or ; separated)', def: '1, 2, 3; 4, 5, 6; 7, 8, 9' }
  ],
  samples: [
    ['1, 2, 3; 4, 5, 6; 7, 8, 9'],
    ['1, 2, 3, 4; 5, 6, 7, 8; 9, 10, 11, 12'],
    ['1, 2; 3, 4'],
    ['1, 2, 3'],
    ['1; 2; 3']
  ],
  code: "public static List<Integer> spiralOrder(int[][] matrix) {\n    List<Integer> result = new ArrayList<>(); @init\n    int top = 0, bottom = matrix.length - 1; @bounds\n    int left = 0, right = matrix[0].length - 1;\n    while (top <= bottom && left <= right) {\n        for (int c = left; c <= right; c++) result.add(matrix[top][c]); @right\n        top++;\n        for (int r = top; r <= bottom; r++) result.add(matrix[r][right]); @down\n        right--;\n        if (top <= bottom) {\n            for (int c = right; c >= left; c--) result.add(matrix[bottom][c]); @left\n            bottom--;\n        }\n        if (left <= right) {\n            for (int r = bottom; r >= top; r--) result.add(matrix[r][left]); @up\n            left++;\n        }\n    }\n    return result; @ret\n}",
  steps: [
    'Define four boundary markers: <code>top = 0</code>, <code>bottom = M \u2212 1</code>, <code>left = 0</code>, <code>right = N \u2212 1</code>.',
    'Traverse in 4 clockwise directions until boundaries cross:',
    '1. <strong>Go Right:</strong> Along row <code>top</code> from <code>left</code> to <code>right</code>, then increment <code>top++</code>.',
    '2. <strong>Go Down:</strong> Along column <code>right</code> from <code>top</code> to <code>bottom</code>, then decrement <code>right--</code>.',
    '3. <strong>Go Left:</strong> If <code>top \u2264 bottom</code>, along row <code>bottom</code> from <code>right</code> to <code>left</code>, then decrement <code>bottom--</code>.',
    '4. <strong>Go Up:</strong> If <code>left \u2264 right</code>, along column <code>left</code> from <code>bottom</code> to <code>top</code>, then increment <code>left++</code>.',
    'Every cell is visited exactly once, yielding an optimal O(M \u00d7 N) runtime.'
  ],
  cmp: [
    ['State machine with visited boolean matrix', 'O(M \u00d7 N)', 'O(M \u00d7 N) boolean array'],
    ['4-Boundary perimeter shrinkage', 'O(M \u00d7 N)', 'O(1) auxiliary']
  ],
  eff: 'Peeling boundaries directly requires zero extra memory and cleanly avoids visiting duplicate cells.',
  run({ m }) {
    const rows = m.split(/[;\n]+/).map(r => r.split(/[,\s]+/).filter(Boolean).map(Number)).filter(r => r.length);
    const R = rows.length;
    if (!R || rows.some(r => r.length !== rows[0].length || r.some(x => !Number.isFinite(x)))) {
      throw new Error('Enter a valid rectangular matrix (M rows of equal numbers).');
    }
    const C = rows[0].length;
    if (R > 6 || C > 6) throw new Error('Use dimensions \u2264 6 \u00d7 6 for visualizer.');

    const F = [];
    const res = [];
    let top = 0, bottom = R - 1, left = 0, right = C - 1;

    F.push({
      line: 'init',
      msg: `Starting with ${R} \u00d7 ${C} matrix.`,
      vars: { R, C },
      st: { M: rows, R, C, visited: [], cur: null, top, bottom, left, right, res: [] }
    });

    F.push({
      line: 'bounds',
      msg: `Set boundaries: top = 0, bottom = ${bottom}, left = 0, right = ${right}.`,
      vars: { top, bottom, left, right },
      st: { M: rows, R, C, visited: [], cur: null, top, bottom, left, right, res: [] }
    });

    while (top <= bottom && left <= right) {
      // 1. Right
      for (let c = left; c <= right; c++) {
        const val = rows[top][c];
        res.push(val);
        F.push({
          line: 'right',
          msg: `Go Right: visit [${top}][${c}] = ${val}.`,
          vars: { row: top, col: c, val, dir: 'Right' },
          st: { M: rows, R, C, visited: [...res], cur: [top, c], top, bottom, left, right, res: [...res] }
        });
      }
      top++;

      // 2. Down
      for (let r = top; r <= bottom; r++) {
        const val = rows[r][right];
        res.push(val);
        F.push({
          line: 'down',
          msg: `Go Down: visit [${r}][${right}] = ${val}.`,
          vars: { row: r, col: right, val, dir: 'Down' },
          st: { M: rows, R, C, visited: [...res], cur: [r, right], top, bottom, left, right, res: [...res] }
        });
      }
      right--;

      // 3. Left
      if (top <= bottom) {
        for (let c = right; c >= left; c--) {
          const val = rows[bottom][c];
          res.push(val);
          F.push({
            line: 'left',
            msg: `Go Left: visit [${bottom}][${c}] = ${val}.`,
            vars: { row: bottom, col: c, val, dir: 'Left' },
            st: { M: rows, R, C, visited: [...res], cur: [bottom, c], top, bottom, left, right, res: [...res] }
          });
        }
        bottom--;
      }

      // 4. Up
      if (left <= right) {
        for (let r = bottom; r >= top; r--) {
          const val = rows[r][left];
          res.push(val);
          F.push({
            line: 'up',
            msg: `Go Up: visit [${r}][${left}] = ${val}.`,
            vars: { row: r, col: left, val, dir: 'Up' },
            st: { M: rows, R, C, visited: [...res], cur: [r, left], top, bottom, left, right, res: [...res] }
          });
        }
        left++;
      }
    }

    F.push({
      line: 'ret',
      msg: `Spiral traversal complete! Order: [${res.join(', ')}].`,
      vars: { count: res.length, result: `[${res.join(', ')}]` },
      st: { M: rows, R, C, visited: [...res], cur: null, top, bottom, left, right, res: [...res] },
      result: `[${res.join(', ')}]`
    });

    return F;
  },
  render(st) {
    const { M, cur, res } = st;
    const grid = M.map((row, r) => cells(row, {
      idx: false,
      noTop: true,
      wide: true,
      cls: c => {
        if (cur && cur[0] === r && cur[1] === c) return 'cur t1';
        if (res.includes(row[c])) return 'ok';
        return 'dim';
      }
    })).join('');

    let h = block('matrix grid', `<div style="display:flex;flex-direction:column;gap:4px">${grid}</div>`);
    h += block('spiral order traversed so far',
      tokens(res.map(String), () => 'ok')
    );
    return h;
  }
});
