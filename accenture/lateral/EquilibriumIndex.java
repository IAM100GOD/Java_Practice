// Equilibrium Point / Pivot Index
// ★ Very Frequent (Lateral)
// Easy
// Prefix Sum / Arrays
//
// Given an array of integers nums, calculate the pivot/equilibrium index of this array.
// The pivot index is the index where the sum of all the numbers strictly to the left is equal
// to the sum of all the numbers strictly to the right.
// If no such index exists, return -1. If there are multiple, return the leftmost pivot index.
//
// Sample Test Case 1
// Input: [1, 7, 3, 6, 5, 6]
// Left sum at index 3: 1 + 7 + 3 = 11
// Right sum at index 3: 5 + 6 = 11
// Output: 3
//
// Sample Test Case 2
// Input: [1, 2, 3]
// Output: -1 (No equilibrium index)

import java.util.Scanner;

public class EquilibriumIndex {
    // Optimal single-pass prefix sum:
    // rightSum = totalSum - leftSum - nums[i]
    // If leftSum == rightSum, i is the equilibrium point (leftmost returned first).
    // Time: O(n), Space: O(1)
    public static int findPivotIndex(int[] nums) {
        if (nums == null || nums.length == 0) return -1;

        int totalSum = 0;
        for (int num : nums) {
            totalSum += num;
        }

        int leftSum = 0;
        for (int i = 0; i < nums.length; i++) {
            int rightSum = totalSum - leftSum - nums[i];
            if (leftSum == rightSum) {
                return i;
            }
            leftSum += nums[i];
        }

        return -1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) {
            // Default demo execution
            int[] demo1 = {1, 7, 3, 6, 5, 6};
            System.out.println("Demo 1 [1, 7, 3, 6, 5, 6] -> Pivot Index: " + findPivotIndex(demo1));
            int[] demo2 = {1, 2, 3};
            System.out.println("Demo 2 [1, 2, 3] -> Pivot Index: " + findPivotIndex(demo2));
            sc.close();
            return;
        }

        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) {
            nums[i] = sc.nextInt();
        }
        System.out.println(findPivotIndex(nums));
        sc.close();
    }
}
