import java.util.*;

// Distinct Primes (Scaler - Maths: Prime Numbers)
// G = product of all A[i]. Return how many distinct primes divide G.
//   A = [1, 2, 3, 4] -> G = 24 = 2^3 * 3 -> 2
//
// Never compute G: with 1e5 numbers up to 1e5 it has ~500,000 digits.
// A prime divides a product iff it divides at least one factor, so
//   primes(G) = union of primes(A[i]).
// Technique: smallest-prime-factor sieve up to max(A), factor every A[i]
// by dividing by spf[x], and record each prime the first time it's seen.
// O(M log log M + N log M) time, O(M) space, M = max(A).
public class DistinctPrimes {

    public int solve(int[] A) {
        int max = 1;
        for (int x : A) max = Math.max(max, x);

        int[] spf = new int[max + 1];
        for (int i = 0; i <= max; i++) spf[i] = i;
        for (int i = 2; (long) i * i <= max; i++) {
            if (spf[i] == i) {
                for (int j = i * i; j <= max; j += i)
                    if (spf[j] == j) spf[j] = i;
            }
        }

        boolean[] seen = new boolean[max + 1];
        int count = 0;
        for (int x : A) {
            while (x > 1) {
                int p = spf[x];
                if (!seen[p]) { seen[p] = true; count++; }
                while (x % p == 0) x /= p;
            }
        }
        return count;
    }

    // union of trial-division factorizations, only used to test
    static int brute(int[] A) {
        Set<Integer> ps = new HashSet<>();
        for (int x : A) {
            for (int p = 2; p * p <= x; p++) if (x % p == 0) { ps.add(p); while (x % p == 0) x /= p; }
            if (x > 1) ps.add(x);
        }
        return ps.size();
    }

    public static void main(String[] args) {
        DistinctPrimes sol = new DistinctPrimes();
        System.out.println(sol.solve(new int[]{1, 2, 3, 4}));      // 2
        System.out.println(sol.solve(new int[]{1, 1, 1}));         // 0 (G = 1 has no prime divisors)
        System.out.println(sol.solve(new int[]{30, 49, 11}));      // 2,3,5,7,11 -> 5

        Random rnd = new Random(29);
        for (int t = 0; t < 3000; t++) {
            int[] A = new int[1 + rnd.nextInt(50)];
            for (int i = 0; i < A.length; i++) A[i] = 1 + rnd.nextInt(t % 2 == 0 ? 60 : 100_000);
            if (sol.solve(A) != brute(A)) { System.out.println("MISMATCH " + Arrays.toString(A)); return; }
        }
        System.out.println("3000 random arrays match trial division");

        int[] all = new int[100_000];
        for (int i = 0; i < all.length; i++) all[i] = i + 1;
        System.out.println("A = 1..100000 -> " + sol.solve(all) + " (number of primes <= 100000 is 9592)");
    }
}
