// Reverse Nodes in k-Group (Hard)
// 1->2->3->4->5, k=2  ->  2->1->4->3->5
// 1->2->3->4->5, k=3  ->  3->2->1->4->5   (leftover < k stays as is)
//
// Technique: iterative, in place, with a dummy head.
//   groupPrev = node just before the group we're about to reverse.
//   1. Walk k steps to find the group's last node (kth). If we run out, stop.
//   2. Reverse the k nodes with the usual prev/curr pointer flip, but start
//      prev at kth.next so the reversed group is already linked to the rest.
//   3. Stitch: groupPrev.next = kth, and the old first node becomes the new groupPrev.
// Each node is touched a constant number of times: O(n) time, O(1) space.
public class ReverseKGroup {

    static class ListNode {
        int val;
        ListNode next;
        ListNode(int val) { this.val = val; }
    }

    public static ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode groupPrev = dummy;

        while (true) {
            ListNode kth = groupPrev;
            for (int i = 0; i < k && kth != null; i++) kth = kth.next;
            if (kth == null) break;                    // fewer than k nodes left

            ListNode groupNext = kth.next;
            ListNode prev = groupNext, curr = groupPrev.next;
            while (curr != groupNext) {
                ListNode tmp = curr.next;
                curr.next = prev;
                prev = curr;
                curr = tmp;
            }

            ListNode oldFirst = groupPrev.next;        // now the group's tail
            groupPrev.next = kth;
            groupPrev = oldFirst;
        }
        return dummy.next;
    }

    static ListNode build(int... vals) {
        ListNode dummy = new ListNode(0), tail = dummy;
        for (int v : vals) { tail.next = new ListNode(v); tail = tail.next; }
        return dummy.next;
    }

    static String show(ListNode head) {
        StringBuilder sb = new StringBuilder();
        for (ListNode n = head; n != null; n = n.next) {
            sb.append(n.val).append(n.next != null ? " -> " : "");
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        System.out.println(show(reverseKGroup(build(1, 2, 3, 4, 5), 2)));
        System.out.println(show(reverseKGroup(build(1, 2, 3, 4, 5), 3)));
        System.out.println(show(reverseKGroup(build(1, 2, 3, 4, 5, 6, 7, 8), 3)));
    }
}
