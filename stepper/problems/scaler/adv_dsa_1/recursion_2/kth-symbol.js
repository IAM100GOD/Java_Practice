/* 48. Kth Symbol (Scaler) */
P.push({
  id: 'kth-symbol', title: 'Kth Symbol', level: 'medium', group: 'scaler-rec2', file: 'KthSymbol.java', dir: 'scaler/adv_dsa_1/recursion_2',
  statement: 'Row 1 is <code>0</code>. Each next row replaces every 0 with <code>01</code> and every 1 with <code>10</code>. Return the B-th symbol (1-indexed) of row A. Constraint: A ≤ 20.',
  technique: 'Recurse to the parent symbol: left child copies it, right child flips it', time: 'O(A)', space: 'O(A) stack',
  inputs: [{ key: 'a', label: 'A (row)', def: '5', narrow: true }, { key: 'b', label: 'B (index)', def: '11', narrow: true }],
  samples: [['2', '1'], ['2', '2'], ['4', '6'], ['5', '11'], ['5', '16']],
  code: "public int solve(int A, int B) {\n    if (A == 1) return 0;                          // row 1 is just \"0\" @base\n    int parent = solve(A - 1, (B + 1) / 2);        // the symbol B came from @par\n    return (B % 2 == 1) ? parent : 1 - parent;     // left child copies, right child flips @pick\n}",
  steps: [
    'Row A has 2^(A−1) symbols, which is over 500,000 for A = 20. Do not build it. Every symbol comes from <strong>one parent</strong> in the row above.',
    'Positions 2k−1 and 2k in row A both come from position k in row A−1, so the parent of B is at <code>(B + 1) / 2</code>.',
    'Look at the two rules: 0 → <b>0</b>1 and 1 → <b>1</b>0. The <strong>left</strong> child (odd B) always equals its parent, and the <strong>right</strong> child (even B) is always the parent flipped.',
    'So <code>solve(A, B) = parent</code> when B is odd, and <code>1 − parent</code> when B is even, where <code>parent = solve(A−1, (B+1)/2)</code>. <strong>Base case:</strong> row 1 is just 0.',
    'That is one call per row, following a single path up to the root: O(A) time instead of O(2ᴬ).'
  ],
  cmp: [['Build row A as a string', 'O(2ᴬ)', 'O(2ᴬ)'], ['Recurse to the parent', 'O(A)', 'O(A) stack'], ['Count flips: popcount(B − 1) % 2', 'O(1)', 'O(1)']],
  eff: "Each level only follows the one branch that leads to B, so A ≤ 20 means at most 20 calls. The answer flips once for every time the path takes a right branch. Those right turns are exactly the 1-bits of B − 1, which is why the answer also equals <code>Integer.bitCount(B − 1) % 2</code>.",
  run({ a, b }) {
    if (![a, b].every(x => /^\d+$/.test(x.trim()))) throw new Error('A and B must be positive whole numbers.');
    const A = parseInt(a, 10), B = parseInt(b, 10);
    if (A < 1 || A > 5) throw new Error('The picture fits A from 1 to 5. The Java code handles up to 20.');
    if (B < 1 || B > 2 ** (A - 1)) throw new Error(`Row ${A} has ${2 ** (A - 1)} symbols, so B must be between 1 and ${2 ** (A - 1)}.`);
    const rows = ['0']; for (let r = 2; r <= A; r++) rows.push([...rows[r - 2]].map(c => c === '0' ? '01' : '10').join(''));
    const F = []; const stack = []; const path = {}; const known = {};
    const st = (cur) => ({ A, rows, path: { ...path }, known: { ...known }, cur, stack: clone(stack) });
    const rec = (r, k) => {
      path[r] = k; stack.push({ call: `solve(${r}, ${k})`, detail: '', state: 'active' }); const me = stack[stack.length - 1];
      if (r === 1) { known[1] = 0; me.state = 'done'; me.value = 0; me.detail = 'base case';
        F.push({ line: 'base', msg: 'Row 1 is just "0", the base case. Return 0.', vars: { A: 1, B: 1, returns: 0 }, st: st(1) }); stack.pop(); return 0; }
      const pk = Math.floor((k + 1) / 2); me.detail = `parent = solve(${r - 1}, ${pk})`;
      F.push({ line: 'par', msg: `Position ${k} of row ${r} comes from position (${k}+1)/2 = ${pk} of row ${r - 1}. It is the ${k % 2 ? 'left (odd)' : 'right (even)'} child.`, vars: { A: r, B: k, parent: `(${r - 1}, ${pk})` }, st: st(r) });
      me.state = 'waiting'; const p = rec(r - 1, pk); const v = k % 2 ? p : 1 - p; known[r] = v;
      me.state = 'done'; me.value = v; me.detail = k % 2 ? `left child = parent ${p}` : `right child = 1 − ${p}`;
      F.push({ line: 'pick', msg: `The parent symbol is ${p}. ${k % 2 ? `B = ${k} is odd (left child), so copy it: ${v}.` : `B = ${k} is even (right child), so flip it: ${v}.`}`, vars: { A: r, B: k, parent: p, returns: v }, st: st(r) });
      stack.pop(); return v;
    };
    const res = rec(A, B);
    F.push({ line: 'pick', msg: `Symbol ${B} of row ${A} is ${res}. Check: row ${A} = ${rows[A - 1]}, and its ${B}-th character is ${rows[A - 1][B - 1]}.`, vars: { result: res }, st: st(A), result: String(res) });
    return F;
  },
  render(st) {
    const cols = 2 ** (st.A - 1);
    let g = `<div class="scroll"><div style="display:grid;grid-template-columns:auto repeat(${cols}, 28px);gap:4px;width:max-content;align-items:center">`;
    st.rows.forEach((row, ri) => {
      const r = ri + 1, span = cols / row.length;
      g += `<div class="sy" style="font-family:var(--f-mono);font-size:.7rem;color:var(--muted);padding-right:6px">row ${r}</div>`;
      [...row].forEach((c, ci) => {
        const onPath = st.path[r] === ci + 1; const solved = onPath && st.known[r] !== undefined; const isCur = onPath && st.cur === r;
        const cls = solved ? (isCur ? 'cur ok' : 'ok') : onPath ? (isCur ? 'cur t2' : 't2') : '';
        g += `<div class="cell ${cls}" style="grid-column:span ${span};width:auto;height:28px;font-size:.8rem">${onPath && !solved ? '?' : c}</div>`;
      });
    });
    g += '</div></div>';
    return block('rows (amber = path from B up to row 1, still unknown; green = solved on the way back down)', g) + callStackView(st.stack);
  }
});
