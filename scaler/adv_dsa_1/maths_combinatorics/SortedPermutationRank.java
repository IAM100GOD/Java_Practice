import java.math.BigInteger;
import java.util.*;

// Sorted Permutation Rank (Scaler - Adv DSA 1 - Maths: Combinatorics)
// Rank (1-based) of A among all permutations of its (distinct) characters,
// sorted lexicographically, modulo 1000003.
//   "acb" -> 2   (abc, acb, ...),   "a" -> 1
//
// Count the permutations that come BEFORE A, then add 1.
// At position i, any permutation that matches A[0..i-1] but puts a SMALLER
// unused character at position i comes first, whatever follows.
// Each such choice leaves (n-1-i) characters to arrange freely: (n-1-i)! ways.
//   rank = 1 + sum over i of  (unused characters smaller than A[i]) * (n-1-i)!
// Precompute factorials mod p. n <= 1000 characters, alphabet of 256:
// O(n * 256) time, O(n) space.
public class SortedPermutationRank {

    public int findRank(String A) {
        final int MOD = 1_000_003;
        int n = A.length();
        long[] fact = new long[n + 1];
        fact[0] = 1;
        for (int i = 1; i <= n; i++) fact[i] = fact[i - 1] * i % MOD;

        boolean[] unused = new boolean[256];
        for (int i = 0; i < n; i++) unused[A.charAt(i)] = true;

        long rank = 1;
        for (int i = 0; i < n; i++) {
            char c = A.charAt(i);
            int smaller = 0;
            for (int ch = 0; ch < c; ch++) if (unused[ch]) smaller++;
            rank = (rank + smaller * fact[n - 1 - i]) % MOD;
            unused[c] = false;
        }
        return (int) rank;
    }

    // list every permutation in sorted order, only used to test short strings
    static int brute(String A) {
        char[] s = A.toCharArray();
        Arrays.sort(s);
        int rank = 1;
        while (!new String(s).equals(A)) { nextPermutation(s); rank++; }
        return rank;
    }

    static void nextPermutation(char[] s) {
        int i = s.length - 2;
        while (s[i] >= s[i + 1]) i--;
        int j = s.length - 1;
        while (s[j] <= s[i]) j--;
        char t = s[i]; s[i] = s[j]; s[j] = t;
        for (int l = i + 1, r = s.length - 1; l < r; l++, r--) { t = s[l]; s[l] = s[r]; s[r] = t; }
    }

    // exact rank with BigInteger factorials, only used to test long strings
    static BigInteger exact(String A) {
        int n = A.length();
        BigInteger rank = BigInteger.ONE, f = BigInteger.ONE;
        BigInteger[] fact = new BigInteger[n + 1];
        fact[0] = BigInteger.ONE;
        for (int i = 1; i <= n; i++) fact[i] = fact[i - 1].multiply(BigInteger.valueOf(i));
        for (int i = 0; i < n; i++) {
            int smaller = 0;
            for (int j = i + 1; j < n; j++) if (A.charAt(j) < A.charAt(i)) smaller++;   // different method: count to the right
            rank = rank.add(fact[n - 1 - i].multiply(BigInteger.valueOf(smaller)));
        }
        return rank;
    }

    public static void main(String[] args) {
        SortedPermutationRank sol = new SortedPermutationRank();
        System.out.println(sol.findRank("acb"));    // 2
        System.out.println(sol.findRank("a"));      // 1
        System.out.println(sol.findRank("cba"));    // 6

        Random rnd = new Random(41);
        String pool = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
        for (int t = 0; t < 2000; t++) {
            List<Character> cs = new ArrayList<>();
            for (char ch : pool.toCharArray()) cs.add(ch);
            Collections.shuffle(cs, rnd);
            int n = 1 + rnd.nextInt(t < 1500 ? 7 : pool.length());
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < n; i++) sb.append(cs.get(i));
            String s = sb.toString();
            long want = n <= 7 ? brute(s) : exact(s).mod(BigInteger.valueOf(1_000_003)).longValue();
            if (sol.findRank(s) != want) { System.out.println("MISMATCH " + s); return; }
        }
        System.out.println("2000 random strings match (full listing for n <= 7, BigInteger for longer)");
    }
}
