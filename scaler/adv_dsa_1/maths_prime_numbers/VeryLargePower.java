// Very Large Power (Scaler - Adv DSA 1 - Maths: Prime Numbers)
// Return A^(B!) % (1e9+7).
//   A = 1, B = 1 -> 1^1 = 1
//   A = 2, B = 2 -> 2^2 = 4
//
// B! is astronomically large (500000! has ~2.6 million digits), so it can't be
// computed. Technique: shrink the exponent with Fermat's little theorem.
// MOD = 1e9+7 is prime and A <= 5e5 < MOD, so  A^(MOD-1) ≡ 1 (mod MOD).
// Every full block of (MOD-1) in the exponent multiplies by 1, so only the
// exponent's remainder modulo (MOD-1) matters:
//     A^(B!) ≡ A^(B! mod (MOD-1))  (mod MOD)
// Build B! mod (MOD-1) step by step (1*2*3*...*B, taking % each time),
// then fast power.  O(B + log MOD) time, O(1) space.
// Trap: reducing the exponent mod MOD (not MOD-1) gives wrong answers.
public class VeryLargePower {

    public int solve(int A, int B) {
        final long MOD = 1_000_000_007L;
        long exp = 1;
        for (int i = 2; i <= B; i++) {
            exp = exp * i % (MOD - 1);              // exp < 1e9+6, i <= 5e5: product fits in long
        }
        return (int) power(A, exp, MOD);
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

    // A^(B!) = (((A^2)^3)^4 ... )^B, computed directly with no Fermat; only used to check
    long slow(int A, int B) {
        long r = A % 1_000_000_007L;
        for (int i = 2; i <= B; i++) r = power(r, i, 1_000_000_007L);
        return r;
    }

    public static void main(String[] args) {
        VeryLargePower sol = new VeryLargePower();
        System.out.println(sol.solve(1, 1));     // 1
        System.out.println(sol.solve(2, 2));     // 4
        System.out.println(sol.solve(2, 3));     // 2^6 = 64

        java.util.Random rnd = new java.util.Random(9);
        for (int t = 0; t < 300; t++) {
            int A = 1 + rnd.nextInt(500_000), B = 1 + rnd.nextInt(t < 290 ? 2000 : 500_000);
            if (sol.solve(A, B) != sol.slow(A, B)) { System.out.println("MISMATCH " + A + " " + B); return; }
        }
        System.out.println("300 random tests match the direct (((A^2)^3)...)^B computation");
        System.out.println("A = B = 500000 -> " + sol.solve(500_000, 500_000) + "  (direct: " + sol.slow(500_000, 500_000) + ")");
    }
}
