import java.util.Random;

// Prime Subsequences (Scaler - Maths: Prime Numbers)
// Count non-empty subsequences of A made only of primes, modulo 1e9+7.
//   A = [1, 2, 3] -> 3   ([2], [3], [2, 3])
//
// A subsequence is a choice, for each position, of "take it" or "skip it".
// It is a prime subsequence exactly when every taken element is prime, i.e.
// it is any non-empty subset of the PRIME POSITIONS.
// If k elements are prime, each is independently in or out: 2^k subsets,
// minus 1 for the empty one. Duplicates count separately ([2, 2] -> 3:
// [2], [2], [2, 2]), since subsequences are chosen by position.
// Sieve up to max(A) to test primality: O(M log log M + N), M = max(A).
public class PrimeSubsequences {

    public int solve(int[] A) {
        final long MOD = 1_000_000_007L;
        int max = 2;
        for (int x : A) max = Math.max(max, x);

        boolean[] composite = new boolean[max + 1];
        composite[0] = composite[1] = true;                  // 0 and 1 are not prime
        for (int i = 2; (long) i * i <= max; i++) {
            if (!composite[i]) {
                for (int j = i * i; j <= max; j += i) composite[j] = true;
            }
        }

        int k = 0;
        for (int x : A) if (!composite[x]) k++;

        long ways = 1;
        for (int i = 0; i < k; i++) ways = ways * 2 % MOD;   // 2^k: each prime is in or out
        return (int) ((ways - 1 + MOD) % MOD);               // minus the empty subsequence
    }

    static boolean isPrime(int n) {
        if (n < 2) return false;
        for (int d = 2; d * d <= n; d++) if (n % d == 0) return false;
        return true;
    }

    // enumerate every subsequence, only used to test small arrays
    static int brute(int[] A) {
        int c = 0;
        for (int mask = 1; mask < (1 << A.length); mask++) {
            boolean ok = true;
            for (int i = 0; i < A.length && ok; i++) if ((mask >> i & 1) == 1 && !isPrime(A[i])) ok = false;
            if (ok) c++;
        }
        return c;
    }

    public static void main(String[] args) {
        PrimeSubsequences sol = new PrimeSubsequences();
        System.out.println(sol.solve(new int[]{1, 2, 3}));    // 3
        System.out.println(sol.solve(new int[]{2, 2}));       // 3
        System.out.println(sol.solve(new int[]{1, 4, 6}));    // 0

        Random rnd = new Random(23);
        for (int t = 0; t < 5000; t++) {
            int[] A = new int[1 + rnd.nextInt(14)];
            for (int i = 0; i < A.length; i++) A[i] = 1 + rnd.nextInt(t % 2 == 0 ? 30 : 1_000_000);
            if (sol.solve(A) != brute(A)) { System.out.println("MISMATCH " + java.util.Arrays.toString(A)); return; }
        }
        System.out.println("5000 random arrays match full subsequence enumeration");

        int[] big = new int[1000];
        java.util.Arrays.fill(big, 999_983);                  // 1000 copies of a prime
        System.out.println("1000 primes -> (2^1000 - 1) % MOD = " + sol.solve(big)
                + "  (BigInteger: " + java.math.BigInteger.TWO.pow(1000).subtract(java.math.BigInteger.ONE).mod(java.math.BigInteger.valueOf(1_000_000_007)) + ")");
    }
}
