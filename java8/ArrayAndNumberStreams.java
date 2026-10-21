import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

/**
 * ============================================================================
 * INTERVIEW QUESTION: Array, Number Manipulation & FlatMap in Java 8
 * ============================================================================
 * Frequent in: PayTM, Nagarro, IBM, LTI, HCL, Infosys
 *
 * Problems covered:
 * 1. Find all numbers starting with '1'.
 * 2. Square each number and filter numbers > 100, then find their average.
 * 3. Flatten 2D List / Array using flatMap.
 * 4. Separate (Partition) Even and Odd numbers.
 * 5. Check if a number is Prime using IntStream.
 * 6. Calculate sum of all digits of a number.
 * 7. Generate first N Fibonacci numbers using Stream.iterate.
 * ============================================================================
 */
public class ArrayAndNumberStreams {

    public static boolean isPrime(int n) {
        if (n <= 1) return false;
        return IntStream.rangeClosed(2, (int) Math.sqrt(n))
                .noneMatch(i -> n % i == 0);
    }

    public static int sumOfDigits(int number) {
        return String.valueOf(Math.abs(number))
                .chars()
                .map(Character::getNumericValue)
                .sum();
    }

    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(10, 15, 8, 49, 25, 98, 32, 123, 5, 1);
        System.out.println("Original Numbers: " + numbers);
        System.out.println("--------------------------------------------------");

        // 1. Numbers starting with 1
        List<Integer> startingWithOne = numbers.stream()
                .map(String::valueOf)
                .filter(s -> s.startsWith("1"))
                .map(Integer::valueOf)
                .collect(Collectors.toList());
        System.out.println("1. Numbers starting with 1: " + startingWithOne);

        // 2. Square each number, filter > 100, then compute average
        OptionalDouble avg = numbers.stream()
                .mapToInt(n -> n * n)
                .filter(sq -> sq > 100)
                .average();
        System.out.printf("2. Average of squares > 100: %.2f%n", avg.orElse(0.0));

        // 3. Flatten nested lists (flatMap)
        List<List<String>> nestedList = Arrays.asList(
                Arrays.asList("Core Java", "Collections"),
                Arrays.asList("Streams", "Lambdas", "Optional"),
                Arrays.asList("Multithreading", "Spring Boot")
        );
        List<String> flatList = nestedList.stream()
                .flatMap(Collection::stream)
                .collect(Collectors.toList());
        System.out.println("\n3. Flattened List (flatMap): " + flatList);

        // 4. Partition Even and Odd numbers
        Map<Boolean, List<Integer>> evenOddMap = numbers.stream()
                .collect(Collectors.partitioningBy(n -> n % 2 == 0));
        System.out.println("\n4. Partition Even/Odd:");
        System.out.println("   Even: " + evenOddMap.get(true));
        System.out.println("   Odd:  " + evenOddMap.get(false));

        // 5. Prime check using IntStream
        int[] testPrimes = {2, 7, 12, 17, 25, 31};
        System.out.println("\n5. Prime Checks:");
        for (int p : testPrimes) {
            System.out.println("   " + p + " is prime? " + isPrime(p));
        }

        // 6. Sum of digits
        int num = 98765;
        System.out.println("\n6. Sum of digits for " + num + " = " + sumOfDigits(num));

        // 7. First 10 Fibonacci numbers using Stream.iterate
        System.out.print("\n7. First 10 Fibonacci numbers: ");
        Stream.iterate(new int[]{0, 1}, f -> new int[]{f[1], f[0] + f[1]})
                .limit(10)
                .map(f -> f[0])
                .forEach(n -> System.out.print(n + " "));
        System.out.println();
    }
}
