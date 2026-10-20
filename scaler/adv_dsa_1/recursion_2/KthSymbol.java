import java.util.Random;

// Kth Symbol (Scaler - Recursion 2)
// Row 1 is "0"; each next row replaces 0 -> 01 and 1 -> 10.
// Return the B-th symbol (1-indexed) of row A.
//   Row 1: 0
//   Row 2: 01
//   Row 3: 0110
//   Row 4: 01101001
//
// Each symbol in row A comes from ONE parent in row A-1: positions 2k-1 and 2k
// (1-indexed) both come from position k = (B+1)/2.
//   0 -> 01: left child = parent, right child = flipped parent
//   1 -> 10: left child = parent, right child = flipped parent
// So: odd B (left child) -> same as parent; even B (right child) -> 1 - parent.
//   base case: row 1 has only "0".
// One call per row: O(A) time and stack, instead of building a row of
// 2^(A-1) symbols (over 500,000 for A = 20).
public class KthSymbol {

    public int solve(int A, int B) {
        if (A == 1) return 0;                          // row 1 is just "0"
        int parent = solve(A - 1, (B + 1) / 2);        // the symbol B came from
        return (B % 2 == 1) ? parent : 1 - parent;     // left child copies, right child flips
    }

    public static void main(String[] args) {
        KthSymbol sol = new KthSymbol();
        System.out.println(sol.solve(2, 1));   // 0
        System.out.println(sol.solve(2, 2));   // 1

        // build rows 1..20 explicitly and compare every position
        String row = "0";
        for (int A = 1; A <= 20; A++) {
            for (int B = 1; B <= row.length(); B++) {
                if (sol.solve(A, B) != row.charAt(B - 1) - '0') { System.out.println("MISMATCH " + A + " " + B); return; }
            }
            StringBuilder next = new StringBuilder();
            for (char ch : row.toCharArray()) next.append(ch == '0' ? "01" : "10");
            row = next.toString();
        }
        System.out.println("every position of rows 1..20 matches the explicitly built rows");
    }
}
