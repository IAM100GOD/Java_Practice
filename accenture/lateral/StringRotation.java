// Check if One String is a Rotation of Another
// ★ Repeated (Lateral)
// Easy
// Strings / Pattern Matching
//
// Given two strings s1 and s2, determine if s2 is a valid circular rotation of s1.
// You must accomplish this efficiently in linear time without brute-force substring generating loops.
//
// Pattern:
// Any circular rotation of s1 of length n is a contiguous substring of (s1 + s1).
// Condition: s1.length() == s2.length() && (s1 + s1).contains(s2)
//
// Sample Cases:
// Input: s1 = "ABCD", s2 = "CDAB" -> Output: true
// Input: s1 = "ABCD", s2 = "ACBD" -> Output: false

import java.util.Scanner;

public class StringRotation {
    // Linear time O(n) check using concatenation property:
    // Any rotation of s1 appears as a substring of (s1 + s1).
    public static boolean isRotation(String s1, String s2) {
        if (s1 == null || s2 == null) return false;
        if (s1.length() != s2.length()) return false;

        String doubled = s1 + s1;
        return doubled.contains(s2);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) {
            // Default demo execution
            System.out.println("Demo 1 (\"ABCD\", \"CDAB\"): " + isRotation("ABCD", "CDAB"));
            System.out.println("Demo 2 (\"ABCD\", \"ACBD\"): " + isRotation("ABCD", "ACBD"));
            sc.close();
            return;
        }

        String s1 = sc.next();
        String s2 = sc.next();
        System.out.println(isRotation(s1, s2));
        sc.close();
    }
}
