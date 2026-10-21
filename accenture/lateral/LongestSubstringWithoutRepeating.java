// Longest Substring Without Repeating Characters
// ★ High Frequency (Lateral)
// Medium
// Sliding Window / HashMap
//
// Given a string s, find the length of the longest substring without duplicate characters.
// Commonly tested in both Accenture HackerRank lateral assessments and live Zoom pair-programming sessions.
//
// Sample Test Case
// Input: s = "abcabcbb"
// Longest non-repeating: "abc" of length 3
// Output: 3
//
// Pattern:
// Sliding window [left..right]. Maintain the most recent index where each character appeared.
// If s.charAt(right) was seen at idx >= left, update left = idx + 1.
// Update maxLength = Math.max(maxLength, right - left + 1).
// Time: O(n), Space: O(min(m, n)) where m is charset size.

import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class LongestSubstringWithoutRepeating {
    public static int lengthOfLongestSubstring(String s) {
        if (s == null || s.isEmpty()) return 0;

        Map<Character, Integer> lastSeen = new HashMap<>();
        int maxLen = 0;
        int left = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (lastSeen.containsKey(c)) {
                // Advance left pointer past previous occurrence if inside current window
                left = Math.max(left, lastSeen.get(c) + 1);
            }
            lastSeen.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }

        return maxLen;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) {
            // Default demo execution
            System.out.println("Demo 1 (\"abcabcbb\"): " + lengthOfLongestSubstring("abcabcbb"));
            System.out.println("Demo 2 (\"bbbbb\"): " + lengthOfLongestSubstring("bbbbb"));
            System.out.println("Demo 3 (\"pwwkew\"): " + lengthOfLongestSubstring("pwwkew"));
            sc.close();
            return;
        }

        String s = sc.nextLine();
        System.out.println(lengthOfLongestSubstring(s));
        sc.close();
    }
}
