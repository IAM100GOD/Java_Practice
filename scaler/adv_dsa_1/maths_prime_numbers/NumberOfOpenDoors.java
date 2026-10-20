// Number Of Open Doors (Scaler - Maths: Prime Numbers)
// A closed doors. On go i, toggle every door whose number is a multiple of i.
// After A goes, how many doors are open?
//   A = 5 -> 2 (doors 1, 4),   A = 6 -> 2 (doors 1, 4)
//
// Door d is toggled on go i exactly when i divides d, so it is toggled
// (number of divisors of d) times. It ends open iff that count is odd.
// Divisors come in pairs (i, d/i); a pair only collapses into one divisor
// when i = d/i, i.e. d = i*i. So d has an odd number of divisors
// iff d is a perfect square.
// Answer = number of perfect squares <= A = floor(sqrt(A)).
// O(1) time, O(1) space (A up to 1e9, so simulating is far too slow).
public class NumberOfOpenDoors {

    public int solve(int A) {
        long r = (long) Math.sqrt(A);
        while (r * r > A) r--;                 // guard against floating-point rounding
        while ((r + 1) * (r + 1) <= A) r++;
        return (int) r;
    }

    // simulate the doors, only used to test small A
    static int simulate(int A) {
        boolean[] open = new boolean[A + 1];
        for (int go = 1; go <= A; go++) for (int d = go; d <= A; d += go) open[d] = !open[d];
        int c = 0;
        for (int d = 1; d <= A; d++) if (open[d]) c++;
        return c;
    }

    public static void main(String[] args) {
        NumberOfOpenDoors sol = new NumberOfOpenDoors();
        System.out.println(sol.solve(5));    // 2
        System.out.println(sol.solve(6));    // 2
        for (int A = 1; A <= 5000; A++) {
            if (sol.solve(A) != simulate(A)) { System.out.println("MISMATCH " + A); return; }
        }
        System.out.println("A = 1..5000 match the door simulation");
        // perfect squares and their neighbours near the limit
        for (long k : new long[]{31622, 31623}) {
            int sq = (int) (k * k);
            System.out.println("A = " + (sq - 1) + " -> " + sol.solve(sq - 1) + ",  A = " + sq + " -> " + sol.solve(sq));
        }
        System.out.println("A = 1000000000 -> " + sol.solve(1_000_000_000));
    }
}
