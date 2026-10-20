/* 46. Tower of Hanoi (Scaler) */
P.push({
  id: 'tower-of-hanoi', title: 'Tower of Hanoi', level: 'medium', group: 'scaler-rec2', file: 'TowerOfHanoi.java', dir: 'scaler/adv_dsa_1/recursion_2',
  statement: 'Move A disks from tower 1 to tower 3, one at a time, never putting a disk on a smaller one. Return the minimum list of moves as rows <code>[disk, from, to]</code>. Constraint: A ≤ 18.',
  technique: 'Recursion: move n−1 away, move disk n, move n−1 back', time: 'O(2ᴬ)', space: 'O(A) stack (+ output)',
  inputs: [{ key: 'a', label: 'A', def: '3', narrow: true }],
  samples: [['1'], ['2'], ['3'], ['4']],
  code: "public int[][] towerOfHanoi(int A) {\n    moves = new int[(1 << A) - 1][];\n    idx = 0;\n    hanoi(A, 1, 3, 2); @start\n    return moves; @ret\n}\n\nprivate void hanoi(int n, int from, int to, int via) {\n    if (n == 0) return;                           // nothing to move\n    hanoi(n - 1, from, via, to);                  // clear the n-1 smaller disks onto `via` @first\n    moves[idx++] = new int[]{n, from, to};        // move the biggest disk directly @move\n    hanoi(n - 1, via, to, from);                  // put the n-1 disks back on top of it\n}",
  steps: [
    '<strong>Think about the biggest disk, n.</strong> It can only move when every smaller disk is off it, and the target tower must be empty, because nothing is bigger than n. So all n−1 smaller disks must be on the third tower, <code>via</code>, first.',
    'That gives three steps: <strong>(1)</strong> move n−1 disks <code>from → via</code>, <strong>(2)</strong> move disk n <code>from → to</code>, <strong>(3)</strong> move the n−1 disks <code>via → to</code>, on top of it.',
    'Steps 1 and 3 are the same problem with one fewer disk and the towers playing different roles, so trust the recursion. <strong>Base case:</strong> n = 0 means there is nothing to move.',
    'Count of moves: <code>M(n) = 2·M(n−1) + 1</code>, with M(0) = 0, which gives <strong>2ⁿ − 1</strong>. Every step is forced, so this is the minimum, and it is the only minimal solution, as the problem says.',
    'Pre-size the answer array to 2ᴬ − 1 rows and fill it with a running index. A = 18 gives 262,143 rows, and the recursion is never more than 18 levels deep.'
  ],
  cmp: [['Search over all move sequences (BFS)', 'O(3ᴬ) states', 'O(3ᴬ)'], ['Recursion', 'O(2ᴬ), which equals the output size', 'O(A) stack'], ['Iterative (move disk 1 cyclically)', 'O(2ᴬ)', 'O(A)']],
  eff: 'The answer has 2ᴬ − 1 rows, so no solution can be faster than O(2ᴬ). The recursion produces exactly those moves with no wasted work, and its depth is only A. Deciding where disk n goes first (n−1 to via, n to target, n−1 back) is a good model for recursion in general: describe a solution for n in terms of solutions for n−1.',
  run({ a }) {
    if (!/^\d+$/.test(a.trim())) throw new Error('A must be a whole number.');
    const A = parseInt(a, 10);
    if (A < 1 || A > 5) throw new Error('The animation fits A from 1 to 5. The Java code handles up to 18.');
    const towers = { 1: [], 2: [], 3: [] }; for (let d = A; d >= 1; d--) towers[1].push(d);
    const F = []; const stack = []; const moves = []; let last = null;
    const st = () => ({ A, towers: clone(towers), stack: clone(stack), moves: clone(moves), last });
    const rec = (n, from, to, via) => {
      if (n === 0) return;
      stack.push({ call: `hanoi(${n}, ${from}→${to}, via ${via})`, detail: '', state: 'active' }); const me = stack[stack.length - 1];
      if (n > 1) { last = null; me.detail = `step 1: move ${n - 1} disk${n - 1 > 1 ? 's' : ''} ${from}→${via}`;
        F.push({ line: 'first', msg: `To move ${n} disk${n > 1 ? 's' : ''} from ${from} to ${to}, first clear the ${n - 1} smaller disk${n - 1 > 1 ? 's' : ''} from ${from} onto ${via}.`, vars: { n, from, to, via }, st: st() }); }
      me.state = 'waiting'; rec(n - 1, from, via, to); me.state = 'active';
      towers[to].push(towers[from].pop()); moves.push([n, from, to]); last = [n, from, to];
      me.detail = n > 1 ? `step 3: move ${n - 1} disk${n - 1 > 1 ? 's' : ''} ${via}→${to}` : 'single disk';
      F.push({ line: 'move', msg: `Move ${moves.length}: disk ${n} from tower ${from} to tower ${to}.${n > 1 ? ` Now put the ${n - 1} smaller disk${n - 1 > 1 ? 's' : ''} from ${via} back on top of it.` : ''}`, vars: { n, from, to, 'moves so far': moves.length }, st: st() });
      me.state = 'waiting'; rec(n - 1, via, to, from);
      stack.pop();
    };
    F.push({ line: 'start', msg: `All ${A} disks are on tower 1. Call hanoi(${A}, 1 → 3, via 2).`, vars: { A, 'expected moves': 2 ** A - 1 }, st: st() });
    rec(A, 1, 3, 2); last = null;
    F.push({ line: 'ret', msg: `All ${A} disks are on tower 3 after ${moves.length} = 2^${A} − 1 moves.`, vars: { moves: moves.length }, st: st(), result: moves.map(m => `[${m.join(' ')}]`).join(' ') });
    return F;
  },
  render(st) {
    const W = 480, H = 40 + st.A * 22, pegX = [0, 85, 240, 395], baseY = H - 14;
    let svg = `<svg class="tv" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Towers" style="max-width:100%">`;
    svg += `<rect x="10" y="${baseY}" width="${W - 20}" height="6" rx="3" style="fill:var(--muted)"/>`;
    [1, 2, 3].forEach(t => { svg += `<rect x="${pegX[t] - 3}" y="18" width="6" height="${baseY - 18}" rx="3" style="fill:var(--line)"/><text class="plab c-acc" x="${pegX[t]}" y="12">tower ${t}</text>`;
      st.towers[t].forEach((d, k) => { const w = 26 + d * 22; const hot = st.last && st.last[0] === d;
        svg += `<g class="nd ${hot ? 'cur' : ''}"><rect x="${pegX[t] - w / 2}" y="${baseY - 20 * (k + 1)}" width="${w}" height="18" rx="5" style="fill:${hot ? 'var(--p2-soft)' : 'var(--p1-soft)'};stroke:${hot ? 'var(--p2)' : 'var(--p1)'}"/><text x="${pegX[t]}" y="${baseY - 20 * (k + 1) + 9}">${d}</text></g>`; }); });
    svg += '</svg>';
    const ml = st.moves.length ? tokens(st.moves.map((m, i) => `${i + 1}: [${m.join(' ')}]`), i => i === st.moves.length - 1 && st.last ? 'new' : '') : '<span class="empty">no moves yet</span>';
    return block('towers (amber = disk just moved)', `<div class="scroll">${svg}</div>`) + block('moves [disk from to]', ml) + callStackView(st.stack);
  }
});
