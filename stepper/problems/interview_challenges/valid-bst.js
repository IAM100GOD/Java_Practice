/* 8. Valid BST */
P.push({
  id: 'valid-bst', title: 'Valid BST', level: 'medium', file: 'TreeConstructor.java',
  statement: 'Check whether a binary tree is a valid binary search tree: every value in a node\'s left subtree is smaller than it, and every value in its right subtree is larger. Enter the tree in level order, with <code>null</code> for missing children.',
  technique: 'DFS with a narrowing (min, max) range', time: 'O(n)', space: 'O(h) recursion depth',
  inputs: [{ key: 'tree', label: 'tree (level order)', def: '8, 3, 10, null, 9, null, 14' }],
  samples: [['8, 3, 10, 1, 6, null, 14'], ['8, 3, 10, null, 9, null, 14'], ['5, 1, 4, null, null, 3, 6'], ['2, 1, 3']],
  code: "public static boolean isValidBST(Node root) {\n    return isValidBST(root, Long.MIN_VALUE, Long.MAX_VALUE); @start\n}\n\nprivate static boolean isValidBST(Node node, long min, long max) {\n    if (node == null) return true;\n    if (node.val <= min || node.val >= max) return false; @check\n    return isValidBST(node.left, min, node.val) @left\n        && isValidBST(node.right, node.val, max); @right\n}",
  steps: [
    'The root may hold any value, so it starts with the range (−∞, +∞).',
    'When you go <strong>left</strong>, every value below must be smaller than this node, so the upper bound becomes <code>node.val</code>.',
    'When you go <strong>right</strong>, every value below must be larger, so the lower bound becomes <code>node.val</code>.',
    'A node outside its range breaks the BST, even if it is in the right order compared with its own parent. That is the usual trap: try the second sample, where 9 is larger than its parent 3 but sits under 8\'s left side.',
    'Missing children (null) are valid. <code>&amp;&amp;</code> stops the search at the first failure.'
  ],
  cmp: [['Compare each node only with its direct children', 'O(n), wrong', 'misses 9 under 3'], ['For each node, scan its whole subtree for max/min', 'O(n²)', 'O(h)'], ['Pass (min, max) bounds down', 'O(n)', 'O(h)']],
  eff: 'Each node is checked once, against bounds that sum up the rules from all of its ancestors. <code>long</code> bounds let a node with value <code>Integer.MIN_VALUE</code> or <code>MAX_VALUE</code> pass. An in-order traversal that checks the values are strictly increasing works just as well.',
  parse({ tree }) {
    const vals = tree.split(/[,\s]+/).filter(Boolean).map(v => v.toLowerCase() === 'null' ? null : Number(v));
    if (!vals.length || vals[0] == null) throw new Error('The first value (the root) cannot be null.');
    if (vals.some(v => v !== null && !Number.isFinite(v))) throw new Error('Use numbers and null only.');
    const nodes = []; const root = { id: 0, v: vals[0], l: null, r: null, d: 0 }; nodes.push(root);
    const qu = [root]; let k = 1;
    while (qu.length && k < vals.length) {
      const n = qu.shift();
      for (const side of ['l', 'r']) { if (k >= vals.length) break; const v = vals[k++]; if (v !== null) { const c = { id: nodes.length, v, l: null, r: null, d: n.d + 1 }; nodes.push(c); n[side] = c.id; qu.push(c); } }
    }
    let ord = 0; const io = id => { if (id == null) return; io(nodes[id].l); nodes[id].x = ord++; io(nodes[id].r); }; io(0);
    return nodes;
  },
  run(inp) {
    const N = this.parse(inp); const F = []; const range = {}, status = {}; const stack = []; let cur = null, edge = null;
    const st = () => ({ N, range: clone(range), status: { ...status }, cur, edge });
    const S = () => stack.map(s => `isValidBST(${s})`).reverse().join('\n');
    F.push({ line: 'start', msg: 'Start at the root with no limits: (−∞, +∞).', vars: { stack: 'main' }, st: st() });
    const rec = (id, min, max) => {
      const n = N[id]; cur = id; range[id] = [min, max]; stack.push(`${n.v}, ${inf(min)}, ${inf(max)}`);
      const V = () => ({ 'node.val': n.v, min: inf(min), max: inf(max), 'call stack': `${stack.length} deep` });
      if (n.v <= min || n.v >= max) { status[id] = 'bad'; F.push({ line: 'check', msg: `${n.v} must be inside (${inf(min)}, ${inf(max)}), and it is not. Return false.`, vars: V(), st: st(), stack: S() }); stack.pop(); return false; }
      status[id] = 'ok'; F.push({ line: 'check', msg: `${n.v} is inside (${inf(min)}, ${inf(max)}).`, vars: V(), st: st(), stack: S() });
      if (n.l != null) { edge = [id, n.l]; F.push({ line: 'left', msg: `Go left. Everything under here must be < ${n.v}, so max becomes ${n.v}.`, vars: V(), st: st(), stack: S() }); if (!rec(n.l, min, n.v)) { stack.pop(); return false; } cur = id; }
      if (n.r != null) { edge = [id, n.r]; F.push({ line: 'right', msg: `Go right. Everything under here must be > ${n.v}, so min becomes ${n.v}.`, vars: V(), st: st(), stack: S() }); if (!rec(n.r, n.v, max)) { stack.pop(); return false; } cur = id; }
      stack.pop(); return true;
    };
    const ok = rec(0, -Infinity, Infinity); edge = null;
    F.push({ line: ok ? 'start' : 'check', msg: ok ? 'Every node was inside its range.' : 'The false result passes up the call stack, and && skips every remaining check.', vars: { result: ok }, st: st(), result: String(ok), bad: !ok });
    return F;
  },
  render(st) {
    const N = st.N; const maxX = Math.max(...N.map(n => n.x)), maxD = Math.max(...N.map(n => n.d));
    const W = (maxX + 1) * 64 + 20, H = (maxD + 1) * 78 + 30; const X = n => 42 + n.x * 64, Y = n => 28 + n.d * 78;
    let svg = `<svg class="tv" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Binary tree">`;
    N.forEach(n => ['l', 'r'].forEach(s => { if (n[s] != null) { const c = N[n[s]]; const on = st.edge && st.edge[0] === n.id && st.edge[1] === c.id; svg += `<line class="edge ${on ? 'on' : ''}" x1="${X(n)}" y1="${Y(n)}" x2="${X(c)}" y2="${Y(c)}"/>`; } }));
    N.forEach(n => {
      const cls = [st.status[n.id] || '', st.cur === n.id ? 'cur' : ''].join(' ');
      svg += `<g class="nd ${cls}"><circle cx="${X(n)}" cy="${Y(n)}" r="17"/><text x="${X(n)}" y="${Y(n)}">${n.v}</text></g>`;
      if (st.range[n.id]) svg += `<text class="rng ${st.cur === n.id ? 'on' : ''}" x="${X(n)}" y="${Y(n) + 30}">(${inf(st.range[n.id][0])}, ${inf(st.range[n.id][1])})</text>`;
    });
    svg += '</svg>';
    return block('tree. Nodes are placed left to right in sorted order, and each shows its allowed (min, max) range', `<div class="scroll">${svg}</div>`);
  }
});
