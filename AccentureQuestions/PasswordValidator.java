// Password Validator (Accenture)
// Write a method checkPassword(String str, int n) to validate a password against Accenture's policy:
// 1. Minimum length is 4 characters.
// 2. Must contain at least one numeric digit (0-9).
// 3. Must contain at least one capital letter (A-Z).
// 4. Must NOT contain any space (' ') or slash ('/').
// 5. Starting character must NOT be a number.
// Return 1 if valid, otherwise return 0.

import java.util.Scanner;

public class PasswordValidator {
    public static int checkPassword(String str, int n) {
        // Rule 1: Length check
        if (str == null || n < 4) return 0;
        
        // Rule 5: Starting character must not be a digit
        if (Character.isDigit(str.charAt(0))) return 0;
        
        boolean hasDigit = false;
        boolean hasCapital = false;
        
        for (int i = 0; i < n; i++) {
            char ch = str.charAt(i);
            
            // Rule 4: No space or slash
            if (ch == ' ' || ch == '/') return 0;
            
            // Rule 2 & 3: Check digit and capital letter
            if (Character.isDigit(ch)) hasDigit = true;
            if (Character.isUpperCase(ch)) hasCapital = true;
        }
        
        return (hasDigit && hasCapital) ? 1 : 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        System.out.println(checkPassword(s, s.length()));
        sc.close();
    }
}
