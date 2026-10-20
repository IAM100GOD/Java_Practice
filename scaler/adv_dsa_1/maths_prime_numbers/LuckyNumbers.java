// Lucky Numbers (Scaler - Maths: Prime Numbers)
// Count numbers in [1, A] with exactly 2 distinct prime divisors.
//   A = 8 -> 1 (6),   A = 12 -> 3 (6, 10, 12)
//   12 = 2^2 * 3 counts: DISTINCT primes are {2, 3}, the power doesn't matter.
//
// Technique: a sieve that counts distinct prime factors.
// cnt[x] = how many distinct primes divide x.
// Go through i = 2..A. If cnt[i] is still 0, no smaller prime divides i,
// so i is prime: add 1 to cnt of every multiple of i (i, 2i, 3i, ...).
// Each prime touches each of its multiples exactly once, so cnt[x] ends up
// as the number of distinct primes of x. Then count cnt[x] == 2.
// O(A log log A) time, O(A) space.
public class LuckyNumbers {

    public int solve(int A) {
        int[] cnt = new int[A + 1];
        for (int i = 2; i <= A; i++) {
            if (cnt[i] == 0) {                                   // no smaller prime divides i -> i is prime
                for (int j = i; j <= A; j += i) cnt[j]++;
            }
        }
        int lucky = 0;
        for (int x = 1; x <= A; x++) {
            if (cnt[x] == 2) lucky++;
        }
        return lucky;
    }

    // count distinct prime factors by trial division, only used to test
    static int distinctPrimes(int x) {
        int c = 0;
        for (int p = 2; p * p <= x; p++) {
            if (x % p == 0) { c++; while (x % p == 0) x /= p; }
        }
        if (x > 1) c++;
        return c;
    }

    public static void main(String[] args) {
        LuckyNumbers sol = new LuckyNumbers();
        System.out.println(sol.solve(8));     // 1
        System.out.println(sol.solve(12));    // 3
        System.out.println(sol.solve(1));     // 0

        int brute = 0;
        for (int A = 1; A <= 50_000; A++) {
            if (distinctPrimes(A) == 2) brute++;
            if (A % 997 == 0 || A == 50_000) {
                if (sol.solve(A) != brute) { System.out.println("MISMATCH " + A); return; }
            }
        }
        System.out.println("matches trial division up to A = 50000 (answer " + brute + ")");
    }
}
