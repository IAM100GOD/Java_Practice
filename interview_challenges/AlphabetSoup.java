// Alphabet Soup (Easy)
// "coderbyte" -> "bcdeeorty"
//
// Technique: counting sort. There are only 128 ASCII characters, so count
// each one, then write them back out in code order. O(n + 128) = O(n),
// beating the O(n log n) of Arrays.sort.
public class AlphabetSoup {

    public static String alphabetSoup(String str) {
        int[] count = new int[128];
        for (char c : str.toCharArray()) {
            count[c]++;
        }
        StringBuilder sb = new StringBuilder(str.length());
        for (int c = 0; c < 128; c++) {
            for (int k = 0; k < count[c]; k++) {
                sb.append((char) c);
            }
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        System.out.println(alphabetSoup("coderbyte"));
        System.out.println(alphabetSoup("hooplah"));
    }
}
