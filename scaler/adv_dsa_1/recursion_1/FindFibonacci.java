// Find Fibonacci - II (Scaler - Recursion 1)
// Return F(A) with F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2), using recursion.
//   A = 2 -> 1,   A = 9 -> 34
//
// The definition IS the recursion:
//   base cases: F(0) = 0, F(1) = 1   (A <= 1 -> return A)
//   otherwise:  F(A) = F(A-1) + F(A-2)
// Each call makes two more, so the call tree has ~1.6^A nodes (exponential):
// F(20) makes 21,891 calls. Fine for A <= 20, hopeless for A = 50.
// The tree recomputes the same values over and over (F(18) twice, F(17) three
// times, ...); memoization (cache F(n) once computed) or a loop makes it O(A).
public class FindFibonacci {

    public int findAthFibonacci(int A) {
        if (A <= 1) return A;                                     // F(0) = 0, F(1) = 1
        return findAthFibonacci(A - 1) + findAthFibonacci(A - 2);
    }

    static long calls = 0;
    static int counted(int A) { calls++; return A <= 1 ? A : counted(A - 1) + counted(A - 2); }

    public static void main(String[] args) {
        FindFibonacci sol = new FindFibonacci();
        System.out.println(sol.findAthFibonacci(2));    // 1
        System.out.println(sol.findAthFibonacci(9));    // 34
        int a = 0, b = 1;
        for (int n = 0; n <= 20; n++) {
            if (sol.findAthFibonacci(n) != a) { System.out.println("MISMATCH " + n); return; }
            int c = a + b; a = b; b = c;
        }
        System.out.println("F(0)..F(20) match the loop; F(20) = " + sol.findAthFibonacci(20));
        counted(20);
        System.out.println("F(20) took " + calls + " calls");
    }
}
