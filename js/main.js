/* 15-Love Coffee: vanilla JS. Everything here is progressive enhancement. */

// ---- Easy-to-change constants ----
var IG_HANDLE = '15lovecoffee';
var PHONE = '+13235458235';
var PHONE_DISPLAY = '(323) 545-8235';
var IG_DM = 'https://ig.me/m/' + IG_HANDLE;

// ---- Menu data: edit prices/names here (also update menu.html text version) ----
var MENU = [
  { group: 'First Serve', items: [
    { id: 'espresso', name: 'Espresso', price: 3.5 },
    { id: 'latte', name: 'Latte', price: 6 },
    { id: 'cortado', name: 'Cortado', price: 5 },
    { id: 'cappuccino', name: 'Cappuccino', price: 5, hotOnly: true },
    { id: 'americano', name: 'Americano', price: 4.5 },
    { id: 'macchiato', name: 'Macchiato', price: 4.5 },
    { id: 'mocha', name: 'Mocha', price: 6 },
    { id: 'hotchoc', name: 'Hot Chocolate', price: 6 }
  ]},
  { group: 'Second Serve: Signature Drinks', items: [
    { id: 'ballboy', name: 'Ball Boy Latte', price: 7, desc: 'Latte with pistachio cold foam' },
    { id: 'tweener', name: 'The Tweener', price: 7, desc: 'Caramel, brown sugar, cinnamon, espresso' },
    { id: 'ombilible', name: 'Ombilible Latte', price: 7, desc: 'Sweetened cream, sea salt, cocoa powder, espresso' },
    { id: 'dropshot', name: 'Drop Shot', price: 4.5, desc: 'Double shot of espresso topped with whipped cream' }
  ]},
  { group: 'Game, Set, Matcha', items: [
    { id: 'matcha', name: 'Matcha Latte', price: 7, desc: 'Hand-whisked matcha, choice of milk and syrup' },
    { id: 'wimby', name: 'Wimby Latte', price: 7, desc: 'Strawberry and rose matcha' },
    { id: 'ballgirl', name: 'Ball Girl Latte', price: 7, desc: 'Brown sugar matcha with lavender cold foam' }
  ]}
];
var MILKS = ['Whole', 'Almond', 'Soy'];
var SYRUPS = ['Vanilla', 'Caramel', 'Lavender', 'White Mocha', 'Pistachio', 'Hazelnut'];

function $(s, r) { return (r || document).querySelector(s); }
function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
function money(n) { return '$' + (Math.round(n * 100) / 100).toFixed(n % 1 ? 2 : 0).replace(/\.00$/, ''); }
function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
function smsLink(msg) { return 'sms:' + PHONE + '?&body=' + encodeURIComponent(msg); }

function copyText(text) {
  return new Promise(function (resolve) {
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;left:-999px;top:0';
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta); resolve(ok);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { resolve(true); }, fallback);
    } else { fallback(); }
  });
}

// ---- Nav toggle ----
(function () {
  var btn = $('.nav-toggle'), nav = $('#site-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
})();

// ---- Order Ahead ----
(function () {
  var list = $('#drink-list');
  if (!list) return;
  var cart = {}; // id -> {qty,temp,milk,syrup}
  var pastry = false, when = 'ASAP';
  var byId = {};
  MENU.forEach(function (g) { g.items.forEach(function (i) { byId[i.id] = i; }); });

  function opt(arr, none) {
    return (none ? '<option value="">' + none + '</option>' : '') + arr.map(function (a) { return '<option>' + a + '</option>'; }).join('');
  }
  list.innerHTML = MENU.map(function (g) {
    return '<section class="group"><h2>' + g.group + '</h2>' + g.items.map(function (i) {
      return '<div class="drink" data-id="' + i.id + '"><div class="info"><div class="name">' + i.name + ' <span class="price">' + money(i.price) + '</span></div>' +
        (i.desc ? '<div class="desc">' + i.desc + '</div>' : '') + '</div>' +
        '<button type="button" class="add" aria-label="Add ' + i.name + '">+</button>' +
        '<div class="stepper"><button type="button" data-d="-1" aria-label="Remove one ' + i.name + '">−</button><output aria-live="polite">1</output><button type="button" data-d="1" aria-label="Add one more ' + i.name + '">+</button></div>' +
        '<button type="button" class="cust-toggle" aria-expanded="false">Customize</button>' +
        '<div class="cust"><label>Temp<select data-f="temp">' + (i.hotOnly ? '<option>Hot</option>' : '<option>Iced</option><option>Hot</option>') + '</select></label>' +
        '<label>Milk<select data-f="milk">' + opt(MILKS) + '</select></label>' +
        '<label>Syrup<select data-f="syrup">' + opt(SYRUPS, 'None') + '</select></label></div></div>';
    }).join('') + '</section>';
  }).join('');

  var bar = $('#summary'), sumToggle = $('#sum-toggle'), sendBtn = $('#send-order'), itemsEl = $('#sum-items');
  var nameEl = $('#o-name'), notesEl = $('#o-notes'), timeEl = $('#o-time');

  function line(id) {
    var c = cart[id], i = byId[id], d = [];
    d.push(c.temp.toLowerCase());
    if (c.milk !== 'Whole') d.push(c.milk.toLowerCase());
    if (c.syrup) d.push(c.syrup.toLowerCase());
    return c.qty + '× ' + i.name + ' (' + d.join(', ') + ')';
  }
  function totals() {
    var n = 0, t = 0;
    Object.keys(cart).forEach(function (id) { n += cart[id].qty; t += cart[id].qty * byId[id].price; });
    return { n: n, t: t };
  }
  function buildMsg() {
    var name = (nameEl.value || '').trim() || 'Guest';
    var lines = ['☕ 15-Love order – ' + name];
    Object.keys(cart).forEach(function (id) { lines.push(line(id)); });
    if (pastry) lines.push('+ pastry if available');
    lines.push('Pickup: ' + (when === 'Pick a time' ? (timeEl.value || 'ASAP') : when));
    if ($('#o-notes').value.trim()) lines.push('Notes: ' + notesEl.value.trim());
    lines.push('Est. ' + money(totals().t));
    return lines.join('\n');
  }
  function render() {
    $$('.drink', list).forEach(function (row) {
      var c = cart[row.dataset.id];
      row.classList.toggle('in-cart', !!c);
      if (c) $('output', row).textContent = c.qty;
    });
    var t = totals();
    bar.classList.toggle('show', t.n > 0);
    document.body.classList.toggle('has-cart', t.n > 0);
    sumToggle.textContent = t.n + (t.n === 1 ? ' drink' : ' drinks') + ' · est. ' + money(t.t);
    itemsEl.innerHTML = Object.keys(cart).map(function (id) { return '<li>' + line(id) + '</li>'; }).join('') + (pastry ? '<li>+ pastry if available</li>' : '');
    $('#desk-msg').value = buildMsg();
    if (!t.n) bar.classList.remove('expanded');
  }
  function setCart(id, qty, extra) {
    if (qty <= 0) { delete cart[id]; }
    else {
      var i = byId[id];
      cart[id] = cart[id] || { qty: 0, temp: i.hotOnly ? 'Hot' : 'Iced', milk: 'Whole', syrup: '' };
      cart[id].qty = qty;
      if (extra) for (var k in extra) cart[id][k] = extra[k];
    }
    render();
  }

  list.addEventListener('click', function (e) {
    var row = e.target.closest('.drink'); if (!row) return;
    var id = row.dataset.id;
    if (e.target.classList.contains('add')) setCart(id, 1);
    else if (e.target.dataset.d) setCart(id, cart[id].qty + parseInt(e.target.dataset.d, 10));
    else if (e.target.classList.contains('cust-toggle')) {
      var o = row.classList.toggle('open'); e.target.setAttribute('aria-expanded', o);
    }
  });
  list.addEventListener('change', function (e) {
    var row = e.target.closest('.drink'); if (!row || !e.target.dataset.f) return;
    cart[row.dataset.id][e.target.dataset.f] = e.target.value; render();
  });
  $('#pastry').addEventListener('change', function (e) { pastry = e.target.checked; render(); });

  sumToggle.addEventListener('click', function () {
    var x = bar.classList.toggle('expanded'); sumToggle.setAttribute('aria-expanded', x);
  });
  $$('.chip').forEach(function (c) {
    c.addEventListener('click', function () {
      $$('.chip').forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
      c.setAttribute('aria-pressed', 'true'); when = c.dataset.when;
      $('#time-field').classList.toggle('hidden', when !== 'Pick a time'); render();
    });
  });
  [nameEl, notesEl, timeEl].forEach(function (el) { el.addEventListener('input', render); });
  nameEl.value = store('lc_name') || '';

  function ensureName() {
    if (!nameEl.value.trim()) {
      bar.classList.add('expanded'); sumToggle.setAttribute('aria-expanded', 'true');
      $('#name-err').textContent = 'Please add your name so Bernie knows whose order it is.';
      nameEl.focus(); return false;
    }
    $('#name-err').textContent = ''; return true;
  }
  function remember() {
    store('lc_name', nameEl.value.trim());
    store('lc_last', JSON.stringify({ cart: cart, pastry: pastry }));
  }
  sendBtn.addEventListener('click', function () {
    if (!ensureName()) return;
    var msg = buildMsg(); remember(); window.location.href = smsLink(msg);
  });
  $('#send-ig').addEventListener('click', function () {
    if (!ensureName()) return;
    var msg = buildMsg(); remember();
    copyText(msg).then(function () {
      $('#ig-note').textContent = 'Copied! Paste it in our DMs.';
      window.open(IG_DM, '_blank', 'noopener');
    });
  });
  $('#copy-desk').addEventListener('click', function () {
    copyText($('#desk-msg').value).then(function (ok) { $('#copy-note').textContent = ok ? 'Copied!' : 'Select the text and copy it.'; });
  });

  // desktop fallback
  var coarse = window.matchMedia && window.matchMedia('(pointer:coarse)').matches;
  if (!coarse && window.innerWidth >= 900) $('#desktop-box').classList.add('active');

  // order again
  try {
    var last = JSON.parse(store('lc_last') || 'null');
    var ids = last && last.cart ? Object.keys(last.cart).filter(function (id) { return byId[id]; }) : [];
    if (ids.length) {
      var saved = last.cart;
      var txt = ids.map(function (id) { var c = saved[id]; return c.qty + '× ' + byId[id].name + ' (' + c.temp.toLowerCase() + ')'; }).join(', ');
      var box = $('#last-order');
      box.innerHTML = '<strong>Your last order:</strong> ' + txt + ' <button type="button" class="btn" id="again" style="margin-top:8px">Order again</button>';
      box.classList.remove('hidden');
      $('#again').addEventListener('click', function () {
        cart = {}; ids.forEach(function (id) { cart[id] = saved[id];
          var row = $('.drink[data-id="' + id + '"]');
          $$('select', row).forEach(function (s) { if (saved[id][s.dataset.f] !== undefined) s.value = saved[id][s.dataset.f] || (s.dataset.f === 'syrup' ? '' : s.value); });
        });
        pastry = !!last.pastry; $('#pastry').checked = pastry; render();
      });
    }
  } catch (e) {}
  render();
})();

// ---- Services tabs + booking ----
(function () {
  var form = $('#booking-form');
  if (!form) return;
  var tabs = $$('[role=tab]'), panels = $$('[role=tabpanel]'), typeEl = $('#service_type');
  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1;
      $('#' + t.getAttribute('aria-controls')).hidden = !on;
    });
    typeEl.value = tab.dataset.service; if (focus) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t); });
    t.addEventListener('keydown', function (e) {
      var j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
      if (j === null) return; e.preventDefault(); select(tabs[(j + tabs.length) % tabs.length], true);
    });
  });
  if (location.hash === '#catering') select(tabs[1]);

  var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  $('#b-date').min = d.toISOString().slice(0, 10);

  function fmtDate(v) { var p = v.split('-'); return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }); }
  function fmtTime(v) { var p = v.split(':'), h = +p[0]; return ((h + 11) % 12 + 1) + ':' + p[1] + ' ' + (h < 12 ? 'AM' : 'PM'); }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    var v = function (id) { return $('#' + id).value.trim(); };
    var lines = ['🎾 15-Love booking request',
      'Service: ' + typeEl.value,
      'Date: ' + fmtDate(v('b-date')) + ' · Start: ' + fmtTime(v('b-time')) + ' · Hours: ' + v('b-hours'),
      'Guests: ' + v('b-guests'),
      'Location: ' + v('b-loc'),
      'Name: ' + v('b-name') + (v('b-phone') ? ' · Phone: ' + v('b-phone') : '')];
    if (v('b-notes')) lines.push('Notes: ' + v('b-notes'));
    var msg = lines.join('\n');
    $('#booking-msg').value = msg;
    $('#sms-fallback').href = smsLink(msg);
    var panel = $('#confirm'); panel.hidden = false;
    copyText(msg).then(function (ok) {
      $('#confirm-title').textContent = ok ? 'Copied! ✅ Now paste it in our DMs and hit send.' : 'Almost there! Copy the message below, then paste it in our DMs.';
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' }); $('#confirm-title').focus();
    });
  });
  $('#copy-again').addEventListener('click', function () {
    copyText($('#booking-msg').value).then(function (ok) { $('#copy-again-note').textContent = ok ? 'Copied!' : 'Select the text and copy it.'; });
  });
})();
