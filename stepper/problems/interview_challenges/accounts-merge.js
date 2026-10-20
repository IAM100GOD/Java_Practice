/* 10. Accounts Merge */
P.push({
  id: 'accounts-merge', title: 'Accounts Merge', level: 'medium', file: 'AccountsMerge.java',
  statement: 'Each account is a name followed by emails. Two accounts belong to the same person if they share an email. Merge them, and return each person with their emails sorted.',
  technique: 'Union-Find with path compression + union by rank', time: 'O(E·α(E) + E log E)', space: 'O(E)',
  inputs: [{ key: 'acc', label: 'accounts (one per line: Name: email, email)', area: true, def: 'John: js@mail, jny@mail\nJohn: js@mail, j00@mail\nMary: mary@mail\nJohn: jb@mail\nJohn: jb@mail, j00@mail' }],
  samples: [['John: js@mail, jny@mail\nJohn: js@mail, j00@mail\nMary: mary@mail\nJohn: jb@mail\nJohn: jb@mail, j00@mail'], ['John: js@mail, jny@mail\nJohn: js@mail, j00@mail\nMary: mary@mail\nJohn: jb@mail'], ['Ana: a@x, b@x\nAna: c@x, d@x\nAna: b@x, c@x']],
  code: "static int find(int x) {\n    if (parent[x] != x) parent[x] = find(parent[x]);   // path compression @find\n    return parent[x];\n}\n\nstatic void union(int a, int b) {\n    int ra = find(a), rb = find(b);\n    if (ra == rb) return; @same\n    if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }\n    parent[rb] = ra;                                    // attach shorter tree under taller @link\n    if (rank[ra] == rank[rb]) rank[ra]++;\n}\n\npublic static List<List<String>> accountsMerge(List<List<String>> accounts) {\n    Map<String, Integer> idOf = new HashMap<>();\n    Map<String, String> nameOf = new HashMap<>();\n    for (List<String> acc : accounts) {\n        for (int i = 1; i < acc.size(); i++) {\n            idOf.putIfAbsent(acc.get(i), idOf.size()); @ids\n            nameOf.put(acc.get(i), acc.get(0));\n        }\n    }\n\n    parent = new int[idOf.size()];\n    rank = new int[idOf.size()];\n    for (int i = 0; i < parent.length; i++) parent[i] = i; @initp\n\n    for (List<String> acc : accounts) {\n        int first = idOf.get(acc.get(1));\n        for (int i = 2; i < acc.size(); i++) {\n            union(first, idOf.get(acc.get(i))); @union\n        }\n    }\n\n    Map<Integer, List<String>> groups = new LinkedHashMap<>();\n    for (String email : idOf.keySet()) {\n        groups.computeIfAbsent(find(idOf.get(email)), k -> new ArrayList<>()).add(email); @group\n    }\n\n    List<List<String>> result = new ArrayList<>();\n    for (List<String> emails : groups.values()) {\n        Collections.sort(emails);\n        List<String> merged = new ArrayList<>();\n        merged.add(nameOf.get(emails.get(0)));\n        merged.addAll(emails);\n        result.add(merged);\n    }\n    return result; @ret\n}",
  steps: [
    'Give each distinct email a number (id). Each email starts out as its own one-member set.',
    'Every email in an account belongs to the same person, so <code>union</code> it with that account\'s first email.',
    'Because sets join through shared emails, accounts link up even when they are not next to each other. In the default example, account 5 joins accounts 2 and 4 into the same person as account 1.',
    '<code>find</code> follows parent links up to the root, then points every node it passed directly at the root (path compression).',
    'At the end, emails with the same root belong to one person. Group them, sort each group, and put the name in front.'
  ],
  cmp: [['Compare every pair of accounts, merge, repeat until stable', 'O(A² · L) per round', 'O(E)'], ['Build email graph, DFS connected components', 'O(E log E)', 'O(E) adjacency'], ['Union-Find', 'O(E·α + E log E)', 'O(E) two int[]']],
  eff: 'α(E), the inverse Ackermann function, is no more than 4 for any realistic input, so each union or find is effectively constant time. Most of the cost is sorting the final email lists. The DFS approach costs about the same, but Union-Find needs no adjacency lists.',
  parse({ acc }) {
    const A = acc.split('\n').map(l => l.trim()).filter(Boolean).map(l => { const m = l.match(/^([^:]+):\s*(.+)$/); if (!m) throw new Error(`Line "${l}" should look like  Name: email1, email2`); return [m[1].trim(), ...m[2].split(/,\s*/).map(e => e.trim()).filter(Boolean)]; });
    if (!A.length) throw new Error('Add at least one account.');
    return A;
  },
  run(inp) {
    const A = this.parse(inp); const F = []; const idOf = {}, emails = [], nameOf = {}; let parent = [], rank = [];
    let curAcc = -1, hot = [], groups = null;
    const rootOf = x => { while (parent[x] !== undefined && parent[x] !== x) x = parent[x]; return x; };
    const st = () => ({ A, emails: [...emails], parent: [...parent], rank: [...rank], curAcc, hot: [...hot], groups: clone(groups), nameOf: { ...nameOf } });
    A.forEach((a, k) => { curAcc = k; const fresh = []; for (let i = 1; i < a.length; i++) { if (idOf[a[i]] === undefined) { idOf[a[i]] = emails.length; emails.push(a[i]); fresh.push(`${a[i]}=${idOf[a[i]]}`); } nameOf[a[i]] = a[0]; }
      F.push({ line: 'ids', msg: fresh.length ? `Account ${k + 1}: give new ids to ${fresh.join(', ')}.` : `Account ${k + 1}: all of its emails already have ids.`, vars: { account: k + 1, 'idOf.size()': emails.length }, st: st() }); });
    parent = emails.map((_, i) => i); rank = emails.map(() => 0); curAcc = -1;
    F.push({ line: 'initp', msg: `parent[i] = i. All ${emails.length} emails start as separate sets.`, vars: { sets: emails.length }, st: st() });
    const find = x => { if (parent[x] !== x) parent[x] = find(parent[x]); return parent[x]; };
    A.forEach((a, k) => {
      curAcc = k; const first = idOf[a[1]];
      if (a.length === 2) { hot = [first]; F.push({ line: 'union', msg: `Account ${k + 1} has only one email, so there is nothing to union.`, vars: { account: k + 1 }, st: st() }); return; }
      for (let i = 2; i < a.length; i++) {
        const b = idOf[a[i]]; hot = [first, b];
        const before = parent.join(); const ra = find(first), rb = find(b); const compressed = before !== parent.join();
        const V = { a: `${a[1]} (${first})`, b: `${a[i]} (${b})`, ra: emails[ra], rb: emails[rb] };
        if (ra === rb) { F.push({ line: 'same', msg: `find(${a[1]}) and find(${a[i]}) both give ${emails[ra]}. They are already in the same set.${compressed ? ' (find also pointed the nodes it passed straight at the root.)' : ''}`, vars: V, st: st() }); continue; }
        let R = ra, S = rb; if (rank[R] < rank[S]) [R, S] = [S, R];
        parent[S] = R; if (rank[R] === rank[S]) rank[R]++;
        F.push({ line: 'link', msg: `Roots ${emails[ra]} and ${emails[rb]} differ. Attach ${emails[S]} under ${emails[R]}${rank[R] > 1 || rank[S] > 0 ? ' (the lower-rank tree goes under the higher one)' : ''}.${compressed ? ' find also pointed the nodes it passed straight at the root.' : ''}`, vars: { ...V, [`rank[${emails[R]}]`]: rank[R] }, st: st() });
      }
    });
    curAcc = -1; hot = [];
    const g = {}; emails.forEach((e, i) => { const r = find(i); (g[r] = g[r] || []).push(e); });
    groups = Object.values(g).map(es => [nameOf[es[0]], ...es.sort()]);
    F.push({ line: 'group', msg: `Group emails by root: ${groups.length} people.`, vars: { groups: groups.length }, st: st() });
    F.push({ line: 'ret', msg: 'Sort each group and put the owner\'s name first.', vars: { groups: groups.length }, st: st(), result: groups.map(x => `[${x.join(', ')}]`).join('  ') });
    return F;
  },
  render(st) {
    const accts = `<div class="accts">${st.A.map((a, k) => `<div class="${k === st.curAcc ? 'on' : ''}">${k + 1}. ${esc(a[0])}: ${esc(a.slice(1).join(', '))}</div>`).join('')}</div>`;
    let sets = '<span class="empty">ids not assigned yet</span>';
    if (st.parent.length) {
      const rootOf = x => { while (st.parent[x] !== x) x = st.parent[x]; return x; };
      const by = {}; st.emails.forEach((e, i) => { const r = rootOf(i); (by[r] = by[r] || []).push(i); });
      sets = `<div class="sets">${Object.entries(by).map(([r, ids]) => { r = +r; const on = ids.some(i => st.hot.includes(i));
        const items = [r, ...ids.filter(i => i !== r)].map(i => `<span class="em ${st.hot.includes(i) ? 'hot' : ''}">${i === r ? '★ ' : '&nbsp;&nbsp;'}${esc(st.emails[i])}${i !== r && st.parent[i] !== r ? ` <small>→ ${esc(st.emails[st.parent[i]])}</small>` : ''}</span>`).join('');
        return `<div class="set ${on ? 'on' : ''}"><span class="sh">${esc(st.nameOf[st.emails[r]])} · rank ${st.rank[r]}</span>${items}</div>`; }).join('')}</div>`;
    } else if (st.emails.length) sets = tokens(st.emails.map((e, i) => `${i}: ${e}`));
    const out = st.groups ? block('merged', `<div class="accts">${st.groups.map(g => `<div>${esc(g[0])}: ${esc(g.slice(1).join(', '))}</div>`).join('')}</div>`) : '';
    return block('accounts', accts) + block(st.parent.length ? 'disjoint sets (★ = root)' : 'email ids', sets) + out;
  }
});
