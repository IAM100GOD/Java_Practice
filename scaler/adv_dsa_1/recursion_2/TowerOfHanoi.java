import java.util.*;

// Tower of Hanoi (Scaler - Recursion 2)
// Move A disks from tower 1 to tower 3 (tower 2 as helper) in the minimum
// number of moves; return each move as {disk, from, to}.
//   A = 2 -> [1 1 2] [2 1 3] [1 2 3]
//
// To move n disks from `from` to `to`:
//   1. move the top n-1 disks out of the way: from -> via   (recursively)
//   2. move disk n (the biggest) from -> to                 (one move)
//   3. move the n-1 disks back on top of it: via -> to      (recursively)
//   base case: n == 0, nothing to move.
// Disk n can only move when everything above it is gone and the target is
// empty of smaller disks, so this order is forced: it's the minimum.
// moves(n) = 2*moves(n-1) + 1  =>  2^n - 1 moves (A = 18: 262,143 rows).
// O(2^A) time (the output itself is that big), O(A) recursion depth.
public class TowerOfHanoi {

    private int[][] moves;
    private int idx;

    public int[][] towerOfHanoi(int A) {
        moves = new int[(1 << A) - 1][];
        idx = 0;
        hanoi(A, 1, 3, 2);
        return moves;
    }

    private void hanoi(int n, int from, int to, int via) {
        if (n == 0) return;                           // nothing to move
        hanoi(n - 1, from, via, to);                  // clear the n-1 smaller disks onto `via`
        moves[idx++] = new int[]{n, from, to};        // move the biggest disk directly
        hanoi(n - 1, via, to, from);                  // put the n-1 disks back on top of it
    }

    // replay the moves on real towers and check every rule, only used to test
    static boolean valid(int A, int[][] mv) {
        List<Deque<Integer>> t = new ArrayList<>();
        for (int i = 0; i <= 3; i++) t.add(new ArrayDeque<>());
        for (int d = A; d >= 1; d--) t.get(1).push(d);
        for (int[] m : mv) {
            Deque<Integer> src = t.get(m[1]), dst = t.get(m[2]);
            if (src.isEmpty() || src.peek() != m[0]) return false;          // that disk must be on top
            if (!dst.isEmpty() && dst.peek() < m[0]) return false;          // never onto a smaller disk
            dst.push(src.pop());
        }
        return t.get(3).size() == A;
    }

    public static void main(String[] args) {
        TowerOfHanoi sol = new TowerOfHanoi();
        System.out.println(Arrays.deepToString(sol.towerOfHanoi(2)));   // [[1,1,2],[2,1,3],[1,2,3]]
        System.out.println(Arrays.deepToString(sol.towerOfHanoi(3)));   // matches the 7-move example
        for (int A = 1; A <= 18; A++) {
            int[][] mv = sol.towerOfHanoi(A);
            if (mv.length != (1 << A) - 1 || !valid(A, mv)) { System.out.println("INVALID for A = " + A); return; }
        }
        System.out.println("A = 1..18: every move list is legal, ends with all disks on tower 3, and has 2^A - 1 moves");
    }
}
