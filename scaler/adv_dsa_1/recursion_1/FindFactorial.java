// Find Factorial! (Scaler - Recursion 1)
// Return A! using recursion, 0 <= A <= 12.
//   4 -> 24,   1 -> 1,   0 -> 1
//
//   base case: 0! = 1! = 1        (A <= 1 -> 1; 0! = 1 is the empty product)
//   otherwise: A! = A * (A-1)!
// One call per number: O(A) time, O(A) stack.
// Why A <= 12: 12! = 479,001,600 fits in int, but 13! = 6,227,020,800 is
// more than Integer.MAX_VALUE (2,147,483,647) and would overflow.
public class FindFactorial {

    public int solve(int A) {
        if (A <= 1) return 1;            // 0! = 1! = 1
        return A * solve(A - 1);         // A! = A * (A-1)!
    }

    public static void main(String[] args) {
        FindFactorial sol = new FindFactorial();
        System.out.println(sol.solve(4));    // 24
        System.out.println(sol.solve(1));    // 1
        System.out.println(sol.solve(0));    // 1
        long f = 1;
        for (int A = 0; A <= 12; A++) {
            if (A > 0) f *= A;
            if (sol.solve(A) != f) { System.out.println("MISMATCH " + A); return; }
        }
        System.out.println("0! .. 12! match a loop; 12! = " + sol.solve(12));
        System.out.println("13! as int would be " + (13 * sol.solve(12)) + " (overflowed; real value 6227020800)");
    }
}
