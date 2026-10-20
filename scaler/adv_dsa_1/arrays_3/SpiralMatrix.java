import java.util.Arrays;

// Spiral Order Matrix II (Scaler - Adv DSA Arrays 3)
// Given A, return an A x A matrix filled with 1..A^2 in spiral (clockwise) order.
//   A = 3  ->  1 2 3
//              8 9 4
//              7 6 5
//
// Technique: four shrinking boundaries (top, bottom, left, right).
// Walk one layer at a time: top row left->right, right column top->bottom,
// bottom row right->left, left column bottom->top. After each side, move
// that boundary inward so it is never filled twice.
// Every cell is written exactly once: O(A^2) time (the output size, so optimal),
// O(1) extra space besides the matrix.
public class SpiralMatrix {

    public static int[][] generateMatrix(int A) {
        int[][] mat = new int[A][A];
        int top = 0, bottom = A - 1, left = 0, right = A - 1;
        int num = 1;

        while (num <= A * A) {
            for (int j = left; j <= right; j++) mat[top][j] = num++;        // top row, left -> right
            top++;

            for (int i = top; i <= bottom; i++) mat[i][right] = num++;      // right column, top -> bottom
            right--;

            if (top <= bottom) {
                for (int j = right; j >= left; j--) mat[bottom][j] = num++; // bottom row, right -> left
                bottom--;
            }

            if (left <= right) {
                for (int i = bottom; i >= top; i--) mat[i][left] = num++;   // left column, bottom -> top
                left++;
            }
        }
        return mat;
    }

    public static void main(String[] args) {
        for (int A : new int[]{1, 2, 3, 4, 5}) {
            System.out.println("A = " + A);
            for (int[] row : generateMatrix(A)) {
                System.out.println(Arrays.toString(row));
            }
        }
    }
}
