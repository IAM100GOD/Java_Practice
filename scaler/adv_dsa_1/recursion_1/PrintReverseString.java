import java.util.Scanner;

// Print reverse string (Scaler - Recursion 1)
// Read S from stdin and print it reversed, using recursion.
//   scaleracademy -> ymedacarelacs,   cool -> looc
//
// Recursion that prints AFTER the recursive call:
//   printReverse(s, i): print the characters i..end in reverse
//     base case: i == length -> nothing left, return
//     otherwise: first printReverse(s, i + 1)  (everything after i, reversed)
//                then print s[i]               (s[i] belongs after all of them)
// The calls go in left to right; the prints happen on the way back out,
// right to left. An index avoids building substrings (no copying).
// O(n) time, O(n) stack (n <= 1000 is well within Java's stack).
// On Scaler, keep `public static void main` and the helper in their Main class.
public class PrintReverseString {

    static void printReverse(String s, int i) {
        if (i == s.length()) return;          // base case: nothing left to print
        printReverse(s, i + 1);               // first print everything after i, reversed
        System.out.print(s.charAt(i));        // then s[i], which comes after all of them
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().trim();
        printReverse(s, 0);
        System.out.println();
    }
}
