// Spiral Matrix Traversal
// ★ High Frequency (Lateral)
// Medium
// 2D Matrix / Boundaries
//
// Given an M x N matrix, return all elements of the matrix in spiral order (outer perimeter inward clockwise).
//
// Sample Test Case
// Input: [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
// Output: [1, 2, 3, 6, 9, 8, 7, 4, 5]
//
// Pattern:
// Maintain 4 boundaries: top, bottom, left, right.
// 1. Traverse top row: left -> right, top++
// 2. Traverse right column: top -> bottom, right--
// 3. Traverse bottom row (if top <= bottom): right -> left, bottom--
// 4. Traverse left column (if left <= right): bottom -> top, left++
// Time: O(M * N), Space: O(1) auxiliary

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class SpiralMatrixTraversal {
    public static List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> result = new ArrayList<>();
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) return result;

        int top = 0;
        int bottom = matrix.length - 1;
        int left = 0;
        int right = matrix[0].length - 1;

        while (top <= bottom && left <= right) {
            // 1. Traverse Right along top boundary
            for (int col = left; col <= right; col++) {
                result.add(matrix[top][col]);
            }
            top++;

            // 2. Traverse Down along right boundary
            for (int row = top; row <= bottom; row++) {
                result.add(matrix[row][right]);
            }
            right--;

            // 3. Traverse Left along bottom boundary (if rows remain)
            if (top <= bottom) {
                for (int col = right; col >= left; col--) {
                    result.add(matrix[bottom][col]);
                }
                bottom--;
            }

            // 4. Traverse Up along left boundary (if cols remain)
            if (left <= right) {
                for (int row = bottom; row >= top; row--) {
                    result.add(matrix[row][left]);
                }
                left++;
            }
        }

        return result;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) {
            // Default demo
            int[][] demo = {
                {1, 2, 3},
                {4, 5, 6},
                {7, 8, 9}
            };
            System.out.println("Demo 3x3 Spiral: " + spiralOrder(demo));
            int[][] demoRect = {
                {1, 2, 3, 4},
                {5, 6, 7, 8},
                {9, 10, 11, 12}
            };
            System.out.println("Demo 3x4 Spiral: " + spiralOrder(demoRect));
            sc.close();
            return;
        }

        int m = sc.nextInt();
        int n = sc.nextInt();
        int[][] mat = new int[m][n];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                mat[i][j] = sc.nextInt();
            }
        }
        System.out.println(spiralOrder(mat));
        sc.close();
    }
}
