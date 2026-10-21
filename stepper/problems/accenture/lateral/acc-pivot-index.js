/* A15. Equilibrium Point / Pivot Index (Accenture Lateral) */
P.push({
  id: 'acc-pivot-index',
  title: 'Equilibrium Point / Pivot Index',
  level: 'easy',
  group: 'accenture',
  file: 'EquilibriumIndex.java',
  dir: 'accenture/lateral',
  statement: 'Given an array of integers <code>nums</code>, calculate the pivot/equilibrium index. The pivot index is where the sum of numbers strictly to the left equals the sum of numbers strictly to the right. If no such index exists, return \u22121. If there are multiple, return the leftmost pivot index. Example: [1, 7, 3, 6, 5, 6] \u2192 left = 11, right = 11 at index 3 \u2192 3.',
  technique: 'Prefix sum: rightSum = totalSum \u2212 leftSum \u2212 nums[i]',
  time: 'O(n)',
  space: 'O(1)',
  inputs: [{ key: 'a', label: 'nums', def: '1, 7, 3, 6, 5, 6' }],
  samples: [
    ['1, 7, 3, 6, 5, 6'],
    ['1, 2, 3'],
    ['2, 1, -1'],
    ['0'],
    ['1, -1, 0']
  ],
  code: "public static int findPivotIndex(int[] nums) {\n    if (nums == null || nums.length == 0) return -1; @empty\n    int totalSum = 0; @sum\n    for (int x : nums) totalSum += x;\n    int leftSum = 0; @init\n    for (int i = 0; i < nums.length; i++) {\n        int rightSum = totalSum - leftSum - nums[i]; @check\n        if (leftSum == rightSum) return i; @found\n        leftSum += nums[i]; @step\n    }\n    return -1; @none\n}",
  steps: [
    'A naive approach computes the left sum and right sum for every index using nested loops in O(n\u00b2) time.',
    'Total sum of the array is fixed: <code>totalSum = leftSum + nums[i] + rightSum</code>.',
    'Therefore, <code>rightSum = totalSum \u2212 leftSum \u2212 nums[i]</code> can be obtained in O(1) time without another loop.',
    'First calculate <code>totalSum</code> in a single pass.',
    'Then iterate from left to right, maintaining a running <code>leftSum</code>.',
    'At each index <code>i</code>, compute <code>rightSum</code> and check if <code>leftSum == rightSum</code>.',
    'Return the first index that matches (leftmost pivot). If the loop finishes without finding any, return \u22121.'
  ],
  cmp: [
    ['Recalculate left and right sum each time', 'O(n\u00b2)', 'O(1)'],
    ['Prefix and Suffix sum arrays', 'O(n)', 'O(n)'],
    ['Running sum with totalSum', 'O(n)', 'O(1)']
  ],
  eff: 'Two linear passes with O(1) auxiliary space: one pass to get totalSum and one pass to find the equilibrium point.',
  run({ a }) {
    const A = a.split(/[,\s]+/).filter(Boolean).map(Number);
    const n = A.length;
    if (A.some(x => !Number.isInteger(x))) throw new Error('nums must be integers.');
    if (n > 14) throw new Error('Use 14 numbers or fewer.');

    const F = [];
    if (!n) {
      F.push({
        line: 'empty',
        msg: 'Array is empty. Return -1.',
        vars: { result: -1 },
        st: { A: [], i: -1, totalSum: 0, leftSum: 0, rightSum: 0, found: false },
        result: '-1'
      });
      return F;
    }

    let totalSum = 0;
    for (const x of A) totalSum += x;

    F.push({
      line: 'sum',
      msg: `Phase 1: Calculated total array sum = ${totalSum}.`,
      vars: { totalSum },
      st: { A, i: -1, totalSum, leftSum: 0, rightSum: 0, found: false }
    });

    let leftSum = 0;
    F.push({
      line: 'init',
      msg: 'Phase 2: Start scanning from index 0 with leftSum = 0.',
      vars: { totalSum, leftSum },
      st: { A, i: -1, totalSum, leftSum: 0, rightSum: 0, found: false }
    });

    for (let i = 0; i < n; i++) {
      const rightSum = totalSum - leftSum - A[i];
      const match = leftSum === rightSum;

      F.push({
        line: 'check',
        msg: `Index ${i} (${A[i]}): leftSum = ${leftSum}, rightSum = ${totalSum} \u2212 ${leftSum} \u2212 ${A[i]} = ${rightSum}.`,
        vars: { i, 'nums[i]': A[i], leftSum, rightSum, totalSum },
        st: { A, i, totalSum, leftSum, rightSum, found: false }
      });

      if (match) {
        F.push({
          line: 'found',
          msg: `Equilibrium point found! leftSum (${leftSum}) == rightSum (${rightSum}) at index ${i}. Return ${i}.`,
          vars: { i, leftSum, rightSum, result: i },
          st: { A, i, totalSum, leftSum, rightSum, found: true },
          result: String(i)
        });
        return F;
      }

      leftSum += A[i];
      F.push({
        line: 'step',
        msg: `leftSum \u2260 rightSum. Add nums[${i}] (${A[i]}) to leftSum \u2192 leftSum = ${leftSum}. Advance.`,
        vars: { i, leftSum, totalSum },
        st: { A, i, totalSum, leftSum, rightSum, found: false }
      });
    }

    F.push({
      line: 'none',
      msg: 'Scanned entire array and found no equilibrium index. Return -1.',
      vars: { result: -1 },
      st: { A, i: -1, totalSum, leftSum, rightSum: 0, found: false },
      result: '-1'
    });
    return F;
  },
  render(st) {
    const isMatch = st.found;
    return block('nums array (purple = left elements, yellow/green = pivot candidate, blue = right elements)',
      cells(st.A, {
        top: k => k === st.i ? [[isMatch ? 'pivot' : 'i', isMatch ? 'c-ok' : 'c-acc']] : [],
        cls: k => isMatch && k === st.i ? 'ok' : k === st.i ? 'cur t1' : k < st.i ? 't2' : ''
      }))
      + (st.i >= 0 ? block('balance check',
          `<div class="chips"><span class="tok t2">leftSum: ${st.leftSum}</span><span class="tok ${isMatch ? 'ok' : 'cur t1'}">${st.leftSum === st.rightSum ? '==' : '\u2260'}</span><span class="tok ${isMatch ? 'ok' : ''}">rightSum: ${st.rightSum}</span><span class="tok">totalSum: ${st.totalSum}</span></div>`
        ) : block('summary', `<div class="chips"><span class="tok">totalSum: ${st.totalSum}</span></div>`));
  }
});
