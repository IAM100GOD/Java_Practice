// Max Consecutive Vowels in Substring (Accenture)
// Medium | Two Pointers / Sliding Window
// Given a string s and an integer k, find the maximum count of vowels in any contiguous
// substring of length k. (Reported in recent 2025/2026 AASE drives.)
//
// Sample Test Case
// Input: s = "abciiidef", k = 3
// Output: 3
// Explanation: Substring "iii" contains 3 vowels.

import java.util.Scanner;

public class MaxVowelsSubstring {
    private static boolean isVowel(char c) {
        c = Character.toLowerCase(c);
        return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u';
    }

    // Fixed-size sliding window: O(n) time, O(1) space
    public static int maxVowels(String s, int k) {
        int n = s.length();
        if (k <= 0 || n == 0) return 0;
        k = Math.min(k, n);

        int count = 0;
        for (int i = 0; i < k; i++) {          // first window
            if (isVowel(s.charAt(i))) count++;
        }
        int best = count;

        for (int i = k; i < n; i++) {          // slide: add s[i], drop s[i-k]
            if (isVowel(s.charAt(i))) count++;
            if (isVowel(s.charAt(i - k))) count--;
            best = Math.max(best, count);
            if (best == k) break;              // can't do better than all vowels
        }
        return best;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        int k = sc.nextInt();
        System.out.println(maxVowels(s, k));
        sc.close();
    }
}
