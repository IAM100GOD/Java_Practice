/* 32. Number Of Open Doors (Scaler) */
P.push({
  id: 'open-doors', title: 'Number of Open Doors', level: 'easy', group: 'scaler-primes', file: 'NumberOfOpenDoors.java', dir: 'scaler/adv_dsa_1/maths_prime_numbers',
  statement: 'A doors start closed. On go i (i = 1..A), toggle every door whose number is a multiple of i. Return how many doors are open at the end. Constraint: A ≤ 10⁹.',
  technique: 'Odd divisor count ⇔ perfect square, so the answer is ⌊√A⌋', time: 'O(1)', space: 'O(1)',
  inputs: [{ key: 'a', label: 'A', def: '20', narrow: true }],
  samples: [['5'], ['6'], ['20'], ['36']],
  code: "public int solve(int A) {\n    long r = (long) Math.sqrt(A); @sqrt\n    while (r * r > A) r--;                 // guard against floating-point rounding\n    while ((r + 1) * (r + 1) <= A) r++; @fix\n    return (int) r; @ret\n}",
  steps: [
    'Door d is toggled on go i exactly when <strong>i divides d</strong>. So the number of toggles is the number of divisors of d.',
    'All doors start closed, so a door ends open exactly when it was toggled an <strong>odd</strong> number of times.',
    'Divisors come in pairs <code>(i, d/i)</code>: for 12, those are (1, 12), (2, 6) and (3, 4), an even count. A pair only becomes a single divisor when <code>i = d/i</code>, which means <code>d = i²</code>. For 16, the pairs are (1, 16), (2, 8), and then 4 on its own, an odd count.',
    'So exactly the <strong>perfect squares</strong> end open: 1, 4, 9, 16, … The number of squares ≤ A is ⌊√A⌋.',
    '<code>Math.sqrt</code> works on doubles, so the two while loops correct a possible off-by-one near a perfect square. Use <code>long</code> so <code>(r+1)²</code> cannot overflow.'
  ],
  cmp: [['Simulate all A goes', 'O(A log A), 10⁹ is too slow', 'O(A)'], ['Count divisors of each door', 'O(A √A)', 'O(1)'], ['⌊√A⌋', 'O(1)', 'O(1)']],
  eff: 'Simulating with A = 10⁹ would mean about 2 × 10¹⁰ toggles and a billion booleans. Noticing that "toggled once per divisor" means "open only if a perfect square" reduces the whole process to one square root. It is the same pairing idea you use when counting divisors up to √n.',
  run({ a }) {
    const A = parseInt(a, 10);
    if (!/^\d+$/.test(a.trim()) || A < 1) throw new Error('A must be a positive whole number.');
    if (A > 60) throw new Error('The picture only fits A up to 60. The Java code handles up to 10⁹.');
    const F = []; const r = Math.floor(Math.sqrt(A));
    const open = Array(A + 1).fill(false), tog = Array(A + 1).fill(0);
    const st = (phase, go = 0, hit = []) => ({ A, open: [...open], tog: [...tog], phase, go, hit, r });
    F.push({ line: 'sqrt', msg: `r = (long) Math.sqrt(${A}) = ${r}.`, vars: { r }, st: st('code') });
    F.push({ line: 'fix', msg: `${r}² = ${r * r} ≤ ${A} < ${(r + 1) * (r + 1)} = ${r + 1}², so r is exactly ⌊√${A}⌋ and the correction loops change nothing.`, vars: { r, 'r²': r * r, '(r+1)²': (r + 1) * (r + 1) }, st: st('code') });
    F.push({ line: 'ret', msg: `${r} perfect squares ≤ ${A}: ${[...Array(r).keys()].map(k => (k + 1) ** 2).join(', ')}. The next steps simulate the doors to show it.`, vars: { r }, st: st('squares'), result: String(r) });
    for (let go = 1; go <= A; go++) {
      const hit = []; for (let d = go; d <= A; d += go) { open[d] = !open[d]; tog[d]++; hit.push(d); }
      F.push({ line: 'ret', msg: `Go ${go}: toggle ${hit.length > 10 ? hit.slice(0, 10).join(', ') + ', …' : hit.join(', ')}. ${open.filter(Boolean).length} open now.`, vars: { go, toggled: hit.length, open: open.filter(Boolean).length }, st: st('sim', go, hit) });
    }
    const final = open.map((v, d) => v ? d : 0).filter(Boolean);
    F.push({ line: 'ret', msg: `Doors left open: ${final.join(', ')}. These are exactly the perfect squares, each toggled an odd number of times.`, vars: { open: final.length }, st: st('done'), result: String(r) });
    return F;
  },
  render(st) {
    const isSq = d => Math.round(Math.sqrt(d)) ** 2 === d;
    let g = '<div class="scroll"><div class="spiral" style="grid-template-columns:repeat(10, 40px)">';
    for (let d = 1; d <= st.A; d++) {
      const showOpen = st.phase === 'sim' || st.phase === 'done' ? st.open[d] : st.phase === 'squares' && isSq(d);
      const hot = st.hit.includes(d);
      const cls = [hot ? 'cur' : '', showOpen ? 'ok' : (st.phase === 'sim' || st.phase === 'done') ? 'dim' : ''].join(' ');
      g += `<div class="cell ${cls}" style="width:40px;height:40px;display:flex;flex-direction:column;line-height:1.1;font-size:.8rem;${showOpen ? '' : 'border-style:solid'}"><span>${d}</span><span style="font-size:.58rem;opacity:.85">${st.phase === 'sim' || st.phase === 'done' ? (st.open[d] ? 'open' : 'shut') + ' ·' + st.tog[d] : isSq(d) ? `${Math.sqrt(d)}²` : ''}</span></div>`;
    }
    g += '</div></div>';
    const label = st.phase === 'sim' ? `doors after go ${st.go} (amber outline = toggled now; number = toggles so far)` : st.phase === 'done' ? 'final doors (toggle count = number of divisors)' : 'doors (green = perfect square)';
    return block(label, g) + `<div class="row2">${block('⌊√A⌋', `<span class="big c-ok">${st.r}</span>`)}${st.phase === 'sim' || st.phase === 'done' ? block('open now', `<span class="big">${st.open.filter(Boolean).length}</span>`) : ''}</div>`;
  }
});
