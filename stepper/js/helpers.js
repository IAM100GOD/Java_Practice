/* ---------- helpers ---------- */
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const vis = ch => ch === ' ' ? '␣' : ch;
const q = v => typeof v === 'string' ? `"${v}"` : String(v);
const inf = v => v === -Infinity ? '−∞' : v === Infinity ? '+∞' : String(v);
const clone = o => JSON.parse(JSON.stringify(o));

function cells(items, o = {}) {
  let h = '<div class="scroll"><div class="cells">';
  items.forEach((v, i) => {
    const top = (o.top ? o.top(i) : []).map(([l, c]) => `<span class="ptr ${c}">${esc(l)}</span>`).join('');
    const bot = (o.bot ? o.bot(i) : []).map(([l, c]) => `<span class="ptr ${c}">${esc(l)}</span>`).join('');
    h += `<div class="cw">${o.noTop ? '' : `<div class="ptrs">${top}</div>`}<div class="cell ${o.wide ? 'wide ' : ''}${o.cls ? o.cls(i) : ''}">${esc(vis(String(v)))}</div>${o.idx === false ? '' : `<div class="ix">${i}</div>`}${o.bot ? `<div class="ptrs bot">${bot}</div>` : ''}</div>`;
  });
  return h + '</div></div>';
}
const block = (label, inner) => `<div><div class="lbl">${label}</div>${inner}</div>`;
const tokens = (arr, cls = () => '') => arr.length ? `<div class="chips">${arr.map((t, i) => `<span class="tok ${cls(i)}">${esc(t)}</span>`).join('')}</div>` : '<span class="empty">empty</span>';

/* tidy tree layout (works for any forest; tolerates cycles) */
function layoutForest(nodes, kids) {
  const hasParent = new Set();
  for (const k of Object.keys(kids)) kids[k].forEach(c => hasParent.add(String(c)));
  const pos = {}, seen = new Set(); let slot = 0, maxD = 0;
  function place(n, d) {
    n = String(n); if (seen.has(n)) return; seen.add(n); maxD = Math.max(maxD, d);
    const cs = (kids[n] || []).map(String).filter(c => !seen.has(c));
    const xs = [];
    cs.forEach(c => { place(c, d + 1); if (pos[c]) xs.push(pos[c].x); });
    pos[n] = { x: xs.length ? (Math.min(...xs) + Math.max(...xs)) / 2 : slot++, d };
  }
  nodes.map(String).filter(n => !hasParent.has(n)).forEach(r => place(r, 0));
  nodes.forEach(n => place(n, 0));
  return { pos, slots: Math.max(slot, 1), maxD };
}

/* light Java highlighter */
function hlJava(line) {
  const re = /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+\b)|\b(public|private|static|int|char|boolean|long|void|new|return|if|else|for|while|true|false|null|String|Object|Map|List|Integer|ListNode|Node|instanceof|break|StringBuilder|Long|ArrayList)\b/g;
  let out = '', last = 0, m;
  while ((m = re.exec(line))) {
    out += esc(line.slice(last, m.index));
    const cls = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'n' : 'k';
    out += `<span class="tk-${cls}">${esc(m[0])}</span>`;
    last = m.index + m[0].length;
  }
  return out + esc(line.slice(last));
}

/* reusable: draw a recursion call stack. frames: [{call, detail, state: 'waiting'|'active'|'done', value}] (first = outermost) */
function callStackView(frames, title = 'call stack (top = most recent call)') {
  if (!frames.length) return block(title, '<span class="empty">empty</span>');
  const rows = [...frames].reverse().map(f => {
    const col = f.state === 'active' ? 'var(--p2)' : f.state === 'done' ? 'var(--ok)' : 'var(--line)';
    const bg = f.state === 'active' ? 'var(--p2-soft)' : f.state === 'done' ? 'var(--ok-soft)' : 'var(--surface)';
    return `<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;border:1.5px solid ${col};background:${bg};border-radius:6px;padding:5px 10px;font-family:var(--f-mono);font-size:.8rem">
      <span style="min-width:0;overflow-wrap:anywhere"><b>${esc(f.call)}</b>${f.detail ? ` <span style="color:var(--muted)">${esc(f.detail)}</span>` : ''}</span>
      <span style="white-space:nowrap;font-weight:600;color:${f.state === 'done' ? 'var(--ok)' : 'var(--muted)'}">${f.state === 'done' ? '= ' + esc(String(f.value)) : f.state === 'active' ? 'running' : 'waiting'}</span></div>`;
  }).join('');
  return block(title, `<div style="display:flex;flex-direction:column;gap:4px;max-width:520px">${rows}</div>`);
}

/* ---------- problem registry: every file under problems/ calls P.push({...}) ---------- */
const P = [];
