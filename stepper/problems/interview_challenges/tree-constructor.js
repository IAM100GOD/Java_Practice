/* 7. Tree Constructor */
P.push({
  id: 'tree-constructor', title: 'Tree Constructor', level: 'medium', file: 'TreeConstructor.java',
  statement: 'Each pair <code>(child,parent)</code> is an edge. Return <code>true</code> if the pairs form one valid binary tree: every node has at most one parent and at most two children, and there is exactly one root.',
  technique: 'Degree counting with hash maps + one BFS', time: 'O(n)', space: 'O(n)',
  inputs: [{ key: 'pairs', label: 'strArr (child,parent)', def: '(1,2) (2,4) (5,7) (7,2) (9,5)' }],
  samples: [['(1,2) (2,4) (5,7) (7,2) (9,5)'], ['(1,2) (3,2) (2,12) (5,2)'], ['(1,2) (1,3)'], ['(2,1) (3,4) (4,3)']],
  code: "public static boolean treeConstructor(String[] strArr) {\n    Map<Integer, Integer> parentOf = new HashMap<>();\n    Map<Integer, List<Integer>> children = new HashMap<>();\n    Set<Integer> nodes = new HashSet<>();\n\n    for (String pair : strArr) {\n        String[] parts = pair.replaceAll(\"[()\\\\s]\", \"\").split(\",\");\n        int child = Integer.parseInt(parts[0]);\n        int parent = Integer.parseInt(parts[1]); @parse\n        nodes.add(child);\n        nodes.add(parent);\n\n        if (parentOf.containsKey(child)) return false;          // rule 1 @r1\n        parentOf.put(child, parent);\n\n        List<Integer> kids = children.computeIfAbsent(parent, k -> new ArrayList<>());\n        kids.add(child);\n        if (kids.size() > 2) return false;                      // rule 2 @r2\n    }\n\n    Integer root = null;\n    for (int n : nodes) {\n        if (!parentOf.containsKey(n)) {\n            if (root != null) return false;                     // rule 3: two roots @r3\n            root = n; @root\n        }\n    }\n    if (root == null) return false;                             // rule 3: no root (cycle) @r3b\n\n    Set<Integer> seen = new HashSet<>();                        // rule 4\n    Deque<Integer> queue = new ArrayDeque<>();\n    queue.add(root);\n    while (!queue.isEmpty()) {\n        int n = queue.poll();\n        seen.add(n); @bfs\n        queue.addAll(children.getOrDefault(n, List.of()));\n    }\n    return seen.size() == nodes.size(); @ret\n}",
  steps: [
    'Read each pair as an edge from parent to child, and record it in two maps: <code>parentOf</code> (child → parent) and <code>children</code> (parent → list of kids).',
    'Rule 1: if a child already has a parent, two edges point into it. That is not a tree.',
    'Rule 2: if a parent gets a third child, it is not a <em>binary</em> tree.',
    'Rule 3: the root is the one node that never appears as a child. Zero roots means there is a cycle. Two or more means it is a forest.',
    'Rule 4: walk the tree from the root with BFS. If some node is never reached, it sits in a separate cycle such as <code>(3,4) (4,3)</code>, which rules 1 to 3 cannot detect.'
  ],
  cmp: [['Build the tree, then for each node search all pairs for parents/kids', 'O(n²)', 'O(n)'], ['Hash maps for parent / children counts + 1 BFS', 'O(n)', 'O(n)']],
  eff: 'Hash maps make each "does this child already have a parent?" or "how many kids?" check O(1). The code returns as soon as a rule fails, so bad input stops early. Many online solutions leave out the BFS; try the last sample to see why it is needed.',
  parse({ pairs }) {
    const m = [...pairs.matchAll(/\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/g)].map(x => [+x[1], +x[2]]);
    if (!m.length) throw new Error('Write pairs like (1,2) (2,4).');
    return m;
  },
  run(inp) {
    const pairs = this.parse(inp); const F = [];
    const parentOf = {}, kids = {}, nodes = []; const add = n => { if (!nodes.includes(n)) nodes.push(n); };
    const rules = ['wait', 'wait', 'wait', 'wait']; let edges = [], cur = null, badN = [], root = null, seen = [];
    const st = () => ({ nodes: [...nodes], kids: clone(kids), edges: clone(edges), cur, badN: [...badN], rules: [...rules], root, seen: [...seen], parentOf: { ...parentOf } });
    for (const [c, p] of pairs) {
      add(c); add(p); cur = [c, p];
      if (parentOf[c] !== undefined) { badN = [c]; rules[0] = 'fail'; edges.push([c, p]); (kids[p] = kids[p] || []).push(c);
        F.push({ line: 'r1', msg: `${c} already has parent ${parentOf[c]}, and now (${c},${p}) gives it a second one. Return false.`, vars: { child: c, parent: p, [`parentOf[${c}]`]: parentOf[c] }, st: st(), result: 'false', bad: true }); return F; }
      parentOf[c] = p; (kids[p] = kids[p] || []).push(c); edges.push([c, p]);
      if (kids[p].length > 2) { badN = [p]; rules[1] = 'fail';
        F.push({ line: 'r2', msg: `${p} now has three children (${kids[p].join(', ')}). A binary tree allows two. Return false.`, vars: { child: c, parent: p, [`kids(${p})`]: `[${kids[p]}]` }, st: st(), result: 'false', bad: true }); return F; }
      F.push({ line: 'r2', msg: `Edge ${p} → ${c}. ${c} has one parent and ${p} has ${kids[p].length} child${kids[p].length > 1 ? 'ren' : ''}. Both rules hold.`, vars: { child: c, parent: p, [`kids(${p})`]: `[${kids[p]}]` }, st: st() });
    }
    cur = null; rules[0] = rules[1] = 'pass';
    const roots = nodes.filter(n => parentOf[n] === undefined);
    if (roots.length > 1) { rules[2] = 'fail'; badN = roots; F.push({ line: 'r3', msg: `${roots.join(' and ')} never appear as a child, so there are ${roots.length} roots. That is a forest, not one tree.`, vars: { roots: `[${roots}]` }, st: st(), result: 'false', bad: true }); return F; }
    if (!roots.length) { rules[2] = 'fail'; F.push({ line: 'r3b', msg: 'Every node is someone\'s child, so there is no root. The edges must form a cycle.', vars: { root: 'null' }, st: st(), result: 'false', bad: true }); return F; }
    root = roots[0]; rules[2] = 'pass';
    F.push({ line: 'root', msg: `${root} is the only node that is never a child, so it is the root.`, vars: { root }, st: st() });
    const qu = [root];
    while (qu.length) { const n = qu.shift(); seen.push(n); qu.push(...(kids[n] || []));
      F.push({ line: 'bfs', msg: `BFS visits ${n}${(kids[n] || []).length ? ` and queues its children ${kids[n].join(', ')}` : ', a leaf'}.`, vars: { n, queue: `[${qu}]`, seen: `${seen.length} / ${nodes.length}` }, st: st() }); }
    const ok = seen.length === nodes.length; rules[3] = ok ? 'pass' : 'fail';
    if (!ok) badN = nodes.filter(n => !seen.includes(n));
    F.push({ line: 'ret', msg: ok ? 'BFS reached every node. It is one connected binary tree.' : `BFS never reached ${badN.join(', ')}. They form a separate cycle.`, vars: { 'seen.size()': seen.length, 'nodes.size()': nodes.length }, st: st(), result: String(ok), bad: !ok });
    return F;
  },
  render(st) {
    const L = layoutForest(st.nodes, st.kids); const W = L.slots * 56 + 30, H = (L.maxD + 1) * 66 + 20;
    const X = n => 30 + L.pos[n].x * 56, Y = n => 30 + L.pos[n].d * 66;
    let svg = `<svg class="tv" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Tree built so far">`;
    st.edges.forEach(([c, p]) => { const on = st.cur && st.cur[0] === c && st.cur[1] === p; svg += `<line class="edge ${on ? 'on' : ''}" x1="${X(p)}" y1="${Y(p)}" x2="${X(c)}" y2="${Y(c)}"/>`; });
    st.nodes.forEach(n => { const cls = st.badN.includes(n) ? 'bad' : st.seen.includes(n) ? 'ok' : st.cur && st.cur.includes(n) ? 'cur' : '';
      svg += `<g class="nd ${cls}"><circle cx="${X(n)}" cy="${Y(n)}" r="17"/><text x="${X(n)}" y="${Y(n)}">${n}</text></g>`;
      if (n === st.root) svg += `<text class="plab c-acc" x="${X(n)}" y="${Y(n) - 22}">root</text>`; });
    svg += '</svg>';
    const names = ['1. at most one parent per node', '2. at most two children per node', '3. exactly one root', '4. every node reachable from root'];
    const rl = `<ul class="rules">${names.map((t, i) => `<li><span class="st ${st.rules[i]}">${st.rules[i] === 'wait' ? '…' : st.rules[i] === 'pass' ? 'pass' : 'fail'}</span>${t}</li>`).join('')}</ul>`;
    const pm = Object.keys(st.parentOf);
    const tbl = pm.length ? `<table class="maptbl"><tr><th>child</th><th>parent</th></tr>${pm.map(c => `<tr class="${st.cur && String(st.cur[0]) === c ? 'on' : ''}"><td>${c}</td><td>${st.parentOf[c]}</td></tr>`).join('')}</table>` : '<span class="empty">empty</span>';
    return block('graph so far', `<div class="scroll">${svg}</div>`) + `<div class="row2">${block('rules', rl)}${block('parentOf', tbl)}</div>`;
  }
});
