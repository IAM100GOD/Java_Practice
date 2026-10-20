import java.math.BigInteger;

// Enumerating GCD (Scaler - Adv DSA 1 - Maths: GCD)
// Return gcd(A, A+1, ..., B) where A, B are up to 10^100 (given as strings).
//   A = "1", B = "3" -> "1"
//
// Key fact: two consecutive numbers are always coprime.
// If d divides n and n+1, it divides their difference (n+1) - n = 1, so d = 1.
// (Euclid shows the same thing: gcd(n+1, n) = gcd(n, 1) = gcd(1, 0) = 1.)
// - If A < B, the range contains the pair A, A+1, so the gcd of the whole range is 1.
// - If A == B, the range is just {A}, and gcd of one number is the number itself.
// No big-number arithmetic needed: O(length of the strings) to compare them.
public class EnumeratingGCD {

    public String solve(String A, String B) {
        A = stripZeros(A);
        B = stripZeros(B);
        if (A.equals(B)) return A;     // a single number: its gcd is itself
        return "1";                    // A and A+1 are both in the range
    }

    // "007" -> "7", so equal values compare equal and the output has no leading zeros
    private String stripZeros(String s) {
        int i = 0;
        while (i < s.length() - 1 && s.charAt(i) == '0') i++;
        return s.substring(i);
    }

    // gcd of every number in [A, B] with BigInteger, only used to check (small ranges)
    static String brute(String A, String B) {
        BigInteger a = new BigInteger(A), b = new BigInteger(B), g = BigInteger.ZERO;
        for (BigInteger x = a; x.compareTo(b) <= 0; x = x.add(BigInteger.ONE)) g = g.gcd(x);
        return g.toString();
    }

    public static void main(String[] args) {
        EnumeratingGCD sol = new EnumeratingGCD();
        System.out.println(sol.solve("1", "3"));                       // 1
        String big = "9".repeat(100);
        System.out.println(sol.solve(big, big).length() + "-digit A == B -> returns A itself");
        System.out.println(sol.solve("1" + "0".repeat(99), big));     // 1

        java.util.Random rnd = new java.util.Random(2);
        for (int t = 0; t < 5000; t++) {
            BigInteger a = new BigInteger(1 + rnd.nextInt(330), rnd).add(BigInteger.ONE);
            BigInteger b = a.add(BigInteger.valueOf(rnd.nextInt(4)));        // ranges of 1 to 4 numbers
            if (!sol.solve(a.toString(), b.toString()).equals(brute(a.toString(), b.toString()))) {
                System.out.println("MISMATCH " + a + " " + b); return;
            }
        }
        System.out.println("5000 random tests (numbers up to ~100 digits) match BigInteger gcd");
    }
}
