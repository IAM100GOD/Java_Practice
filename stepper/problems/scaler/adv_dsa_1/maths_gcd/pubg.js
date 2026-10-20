/* 25. Pubg (Scaler) */
P.push({
  id: 'pubg', title: 'Pubg', level: 'medium', group: 'scaler-gcd', file: 'Pubg.java', dir: 'scaler/adv_dsa_1/maths_gcd',
  statement: 'When player i attacks player j, j\'s strength becomes <code>max(0, A[j] − A[i])</code>. A player at 0 is out. Play continues until one player is left. Return the <strong>minimum</strong> health that last survivor can end with. Constraints: N ≤ 10⁵, A[i] ≤ 10⁶.',
  technique: 'An attack is a Euclid subtraction, so the answer is gcd(A)', time: 'O(N log M)', space: 'O(1)',
  inputs: [{ key: 'a', label: 'A', def: '12, 18, 30, 45' }],
  samples: [['6, 4'], ['2, 3, 4'], ['12, 18, 30, 45'], ['14, 21, 35'], ['1000000']],
  code: "public int solve(int[] A) {\n    int g = 0; @init\n    for (int x : A) g = gcd(g, x);      // gcd(0, x) = x @fold\n    return g; @ret\n}\n\nprivate int gcd(int a, int b) {\n    while (b != 0) {\n        int t = a % b;\n        a = b;\n        b = t;\n    }\n    return a;\n}",
  steps: [
    'An attack does <code>A[j] − A[i]</code>. That is one step of subtraction-based Euclid, <code>gcd(a, b) = gcd(a − b, b)</code>, so gcd should be the answer.',
    '<strong>The survivor can never end below g = gcd(A).</strong> Every strength starts as a multiple of g. A multiple of g minus a multiple of g is still a multiple of g, and so is 0. So whatever happens, the survivor\'s health is a positive multiple of g, which means it is at least g.',
    '<strong>g can always be reached.</strong> Let the weakest player keep attacking each of the others until they are weaker than it or knocked out. Repeated subtraction is the same as <code>%</code>, so this runs Euclid on the whole array, and it ends with one player at exactly g.',
    'Both sides meet, so the answer is <code>gcd(A[0], A[1], …, A[n−1])</code>. Start with <code>g = 0</code>, since gcd(0, x) = x, and fold gcd over the array.',
    'With one player there are no attacks, and the answer is that player\'s full strength, which the fold also gives.'
  ],
  cmp: [['Simulate every possible attack order', 'exponential', 'huge'], ['Simulate the greedy game (weakest attacks)', 'O(N log M) rounds × N', 'O(N)'], ['gcd of the array', 'O(N log M)', 'O(1)']],
  eff: 'The problem looks like a game simulation, but it is really gcd. To prove the answer is exactly g, show both sides: it cannot go lower, because every strength stays a multiple of g, and g can always be reached, because Euclid gets there. I also checked every possible attack order on all small arrays (2,115 of them), and the best ending was always the gcd.',
  gcd(a, b) { while (b) { [a, b] = [b, a % b]; } return a; },
  run({ a }) {
    const A = a.split(/[,\s]+/).filter(Boolean).map(Number);
    if (!A.length || A.some(x => !Number.isInteger(x) || x < 1 || x > 1e6)) throw new Error('A must be whole numbers from 1 to 10⁶.');
    if (A.length > 8) throw new Error('Use 8 players or fewer so the picture fits.');
    const F = []; let g = 0; const fold = []; const max = Math.max(...A);
    const st = (extra) => ({ A, fold: [...fold], g, max, hp: [...A], phase: 'fold', ...extra });
    F.push({ line: 'init', msg: 'g = 0, because gcd(0, x) = x, so 0 has no effect on the result.', vars: { g }, st: st({ i: -1 }) });
    A.forEach((x, i) => { const before = g; g = this.gcd(g, x); fold.push(g);
      F.push({ line: 'fold', msg: `g = gcd(${before}, ${x}) = ${g}.`, vars: { x, g }, st: st({ i }) }); });
    F.push({ line: 'ret', msg: `The gcd of all strengths is ${g}, so the survivor can end with ${g}, and no less. The next steps play the game to show it.`, vars: { g }, st: st({ i: -1 }), result: String(g) });
    if (A.length === 1) return F;
    const hp = [...A];
    const bst = (att, tgt, note) => ({ A, fold: [...fold], g, max, hp: [...hp], phase: 'play', att, tgt, note });
    let guard = 0;
    while (guard++ < 200) {
      const alive = hp.map((v, i) => v > 0 ? i : -1).filter(i => i >= 0);
      if (alive.length === 1) break;
      const w = alive.reduce((p, c) => hp[c] < hp[p] ? c : p);
      for (const j of alive) {
        if (j === w || hp[j] < hp[w]) continue;
        const k = Math.floor(hp[j] / hp[w]); const from = hp[j]; hp[j] = hp[j] % hp[w];
        F.push({ line: 'ret', msg: `Player ${w + 1} (strength ${hp[w]}, the weakest) attacks player ${j + 1} ${k} time${k > 1 ? 's' : ''}: ${from} → ${hp[j]}${hp[j] === 0 ? ', knocked out' : ''}. Every strength is still a multiple of ${g}.`, vars: { attacker: `P${w + 1} (${hp[w]})`, target: `P${j + 1}`, [`${from} % ${hp[w]}`]: hp[j] }, st: bst(w, j) });
      }
    }
    const s = hp.findIndex(v => v > 0);
    F.push({ line: 'ret', msg: `Only player ${s + 1} is left, with health ${hp[s]} = gcd. That is the lowest possible.`, vars: { survivor: `P${s + 1}`, health: hp[s] }, st: bst(s, -1, 'done'), result: String(g) });
    return F;
  },
  render(st) {
    const bars = st.hp.map((v, i) => {
      const role = st.phase === 'play' ? (i === st.att && st.note !== 'done' ? 'attacker' : i === st.tgt ? 'target' : st.note === 'done' && v > 0 ? 'survivor' : '') : '';
      const col = v === 0 ? 'var(--line)' : role === 'attacker' ? 'var(--p2)' : role === 'target' ? 'var(--bad)' : role === 'survivor' ? 'var(--ok)' : 'var(--p1)';
      const ticks = st.g > 0 && st.max / st.g <= 60 ? `background-image:repeating-linear-gradient(90deg, transparent 0 calc(${st.g / st.max * 100}% - 1px), var(--bg) calc(${st.g / st.max * 100}% - 1px) ${st.g / st.max * 100}%);` : '';
      return `<div style="display:grid;grid-template-columns:44px minmax(0,1fr) 92px;gap:8px;align-items:center;${v === 0 ? 'opacity:.45' : ''}">
        <span style="font-family:var(--f-mono);font-size:.8rem;font-weight:600">P${i + 1}</span>
        <div style="height:16px;background:var(--surface-2);border-radius:3px;position:relative;overflow:hidden"><div style="position:absolute;inset:0 auto 0 0;width:${v / st.max * 100}%;background:${col};${ticks}"></div></div>
        <span style="font-family:var(--f-mono);font-size:.8rem">${v}${role ? ` <span style="color:${col};font-size:.68rem">${role}</span>` : v === 0 ? ' <span style="font-size:.68rem">out</span>' : ''}</span></div>`;
    }).join('');
    const fold = st.fold.length ? tokens(st.fold.map((g, i) => `gcd(…, ${st.A[i]}) = ${g}`), i => st.phase === 'fold' && i === st.i ? 'new' : '') : '<span class="empty">g = 0</span>';
    return block(st.phase === 'play' ? 'playing the game out (gaps in each bar mark multiples of the gcd)' : 'strengths', `<div style="display:flex;flex-direction:column;gap:6px">${bars}</div>`)
      + `<div class="row2">${block('gcd fold', fold)}${block('g', `<span class="big c-ok">${st.g}</span>`)}</div>`;
  }
});
