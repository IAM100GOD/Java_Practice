import java.util.*;

// Accounts Merge (Medium)
// [["John","a@x","b@x"], ["John","c@x"], ["John","b@x","d@x"], ["Mary","m@x"]]
//   -> [["John","a@x","b@x","d@x"], ["John","c@x"], ["Mary","m@x"]]
//
// Technique: Union-Find (Disjoint Set Union) over emails.
//   1. Give every email an id. Union every email in an account with the
//      account's first email.
//   2. Emails that end up with the same root belong to one person.
// Path compression + union by rank make each operation nearly O(1);
// overall O(E log E) because of the final sort of each email list.
public class AccountsMerge {

    static int[] parent, rank;

    static int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);   // path compression
        return parent[x];
    }

    static void union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return;
        if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;                                    // attach shorter tree under taller
        if (rank[ra] == rank[rb]) rank[ra]++;
    }

    public static List<List<String>> accountsMerge(List<List<String>> accounts) {
        Map<String, Integer> idOf = new HashMap<>();
        Map<String, String> nameOf = new HashMap<>();
        for (List<String> acc : accounts) {
            for (int i = 1; i < acc.size(); i++) {
                idOf.putIfAbsent(acc.get(i), idOf.size());
                nameOf.put(acc.get(i), acc.get(0));
            }
        }

        parent = new int[idOf.size()];
        rank = new int[idOf.size()];
        for (int i = 0; i < parent.length; i++) parent[i] = i;

        for (List<String> acc : accounts) {
            int first = idOf.get(acc.get(1));
            for (int i = 2; i < acc.size(); i++) {
                union(first, idOf.get(acc.get(i)));
            }
        }

        Map<Integer, List<String>> groups = new LinkedHashMap<>();
        for (String email : idOf.keySet()) {
            groups.computeIfAbsent(find(idOf.get(email)), k -> new ArrayList<>()).add(email);
        }

        List<List<String>> result = new ArrayList<>();
        for (List<String> emails : groups.values()) {
            Collections.sort(emails);
            List<String> merged = new ArrayList<>();
            merged.add(nameOf.get(emails.get(0)));
            merged.addAll(emails);
            result.add(merged);
        }
        return result;
    }

    public static void main(String[] args) {
        List<List<String>> accounts = List.of(
                List.of("John", "johnsmith@mail.com", "john_newyork@mail.com"),
                List.of("John", "johnsmith@mail.com", "john00@mail.com"),
                List.of("Mary", "mary@mail.com"),
                List.of("John", "johnnybravo@mail.com"));
        for (List<String> acc : accountsMerge(accounts)) {
            System.out.println(acc);
        }
    }
}
