// Binary String Operations (Accenture)
// Given a string of binary digits separated by operator characters:
// 'A' = bitwise AND, 'B' = bitwise OR, 'C' = bitwise XOR.
// Evaluate left to right and return the final single binary digit (0 or 1).
// Return -1 if string is null.
//
// Sample Test Case
// Input: "1C0C1C1A0B1"
// Step 1: 1 XOR 0 = 1
// Step 2: 1 XOR 1 = 0
// Step 3: 0 XOR 1 = 1
// Step 4: 1 AND 0 = 0
// Step 5: 0 OR 1 = 1
// Output: 1

import java.util.Scanner;

public class BinaryStringOperations {
    public static int operationsBinaryString(String str) {
        if (str == null || str.length() == 0) return -1;
        
        // Initial value is the first digit
        int res = str.charAt(0) - '0';
        
        // Characters alternate: op at odd index, digit at even index
        for (int i = 1; i < str.length(); i += 2) {
            char op = str.charAt(i);
            int nextVal = str.charAt(i + 1) - '0';
            
            if (op == 'A') {
                res = res & nextVal;
            } else if (op == 'B') {
                res = res | nextVal;
            } else if (op == 'C') {
                res = res ^ nextVal;
            }
        }
        return res;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().trim();
        System.out.println(operationsBinaryString(s));
        sc.close();
    }
}
