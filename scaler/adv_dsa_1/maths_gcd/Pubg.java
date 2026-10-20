import java.util.Arrays;

// Pubg (Scaler - Adv DSA 1 - Maths: GCD)
// Player i attacking player j sets A[j] = max(0, A[j] - A[i]). Players at 0 are out.
// Return the minimum health the last survivor can end with.
//   [6, 4] -> 2,   [2, 3, 4] -> 1
//
// Answer: the gcd of all strengths.
// An attack is a subtraction, exactly the step of subtraction-Euclid
// (gcd(a, b) = gcd(a - b, b)). So:
// 1. It can't go below g = gcd(A): every strength starts as a multiple of g,
//    and a multiple of g minus a multiple of g is still a multiple of g.
//    So the survivor's health is a positive multiple of g, i.e. >= g.
// 2. It can reach g: let the weakest player keep attacking everyone else.
//    That is Euclid on the whole array, and it ends with one player at g.
// Fold gcd over the array: O(N log M) time, O(1) space.
public class Pubg {

    public int solve(int[] A) {
        int g = 0;
        for (int x : A) g = gcd(g, x);      // gcd(0, x) = x
        return g;
    }

    private int gcd(int a, int b) {
        while (b != 0) {
            int t = a % b;
            a = b;
            b = t;
        }
        return a;
    }

    // Actually play the game: the weakest alive player attacks every other alive
    // player until each is weaker than it (or knocked out). Returns the survivor's health.
    static int play(int[] A) {
        int[] s = A.clone();
        while (true) {
            int w = -1, alive = 0;
            for (int i = 0; i < s.length; i++) if (s[i] > 0) { alive++; if (w == -1 || s[i] < s[w]) w = i; }
            if (alive == 1) return s[w];
            for (int j = 0; j < s.length; j++) if (j != w && s[j] > 0) s[j] %= s[w];   // repeated attacks = subtracting until < s[w]
        }
    }

    public static void main(String[] args) {
        Pubg sol = new Pubg();
        System.out.println(sol.solve(new int[]{6, 4}));       // 2
        System.out.println(sol.solve(new int[]{2, 3, 4}));    // 1
        System.out.println(sol.solve(new int[]{1_000_000}));  // one player: survives with full health

        java.util.Random rnd = new java.util.Random(8);
        for (int t = 0; t < 20_000; t++) {
            int n = 1 + rnd.nextInt(30), k = 1 + rnd.nextInt(100);
            int[] A = new int[n];
            for (int i = 0; i < n; i++) A[i] = k * (1 + rnd.nextInt(1_000_000 / k));
            if (sol.solve(A) != play(A)) { System.out.println("MISMATCH " + Arrays.toString(A)); return; }
        }
        System.out.println("20000 random games: playing it out reaches exactly the gcd");
    }
}
