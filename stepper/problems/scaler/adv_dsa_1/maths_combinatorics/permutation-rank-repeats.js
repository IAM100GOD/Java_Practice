/* 38. Sorted Permutation Rank with Repeats (Scaler) */
P.push({
  id: 'permutation-rank-repeats', title: 'Permutation Rank with Repeats', level: 'hard', group: 'scaler-comb', file: 'SortedPermutationRankWithRepeats.java', dir: 'scaler/adv_dsa_1/maths_combinatorics',
  statement: 'Return the rank of A among its <strong>unique</strong> permutations, sorted by ASCII value (so <code>\'Z\' &lt; \'a\'</code>), modulo 1000003. Characters may repeat. Constraint: |A| ≤ 10⁶.',
  technique: 'Count blocks with multinomials, keep one running inverse', time: 'O(n · 128)', space: 'O(n)',
  inputs: [{ key: 's', label: 'A', def: 'baca' }],
  samples: [['aba'], ['bca'], ['baca'], ['bbaa'], ['aZ']],
  code: "public int findRank(String A) {\n    final long MOD = 1_000_003L;\n    int n = A.length();\n    long[] fact = new long[n + 1];\n    fact[0] = 1;\n    for (int i = 1; i <= n; i++) fact[i] = fact[i - 1] * i % MOD;\n\n    int[] cnt = new int[128];                         // A has only letters (ASCII < 128)\n    for (int i = 0; i < n; i++) cnt[A.charAt(i)]++;\n\n    long denom = 1;                                   // product of cnt[ch]! over all characters\n    for (int ch = 0; ch < 128; ch++) denom = denom * fact[cnt[ch]] % MOD;\n    long invDenom = power(denom, MOD - 2, MOD); @init\n\n    long rank = 1;\n    for (int i = 0; i < n; i++) {\n        char c = A.charAt(i);\n        long smaller = 0;\n        for (int ch = 0; ch < c; ch++) smaller += cnt[ch]; @count\n        rank = (rank + fact[n - 1 - i] * smaller % MOD * invDenom) % MOD; @add\n        invDenom = invDenom * cnt[c] % MOD;           // cnt[c]! -> (cnt[c]-1)!: product loses a factor cnt[c] @upd\n        cnt[c]--;\n    }\n    return (int) rank; @ret\n}\n\nprivate long power(long base, long exp, long mod) {\n    long result = 1 % mod;\n    base %= mod;\n    while (exp > 0) {\n        if ((exp & 1) == 1) result = result * base % mod;\n        base = base * base % mod;\n        exp >>= 1;\n    }\n    return result;\n}",
  steps: [
    'As before, rank = 1 + (number of unique permutations before A). With repeated letters, the number of unique arrangements of a multiset is <code>len! / Π cnt[ch]!</code>.',
    'At position i, with <code>rem</code> characters left: putting a smaller character x here leaves <code>(rem−1)! / Π cnt′!</code> arrangements, where cnt′ is the counts with one x removed. That equals <code>(rem−1)! × cnt[x] / Π cnt!</code>.',
    'Adding this up over every x &lt; A[i]: <code>before += (rem−1)! × (Σ cnt[x] for x &lt; A[i]) / Π cnt!</code>. A character with count 0 adds nothing, and one with a larger count adds a bigger block.',
    'Dividing by Π cnt! needs a modular inverse. 1000003 is prime and every factorial involved is of a number ≤ 10⁶ &lt; p, so it is never 0 mod p. Compute <code>invDenom</code> once with Fermat.',
    'After using A[i], cnt[A[i]]! becomes (cnt[A[i]]−1)!, so the product loses a factor of cnt[A[i]]. Update with <code>invDenom × cnt[A[i]]</code>. No further inverses are needed.'
  ],
  cmp: [['Generate unique permutations, sort, search', 'O(n!) or worse', 'huge'], ['Recompute Π cnt! and its inverse each step', 'O(n · (128 + log p))', 'O(n)'], ['One inverse + running update', 'O(n · 128)', 'O(n)']],
  eff: 'With n = 10⁶, the work per position has to be small. The count of smaller characters scans 128 entries, the factorial is precomputed, and the running inverse costs one multiplication. That is about 1.3 × 10⁸ simple steps, and Java runs the 10⁶-character test in 35 ms. The update <code>invDenom × cnt[c]</code> avoids running a fast power at every position.',
  run({ s }) {
    const A = s; const n = A.length;
    if (!n) throw new Error('A cannot be empty.');
    if (!/^[A-Za-z]+$/.test(A)) throw new Error('A may contain letters only.');
    if (n > 8) throw new Error('Use 8 characters or fewer so the picture fits.');
    const f = [1n]; for (let i = 1; i <= n; i++) f.push(f[i - 1] * BigInt(i));
    const cnt = {}; for (const ch of A) cnt[ch] = (cnt[ch] || 0) + 1;
    const denom = () => Object.values(cnt).reduce((acc, c) => acc * f[c], 1n);
    const F = []; let rank = 1n; const contrib = [];
    const st = (i, extra = {}) => ({ A, i, cnt: { ...cnt }, rank: String(rank), contrib: clone(contrib), n, ...extra });
    F.push({ line: 'init', msg: `Counts: ${Object.keys(cnt).sort().map(k => `${k}×${cnt[k]}`).join(', ')}. Π cnt! = ${denom()}. Compute its inverse mod p once.`, vars: { 'Π cnt!': String(denom()) }, st: st(-1) });
    for (let i = 0; i < n; i++) {
      const c = A[i]; const smallerChars = Object.keys(cnt).filter(x => x < c && cnt[x] > 0).sort();
      const S = smallerChars.reduce((a, x) => a + cnt[x], 0); const D = denom(); const rem = n - i;
      F.push({ line: 'count', msg: S ? `Position ${i}, '${c}'. Characters left that are smaller: ${smallerChars.map(x => `'${x}'×${cnt[x]}`).join(', ')}. Σ cnt = ${S}.` : `Position ${i}, '${c}'. No smaller character is left.`, vars: { i, c: `'${c}'`, smaller: S, rem }, st: st(i, { sm: smallerChars }) });
      const add = f[rem - 1] * BigInt(S) / D; rank += add; contrib.push({ i, c, S, rem, D: String(D), add: String(add) });
      F.push({ line: 'add', msg: `(${rem}−1)! × ${S} / Π cnt! = ${f[rem - 1]} × ${S} / ${D} = ${add} unique permutations come first. rank = ${rank}.`, vars: { [`(${rem - 1})!`]: String(f[rem - 1]), 'Σ smaller cnt': S, 'Π cnt!': String(D), rank: String(rank) }, st: st(i, { sm: smallerChars }) });
      const before = cnt[c]; cnt[c]--;
      F.push({ line: 'upd', msg: `Use one '${c}': cnt['${c}'] goes ${before} → ${before - 1}, so Π cnt! loses a factor of ${before}. invDenom ×= ${before}.`, vars: { [`cnt['${c}']`]: cnt[c], 'Π cnt! now': String(denom()) }, st: st(i, { sm: [] }) });
    }
    F.push({ line: 'ret', msg: `${rank - 1n} unique permutations come before "${A}", so its rank is ${rank}.`, vars: { rank: String(rank) }, st: st(n), result: String(rank % 1000003n) });
    return F;
  },
  render(st) {
    const grid = cells([...st.A], { cls: k => k < st.i ? 'ok' : k === st.i ? 'cur t2' : '', top: k => k === st.i ? [['i', 'c-acc']] : [] });
    const keys = Object.keys(st.cnt).sort();
    const counts = `<div class="buckets">${keys.map(k => `<div class="bk ${k === st.A[st.i] ? 'on' : ''}" ${st.sm && st.sm.includes(k) ? 'style="outline:2px solid var(--bad);outline-offset:2px;border-radius:4px"' : ''}><span class="ch">${k}</span><span class="ct">${st.cnt[k]}</span>${'<span class="sq"></span>'.repeat(st.cnt[k])}</div>`).join('')}</div>`;
    let list = '';
    if (st.n <= 5) {
      const out = []; const rec = (pre, rest) => { if (!rest.length) return out.push(pre); [...new Set(rest)].sort().forEach(ch => { const r = [...rest]; r.splice(r.indexOf(ch), 1); rec(pre + ch, r); }); };
      rec('', [...st.A]); const target = out.indexOf(st.A); const counted = Number(st.rank) - 1;
      list = block(`all ${out.length} unique permutations (red = already counted as coming first)`, tokens(out.map((p, k) => `${k + 1}. ${p}`), k => k === target && st.i >= st.n ? 'ok' : k < counted ? 'bad' : k === target ? 'new' : ''));
    }
    return block('A', grid)
      + `<div class="row2">${block('counts left (red outline = smaller than A[i])', `<div class="scroll">${counts}</div>`)}${block('rank', `<span class="big c-ok">${st.rank}</span>`)}</div>`
      + block('blocks that come first', st.contrib.length ? tokens(st.contrib.map(c => `i=${c.i}: ${c.rem - 1}!×${c.S}/${c.D} = ${c.add}`), j => st.contrib[j].add !== '0' ? 'bad' : '') : '<span class="empty">none yet</span>')
      + list;
  }
});
