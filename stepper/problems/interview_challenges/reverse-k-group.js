/* 12. Reverse Nodes in k-Group */
P.push({
  id: 'reverse-k-group', title: 'Reverse Nodes in k-Group', level: 'hard', file: 'ReverseKGroup.java',
  statement: 'Reverse a linked list k nodes at a time. If fewer than k nodes are left at the end, leave them as they are. Change the links, not the values.',
  technique: 'Dummy head + in-place pointer reversal', time: 'O(n)', space: 'O(1)',
  inputs: [{ key: 'list', label: 'list', def: '1, 2, 3, 4, 5' }, { key: 'k', label: 'k', def: '2', narrow: true }],
  samples: [['1, 2, 3, 4, 5', '2'], ['1, 2, 3, 4, 5', '3'], ['1, 2, 3, 4, 5, 6, 7, 8', '3']],
  code: "public static ListNode reverseKGroup(ListNode head, int k) {\n    ListNode dummy = new ListNode(0);\n    dummy.next = head;\n    ListNode groupPrev = dummy; @init\n\n    while (true) {\n        ListNode kth = groupPrev;\n        for (int i = 0; i < k && kth != null; i++) kth = kth.next; @kth\n        if (kth == null) break;                    // fewer than k nodes left @stop\n\n        ListNode groupNext = kth.next;\n        ListNode prev = groupNext, curr = groupPrev.next; @setup\n        while (curr != groupNext) {\n            ListNode tmp = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = tmp; @flip\n        }\n\n        ListNode oldFirst = groupPrev.next;        // now the group's tail\n        groupPrev.next = kth; @stitch\n        groupPrev = oldFirst; @advance\n    }\n    return dummy.next; @ret\n}",
  steps: [
    'A <code>dummy</code> node before the head means the first group is handled like every other group. Without it, the head would need special-case code.',
    '<code>groupPrev</code> is the node just before the next group. Walk k steps from it to find <code>kth</code>, the group\'s last node. If the list runs out first, stop.',
    'Reverse the group with the usual <code>prev / curr / tmp</code> flip. The trick: start <code>prev</code> at <code>groupNext</code>, not null, so the group\'s old first node ends up already linked to the rest of the list.',
    'Stitch: <code>groupPrev.next = kth</code>, because kth is now the front of the group.',
    'The old first node is now the group\'s tail, so it becomes the next <code>groupPrev</code>. Repeat.'
  ],
  cmp: [['Copy values into an array, reverse chunks, rebuild', 'O(n)', 'O(n)'], ['Recursive reverse per group', 'O(n)', 'O(n/k) stack'], ['Iterative, in place', 'O(n)', 'O(1)']],
  eff: 'Each node is visited twice: once while finding kth and once while flipping. Only a fixed number of pointers are used, no matter how long the list is, and nodes are relinked instead of copied, which is what interviewers expect.',
  parse({ list, k }) {
    const vals = list.split(/[,\s]+/).filter(Boolean).map(Number);
    if (!vals.length || vals.some(v => !Number.isFinite(v))) throw new Error('The list should be numbers separated by commas.');
    if (vals.length > 12) throw new Error('Use 12 nodes or fewer so the picture fits.');
    const K = parseInt(k, 10); if (!(K >= 1)) throw new Error('k must be 1 or more.');
    return { vals, K };
  },
  run(inp) {
    const { vals, K } = this.parse(inp); const n = vals.length; const F = [];
    const val = [0, ...vals]; const next = val.map((_, i) => i + 1 <= n ? i + 1 : null);
    let P = {}; let grp = [], hotLink = null;
    const nm = i => i == null ? 'null' : i === 0 ? 'dummy' : String(val[i]);
    const st = () => ({ val, next: [...next], P: { ...P }, grp: [...grp], hotLink });
    const V = () => Object.fromEntries(Object.entries(P).map(([k, v]) => [k, nm(v)]));
    let gp = 0; P = { groupPrev: 0 };
    F.push({ line: 'init', msg: 'dummy → head. groupPrev starts at dummy.', vars: V(), st: st() });
    while (true) {
      let kth = gp; for (let i = 0; i < K && kth != null; i++) kth = next[kth];
      if (kth == null) { P = { groupPrev: gp }; grp = []; F.push({ line: 'stop', msg: `Fewer than ${K} nodes follow groupPrev, so leave them as they are and stop.`, vars: { ...V(), kth: 'null' }, st: st() }); break; }
      grp = []; for (let x = next[gp]; ; x = next[x]) { grp.push(x); if (x === kth) break; }
      P = { groupPrev: gp, kth }; hotLink = null;
      F.push({ line: 'kth', msg: `Walk ${K} steps from groupPrev (${nm(gp)}). kth = ${nm(kth)}. The group is ${grp.map(nm).join(', ')}.`, vars: V(), st: st() });
      const gn = next[kth]; let prev = gn, curr = next[gp];
      P = { groupPrev: gp, kth, groupNext: gn, prev, curr };
      F.push({ line: 'setup', msg: `groupNext = ${nm(gn)}. prev starts at groupNext (not null) so the reversed group stays attached to the rest. curr = ${nm(curr)}.`, vars: V(), st: st() });
      while (curr !== gn) {
        const tmp = next[curr]; next[curr] = prev; hotLink = curr;
        const c0 = curr; prev = curr; curr = tmp; P = { groupPrev: gp, kth, groupNext: gn, prev, curr };
        F.push({ line: 'flip', msg: `${nm(c0)}.next now points to ${nm(next[c0])}. Then prev = ${nm(prev)} and curr = ${nm(curr)}.`, vars: V(), st: st() });
      }
      const oldFirst = next[gp]; next[gp] = kth; hotLink = gp;
      P = { groupPrev: gp, kth, oldFirst };
      F.push({ line: 'stitch', msg: `${nm(gp)}.next = kth (${nm(kth)}), the new front of the group. ${nm(oldFirst)} is now the group's tail.`, vars: V(), st: st() });
      gp = oldFirst; hotLink = null; P = { groupPrev: gp };
      F.push({ line: 'advance', msg: `groupPrev moves to ${nm(gp)}, the node just before the next group.`, vars: V(), st: st() });
    }
    const out = []; for (let x = next[0], g = 0; x != null && g < 50; x = next[x], g++) out.push(val[x]);
    P = {}; grp = [];
    F.push({ line: 'ret', msg: 'Return dummy.next.', vars: { 'dummy.next': nm(next[0]) }, st: st(), result: out.join(' → ') });
    return F;
  },
  render(st) {
    const n = st.val.length; const gap = 74, cy = 122, w = 44, hh = 34; const X = i => 34 + i * gap;
    const W = X(n - 1) + 60, H = 212;
    const cols = { groupPrev: 'c-p1', kth: 'c-p3', groupNext: 'c-acc', prev: 'c-ok', curr: 'c-p2', oldFirst: 'c-p3' };
    let svg = `<svg class="tv" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Linked list pointers"><defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="ah" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="ah2" d="M0,0 L10,5 L0,10 z"/></marker></defs>`;
    st.next.forEach((t, i) => {
      const on = st.hotLink === i; const cls = `lnk ${on ? 'on' : ''}`; const mk = on ? 'url(#ah2)' : 'url(#ah)';
      if (t == null) { svg += `<line class="${cls}" x1="${X(i) + 8}" y1="${cy + hh / 2}" x2="${X(i) + 8}" y2="${cy + hh / 2 + 16}"/><text class="nul" x="${X(i) + 8}" y="${cy + hh / 2 + 28}">null</text>`; return; }
      const d = t - i;
      if (d === 1) svg += `<line class="${cls}" x1="${X(i) + w / 2}" y1="${cy}" x2="${X(t) - w / 2 - 1}" y2="${cy}" marker-end="${mk}"/>`;
      else if (d > 1) { const Hh = Math.min(26 + d * 16, 92); svg += `<path class="${cls}" d="M${X(i) + 8},${cy - hh / 2} Q${(X(i) + X(t)) / 2},${cy - hh / 2 - Hh} ${X(t) - 8},${cy - hh / 2 - 1}" marker-end="${mk}"/>`; }
      else { const Hh = Math.min(26 + (-d) * 14, 80); svg += `<path class="${cls}" d="M${X(i) - 8},${cy + hh / 2} Q${(X(i) + X(t)) / 2},${cy + hh / 2 + Hh} ${X(t) + 8},${cy + hh / 2 + 1}" marker-end="${mk}"/>`; }
    });
    st.val.forEach((v, i) => {
      const cls = i === 0 ? 'dummy' : st.grp.includes(i) ? 'grp' : '';
      svg += `<g class="nd ${cls}"><rect x="${X(i) - w / 2}" y="${cy - hh / 2}" width="${w}" height="${hh}" rx="6"/><text x="${X(i)}" y="${cy}">${i === 0 ? 'D' : v}</text></g>`;
    });
    const at = {}; Object.entries(st.P).forEach(([k, v]) => { if (v != null) (at[v] = at[v] || []).push(k); });
    Object.entries(at).forEach(([i, ks]) => ks.forEach((k, j) => { svg += `<text class="plab ${cols[k]}" x="${X(+i)}" y="${14 + j * 13}">${k}</text>`; }));
    svg += '</svg>';
    const out = []; for (let x = st.next[0], g = 0; x != null && g < st.val.length + 1; x = st.next[x], g++) out.push(st.val[x]);
    return block('nodes stay in place; arrows are the .next links (above = forward, below = backward)', `<div class="scroll">${svg}</div>`)
      + block('reading from dummy.next', `<span class="tok">${out.join(' → ')}</span>`);
  }
});
