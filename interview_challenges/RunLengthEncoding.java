// Run Length Encoding (Medium)
// "aabbc" -> "2a2b1c",  "wwwggopp" -> "3w2g1o2p"
//
// Technique: one pass. Count how long the current run is; when the next
// character differs (or the string ends), write count + char.
// StringBuilder avoids O(n^2) string concatenation. O(n) time.
public class RunLengthEncoding {

    public static String runLength(String str) {
        StringBuilder sb = new StringBuilder();
        int count = 1;
        for (int i = 1; i <= str.length(); i++) {
            if (i < str.length() && str.charAt(i) == str.charAt(i - 1)) {
                count++;
            } else {
                sb.append(count).append(str.charAt(i - 1));
                count = 1;
            }
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        System.out.println(runLength("aabbc"));
        System.out.println(runLength("wwwggopp"));
        System.out.println(runLength("aabbcde"));
    }
}
