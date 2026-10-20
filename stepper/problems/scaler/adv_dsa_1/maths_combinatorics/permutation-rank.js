/* 37. Sorted Permutation Rank (Scaler) */
P.push({
  id: 'permutation-rank', title: 'Sorted Permutation Rank', level: 'medium', group: 'scaler-comb', file: 'SortedPermutationRank.java', dir: 'scaler/adv_dsa_1/maths_combinatorics',
  statement: 'Return the 1-based rank of A among all permutations of its characters (no repeats), sorted lexicographically, modulo 1000003. Constraint: |A| ≤ 1000.',
  technique: 'Count the permutations that come first, block by block', time: 'O(n · 256)', space: 'O(n)',
  inputs: [{ key: 's', label: 'A', def: 'cadb' }],
  samples: [['acb'], ['a'], ['cba'], ['cadb'], ['bdca']],
  code: "public int findRank(String A) {\n    final int MOD = 1_000_003;\n    int n = A.length();\n    long[] fact = new long[n + 1];\n    fact[0] = 1;\n    for (int i = 1; i <= n; i++) fact[i] = fact[i - 1] * i % MOD; @fact\n\n    boolean[] unused = new boolean[256];\n    for (int i = 0; i < n; i++) unused[A.charAt(i)] = true;\n\n    long rank = 1;\n    for (int i = 0; i < n; i++) {\n        char c = A.charAt(i);\n        int smaller = 0;\n        for (int ch = 0; ch < c; ch++) if (unused[ch]) smaller++; @count\n        rank = (rank + smaller * fact[n - 1 - i]) % MOD; @add\n        unused[c] = false;\n    }\n    return (int) rank; @ret\n}",
  steps: [
    'The rank is <strong>1 + (number of permutations that come before A)</strong>. Count those block by block instead of listing them.',
    'At position i, look at every <strong>unused</strong> character smaller than A[i]. A permutation that matches A up to position i − 1 and then puts that smaller character at position i comes before A, whatever follows.',
    'After fixing that character, the remaining n−1−i characters can be arranged any way: <code>(n−1−i)!</code> permutations per smaller character.',
    'So <code>rank = 1 + Σ smaller(i) × (n−1−i)!</code>. Mark A[i] as used before moving on. Precompute the factorials mod 1000003.',
    'Example "acb": at 0, nothing smaller than a. At 1, b &lt; c is unused, so 1 × 1! = 1 (that\'s "abc"). At 2, nothing. Rank = 1 + 1 = 2.'
  ],
  cmp: [['Generate all n! permutations, sort, find A', 'O(n! · n)', 'O(n! · n)'], ['Count smaller characters × factorials', 'O(n · alphabet)', 'O(n)']],
  eff: 'n can be 1000, and 1000! permutations cannot be listed. Each position adds one block-count, and factorials are precomputed once. Counting the unused smaller characters scans a 256-entry table, so the total is about 1000 × 256 steps. A Fenwick tree would bring that down to O(n log n), but that is not needed here.',
  run({ s }) {
    const A = s; const n = A.length;
    if (!n) throw new Error('A cannot be empty.');
    if (new Set(A).size !== n) throw new Error('Characters must not repeat.');
    if (n > 8) throw new Error('Use 8 characters or fewer so the picture fits.');
    const fact = [1]; for (let i = 1; i <= n; i++) fact.push(fact[i - 1] * i);
    const F = []; let rank = 1; const unused = new Set(A); const contrib = [];
    const st = (i, smaller) => ({ A, i, unused: [...unused].sort(), smaller: smaller ? [...smaller] : [], contrib: clone(contrib), rank, fact, n });
    F.push({ line: 'fact', msg: `Precompute factorials: ${fact.map((f, k) => `${k}! = ${f}`).join(', ')}. rank starts at 1.`, vars: { n, rank }, st: st(-1) });
    for (let i = 0; i < n; i++) {
      const c = A[i]; const smaller = [...unused].filter(ch => ch < c).sort();
      F.push({ line: 'count', msg: smaller.length ? `Position ${i}, A[${i}] = '${c}'. The unused characters smaller than '${c}' are ${smaller.map(x => `'${x}'`).join(', ')}. Each of them could go here instead.` : `Position ${i}, A[${i}] = '${c}'. No unused character is smaller, so nothing here comes before A.`, vars: { i, c: `'${c}'`, smaller: smaller.length }, st: st(i, smaller) });
      const add = smaller.length * fact[n - 1 - i]; rank += add; contrib.push({ i, c, k: smaller.length, f: n - 1 - i, add });
      F.push({ line: 'add', msg: `${smaller.length} × ${n - 1 - i}! = ${smaller.length} × ${fact[n - 1 - i]} = ${add} permutations come first at this position. rank = ${rank}.`, vars: { i, smaller: smaller.length, [`(${n - 1 - i})!`]: fact[n - 1 - i], rank }, st: st(i, smaller) });
      unused.delete(c);
    }
    F.push({ line: 'ret', msg: `${rank - 1} permutations come before "${A}", so its rank is ${rank}.`, vars: { rank }, st: st(n), result: String(rank % 1000003) });
    return F;
  },
  render(st) {
    const grid = cells([...st.A], { cls: k => k < st.i ? 'ok' : k === st.i ? 'cur t2' : '', top: k => k === st.i ? [['i', 'c-acc']] : [] });
    const pool = st.i >= 0 && st.i < st.n ? tokens(st.unused.map(ch => `'${ch}'`), j => st.smaller.includes(st.unused[j]) ? 'bad' : st.unused[j] === st.A[st.i] ? 'new' : '') : '<span class="empty">—</span>';
    let list = '';
    if (st.n <= 4) {
      const perms = []; const rec = (pre, rest) => { if (!rest.length) return perms.push(pre); [...rest].sort().forEach(ch => rec(pre + ch, rest.filter(x => x !== ch))); };
      rec('', [...st.A]); const target = perms.indexOf(st.A); const counted = st.rank - 1;
      list = block('all permutations, sorted (red = already counted as coming first)', tokens(perms.map((p, k) => `${k + 1}. ${p}`), k => k === target && st.i >= st.n ? 'ok' : k < counted ? 'bad' : k === target ? 'new' : ''));
    }
    return block('A (green = matched prefix, amber = current position)', grid)
      + `<div class="row2">${block('unused characters (red = smaller than A[i])', pool)}${block('rank', `<span class="big c-ok">${st.rank}</span>`)}</div>`
      + block('blocks that come first', st.contrib.length ? tokens(st.contrib.map(c => `i=${c.i}: ${c.k} × ${c.f}! = ${c.add}`), j => st.contrib[j].add ? 'bad' : '') : '<span class="empty">none yet</span>')
      + list;
  }
});
