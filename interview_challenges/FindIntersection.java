// Find Intersection (Easy)
// {"1, 3, 4, 7, 13", "1, 2, 4, 13, 15"} -> "1,4,13"   (or "false" if none)
//
// Technique: both lists are already sorted, so walk them with two pointers
// (the merge step of merge sort). Always advance the pointer at the smaller
// value. O(n + m) time, no HashSet needed.
public class FindIntersection {

    public static String findIntersection(String[] strArr) {
        String[] a = strArr[0].split(",\\s*");
        String[] b = strArr[1].split(",\\s*");
        int i = 0, j = 0;
        StringBuilder result = new StringBuilder();

        while (i < a.length && j < b.length) {
            int x = Integer.parseInt(a[i]);
            int y = Integer.parseInt(b[j]);
            if (x == y) {
                if (result.length() > 0) result.append(',');
                result.append(x);
                i++;
                j++;
            } else if (x < y) {
                i++;             // x can't appear later in b, skip it
            } else {
                j++;             // y can't appear later in a, skip it
            }
        }
        return result.length() == 0 ? "false" : result.toString();
    }

    public static void main(String[] args) {
        System.out.println(findIntersection(new String[]{"1, 3, 4, 7, 13", "1, 2, 4, 13, 15"}));
        System.out.println(findIntersection(new String[]{"1, 3, 9, 10, 17, 18", "1, 4, 9, 10"}));
        System.out.println(findIntersection(new String[]{"2, 4", "1, 3"}));
    }
}
