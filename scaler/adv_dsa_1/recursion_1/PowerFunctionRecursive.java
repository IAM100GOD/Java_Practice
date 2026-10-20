import java.math.BigInteger;
import java.util.Random;

// Implement Power Function (Scaler - Recursion 1)
// Return (A^B) % C, never negative.   2^3 % 3 = 2,   3^3 % 1 = 0
//
// Recursive fast power (divide and conquer):
//   a^b = (a^(b/2))^2          if b is even
//   a^b = (a^(b/2))^2 * a      if b is odd
//   a^0 = 1                    base case
// Compute a^(b/2) ONCE, store it in `half`, and square it.
// b halves each call: O(log B) calls (~30 for B = 1e9), O(log B) stack.
// Trap: writing power(a, b/2) * power(a, b/2) makes TWO calls per level,
// which grows into O(B) calls in total, as slow as multiplying B times.
// Negative A: Java % keeps the sign, so shift it into [0, C) first.
public class PowerFunctionRecursive {

    public int pow(int A, int B, int C) {
        long base = ((A % C) + C) % C;             // -1 % 20 = -1 in Java; make it 19
        return (int) power(base, B, C);
    }

    private long power(long a, int b, int c) {
        if (b == 0) return 1 % c;                  // a^0 = 1 (and 1 % 1 = 0)
        long half = power(a, b / 2, c);            // ONE recursive call, reused below
        long res = half * half % c;                // < 1e18, fits in long
        if (b % 2 == 1) res = res * a % c;         // odd b: one extra a
        return res;
    }

    public static void main(String[] args) {
        PowerFunctionRecursive sol = new PowerFunctionRecursive();
        System.out.println(sol.pow(2, 3, 3));      // 2
        System.out.println(sol.pow(3, 3, 1));      // 0
        System.out.println(sol.pow(-1, 1, 20));    // 19
        System.out.println(sol.pow(0, 0, 7));      // 1

        Random rnd = new Random(59);
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
