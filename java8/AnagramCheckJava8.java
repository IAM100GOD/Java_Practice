import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * ============================================================================
 * INTERVIEW QUESTION: Anagram Check Using Java 8 Streams
 * ============================================================================
 * Frequent in: Amazon, Goldman Sachs, Cisco, Capgemini, EPAM
 *
 * Problems covered:
 * 1. Check if two strings are anagrams by sorting characters via Stream.
 * 2. Check if two strings are anagrams by comparing character frequency Maps.
 * 3. Group list of strings into Anagram groups (LeetCode 49 Group Anagrams).
 * ============================================================================
 */
public class AnagramCheckJava8 {

    /**
     * Approach 1: Sort characters using Stream and compare the resulting strings.
     */
    public static boolean isAnagramBySorting(String s1, String s2) {
        if (s1 == null || s2 == null) return false;

        String sorted1 = Stream.of(s1.replaceAll("\\s+", "").toLowerCase().split(""))
                .sorted()
                .collect(Collectors.joining());

        String sorted2 = Stream.of(s2.replaceAll("\\s+", "").toLowerCase().split(""))
                .sorted()
                .collect(Collectors.joining());

        return sorted1.equals(sorted2);
    }

    /**
     * Approach 2: Build frequency Map with Streams and compare maps directly.
     * O(N) time complexity instead of O(N log N) sorting.
     */
    public static boolean isAnagramByFrequency(String s1, String s2) {
        if (s1 == null || s2 == null) return false;

        Map<Character, Long> map1 = s1.replaceAll("\\s+", "").toLowerCase().chars()
                .mapToObj(c -> (char) c)
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

        Map<Character, Long> map2 = s2.replaceAll("\\s+", "").toLowerCase().chars()
                .mapToObj(c -> (char) c)
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

        return map1.equals(map2);
    }

    /**
     * Approach 3: Group list of strings into anagram clusters
     */
    public static Map<String, java.util.List<String>> groupAnagrams(String[] words) {
        return Arrays.stream(words)
                .collect(Collectors.groupingBy(word ->
                        Stream.of(word.toLowerCase().split(""))
                                .sorted()
                                .collect(Collectors.joining())
                ));
    }

    public static void main(String[] args) {
        String[][] pairs = {
                {"Listen", "Silent"},
                {"Triangle", "Integral"},
                {"Dormitory", "Dirty Room"},
                {"Hello", "Bello"}
        };

        System.out.println("Anagram Check Results:");
        for (String[] pair : pairs) {
            boolean res1 = isAnagramBySorting(pair[0], pair[1]);
            boolean res2 = isAnagramByFrequency(pair[0], pair[1]);
            System.out.printf("  \"%s\" vs \"%s\" -> By Sorting: %b, By Frequency: %b%n",
                    pair[0], pair[1], res1, res2);
        }

        System.out.println("\nGroup Anagrams from Array:");
        String[] words = {"eat", "tea", "tan", "ate", "nat", "bat"};
        Map<String, java.util.List<String>> grouped = groupAnagrams(words);
        grouped.values().forEach(group -> System.out.println("   " + group));
    }
}
