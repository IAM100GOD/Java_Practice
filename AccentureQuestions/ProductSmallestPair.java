// Product of Smallest Pair (Accenture)
// ★ Repeated | Easy | Array / Sorting
// Given a target sum `sum` and an array of integers arr of size n, find the two smallest elements.
// If their sum is <= sum, return their product. Otherwise return 0. If n < 2, return -1.
//
// Sample Test Case
// Input: sum = 9, arr = [5, 2, 4, 3, 9, 7, 1]
// Smallest Pair: 1 and 2
// Pair Sum: 1 + 2 = 3 <= 9 (Condition met)
// Output: 2 (1 * 2)

import java.util.Scanner;

public class ProductSmallestPair {
    // Single pass O(n): track the smallest and second smallest values
    public static int productSmallestPair(int sum, int[] arr) {
        int n = arr.length;
        if (n < 2) return -1;

        int min1 = Integer.MAX_VALUE; // smallest
        int min2 = Integer.MAX_VALUE; // second smallest

        for (int x : arr) {
            if (x < min1) {
                min2 = min1;   // old smallest becomes second smallest
                min1 = x;
            } else if (x < min2) {
                min2 = x;
            }
        }

        return (min1 + min2 <= sum) ? min1 * min2 : 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int sum = sc.nextInt();
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(productSmallestPair(sum, arr));
        sc.close();
    }
}
