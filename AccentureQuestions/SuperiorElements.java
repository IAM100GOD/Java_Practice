// Superior / Leader Elements in Array (Accenture)
// ★ High Frequency | Easy | Array Traversals
// An element is a Superior Element (Leader) if it is strictly greater than all elements to its right.
// The rightmost element is always a superior element. List the superior elements.
//
// Sample Test Case
// Input: arr = [16, 17, 4, 3, 5, 2]
// Output: 17 5 2

import java.util.*;

public class SuperiorElements {
    // Scan from the right, keeping the maximum seen so far: O(n) time
    public static List<Integer> superiorElements(int[] arr) {
        List<Integer> leaders = new ArrayList<>();
        int n = arr.length;
        if (n == 0) return leaders;

        int maxRight = arr[n - 1];
        leaders.add(maxRight);              // rightmost is always a leader

        for (int i = n - 2; i >= 0; i--) {
            if (arr[i] > maxRight) {        // strictly greater than everything to its right
                maxRight = arr[i];
                leaders.add(arr[i]);
            }
        }

        Collections.reverse(leaders);       // restore left-to-right order
        return leaders;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();

        List<Integer> res = superiorElements(arr);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < res.size(); i++) {
            sb.append(res.get(i));
            if (i < res.size() - 1) sb.append(' ');
        }
        System.out.println(sb);
        sc.close();
    }
}
