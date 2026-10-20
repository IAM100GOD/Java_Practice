import java.util.Random;

// Delete one (Scaler - Adv DSA 1 - Maths: GCD)
// Remove exactly one element; return the largest possible gcd of the rest.
//   [12, 15, 18] -> 6   (remove 15: gcd(12, 18) = 6)
//   [5, 15, 30]  -> 15  (remove 5:  gcd(15, 30) = 15)
//
// Technique: prefix gcd + suffix gcd.
//   prefix[i] = gcd(A[0..i]),   suffix[i] = gcd(A[i..n-1])
// Removing A[i] leaves A[0..i-1] and A[i+1..n-1], whose gcd is
//   gcd(prefix[i-1], suffix[i+1])
// gcd(0, x) = x, so a missing side (i = 0 or i = n-1) is just 0.
// Three linear passes, each gcd is O(log 1e9): O(N log M) time, O(N) space,
// instead of recomputing the gcd of N-1 elements N times (O(N^2 log M)).
public class DeleteOne {

    public int solve(int[] A) {
        int n = A.length;
        int[] prefix = new int[n], suffix = new int[n];

        prefix[0] = A[0];
        for (int i = 1; i < n; i++) prefix[i] = gcd(prefix[i - 1], A[i]);
        suffix[n - 1] = A[n - 1];
        for (int i = n - 2; i >= 0; i--) suffix[i] = gcd(suffix[i + 1], A[i]);

        int best = 0;
        for (int i = 0; i < n; i++) {
            int left = (i == 0) ? 0 : prefix[i - 1];
            int right = (i == n - 1) ? 0 : suffix[i + 1];
            best = Math.max(best, gcd(left, right));    // gcd(0, x) = x
        }
        return best;
    }

    // Euclid: gcd(a, b) = gcd(b, a % b), and gcd(a, 0) = a
    private int gcd(int a, int b) {
        while (b != 0) {
            int t = a % b;
            a = b;
            b = t;
        }
        return a;
    }

    // O(N^2 log M) brute force, only used to check the fast version
    int brute(int[] A) {
        int best = 0;
        for (int skip = 0; skip < A.length; skip++) {
            int g = 0;
            for (int i = 0; i < A.length; i++) if (i != skip) g = gcd(g, A[i]);
            best = Math.max(best, g);
        }
        return best;
    }

    public static void main(String[] args) {
        DeleteOne sol = new DeleteOne();
        System.out.println(sol.solve(new int[]{12, 15, 18}));   // 6
        System.out.println(sol.solve(new int[]{5, 15, 30}));    // 15
        System.out.println(sol.solve(new int[]{7, 1_000_000_000}));   // remove 7 -> 1000000000

        Random rnd = new Random(11);
        for (int t = 0; t < 3000; t++) {
            int n = 2 + rnd.nextInt(40), k = 1 + rnd.nextInt(50);
            int[] A = new int[n];
            for (int i = 0; i < n; i++) A[i] = t % 2 == 0 ? k * (1 + rnd.nextInt(20)) : 1 + rnd.nextInt(1_000_000_000);
            if (rnd.nextInt(3) == 0) A[rnd.nextInt(n)] = 1 + rnd.nextInt(1_000_000_000);   // one odd element out
            if (sol.solve(A) != sol.brute(A)) { System.out.println("MISMATCH " + java.util.Arrays.toString(A)); return; }
        }
        System.out.println("3000 random tests match brute force");
    }
}
