import java.util.Arrays;
import java.util.Random;

// Count of divisors (Scaler - Adv DSA 1 - Maths: Prime Numbers)
// For each A[i], return how many divisors it has (same order as input).
//   [2, 3, 4, 5] -> [2, 2, 3, 2],   [8, 9, 10] -> [4, 3, 4]
//
// Technique: smallest-prime-factor (SPF) sieve + divisor-count formula.
// 1. Sieve once up to max(A): spf[x] = smallest prime that divides x.
// 2. Factorize each x by repeatedly dividing by spf[x]:   x = p1^e1 * p2^e2 * ...
// 3. A divisor picks each prime's power from 0..e independently, so
//        divisors(x) = (e1 + 1) * (e2 + 1) * ...
//    e.g. 12 = 2^2 * 3^1 -> (2+1)(1+1) = 6   {1, 2, 3, 4, 6, 12}
// Sieve: O(M log log M) once, M = max(A) <= 10^6.
// Each query: O(log x), since every division at least halves x.
// Checking divisors up to sqrt(x) per element would be 10^5 * 10^3 = 10^8 steps.
public class CountOfDivisors {

    public int[] solve(int[] A) {
        int max = 1;
        for (int x : A) max = Math.max(max, x);

        int[] spf = new int[max + 1];
        for (int i = 0; i <= max; i++) spf[i] = i;
        for (int i = 2; (long) i * i <= max; i++) {
            if (spf[i] == i) {                              // i is prime
                for (int j = i * i; j <= max; j += i) {
                    if (spf[j] == j) spf[j] = i;            // first (smallest) prime to reach j
                }
            }
        }

        int[] res = new int[A.length];
        for (int k = 0; k < A.length; k++) {
            int x = A[k], count = 1;
            while (x > 1) {
                int p = spf[x], e = 0;
                while (x % p == 0) { x /= p; e++; }
                count *= (e + 1);
            }
            res[k] = count;
        }
        return res;
    }

    // O(sqrt(x)) per number, only used to check the fast version
    static int brute(int x) {
        int c = 0;
        for (int d = 1; (long) d * d <= x; d++) {
            if (x % d == 0) c += (d * d == x) ? 1 : 2;      // d and x/d, once if they are equal
        }
        return c;
    }

    public static void main(String[] args) {
        CountOfDivisors sol = new CountOfDivisors();
        System.out.println(Arrays.toString(sol.solve(new int[]{2, 3, 4, 5})));   // [2, 2, 3, 2]
        System.out.println(Arrays.toString(sol.solve(new int[]{8, 9, 10})));     // [4, 3, 4]
        System.out.println(Arrays.toString(sol.solve(new int[]{1, 12, 720720, 1_000_000, 999_983})));

        Random rnd = new Random(5);
        int[] A = new int[100_000];
        for (int i = 0; i < A.length; i++) A[i] = 1 + rnd.nextInt(1_000_000);
        long t = System.nanoTime();
        int[] got = sol.solve(A);
        long ms = (System.nanoTime() - t) / 1_000_000;
        for (int i = 0; i < A.length; i++) if (got[i] != brute(A[i])) { System.out.println("MISMATCH " + A[i]); return; }
        System.out.println("100000 random values up to 10^6 match brute force (solve took " + ms + " ms)");
    }
}
