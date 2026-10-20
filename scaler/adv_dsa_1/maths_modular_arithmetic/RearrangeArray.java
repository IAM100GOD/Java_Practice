import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

// Rearrange Array (Scaler - Adv DSA 1 - Maths: Modular Arithmetic)
// Make A[i] = A[A[i]] for every i, using O(1) extra space. Modify A in place.
//   [1, 0] -> [0, 1],   [0, 2, 1, 3] -> [0, 1, 2, 3]
//
// The problem: overwriting A[i] destroys a value that a later index may still
// need to read. We need each cell to hold BOTH its old and new value for a while.
//
// Technique: store two numbers in one using modular arithmetic.
// Every value is < N, so put  A[i] = old + new * N :
//     old = A[i] % N      new = A[i] / N
// Pass 1: for each i, A[i] += (A[A[i]] % N) * N
//         (A[A[i]] may already be encoded; % N still gives its OLD value)
// Pass 2: A[i] /= N keeps only the new value.
// O(N) time, O(1) extra space.
public class RearrangeArray {

    public void arrange(ArrayList<Integer> A) {
        int n = A.size();
        for (int i = 0; i < n; i++) {
            int old = A.get(i);                          // still un-encoded at this point
            A.set(i, old + (A.get(old) % n) * n);
        }
        for (int i = 0; i < n; i++) {
            A.set(i, A.get(i) / n);
        }
    }

    // Same idea, overflow-proof. old + new*N can reach N^2 - 1, which overflows
    // int once N > 46340 (Scaler allows N up to 5*10^4). Values are < 2^16,
    // so keep old in the low 16 bits and new in the high 16 bits instead.
    public void arrangeSafe(ArrayList<Integer> A) {
        int n = A.size();
        for (int i = 0; i < n; i++) {
            int old = A.get(i);
            A.set(i, old | ((A.get(old) & 0xFFFF) << 16)); // low 16 bits = old value
        }
        for (int i = 0; i < n; i++) {
            A.set(i, A.get(i) >>> 16);                   // unsigned shift, the top bit may be set
        }
    }

    static ArrayList<Integer> expected(List<Integer> A) {
        ArrayList<Integer> B = new ArrayList<>();
        for (int i = 0; i < A.size(); i++) B.add(A.get(A.get(i)));
        return B;
    }

    public static void main(String[] args) {
        RearrangeArray sol = new RearrangeArray();
        int[][] tests = {{1, 0}, {0, 2, 1, 3}, {3, 2, 0, 1}, {4, 0, 2, 1, 3}};
        for (int[] t : tests) {
            ArrayList<Integer> a = new ArrayList<>();
            for (int x : t) a.add(x);
            sol.arrange(a);
            System.out.println(Arrays.toString(t) + " -> " + a);
        }

        // Largest allowed N: a reversed permutation of 0..49999
        int n = 50_000;
        ArrayList<Integer> big = new ArrayList<>();
        for (int i = 0; i < n; i++) big.add(n - 1 - i);
        ArrayList<Integer> want = expected(big);
        ArrayList<Integer> a = new ArrayList<>(big), b = new ArrayList<>(big);
        sol.arrange(a);
        sol.arrangeSafe(b);
        System.out.println("N = 50000  modular version correct: " + a.equals(want)
                + ",  bit-packed version correct: " + b.equals(want));
    }
}
