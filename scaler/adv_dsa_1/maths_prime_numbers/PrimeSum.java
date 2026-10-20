import java.util.Arrays;

// Prime Sum (Scaler - Maths: Prime Numbers)
// Given an even A > 2, return primes [a, b] with a + b = A and the smallest a.
//   4 -> [2, 2],  10 -> [3, 7]  (not [5, 5]: 3 < 5)
//
// Technique: Sieve of Eratosthenes + scan from the smallest a.
// 1. Sieve up to A once: composite[x] = true if x is not prime.
// 2. Try a = 2, 3, 4, ... and return the first a where both a and A - a are prime.
//    Lexicographically smallest = smallest a, so the first hit is the answer.
//    (b = A - a >= a as long as a <= A/2.)
// Goldbach's conjecture (verified far beyond 2*10^7) guarantees a hit.
// Sieve: O(A log log A) time, O(A) space (2*10^7 booleans = 20 MB).
// The scan stops very early: for A <= 2*10^7 the smallest a is always tiny.
public class PrimeSum {

    public int[] primesum(int A) {
        boolean[] composite = new boolean[A + 1];
        for (int i = 2; (long) i * i <= A; i++) {
            if (!composite[i]) {
                for (int j = i * i; j <= A; j += i) composite[j] = true;
            }
        }
        for (int a = 2; a <= A / 2; a++) {
            if (!composite[a] && !composite[A - a]) return new int[]{a, A - a};
        }
        return new int[0];    // never reached for even A > 2 (Goldbach)
    }

    static boolean isPrime(int n) {
        if (n < 2) return false;
        for (int d = 2; (long) d * d <= n; d++) if (n % d == 0) return false;
        return true;
    }

    public static void main(String[] args) {
        PrimeSum sol = new PrimeSum();
        System.out.println(Arrays.toString(sol.primesum(4)));     // [2, 2]
        System.out.println(Arrays.toString(sol.primesum(10)));    // [3, 7]
        System.out.println(Arrays.toString(sol.primesum(100)));   // [3, 97]

        for (int A = 4; A <= 20_000; A += 2) {
            int[] got = sol.primesum(A);
            int a = 2;
            while (!(isPrime(a) && isPrime(A - a))) a++;         // smallest valid a by trial division
            if (got[0] != a || got[1] != A - a) { System.out.println("MISMATCH " + A); return; }
        }
        System.out.println("every even A from 4 to 20000 matches trial division");

        long t = System.nanoTime();
        int[] big = sol.primesum(20_000_000);
        System.out.println("A = 20000000 -> " + Arrays.toString(big) + " in " + (System.nanoTime() - t) / 1_000_000 + " ms"
                + "  (both prime: " + (isPrime(big[0]) && isPrime(big[1])) + ")");
    }
}
