import java.util.Random;

// Is magic? (Scaler - Recursion 1)
// Keep replacing A by the sum of its digits until one digit is left.
// Return 1 if that digit is 1, else 0.
//   83557 -> 28 -> 10 -> 1  => 1
//   1291  -> 13 -> 4        => 0
//
// Two recursions:
//   solve(A): if A is a single digit, answer directly (base case);
//             otherwise solve(sumOfDigits(A)), a smaller number.
//   sumOfDigits(A) = A % 10 + sumOfDigits(A / 10), sumOfDigits(0) = 0 (Q1).
// A <= 1e9 has digit sum <= 81, then <= 16, then a single digit:
// at most ~4 levels of solve, each O(digits). Effectively O(log A).
//
// Shortcut (digital root): the final digit is 1 + (A - 1) % 9,
// so A is magic iff A % 9 == 1. Used below only as a check.
public class IsMagic {

    public int solve(int A) {
        if (A < 10) return A == 1 ? 1 : 0;       // single digit: magic only if it's 1
        return solve(sumOfDigits(A));            // shrink to the digit sum and repeat
    }

    private int sumOfDigits(int A) {
        if (A == 0) return 0;
        return A % 10 + sumOfDigits(A / 10);
    }

    public static void main(String[] args) {
        IsMagic sol = new IsMagic();
        System.out.println(sol.solve(83557));   // 1
        System.out.println(sol.solve(1291));    // 0
        System.out.println(sol.solve(1) + " " + sol.solve(10) + " " + sol.solve(9));   // 1 1 0

        Random rnd = new Random(53);
        for (int t = 0; t < 200_000; t++) {
            int A = 1 + rnd.nextInt(1_000_000_000);
            if (sol.solve(A) != (A % 9 == 1 ? 1 : 0)) { System.out.println("MISMATCH " + A); return; }
        }
        System.out.println("200000 random numbers agree with the digital-root rule A % 9 == 1");
    }
}
