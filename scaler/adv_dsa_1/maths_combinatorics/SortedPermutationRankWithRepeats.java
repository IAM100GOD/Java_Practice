import java.math.BigInteger;
import java.util.*;

// Sorted Permutation Rank with Repeats (Scaler - Adv DSA 1 - Maths: Combinatorics)
// Rank of A among its UNIQUE permutations, sorted by ASCII ('Z' < 'a'), mod 1000003.
//   "aba" -> 2 (aab, aba, baa),   "bca" -> 4
//
// Same idea as without repeats: rank = 1 + (unique permutations before A).
// At position i, with `rem` characters left and counts cnt[]:
//   putting a smaller character x here leaves  (rem-1)! / (prod cnt'!)  unique
//   arrangements, where cnt' is cnt with one x removed. That equals
//   (rem-1)! * cnt[x] / prod cnt!.  Summing over all x < A[i]:
//   before += (rem-1)! * (sum of cnt[x] for x < A[i]) / prod cnt!
// Division mod p: 1000003 is prime and every factorial here is of a number
// <= 10^6 < p, so prod cnt! is never 0 mod p and has an inverse (Fermat).
// Keep invDenom = inverse(prod cnt!) up to date: when one A[i] is used,
// cnt[A[i]]! becomes (cnt[A[i]]-1)!, i.e. the product loses a factor
// cnt[A[i]], so invDenom gains that factor. Only ONE modular inverse needed.
// O(n * 128) time (letters only), O(n) space for factorials.
public class SortedPermutationRankWithRepeats {

    public int findRank(String A) {
        final long MOD = 1_000_003L;
        int n = A.length();
        long[] fact = new long[n + 1];
        fact[0] = 1;
        for (int i = 1; i <= n; i++) fact[i] = fact[i - 1] * i % MOD;

        int[] cnt = new int[128];                         // A has only letters (ASCII < 128)
        for (int i = 0; i < n; i++) cnt[A.charAt(i)]++;

        long denom = 1;                                   // product of cnt[ch]! over all characters
        for (int ch = 0; ch < 128; ch++) denom = denom * fact[cnt[ch]] % MOD;
        long invDenom = power(denom, MOD - 2, MOD);

        long rank = 1;
        for (int i = 0; i < n; i++) {
            char c = A.charAt(i);
            long smaller = 0;
            for (int ch = 0; ch < c; ch++) smaller += cnt[ch];
            rank = (rank + fact[n - 1 - i] * smaller % MOD * invDenom) % MOD;
            invDenom = invDenom * cnt[c] % MOD;           // cnt[c]! -> (cnt[c]-1)!: product loses a factor cnt[c]
            cnt[c]--;
        }
        return (int) rank;
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

    // list unique permutations in order, only used to test short strings
    static int brute(String A) {
        char[] s = A.toCharArray();
        Arrays.sort(s);
        int rank = 1;
        while (!new String(s).equals(A)) { next(s); rank++; }
        return rank;
    }

    static void next(char[] s) {                          // next unique permutation (handles repeats)
        int i = s.length - 2;
        while (s[i] >= s[i + 1]) i--;
        int j = s.length - 1;
        while (s[j] <= s[i]) j--;
        char t = s[i]; s[i] = s[j]; s[j] = t;
        for (int l = i + 1, r = s.length - 1; l < r; l++, r--) { t = s[l]; s[l] = s[r]; s[r] = t; }
    }

    // exact rank with BigInteger multinomials, only used to test longer strings
    static BigInteger exact(String A) {
        int n = A.length();
        BigInteger[] f = new BigInteger[n + 1];
        f[0] = BigInteger.ONE;
        for (int i = 1; i <= n; i++) f[i] = f[i - 1].multiply(BigInteger.valueOf(i));
        int[] cnt = new int[128];
        for (char ch : A.toCharArray()) cnt[ch]++;
        BigInteger rank = BigInteger.ONE;
        for (int i = 0; i < n; i++) {
            for (int x = 0; x < A.charAt(i); x++) {
                if (cnt[x] == 0) continue;
                cnt[x]--;                                  // put x here, count arrangements of the rest
                BigInteger ways = f[n - 1 - i];
                for (int ch = 0; ch < 128; ch++) ways = ways.divide(f[cnt[ch]]);
                rank = rank.add(ways);
                cnt[x]++;
            }
            cnt[A.charAt(i)]--;
        }
        return rank;
    }

    public static void main(String[] args) {
        SortedPermutationRankWithRepeats sol = new SortedPermutationRankWithRepeats();
        System.out.println(sol.findRank("aba"));   // 2
        System.out.println(sol.findRank("bca"));   // 4
        System.out.println(sol.findRank("aZ"));    // 2 ('Z' < 'a')

        Random rnd = new Random(43);
        String letters = "aAbBcZz";
        for (int t = 0; t < 3000; t++) {
            int n = 1 + rnd.nextInt(t < 2500 ? 8 : 40);
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < n; i++) sb.append(letters.charAt(rnd.nextInt(t % 2 == 0 ? 3 : letters.length())));
            String s = sb.toString();
            long want = n <= 8 ? brute(s) : exact(s).mod(BigInteger.valueOf(1_000_003)).longValue();
            if (sol.findRank(s) != want) { System.out.println("MISMATCH " + s); return; }
        }
        System.out.println("3000 random strings with repeats match (listing for n <= 8, BigInteger for longer)");

        StringBuilder big = new StringBuilder();
        for (int i = 0; i < 1_000_000; i++) big.append((char) ('A' + rnd.nextInt(26) + (rnd.nextBoolean() ? 32 : 0)));
        long t0 = System.nanoTime();
        int r = sol.findRank(big.toString());
        System.out.println("n = 1000000 -> " + r + " in " + (System.nanoTime() - t0) / 1_000_000 + " ms");
    }
}
