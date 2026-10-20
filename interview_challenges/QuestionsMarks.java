// Questions Marks (Easy)
// Return true if every pair of ADJACENT digits that sum to 10 has exactly
// 3 '?' between them. If no pair sums to 10 at all, return false.
//
// Technique: single pass. Remember only the last digit seen and how many
// '?' appeared since it. O(n) time, O(1) space.
public class QuestionsMarks {

    public static boolean questionsMarks(String str) {
        int lastDigit = -1;      // -1 means "no digit seen yet"
        int qCount = 0;          // '?' seen since lastDigit
        boolean foundPair = false;

        for (int i = 0; i < str.length(); i++) {
            char c = str.charAt(i);
            if (Character.isDigit(c)) {
                int d = c - '0';
                if (lastDigit != -1 && lastDigit + d == 10) {
                    foundPair = true;
                    if (qCount != 3) return false;   // one bad pair fails everything
                }
                lastDigit = d;   // this digit starts the next pair
                qCount = 0;
            } else if (c == '?') {
                qCount++;
            }
        }
        return foundPair;
    }

    public static void main(String[] args) {
        String[] tests = {"arrb6???4xxbl5???eee5", "aa6?9", "acc?7??sss?3rr1??????5", "9???1???9???1???9"};
        for (String t : tests) {
            System.out.println(t + " -> " + questionsMarks(t));
        }
    }
}
