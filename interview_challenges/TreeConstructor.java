import java.util.*;

// Tree Constructor / Valid BST (Medium)
//
// Part 1: {"(1,2)", "(2,4)", "(5,7)", "(7,2)", "(9,5)"} -> true
//   Each pair is (child,parent). It's a valid binary tree when:
//     1. no child has two parents
//     2. no parent has more than two children
//     3. exactly one node is never a child (the root)
//     4. every node is reachable from that root (rules 1-3 alone miss a
//        detached cycle such as (3,4),(4,3))
//   Technique: hash maps for in-degree / out-degree, then one BFS.
//   O(n) time.
//
// Part 2: is a binary tree a valid BST?
//   Technique: pass down an allowed (min, max) range. Every left move
//   tightens max, every right move tightens min. O(n) time, O(h) stack.
public class TreeConstructor {

    public static boolean treeConstructor(String[] strArr) {
        Map<Integer, Integer> parentOf = new HashMap<>();
        Map<Integer, List<Integer>> children = new HashMap<>();
        Set<Integer> nodes = new HashSet<>();

        for (String pair : strArr) {
            String[] parts = pair.replaceAll("[()\\s]", "").split(",");
            int child = Integer.parseInt(parts[0]);
            int parent = Integer.parseInt(parts[1]);
            nodes.add(child);
            nodes.add(parent);

            if (parentOf.containsKey(child)) return false;          // rule 1
            parentOf.put(child, parent);

            List<Integer> kids = children.computeIfAbsent(parent, k -> new ArrayList<>());
            kids.add(child);
            if (kids.size() > 2) return false;                      // rule 2
        }

        Integer root = null;
        for (int n : nodes) {
            if (!parentOf.containsKey(n)) {
                if (root != null) return false;                     // rule 3: two roots
                root = n;
            }
        }
        if (root == null) return false;                             // rule 3: no root (cycle)

        Set<Integer> seen = new HashSet<>();                        // rule 4
        Deque<Integer> queue = new ArrayDeque<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            int n = queue.poll();
            seen.add(n);
            queue.addAll(children.getOrDefault(n, List.of()));
        }
        return seen.size() == nodes.size();
    }

    static class Node {
        int val;
        Node left, right;
        Node(int val) { this.val = val; }
        Node(int val, Node left, Node right) { this.val = val; this.left = left; this.right = right; }
    }

    public static boolean isValidBST(Node root) {
        return isValidBST(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }

    private static boolean isValidBST(Node node, long min, long max) {
        if (node == null) return true;
        if (node.val <= min || node.val >= max) return false;
        return isValidBST(node.left, min, node.val)
            && isValidBST(node.right, node.val, max);
    }

    public static void main(String[] args) {
        System.out.println(treeConstructor(new String[]{"(1,2)", "(2,4)", "(5,7)", "(7,2)", "(9,5)"}));
        System.out.println(treeConstructor(new String[]{"(1,2)", "(3,2)", "(2,12)", "(5,2)"}));
        System.out.println(treeConstructor(new String[]{"(2,1)", "(3,4)", "(4,3)"}));

        //        8
        //      /   \
        //     3     10
        //    / \      \
        //   1   6      14
        Node good = new Node(8,
                new Node(3, new Node(1), new Node(6)),
                new Node(10, null, new Node(14)));
        //        8
        //      /   \
        //     3     10
        //      \
        //       9     <- 9 is in the left subtree of 8, so it must be < 8
        Node bad = new Node(8,
                new Node(3, null, new Node(9)),
                new Node(10));
        System.out.println(isValidBST(good));
        System.out.println(isValidBST(bad));
    }
}
