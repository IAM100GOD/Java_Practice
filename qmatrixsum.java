import java.util.Arrays;
public class qmatrixsum {
    public static void matrixsum(int[][] queries, int[][] matrix){
        int n = matrix.length;
        int m = matrix[0].length;

        // padded by one row and one column, so index 0 acts as the "nothing" guard
        int[][] prefix = new int[n+1][m+1];
        for(int i=0;i<n;i++){
            for(int j=0;j<m;j++){
                prefix[i+1][j+1] = matrix[i][j]
                                 + prefix[i][j+1]
                                 + prefix[i+1][j]
                                 - prefix[i][j];
            }
        }

        for(int i=0;i<=n;i++){
            for(int j=0;j<=m;j++){
                System.out.printf("%5d", prefix[i][j]);
            }
            System.out.println();
        }

        int sum[] = new int[queries.length];
        for(int q=0;q<queries.length;q++){
            int r1 = queries[q][0], c1 = queries[q][1];
            int r2 = queries[q][2], c2 = queries[q][3];
            sum[q] = prefix[r2+1][c2+1]
                   - prefix[r1][c2+1]
                   - prefix[r2+1][c1]
                   + prefix[r1][c1];
        }
        System.out.println(Arrays.toString(sum));

    }
    public static void main(String[] args) {
        int[][] queries = {{1,1,2,2}, {0,0,3,3}, {2,0,3,1}, {0,2,1,3}};
        int[][] matrix = {{ 1, 2, 3, 4},
                          { 5, 6, 7, 8},
                          { 9,10,11,12},
                          {13,14,15,16}};
        qmatrixsum.matrixsum(queries,matrix);
    }
}
