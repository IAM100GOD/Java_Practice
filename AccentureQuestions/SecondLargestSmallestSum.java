// Sum of Second Largest (Even) & Second Smallest (Odd) (Accenture)
// ★ Repeated | Easy | Array Indexing
// Separate elements at even positions (0, 2, 4...) and odd positions (1, 3, 5...).
// Find the second largest of the even-positioned elements and the second smallest of the
// odd-positioned elements. Return their sum.
//
// Sample Test Case
// Input: [3, 2, 1, 7, 5, 4]
// Even indices (0,2,4): [3, 1, 5] -> 2nd largest is 3
// Odd indices (1,3,5):  [2, 7, 4] -> 2nd smallest is 4
// Output: 7 (3 + 4)
//
// Assumption: if either group has fewer than 2 elements (n < 4), return -1.

import java.util.Scanner;

public class SecondLargestSmallestSum {
    // Single pass O(n): track top-2 maxima at even indices and top-2 minima at odd indices
    public static int sumSecondLargestSmallest(int[] arr) {
        int n = arr.length;
        if (n < 4) return -1;

        int max1 = Integer.MIN_VALUE, max2 = Integer.MIN_VALUE; // even positions
        int min1 = Integer.MAX_VALUE, min2 = Integer.MAX_VALUE; // odd positions

        for (int i = 0; i < n; i++) {
            int x = arr[i];
            if (i % 2 == 0) {
                if (x > max1) { max2 = max1; max1 = x; }
                else if (x > max2) { max2 = x; }
            } else {
                if (x < min1) { min2 = min1; min1 = x; }
                else if (x < min2) { min2 = x; }
            }
        }
        return max2 + min2;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(sumSecondLargestSmallest(arr));
        sc.close();
    }
}
