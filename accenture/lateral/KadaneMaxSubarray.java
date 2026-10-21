// Maximum Subarray Sum (Kadane's Algorithm)
// ★ Very Frequent
// Medium
// Dynamic Programming / Greedy
//
// Given an integer array nums, find the contiguous subarray (containing at least one number)
// which has the largest sum and return its sum.
// Must handle arrays containing all negative numbers gracefully.
//
// Sample Cases
// Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4] -> Output: 6 (Subarray: [4, -1, 2, 1])
// Input: [-1, -2, -3]                     -> Output: -1 (Subarray: [-1])
//
// Pattern:
// Kadane's Algorithm:
// At index i: currentSum = max(nums[i], currentSum + nums[i])
// maxSum = max(maxSum, currentSum)
// Time: O(n), Space: O(1)

import java.util.Arrays;
import java.util.Scanner;

public class KadaneMaxSubarray {
    public static int maxSubArray(int[] nums) {
        if (nums == null || nums.length == 0) return 0;

        int currentSum = nums[0];
        int maxSum = nums[0];

        for (int i = 1; i < nums.length; i++) {
            // Either extend existing subarray or start fresh from nums[i]
            currentSum = Math.max(nums[i], currentSum + nums[i]);
            maxSum = Math.max(maxSum, currentSum);
        }

        return maxSum;
    }

    // Helper returning subarray indices [start, end] and sum
    public static int[] maxSubArrayWithIndices(int[] nums) {
        if (nums == null || nums.length == 0) return new int[]{0, 0, 0};

        int currentSum = nums[0];
        int maxSum = nums[0];
        int start = 0, end = 0, curStart = 0;

        for (int i = 1; i < nums.length; i++) {
            if (nums[i] > currentSum + nums[i]) {
                currentSum = nums[i];
                curStart = i;
            } else {
                currentSum += nums[i];
            }

            if (currentSum > maxSum) {
                maxSum = currentSum;
                start = curStart;
                end = i;
            }
        }

        return new int[]{maxSum, start, end};
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) {
            // Default demo execution
            int[] demo1 = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
            int[] res1 = maxSubArrayWithIndices(demo1);
            System.out.println("Demo 1: " + Arrays.toString(demo1));
            System.out.println("Max Sum: " + res1[0] + ", Subarray: " + Arrays.toString(Arrays.copyOfRange(demo1, res1[1], res1[2] + 1)));

            int[] demo2 = {-1, -2, -3};
            int[] res2 = maxSubArrayWithIndices(demo2);
            System.out.println("Demo 2: " + Arrays.toString(demo2));
            System.out.println("Max Sum: " + res2[0] + ", Subarray: " + Arrays.toString(Arrays.copyOfRange(demo2, res2[1], res2[2] + 1)));
            sc.close();
            return;
        }

        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) {
            nums[i] = sc.nextInt();
        }
        System.out.println(maxSubArray(nums));
        sc.close();
    }
}
