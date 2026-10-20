import java.math.BigInteger;
import java.util.Random;

// Greatest Common Divisor (Scaler - Adv DSA 1 - Maths: GCD)
// Return gcd(A, B) for 0 <= A, B <= 1e9, without library functions.
//   gcd(4, 6) = 2,   gcd(6, 7) = 1
//
// Technique: Euclid's algorithm.
//   gcd(A, B) = gcd(B, A % B),   gcd(A, 0) = A
// Why it works: write A = q*B + r. Any d dividing A and B also divides
// r = A - q*B, and any d dividing B and r also divides A = q*B + r.
// So (A, B) and (B, r) have exactly the same common divisors.
// The remainder at least halves every two steps: O(log min(A, B)) time, O(1) space.
// Edge cases: gcd(A, 0) = A, gcd(0, B) = B, gcd(0, 0) = 0 (all handled by the loop).
public class GreatestCommonDivisor {

    public int gcd(int A, int B) {
        while (B != 0) {
            int r = A % B;
            A = B;
            B = r;
        }
        return A;
    }

    public static void main(String[] args) {
        GreatestCommonDivisor sol = new GreatestCommonDivisor();
        System.out.println(sol.gcd(4, 6));    // 2
        System.out.println(sol.gcd(6, 7));    // 1
        System.out.println(sol.gcd(0, 9) + " " + sol.gcd(9, 0) + " " + sol.gcd(0, 0));   // 9 9 0
        System.out.println(sol.gcd(1_000_000_000, 999_999_999));                         // 1

        Random rnd = new Random(4);
        for (int t = 0; t < 200_000; t++) {
            int A = rnd.nextInt(1_000_000_001), B = rnd.nextInt(1_000_000_001);
            if (t % 3 == 0) { int k = 1 + rnd.nextInt(1000); A = A / k * k; B = B / k * k; }   // force shared factors
            if (sol.gcd(A, B) != BigInteger.valueOf(A).gcd(BigInteger.valueOf(B)).intValue()) {
                System.out.println("MISMATCH " + A + " " + B); return;
            }
        }
        System.out.println("200000 random tests match BigInteger.gcd");
    }
}
