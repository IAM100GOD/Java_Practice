import java.util.*;

// Gray Code (Scaler - Recursion 2)
// Return the A-bit gray code sequence starting at 0 (neighbours differ in one bit).
//   A = 2 -> [0, 1, 3, 2]   (00, 01, 11, 10)
//
// Reflect and prefix:
//   gray(A) = gray(A-1)                                   (leading bit 0)
//           + reverse(gray(A-1)) with bit A-1 set         (leading bit 1)
//   base case: gray(0) = [0]
// Why neighbours still differ in one bit:
//   inside each half, the A-1 bit codes already do;
//   at the seam, the last code of the first half and the first code of the
//   mirrored half are the SAME A-1 bits, only the new top bit differs;
//   the very last code (mirror of 0) is 100..0, one bit away from 0.
// Output has 2^A numbers: O(2^A) time and space, recursion depth A.
// (Same sequence as the formula i ^ (i >> 1), used below as a check.)
public class GrayCode {

    public int[] grayCode(int A) {
        if (A == 0) return new int[]{0};
        int[] prev = grayCode(A - 1);
        int m = prev.length;
        int[] res = new int[2 * m];
        for (int i = 0; i < m; i++) {
            res[i] = prev[i];                                // first half: old codes, top bit 0
            res[2 * m - 1 - i] = prev[i] | (1 << (A - 1));   // second half: mirrored, top bit 1
        }
        return res;
    }

    public static void main(String[] args) {
        GrayCode sol = new GrayCode();
        System.out.println(Arrays.toString(sol.grayCode(2)));   // [0, 1, 3, 2]
        System.out.println(Arrays.toString(sol.grayCode(1)));   // [0, 1]
        System.out.println(Arrays.toString(sol.grayCode(3)));   // [0, 1, 3, 2, 6, 7, 5, 4]
        for (int A = 1; A <= 16; A++) {
            int[] g = sol.grayCode(A);
            Set<Integer> seen = new HashSet<>();
            for (int i = 0; i < g.length; i++) {
                if (g[i] != (i ^ (i >> 1)) || !seen.add(g[i]) || g[i] >= (1 << A)) { System.out.println("BAD A=" + A); return; }
                if (i > 0 && Integer.bitCount(g[i] ^ g[i - 1]) != 1) { System.out.println("BAD STEP A=" + A); return; }
            }
        }
        System.out.println("A = 1..16: all 2^A codes distinct, neighbours differ in exactly one bit, equals i ^ (i >> 1)");
    }
}
