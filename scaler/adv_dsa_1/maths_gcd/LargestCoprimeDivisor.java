import java.util.Random;

// Largest Coprime Divisor (Scaler - Adv DSA 1 - Maths: GCD)
// Largest X with A % X == 0 and gcd(X, B) == 1.
//   A = 30, B = 12 -> 5    (30 = 2*3*5, B = 2^2*3: drop 2 and 3, keep 5)
//   A = 5,  B = 10 -> 1
//
// Idea: X must keep every prime factor of A that B does NOT have, and lose
// every prime factor A shares with B (completely, all its powers).
// Technique: repeatedly divide by the gcd.
//   X = A; while gcd(X, B) != 1: X /= gcd(X, B)
// Each division removes at least one copy of a shared prime; leftover
// powers (like the second 2 in A = 4, B = 2) are caught by the next gcd.
// Prime factors not in B are never touched, so X is the largest such divisor.
// At most ~30 loop rounds (each at least halves X), each a gcd: O(log^2 A).
public class LargestCoprimeDivisor {

    public int cpFact(int A, int B) {
        int X = A;
        int g = gcd(X, B);
        while (g != 1) {
            X /= g;          // drop the factors X still shares with B
            g = gcd(X, B);
        }
        return X;
    }

    private int gcd(int a, int b) {
        while (b != 0) {
            int t = a % b;
            a = b;
            b = t;
        }
        return a;
    }

    // check every divisor of A from largest down, only used to test
    int brute(int A, int B) {
        for (int x = A; x >= 1; x--) if (A % x == 0 && gcd(x, B) == 1) return x;
        return 1;
    }

    public static void main(String[] args) {
        LargestCoprimeDivisor sol = new LargestCoprimeDivisor();
        System.out.println(sol.cpFact(30, 12));    // 5
        System.out.println(sol.cpFact(5, 10));     // 1
        System.out.println(sol.cpFact(1 << 29, 2) + " " + sol.cpFact(999_999_937, 1_000_000_000));   // 1, 999999937

        Random rnd = new Random(13);
        for (int t = 0; t < 30_000; t++) {
            int A = 1 + rnd.nextInt(3000), B = 1 + rnd.nextInt(3000);
            if (sol.cpFact(A, B) != sol.brute(A, B)) { System.out.println("MISMATCH " + A + " " + B); return; }
        }
        System.out.println("30000 random tests match brute force");
    }
}
