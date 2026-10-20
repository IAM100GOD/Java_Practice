// Minimum CPU Cores / Interval Scheduling
// ★ High Frequency
// Medium
// Intervals / Sorting
// You are given lists of process start times and end times. 
// Find the minimum number of CPU cores required so that no two overlapping processes 
// run on the same core simultaneously.

// Sample Test Case 1
// Input: start = [1, 3, 5], end = [2, 6, 8]
// Output: 1
// Explanation: Process 1 finishes at 2 before process 2 starts at 3. No overlap.

// Sample Test Case 2
// Input: start = [900, 940, 950, 1100], end = [910, 1200, 1120, 1130]
// Output: 3

import java.util.Arrays;

public class MinCoresRequired {
    
    public static int minCores(int[] start, int[] end) {
        // 1. Sort both arrays to track chronological events
        Arrays.sort(start);
        Arrays.sort(end);
        
        int maxCores = 0;
        int currentCores = 0;
        
        int startPointer = 0;
        int endPointer = 0;
        int n = start.length;
        
        // 2. Two-pointer approach to track active tasks
        while (startPointer < n) {
            // If a task starts before the oldest active task ends, we need a new core
            if (start[startPointer] < end[endPointer]) {
                currentCores++;
                startPointer++;
            } else { 
                // A task finished, freeing up a core
                currentCores--;
                endPointer++;
            }
            maxCores = Math.max(maxCores, currentCores);
        }
        
        return maxCores;
    }
    
    public static void main(String[] args) {
        int[] start = {1, 3, 5, 4};
        int[] end  = {2, 6, 8, 9};

        System.out.println("min cores required = " + minCores(start, end)); 
        // Output: min cores required = 3
    }
}