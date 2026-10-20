// Rat Count House (Food Gathering) (Accenture)
// ★ Very Frequent | Easy | Basic Simulation
// There are r rats and each rat consumes `unit` amount of food.
// arr[i] is the food in house i (consecutive houses starting from index 0).
// Find the minimum number of houses (from the start) needed to feed all rats.
// Return -1 if total food is insufficient, and 0 if the array is null or empty.
//
// Sample Test Case
// Input: r = 7, unit = 2, arr = [2, 8, 3, 5, 7, 4, 1, 2]
// Food needed = 7 * 2 = 14
// 2 -> 10 -> 13 -> 18 (>= 14 after 4 houses)
// Output: 4

import java.util.Scanner;

public class RatCountHouse {
    public static int ratCount(int r, int unit, int[] arr) {
        if (arr == null || arr.length == 0) return 0;

        long needed = (long) r * unit;   // long avoids overflow
        long food = 0;

        for (int i = 0; i < arr.length; i++) {
            food += arr[i];
            if (food >= needed) return i + 1;   // houses 0..i are enough
        }
        return -1;                              // all houses together are not enough
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int unit = sc.nextInt();
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(ratCount(r, unit, arr));
        sc.close();
    }
}
