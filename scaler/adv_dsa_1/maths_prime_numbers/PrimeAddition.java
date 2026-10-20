// Prime Addition (Scaler - Maths: Prime Numbers)
// N is even. Return the minimum number of primes (repeats allowed) that sum to N.
//   26 -> 2  (13 + 13, or 3 + 23)
//
// - N = 2: 2 is itself prime, so 1 prime is enough.
// - N > 2 even: N is not prime (it's divisible by 2), so 1 prime can't work.
//   Goldbach's conjecture: every even number > 2 is a sum of two primes.
//   It is unproven in general, but verified by computer up to 4 * 10^18,
//   far beyond N <= 10^9. So the answer is 2.
// O(1) time, O(1) space.
public class PrimeAddition {

    public int solve(int A) {
        if (A == 2) return 1;    // 2 is itself prime
        return 2;                // Goldbach: every even number > 2 is a sum of two primes
    }

    public static void main(String[] args) {
        PrimeAddition sol = new PrimeAddition();
        System.out.println(sol.solve(26));   // 2
        System.out.println(sol.solve(2));    // 1
        System.out.println(sol.solve(4));    // 2 (2 + 2)

        // check Goldbach for every even N up to 10^7 with a sieve
        int LIM = 10_000_000;
        boolean[] composite = new boolean[LIM + 1];
        composite[0] = composite[1] = true;
        for (int i = 2; (long) i * i <= LIM; i++)
            if (!composite[i]) for (int j = i * i; j <= LIM; j += i) composite[j] = true;
        for (int N = 4; N <= LIM; N += 2) {
            int a = 2;
            while (composite[a] || composite[N - a]) a++;
            if (a > N / 2) { System.out.println("no pair for " + N); return; }
        }
        System.out.println("every even N from 4 to 10^7 splits into two primes, so the answer 2 holds there");
    }
}
