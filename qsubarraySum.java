import java.util.Arrays;
public class qsubarraySum{

    public static void arraysum(int[][] queries, int[] arr){
        int[] prefixsum = new int[arr.length];
        prefixsum[0]=arr[0];
        for(int i=1;i<arr.length;i++){
            prefixsum[i]=prefixsum[i-1]+arr[i];
        }

        System.out.println(Arrays.toString(prefixsum));
        int sum[] = new int[queries.length];
        for(int q=0;q<queries.length;q++){
            sum[q] = prefixsum[queries[q][1]]-prefixsum[queries[q][0]];
        }
        System.out.println(Arrays.toString(sum));

    }

    public static void main(String[] args){
        int[][] queries= {{1,2}, {2,4}};
        int[] arr= {1,2,3,4,5};
        qsubarraySum.arraysum(queries,arr);
    }
}
