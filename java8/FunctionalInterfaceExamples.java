import java.util.*;
import java.util.function.*;

/**
 * ============================================================================
 * INTERVIEW QUESTION: Java 8 Functional Interfaces & Method References
 * ============================================================================
 * Frequent in: All Java 8 technical rounds & theory/coding screens
 *
 * Concepts covered:
 * 1. The Big 4 Built-in Functional Interfaces:
 *    - Predicate<T>: takes T, returns boolean (test)
 *    - Function<T, R>: takes T, returns R (apply)
 *    - Consumer<T>: takes T, returns void (accept)
 *    - Supplier<T>: takes nothing, returns T (get)
 * 2. BiPredicate, BiFunction, BiConsumer, UnaryOperator, BinaryOperator.
 * 3. Custom @FunctionalInterface with default and static methods.
 * 4. Method Reference variants (Static, Instance, Constructor).
 * ============================================================================
 */
public class FunctionalInterfaceExamples {

    // Custom Functional Interface
    @FunctionalInterface
    interface MathOperation {
        int operate(int a, int b);

        // Can contain default methods
        default void log(String message) {
            System.out.println("[MathOperation Log]: " + message);
        }

        // Can contain static methods
        static boolean isZero(int val) {
            return val == 0;
        }
    }

    public static void main(String[] args) {
        System.out.println("================ BUILT-IN FUNCTIONAL INTERFACES ================");

        // 1. Predicate<T>
        Predicate<Integer> isEven = n -> n % 2 == 0;
        Predicate<Integer> isPositive = n -> n > 0;
        Predicate<Integer> isPositiveAndEven = isPositive.and(isEven);

        System.out.println("1. Predicate (isPositiveAndEven for 4): " + isPositiveAndEven.test(4));
        System.out.println("   Predicate (isPositiveAndEven for -2): " + isPositiveAndEven.test(-2));

        // 2. Function<T, R>
        Function<String, Integer> stringLength = String::length;
        Function<Integer, Integer> multiplyByTwo = n -> n * 2;
        // Function composition: andThen
        Function<String, Integer> lengthTimesTwo = stringLength.andThen(multiplyByTwo);
        System.out.println("\n2. Function (length * 2 for 'Antigravity'): " + lengthTimesTwo.apply("Antigravity"));

        // 3. Consumer<T>
        Consumer<String> printer = s -> System.out.println("   Consumer received: " + s);
        System.out.println("\n3. Consumer:");
        printer.accept("Java 8 Streams and Lambdas");

        // 4. Supplier<T>
        Supplier<Double> randomSupplier = Math::random;
        System.out.println("\n4. Supplier (lazy generation): " + randomSupplier.get());

        // 5. BinaryOperator & UnaryOperator
        BinaryOperator<Integer> sum = Integer::sum;
        UnaryOperator<String> toUpper = String::toUpperCase;
        System.out.println("\n5. BinaryOperator sum(15, 25): " + sum.apply(15, 25));
        System.out.println("   UnaryOperator toUpper('interview'): " + toUpper.apply("interview"));

        // 6. Custom Functional Interface with Lambda
        System.out.println("\n6. Custom @FunctionalInterface:");
        MathOperation multiply = (a, b) -> a * b;
        multiply.log("Executing multiplication");
        System.out.println("   Result: 6 * 7 = " + multiply.operate(6, 7));
        System.out.println("   Static method check: isZero(0) = " + MathOperation.isZero(0));

        // 7. Method Reference types:
        // - Static: Math::max
        // - Bound Instance: System.out::println
        // - Unbound Instance: String::toLowerCase
        // - Constructor: ArrayList::new
        Supplier<List<String>> listSupplier = ArrayList::new;
        List<String> list = listSupplier.get();
        list.add("Java 8");
        list.add("Features");
        System.out.println("\n7. Constructor Reference list: " + list);
    }
}
