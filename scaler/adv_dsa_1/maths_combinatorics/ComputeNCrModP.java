import java.math.BigInteger;
import java.util.Random;

// Compute nCr % p (Scaler - Adv DSA 1 - Maths: Combinatorics)
// Return C(A, B) % C where C = p is prime and p >= n (the problem also allows p = 1).
//   5C2 % 13 = 10,   6C2 % 13 = 2
//
// nCr = n * (n-1) * ... * (n-r+1) / r!
// Division under a prime modulus = multiplying by the modular inverse, and by
// Fermat's little theorem  x^-1 ≡ x^(p-2) (mod p)  whenever p does not divide x.
// r! = 1*2*...*r has an inverse as long as every factor is < p.
// Use C(n, r) = C(n, n-r) to make r <= n/2: then r < p (since p >= n),
// so r! is never divisible by p. (If p == n, the numerator contains p and the
// answer is correctly 0 for 0 < r < n.)
// O(min(r, n-r) + log p) time, O(1) space.
// Edge: p = 1 -> everything is 0 mod 1.
public class ComputeNCrModP {

    public int solve(int A, int B, int C) {
        if (C == 1) return 0;                            // everything is 0 mod 1
        long p = C;
        int r = Math.min(B, A - B);                      // C(n, r) = C(n, n - r); keeps r < p
        long num = 1, den = 1;
        for (int k = 1; k <= r; k++) {
            num = num * (A - r + k) % p;                 // n * (n-1) * ... * (n-r+1)
            den = den * k % p;                           // r!
        }
        return (int) (num * power(den, p - 2, p) % p);   // Fermat: den^-1 = den^(p-2)
    }

    private long power(long base, long exp, long mod) {
        long result = 1 % mod;
        base %= mod;
        while (exp > 0) {
            if ((exp & 1) == 1) result = result * base % mod;
            base = base * base % mod;
            exp >>= 1;
        }
        return result;
    }

    static BigInteger exact(int n, int r) {
        BigInteger res = BigInteger.ONE;
        for (int k = 1; k <= r; k++) res = res.multiply(BigInteger.valueOf(n - r + k)).divide(BigInteger.valueOf(k));
        return res;
    }

    public static void main(String[] args) {
        ComputeNCrModP sol = new ComputeNCrModP();
        System.out.println(sol.solve(5, 2, 13));          // 10
        System.out.println(sol.solve(6, 2, 13));          // 2
        System.out.println(sol.solve(7, 3, 7) + " " + sol.solve(7, 7, 7) + " " + sol.solve(1, 1, 1));   // p = n: 0, 1;  p = 1: 0

        Random rnd = new Random(37);
        int tests = 0;
        while (tests < 5000) {
            int n = 1 + rnd.nextInt(tests % 2 == 0 ? 50 : 3000);
            int p = BigInteger.valueOf(n + rnd.nextInt(tests % 5 == 0 ? 1 : 100_000)).nextProbablePrime().intValue();
            if (tests % 7 == 0 && BigInteger.valueOf(n).isProbablePrime(30)) p = n;      // p == n edge case
            int r = 1 + rnd.nextInt(n);
            if (sol.solve(n, r, p) != exact(n, r).mod(BigInteger.valueOf(p)).intValue()) {
                System.out.println("MISMATCH " + n + " " + r + " " + p); return;
            }
            tests++;
        }
        System.out.println("5000 random tests (including p == n) match exact BigInteger nCr % p");
        long t = System.nanoTime();
        int big = sol.solve(1_000_000, 500_000, 1_000_000_007);
        System.out.println("C(10^6, 5*10^5) % (1e9+7) = " + big + " in " + (System.nanoTime() - t) / 1_000_000 + " ms");
    }
}
