import java.util.*;

public class NextSmallerElement {
    public static int[] nextSmaller(int[] arr) {
        int n = arr.length;
        int[] result = new int[n];
        // Stack stores elements in increasing order from right
        Stack<Integer> stack = new Stack<>();
        
        // Traverse from right to left
        for (int i = n - 1; i >= 0; i--) {
            while (!stack.isEmpty() && stack.peek() >= arr[i]) {
                stack.pop();
            }
            result[i] = stack.isEmpty() ? -1 : stack.peek();
            stack.push(arr[i]);
        }
        return result;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        
        int[] ans = nextSmaller(arr);
        for (int i = 0; i < n; i++) {
            System.out.print(ans[i] + (i == n - 1 ? "" : " "));
        }
        System.out.println();
        sc.close();
    }
}