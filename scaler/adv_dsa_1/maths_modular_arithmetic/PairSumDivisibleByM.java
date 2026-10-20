import java.util.Random;

// Pair Sum divisible by M (Scaler - Adv DSA 1 - Maths: Modular Arithmetic)
// Count pairs i < j with (A[i] + A[j]) % B == 0, modulo 1e9+7.
//   A = [1, 2, 3, 4, 5], B = 2   -> 4   (1,3) (1,5) (2,4) (3,5)
//   A = [5, 17, 100, 11], B = 28 -> 1   (17,11)
//
// Technique: only remainders matter.
// (x + y) % B == 0  <=>  (x % B + y % B) % B == 0
// So x with remainder r pairs with every earlier y whose remainder is (B - r) % B.
//   r = 0      needs 0         (0 + 0 = 0)
//   r = 3, B=7 needs 4         (3 + 4 = 7)
// One pass: for each x, add how many earlier numbers have the needed
// remainder, then record x's own remainder. Counting only EARLIER numbers
// counts each pair once and never pairs x with itself.
// O(N + B) time, O(B) space, instead of O(N^2) for checking every pair.
public class PairSumDivisibleByM {

    public int solve(int[] A, int B) {
        final long MOD = 1_000_000_007L;
        long[] count = new long[B];          // count[r] = earlier numbers with remainder r
        long ans = 0;

        for (int x : A) {
            int r = x % B;
            int need = (B - r) % B;          // % B turns "B - 0" into 0
            ans = (ans + count[need]) % MOD;
            count[r]++;
        }
        return (int) ans;
    }

    // O(N^2) brute force, only used to check the fast version
    static long brute(int[] A, int B) {
        long c = 0;
        for (int i = 0; i < A.length; i++)
            for (int j = i + 1; j < A.length; j++)
                if (((long) A[i] + A[j]) % B == 0) c++;     // long: A[i] + A[j] can exceed int
        return c % 1_000_000_007L;
    }

    public static void main(String[] args) {
        PairSumDivisibleByM sol = new PairSumDivisibleByM();
        System.out.println(sol.solve(new int[]{1, 2, 3, 4, 5}, 2));       // 4
        System.out.println(sol.solve(new int[]{5, 17, 100, 11}, 28));     // 1

        Random rnd = new Random(3);
        for (int t = 0; t < 2000; t++) {
            int n = 1 + rnd.nextInt(300), B = 1 + rnd.nextInt(t % 2 == 0 ? 10 : 1_000_000);
            int[] A = new int[n];
            for (int i = 0; i < n; i++) A[i] = 1 + rnd.nextInt(1_000_000_000);
            if (sol.solve(A, B) != brute(A, B)) { System.out.println("MISMATCH"); return; }
        }
        System.out.println("2000 random tests match brute force");

        int[] same = new int[100_000];
        java.util.Arrays.fill(same, 6);
        System.out.println("100000 copies of 6, B = 3 -> " + sol.solve(same, 3)
                + "  (C(100000,2) = 4999950000, % (1e9+7) = " + (4_999_950_000L % 1_000_000_007L) + ")");
    }
}
