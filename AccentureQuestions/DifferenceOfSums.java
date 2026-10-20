// 02
// Difference of Sums (n, m)
// ★ Very Frequent
// Easy
// Math / Number Theory
// Implement function differenceofSum(n, m). 
// Sum all integers from 1 to m that are NOT divisible by n, and sum all integers that ARE divisible by n. 
// Return the difference: (sum_not_divisible - sum_divisible).

// Sample Test Case
// Input: n = 4, m = 20
// Divisible by 4: 4 + 8 + 12 + 16 + 20 = 60
// Not Divisible: 1+2+3+5+6+7+9+10+11+13+14+15+17+18+19 = 150
// Output: 90 (150 - 60)

import java.util.Scanner;

public class DifferenceOfSums {
    // Optimal O(1) mathematical formulation
    public static int differenceofSum(int n, int m) {
        // Total sum from 1 to m
        int totalSum = m * (m + 1) / 2;
        
        // Count of numbers divisible by n
        int k = m / n;
        
        // Sum of multiples of n: n * (1 + 2 + ... + k)
        int sumDivisible = n * (k * (k + 1) / 2);
        
        int sumNotDivisible = totalSum - sumDivisible;
        
        return sumNotDivisible - sumDivisible;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int m = sc.nextInt();
        System.out.println(differenceofSum(n, m));
        sc.close();
    }
}