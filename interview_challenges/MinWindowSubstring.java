// Min Window Substring (Medium/Hard)
// {"ahffaksfajeeubsne", "jefaa"} -> "aksfaje"
//
// Technique: sliding window with a frequency table.
//   need[c]  = how many more copies of c the window still needs (can go negative = surplus)
//   missing  = total characters still needed; window is valid when missing == 0
// Grow the window with `right`; once valid, shrink from `left` as far as possible.
// Each index enters and leaves the window once: O(n + m) time.
public class MinWindowSubstring {

    public static String minWindow(String s, String t) {
        int[] need = new int[128];
        for (char c : t.toCharArray()) need[c]++;

        int missing = t.length();
        int left = 0, bestStart = 0, bestLen = Integer.MAX_VALUE;

        for (int right = 0; right < s.length(); right++) {
            char r = s.charAt(right);
            if (need[r] > 0) missing--;     // this char was still needed
            need[r]--;

            while (missing == 0) {          // window [left..right] is valid
                if (right - left + 1 < bestLen) {
                    bestLen = right - left + 1;
                    bestStart = left;
                }
                char l = s.charAt(left);
                need[l]++;
                if (need[l] > 0) missing++; // removed a required char, window breaks
                left++;
            }
        }
        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);
    }

    public static void main(String[] args) {
        System.out.println(minWindow("ahffaksfajeeubsne", "jefaa"));
        System.out.println(minWindow("aaffhkksemckelloe", "fhea"));
        System.out.println(minWindow("ADOBECODEBANC", "ABC"));
    }
}
