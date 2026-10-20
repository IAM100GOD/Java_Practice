import java.math.BigInteger;
import java.util.Random;

// Compute nCr % m (Scaler - Adv DSA 1 - Maths: Combinatorics)
// Return C(A, B) % C for A*B <= 1e6, C <= 1e6.
//   5C2 % 13 = 10,   6C2 % 13 = 15 % 13 = 2
//
// m is NOT guaranteed prime, so n! / (r! (n-r)!) can't be done with modular
// inverses (r! may share factors with m and have no inverse).
// Technique: Pascal's triangle, which only adds:
//   C(i, j) = C(i-1, j-1) + C(i-1, j),   C(i, 0) = 1
// Addition works under any modulus, so take % m at every step.
// Keep one row dp[0..r]; update j from right to left so dp[j-1] is still the
// previous row's value when we read it.
// O(n * r) <= 1e6 time (the A*B limit is exactly for this), O(r) space.
public class ComputeNCrModM {

    public int solve(int A, int B, int C) {
        int[] dp = new int[B + 1];
        dp[0] = 1 % C;                                   // C(i, 0) = 1; 1 % C handles C = 1
        for (int i = 1; i <= A; i++) {
            for (int j = Math.min(i, B); j >= 1; j--) {   // right to left: dp[j-1] is still row i-1
                dp[j] = (dp[j] + dp[j - 1]) % C;
            }
        }
        return dp[B];
    }

    static BigInteger exact(int n, int r) {
        BigInteger res = BigInteger.ONE;
        for (int k = 1; k <= r; k++) res = res.multiply(BigInteger.valueOf(n - r + k)).divide(BigInteger.valueOf(k));
        return res;
    }

    public static void main(String[] args) {
        ComputeNCrModM sol = new ComputeNCrModM();
        System.out.println(sol.solve(5, 2, 13));   // 10
        System.out.println(sol.solve(6, 2, 13));   // 2
        System.out.println(sol.solve(10, 3, 12));  // 120 % 12 = 0 (12 is not prime: inverses would fail)

        Random rnd = new Random(31);
        for (int t = 0; t < 3000; t++) {
            int A = 1 + rnd.nextInt(t % 3 == 0 ? 1000 : 60);
            int B = 1 + rnd.nextInt(Math.min(A, 1_000_000 / A));
            int C = 1 + rnd.nextInt(1_000_000);
            if (sol.solve(A, B, C) != exact(A, B).mod(BigInteger.valueOf(C)).intValue()) {
                System.out.println("MISMATCH " + A + " " + B + " " + C); return;
            }
        }
        System.out.println("3000 random tests match exact BigInteger nCr % m");
        System.out.println("A = 1000000, B = 1, C = 999983 -> " + sol.solve(1_000_000, 1, 999_983) + " (1000000 % 999983 = 17)");
    }
}
