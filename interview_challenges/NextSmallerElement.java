// Next Smaller Element on the Right
// ★ High Frequency
// Medium
// Monotonic Stack
// Given an array of integers, replace each element with the first smaller element on its right.
//  If no smaller element exists on the right side, replace it with -1.

//  Sample Test Case
// Input: [4, 8, 5, 2, 25]
// Output: [2, 5, 2, -1, -1]
// Explanation: Next smaller to 4 is 2; to 8 is 5; to 5 is 2; to 2 is none (-1).


import java.util.*;

public class NextSmallerElement {
    public static int[] nextSmaller(int[] arr) {
        int n = arr.length;
        int[] result = new int[n];
        // Stack stores elements in increasing order from right
        Stack stack = new Stack<>();
        
        // Traverse from right to left
        for (int i = n - 1; i >= 0; i--) {
            while (!stack.isEmpty() && stack.peek() >= arr[i]) {
                stack.pop();
            }
            result[i] = stack.isEmpty() ? -1 : stack.peek();
            stack.push(arr[i]);
        }
        return result;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        
        int[] ans = nextSmaller(arr);
        for (int i = 0; i < n; i++) {
            System.out.print(ans[i] + (i == n - 1 ? "" : " "));
        }
        System.out.println();
        sc.close();
    }
}