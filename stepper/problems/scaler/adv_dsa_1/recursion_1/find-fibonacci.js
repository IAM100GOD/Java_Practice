/* 42. Find Fibonacci - II (Scaler) */
P.push({
  id: 'find-fibonacci', title: 'Find Fibonacci', level: 'easy', group: 'scaler-rec1', file: 'FindFibonacci.java', dir: 'scaler/adv_dsa_1/recursion_1',
  statement: 'Return the A-th Fibonacci number using recursion: F(0) = 0, F(1) = 1, F(n) = F(n−1) + F(n−2). Constraint: 0 ≤ A ≤ 20.',
  technique: 'Two-branch recursion (a recursion tree)', time: 'O(φᴬ) ≈ O(1.6ᴬ)', space: 'O(A) stack',
  inputs: [{ key: 'a', label: 'A', def: '5', narrow: true }],
  samples: [['2'], ['4'], ['5'], ['6'], ['0']],
  code: "public int findAthFibonacci(int A) {\n    if (A <= 1) return A;                                     // F(0) = 0, F(1) = 1 @base\n    return findAthFibonacci(A - 1) + findAthFibonacci(A - 2); @rec\n}",
  steps: [
    'The definition is already a recursion. <strong>Base cases:</strong> F(0) = 0 and F(1) = 1, which <code>A &lt;= 1 → return A</code> covers in one line.',
    '<strong>Recursive case:</strong> F(A) = F(A−1) + F(A−2). Java evaluates the left call completely, including everything below it, before starting the right call.',
    'Each call makes two more, so the calls form a <strong>binary tree</strong>, not a single chain like Sum of Digits. The stack only ever holds one path from the root to the current call, at most A deep.',
    'The tree recomputes the same values again and again. In F(5), F(3) is computed 2 times and F(2) 3 times. These repeats are outlined in red in the picture. In total the tree has about 1.6ᴬ nodes, which is 21,891 calls for A = 20.',
    'That is fine for A ≤ 20. For larger A, store each F(n) the first time it is computed (memoization), or use a loop, and the cost drops to O(A).'
  ],
  cmp: [['Plain recursion (asked for)', 'O(1.6ᴬ)', 'O(A) stack'], ['Recursion + memo array', 'O(A)', 'O(A)'], ['Loop with two variables', 'O(A)', 'O(1)'], ['Matrix power / fast doubling', 'O(log A)', 'O(1)']],
  eff: "Plain recursion is fine for this problem because A ≤ 20 means at most 21,891 calls. The tree shows why it gets slow: the same subproblems are solved many times, and solving each one only once is the idea behind dynamic programming. In the picture, every red-outlined node is wasted work that a memo array would skip.",
  run({ a }) {
    if (!/^\d+$/.test(a.trim())) throw new Error('A must be a whole number.');
    const A = parseInt(a, 10);
    if (A > 7) throw new Error('The tree only fits A up to 7. The Java code handles up to 20.');
    const nodes = []; const build = (n, d) => { const id = nodes.length; const node = { id, n, d, kids: [] }; nodes.push(node); if (n > 1) { node.kids.push(build(n - 1, d + 1)); node.kids.push(build(n - 2, d + 1)); } return id; };
    build(A, 0);
    let slot = 0; const place = id => { const nd = nodes[id]; if (!nd.kids.length) { nd.x = slot++; return; } nd.kids.forEach(place); nd.x = (nodes[nd.kids[0]].x + nodes[nd.kids[1]].x) / 2; }; place(0);
    const F = []; const seen = new Set(), done = {}, repeat = new Set(); const path = []; let calls = 0; const firstSeen = {};
    const st = () => ({ nodes, slots: slot, seen: [...seen], done: { ...done }, repeat: [...repeat], path: [...path], calls });
    const rec = id => {
      const nd = nodes[id]; seen.add(id); path.push(id); calls++;
      if (firstSeen[nd.n] !== undefined) repeat.add(id); else firstSeen[nd.n] = id;
      if (nd.n <= 1) { done[id] = nd.n;
        F.push({ line: 'base', msg: `F(${nd.n}) is a base case, so it returns ${nd.n} right away.${repeat.has(id) && nd.n > 1 ? '' : ''}`, vars: { A: nd.n, returns: nd.n, 'calls so far': calls }, st: st() });
        path.pop(); return nd.n; }
      F.push({ line: 'rec', msg: `F(${nd.n}) needs F(${nd.n - 1}) + F(${nd.n - 2}). Run the left call, F(${nd.n - 1}), first.${repeat.has(id) ? ` F(${nd.n}) has already been computed elsewhere in the tree, so this is repeated work.` : ''}`, vars: { A: nd.n, 'calls so far': calls }, st: st() });
      const l = rec(nd.kids[0]);
      F.push({ line: 'rec', msg: `F(${nd.n - 1}) returned ${l}. Now run the right call, F(${nd.n - 2}).`, vars: { A: nd.n, [`F(${nd.n - 1})`]: l, 'calls so far': calls }, st: st() });
      const r = rec(nd.kids[1]); done[id] = l + r;
      F.push({ line: 'rec', msg: `F(${nd.n}) = F(${nd.n - 1}) + F(${nd.n - 2}) = ${l} + ${r} = ${l + r}.`, vars: { A: nd.n, [`F(${nd.n - 1})`]: l, [`F(${nd.n - 2})`]: r, returns: l + r, 'calls so far': calls }, st: st() });
      path.pop(); return l + r;
    };
    const res = rec(0);
    F.push({ line: 'rec', msg: `F(${A}) = ${res}. That took ${calls} call${calls > 1 ? 's' : ''}, and ${repeat.size} of them recomputed a value that had already been worked out.`, vars: { result: res, calls }, st: st(), result: String(res) });
    return F;
  },
  render(st) {
    const N = st.nodes; const maxD = Math.max(...N.map(n => n.d));
    const W = st.slots * 44 + 20, H = (maxD + 1) * 60 + 20; const X = n => 30 + n.x * 44, Y = n => 24 + n.d * 60;
    let svg = `<svg class="tv" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Recursion tree">`;
    N.forEach(n => n.kids.forEach(k => { if (st.seen.includes(k)) svg += `<line class="edge ${st.path.includes(k) ? 'on' : ''}" x1="${X(n)}" y1="${Y(n)}" x2="${X(N[k])}" y2="${Y(N[k])}"/>`; }));
    N.forEach(n => {
      if (!st.seen.includes(n.id)) { svg += `<circle cx="${X(n)}" cy="${Y(n)}" r="3" style="fill:var(--line)"/>`; return; }
      const cur = st.path[st.path.length - 1] === n.id; const isDone = st.done[n.id] !== undefined;
      const cls = cur ? 'cur' : isDone ? 'ok' : '';
      svg += `<g class="nd ${cls}"><circle cx="${X(n)}" cy="${Y(n)}" r="16" ${st.repeat.includes(n.id) ? 'style="stroke:var(--bad);stroke-dasharray:3 2;stroke-width:2"' : ''}/><text x="${X(n)}" y="${Y(n)}">${n.n}</text></g>`;
      if (isDone) svg += `<text class="rng" x="${X(n)}" y="${Y(n) + 27}">=${st.done[n.id]}</text>`;
    });
    svg += '</svg>';
    return block('recursion tree: each node is a call F(n); "=v" is its return value; red dashed = recomputed a value already known; amber edges = the current call stack', `<div class="scroll">${svg}</div>`)
      + `<div class="row2">${block('calls so far', `<span class="big">${st.calls}</span>`)}${block('repeated calls', `<span class="big c-bad">${st.repeat.length}</span>`)}${block('stack depth', `<span class="big">${st.path.length}</span>`)}</div>`;
  }
});
