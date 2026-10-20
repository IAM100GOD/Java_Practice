import java.util.Random;

// Divisor game (Scaler - Adv DSA 1 - Maths: GCD)
// Count positive integers <= A divisible by both B and C.
//   A = 12, B = 3, C = 2 -> 2   (6, 12)
//   A = 6,  B = 1, C = 4 -> 1   (4)
//
// Divisible by both B and C  <=>  divisible by lcm(B, C).
// (Not B*C in general: B = 4, C = 6 -> 12 is divisible by both, but not by 24.)
// lcm(B, C) = B * C / gcd(B, C). The multiples of L up to A are L, 2L, ..., so
// there are exactly A / L of them.
// O(log min(B, C)) for the gcd, O(1) space.
// Overflow: B * C can reach 1e18, so divide by the gcd first and use long.
public class DivisorGame {

    public int solve(int A, int B, int C) {
        int g = gcd(B, C);
        long lcm = (long) B / g * C;      // divide first; long because lcm can reach 1e18
        return (int) (A / lcm);
    }

    private int gcd(int a, int b) {
        while (b != 0) {
            int t = a % b;
            a = b;
            b = t;
        }
        return a;
    }

    // count directly, only used to test
    int brute(int A, int B, int C) {
        int c = 0;
        for (int x = 1; x <= A; x++) if (x % B == 0 && x % C == 0) c++;
        return c;
    }

    public static void main(String[] args) {
        DivisorGame sol = new DivisorGame();
        System.out.println(sol.solve(12, 3, 2));    // 2
        System.out.println(sol.solve(6, 1, 4));     // 1
        System.out.println(sol.solve(24, 4, 6));    // lcm 12 -> 2 (B*C = 24 would give 1)
        System.out.println(sol.solve(1_000_000_000, 999_999_937, 999_999_929));   // lcm ~1e18 -> 0, no overflow

        Random rnd = new Random(21);
        for (int t = 0; t < 20_000; t++) {
            int A = 1 + rnd.nextInt(2000), B = 1 + rnd.nextInt(60), C = 1 + rnd.nextInt(60);
            if (sol.solve(A, B, C) != sol.brute(A, B, C)) { System.out.println("MISMATCH " + A + " " + B + " " + C); return; }
        }
        System.out.println("20000 random tests match brute force");
    }
}
