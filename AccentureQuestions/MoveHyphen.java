// Move All Hyphens to the Front (Accenture)
// ★ Repeated | Easy | Strings
// Write a method moveHyphen(String str, int n) that moves all hyphen ('-') characters to the
// beginning of the string while preserving the relative ordering of all remaining characters.
//
// Sample Test Case
// Input: "Move-Hyphens-To-Front"
// Output: "---MoveHyphensToFront"

import java.util.Scanner;

public class MoveHyphen {
    // In place, scanning right to left: O(n) time, O(n) for the char array (Strings are immutable)
    public static String moveHyphen(String str, int n) {
        if (str == null || n == 0) return str;

        char[] ch = str.toCharArray();
        int write = n - 1;                 // next slot (from the right) for a non-hyphen

        for (int read = n - 1; read >= 0; read--) {
            if (ch[read] != '-') {
                ch[write] = ch[read];      // shift non-hyphen to the right end, keeping order
                write--;
            }
        }
        while (write >= 0) {               // everything left over at the front becomes '-'
            ch[write] = '-';
            write--;
        }
        return new String(ch);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        System.out.println(moveHyphen(s, s.length()));
        sc.close();
    }
}
