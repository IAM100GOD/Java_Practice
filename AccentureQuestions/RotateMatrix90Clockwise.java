// Rotate Matrix 90° Clockwise In-Place (Accenture)
// Level: Medium | Topic: Matrix Transformation
//
// Given an N x N 2D matrix representing an image, rotate the image by 90 degrees clockwise
// in-place (without allocating another 2D matrix).
//
// Sample Test Case
// Input: [[1, 2], [3, 4]]
// Output: [[3, 1], [4, 2]]
//
// Pattern:
// 1. Transpose the matrix (swap mat[i][j] with mat[j][i] for j > i).
// 2. Reverse each row (swap mat[i][j] with mat[i][n - 1 - j] for j < n / 2).
// Time: O(N^2), Space: O(1) in-place.

import java.util.Arrays;
import java.util.Scanner;

public class RotateMatrix90Clockwise {
    public static void rotate(int[][] mat) {
        int n = mat.length;
        if (n <= 1) return;

        // Step 1: Transpose matrix (swap mat[i][j] with mat[j][i])
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int temp = mat[i][j];
                mat[i][j] = mat[j][i];
                mat[j][i] = temp;
            }
        }

        // Step 2: Reverse each row
        for (int i = 0; i < n; i++) {
            int left = 0, right = n - 1;
            while (left < right) {
                int temp = mat[i][left];
                mat[i][left] = mat[i][right];
                mat[i][right] = temp;
                left++;
                right--;
            }
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) {
            int[][] demo2 = { {1, 2}, {3, 4} };
            rotate(demo2);
            System.out.println("2x2: " + Arrays.deepToString(demo2));
            int[][] demo3 = { {1, 2, 3}, {4, 5, 6}, {7, 8, 9} };
            rotate(demo3);
            System.out.println("3x3: " + Arrays.deepToString(demo3));
            sc.close();
            return;
        }
        int n = sc.nextInt();
        int[][] mat = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                mat[i][j] = sc.nextInt();
            }
        }
        rotate(mat);
        System.out.println(Arrays.deepToString(mat));
        sc.close();
    }
}
