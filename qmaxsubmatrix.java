public class qmaxsubmatrix {

    static long rectsChecked = 0;
    static long kadaneSteps  = 0;

    // ---- approach 1: every rectangle, each priced in O(1) off the prefix grid ----
    // O(n^2 * m^2)
    public static int[] byPrefix(int[][] matrix){
        int n = matrix.length, m = matrix[0].length;

        int[][] prefix = new int[n+1][m+1];
        for(int i=0;i<n;i++){
            for(int j=0;j<m;j++){
                prefix[i+1][j+1] = matrix[i][j] + prefix[i][j+1] + prefix[i+1][j] - prefix[i][j];
            }
        }

        int best = Integer.MIN_VALUE;
        int br1=0, bc1=0, br2=0, bc2=0;
        for(int r1=0;r1<n;r1++){
            for(int r2=r1;r2<n;r2++){
                for(int c1=0;c1<m;c1++){
                    for(int c2=c1;c2<m;c2++){
                        rectsChecked++;
                        int sum = prefix[r2+1][c2+1]
                                - prefix[r1][c2+1]
                                - prefix[r2+1][c1]
                                + prefix[r1][c1];
                        if(sum>best){ best=sum; br1=r1; bc1=c1; br2=r2; bc2=c2; }
                    }
                }
            }
        }
        return new int[]{best, br1, bc1, br2, bc2};
    }

    // ---- approach 2: squash a band of rows into one array, then Kadane it ----
    // O(n^2 * m)
    public static int[] byKadane(int[][] matrix){
        int n = matrix.length, m = matrix[0].length;

        int best = Integer.MIN_VALUE;
        int br1=0, bc1=0, br2=0, bc2=0;

        for(int top=0;top<n;top++){
            int[] band = new int[m];
            for(int bottom=top;bottom<n;bottom++){

                for(int c=0;c<m;c++){ band[c] += matrix[bottom][c]; }

                // Kadane across the squashed band, remembering where the run began
                int cur=0, start=0;
                for(int c=0;c<m;c++){
                    kadaneSteps++;
                    if(cur<=0){ cur=band[c]; start=c; }
                    else       { cur+=band[c]; }

                    if(cur>best){ best=cur; br1=top; bc1=start; br2=bottom; bc2=c; }
                }
            }
        }
        return new int[]{best, br1, bc1, br2, bc2};
    }

    public static void show(String label, int[] r, int[][] matrix){
        System.out.println(label+"  sum = "+r[0]
                +"   rows "+r[1]+".."+r[3]+", cols "+r[2]+".."+r[4]);
        for(int i=r[1];i<=r[3];i++){
            System.out.print("        ");
            for(int j=r[2];j<=r[4];j++){ System.out.printf("%5d", matrix[i][j]); }
            System.out.println();
        }
    }

    public static void main(String[] args) {
        int[][] matrix = {{  1,  2, -1, -4, -20},
                          { -8, -3,  4,  2,   1},
                          {  3,  8, 10,  1,   3},
                          { -4, -1,  1,  7,  -6}};

        System.out.println("matrix");
        for(int[] row : matrix){
            System.out.print("        ");
            for(int v : row){ System.out.printf("%5d", v); }
            System.out.println();
        }
        System.out.println();

        show("prefix ", byPrefix(matrix),  matrix);
        System.out.println();
        show("kadane ", byKadane(matrix), matrix);

        System.out.println();
        System.out.println("rectangles priced by prefix : "+rectsChecked);
        System.out.println("inner steps taken by kadane : "+kadaneSteps);
    }
}
