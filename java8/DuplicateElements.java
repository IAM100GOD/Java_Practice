import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * ============================================================================
 * INTERVIEW QUESTION: Finding and Handling Duplicates using Java 8
 * ============================================================================
 * Frequent in: TCS, Infosys, Accenture, Capgemini, IBM, Cisco
 *
 * Problems covered:
 * 1. Find all duplicate elements from a given integer list.
 * 2. Remove duplicates while preserving insertion order.
 * 3. Find elements that appear ONLY ONCE (distinct unique items).
 * 4. Find the count of duplicate elements.
 * ============================================================================
 */
public class DuplicateElements {

    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(10, 15, 8, 49, 25, 98, 98, 32, 15, 10, 77, 10);
        System.out.println("Original List: " + numbers);
        System.out.println("--------------------------------------------------");

        // 1. Find duplicate elements using Set.add()
        // Set.add(x) returns false if the item was already in the set.
        Set<Integer> seen = new HashSet<>();
        Set<Integer> duplicates = numbers.stream()
                .filter(n -> !seen.add(n))
                .collect(Collectors.toCollection(LinkedHashSet::new));
        System.out.println("1. Duplicate elements (order-preserved): " + duplicates);

        // 2. Remove duplicates while maintaining order
        List<Integer> distinctList = numbers.stream()
                .distinct()
                .collect(Collectors.toList());
        System.out.println("2. After removing duplicates (.distinct()): " + distinctList);

        // 3. Find elements that appear EXACTLY ONCE
        List<Integer> uniqueOnce = numbers.stream()
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()))
                .entrySet()
                .stream()
                .filter(entry -> entry.getValue() == 1L)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
        System.out.println("3. Elements appearing only once: " + uniqueOnce);

        // 4. Duplicate elements with their exact occurrence counts
        Map<Integer, Long> duplicateCounts = numbers.stream()
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()))
                .entrySet()
                .stream()
                .filter(entry -> entry.getValue() > 1L)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
        System.out.println("4. Duplicate elements with counts: " + duplicateCounts);
    }
}
