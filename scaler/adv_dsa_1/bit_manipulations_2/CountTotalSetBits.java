// Count Total Set Bits (Scaler - Adv DSA 1 - Bit Manipulations 2)
// Total number of 1 bits in the binary forms of 1, 2, ..., A, modulo 1e9+7.
//   A = 3 -> 1 (01) + 1 (10) + 2 (11) = 4
//
// Technique: count per bit position using its repeating pattern.
// Write 0, 1, 2, ..., A in binary and look down one column (bit i):
//   bit 0: 0 1 0 1 0 1 ...          (0 x1, 1 x1, repeat every 2)
//   bit 1: 0 0 1 1 0 0 1 1 ...      (0 x2, 1 x2, repeat every 4)
//   bit i: 2^i zeros then 2^i ones,  repeating every 2^(i+1)
// For n = A + 1 numbers (0..A; 0 adds no bits):
//   full cycles  = n / 2^(i+1)  -> each gives 2^i ones
//   leftover     = n % 2^(i+1)  -> its first 2^i are zeros, the rest are ones
//   ones at bit i = full * 2^i + max(0, leftover - 2^i)
// Only ~30 bit positions: O(log A) time, O(1) space,
// instead of O(A log A) for counting every number (A can be 1e9).
public class CountTotalSetBits {

    public static int solve(int A) {
        final long MOD = 1_000_000_007L;
        long n = (long) A + 1;                        // numbers 0..A
        long ans = 0;

        for (long half = 1; half <= A; half <<= 1) {  // half = 2^i, stop once bit i is above A
            long cycle = half << 1;                   // pattern length 2^(i+1)
            long full = n / cycle;
            long rem = n % cycle;
            ans += full * half + Math.max(0, rem - half);
        }
        return (int) (ans % MOD);                     // ans <= ~1.6e10, fits in long
    }

    // O(A log A) brute force, only used to check the fast version
    static long brute(int A) {
        long sum = 0;
        for (int x = 1; x <= A; x++) sum += Integer.bitCount(x);
        return sum % 1_000_000_007L;
    }

    public static void main(String[] args) {
        for (int A : new int[]{3, 1, 7, 10, 17, 1_000_000}) {
            System.out.println("A = " + A + " -> " + solve(A) + "  (brute: " + brute(A) + ")");
        }
        System.out.println("A = 1000000000 -> " + solve(1_000_000_000));
    }
}
