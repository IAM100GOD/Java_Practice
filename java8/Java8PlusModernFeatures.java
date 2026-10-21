import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

/**
 * ============================================================================
 * INTERVIEW QUESTION: Java 8+ Modern Java Features (Java 9 to Java 21)
 * ============================================================================
 * Asked in: Senior Developer & Tech Lead interviews across Tier-1 companies
 *
 * Concepts covered:
 * 1. Optional API enhancements (Java 8 & Java 9 ifPresentOrElse, or, stream).
 * 2. CompletableFuture Async Pipeline (supplyAsync, thenApply, thenCombine).
 * 3. Immutable Factory Methods & takeWhile/dropWhile (Java 9+).
 * 4. Records - Immutable data classes (Java 14/16+).
 * 5. Pattern Matching for instanceof (Java 16+).
 * 6. Modern Switch Expression with Pattern Matching (Java 17/21+).
 * 7. Text Blocks & Multiline Strings (Java 15+).
 * ============================================================================
 */
public class Java8PlusModernFeatures {

    // 1. Record: Concise, immutable data model (Java 16+)
    public record User(int id, String name, String role, double rating) {}

    // Sealed interface hierarchy for pattern matching demonstration (Java 17+)
    public sealed interface PaymentMethod permits CreditCard, UPI, Crypto {}
    public record CreditCard(String cardNumber, String expiry) implements PaymentMethod {}
    public record UPI(String vpaId) implements PaymentMethod {}
    public record Crypto(String walletAddress, String coin) implements PaymentMethod {}

    public static String processPayment(PaymentMethod payment) {
        // Pattern matching for switch (Java 21+)
        return switch (payment) {
            case CreditCard cc -> "Processing Credit Card ending with: " + cc.cardNumber().substring(Math.max(0, cc.cardNumber().length() - 4));
            case UPI upi       -> "Processing UPI payment for VPA: " + upi.vpaId();
            case Crypto c      -> "Processing Crypto (" + c.coin() + ") on wallet: " + c.walletAddress();
        };
    }

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        System.out.println("================ JAVA 8+ MODERN FEATURES ================");

        // -------------------------------------------------------------
        // A. Records and Pattern Matching (Java 16/17+)
        // -------------------------------------------------------------
        User dev = new User(101, "Siddharth", "FullStack Engineer", 4.9);
        System.out.println("1. Record instance: " + dev);
        System.out.println("   Accessor: " + dev.name() + ", Rating: " + dev.rating());

        // Pattern matching for instanceof
        Object obj = "Java 21 LTS";
        if (obj instanceof String str && str.length() > 5) {
            System.out.println("2. Pattern Matching instanceof: uppercase -> " + str.toUpperCase());
        }

        // Switch pattern matching
        PaymentMethod payment = new UPI("user@okhdfcbank");
        System.out.println("3. Switch Pattern Matching: " + processPayment(payment));

        // -------------------------------------------------------------
        // B. Modern Optional (Java 9+ ifPresentOrElse & or)
        // -------------------------------------------------------------
        Optional<String> optionalVal = Optional.of("Hello Modern Java");
        System.out.print("4. Optional ifPresentOrElse: ");
        optionalVal.ifPresentOrElse(
                val -> System.out.println("Found -> " + val),
                () -> System.out.println("Value was not present")
        );

        Optional<String> emptyVal = Optional.empty();
        String fallback = emptyVal.or(() -> Optional.of("Default Fallback")).get();
        System.out.println("   Optional .or() fallback: " + fallback);

        // -------------------------------------------------------------
        // C. Java 9 Stream additions: takeWhile & dropWhile
        // -------------------------------------------------------------
        List<Integer> sortedNumbers = List.of(2, 4, 6, 8, 9, 10, 12);
        List<Integer> evensWhileTrue = sortedNumbers.stream()
                .takeWhile(n -> n % 2 == 0) // stops at 9
                .toList();
        List<Integer> afterFirstOdd = sortedNumbers.stream()
                .dropWhile(n -> n % 2 == 0) // drops 2, 4, 6, 8; yields 9, 10, 12
                .toList();
        System.out.println("\n5. Stream takeWhile (even prefix): " + evensWhileTrue);
        System.out.println("   Stream dropWhile (from first odd): " + afterFirstOdd);

        // -------------------------------------------------------------
        // D. Text Blocks (Java 15+)
        // -------------------------------------------------------------
        String jsonPayload = """
                {
                    "user": "Alice",
                    "role": "Developer",
                    "active": true
                }
                """;
        System.out.println("\n6. Text Block (Multiline string):\n" + jsonPayload.trim());

        // -------------------------------------------------------------
        // E. CompletableFuture (Async Reactive Pipeline)
        // -------------------------------------------------------------
        System.out.println("7. CompletableFuture async composition:");
        CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
            // Simulate fetching user
            return "User: John Doe";
        }).thenApply(userString -> {
            // Transform user string
            return userString.toUpperCase();
        }).thenCombine(
                CompletableFuture.supplyAsync(() -> "Role: Architect"),
                (userStr, roleStr) -> userStr + " | " + roleStr
        );

        System.out.println("   Result from CompletableFuture: " + future.get());
    }
}
