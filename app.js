/* ─────────────────────────────────────────────────────────────
   ScoutQuest HIVE — app
   ───────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  const $  = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const BASE_URLS = {
    staging: 'http://scoutquest-backend-service-staging.fundsmap.com',
    production: 'http://scoutquest-backend-service-production.fundsmap.com'
  };

  const state = {
    env: localStorage.getItem('sqh.env') || 'staging',
    apiKey: localStorage.getItem('sqh.apiKey') || '',
    quickstartLang: 'curl',
    activeType: 'BLOCK_DEAL'
  };

  /* Background is pure CSS now — grid + subtle accent glow. */

  /* ─────────────────────────────────────────────
     Counter animations (hero metrics)
     ───────────────────────────────────────────── */
  function initCounters() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const end = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const dur = 1400;
        const start = performance.now();
        function tick(now) {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          const val = end * eased;
          const display = end >= 100 ? Math.floor(val) : val.toFixed(1);
          el.textContent = (end >= 100 ? Math.floor(val).toLocaleString() : display) + suffix;
          if (t < 1) requestAnimationFrame(tick);
          else el.textContent = (end >= 100 ? Math.floor(end).toLocaleString() : end) + suffix;
        }
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    }, { threshold: 0.35 });
    $$('.metric__val').forEach(el => obs.observe(el));
  }

  /* ─────────────────────────────────────────────
     Reveal on scroll
     ───────────────────────────────────────────── */
  function initReveal() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('reveal--in'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    $$('.metric, .endpoint, .wh-card, .cat, .codeblock, .play, .type-stage').forEach(el => {
      el.classList.add('reveal'); obs.observe(el);
    });
  }

  /* ─────────────────────────────────────────────
     Hero floating card rotation
     ───────────────────────────────────────────── */
  function initHeroRotation() {
    const items = window.SQ_SAMPLES.querySample.instrumentUpdateMessages;
    const titleEl = $('#heroTitle');
    const descEl  = $('#heroDesc');
    titleEl.style.transition = 'opacity .35s';
    descEl.style.transition  = 'opacity .35s';
    let i = 0;
    function rotate() {
      i = (i + 1) % items.length;
      const m = items[i];
      titleEl.style.opacity = 0; descEl.style.opacity = 0;
      setTimeout(() => {
        titleEl.textContent = m.title;
        descEl.textContent = m.description;
        titleEl.style.opacity = 1; descEl.style.opacity = 1;
      }, 280);
    }
    setInterval(rotate, 4200);
  }

  /* ─────────────────────────────────────────────
     Toast
     ───────────────────────────────────────────── */
  function toast(msg, kind) {
    const el = $('#toast');
    el.className = 'toast toast--show' + (kind ? ' toast--' + kind : '');
    el.textContent = msg;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('toast--show'), 3000);
  }

  /* ─────────────────────────────────────────────
     API key bar
     ───────────────────────────────────────────── */
  function initApiKeyBar() {
    const input = $('#apiKeyInput');
    const status = $('#apiKeyStatus');
    if (state.apiKey) { input.value = state.apiKey; }
    updateKeyStatus();

    $('#saveKeyBtn').addEventListener('click', () => {
      state.apiKey = input.value.trim();
      localStorage.setItem('sqh.apiKey', state.apiKey);
      updateKeyStatus();
      toast(state.apiKey ? 'API key saved · ready to make live requests.' : 'Key cleared.', state.apiKey ? 'success' : '');
      updateQuickstartSnippets();
      window.dispatchEvent(new Event('sqh:envOrKeyChanged'));
    });
    $('#clearKeyBtn').addEventListener('click', () => {
      input.value = ''; state.apiKey = '';
      localStorage.removeItem('sqh.apiKey');
      updateKeyStatus();
      updateQuickstartSnippets();
      toast('API key cleared.');
      window.dispatchEvent(new Event('sqh:envOrKeyChanged'));
    });

    $('#toggleKeyVis').addEventListener('click', () => {
      input.type = input.type === 'password' ? 'text' : 'password';
    });

    // env toggle
    $$('.env-btn').forEach(btn => {
      btn.classList.toggle('env-btn--active', btn.dataset.env === state.env);
      btn.addEventListener('click', () => {
        state.env = btn.dataset.env;
        localStorage.setItem('sqh.env', state.env);
        $$('.env-btn').forEach(b => b.classList.toggle('env-btn--active', b.dataset.env === state.env));
        updatePlaygroundUrls();
        updateQuickstartSnippets();
        window.dispatchEvent(new Event('sqh:envOrKeyChanged'));
      });
    });

    function updateKeyStatus() {
      if (state.apiKey) {
        status.innerHTML = '<span class="dot dot--green"></span><span class="nav__status-text">Key active</span>';
      } else {
        status.innerHTML = '<span class="dot dot--red"></span><span class="nav__status-text">No API key</span>';
      }
    }
  }

  /* ─────────────────────────────────────────────
     Quickstart code snippets
     ───────────────────────────────────────────── */
  function getQuickstartSnippet(lang) {
    const base = BASE_URLS[state.env];
    const key = state.apiKey || 'yourapikeyhere';
    if (lang === 'curl') {
      return [
        '<span class="cmt"># Get the latest 10 AI-curated instrument updates</span>',
        '<span class="kw">curl</span> --location \\',
        '  <span class="str">"' + base + '/hive/api/v2/instrumentUpdates/query?pageNo=0&amp;pageSize=10&amp;sortDirection=DESC"</span> \\',
        '  --header <span class="str">"x-api-key: ' + escapeHtml(key) + '"</span>'
      ].join('\n');
    }
    if (lang === 'js') {
      return [
        '<span class="cmt">// Node 18+ / modern browsers</span>',
        '<span class="kw">const</span> <span class="key">res</span> = <span class="kw">await</span> <span class="fn">fetch</span>(',
        '  <span class="str">"' + base + '/hive/api/v2/instrumentUpdates/query?pageNo=0&amp;pageSize=10&amp;sortDirection=DESC"</span>,',
        '  { headers: { <span class="str">"x-api-key"</span>: <span class="str">"' + escapeHtml(key) + '"</span> } }',
        ');',
        '<span class="kw">const</span> <span class="key">data</span> = <span class="kw">await</span> res.<span class="fn">json</span>();',
        '<span class="fn">console</span>.<span class="fn">log</span>(data.instrumentUpdateMessages[<span class="num">0</span>].title);'
      ].join('\n');
    }
    if (lang === 'py') {
      return [
        '<span class="cmt"># pip install requests</span>',
        '<span class="kw">import</span> requests',
        '',
        '<span class="key">res</span> = requests.<span class="fn">get</span>(',
        '  <span class="str">"' + base + '/hive/api/v2/instrumentUpdates/query"</span>,',
        '  params={<span class="str">"pageNo"</span>: <span class="num">0</span>, <span class="str">"pageSize"</span>: <span class="num">10</span>, <span class="str">"sortDirection"</span>: <span class="str">"DESC"</span>},',
        '  headers={<span class="str">"x-api-key"</span>: <span class="str">"' + escapeHtml(key) + '"</span>},',
        ')',
        '<span class="fn">print</span>(res.<span class="fn">json</span>()[<span class="str">"instrumentUpdateMessages"</span>][<span class="num">0</span>][<span class="str">"title"</span>])'
      ].join('\n');
    }
    return '';
  }

  function updateQuickstartSnippets() {
    const el = $('#snippet-quickstart');
    el.innerHTML = getQuickstartSnippet(state.quickstartLang);
  }

  function initQuickstart() {
    updateQuickstartSnippets();
    $$('#quickstart .tab').forEach(t => {
      t.addEventListener('click', () => {
        $$('#quickstart .tab').forEach(x => x.classList.remove('tab--active'));
        t.classList.add('tab--active');
        state.quickstartLang = t.dataset.lang;
        updateQuickstartSnippets();
      });
    });

    // verify snippet
    $('#snippet-verify').innerHTML = [
      '<span class="kw">import</span> { Webhook } <span class="kw">from</span> <span class="str">"svix"</span>;',
      '',
      '<span class="kw">const</span> <span class="key">secret</span>  = <span class="str">"whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw"</span>;',
      '<span class="kw">const</span> <span class="key">payload</span> = JSON.<span class="fn">stringify</span>(req.body);',
      '',
      '<span class="kw">const</span> <span class="key">headers</span> = {',
      '  <span class="str">"svix-id"</span>: req.headers[<span class="str">"svix-id"</span>],',
      '  <span class="str">"svix-timestamp"</span>: req.headers[<span class="str">"svix-timestamp"</span>],',
      '  <span class="str">"svix-signature"</span>: req.headers[<span class="str">"svix-signature"</span>]',
      '};',
      '',
      '<span class="kw">const</span> wh = <span class="kw">new</span> <span class="fn">Webhook</span>(secret);',
      '<span class="cmt">// throws on invalid signature</span>',
      '<span class="kw">const</span> <span class="key">verified</span> = wh.<span class="fn">verify</span>(payload, headers);',
      '',
      '<span class="fn">handleEvent</span>(verified);'
    ].join('\n');
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  }

  /* ─────────────────────────────────────────────
     Copy buttons
     ───────────────────────────────────────────── */
  function initCopyButtons() {
    $$('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = $('#' + btn.dataset.target);
        if (!target) return;
        const text = target.innerText;
        navigator.clipboard.writeText(text).then(() => {
          const orig = btn.querySelector('span').textContent;
          btn.querySelector('span').textContent = 'Copied';
          setTimeout(() => { btn.querySelector('span').textContent = orig; }, 1400);
        });
      });
    });
  }

  /* ─────────────────────────────────────────────
     Playground — endpoint switcher
     ───────────────────────────────────────────── */
  function initPlayground() {
    $$('.play__pill').forEach(p => {
      p.addEventListener('click', () => {
        $$('.play__pill').forEach(x => x.classList.remove('play__pill--active'));
        p.classList.add('play__pill--active');
        $$('.play__panel').forEach(panel => panel.classList.toggle('play__panel--active', panel.dataset.panel === p.dataset.endpoint));
      });
    });

    // result tabs
    $$('.play__panel').forEach(panel => {
      $$('.rtab', panel).forEach(tab => {
        tab.addEventListener('click', () => {
          $$('.rtab', panel).forEach(x => x.classList.remove('rtab--active'));
          tab.classList.add('rtab--active');
          $$('.rview', panel).forEach(v => v.classList.toggle('rview--active', v.dataset.view === tab.dataset.view));
        });
      });
    });

    // query inputs → live url update
    $$('[data-q]').forEach(inp => inp.addEventListener('input', updatePlaygroundUrls));
    $$('[data-a]').forEach(inp => inp.addEventListener('input', updatePlaygroundUrls));
    updatePlaygroundUrls();

    $('#runQueryBtn').addEventListener('click', () => runQuery(false));
    $('#useSampleQueryBtn').addEventListener('click', () => runQuery(true));
    $('#runAssessmentBtn').addEventListener('click', () => runAssessment(false));
    $('#useSampleAssessmentBtn').addEventListener('click', () => runAssessment(true));
  }

  function buildQueryUrl() {
    const params = new URLSearchParams();
    $$('[data-q]').forEach(inp => {
      const v = inp.value;
      if (v !== '' && v != null) params.append(inp.dataset.q, v);
    });
    return BASE_URLS[state.env] + '/hive/api/v2/instrumentUpdates/query?' + params.toString();
  }
  function buildAssessmentUrl() {
    const id = $('[data-a="instrumentUpdateId"]').value.trim();
    return BASE_URLS[state.env] + '/hive/api/v2/instrumentUpdates/assessment?instrumentUpdateId=' + encodeURIComponent(id);
  }
  function updatePlaygroundUrls() {
    $('#queryUrl').textContent = buildQueryUrl();
    $('#assessmentUrl').textContent = buildAssessmentUrl();
  }

  function setStatus(elId, kind, label) {
    const el = $('#' + elId);
    el.className = 'play__status status-' + kind;
    el.innerHTML = '<span class="dot"></span><span>' + label + '</span>';
  }

  /* ─────────────────────────────────────────────
     Run /query
     ───────────────────────────────────────────── */
  async function runQuery(useSample) {
    const url = buildQueryUrl();
    const cardsEl   = $('#queryCards');
    const jsonEl    = $('#queryJson');
    const headersEl = $('#queryHeaders');

    if (useSample) {
      const data = window.SQ_SAMPLES.querySample;
      renderUpdateCards(cardsEl, data);
      jsonEl.innerHTML = '<pre class="json">' + syntaxHighlightJson(data) + '</pre>';
      headersEl.innerHTML = renderMeta({ url: '(sample data — no request sent)', status: 200, totalItems: data.totalItems, totalPages: data.totalPages, currentPage: data.currentPage });
      setStatus('queryStatus', '200', 'Sample 200');
      return;
    }

    if (!state.apiKey) {
      toast('No API key saved. Loading sample data instead.', 'error');
      return runQuery(true);
    }

    setStatus('queryStatus', 'loading', 'Loading…');
    cardsEl.innerHTML = '<div class="placeholder"><div class="placeholder__pulse"></div><p>Calling ' + escapeHtml(url) + '</p></div>';

    try {
      const res = await fetch(url, { headers: { 'x-api-key': state.apiKey } });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { _raw: text }; }

      if (!res.ok) {
        setStatus('queryStatus', res.status >= 500 ? '500' : '400', 'HTTP ' + res.status);
        jsonEl.innerHTML = '<pre class="json">' + syntaxHighlightJson(data) + '</pre>';
        headersEl.innerHTML = renderMeta({ url, status: res.status });
        cardsEl.innerHTML = '<div class="placeholder"><p>Request failed with status ' + res.status + '. Check the JSON / Meta tabs.</p></div>';
        return;
      }

      setStatus('queryStatus', '200', 'HTTP 200');
      renderUpdateCards(cardsEl, data);
      jsonEl.innerHTML = '<pre class="json">' + syntaxHighlightJson(data) + '</pre>';
      headersEl.innerHTML = renderMeta({ url, status: res.status, totalItems: data.totalItems, totalPages: data.totalPages, currentPage: data.currentPage });
    } catch (err) {
      setStatus('queryStatus', '500', 'Network error');
      cardsEl.innerHTML = '<div class="placeholder"><p>' + escapeHtml(err.message || String(err)) +
        ' — this is often a CORS restriction when calling the API directly from a browser. Use the sample data, or proxy via your backend.</p></div>';
      headersEl.innerHTML = renderMeta({ url, status: 'error', error: err.message });
    }
  }

  /* ─────────────────────────────────────────────
     Run /assessment
     ───────────────────────────────────────────── */
  async function runAssessment(useSample) {
    const url = buildAssessmentUrl();
    const visualEl  = $('#assessmentVisual');
    const jsonEl    = $('#assessmentJson');
    const headersEl = $('#assessmentHeaders');

    if (useSample) {
      const data = window.SQ_SAMPLES.assessmentSample;
      visualEl.innerHTML = renderAssessment(data);
      jsonEl.innerHTML = '<pre class="json">' + syntaxHighlightJson(data) + '</pre>';
      headersEl.innerHTML = renderMeta({ url: '(sample data — no request sent)', status: 200 });
      setStatus('assessmentStatus', '200', 'Sample 200');
      return;
    }

    const id = $('[data-a="instrumentUpdateId"]').value.trim();
    if (!id) { toast('Enter an instrumentUpdateId first (or use sample).', 'error'); return; }
    if (!state.apiKey) { toast('No API key saved. Loading sample data instead.', 'error'); return runAssessment(true); }

    setStatus('assessmentStatus', 'loading', 'Loading…');
    visualEl.innerHTML = '<div class="placeholder"><div class="placeholder__pulse"></div><p>Calling ' + escapeHtml(url) + '</p></div>';

    try {
      const res = await fetch(url, { headers: { 'x-api-key': state.apiKey } });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { _raw: text }; }

      if (!res.ok) {
        setStatus('assessmentStatus', res.status >= 500 ? '500' : '400', 'HTTP ' + res.status);
        jsonEl.innerHTML = '<pre class="json">' + syntaxHighlightJson(data) + '</pre>';
        headersEl.innerHTML = renderMeta({ url, status: res.status });
        visualEl.innerHTML = '<div class="placeholder"><p>Request failed with status ' + res.status + (res.status === 403 ? ' — your key may not have the assessment entitlement. Email sq@fundsmap.com to request access.' : '.') + '</p></div>';
        return;
      }

      setStatus('assessmentStatus', '200', 'HTTP 200');
      visualEl.innerHTML = renderAssessment(data);
      jsonEl.innerHTML = '<pre class="json">' + syntaxHighlightJson(data) + '</pre>';
      headersEl.innerHTML = renderMeta({ url, status: res.status });
    } catch (err) {
      setStatus('assessmentStatus', '500', 'Network error');
      visualEl.innerHTML = '<div class="placeholder"><p>' + escapeHtml(err.message || String(err)) + '</p></div>';
      headersEl.innerHTML = renderMeta({ url, status: 'error', error: err.message });
    }
  }

  /* ─────────────────────────────────────────────
     Renderers
     ───────────────────────────────────────────── */

  function renderUpdateCards(container, data) {
    const msgs = data.instrumentUpdateMessages || [];
    if (!msgs.length) {
      container.innerHTML = '<div class="placeholder"><p>No messages returned for this query.</p></div>';
      return;
    }
    const cards = msgs.map(renderUpdateCard).join('');
    const pagi = '<div class="update__pagination">' +
      '<span>Page <strong>' + (data.currentPage + 1) + '</strong> of <strong>' + data.totalPages + '</strong></span>' +
      '<span>' + data.totalItems.toLocaleString() + ' total messages match</span>' +
      '</div>';
    container.innerHTML = '<div class="update-list">' + cards + pagi + '</div>';

    // wire click → assessment id
    $$('.update', container).forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        if (!id) return;
        const inp = $('[data-a="instrumentUpdateId"]');
        inp.value = id;
        updatePlaygroundUrls();
        // switch to assessment panel
        $$('.play__pill').forEach(x => x.classList.toggle('play__pill--active', x.dataset.endpoint === 'assessment'));
        $$('.play__panel').forEach(p => p.classList.toggle('play__panel--active', p.dataset.panel === 'assessment'));
        toast('instrumentUpdateId loaded into assessment endpoint.');
      });
    });
  }

  function renderUpdateCard(m) {
    const pf = m.proFunnel || {};
    const cls = pf.classificationJson || {};
    const time = m.creationTime ? formatTime(m.creationTime * 1000) : '';
    const sentTag = pf.sentiment ? '<span class="tag ' + (
      pf.sentiment === 'positive' ? 'tag--pos' : pf.sentiment === 'negative' ? 'tag--neg' : 'tag--neutral'
    ) + '">' + pf.sentiment + '</span>' : '';
    const impTag = cls.importanceFlag ? '<span class="tag tag--info">' + escapeHtml(cls.importanceFlag) + '</span>' : '';
    const filterTag = m.filterCategory ? '<span class="tag">' + escapeHtml(m.filterCategory) + '</span>' : '';

    const bytes = (pf.bytes || []).slice(0, 4).map(b =>
      '<span class="byte"><span class="byte__tag">' + escapeHtml(b.tag) + ':</span><span class="byte__val">' + escapeHtml(String(b.data)) + '</span></span>'
    ).join('');

    let concern = '';
    if (pf.concernFlag && pf.concernFlag.flag) {
      const isRed = /red flag/i.test(pf.concernFlag.flag);
      concern = '<div class="update__concern' + (isRed ? ' update__concern--red' : '') + '">' +
        '<span>' + escapeHtml(pf.concernFlag.flag) + '</span>' +
        (pf.concernFlag.flagNote ? ' · <span>' + escapeHtml(pf.concernFlag.flagNote) + '</span>' : '') +
        '</div>';
    }

    const scrip = m.scripDetails || {};
    const scripLine = [
      scrip.bseScripCode ? 'BSE ' + scrip.bseScripCode : '',
      scrip.bseTickr || scrip.nseTickr || ''
    ].filter(Boolean).join(' · ');

    return [
      '<div class="update" data-id="' + escapeHtml(m.id || '') + '">',
        '<div class="update__head">',
          '<div>',
            '<h4 class="update__title">' + escapeHtml(m.title || '') + ' ' + (cls.emoji || '') + '</h4>',
            '<div class="update__desc">' + escapeHtml(m.description || '') + '</div>',
          '</div>',
          '<div class="update__time">' + time + '</div>',
        '</div>',
        m.content ? '<div class="update__content">' + escapeHtml(m.content) + '</div>' : '',
        bytes ? '<div class="update__bytes">' + bytes + '</div>' : '',
        concern,
        '<div class="update__foot">',
          '<div class="update__scrip">' + escapeHtml(scripLine) + '</div>',
          '<div class="update__tags">' + filterTag + sentTag + impTag + '</div>',
        '</div>',
      '</div>'
    ].join('');
  }

  function renderMeta(meta) {
    let html = '';
    html += '<div class="meta-block"><div class="meta-block__label">Request URL</div><div>' + escapeHtml(meta.url) + '</div></div>';
    html += '<div class="meta-block"><div class="meta-block__label">Status</div><div>' + escapeHtml(String(meta.status)) + '</div></div>';
    if (typeof meta.totalItems !== 'undefined') {
      html += '<div class="meta-block"><div class="meta-block__label">Pagination</div><div>' +
        'Page ' + (meta.currentPage + 1) + ' / ' + meta.totalPages + ' · ' + meta.totalItems.toLocaleString() + ' total items' +
        '</div></div>';
    }
    if (meta.error) {
      html += '<div class="meta-block"><div class="meta-block__label">Error</div><div>' + escapeHtml(meta.error) + '</div></div>';
    }
    return html;
  }

  function formatTime(ms) {
    const d = new Date(ms);
    const today = new Date();
    const sameDay = d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    if (sameDay) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' · ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  /* ─────────────────────────────────────────────
     Assessment renderer
     ───────────────────────────────────────────── */
  function renderAssessment(a) {
    const sig = (a.significance || '').toLowerCase();
    const sigTagCls = sig === 'high' ? 'tag--pos' : sig === 'low' ? 'tag--neutral' : 'tag--info';

    const outlook = a.risk_reward_outlook || '';
    const outlookCls = /negative/i.test(outlook) ? 'tag--neg' : /positive/i.test(outlook) ? 'tag--pos' : 'tag--neutral';

    const why = Array.isArray(a.why_this_matters)
      ? '<ul>' + a.why_this_matters.map(w => '<li>' + escapeHtml(w) + '</li>').join('') + '</ul>'
      : '';

    const impacts = a.investor_impact || {};

    return [
      '<div class="assessment">',
        '<div class="assessment__head">',
          '<div>',
            '<h3 class="assessment__title">' + escapeHtml(a.stock || '—') + '</h3>',
            '<div class="assessment__type">' + escapeHtml(a.event_type || '') + ' · <span class="tag ' + sigTagCls + '">' + escapeHtml(a.significance || '') + ' significance</span></div>',
          '</div>',
          '<div class="assessment__score">',
            '<div class="assessment__score-val">' + (a.risk_reward_score != null ? a.risk_reward_score : '—') + '<span class="assessment__score-of">/10</span></div>',
            '<div class="assessment__score-label">risk · reward</div>',
          '</div>',
        '</div>',

        '<div class="outlook-row">',
          '<div class="outlook-row__label">Risk · Reward Outlook</div>',
          '<div class="outlook-row__val"><span class="tag ' + outlookCls + '">' + escapeHtml(outlook) + '</span></div>',
        '</div>',

        a.what_happened ? '<div class="assessment__what">' +
          '<div class="assessment__what-label">What happened</div>' +
          '<div class="assessment__what-text">' + escapeHtml(a.what_happened) + '</div>' +
          '</div>' : '',

        why ? '<div class="dd-card dd-card--full"><div class="dd-card__label">Why this matters</div><div class="assessment__why">' + why + '</div></div>' : '',

        '<div class="impact-grid">',
          '<div class="impact"><div class="impact__period">⚡ Short term</div><div class="impact__text">' + escapeHtml(impacts.short_term || '—') + '</div></div>',
          '<div class="impact"><div class="impact__period">📅 Medium term</div><div class="impact__text">' + escapeHtml(impacts.medium_term || '—') + '</div></div>',
          '<div class="impact"><div class="impact__period">🌌 Long term</div><div class="impact__text">' + escapeHtml(impacts.long_term || '—') + '</div></div>',
        '</div>',

        a.ITI ? '<div class="iti-block">' +
          '<div class="iti-block__head"><span>ITI · LLM-ready payload</span><span>base64 · ' + a.ITI.length + ' chars</span></div>' +
          escapeHtml(a.ITI.slice(0, 220)) + (a.ITI.length > 220 ? '…' : '') +
          '</div>' : '',

      '</div>'
    ].join('');
  }

  /* ─────────────────────────────────────────────
     deepdiveData type renderers
     ───────────────────────────────────────────── */
  const TYPE_RENDERERS = {
    BLOCK_DEAL: renderBlockDeal,
    BULK_DEAL: renderBulkDeal,
    MANAGEMENT_TAKE: renderManagementTake,
    IMPACT_ANALYSIS: renderFastFact,
    RESULTS_QUICK_LOOK: renderResultsQuickLook,
    SAST_NOTEWORTHY_TRANSACTION: renderSast,
    CHART_WIZARD: renderChartWizard,
    BROADCAST_BRIEFING: renderBroadcast,
    ANALYST_VIEW: renderMediaOnly,
    TWEET: renderMediaOnly,
    CREDIT_RATING: renderCreditRating,
    ANALYST_MEET: renderAnalystMeet,
    ACQUISITION: renderAcquisition,
    ORDER_RECEIVED: renderOrderReceived,
    GENERIC: renderGeneric
  };

  function inr(n) {
    if (typeof n !== 'number') return n;
    if (n >= 1e7) return '₹' + (n / 1e7).toFixed(2) + ' cr';
    if (n >= 1e5) return '₹' + (n / 1e5).toFixed(2) + ' L';
    return '₹' + n.toLocaleString('en-IN');
  }
  function fmtQty(n) {
    if (typeof n !== 'number') return n;
    return n.toLocaleString('en-IN');
  }

  function renderBlockDeal(d) {
    const buy = d.buyDeals || [];
    const sell = d.sellDeals || [];
    const buyHtml = buy.map(x => `<div class="deal deal--buy"><div class="deal__name">➕ ${escapeHtml(x.clientName)}</div><div class="deal__qty">${fmtQty(x.aggregatedQty)}</div><div class="deal__price">@${x.watp}</div></div>`).join('');
    const sellHtml = sell.map(x => `<div class="deal deal--sell"><div class="deal__name">➖ ${escapeHtml(x.clientName)}</div><div class="deal__qty">${fmtQty(x.aggregatedQty)}</div><div class="deal__price">@${x.watp}</div></div>`).join('');
    return `
      <div class="deal-summary">
        <div><div class="deal-summary__label">Date · ${escapeHtml(d.dealExchange || '')}</div><div class="deal-summary__val">${escapeHtml(d.date || '')}</div></div>
        <div><div class="deal-summary__label">Total value</div><div class="deal-summary__val deal-summary__val--cyan">${escapeHtml(d.transactionValueInCr || inr(d.totalBoughtValue || 0))}</div></div>
        <div><div class="deal-summary__label">Volume (bought · sold)</div><div class="deal-summary__val">${fmtQty(d.totalBoughtQty)} · ${fmtQty(d.totalSoldQty)}</div></div>
      </div>
      <div class="dd-grid">
        <div class="dd-card"><div class="dd-card__label">Buyers · ${buy.length}</div><div class="deal-list">${buyHtml}</div></div>
        <div class="dd-card"><div class="dd-card__label">Sellers · ${sell.length}</div><div class="deal-list">${sellHtml}</div></div>
      </div>`;
  }
  function renderBulkDeal(d) {
    const side = (d.side || '').toUpperCase();
    return `
      <div class="deal-summary">
        <div><div class="deal-summary__label">Date · ${escapeHtml(d.dealExchange || '')}</div><div class="deal-summary__val">${escapeHtml(d.date || '')}</div></div>
        <div><div class="deal-summary__label">Side</div><div class="deal-summary__val">${side === 'BUY' ? '🟢 BUY' : '🔴 SELL'}</div></div>
        <div><div class="deal-summary__label">Value</div><div class="deal-summary__val deal-summary__val--cyan">${inr((d.qty||0) * (d.price||0))}</div></div>
      </div>
      <div class="dd-card dd-card--full">
        <div class="dd-card__label">Counter-party</div>
        <div class="deal deal--${side==='BUY'?'buy':'sell'}">
          <div class="deal__name">${side==='BUY'?'➕':'➖'} ${escapeHtml(d.clientName||'')}</div>
          <div class="deal__qty">${fmtQty(d.qty)}</div>
          <div class="deal__price">@${d.price}</div>
        </div>
      </div>`;
  }
  function renderManagementTake(d) {
    return `
      <div class="dd-grid">
        <div class="dd-card"><div class="dd-card__label">📣 Current commentary</div><div>${d.current_performance_essence || ''}</div></div>
        <div class="dd-card"><div class="dd-card__label">🎯 Forward outlook</div><div>${d.future_outlook_essence || ''}</div></div>
      </div>
      ${d.isAudioPresent ? '<div class="dd-card dd-card--full"><div class="dd-card__label">🔊 Audio</div><div style="color:var(--text-2);font-size:13px;">Audio narration at <code>audio_url</code>.</div></div>' : ''}`;
  }
  function renderFastFact(d) {
    return `<div class="dd-card dd-card--full"><div class="dd-card__label">⚡ Fast fact</div><div style="font-size:15px;line-height:1.6;color:var(--text);">${escapeHtml(d.fast_fact || '')}</div></div>`;
  }
  function renderResultsQuickLook(d) {
    const r = d.result_data || {};
    const unit = r.amount_unit || '';
    function delta(latest, base) {
      const a = parseFloat(String(latest).replace(/,/g,''));
      const b = parseFloat(String(base).replace(/,/g,''));
      if (!isFinite(a) || !isFinite(b) || b === 0) return null;
      return ((a - b) / Math.abs(b) * 100);
    }
    const drev = delta(r.latest_rev, r.qoq_rev);
    const drevy = delta(r.latest_rev, r.yoy_rev);
    const dprf = delta(r.latest_profits, r.qoq_profits);
    const dprfy = delta(r.latest_profits, r.yoy_profits);

    function metric(label, latest, drevA, drevB) {
      const arrowA = drevA == null ? '' : (drevA > 0 ? '▲ ' : '▼ ');
      const clsA = drevA == null ? '' : (drevA > 0 ? 'qrl-metric__delta--up' : 'qrl-metric__delta--down');
      const arrowB = drevB == null ? '' : (drevB > 0 ? '▲ ' : '▼ ');
      const clsB = drevB == null ? '' : (drevB > 0 ? 'qrl-metric__delta--up' : 'qrl-metric__delta--down');
      return `
        <div class="qrl-metric">
          <div class="qrl-metric__period">${escapeHtml(label)} · ${escapeHtml(unit)}</div>
          <div class="qrl-metric__val">${escapeHtml(latest||'—')}</div>
          ${drevA != null ? `<div class="qrl-metric__delta ${clsA}">${arrowA}${Math.abs(drevA).toFixed(1)}% QoQ</div>` : ''}
          ${drevB != null ? `<div class="qrl-metric__delta ${clsB}">${arrowB}${Math.abs(drevB).toFixed(1)}% YoY</div>` : ''}
        </div>`;
    }
    return `
      <div class="qrl-grid">
        ${metric('Revenue', r.latest_rev, drev, drevy)}
        ${metric('Profits', r.latest_profits, dprf, dprfy)}
        <div class="qrl-metric">
          <div class="qrl-metric__period">Result type</div>
          <div class="qrl-metric__val" style="font-size:16px;text-transform:capitalize;">${escapeHtml(r.result_type||'—')}</div>
          <div class="qrl-metric__delta" style="color:var(--text-3);">Confident: ${escapeHtml(r.confident||'—')}</div>
        </div>
      </div>`;
  }
  function renderSast(d) {
    const side = (d.transactionType || '').toLowerCase();
    return `
      <div class="deal-summary">
        <div><div class="deal-summary__label">Target</div><div class="deal-summary__val" style="font-size:14px;">${escapeHtml(d.targetCompany||'')}</div></div>
        <div><div class="deal-summary__label">Acquirer</div><div class="deal-summary__val" style="font-size:14px;">${escapeHtml(d.acquirer||'')}</div></div>
        <div><div class="deal-summary__label">Transaction</div><div class="deal-summary__val">${side==='buy'?'🟢 BUY':'🔴 SELL'} · ${escapeHtml(d.shareHolderType||'')}</div></div>
      </div>
      <div class="dd-card dd-card--full">
        <div class="dd-card__label">Shareholding</div>
        <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;">
          <div><div style="color:var(--text-3);font-size:11.5px;">Before</div><div style="font-family:var(--display);font-size:22px;font-weight:600;">${d.percentageHoldingBeforeAcquisition}%</div></div>
          <div style="font-size:24px;color:var(--cyan);">→</div>
          <div><div style="color:var(--text-3);font-size:11.5px;">Acquired</div><div style="font-family:var(--display);font-size:22px;font-weight:600;color:var(--green);">+${d.percentageAcquired}%</div></div>
          <div style="flex:1;text-align:right;font-family:var(--mono);color:var(--text-2);">${fmtQty(d.quantity)} shares</div>
        </div>
      </div>
      ${d.body?`<div class="dd-card dd-card--full"><div class="dd-card__label">Note</div><div>${escapeHtml(d.body)}</div></div>`:''}`;
  }
  function renderChartWizard(d) {
    const view = (d.view || '').toLowerCase();
    const cls = view === 'bullish' ? 'tag--pos' : view === 'bearish' ? 'tag--neg' : 'tag--neutral';
    const patterns = (d.chartIndicatorAndPatterns || '').split(',').map(s => s.trim()).filter(Boolean);
    return `
      <div class="deal-summary">
        <div><div class="deal-summary__label">View</div><div class="deal-summary__val"><span class="tag ${cls}" style="font-size:13px;padding:6px 12px;">${escapeHtml(d.view||'—')}</span></div></div>
        <div><div class="deal-summary__label">Interval</div><div class="deal-summary__val" style="font-size:16px;">${escapeHtml(d.interval||'')}</div></div>
        <div><div class="deal-summary__label">Patterns detected</div><div class="deal-summary__val" style="font-size:16px;">${patterns.length}</div></div>
      </div>
      <div class="dd-card dd-card--full"><div class="dd-card__label">Pattern signatures</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          ${patterns.map(p=>`<span class="tag tag--info" style="font-size:11.5px;">${escapeHtml(p)}</span>`).join('')}
        </div>
      </div>
      <div class="dd-card dd-card--full"><div class="dd-card__label">Rationale</div><div style="font-size:13.5px;line-height:1.6;color:var(--text-2);">${escapeHtml(d.rationale||'')}</div></div>`;
  }
  function renderBroadcast(d) {
    return `
      <div class="dd-card dd-card--full">
        <div class="dd-card__label">📡 Broadcast briefing</div>
        <h4 style="font-family:var(--display);font-size:18px;margin:0 0 12px;line-height:1.3;">${d.broadcast_briefings_title||''}</h4>
        <div style="font-size:13.5px;line-height:1.6;color:var(--text-2);">${d.broadcast_briefings_body||''}</div>
      </div>`;
  }
  function renderMediaOnly(d) {
    const label = d.type === 'TWEET' ? '🐦 Tweet' : '📊 Analyst View';
    return `<div class="dd-card dd-card--full"><div class="dd-card__label">${label}</div>
      <div style="color:var(--text-2);font-size:13.5px;">This update is image-first. The rendered visual is available at <code>image_url</code>. ${d.isImagePresent ? 'Image is present.' : 'Image not present.'}</div></div>`;
  }
  function renderCreditRating(d) {
    return `<div class="dd-card dd-card--full">
      <div class="dd-card__label">💳 Credit rating action</div>
      <div style="font-family:var(--display);font-size:18px;font-weight:600;margin-bottom:8px;">${escapeHtml(d.current_rating_and_previous_rating||'')}</div>
      <div style="font-size:13.5px;line-height:1.6;color:var(--text-2);">${escapeHtml(d.short_description_of_credit_rating_related_details||'')}</div>
    </div>`;
  }
  function renderAnalystMeet(d) {
    return `<div class="dd-card dd-card--full">
      <div class="dd-card__label">👥 Analyst / investor meet</div>
      <div style="font-family:var(--display);font-size:15px;margin-bottom:8px;">${escapeHtml(d.name_of_the_meeting_organizer_and_event_type||'')}</div>
      <div style="font-size:13.5px;line-height:1.6;color:var(--text-2);">${escapeHtml(d.short_description_of_the_sceduled_meeting||'')}</div>
      <div style="margin-top:12px;font-family:var(--mono);font-size:11.5px;color:var(--text-3);">Attendees: ${escapeHtml(d['name(s)_of_investors']||'—')}</div>
    </div>`;
  }
  function renderAcquisition(d) {
    return `
      <div class="dd-grid">
        <div class="dd-card"><div class="dd-card__label">🎯 Target</div><div style="font-family:var(--display);font-size:16px;font-weight:600;">${escapeHtml(d.target_company||'')}</div></div>
        <div class="dd-card"><div class="dd-card__label">📦 Extent</div><div style="font-family:var(--display);font-size:16px;font-weight:600;">${escapeHtml(d.extent_of_acquisition||'')}</div></div>
      </div>
      <div class="dd-card dd-card--full" style="margin-top:14px;"><div class="dd-card__label">💰 Consideration</div><div style="font-size:13.5px;">${escapeHtml(d.consideration_type_and_quantum||'')}</div></div>
      <div class="dd-card dd-card--full" style="margin-top:14px;"><div class="dd-card__label">📝 Description</div><div style="font-size:13.5px;line-height:1.6;color:var(--text-2);">${escapeHtml(d.short_description_of_the_transaction||'')}</div></div>
      <div class="dd-card dd-card--full" style="margin-top:14px;"><div class="dd-card__label">🏢 Target business</div><div style="font-size:13.5px;line-height:1.6;color:var(--text-2);">${escapeHtml(d.business_of_target_and_object_of_acquisition||'')}</div></div>`;
  }
  function renderOrderReceived(d) {
    const flag = (d.type_of_order_flag||'').replace(/_/g,' ');
    return `
      <div class="deal-summary">
        <div><div class="deal-summary__label">Order size</div><div class="deal-summary__val deal-summary__val--cyan">${escapeHtml(d.size_of_order||'—')}</div></div>
        <div><div class="deal-summary__label">Flag</div><div class="deal-summary__val" style="font-size:14px;text-transform:capitalize;">${escapeHtml(flag||'—')}</div></div>
        <div><div class="deal-summary__label">Type</div><div class="deal-summary__val">📦 Order</div></div>
      </div>
      <div class="dd-card dd-card--full"><div class="dd-card__label">Details</div><div style="font-size:13.5px;line-height:1.6;color:var(--text-2);">${escapeHtml(d.short_description_of_order_details||'')}</div></div>`;
  }
  function renderGeneric(d) {
    return `<div class="dd-card dd-card--full">
      <div class="dd-card__label">🧩 Generic update</div>
      <div style="color:var(--text-2);font-size:13.5px;line-height:1.55;">
        <code>GENERIC</code> is returned for sources that don't map to a named schema. Treat the remaining keys in <code>deepdiveData</code> as opaque JSON and route to a default handler.
      </div>
    </div>`;
  }

  /* ─────────────────────────────────────────────
     deepdiveData types gallery
     ───────────────────────────────────────────── */
  function initTypesGallery() {
    const chips = $('#typeChips');
    const stage = $('#typeStage');
    const samples = window.SQ_SAMPLES.deepdiveSamples;
    const order = ['BLOCK_DEAL','BULK_DEAL','SAST_NOTEWORTHY_TRANSACTION','RESULTS_QUICK_LOOK','MANAGEMENT_TAKE','IMPACT_ANALYSIS','CHART_WIZARD','BROADCAST_BRIEFING','ANALYST_MEET','ACQUISITION','ORDER_RECEIVED','CREDIT_RATING','ANALYST_VIEW','TWEET','GENERIC'];

    chips.innerHTML = order.map(t => `<button class="type-chip${t===state.activeType?' type-chip--active':''}" data-type="${t}">${t}</button>`).join('');
    $$('.type-chip', chips).forEach(c => {
      c.addEventListener('click', () => {
        $$('.type-chip', chips).forEach(x => x.classList.remove('type-chip--active'));
        c.classList.add('type-chip--active');
        state.activeType = c.dataset.type;
        renderTypeStage();
      });
    });
    renderTypeStage();

    function renderTypeStage() {
      const t = state.activeType;
      const s = samples[t];
      if (!s) { stage.innerHTML = `<div class="placeholder"><p>No sample for ${t}.</p></div>`; return; }
      const renderer = TYPE_RENDERERS[t] || renderGeneric;
      const payloadId = 'snippet-type-' + t;
      stage.innerHTML = `
        <div class="type-stage__head">
          <div>
            <h3 class="type-stage__title">${s.label}</h3>
            <div class="type-stage__sub">${escapeHtml(s.desc)} · sample: <strong>${escapeHtml(s.stock)}</strong></div>
          </div>
          <span class="tag tag--info" style="font-family:var(--mono);">deepdiveData.type = "${t}"</span>
        </div>
        <div class="type-stage__visual">${renderer(s.data)}</div>
        <div class="type-stage__payload">
          <div class="type-stage__payload-head">
            <h4 class="endpoint__h4" style="margin:0;">Sample deepdiveData payload</h4>
            <button class="copy-btn" data-target="${payloadId}">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <span>Copy</span>
            </button>
          </div>
          <div class="codeblock codeblock--scroll">
            <pre><code id="${payloadId}" class="snippet json">${syntaxHighlightJson(s.data)}</code></pre>
          </div>
        </div>
      `;
      // wire copy button for the freshly-rendered payload
      $$('.copy-btn', stage).forEach(btn => {
        btn.addEventListener('click', () => {
          const target = $('#' + btn.dataset.target);
          if (!target) return;
          navigator.clipboard.writeText(target.innerText).then(() => {
            const sp = btn.querySelector('span'); const orig = sp.textContent;
            sp.textContent = 'Copied';
            setTimeout(() => { sp.textContent = orig; }, 1400);
          });
        });
      });
    }
  }

  /* ─────────────────────────────────────────────
     Filter categories gallery
     ───────────────────────────────────────────── */
  function initCategoryGallery() {
    const grid = $('#catGrid');
    grid.innerHTML = window.SQ_SAMPLES.filterCategories.map(c => `
      <div class="cat" style="--cat-color:${c.color};">
        <div class="cat__name">${c.name}</div>
        <h4 class="cat__title">${escapeHtml(c.title)}</h4>
        <p class="cat__desc">${escapeHtml(c.desc)}</p>
        <div class="cat__sample">
          <strong>${escapeHtml(c.sample.title)}</strong><br/>
          ${escapeHtml(c.sample.desc)}
        </div>
      </div>
    `).join('');
  }

  /* ─────────────────────────────────────────────
     JSON syntax highlighter
     ───────────────────────────────────────────── */
  function syntaxHighlightJson(obj) {
    let json = JSON.stringify(obj, null, 2);
    json = json.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(\.\d+)?([eE][+\-]?\d+)?)/g, (match) => {
      let cls = 'n';
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? 'k' : 's';
      } else if (/true|false/.test(match)) { cls = 'b'; }
      else if (/null/.test(match)) { cls = 'l'; }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }

  /* ─────────────────────────────────────────────
     Boot
     ───────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initApiKeyBar();
    initQuickstart();
    initCopyButtons();
    initPlayground();
    initTypesGallery();
    initCategoryGallery();
    initHeroRotation();
    initCounters();
    initReveal();
    initEndpointSamples();
    initWebhookPayloads();

    // pre-load sample for query result panel
    runQuery(true);
    // pre-load sample assessment
    setTimeout(() => runAssessment(true), 200);
  });

  /* ─────────────────────────────────────────────
     Endpoint sample request / response snippets
     ───────────────────────────────────────────── */
  function buildSampleRequestSnippet(endpoint, lang) {
    const base = BASE_URLS[state.env];
    const key = state.apiKey || 'yourapikeyhere';
    if (endpoint === 'query') {
      if (lang === 'curl') {
        return [
          '<span class="kw">curl</span> --location \\',
          '  <span class="str">"' + base + '/hive/api/v2/instrumentUpdates/query?pageNo=0&amp;pageSize=200&amp;sortDirection=DESC"</span> \\',
          '  --header <span class="str">"x-api-key: ' + escapeHtml(key) + '"</span>'
        ].join('\n');
      }
      if (lang === 'js') {
        return [
          '<span class="kw">const</span> <span class="key">url</span> = <span class="str">"' + base + '/hive/api/v2/instrumentUpdates/query"</span>',
          '  + <span class="str">"?pageNo=0&amp;pageSize=200&amp;sortDirection=DESC"</span>;',
          '',
          '<span class="kw">const</span> <span class="key">res</span> = <span class="kw">await</span> <span class="fn">fetch</span>(url, {',
          '  headers: { <span class="str">"x-api-key"</span>: <span class="str">"' + escapeHtml(key) + '"</span> }',
          '});',
          '<span class="kw">const</span> <span class="key">data</span> = <span class="kw">await</span> res.<span class="fn">json</span>();'
        ].join('\n');
      }
      if (lang === 'py') {
        return [
          '<span class="kw">import</span> requests',
          '',
          '<span class="key">res</span> = requests.<span class="fn">get</span>(',
          '  <span class="str">"' + base + '/hive/api/v2/instrumentUpdates/query"</span>,',
          '  params={<span class="str">"pageNo"</span>: <span class="num">0</span>, <span class="str">"pageSize"</span>: <span class="num">200</span>, <span class="str">"sortDirection"</span>: <span class="str">"DESC"</span>},',
          '  headers={<span class="str">"x-api-key"</span>: <span class="str">"' + escapeHtml(key) + '"</span>},',
          ')',
          '<span class="key">data</span> = res.<span class="fn">json</span>()'
        ].join('\n');
      }
    }
    if (endpoint === 'assessment') {
      const id = '818768429104481561';
      if (lang === 'curl') {
        return [
          '<span class="kw">curl</span> --location \\',
          '  <span class="str">"' + base + '/hive/api/v2/instrumentUpdates/assessment?instrumentUpdateId=' + id + '"</span> \\',
          '  --header <span class="str">"x-api-key: ' + escapeHtml(key) + '"</span>'
        ].join('\n');
      }
      if (lang === 'js') {
        return [
          '<span class="kw">const</span> <span class="key">url</span> = <span class="str">"' + base + '/hive/api/v2/instrumentUpdates/assessment"</span>',
          '  + <span class="str">"?instrumentUpdateId=' + id + '"</span>;',
          '',
          '<span class="kw">const</span> <span class="key">res</span> = <span class="kw">await</span> <span class="fn">fetch</span>(url, {',
          '  headers: { <span class="str">"x-api-key"</span>: <span class="str">"' + escapeHtml(key) + '"</span> }',
          '});',
          '<span class="kw">const</span> <span class="key">assessment</span> = <span class="kw">await</span> res.<span class="fn">json</span>();'
        ].join('\n');
      }
      if (lang === 'py') {
        return [
          '<span class="kw">import</span> requests',
          '',
          '<span class="key">res</span> = requests.<span class="fn">get</span>(',
          '  <span class="str">"' + base + '/hive/api/v2/instrumentUpdates/assessment"</span>,',
          '  params={<span class="str">"instrumentUpdateId"</span>: <span class="str">"' + id + '"</span>},',
          '  headers={<span class="str">"x-api-key"</span>: <span class="str">"' + escapeHtml(key) + '"</span>},',
          ')',
          '<span class="key">assessment</span> = res.<span class="fn">json</span>()'
        ].join('\n');
      }
    }
    return '';
  }

  function initEndpointSamples() {
    const reqState = { query: 'curl', assessment: 'curl' };

    function renderReqs() {
      $('#snippet-query-req').innerHTML  = buildSampleRequestSnippet('query', reqState.query);
      $('#snippet-assess-req').innerHTML = buildSampleRequestSnippet('assessment', reqState.assessment);
    }
    renderReqs();

    // tabs on request blocks
    ['snippet-query-req', 'snippet-assess-req'].forEach(targetId => {
      const tabs = $$('[data-target="' + targetId + '"]');
      tabs.filter(t => t.classList.contains('tab')).forEach(t => {
        t.addEventListener('click', () => {
          tabs.filter(x => x.classList.contains('tab')).forEach(x => x.classList.remove('tab--active'));
          t.classList.add('tab--active');
          const key = targetId === 'snippet-query-req' ? 'query' : 'assessment';
          reqState[key] = t.dataset.lang;
          renderReqs();
        });
      });
    });

    // sample responses
    const queryResp = window.SQ_SAMPLES.sampleResponses.queryFull;
    const assessResp = (function () {
      const a = Object.assign({}, window.SQ_SAMPLES.assessmentSample);
      if (a.ITI && a.ITI.length > 220) a.ITI = a.ITI.slice(0, 220) + '…';
      return a;
    })();
    $('#snippet-query-resp').innerHTML  = syntaxHighlightJson(queryResp);
    $('#snippet-assess-resp').innerHTML = syntaxHighlightJson(assessResp);

    // re-render request snippets when env/key changes
    window.addEventListener('sqh:envOrKeyChanged', renderReqs);
  }

  /* ─────────────────────────────────────────────
     Webhook payload tabs
     ───────────────────────────────────────────── */
  function initWebhookPayloads() {
    const tabs = $$('#whTabs .wh-tab');
    const codeEl = $('#snippet-webhook');
    const metaEl = $('#whEventMeta');
    if (!codeEl) return;

    function render(eventKey) {
      const payload = window.SQ_SAMPLES.webhookSamples[eventKey];
      codeEl.innerHTML = syntaxHighlightJson(payload);
      // These are the values that actually appear in the payload's eventType and in the Svix
      // event catalog, so they must match the backend's HiveApiWebhookEnum.EventType exactly.
      const label = ({
        created: 'v1.instrument_update.created',
        modified: 'v1.instrument_update.modified',
        assessment_ready: 'v1.assessment.ready',
        user_created: 'v1.user.created',
        user_modified: 'v1.user.modified'
      })[eventKey];
      metaEl.textContent = 'POST · ' + label + ' · signed with Svix';
    }
    tabs.forEach(t => {
      t.addEventListener('click', () => {
        tabs.forEach(x => x.classList.remove('wh-tab--active'));
        t.classList.add('wh-tab--active');
        render(t.dataset.event);
      });
    });
    render('created');
  }
})();
