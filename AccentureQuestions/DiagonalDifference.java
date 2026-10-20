// Matrix Diagonal Difference (Accenture)
// Level: Easy | Topic: 2D Arrays / Matrices
//
// Given a square matrix of size N x N, calculate the absolute difference between the sums of
// its primary diagonal and secondary diagonal.
//
// Sample Test Case
// Input: [[11, 2, 4], [4, 5, 6], [10, 8, -12]]
// Primary diagonal:   11 + 5 + (-12) = 4
// Secondary diagonal: 4 + 5 + 10 = 19
// Output: |4 - 19| = 15

import java.util.Scanner;

public class DiagonalDifference {
    // One loop over i: primary is [i][i], secondary is [i][n-1-i]. O(N) time, O(1) space
    public static int diagonalDifference(int[][] mat) {
        int n = mat.length;
        int primary = 0, secondary = 0;
        for (int i = 0; i < n; i++) {
            primary += mat[i][i];
            secondary += mat[i][n - 1 - i];
        }
        return Math.abs(primary - secondary);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] mat = new int[n][n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                mat[i][j] = sc.nextInt();
        System.out.println(diagonalDifference(mat));
        sc.close();
    }
}
