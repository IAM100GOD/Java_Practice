/* 45. f(A) = f(A-1) + f(A-2) + f(A-3) + A (Scaler) */
P.push({
  id: 'sequence-term', title: 'Sequence f(A−1)+f(A−2)+f(A−3)+A', level: 'easy', group: 'scaler-rec1', file: 'SequenceTerm.java', dir: 'scaler/adv_dsa_1/recursion_1',
  statement: 'Return the A-th term of f(A) = f(A−1) + f(A−2) + f(A−3) + A, with f(0) = 1, f(1) = 1, f(2) = 2, using recursion. Constraint: 0 ≤ A ≤ 20.',
  technique: 'Three-branch recursion with three base cases', time: 'O(1.84ᴬ)', space: 'O(A) stack',
  inputs: [{ key: 'a', label: 'A', def: '5', narrow: true }],
  samples: [['3'], ['2'], ['4'], ['5'], ['6']],
  code: "public int solve(int A) {\n    if (A == 0 || A == 1) return 1;                             // f(0) = f(1) = 1 @b01\n    if (A == 2) return 2;                                       // f(2) = 2 @b2\n    return solve(A - 1) + solve(A - 2) + solve(A - 3) + A; @rec\n}",
  steps: [
    '<strong>Write the definition directly as code:</strong> <code>solve(A−1) + solve(A−2) + solve(A−3) + A</code>.',
    '<strong>You need three base cases.</strong> The recursion reaches back up to 3 steps, so f(0), f(1) and f(2) must all be given. If only f(0) were a base case, f(1) would call f(0), f(−1) and f(−2) and never stop.',
    'Each call makes three calls, which run left to right: f(A−1) completely first, then f(A−2), then f(A−3). Then it adds the three results and A.',
    'Example: f(3) = f(2) + f(1) + f(0) + 3 = 2 + 1 + 1 + 3 = 7. f(4) = f(3) + f(2) + f(1) + 4 = 7 + 2 + 1 + 4 = 14.',
    'As with Fibonacci, the same values get recomputed (red dashed in the tree). The tree grows like 1.84ᴬ, so f(20) takes 128,287 calls. That is fine here, but a memo array or a loop would make it O(A).'
  ],
  cmp: [['Plain recursion (asked for)', 'O(1.84ᴬ)', 'O(A) stack'], ['Recursion + memo', 'O(A)', 'O(A)'], ['Loop keeping the last 3 values', 'O(A)', 'O(1)']],
  eff: 'A ≤ 20 keeps the plain recursion to about 1.3 × 10⁵ calls. The base cases have to cover every value the recursion can reach: k steps back means k base cases, or an <code>A &lt; k</code> check. The result f(20) = 300,642 fits easily in an <code>int</code>.',
  run({ a }) {
    if (!/^\d+$/.test(a.trim())) throw new Error('A must be a whole number.');
    const A = parseInt(a, 10);
    if (A > 6) throw new Error('The tree only fits A up to 6. The Java code handles up to 20.');
    const base = n => n <= 1 ? 1 : 2;
    const nodes = []; const build = (n, d) => { const id = nodes.length; const nd = { id, n, d, kids: [] }; nodes.push(nd); if (n > 2) for (const k of [1, 2, 3]) nd.kids.push(build(n - k, d + 1)); return id; };
    build(A, 0);
    let slot = 0; const place = id => { const nd = nodes[id]; if (!nd.kids.length) { nd.x = slot++; return; } nd.kids.forEach(place); nd.x = (nodes[nd.kids[0]].x + nodes[nd.kids[nd.kids.length - 1]].x) / 2; }; place(0);
    const F = []; const seen = new Set(), done = {}, repeat = new Set(), path = [], first = {}; let calls = 0;
    const st = () => ({ nodes, slots: slot, seen: [...seen], done: { ...done }, repeat: [...repeat], path: [...path], calls });
    const rec = id => {
      const nd = nodes[id]; seen.add(id); path.push(id); calls++;
      if (first[nd.n] !== undefined) repeat.add(id); else first[nd.n] = id;
      if (nd.n <= 2) { done[id] = base(nd.n); F.push({ line: nd.n === 2 ? 'b2' : 'b01', msg: `f(${nd.n}) is a base case: ${done[id]}.`, vars: { A: nd.n, returns: done[id], 'calls so far': calls }, st: st() }); path.pop(); return done[id]; }
      F.push({ line: 'rec', msg: `f(${nd.n}) = f(${nd.n - 1}) + f(${nd.n - 2}) + f(${nd.n - 3}) + ${nd.n}. Compute f(${nd.n - 1}) first.${repeat.has(id) ? ` f(${nd.n}) has already been computed elsewhere, so this is repeated work.` : ''}`, vars: { A: nd.n, 'calls so far': calls }, st: st() });
      const vals = [];
      nd.kids.forEach((k, j) => { vals.push(rec(k)); if (j < 2) F.push({ line: 'rec', msg: `f(${nd.n - 1 - j}) = ${vals[j]}. Next: f(${nd.n - 2 - j}).`, vars: { A: nd.n, [`f(${nd.n - 1 - j})`]: vals[j], 'calls so far': calls }, st: st() }); });
      const r = vals[0] + vals[1] + vals[2] + nd.n; done[id] = r;
      F.push({ line: 'rec', msg: `f(${nd.n}) = ${vals.join(' + ')} + ${nd.n} = ${r}.`, vars: { A: nd.n, returns: r, 'calls so far': calls }, st: st() });
      path.pop(); return r;
    };
    const res = rec(0);
    F.push({ line: 'rec', msg: `f(${A}) = ${res}, using ${calls} call${calls > 1 ? 's' : ''}. ${repeat.size} of them recomputed a value already known.`, vars: { result: res, calls }, st: st(), result: String(res) });
    return F;
  },
  render(st) { return P.find(p => p.id === 'find-fibonacci').render(st).replace('each node is a call F(n)', 'each node is a call f(n)'); }
});
