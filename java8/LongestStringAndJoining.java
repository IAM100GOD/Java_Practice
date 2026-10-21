import java.util.*;
import java.util.stream.Collectors;

/**
 * ============================================================================
 * INTERVIEW QUESTION: String Operations with Streams & Collectors
 * ============================================================================
 * Frequent in: Accenture, Wipro, Cognizant, Tech Mahindra, Mindtree
 *
 * Problems covered:
 * 1. Find the longest string in a list (using max and reduce).
 * 2. Join strings with prefix, delimiter, and suffix.
 * 3. Group strings by their lengths.
 * 4. Filter strings starting with a specific letter (e.g., 'A') or specific length.
 * 5. Sort strings in increasing and decreasing order of length.
 * ============================================================================
 */
public class LongestStringAndJoining {

    public static void main(String[] args) {
        List<String> fruits = Arrays.asList(
                "apple", "banana", "avocado", "watermelon", "cherry", "apricot", "fig"
        );
        System.out.println("Original List: " + fruits);
        System.out.println("--------------------------------------------------");

        // 1. Find Longest String
        Optional<String> longestWithMax = fruits.stream()
                .max(Comparator.comparingInt(String::length));
        System.out.println("1. Longest string (using max): " + longestWithMax.orElse(""));

        // Alternative using reduce
        String longestWithReduce = fruits.stream()
                .reduce((w1, w2) -> w1.length() >= w2.length() ? w1 : w2)
                .orElse("");
        System.out.println("   Longest string (using reduce): " + longestWithReduce);

        // 2. Joining with Delimiter, Prefix, and Suffix
        String joined = fruits.stream()
                .map(String::toUpperCase)
                .collect(Collectors.joining(", ", "Fruits: [", "]"));
        System.out.println("\n2. Joined uppercase strings: " + joined);

        // 3. Group Strings by Length
        Map<Integer, List<String>> byLength = fruits.stream()
                .collect(Collectors.groupingBy(String::length));
        System.out.println("\n3. Grouped by length:");
        byLength.forEach((len, list) -> System.out.println("   Length " + len + " -> " + list));

        // 4. Strings starting with 'a' (case-insensitive)
        List<String> startingWithA = fruits.stream()
                .filter(s -> s.toLowerCase().startsWith("a"))
                .collect(Collectors.toList());
        System.out.println("\n4. Strings starting with 'a': " + startingWithA);

        // 5. Sort by Length (Ascending & Descending)
        List<String> sortedAscending = fruits.stream()
                .sorted(Comparator.comparingInt(String::length))
                .collect(Collectors.toList());
        List<String> sortedDescending = fruits.stream()
                .sorted(Comparator.comparingInt(String::length).reversed().thenComparing(Comparator.naturalOrder()))
                .collect(Collectors.toList());

        System.out.println("\n5. Sorted by length (asc):  " + sortedAscending);
        System.out.println("   Sorted by length (desc): " + sortedDescending);
    }
}
