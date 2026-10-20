import java.util.*;

// Flatten an Object (Medium)
// {"a": {"b": 1, "c": {"d": 2}}, "e": [3, 4]} -> {"a.b": 1, "a.c.d": 2, "e.0": 3, "e.1": 4}
//
// Java has no plain JS objects, so nested Map<String, Object> plays that role
// (and List for arrays, flattened with the index as the key).
//
// Technique: depth-first recursion that carries the key path so far as a
// prefix. A leaf value is written under the full path. Each value is visited
// once: O(total keys) time, O(depth) stack.
public class FlattenObject {

    public static Map<String, Object> flatten(Map<String, Object> obj) {
        Map<String, Object> result = new LinkedHashMap<>();
        dfs(obj, "", result);
        return result;
    }

    @SuppressWarnings("unchecked")
    private static void dfs(Object value, String prefix, Map<String, Object> result) {
        if (value instanceof Map) {
            Map<String, Object> map = (Map<String, Object>) value;
            for (Map.Entry<String, Object> e : map.entrySet()) {
                dfs(e.getValue(), join(prefix, e.getKey()), result);
            }
        } else if (value instanceof List) {
            List<Object> list = (List<Object>) value;
            for (int i = 0; i < list.size(); i++) {
                dfs(list.get(i), join(prefix, String.valueOf(i)), result);
            }
        } else {
            result.put(prefix, value);   // leaf: number, string, boolean, null
        }
    }

    private static String join(String prefix, String key) {
        return prefix.isEmpty() ? key : prefix + "." + key;
    }

    public static void main(String[] args) {
        Map<String, Object> c = new LinkedHashMap<>();
        c.put("d", 2);
        Map<String, Object> a = new LinkedHashMap<>();
        a.put("b", 1);
        a.put("c", c);
        Map<String, Object> obj = new LinkedHashMap<>();
        obj.put("a", a);
        obj.put("e", List.of(3, 4));
        obj.put("f", "hi");

        System.out.println(flatten(obj));
    }
}
