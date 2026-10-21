# Java 8+ Most Frequently Asked Interview Coding Programs

A curated collection of production-grade, clean, and well-tested Java 8+ coding programs that appear in technical interviews across product-based (Amazon, Google, Microsoft, Oracle, Walmart) and service-based (TCS, Infosys, Accenture, Capgemini, Cognizant) companies.

---

## 📂 Programs Overview

| # | Program File | Primary Concepts Tested | Companies Frequently Asking |
|---|--------------|-------------------------|------------------------------|
| 1 | [CharacterFrequency.java](file:///home/iam100god/Desktop/Java_Practice/java8/CharacterFrequency.java) | `chars()`, `Collectors.groupingBy`, `Collectors.counting()`, `Function.identity()`, frequency filters | Amazon, Infosys, TCS, Cognizant, Wipro |
| 2 | [FirstNonRepeatedCharacter.java](file:///home/iam100god/Desktop/Java_Practice/java8/FirstNonRepeatedCharacter.java) | `LinkedHashMap::new` order preservation, `findFirst()`, single-pass `Set.add()` filter | Google, Oracle, Microsoft, Walmart |
| 3 | [DuplicateElements.java](file:///home/iam100god/Desktop/Java_Practice/java8/DuplicateElements.java) | Finding duplicates, `distinct()`, finding elements occurring once, frequency maps | TCS, Infosys, Accenture, IBM, Cisco |
| 4 | [SecondHighestNumber.java](file:///home/iam100god/Desktop/Java_Practice/java8/SecondHighestNumber.java) | N-th highest number, duplicate deduplication before sorting, `Comparator.reverseOrder()`, `skip()` | PayTM, Oracle, Amdocs, JPMorgan |
| 5 | [EmployeeStreamOperations.java](file:///home/iam100god/Desktop/Java_Practice/java8/EmployeeStreamOperations.java) | Real-world domain scenario: grouping, partitioning, department-wise max salary, averaging, summary stats | Asked in **nearly every** Java 8 interview |
| 6 | [AnagramCheckJava8.java](file:///home/iam100god/Desktop/Java_Practice/java8/AnagramCheckJava8.java) | Stream-based character sorting, frequency map comparison, LeetCode 49 Group Anagrams | Amazon, Goldman Sachs, Cisco, EPAM |
| 7 | [LongestStringAndJoining.java](file:///home/iam100god/Desktop/Java_Practice/java8/LongestStringAndJoining.java) | `Collectors.joining(delim, prefix, suffix)`, `reduce`, `groupingBy(String::length)` | Accenture, Mindtree, Tech Mahindra |
| 8 | [ArrayAndNumberStreams.java](file:///home/iam100god/Desktop/Java_Practice/java8/ArrayAndNumberStreams.java) | `flatMap`, `partitioningBy`, `IntStream.rangeClosed` (Prime check), `Stream.iterate` (Fibonacci), sum of digits | PayTM, Nagarro, IBM, LTI |
| 9 | [FunctionalInterfaceExamples.java](file:///home/iam100god/Desktop/Java_Practice/java8/FunctionalInterfaceExamples.java) | `Predicate`, `Function`, `Consumer`, `Supplier`, Custom `@FunctionalInterface`, Method references | Standard Java 8 Technical screening |
| 10 | [Java8PlusModernFeatures.java](file:///home/iam100god/Desktop/Java_Practice/java8/Java8PlusModernFeatures.java) | Java 9 to 21: Records, Pattern matching (`instanceof` & `switch`), `takeWhile`/`dropWhile`, `CompletableFuture` | Senior & Lead Java Engineer rounds |

---

## 🚀 How to Compile and Run

You can run individual programs directly from this directory:

```bash
cd java8

# Compile all files
javac *.java

# Run any program
java CharacterFrequency
java FirstNonRepeatedCharacter
java DuplicateElements
java SecondHighestNumber
java EmployeeStreamOperations
java AnagramCheckJava8
java LongestStringAndJoining
java ArrayAndNumberStreams
java FunctionalInterfaceExamples
java Java8PlusModernFeatures
```

---

## 💡 Quick Java 8 Collector Cheat Sheet

- **Character Stream**: `str.chars().mapToObj(c -> (char) c)`
- **Frequency Map**: `collect(Collectors.groupingBy(Function.identity(), Collectors.counting()))`
- **Preserve Order in Grouping**: `collect(Collectors.groupingBy(Function.identity(), LinkedHashMap::new, Collectors.counting()))`
- **Partition into 2 groups (true/false)**: `collect(Collectors.partitioningBy(predicate))`
- **Find Max in Group**: `Collectors.collectingAndThen(Collectors.maxBy(Comparator.comparing(...)), Optional::get)`
- **Join with delimiter**: `collect(Collectors.joining(", ", "[", "]"))`
- **Summary statistics**: `collect(Collectors.summarizingDouble(Emp::getSalary))`
