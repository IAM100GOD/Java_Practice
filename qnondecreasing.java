import java.util.Arrays;
public class qnondecreasing {
    public static void nond(int[][] queries, int[] arr){
        int[] violations = new int[arr.length];
        violations[0] = 0;
        for(int i=1;i<arr.length;i++){
            violations[i] = arr[i]<arr[i-1]?violations[i-1]+1:violations[i-1];
        }

        System.out.println(Arrays.toString(violations));
        boolean sorted[] = new boolean[queries.length];
        for(int q=0;q<queries.length;q++){
            sorted[q] = violations[queries[q][1]]-violations[queries[q][0]]==0;
        }
        System.out.println(Arrays.toString(sorted));

    }
    public static void main(String[] args) {
        int[][] queries= {{1,2}, {2,4}};
        int[] arr= {1,4,4,7,6,8,2,10,20,21};
        qnondecreasing.nond(queries,arr);
    }
}
