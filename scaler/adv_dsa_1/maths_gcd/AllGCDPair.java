import java.util.*;

// All GCD Pair (Scaler - Adv DSA 1 - Maths: GCD)
// A holds gcd(B[i], B[j]) for EVERY ordered pair (i, j) of some unknown array B
// (so N = m*m, including i == j where gcd(x, x) = x). Recover B.
//   [2, 2, 2, 2, 8, 2, 2, 2, 10] -> [2, 8, 10]
//   [5, 5, 5, 15]                -> [5, 15]
//
// Key fact: gcd(x, y) <= min(x, y). So the LARGEST value still unexplained
// can't be the gcd of two different elements bigger than it; it must be an
// original element itself (its gcd(x, x) = x entry).
// Greedy, largest first, with a count map (multiset):
//   take the largest x with count > 0 -> x is in B, remove one x (the (x, x) entry)
//   for every element r already found: remove gcd(x, r) TWICE ((x, r) and (r, x))
// Sorting O(N log N) + m^2 gcd removals (m = sqrt(N)) -> O(N log N) overall.
public class AllGCDPair {

    public int[] solve(int[] A) {
        Arrays.sort(A);
        Map<Integer, Integer> count = new HashMap<>();
        for (int x : A) count.merge(x, 1, Integer::sum);

        List<Integer> res = new ArrayList<>();
        for (int i = A.length - 1; i >= 0; i--) {
            int x = A[i];
            if (count.get(x) == 0) continue;           // already explained as some pair's gcd
            count.merge(x, -1, Integer::sum);          // the (x, x) entry
            for (int r : res) {
                count.merge(gcd(x, r), -2, Integer::sum);   // the (x, r) and (r, x) entries
            }
            res.add(x);
        }

        int[] out = new int[res.size()];
        for (int k = 0; k < out.length; k++) out[k] = res.get(out.length - 1 - k);   // ascending
        return out;
    }

    private int gcd(int a, int b) {
        while (b != 0) {
            int t = a % b;
            a = b;
            b = t;
        }
        return a;
    }

    public static void main(String[] args) {
        AllGCDPair sol = new AllGCDPair();
        System.out.println(Arrays.toString(sol.solve(new int[]{2, 2, 2, 2, 8, 2, 2, 2, 10})));   // [2, 8, 10]
        System.out.println(Arrays.toString(sol.solve(new int[]{5, 5, 5, 15})));                  // [5, 15]

        // build the gcd table of a random B, shuffle it, recover B
        Random rnd = new Random(17);
        for (int t = 0; t < 3000; t++) {
            int m = 1 + rnd.nextInt(t < 2990 ? 12 : 100), k = 1 + rnd.nextInt(30);
            int[] B = new int[m];
            for (int i = 0; i < m; i++) B[i] = t % 2 == 0 ? k * (1 + rnd.nextInt(40)) : 1 + rnd.nextInt(1_000_000_000);
            int[] A = new int[m * m];
            for (int i = 0; i < m; i++) for (int j = 0; j < m; j++) A[i * m + j] = sol.gcd(B[i], B[j]);
            for (int i = A.length - 1; i > 0; i--) { int j = rnd.nextInt(i + 1); int x = A[i]; A[i] = A[j]; A[j] = x; }
            Arrays.sort(B);
            if (!Arrays.equals(sol.solve(A), B)) { System.out.println("MISMATCH " + Arrays.toString(B)); return; }
        }
        System.out.println("3000 random arrays (up to 100 numbers, N = 10000) recovered exactly");
    }
}
