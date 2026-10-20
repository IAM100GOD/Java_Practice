/* 1. Questions Marks */
P.push({
  id: 'questions-marks', title: 'Questions Marks', level: 'easy', file: 'QuestionsMarks.java',
  statement: 'Given a string of single digits, letters and <code>?</code>, return <code>true</code> if every pair of neighbouring digits that adds up to 10 has exactly three question marks between them. If no pair adds up to 10, return <code>false</code>.',
  technique: 'Single pass, O(1) state', time: 'O(n)', space: 'O(1)',
  inputs: [{ key: 's', label: 'str', def: 'arrb6???4xxbl5???eee5' }],
  samples: [['arrb6???4xxbl5???eee5'], ['aa6?9'], ['acc?7??sss?3rr1??????5'], ['5??aaaaaaaaaaaaaaaaaaa?5?5']],
  code: "public static boolean questionsMarks(String str) {\n    int lastDigit = -1;      // -1 means \"no digit seen yet\"\n    int qCount = 0;          // '?' seen since lastDigit\n    boolean foundPair = false; @init\n\n    for (int i = 0; i < str.length(); i++) {\n        char c = str.charAt(i); @read\n        if (Character.isDigit(c)) {\n            int d = c - '0';\n            if (lastDigit != -1 && lastDigit + d == 10) { @check\n                foundPair = true; @pair\n                if (qCount != 3) return false;   // one bad pair fails everything @fail\n            }\n            lastDigit = d;   // this digit starts the next pair\n            qCount = 0; @reset\n        } else if (c == '?') {\n            qCount++; @q\n        }\n    }\n    return foundPair; @ret\n}",
  steps: [
    'Keep three small variables: the last digit seen, how many <code>?</code> appeared since it, and whether any pair has summed to 10.',
    'Walk the string once. Letters are ignored.',
    'On a <code>?</code>, add one to the counter.',
    'On a digit, compare it with the last digit. If they sum to 10, mark <code>foundPair</code>, and if the counter is not exactly 3, return <code>false</code> right away.',
    'The current digit becomes the new <code>lastDigit</code> and the counter resets, because the next pair starts here.',
    'At the end, return <code>foundPair</code>. A string with no pair summing to 10 returns <code>false</code>.'
  ],
  cmp: [['Check every pair of digits (i, j) and count ? between them', 'O(n²)', 'O(1)'], ['One pass, remember only the last digit', 'O(n)', 'O(1)']],
  eff: 'Only neighbouring digits form a pair, so nothing older than the last digit can matter. That is why one remembered digit and one counter are enough, and the scan can stop at the first bad pair.',
  run({ s }) {
    const F = []; let lastDigit = -1, lastIdx = -1, qc = 0, found = false; let qIdx = []; const pairs = [];
    const st = i => ({ s, i, lastIdx, qIdx: [...qIdx], pairs: clone(pairs) });
    const V = (i, c) => ({ i, c: c == null ? '—' : `'${c}'`, lastDigit, qCount: qc, foundPair: found });
    F.push({ line: 'init', msg: 'No digit seen yet, the ? counter is 0, and no pair has been found.', vars: V('—'), st: st(-1) });
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (/[0-9]/.test(c)) {
        const d = +c;
        if (lastDigit !== -1 && lastDigit + d === 10) {
          found = true; const ok = qc === 3; pairs.push({ a: lastIdx, b: i, ok, n: qc, x: lastDigit, y: d });
          if (!ok) { F.push({ line: 'fail', msg: `${lastDigit} + ${d} = 10, but there are ${qc} question marks between them, not 3. Return false now.`, vars: V(i, c), st: st(i), result: 'false', bad: true }); return F; }
          F.push({ line: 'pair', msg: `${lastDigit} + ${d} = 10 and exactly 3 question marks sit between them. This pair passes.`, vars: V(i, c), st: st(i) });
        } else {
          F.push({ line: 'check', msg: lastDigit === -1 ? `First digit, ${d}. There is nothing to pair it with yet.` : `${lastDigit} + ${d} = ${lastDigit + d}, not 10, so this pair has no rule to check.`, vars: V(i, c), st: st(i) });
        }
        lastDigit = d; lastIdx = i; qc = 0; qIdx = [];
        F.push({ line: 'reset', msg: `${d} becomes lastDigit and the counter goes back to 0.`, vars: V(i, c), st: st(i) });
      } else if (c === '?') {
        qc++; qIdx.push(i);
        F.push({ line: 'q', msg: lastDigit === -1 ? 'A ? before any digit. It is counted, but it can never sit between a pair.' : `Question mark ${qc} since digit ${lastDigit}.`, vars: V(i, c), st: st(i) });
      } else {
        F.push({ line: 'read', msg: `'${c}' is not a digit or ?, so skip it.`, vars: V(i, c), st: st(i) });
      }
    }
    F.push({ line: 'ret', msg: found ? 'Every pair that adds up to 10 had exactly 3 question marks.' : 'No pair of neighbouring digits adds up to 10.', vars: V('—'), st: st(-1), result: String(found), bad: !found });
    return F;
  },
  render(st) {
    const inPair = {}; st.pairs.forEach(p => { inPair[p.a] = p.ok ? 'ok' : 'bad'; inPair[p.b] = p.ok ? 'ok' : 'bad'; });
    const grid = cells([...st.s], {
      cls: i => [i === st.i ? 'cur' : '', inPair[i] || (i === st.lastIdx ? 't1' : st.qIdx.includes(i) ? 't2' : '')].join(' '),
      top: i => [...(i === st.i ? [['i', 'c-acc']] : []), ...(i === st.lastIdx ? [['last', 'c-p1']] : [])]
    });
    const pairs = st.pairs.map(p => `${p.x} ··· ${p.y}   ? ×${p.n}  ${p.ok ? '✓' : '✗'}`);
    return block('str', grid) + `<div class="row2">${block('? since lastDigit', `<span class="big c-p2">${st.qIdx.length}</span>`)}${block('pairs that sum to 10', tokens(pairs, i => st.pairs[i].ok ? 'ok' : 'bad'))}</div>`;
  }
});
