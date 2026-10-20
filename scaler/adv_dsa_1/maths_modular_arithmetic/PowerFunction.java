import java.math.BigInteger;
import java.util.Random;

// Implement Power Function (Scaler - Adv DSA 1 - Maths: Modular Arithmetic)
// Return (A^B) % C, never negative.
//   A = 2, B = 3, C = 3 -> 8 % 3 = 2
//   A = 3, B = 3, C = 1 -> 0
//
// Technique: fast (binary) exponentiation + modular arithmetic.
// Write B in binary. A^13 = A^(8+4+1) = A^8 * A^4 * A^1.
// Keep squaring a running `base` (A, A^2, A^4, A^8, ...) and multiply it into
// `result` only when the matching bit of B is 1.
// (x * y) % C == ((x % C) * (y % C)) % C, so take % C after every multiply
// and the numbers never grow past C^2 <= 10^18 (fits in long).
// O(log B) multiplications (~30 for B = 10^9) instead of B of them.
public class PowerFunction {

    public int pow(int A, int B, int C) {
        long base = ((A % C) + C) % C;     // Java % can be negative for negative A; shift into [0, C)
        long result = 1 % C;               // 1 % C handles C = 1 (answer is always 0)
        long b = B;

        while (b > 0) {
            if ((b & 1) == 1) {
                result = (result * base) % C;   // this bit of B is set: include base
            }
            base = (base * base) % C;           // A^(2^k) -> A^(2^(k+1))
            b >>= 1;
        }
        return (int) result;
    }

    public static void main(String[] args) {
        PowerFunction sol = new PowerFunction();
        System.out.println(sol.pow(2, 3, 3));                 // 2
        System.out.println(sol.pow(3, 3, 1));                 // 0
        System.out.println(sol.pow(-1, 1, 20));               // 19, not -1
        System.out.println(sol.pow(5, 0, 7));                 // 1
        System.out.println(sol.pow(0, 0, 1));                 // 0
        System.out.println(sol.pow(-1_000_000_000, 1_000_000_000, 1_000_000_000 - 7));

        // compare with BigInteger.modPow on random inputs
        Random rnd = new Random(1);
        for (int t = 0; t < 100_000; t++) {
            int A = rnd.nextInt(2_000_000_001) - 1_000_000_000;
            int B = rnd.nextInt(1_000_000_001);
            int C = 1 + rnd.nextInt(1_000_000_000);
            long want = BigInteger.valueOf(A).modPow(BigInteger.valueOf(B), BigInteger.valueOf(C)).longValue();
            if (sol.pow(A, B, C) != want) { System.out.println("MISMATCH " + A + " " + B + " " + C); return; }
        }
        System.out.println("100000 random tests match BigInteger.modPow");
    }
}
