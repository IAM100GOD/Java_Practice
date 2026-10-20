/* A2. Minimum CPU Cores (Accenture) */
P.push({
  id: 'acc-min-cores', title: 'Minimum CPU Cores', level: 'medium', group: 'accenture', file: 'MinCoresRequired.java', dir: 'AccentureQuestions',
  statement: 'Given process start and end times, find the minimum number of CPU cores so that no two overlapping processes share a core. Example: start = [900, 940, 950, 1100], end = [910, 1200, 1120, 1130] → 3.',
  technique: 'Sort starts and ends separately, sweep with two pointers', time: 'O(N log N)', space: 'O(1) extra',
  inputs: [{ key: 's', label: 'start', def: '1, 3, 5, 4' }, { key: 'e', label: 'end', def: '2, 6, 8, 9' }],
  samples: [['1, 3, 5', '2, 6, 8'], ['900, 940, 950, 1100', '910, 1200, 1120, 1130'], ['1, 3, 5, 4', '2, 6, 8, 9']],
  code: "public static int minCores(int[] start, int[] end) {\n    Arrays.sort(start); @sort\n    Arrays.sort(end);\n    int maxCores = 0, currentCores = 0;\n    int startPointer = 0, endPointer = 0, n = start.length; @init\n    while (startPointer < n) {\n        if (start[startPointer] < end[endPointer]) {\n            currentCores++; startPointer++;        // new task needs a core @start\n        } else {\n            currentCores--; endPointer++;          // a task finished, core freed @end\n        }\n        maxCores = Math.max(maxCores, currentCores); @max\n    }\n    return maxCores; @ret\n}",
  steps: [
    'The answer is the largest number of processes running at the same moment.',
    'We only care about <em>when</em> things start and end, not which start pairs with which end, so both arrays can be sorted independently.',
    'Walk through events in time order: if the next start comes before the next end, one more core is busy; otherwise a core is freed first.',
    'Track the peak of currentCores. Using strict <code>&lt;</code> means a task ending at t frees its core for one starting at t.'
  ],
  cmp: [['Check every pair / every time unit', 'O(N²) or O(T)', 'O(1)'], ['Min-heap of end times', 'O(N log N)', 'O(N)'], ['Sorted starts + ends, two pointers', 'O(N log N)', 'O(1)']],
  eff: 'Sorting dominates. The sweep itself is linear and needs no extra structure, unlike the heap approach.',
  run({ s, e }) {
    const S = s.split(/[,\s]+/).filter(Boolean).map(Number), E = e.split(/[,\s]+/).filter(Boolean).map(Number);
    if (!S.length || S.length !== E.length || [...S, ...E].some(x => !Number.isFinite(x))) throw new Error('start and end must be number lists of equal length.');
    if (S.some((x, i) => x >= E[i])) throw new Error('Each start must be less than its end.');
    if (S.length > 12) throw new Error('Use 12 processes or fewer.');
    const F = []; S.sort((a, b) => a - b); E.sort((a, b) => a - b);
    let mx = 0, c = 0, sp = 0, ep = 0; const n = S.length;
    const st = () => ({ S: [...S], E: [...E], sp, ep, c, mx });
    F.push({ line: 'sort', msg: `Sorted start = [${S.join(', ')}], end = [${E.join(', ')}].`, vars: { n }, st: st() });
    F.push({ line: 'init', msg: 'Both pointers at 0, no cores in use yet.', vars: { startPointer: sp, endPointer: ep, currentCores: c, maxCores: mx }, st: st() });
    while (sp < n) {
      if (S[sp] < E[ep]) { const t = S[sp]; c++; sp++; F.push({ line: 'start', msg: `${t} < ${E[ep]}: a process starts before the earliest running one ends. currentCores = ${c}.`, vars: { startPointer: sp, endPointer: ep, currentCores: c, maxCores: mx }, st: st() }); }
      else { const t = E[ep]; c--; ep++; F.push({ line: 'end', msg: `${S[sp]} ≥ ${t}: a process ends at ${t} first, freeing a core. currentCores = ${c}.`, vars: { startPointer: sp, endPointer: ep, currentCores: c, maxCores: mx }, st: st() }); }
      const old = mx; mx = Math.max(mx, c);
      F.push({ line: 'max', msg: mx > old ? `New peak: maxCores = ${mx}.` : `maxCores stays ${mx}.`, vars: { currentCores: c, maxCores: mx }, st: st() });
    }
    F.push({ line: 'ret', msg: `All starts processed. At most ${mx} processes ever overlap, so ${mx} core(s) are needed.`, vars: { maxCores: mx }, st: st(), result: String(mx) });
    return F;
  },
  render(st) {
    const a = cells(st.S, { top: i => i === st.sp ? [['sp', 'c-acc']] : [], cls: i => i < st.sp ? 'ok' : i === st.sp ? 'cur t1' : '' });
    const b = cells(st.E, { top: i => i === st.ep ? [['ep', 'c-p2']] : [], cls: i => i < st.ep ? 'dim' : i === st.ep ? 'cur t2' : '' });
    return block('start (sorted)', a) + block('end (sorted)', b) + block(`cores busy: ${st.c} · peak: ${st.mx}`, tokens(Array.from({ length: Math.max(st.mx, 1) }, (_, i) => i < st.c ? 'busy' : 'free'), i => i < st.c ? 'ok' : ''));
  }
});
