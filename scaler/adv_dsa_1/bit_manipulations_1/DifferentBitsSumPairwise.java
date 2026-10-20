// Different Bits Sum Pairwise (Scaler - Adv DSA Bit Manipulations 1)
// f(X, Y) = number of bit positions where X and Y differ.
// Return the sum of f(A[i], A[j]) over ALL ordered pairs (i, j), modulo 1e9+7.
//   A = [1, 3, 5] -> 8,   A = [2, 3] -> 2
//
// Technique: count per bit, not per pair.
// Look at one bit position at a time. If `ones` numbers have a 1 there and
// `zeros = N - ones` have a 0, then exactly ones * zeros unordered pairs differ
// at that bit. Pairs are ordered ((i,j) and (j,i) both count), so that bit adds
// 2 * ones * zeros. Pairs (i,i) never differ, so they add nothing.
// 31 bits x N numbers: O(31 * N) = O(N) time, O(1) space,
// instead of O(N^2 * 31) for checking every pair.
public class DifferentBitsSumPairwise {

    public static int cntBits(int[] A) {
        final long MOD = 1_000_000_007L;
        long n = A.length, ans = 0;

        for (int bit = 0; bit < 31; bit++) {               // A[i] <= 2^31 - 1, so bits 0..30
            long ones = 0;
            for (int x : A) {
                if (((x >> bit) & 1) == 1) ones++;
            }
            ans = (ans + 2 * ones * (n - ones)) % MOD;    // fits in long: 2 * 5e4 * 5e4 at most
        }
        return (int) ans;
    }

    // O(N^2 * 31) brute force, only used to check the fast version
    static long brute(int[] A) {
        long sum = 0;
        for (int x : A)
            for (int y : A)
                sum += Integer.bitCount(x ^ y);           // XOR has a 1 exactly where bits differ
        return sum % 1_000_000_007L;
    }

    public static void main(String[] args) {
        int[][] tests = {{1, 3, 5}, {2, 3}, {7}, {Integer.MAX_VALUE, 1, 8, 1024}};
        for (int[] A : tests) {
            System.out.println(java.util.Arrays.toString(A) + " -> " + cntBits(A) + "  (brute: " + brute(A) + ")");
        }
    }
}
