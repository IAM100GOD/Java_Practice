// Run-Length String Encoding / Compression
// ★ Repeated (Lateral)
// Easy
// String Compression
//
// Given an input string str, write a function that returns the Run-Length Encoded string for the input string.
// (e.g., if the input string is "wwwwaaadexxxxxx", then the function should return "w4a3d1e1x6").
//
// Sample Test Case
// Input: "aaaabbbccc"
// Output: "a4b3c3"
//
// Pattern:
// Iterate through the string, counting contiguous identical characters.
// When the next character differs (or at the string end), append char + count to StringBuilder.
// Time: O(n), Space: O(n) for output

import java.util.Scanner;

public class RunLengthEncoding {
    public static String encode(String str) {
        if (str == null || str.isEmpty()) return "";

        StringBuilder sb = new StringBuilder();
        int count = 1;

        for (int i = 0; i < str.length(); i++) {
            // If the next character is the same, increment run count
            if (i + 1 < str.length() && str.charAt(i) == str.charAt(i + 1)) {
                count++;
            } else {
                // Run ended: append character followed by run length
                sb.append(str.charAt(i)).append(count);
                count = 1;
            }
        }

        return sb.toString();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) {
            // Default demo execution
            System.out.println("Demo 1 (\"aaaabbbccc\"): " + encode("aaaabbbccc"));       // a4b3c3
            System.out.println("Demo 2 (\"wwwwaaadexxxxxx\"): " + encode("wwwwaaadexxxxxx")); // w4a3d1e1x6
            sc.close();
            return;
        }

        String input = sc.next();
        System.out.println(encode(input));
        sc.close();
    }
}
