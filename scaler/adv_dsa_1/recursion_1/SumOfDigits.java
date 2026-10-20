import java.util.Random;

// Sum of Digits! (Scaler - Recursion 1)
// Return the sum of the digits of A, using recursion.
//   46 -> 4 + 6 = 10,   11 -> 2
//
// Recursion = solve a problem by trusting the same function on a smaller input.
//   sum(A) = (last digit) + sum(A without its last digit)
//          = A % 10 + sum(A / 10)
//   base case: sum(0) = 0  (no digits left)
// Each call removes one digit, so for A <= 10^9 there are at most 10 calls
// on the stack: O(number of digits) time and stack space.
public class SumOfDigits {

    public int solve(int A) {
        if (A == 0) return 0;                 // base case: no digits left
        return A % 10 + solve(A / 10);        // last digit + sum of the rest
    }

    public static void main(String[] args) {
        SumOfDigits sol = new SumOfDigits();
        System.out.println(sol.solve(46));             // 10
        System.out.println(sol.solve(11));             // 2
        System.out.println(sol.solve(1_000_000_000));  // 1
        System.out.println(sol.solve(999_999_999));    // 81

        Random rnd = new Random(47);
        for (int t = 0; t < 100_000; t++) {
            int A = 1 + rnd.nextInt(1_000_000_000);
            int want = 0;
            for (char ch : String.valueOf(A).toCharArray()) want += ch - '0';
            if (sol.solve(A) != want) { System.out.println("MISMATCH " + A); return; }
        }
        System.out.println("100000 random numbers match adding the digits of the string");
    }
}
