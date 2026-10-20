/* A14. Rotate Matrix 90° Clockwise In-Place (Accenture) */
P.push({
  id: 'acc-rotate-matrix',
  title: 'Rotate Matrix 90° Clockwise In-Place',
  level: 'medium',
  group: 'accenture',
  file: 'RotateMatrix90Clockwise.java',
  dir: 'AccentureQuestions',
  statement: 'Given an N \u00d7 N 2D matrix representing an image, rotate the image by 90 degrees clockwise in-place (without allocating another 2D matrix). Sample Test Case: [[1, 2], [3, 4]] \u2192 [[3, 1], [4, 2]]. Pattern: Transpose the matrix, then reverse each row.',
  technique: 'Transpose then reverse each row',
  time: 'O(N\u00b2)',
  space: 'O(1) in-place',
  inputs: [{ key: 'm', label: 'matrix (one row per line or ; separated)', def: '1, 2; 3, 4' }],
  samples: [
    ['1, 2; 3, 4'],
    ['1, 2, 3; 4, 5, 6; 7, 8, 9'],
    ['5, 1, 9, 11; 2, 4, 8, 10; 13, 3, 6, 7; 15, 14, 12, 16'],
    ['42']
  ],
  code: "public static void rotate(int[][] mat) {\n    int n = mat.length; @init\n    // Step 1: Transpose matrix (swap mat[i][j] with mat[j][i])\n    for (int i = 0; i < n; i++) {\n        for (int j = i + 1; j < n; j++) {\n            int temp = mat[i][j];\n            mat[i][j] = mat[j][i];\n            mat[j][i] = temp; @transpose\n        }\n    }\n    // Step 2: Reverse each row\n    for (int i = 0; i < n; i++) {\n        int left = 0, right = n - 1;\n        while (left < right) {\n            int temp = mat[i][left];\n            mat[i][left] = mat[i][right];\n            mat[i][right] = temp; @reverse\n            left++; right--;\n        }\n    }\n} @done",
  steps: [
    'A 90\u00b0 clockwise rotation maps element at <code>(row, col)</code> to <code>(col, n \u2212 1 \u2212 row)</code>.',
    'Notice that transposing swaps <code>(row, col) \u2194 (col, row)</code>.',
    'Then reversing each row flips column indices horizontally: <code>(col, row) \u2192 (col, n \u2212 1 \u2212 row)</code>.',
    'Combining Transpose + Reverse Row achieves the exact 90\u00b0 clockwise rotation in-place without auxiliary arrays!',
    'Step 1 (Transpose): iterate upper triangle <code>j > i</code> and swap <code>mat[i][j] \u2194 mat[j][i]</code>.',
    'Step 2 (Reverse): for each row <code>i</code>, use two pointers <code>left = 0, right = n \u2212 1</code> and swap inward.'
  ],
  cmp: [
    ['Allocate new N\u00d7N matrix and copy', 'O(N\u00b2)', 'O(N\u00b2) auxiliary'],
    ['In-place Transpose + Row Reversals', 'O(N\u00b2)', 'O(1) in-place']
  ],
  eff: 'Runs in O(N\u00b2) time (touching each cell twice) with strictly O(1) auxiliary space, directly modifying the input array.',
  run({ m }) {
    const rows = m.split(/[;\n]+/).map(r => r.split(/[,\s]+/).filter(Boolean).map(Number)).filter(r => r.length);
    const n = rows.length;
    if (!n || rows.some(r => r.length !== n || r.some(x => !Number.isFinite(x)))) {
      throw new Error('Enter a square matrix: N rows of N numbers each.');
    }
    if (n > 6) throw new Error('Use N \u2264 6 for step-through visualization.');

    const M = rows.map(r => [...r]);
    const clone = () => M.map(r => [...r]);
    const F = [];

    F.push({
      line: 'init',
      msg: `Starting with ${n} \u00d7 ${n} matrix. Phase 1: Transpose; Phase 2: Reverse rows.`,
      vars: { n, phase: 'Start' },
      st: { M: clone(), n, phase: 'Initial Matrix' }
    });

    // Phase 1: Transpose
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const v1 = M[i][j];
        const v2 = M[j][i];
        M[i][j] = v2;
        M[j][i] = v1;
        F.push({
          line: 'transpose',
          msg: `Transpose: swap mat[${i}][${j}] (${v1}) \u2194 mat[${j}][${i}] (${v2}).`,
          vars: { i, j, 'mat[i][j]': v2, 'mat[j][i]': v1 },
          st: {
            M: clone(),
            n,
            phase: 'Phase 1: Transposing (Row \u2194 Column)',
            cur: [[i, j], [j, i]],
            diag: true
          }
        });
      }
    }

    F.push({
      line: 'transpose',
      msg: 'Transpose complete! Main diagonal stayed fixed; rows and columns swapped.',
      vars: { phase: 'Transpose Done' },
      st: { M: clone(), n, phase: 'Transposed Matrix (Now ready for row reversals)' }
    });

    // Phase 2: Reverse each row
    for (let i = 0; i < n; i++) {
      let left = 0, right = n - 1;
      while (left < right) {
        const vl = M[i][left];
        const vr = M[i][right];
        M[i][left] = vr;
        M[i][right] = vl;
        F.push({
          line: 'reverse',
          msg: `Row ${i}: swap mat[${i}][${left}] (${vl}) \u2194 mat[${i}][${right}] (${vr}).`,
          vars: { row: i, left, right, 'mat[i][left]': vr, 'mat[i][right]': vl },
          st: {
            M: clone(),
            n,
            phase: `Phase 2: Reversing Row ${i}`,
            cur: [[i, left], [i, right]],
            activeRow: i
          }
        });
        left++;
        right--;
      }
    }

    const resStr = JSON.stringify(M);
    F.push({
      line: 'done',
      msg: `Matrix rotated 90\u00b0 clockwise in-place: ${resStr}.`,
      vars: { result: resStr },
      st: { M: clone(), n, phase: 'Rotation Complete (90\u00b0 Clockwise)' },
      result: resStr
    });

    return F;
  },
  render(st) {
    const { M, n, phase, cur, activeRow } = st;
    const isCur = (r, c) => cur && cur.some(([cr, cc]) => cr === r && cc === c);
    const grid = M.map((row, r) => cells(row, {
      idx: false,
      noTop: true,
      wide: true,
      cls: c => {
        if (isCur(r, c)) return 'cur t1';
        if (activeRow !== undefined && r === activeRow) return 't2';
        if (r === c) return 'ok'; // Main diagonal
        return '';
      }
    })).join('');

    return `
      <div style="margin-bottom:8px;font-size:.9rem;font-weight:600;color:var(--accent);">${phase || ''}</div>
      ${block('matrix (green = diagonal, orange = active row, blue = swapped)', grid)}
    `;
  }
});
