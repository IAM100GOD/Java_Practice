/* 9. Flatten an Object */
P.push({
  id: 'flatten-object', title: 'Flatten an Object', level: 'medium', file: 'FlattenObject.java',
  statement: 'Turn a deeply nested object into a flat one with dot-notation keys: <code>{"a": {"b": 1}}</code> becomes <code>{"a.b": 1}</code>. Array items use their index as the key.',
  technique: 'DFS recursion carrying a key prefix', time: 'O(total keys × key length)', space: 'O(depth) call stack',
  inputs: [{ key: 'json', label: 'object (JSON)', def: '{"a": {"b": 1, "c": {"d": 2}}, "e": [3, 4], "f": "hi"}', area: true }],
  samples: [['{"a": {"b": 1, "c": {"d": 2}}, "e": [3, 4], "f": "hi"}'], ['{"user": {"name": "Ana", "address": {"city": "Pune", "zip": 411001}}, "active": true}'], ['{"a": {"b": {"c": {"d": 1}}}}']],
  code: "public static Map<String, Object> flatten(Map<String, Object> obj) {\n    Map<String, Object> result = new LinkedHashMap<>();\n    dfs(obj, \"\", result);\n    return result; @ret\n}\n\nprivate static void dfs(Object value, String prefix, Map<String, Object> result) {\n    if (value instanceof Map) { @map\n        Map<String, Object> map = (Map<String, Object>) value;\n        for (Map.Entry<String, Object> e : map.entrySet()) {\n            dfs(e.getValue(), join(prefix, e.getKey()), result);\n        }\n    } else if (value instanceof List) { @list\n        List<Object> list = (List<Object>) value;\n        for (int i = 0; i < list.size(); i++) {\n            dfs(list.get(i), join(prefix, String.valueOf(i)), result);\n        }\n    } else {\n        result.put(prefix, value);   // leaf: number, string, boolean, null @leaf\n    }\n}\n\nprivate static String join(String prefix, String key) {\n    return prefix.isEmpty() ? key : prefix + \".\" + key;\n}",
  steps: [
    'Call <code>dfs(root, "")</code>. The prefix holds the path of keys from the root to where you are now.',
    'For an object, call <code>dfs</code> on each value, adding its key to the prefix (<code>"a"</code> → <code>"a.c"</code>).',
    'For an array, do the same, using the index as the key (<code>"e.0"</code>, <code>"e.1"</code>).',
    'For anything else (a number, string, boolean or null), you have reached a leaf. Store it under the full prefix.',
    'The call stack keeps track of where to return to, so no extra bookkeeping is needed.'
  ],
  cmp: [['Repeatedly scan the result for nested values and expand them', 'O(n · depth) or worse', 'copies'], ['Single DFS with a prefix', 'O(n)', 'O(depth)']],
  eff: 'Every value is visited once, and its full key is built only when needed. LinkedHashMap keeps the keys in the order they appeared. For very deep input you can avoid stack overflow by using an explicit stack of (value, prefix) pairs.',
  run({ json }) {
    let obj; try { obj = JSON.parse(json); } catch (e) { throw new Error('That is not valid JSON: ' + e.message); }
    if (obj === null || typeof obj !== 'object') throw new Error('The top level must be an object or array.');
    const lines = []; const fmt = v => typeof v === 'string' ? `"${v}"` : String(v);
    const walk = (v, key, path, depth, comma) => {
      const pre = '  '.repeat(depth) + (key != null ? `${/^\d+$/.test(key) && Array.isArray(walk.parent) ? '' : `"${key}": `}` : '');
      if (v !== null && typeof v === 'object') {
        const arr = Array.isArray(v), ks = Object.keys(v);
        lines.push({ t: pre + (arr ? '[' : '{'), p: path });
        ks.forEach((k, i) => { walk.parent = v; walk(v[k], k, path === '' ? k : path + '.' + k, depth + 1, i < ks.length - 1); });
        lines.push({ t: '  '.repeat(depth) + (arr ? ']' : '}') + (comma ? ',' : ''), p: path, close: true });
      } else lines.push({ t: pre + fmt(v) + (comma ? ',' : ''), p: path, leaf: true });
    };
    walk(obj, null, '', 0, false);
    const F = []; const res = []; const stack = [];
    const st = cur => ({ lines, cur, stack: [...stack], res: clone(res), done: res.map(r => r[0]) });
    const dfs = (v, prefix) => {
      stack.push(prefix);
      const V = { prefix: q(prefix), value: v !== null && typeof v === 'object' ? (Array.isArray(v) ? `List(${v.length})` : `Map{${Object.keys(v).join(', ')}}`) : fmt(v), depth: stack.length };
      if (v !== null && typeof v === 'object') {
        const arr = Array.isArray(v); const ks = Object.keys(v);
        F.push({ line: arr ? 'list' : 'map', msg: prefix === '' ? `The root is ${arr ? 'an array' : 'an object'} with ${ks.length} entries. Recurse into each one.` : `"${prefix}" holds ${arr ? `an array of ${ks.length}` : `an object with keys ${ks.join(', ')}`}. Go deeper, adding each ${arr ? 'index' : 'key'} to the prefix.`, vars: V, st: st(prefix) });
        ks.forEach(k => dfs(v[k], prefix === '' ? k : prefix + '.' + k));
      } else {
        res.push([prefix, fmt(v)]);
        F.push({ line: 'leaf', msg: `Leaf ${fmt(v)}. result.put("${prefix}", ${fmt(v)}).`, vars: V, st: st(prefix) });
      }
      stack.pop();
    };
    dfs(obj, '');
    F.push({ line: 'ret', msg: `Done. ${res.length} flat keys.`, vars: { 'result.size()': res.length }, st: st(null), result: `{${res.map(r => `"${r[0]}": ${r[1]}`).join(', ')}}` });
    return F;
  },
  render(st) {
    const anc = p => st.stack.includes(p);
    const j = st.lines.map(l => `<div class="jl ${l.p === st.cur && !l.close ? 'cur' : l.leaf && st.done.includes(l.p) ? 'done' : anc(l.p) && l.p !== st.cur ? 'anc' : ''}">${esc(l.t)}${l.leaf && st.done.includes(l.p) && l.p !== st.cur ? '  ✓' : ''}</div>`).join('');
    const stk = st.stack.length ? `<div class="stack">${st.stack.map(p => `<div>dfs(…, ${esc(q(p))})</div>`).join('')}</div>` : '<span class="empty">empty</span>';
    const tbl = st.res.length ? `<table class="maptbl"><tr><th>key</th><th>value</th></tr>${st.res.map((r, i) => `<tr class="${i === st.res.length - 1 && st.cur === r[0] ? 'on' : ''}"><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('')}</table>` : '<span class="empty">empty</span>';
    return block('input', `<div class="jbox">${j}</div>`) + `<div class="row2">${block('call stack (top = current)', stk)}${block('result', tbl)}</div>`;
  }
});
