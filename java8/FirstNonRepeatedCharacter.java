import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * ============================================================================
 * INTERVIEW QUESTION: First Non-Repeated and First Repeated Character
 * ============================================================================
 * Frequent in: Google, Oracle, Microsoft, Amazon, Walmart, Epam
 *
 * Problems covered:
 * 1. Find the first non-repeated (unique) character in a String using Java 8.
 * 2. Find the first repeated character in a String using Java 8.
 * 3. Find the last non-repeated character in a String.
 *
 * Key Concept:
 * - String.chars() produces an IntStream.
 * - Grouping with LinkedHashMap::new maintains insertion order!
 * ============================================================================
 */
public class FirstNonRepeatedCharacter {

    public static Optional<Character> findFirstNonRepeated(String input) {
        if (input == null || input.isEmpty()) return Optional.empty();

        return input.chars()
                .mapToObj(c -> (char) c)
                .collect(Collectors.groupingBy(
                        Function.identity(),
                        LinkedHashMap::new, // maintains order of appearance
                        Collectors.counting()
                ))
                .entrySet()
                .stream()
                .filter(entry -> entry.getValue() == 1L)
                .map(Map.Entry::getKey)
                .findFirst();
    }

    public static Optional<Character> findFirstRepeated(String input) {
        if (input == null || input.isEmpty()) return Optional.empty();

        // Approach 1: using a Set to track seen characters in single pass
        Set<Character> seen = new HashSet<>();
        return input.chars()
                .mapToObj(c -> (char) c)
                .filter(c -> !seen.add(c)) // add returns false if already present
                .findFirst();
    }

    public static Optional<Character> findFirstRepeatedUsingGrouping(String input) {
        if (input == null || input.isEmpty()) return Optional.empty();

        return input.chars()
                .mapToObj(c -> (char) c)
                .collect(Collectors.groupingBy(
                        Function.identity(),
                        LinkedHashMap::new,
                        Collectors.counting()
                ))
                .entrySet()
                .stream()
                .filter(entry -> entry.getValue() > 1L)
                .map(Map.Entry::getKey)
                .findFirst();
    }

    public static void main(String[] args) {
        String test1 = "swiss";
        String test2 = "javadeveloper";
        String test3 = "aabbcc";

        System.out.println("First Non-Repeated Character:");
        System.out.println("  \"swiss\"          -> " + findFirstNonRepeated(test1).map(String::valueOf).orElse("None"));
        System.out.println("  \"javadeveloper\"  -> " + findFirstNonRepeated(test2).map(String::valueOf).orElse("None"));
        System.out.println("  \"aabbcc\"         -> " + findFirstNonRepeated(test3).map(String::valueOf).orElse("None"));

        System.out.println("\nFirst Repeated Character:");
        System.out.println("  \"swiss\"          -> " + findFirstRepeated(test1).map(String::valueOf).orElse("None"));
        System.out.println("  \"javadeveloper\"  -> " + findFirstRepeated(test2).map(String::valueOf).orElse("None"));
        System.out.println("  \"abcdef\"         -> " + findFirstRepeated("abcdef").map(String::valueOf).orElse("None"));
    }
}
