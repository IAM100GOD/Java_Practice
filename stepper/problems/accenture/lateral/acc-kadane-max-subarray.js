/* A21. Maximum Subarray Sum (Kadane's Algorithm) (Accenture Lateral) */
P.push({
  id: 'acc-kadane-max-subarray',
  title: 'Maximum Subarray Sum (Kadane)',
  level: 'medium',
  group: 'accenture',
  file: 'KadaneMaxSubarray.java',
  dir: 'accenture/lateral',
  statement: 'Given an integer array <code>nums</code>, find the contiguous subarray with the largest sum and return its sum. Must handle all-negative arrays gracefully. Example: [-2, 1, -3, 4, -1, 2, 1, -5, 4] \u2192 6 ([4, -1, 2, 1]).',
  technique: 'Kadane\'s DP: currentSum = max(nums[i], currentSum + nums[i])',
  time: 'O(n)',
  space: 'O(1)',
  inputs: [
    { key: 'a', label: 'nums', def: '-2, 1, -3, 4, -1, 2, 1, -5, 4' }
  ],
  samples: [
    ['-2, 1, -3, 4, -1, 2, 1, -5, 4'],
    ['-1, -2, -3'],
    ['5, 4, -1, 7, 8'],
    ['1'],
    ['-2, -1']
  ],
  code: "public static int maxSubArray(int[] nums) {\n    int currentSum = nums[0]; @init\n    int maxSum = nums[0]; @max0\n    for (int i = 1; i < nums.length; i++) {\n        currentSum = Math.max(nums[i], currentSum + nums[i]); @step\n        maxSum = Math.max(maxSum, currentSum); @update\n    }\n    return maxSum; @ret\n}",
  steps: [
    'A brute force checking all O(n\u00b2) contiguous subarrays takes O(n\u00b2) time.',
    'Kadane\'s algorithm uses dynamic programming: at index <code>i</code>, we have two choices:',
    '1. Extend the existing subarray sum: <code>currentSum + nums[i]</code>',
    '2. Or start a fresh subarray right at <code>nums[i]</code> if extending would hurt us: <code>nums[i]</code>',
    'So <code>currentSum = Math.max(nums[i], currentSum + nums[i])</code>.',
    'Track the global maximum <code>maxSum = Math.max(maxSum, currentSum)</code> after every step.',
    'Initializing both with <code>nums[0]</code> guarantees all-negative arrays are handled correctly without returning 0.'
  ],
  cmp: [
    ['Exhaustive nested loops', 'O(n\u00b2)', 'O(1)'],
    ['Divide and conquer', 'O(n log n)', 'O(log n) call stack'],
    ['Kadane\'s algorithm', 'O(n)', 'O(1)']
  ],
  eff: 'A single linear scan making a local greedy choice at each position yields optimal global maximum subarray sum.',
  run({ a }) {
    const A = a.split(/[,\s]+/).filter(Boolean).map(Number);
    const n = A.length;
    if (!n || A.some(x => !Number.isInteger(x))) throw new Error('Enter a valid list of integers.');
    if (n > 14) throw new Error('Use 14 numbers or fewer.');

    const F = [];
    let curSum = A[0], maxSum = A[0];
    let bestStart = 0, bestEnd = 0, curStart = 0;

    F.push({
      line: 'init',
      msg: `Start with index 0: currentSum = nums[0] = ${A[0]}.`,
      vars: { currentSum: curSum },
      st: { A, i: 0, curSum, maxSum, bestStart, bestEnd, curStart }
    });

    F.push({
      line: 'max0',
      msg: `Initialize maxSum = nums[0] = ${maxSum}.`,
      vars: { currentSum: curSum, maxSum },
      st: { A, i: 0, curSum, maxSum, bestStart, bestEnd, curStart }
    });

    for (let i = 1; i < n; i++) {
      const ext = curSum + A[i];
      if (A[i] > ext) {
        curSum = A[i];
        curStart = i;
        F.push({
          line: 'step',
          msg: `At index ${i} (${A[i]}): nums[${i}] (${A[i]}) > currentSum + nums[${i}] (${ext}). Start fresh subarray at ${i}.`,
          vars: { i, 'nums[i]': A[i], currentSum: curSum },
          st: { A, i, curSum, maxSum, bestStart, bestEnd, curStart }
        });
      } else {
        curSum = ext;
        F.push({
          line: 'step',
          msg: `At index ${i} (${A[i]}): extend subarray with ${A[i]} \u2192 currentSum = ${curSum}.`,
          vars: { i, 'nums[i]': A[i], currentSum: curSum },
          st: { A, i, curSum, maxSum, bestStart, bestEnd, curStart }
        });
      }

      if (curSum > maxSum) {
        maxSum = curSum;
        bestStart = curStart;
        bestEnd = i;
        F.push({
          line: 'update',
          msg: `New maximum found! maxSum = ${maxSum} (subarray [${bestStart}..${bestEnd}]).`,
          vars: { i, currentSum: curSum, maxSum, bestSubarray: `[${A.slice(bestStart, bestEnd + 1).join(', ')}]` },
          st: { A, i, curSum, maxSum, bestStart, bestEnd, curStart }
        });
      } else {
        F.push({
          line: 'update',
          msg: `currentSum (${curSum}) \u2264 maxSum (${maxSum}). Global maximum unchanged.`,
          vars: { i, currentSum: curSum, maxSum },
          st: { A, i, curSum, maxSum, bestStart, bestEnd, curStart }
        });
      }
    }

    F.push({
      line: 'ret',
      msg: `Maximum contiguous subarray sum is ${maxSum} (subarray: [${A.slice(bestStart, bestEnd + 1).join(', ')}]).`,
      vars: { maxSum, result: maxSum },
      st: { A, i: n - 1, curSum, maxSum, bestStart, bestEnd, curStart },
      result: String(maxSum)
    });
    return F;
  },
  render(st) {
    let h = block('array (green = best subarray found so far, yellow = current index)',
      cells(st.A, {
        top: k => {
          if (k === st.i && k === st.bestStart) return [['i/best', 'c-ok']];
          if (k === st.i) return [['i', 'c-acc']];
          if (k === st.bestStart) return [['start', 'c-ok']];
          if (k === st.bestEnd) return [['end', 'c-ok']];
          return [];
        },
        cls: k => {
          if (k === st.i) return 'cur t1';
          if (k >= st.bestStart && k <= st.bestEnd) return 'ok';
          return '';
        }
      })
    );

    const sub = st.A.slice(st.bestStart, st.bestEnd + 1);
    h += block('Kadane metrics',
      `<div class="chips"><span class="tok ok">maxSum: ${st.maxSum}</span><span class="tok t2">currentSum: ${st.curSum}</span><span class="tok">best subarray: [${sub.join(', ')}]</span></div>`
    );
    return h;
  }
});
