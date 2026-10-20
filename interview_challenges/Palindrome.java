// Palindrome (Easy)
// "A man, a plan, a canal: Panama" -> true (ignore case, spaces, punctuation)
//
// Technique: two pointers that skip non-alphanumeric characters.
// No cleaned copy of the string is built: O(n) time, O(1) extra space.
public class Palindrome {

    public static boolean isPalindrome(String s) {
        int left = 0, right = s.length() - 1;
        while (left < right) {
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;
            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("A man, a plan, a canal: Panama"));
        System.out.println(isPalindrome("never odd or even"));
        System.out.println(isPalindrome("race a car"));
    }
}
