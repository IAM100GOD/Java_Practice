// First Unique / Non-Repeating Character (Streams & LinkedHashMap)
// ★ Repeated (F2F & HackerRank)
// Easy
// Java 8 Streams / Collections
//
// Given a string s, find the first non-repeating character in it and return its index or character.
// If it does not exist, return -1 or '_'.
// Lateral interviewers frequently ask: "Now solve this in one line using Java 8 Streams."
// Both implementations are provided below.
//
// Sample Cases:
// Input: "accenture" -> Output: 'a' (index 0)
// Input: "aabbcc"    -> Output: '_' (none unique)

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Scanner;
import java.util.function.Function;
import java.util.stream.Collectors;

public class FirstNonRepeatingChar {

    // Approach 1: Fast O(n) array frequency scan (returns 0-based index or -1)
    public static int firstUniqCharIndex(String s) {
        if (s == null || s.isEmpty()) return -1;
        int[] freq = new int[256];
        for (int i = 0; i < s.length(); i++) {
            freq[s.charAt(i)]++;
        }
        for (int i = 0; i < s.length(); i++) {
            if (freq[s.charAt(i)] == 1) return i;
        }
        return -1;
    }

    // Approach 2: Returns the character itself, or '_' if none exists
    public static char firstUniqueChar(String s) {
        int idx = firstUniqCharIndex(s);
        return idx == -1 ? '_' : s.charAt(idx);
    }

    // Approach 3: Java 8 Stream one-liner using LinkedHashMap to preserve insertion order
    public static Character firstUniqueStream(String s) {
        if (s == null || s.isEmpty()) return '_';
        return s.chars()
                .mapToObj(c -> (char) c)
                .collect(Collectors.groupingBy(Function.identity(), LinkedHashMap::new, Collectors.counting()))
                .entrySet()
                .stream()
                .filter(e -> e.getValue() == 1L)
                .map(Map.Entry::getKey)
                .findFirst()
                .orElse('_');
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) {
            // Default demo
            String s1 = "accenture";
            System.out.println("Demo 1: \"" + s1 + "\" -> char: '" + firstUniqueChar(s1) + "', index: " + firstUniqCharIndex(s1) + ", stream: '" + firstUniqueStream(s1) + "'");
            String s2 = "aabbcc";
            System.out.println("Demo 2: \"" + s2 + "\" -> char: '" + firstUniqueChar(s2) + "', index: " + firstUniqCharIndex(s2) + ", stream: '" + firstUniqueStream(s2) + "'");
            sc.close();
            return;
        }

        String input = sc.next();
        System.out.println("First Unique Char: " + firstUniqueChar(input));
        System.out.println("Index: " + firstUniqCharIndex(input));
        System.out.println("Java 8 Stream: " + firstUniqueStream(input));
        sc.close();
    }
}
