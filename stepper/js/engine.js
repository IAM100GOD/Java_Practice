/* ---------- engine ---------- */
P.forEach(p => {
  p.lines = []; p.lineMap = {};
  p.code.split('\n').forEach((l, i) => { const m = l.match(/\s*@(\w+)\s*$/); if (m) { p.lineMap[m[1]] = i; l = l.slice(0, m.index); } p.lines.push(l); });
});
const $ = id => document.getElementById(id);
let cur = null, frames = [], idx = 0, timer = null;

const lvName = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
const tree = { kids: {}, items: [] };
P.forEach(p => {
  const segs = (p.dir || 'interview_challenges').split('/');
  if (!p.dir) segs.push(lvName[p.level] || p.level);
  let node = tree; segs.forEach(sg => { node = node.kids[sg] = node.kids[sg] || { kids: {}, items: [] }; }); node.items.push(p);
});
const countOf = n => n.items.length + Object.values(n.kids).reduce((a, k) => a + countOf(k), 0);
const renderTree = (n, path) => Object.entries(n.kids).map(([name, k]) => {
  const pth = path ? `${path}/${name}` : name;
  const items = k.items.length ? `<ul>${k.items.map(p => `<li><button type="button" data-id="${p.id}"><i class="lv-${p.level}"></i>${p.title}</button></li>`).join('')}</ul>` : '';
  const sub = Object.keys(k.kids).length ? `<div class="sub">${renderTree(k, pth)}</div>` : '';
  return `<details data-path="${pth}"><summary><span class="ico">📁</span>${name}<span class="cnt">${countOf(k)}</span></summary>${sub}${items}</details>`;
}).join('');
$('nav').innerHTML = renderTree(tree, '');
$('nav').addEventListener('click', e => { const b = e.target.closest('button[data-id]'); if (b) load(b.dataset.id, true); });

function load(id, push) {
  const p = P.find(x => x.id === id) || P[0]; cur = p; stop();
  document.querySelectorAll('nav button').forEach(b => { const on = b.dataset.id === p.id; b.setAttribute('aria-current', on); if (on) { for (let d = b.closest('details'); d; d = d.parentElement.closest('details')) d.open = true; } });
  $('ptitle').textContent = p.title; $('plevel').textContent = p.level[0].toUpperCase() + p.level.slice(1); $('plevel').className = 'pill ' + p.level;
  $('pstate').innerHTML = p.statement;
  $('pmeta').innerHTML = `<span class="tag">technique <b>${esc(p.technique)}</b></span><span class="tag">time <b>${esc(p.time)}</b></span><span class="tag">space <b>${esc(p.space)}</b></span>`;
  $('fileName').textContent = p.file; $('codeNote').textContent = 'exact code from ' + p.file;
  $('code').innerHTML = p.lines.map((l, i) => `<span class="ln" data-i="${i}"><span class="no">${i + 1}</span>${hlJava(l)}</span>`).join('');
  $('steps').innerHTML = p.steps.map(s => `<li>${s}</li>`).join('');
  $('cmp').innerHTML = `<tr><th>Approach</th><th>Time</th><th>Space</th></tr>` + p.cmp.map((r, i) => `<tr class="${i === p.cmp.length - 1 ? 'win' : ''}"><td>${r[0]}</td><td class="o">${r[1]}</td><td class="o">${r[2]}</td></tr>`).join('');
  $('eff').innerHTML = p.eff;
  const cls = p.file.replace('.java', '');
  $('runline').textContent = `Run it: cd ${p.dir || 'interview_challenges'} && javac ${p.file} && java ${cls}`;
  const f = $('pin');
  f.innerHTML = p.inputs.map(inp => `<div class="field ${inp.narrow ? 'narrow' : ''}"><label for="in-${p.id}-${inp.key}">${esc(inp.label)}</label>${inp.area ? `<textarea id="in-${p.id}-${inp.key}" rows="${inp.key === 'acc' ? 5 : 2}" spellcheck="false">${esc(inp.def)}</textarea>` : `<input id="in-${p.id}-${inp.key}" value="${esc(inp.def)}" spellcheck="false">`}</div>`).join('')
    + `<button class="btn" type="submit">Run</button><div class="samples"><span>Samples:</span>${p.samples.map((s, i) => `<button type="button" class="chip" data-s="${i}" title="${esc(s.join('  |  '))}">${esc(s.join(' | ').replace(/\n/g, ' / ').slice(0, 42))}${s.join(' | ').length > 42 ? '…' : ''}</button>`).join('')}</div><div class="err" id="err" hidden></div>`;
  if (push) { try { history.replaceState(null, '', '#' + p.id); } catch (e) {} }
  try { localStorage.setItem('stepper-last', p.id); } catch (e) {}
  execute();
}
$('pin').addEventListener('submit', e => { e.preventDefault(); execute(); });
$('pin').addEventListener('click', e => {
  const c = e.target.closest('.chip'); if (!c) return;
  const s = cur.samples[+c.dataset.s]; cur.inputs.forEach((inp, i) => { $(`in-${cur.id}-${inp.key}`).value = s[i]; }); execute();
});
function execute() {
  stop(); const vals = {}; cur.inputs.forEach(inp => vals[inp.key] = $(`in-${cur.id}-${inp.key}`).value);
  const err = $('err');
  try { const fr = cur.run(vals); if (fr.length > 900) throw new Error('That input makes too many steps to show. Try a shorter one.'); frames = fr; err.hidden = true; }
  catch (e) { err.textContent = e.message; err.hidden = false; return; }
  idx = 0; $('scrub').max = frames.length - 1; draw();
}
function draw() {
  const f = frames[idx], prev = frames[idx - 1];
  $('viz').innerHTML = cur.render(f.st) + (f.stack ? `<div><div class="lbl">call stack (top = current)</div><div class="stack">${f.stack.split('\n').reverse().map(s => `<div>${esc(s)}</div>`).join('')}</div></div>` : '');
  $('msg').innerHTML = esc(f.msg) + (f.result != null ? ` <span>Result:</span><span class="result ${f.bad ? 'badr' : 'good'}">${esc(f.result)}</span>` : '');
  $('stepno').textContent = `${idx + 1} / ${frames.length}`;
  $('scrub').value = idx;
  const li = cur.lineMap[f.line];
  document.querySelectorAll('#code .ln').forEach(el => el.classList.toggle('on', +el.dataset.i === li));
  const on = document.querySelector('#code .ln.on'); if (on) { const pre = $('code'); const top = on.offsetTop - pre.offsetTop; if (top < pre.scrollTop || top > pre.scrollTop + pre.clientHeight - 30) pre.scrollTop = top - 40; }
  $('vars').innerHTML = Object.entries(f.vars || {}).map(([k, v]) => `<dt>${esc(k)}</dt><dd class="${prev && prev.vars && String(prev.vars[k]) !== String(v) ? 'chg' : ''}">${esc(String(v))}</dd>`).join('') || '<dt>—</dt><dd></dd>';
  $('bPrev').disabled = idx === 0; $('bFirst').disabled = idx === 0;
  $('bNext').disabled = idx === frames.length - 1; $('bLast').disabled = idx === frames.length - 1;
}
const go = i => { idx = Math.max(0, Math.min(frames.length - 1, i)); draw(); };
function setPlayIcon(playing) { $('playIco').innerHTML = playing ? '<path d="M3 2h4v12H3zM9 2h4v12H9z"/>' : '<path d="M4 2v12l10-6z"/>'; $('bPlay').setAttribute('aria-label', playing ? 'Pause' : 'Play'); }
function stop() { clearInterval(timer); timer = null; setPlayIcon(false); }
function play() {
  if (timer) return stop();
  if (idx >= frames.length - 1) idx = 0;
  setPlayIcon(true); draw();
  timer = setInterval(() => { if (idx >= frames.length - 1) return stop(); go(idx + 1); }, +$('speed').value);
}
$('bPlay').onclick = play; $('bPrev').onclick = () => { stop(); go(idx - 1); }; $('bNext').onclick = () => { stop(); go(idx + 1); };
$('bFirst').onclick = () => { stop(); go(0); }; $('bLast').onclick = () => { stop(); go(frames.length - 1); };
let copyTimer = null;
function copyFallback(text) {
  const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
  ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
  let ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
  ta.remove();
  if (!ok) { const r = document.createRange(); r.selectNodeContents($('code')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
  return ok;
}
$('copyCode').onclick = async () => {
  const text = cur.lines.join('\n') + '\n';
  let ok = false;
  try { await navigator.clipboard.writeText(text); ok = true; } catch (e) { ok = copyFallback(text); }
  const b = $('copyCode');
  $('copyLabel').textContent = ok ? 'Copied' : 'Selected, press Ctrl+C';
  b.classList.toggle('done', ok);
  clearTimeout(copyTimer);
  copyTimer = setTimeout(() => { $('copyLabel').textContent = 'Copy'; b.classList.remove('done'); }, 1800);
};
$('scrub').oninput = e => { stop(); go(+e.target.value); };
$('speed').onchange = () => { if (timer) { stop(); play(); } };
document.addEventListener('keydown', e => {
  if (e.target.closest('input:not([type=range]),textarea,select')) return;
  if (e.key === 'ArrowRight') { e.preventDefault(); stop(); go(idx + 1); }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); stop(); go(idx - 1); }
  else if (e.key === ' ' && !e.target.closest('button')) { e.preventDefault(); play(); }
  else if (e.key === 'Home') { stop(); go(0); } else if (e.key === 'End') { stop(); go(frames.length - 1); }
});

let start = (location.hash || '').slice(1);
if (!P.some(p => p.id === start)) { try { start = localStorage.getItem('stepper-last') || ''; } catch (e) { start = ''; } }
load(P.some(p => p.id === start) ? start : P[0].id, false);
