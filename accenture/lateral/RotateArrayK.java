// Rotate Array by K Positions (In-Place O(1) Space)
// ★ Very Frequent (Lateral)
// Medium
// In-Place Array Reversal
//
// Given an integer array nums, rotate the array to the right by k steps, where k is non-negative.
// You must modify the array in-place with O(1) extra memory.
//
// Sample Test Case
// Input: nums = [1, 2, 3, 4, 5, 6, 7], k = 3
// Rotate 1: [7, 1, 2, 3, 4, 5, 6]
// Rotate 2: [6, 7, 1, 2, 3, 4, 5]
// Rotate 3: [5, 6, 7, 1, 2, 3, 4]
// Output: [5, 6, 7, 1, 2, 3, 4]
//
// Pattern:
// 1. k = k % n
// 2. Reverse entire array: 0 to n - 1
// 3. Reverse first k elements: 0 to k - 1
// 4. Reverse remaining elements: k to n - 1
// Time: O(n), Space: O(1) in-place

import java.util.Arrays;
import java.util.Scanner;

public class RotateArrayK {
    public static void rotate(int[] nums, int k) {
        if (nums == null || nums.length <= 1) return;
        int n = nums.length;
        k = k % n;
        if (k == 0) return;

        // Step 1: Reverse entire array
        reverse(nums, 0, n - 1);
        // Step 2: Reverse first k elements
        reverse(nums, 0, k - 1);
        // Step 3: Reverse remaining elements
        reverse(nums, k, n - 1);
    }

    private static void reverse(int[] nums, int start, int end) {
        while (start < end) {
            int temp = nums[start];
            nums[start] = nums[end];
            nums[end] = temp;
            start++;
            end--;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) {
            // Default demo execution
            int[] demo = {1, 2, 3, 4, 5, 6, 7};
            int k = 3;
            rotate(demo, k);
            System.out.println("Demo k=3: " + Arrays.toString(demo));
            sc.close();
            return;
        }

        int n = sc.nextInt();
        int k = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) {
            nums[i] = sc.nextInt();
        }
        rotate(nums, k);
        System.out.println(Arrays.toString(nums));
        sc.close();
    }
}
