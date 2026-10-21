/* A18. Rotate Array by K Positions (Accenture Lateral) */
P.push({
  id: 'acc-rotate-array-k',
  title: 'Rotate Array by K Positions',
  level: 'medium',
  group: 'accenture',
  file: 'RotateArrayK.java',
  dir: 'accenture/lateral',
  statement: 'Given an integer array <code>nums</code>, rotate the array to the right by <code>k</code> steps in-place with O(1) extra space. Example: nums = [1, 2, 3, 4, 5, 6, 7], k = 3 \u2192 [5, 6, 7, 1, 2, 3, 4].',
  technique: 'Three-step in-place reversal: reverse(0, n\u22121), reverse(0, k\u22121), reverse(k, n\u22121)',
  time: 'O(n)',
  space: 'O(1) in-place',
  inputs: [
    { key: 'k', label: 'k', def: '3', narrow: true },
    { key: 'a', label: 'nums', def: '1, 2, 3, 4, 5, 6, 7' }
  ],
  samples: [
    ['3', '1, 2, 3, 4, 5, 6, 7'],
    ['2', '-1, -100, 3, 99'],
    ['4', '1, 2'],
    ['0', '1, 2, 3'],
    ['6', '1, 2, 3, 4']
  ],
  code: "public static void rotate(int[] nums, int k) {\n    int n = nums.length; @init\n    k = k % n; @mod\n    if (k == 0) return; @zero\n    reverse(nums, 0, n - 1); // 1. Reverse entire array @rev1\n    reverse(nums, 0, k - 1); // 2. Reverse first k @rev2\n    reverse(nums, k, n - 1); // 3. Reverse remaining n-k @rev3\n} @done\n\nprivate static void reverse(int[] nums, int start, int end) {\n    while (start < end) {\n        int temp = nums[start];\n        nums[start] = nums[end];\n        nums[end] = temp;\n        start++; end--;\n    }\n}",
  steps: [
    'Rotating right by <code>k</code> means the last <code>k</code> elements wrap around to the front.',
    'First reduce <code>k = k % n</code> since rotating <code>n</code> times returns the original array.',
    '<strong>Step 1:</strong> Reverse the entire array <code>[0..n-1]</code>. This moves the target suffix to the front, but in reverse order.',
    '<strong>Step 2:</strong> Reverse the first <code>k</code> elements <code>[0..k-1]</code> to restore their correct relative order.',
    '<strong>Step 3:</strong> Reverse the remaining <code>n - k</code> elements <code>[k..n-1]</code> to restore their relative order.',
    'Result: fully rotated array with exactly 3 linear reversals and strictly O(1) auxiliary memory!'
  ],
  cmp: [
    ['Rotate 1 step at a time k times', 'O(n \u00d7 k)', 'O(1) in-place'],
    ['Copy to extra auxiliary array', 'O(n)', 'O(n) auxiliary'],
    ['3-Step In-Place Reversal', 'O(n)', 'O(1) in-place']
  ],
  eff: 'Each element is moved at most twice, achieving an optimal O(n) runtime and zero additional memory.',
  run({ k, a }) {
    const rawK = Number(k);
    const A = a.split(/[,\s]+/).filter(Boolean).map(Number);
    const n = A.length;
    if (!Number.isInteger(rawK) || rawK < 0 || A.some(x => !Number.isInteger(x))) {
      throw new Error('k must be a non-negative integer and nums must be integers.');
    }
    if (n > 14) throw new Error('Use 14 numbers or fewer.');

    const F = [];
    if (!n) {
      F.push({
        line: 'init',
        msg: 'Empty array, nothing to rotate.',
        vars: { n: 0, k: rawK },
        st: { A: [], start: -1, end: -1, k: 0, phase: 'done' },
        result: '[]'
      });
      return F;
    }

    const effK = rawK % n;
    F.push({
      line: 'init',
      msg: `Array has length n = ${n}.`,
      vars: { n, k: rawK },
      st: { A: [...A], start: -1, end: -1, k: effK, phase: 'init' }
    });

    F.push({
      line: 'mod',
      msg: `Effective rotation: k = ${rawK} % ${n} = ${effK}.`,
      vars: { n, k: effK },
      st: { A: [...A], start: -1, end: -1, k: effK, phase: 'mod' }
    });

    if (effK === 0 || n <= 1) {
      F.push({
        line: 'zero',
        msg: `k is 0 or array length \u2264 1. No rotation needed.`,
        vars: { k: effK, result: `[${A.join(', ')}]` },
        st: { A: [...A], start: -1, end: -1, k: effK, phase: 'done' },
        result: `[${A.join(', ')}]`
      });
      return F;
    }

    function doReverse(start, end, tag, phaseName) {
      let s = start, e = end;
      while (s < e) {
        const v1 = A[s], v2 = A[e];
        A[s] = v2;
        A[e] = v1;
        F.push({
          line: tag,
          msg: `${phaseName}: swap nums[${s}] (${v1}) \u2194 nums[${e}] (${v2}).`,
          vars: { phase: phaseName, start: s, end: e, k: effK },
          st: { A: [...A], start: s, end: e, k: effK, phase: phaseName }
        });
        s++;
        e--;
      }
    }

    // Step 1: reverse entire array
    F.push({
      line: 'rev1',
      msg: `Step 1: Reverse entire array from index 0 to ${n - 1}.`,
      vars: { start: 0, end: n - 1 },
      st: { A: [...A], start: 0, end: n - 1, k: effK, phase: 'Step 1: Reverse All (0..n-1)' }
    });
    doReverse(0, n - 1, 'rev1', 'Step 1: Reverse All (0..n-1)');

    // Step 2: reverse first k elements
    F.push({
      line: 'rev2',
      msg: `Step 2: Reverse first k elements from index 0 to ${effK - 1}.`,
      vars: { start: 0, end: effK - 1 },
      st: { A: [...A], start: 0, end: effK - 1, k: effK, phase: `Step 2: Reverse 0..${effK - 1}` }
    });
    doReverse(0, effK - 1, 'rev2', `Step 2: Reverse 0..${effK - 1}`);

    // Step 3: reverse remaining elements
    F.push({
      line: 'rev3',
      msg: `Step 3: Reverse remaining elements from index ${effK} to ${n - 1}.`,
      vars: { start: effK, end: n - 1 },
      st: { A: [...A], start: effK, end: n - 1, k: effK, phase: `Step 3: Reverse ${effK}..${n - 1}` }
    });
    doReverse(effK, n - 1, 'rev3', `Step 3: Reverse ${effK}..${n - 1}`);

    F.push({
      line: 'done',
      msg: `Rotation complete! Rotated by ${effK} positions in-place: [${A.join(', ')}].`,
      vars: { k: effK, result: `[${A.join(', ')}]` },
      st: { A: [...A], start: -1, end: -1, k: effK, phase: 'done' },
      result: `[${A.join(', ')}]`
    });

    return F;
  },
  render(st) {
    const isDone = st.phase === 'done';
    let h = block('array (purple = swap start, yellow = swap end; final: green = first k, blue = rest)',
      cells(st.A, {
        top: k => {
          if (k === st.start && k === st.end) return [['s/e', 'c-ok']];
          if (k === st.start) return [['start', 'c-p2']];
          if (k === st.end) return [['end', 'c-acc']];
          if (isDone && k === st.k - 1) return [['k-1', 'c-ok']];
          return [];
        },
        cls: k => {
          if (isDone) return k < st.k ? 'ok' : 't2';
          if (k === st.start || k === st.end) return 'cur t1';
          return '';
        }
      })
    );

    h += block('rotation progress',
      `<div class="chips"><span class="tok ok">Phase: ${esc(st.phase)}</span><span class="tok t2">effective k: ${st.k}</span>${st.start >= 0 ? `<span class="tok">swap [${st.start} \u2194 ${st.end}]</span>` : ''}</div>`
    );
    return h;
  }
});
