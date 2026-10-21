import java.util.*;

/**
 * ============================================================================
 * INTERVIEW QUESTION: 2nd Highest / N-th Highest Number & Min/Max
 * ============================================================================
 * Frequent in: PayTM, Oracle, Amdocs, Infosys, Morgan Stanley, JPMorgan
 *
 * Problems covered:
 * 1. Find the 2nd highest number in a list of integers (handling duplicate maxes).
 * 2. Find the N-th highest number in a list.
 * 3. Find the minimum and maximum number using Java 8.
 * 4. Find the 2nd lowest number.
 * ============================================================================
 */
public class SecondHighestNumber {

    /**
     * Finds the N-th highest distinct number.
     * 1st highest -> n = 1
     * 2nd highest -> n = 2, etc.
     */
    public static Optional<Integer> findNthHighest(List<Integer> list, int n) {
        if (list == null || n <= 0) return Optional.empty();

        return list.stream()
                .filter(Objects::nonNull)
                .distinct() // CRITICAL: remove duplicates so [20, 20, 15] gives 15 as 2nd highest
                .sorted(Comparator.reverseOrder())
                .skip(n - 1)
                .findFirst();
    }

    public static Optional<Integer> findNthLowest(List<Integer> list, int n) {
        if (list == null || n <= 0) return Optional.empty();

        return list.stream()
                .filter(Objects::nonNull)
                .distinct()
                .sorted(Comparator.naturalOrder())
                .skip(n - 1)
                .findFirst();
    }

    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(5, 9, 11, 2, 8, 21, 1, 21, 17, 11);
        System.out.println("Input Numbers: " + numbers);
        System.out.println("--------------------------------------------------");

        // 1. Second Highest
        Optional<Integer> secondHighest = findNthHighest(numbers, 2);
        System.out.println("1. Second highest number: " + secondHighest.orElse(null));

        // 2. Third Highest
        Optional<Integer> thirdHighest = findNthHighest(numbers, 3);
        System.out.println("2. Third highest number: " + thirdHighest.orElse(null));

        // 3. Second Lowest
        Optional<Integer> secondLowest = findNthLowest(numbers, 2);
        System.out.println("3. Second lowest number: " + secondLowest.orElse(null));

        // 4. Maximum and Minimum using Comparator
        Optional<Integer> max = numbers.stream().max(Comparator.naturalOrder());
        Optional<Integer> min = numbers.stream().min(Comparator.naturalOrder());

        System.out.println("4. Maximum element: " + max.orElse(null));
        System.out.println("   Minimum element: " + min.orElse(null));

        // 5. Edge case: All elements are identical or empty
        List<Integer> duplicatesOnly = Arrays.asList(5, 5, 5, 5);
        System.out.println("\nEdge case with duplicates only [5, 5, 5, 5]:");
        System.out.println("   2nd highest: " + findNthHighest(duplicatesOnly, 2).orElse(-1) + " (none available)");
    }
}
