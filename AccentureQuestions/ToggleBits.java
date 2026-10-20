// Toggle Bits from MSB to LSB (Accenture)
// Given an integer N, find its binary representation, toggle (invert) every bit from the
// Most Significant Bit down to the LSB, and return the resulting decimal number.
//
// Sample Test Case
// Input: 10 (Binary: 1010)
// Invert bits: 0101 (Binary)
// Output: 5

import java.util.Scanner;

public class ToggleBits {
    // Build a mask of 1s as long as N's binary form, then XOR: O(log N)
    public static int toggleBits(int n) {
        if (n == 0) return 1;              // binary "0" -> "1"

        int mask = 0;
        int temp = n;
        while (temp > 0) {
            mask = (mask << 1) | 1;        // add one more 1-bit to the mask
            temp >>= 1;
        }
        return n ^ mask;                   // XOR with 1 flips each bit
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(toggleBits(n));
        sc.close();
    }
}
