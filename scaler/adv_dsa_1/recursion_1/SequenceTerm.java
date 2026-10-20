// f(A) = f(A-1) + f(A-2) + f(A-3) + A   (Scaler - Recursion 1)
// with f(0) = 1, f(1) = 1, f(2) = 2. Return f(A) for 0 <= A <= 20, using recursion.
//   f(3) = f(2) + f(1) + f(0) + 3 = 2 + 1 + 1 + 3 = 7
//
// Three base cases (A = 0, 1, 2), because the recursion reaches back 3 steps:
// a single base case would let f(1) call f(-1) and f(-2).
// Each call makes 3 more: the call tree grows like ~1.84^A
// (f(20) takes 128,287 calls), fine for A <= 20. Memoization or a loop is O(A).
public class SequenceTerm {

    public int solve(int A) {
        if (A == 0 || A == 1) return 1;                             // f(0) = f(1) = 1
        if (A == 2) return 2;                                       // f(2) = 2
        return solve(A - 1) + solve(A - 2) + solve(A - 3) + A;
    }

    static long calls = 0;
    static long counted(int A) { calls++; if (A <= 1) return 1; if (A == 2) return 2; return counted(A - 1) + counted(A - 2) + counted(A - 3) + A; }

    public static void main(String[] args) {
        SequenceTerm sol = new SequenceTerm();
        System.out.println(sol.solve(3));    // 7
        System.out.println(sol.solve(2));    // 2
        long[] f = new long[21];
        f[0] = 1; f[1] = 1; f[2] = 2;
        for (int i = 3; i <= 20; i++) f[i] = f[i - 1] + f[i - 2] + f[i - 3] + i;
        for (int A = 0; A <= 20; A++) if (sol.solve(A) != f[A]) { System.out.println("MISMATCH " + A); return; }
        System.out.println("f(0)..f(20) match a loop; f(20) = " + sol.solve(20) + " (fits in int)");
        counted(20);
        System.out.println("f(20) took " + calls + " calls");
    }
}
