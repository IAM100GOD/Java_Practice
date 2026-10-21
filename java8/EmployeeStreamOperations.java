import java.util.*;
import java.util.stream.Collectors;

/**
 * ============================================================================
 * INTERVIEW QUESTION: Real-world Employee Real-Time Scenario Questions
 * ============================================================================
 * Frequent in: ALMOST EVERY Java 8 Interview (Service & Product Based Companies)
 *
 * Scenarios covered:
 * 1. Group employees by department.
 * 2. Count number of employees in each department.
 * 3. Find the highest-paid employee overall & in each department.
 * 4. Find average salary of each department & overall.
 * 5. Find the youngest and oldest employee.
 * 6. Partition employees by age (e.g., > 30 years old vs <= 30).
 * 7. Get names of all employees joined by commas.
 * 8. Find top 3 highest paid employees.
 * 9. Find second highest paid employee.
 * 10. Summary statistics (count, sum, min, average, max salary).
 * ============================================================================
 */
public class EmployeeStreamOperations {

    public static class Employee {
        private final int id;
        private final String name;
        private final int age;
        private final String gender;
        private final String department;
        private final double salary;

        public Employee(int id, String name, int age, String gender, String department, double salary) {
            this.id = id;
            this.name = name;
            this.age = age;
            this.gender = gender;
            this.department = department;
            this.salary = salary;
        }

        public int getId() { return id; }
        public String getName() { return name; }
        public int age() { return age; }
        public String getGender() { return gender; }
        public String getDepartment() { return department; }
        public double getSalary() { return salary; }

        @Override
        public String toString() {
            return String.format("[%s, %d y/o, %s, Dept: %s, Salary: $%.0f]",
                    name, age, gender, department, salary);
        }
    }

    public static void main(String[] args) {
        List<Employee> employees = Arrays.asList(
                new Employee(1, "Alice", 28, "Female", "Engineering", 95000),
                new Employee(2, "Bob", 35, "Male", "Engineering", 120000),
                new Employee(3, "Charlie", 42, "Male", "HR", 85000),
                new Employee(4, "Diana", 26, "Female", "Marketing", 70000),
                new Employee(5, "Ethan", 31, "Male", "Finance", 110000),
                new Employee(6, "Fiona", 29, "Female", "Finance", 98000),
                new Employee(7, "George", 45, "Male", "Engineering", 145000),
                new Employee(8, "Hannah", 24, "Female", "HR", 60000)
        );

        System.out.println("================ EMPLOYEE DATASET ================");
        employees.forEach(System.out::println);
        System.out.println("==================================================");

        // 1. Group Employees by Department
        Map<String, List<Employee>> byDept = employees.stream()
                .collect(Collectors.groupingBy(Employee::getDepartment));
        System.out.println("\n1. Group Employees by Department:");
        byDept.forEach((dept, list) -> System.out.println("   " + dept + " -> " + list.stream().map(Employee::getName).toList()));

        // 2. Count Employees in Each Department
        Map<String, Long> countByDept = employees.stream()
                .collect(Collectors.groupingBy(Employee::getDepartment, Collectors.counting()));
        System.out.println("\n2. Count by Department: " + countByDept);

        // 3. Highest Paid Employee in Each Department
        Map<String, Employee> highestPaidByDept = employees.stream()
                .collect(Collectors.groupingBy(
                        Employee::getDepartment,
                        Collectors.collectingAndThen(
                                Collectors.maxBy(Comparator.comparingDouble(Employee::getSalary)),
                                Optional::get
                        )
                ));
        System.out.println("\n3. Highest Paid in each Department:");
        highestPaidByDept.forEach((dept, emp) -> System.out.println("   " + dept + " -> " + emp.getName() + " ($" + emp.getSalary() + ")"));

        // 4. Average Salary by Department
        Map<String, Double> avgSalaryByDept = employees.stream()
                .collect(Collectors.groupingBy(
                        Employee::getDepartment,
                        Collectors.averagingDouble(Employee::getSalary)
                ));
        System.out.println("\n4. Average Salary by Department:");
        avgSalaryByDept.forEach((dept, avg) -> System.out.printf("   %s -> $%.2f%n", dept, avg));

        // 5. Youngest and Oldest Employee
        Employee youngest = employees.stream()
                .min(Comparator.comparingInt(Employee::age))
                .orElse(null);
        Employee oldest = employees.stream()
                .max(Comparator.comparingInt(Employee::age))
                .orElse(null);
        System.out.println("\n5. Youngest: " + (youngest != null ? youngest.getName() + " (" + youngest.age() + ")" : "None"));
        System.out.println("   Oldest:   " + (oldest != null ? oldest.getName() + " (" + oldest.age() + ")" : "None"));

        // 6. Partition by Age (> 30 vs <= 30)
        Map<Boolean, List<Employee>> partitionedByAge = employees.stream()
                .collect(Collectors.partitioningBy(e -> e.age() > 30));
        System.out.println("\n6. Partitioned by Age > 30:");
        System.out.println("   Older than 30: " + partitionedByAge.get(true).stream().map(Employee::getName).toList());
        System.out.println("   30 or younger: " + partitionedByAge.get(false).stream().map(Employee::getName).toList());

        // 7. Joining employee names by comma
        String allNames = employees.stream()
                .map(Employee::getName)
                .collect(Collectors.joining(", ", "[", "]"));
        System.out.println("\n7. All Employee Names: " + allNames);

        // 8. Top 3 Highest Paid Employees
        List<Employee> top3Paid = employees.stream()
                .sorted(Comparator.comparingDouble(Employee::getSalary).reversed())
                .limit(3)
                .toList();
        System.out.println("\n8. Top 3 Highest Paid:");
        top3Paid.forEach(e -> System.out.println("   " + e.getName() + " -> $" + e.getSalary()));

        // 9. 2nd Highest Paid Employee
        Employee secondHighestPaid = employees.stream()
                .sorted(Comparator.comparingDouble(Employee::getSalary).reversed())
                .skip(1)
                .findFirst()
                .orElse(null);
        System.out.println("\n9. Second Highest Paid: " + (secondHighestPaid != null ? secondHighestPaid.getName() + " ($" + secondHighestPaid.getSalary() + ")" : "None"));

        // 10. Summary Statistics on Salary
        DoubleSummaryStatistics stats = employees.stream()
                .collect(Collectors.summarizingDouble(Employee::getSalary));
        System.out.println("\n10. Salary Summary Statistics:");
        System.out.printf("    Count: %d, Sum: $%.0f, Min: $%.0f, Max: $%.0f, Avg: $%.2f%n",
                stats.getCount(), stats.getSum(), stats.getMin(), stats.getMax(), stats.getAverage());
    }
}
