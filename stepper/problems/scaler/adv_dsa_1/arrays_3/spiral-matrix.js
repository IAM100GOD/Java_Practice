/* 13. Spiral Order Matrix II (Scaler) */
P.push({
  id: 'spiral-matrix', title: 'Spiral Order Matrix II', level: 'medium', group: 'scaler-arrays3', file: 'SpiralMatrix.java', dir: 'scaler/adv_dsa_1/arrays_3',
  statement: 'Given an integer <code>A</code>, return an A × A matrix filled with the numbers 1 to A² in clockwise spiral order. Constraints: 1 ≤ A ≤ 1000.',
  technique: 'Four shrinking boundaries', time: 'O(A²)', space: 'O(1) besides the output',
  inputs: [{ key: 'a', label: 'A', def: '4', narrow: true }],
  samples: [['1'], ['3'], ['4'], ['5'], ['6']],
  code: "public static int[][] generateMatrix(int A) {\n    int[][] mat = new int[A][A];\n    int top = 0, bottom = A - 1, left = 0, right = A - 1;\n    int num = 1; @init\n\n    while (num <= A * A) {\n        for (int j = left; j <= right; j++) mat[top][j] = num++;        // top row, left -> right @top\n        top++; @topShrink\n\n        for (int i = top; i <= bottom; i++) mat[i][right] = num++;      // right column, top -> bottom @right\n        right--; @rightShrink\n\n        if (top <= bottom) {\n            for (int j = right; j >= left; j--) mat[bottom][j] = num++; // bottom row, right -> left @bottom\n            bottom--; @bottomShrink\n        }\n\n        if (left <= right) {\n            for (int i = bottom; i >= top; i--) mat[i][left] = num++;   // left column, bottom -> top @left\n            left++; @leftShrink\n        }\n    }\n    return mat; @ret\n}",
  steps: [
    'Keep four boundaries for the part of the matrix that is still empty: <code>top</code>, <code>bottom</code>, <code>left</code> and <code>right</code>.',
    'Fill the top row from left to right, then move <code>top</code> down one row, because that row is finished.',
    'Fill the right column from top to bottom, then move <code>right</code> one column left.',
    'Fill the bottom row from right to left, then move <code>bottom</code> up. Fill the left column from bottom to top, then move <code>left</code> right. That completes one layer of the spiral.',
    'Repeat on the smaller inner square until all A² numbers are placed. The <code>if (top &lt;= bottom)</code> and <code>if (left &lt;= right)</code> checks stop a single leftover row or column from being filled twice.'
  ],
  cmp: [['Walk with a direction vector and check visited[][] at each step', 'O(A²)', 'O(A²) extra'], ['Four shrinking boundaries', 'O(A²)', 'O(1) extra']],
  eff: 'The answer itself has A² cells, so no solution can be faster than O(A²). This one writes every cell exactly once and needs no visited array: the boundaries already say which cells are empty. For A = 1000 that is 1,000,000 writes, which runs well within the time limit.',
  run({ a }) {
    const A = parseInt(a, 10);
    if (!(A >= 1)) throw new Error('A must be 1 or more.');
    if (A > 8) throw new Error('The picture only fits A up to 8. The Java code handles up to 1000.');
    const mat = Array.from({ length: A }, () => Array(A).fill(0));
    let top = 0, bottom = A - 1, left = 0, right = A - 1, num = 1; const F = [];
    let cur = null, side = null;
    const V = () => ({ num, top, bottom, left, right });
    const st = () => ({ mat: clone(mat), top, bottom, left, right, cur, side, A });
    F.push({ line: 'init', msg: `The empty region is the whole ${A} × ${A} matrix. num starts at 1.`, vars: V(), st: st() });
    const put = (i, j, line, dir) => { mat[i][j] = num; cur = [i, j]; side = line; F.push({ line, msg: `mat[${i}][${j}] = ${num} (${dir}).`, vars: { ...V(), num: num + 1 }, st: st() }); num++; };
    while (num <= A * A) {
      for (let j = left; j <= right; j++) put(top, j, 'top', 'top row, moving right');
      top++; side = null; F.push({ line: 'topShrink', msg: `The top row is full. top moves down to ${top}.`, vars: V(), st: st() });
      for (let i = top; i <= bottom; i++) put(i, right, 'right', 'right column, moving down');
      right--; side = null; F.push({ line: 'rightShrink', msg: `The right column is full. right moves left to ${right}.`, vars: V(), st: st() });
      if (top <= bottom) {
        for (let j = right; j >= left; j--) put(bottom, j, 'bottom', 'bottom row, moving left');
        bottom--; side = null; F.push({ line: 'bottomShrink', msg: `The bottom row is full. bottom moves up to ${bottom}.`, vars: V(), st: st() });
      }
      if (left <= right) {
        for (let i = bottom; i >= top; i--) put(i, left, 'left', 'left column, moving up');
        left++; side = null; F.push({ line: 'leftShrink', msg: `The left column is full. left moves right to ${left}.${num <= A * A ? ' One layer is done; start the next one inside it.' : ''}`, vars: V(), st: st() });
      }
    }
    cur = null;
    F.push({ line: 'ret', msg: `All ${A * A} cells are filled.`, vars: V(), st: st(), result: mat.map(r => `[${r.join(', ')}]`).join(' ') });
    return F;
  },
  render(st) {
    const A = st.A; const inside = (i, j) => i >= st.top && i <= st.bottom && j >= st.left && j <= st.right;
    const arrow = { top: '→', right: '↓', bottom: '←', left: '↑' };
    let g = `<div class="scroll"><div class="spiral" style="grid-template-columns:auto repeat(${A}, 38px)"><div></div>`;
    for (let j = 0; j < A; j++) g += `<div class="sx">${j === st.left ? '<span class="c-p1">left</span>' : ''}${j === st.right ? '<span class="c-p3">right</span>' : ''}</div>`;
    for (let i = 0; i < A; i++) {
      g += `<div class="sy">${i === st.top ? '<span class="c-p1">top</span>' : ''}${i === st.bottom ? '<span class="c-p3">bottom</span>' : ''}</div>`;
      for (let j = 0; j < A; j++) {
        const v = st.mat[i][j], isCur = st.cur && st.cur[0] === i && st.cur[1] === j;
        const cls = isCur ? 'cur t2' : v ? (inside(i, j) ? 't1' : 'ok') : inside(i, j) ? 'win' : '';
        g += `<div class="cell ${cls}">${v || ''}</div>`;
      }
    }
    g += '</div></div>';
    return block('mat. Tinted cells are the region still being filled; green cells are finished', g)
      + `<div class="row2">${block('direction', `<span class="big c-p2">${st.side ? arrow[st.side] : '·'}</span>`)}${block('boundaries', `<span class="tok">top ${st.top} · bottom ${st.bottom} · left ${st.left} · right ${st.right}</span>`)}</div>`;
  }
});
