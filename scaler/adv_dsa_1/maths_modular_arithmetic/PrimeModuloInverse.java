import java.math.BigInteger;
import java.util.Random;

// Prime Modulo Inverse (Scaler - Adv DSA 1 - Maths: Modular Arithmetic)
// Find X = A^-1 mod B, i.e. the X in [0, B) with (A * X) % B == 1.
// B is prime and gcd(A, B) = 1.
//   A = 3, B = 5  -> 2   (3 * 2 = 6,  6 % 5 = 1)
//   A = 6, B = 23 -> 4   (6 * 4 = 24, 24 % 23 = 1)
//
// Technique: Fermat's little theorem + fast power.
// If B is prime and B does not divide A:   A^(B-1) ≡ 1 (mod B)
// Split one A off:                          A * A^(B-2) ≡ 1 (mod B)
// So A^(B-2) is exactly the number that multiplies A to 1, the inverse.
// Compute it with binary exponentiation: O(log B) time, O(1) space,
// instead of trying X = 1, 2, ..., B-1 (up to 10^9 tries).
public class PrimeModuloInverse {

    public int solve(int A, int B) {
        return (int) power(A % B, B - 2, B);   // A can be larger than B, reduce it first
    }

    private long power(long base, long exp, long mod) {
        long result = 1 % mod;
        base %= mod;
        while (exp > 0) {
            if ((exp & 1) == 1) result = result * base % mod;
            base = base * base % mod;          // < 10^18, fits in long
            exp >>= 1;
        }
        return result;
    }

    public static void main(String[] args) {
        PrimeModuloInverse sol = new PrimeModuloInverse();
        System.out.println(sol.solve(3, 5));    // 2
        System.out.println(sol.solve(6, 23));   // 4
        System.out.println(sol.solve(1_000_000_000, 999_999_937));

        // check (A * X) % B == 1 and compare with BigInteger.modInverse
        Random rnd = new Random(7);
        int checked = 0;
        while (checked < 20_000) {
            int B = BigInteger.valueOf(2 + rnd.nextInt(999_999_999)).nextProbablePrime().intValue();
            if (B > 1_000_000_000) continue;
            int A = 1 + rnd.nextInt(1_000_000_000);
            if (A % B == 0) continue;                       // gcd(A, B) must be 1
            int x = sol.solve(A, B);
            long want = BigInteger.valueOf(A).modInverse(BigInteger.valueOf(B)).longValue();
            if (x != want || (long) A % B * x % B != 1) { System.out.println("MISMATCH " + A + " " + B); return; }
            checked++;
        }
        System.out.println(checked + " random tests: A*X % B == 1 and match BigInteger.modInverse");
    }
}
