// First Reverse (Easy)
// "Hello World" -> "dlroW olleH"
//
// Technique: two pointers swapping from both ends toward the middle.
// O(n) time, n/2 swaps, works in place on the char array.
public class FirstReverse {

    public static String firstReverse(String str) {
        char[] chars = str.toCharArray();
        int left = 0, right = chars.length - 1;
        while (left < right) {
            char tmp = chars[left];
            chars[left] = chars[right];
            chars[right] = tmp;
            left++;
            right--;
        }
        return new String(chars);
    }

    public static void main(String[] args) {
        System.out.println(firstReverse("Hello World"));
        System.out.println(firstReverse("coderbyte"));
        System.out.println(firstReverse("I Love Code"));
    }
}
