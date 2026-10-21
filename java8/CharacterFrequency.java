import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * ============================================================================
 * INTERVIEW QUESTION: Character & Word Frequency using Java 8 Streams
 * ============================================================================
 * Frequent in: Amazon, Infosys, TCS, Cognizant, Wipro, Capgemini, Morgan Stanley
 *
 * Problems covered:
 * 1. Count occurrence of each character in a String.
 * 2. Count frequency of each word in a String / List.
 * 3. Find only characters that appear more than once (duplicates) with counts.
 * 4. Case-insensitive character frequency ignoring spaces.
 * ============================================================================
 */
public class CharacterFrequency {

    public static void main(String[] args) {
        String input = "Java Streams API in Java 8";

        System.out.println("Input String: \"" + input + "\"");
        System.out.println("--------------------------------------------------");

        // 1. Count occurrence of each character (case-sensitive)
        Map<Character, Long> charCount = input.chars()
                .mapToObj(c -> (char) c)
                .collect(Collectors.groupingBy(
                        Function.identity(),
                        Collectors.counting()
                ));
        System.out.println("1. All Character Frequencies (case-sensitive):");
        charCount.forEach((k, v) -> System.out.println("   '" + k + "' -> " + v));

        // 2. Count occurrence of each letter (case-insensitive, ignoring whitespace)
        Map<Character, Long> caseInsensitiveCount = input.chars()
                .filter(c -> !Character.isWhitespace(c))
                .mapToObj(c -> Character.toLowerCase((char) c))
                .collect(Collectors.groupingBy(
                        Function.identity(),
                        LinkedHashMap::new, // preserves encounter order
                        Collectors.counting()
                ));
        System.out.println("\n2. Letter Frequencies (ignoring spaces, order preserved):");
        caseInsensitiveCount.forEach((k, v) -> System.out.println("   '" + k + "' -> " + v));

        // 3. Find only characters that repeat (count > 1)
        Map<Character, Long> duplicateChars = input.chars()
                .filter(c -> !Character.isWhitespace(c))
                .mapToObj(c -> Character.toLowerCase((char) c))
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()))
                .entrySet()
                .stream()
                .filter(entry -> entry.getValue() > 1)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
        System.out.println("\n3. Duplicate Characters (count > 1): " + duplicateChars);

        // 4. Word frequency count from a sentence
        String sentence = "apple banana apple orange banana apple grapes";
        Map<String, Long> wordCount = Arrays.stream(sentence.split("\\s+"))
                .collect(Collectors.groupingBy(
                        Function.identity(),
                        Collectors.counting()
                ));
        System.out.println("\n4. Word Frequencies in \"" + sentence + "\":");
        wordCount.forEach((word, count) -> System.out.println("   " + word + " -> " + count));
    }
}
