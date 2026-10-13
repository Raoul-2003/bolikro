/**
 * BOLIKRO CHEZ WOLF — Interactive Storefront Engine (Modèle Final)
 */

const $ = s => document.querySelector(s);
let cart = store.get('bcw_cart', {});
let cat = 'Tous';
let step = 1;
let mode = 'livraison';

/* Synchronisation immédiate avec le menu officiel officiel (22 plats) */
store.set('bcw_menu', DEF);
store.set('bcw_menu_ver', 'v6-strictly-official-22-dishes');

const menu = () => DEF;
const find = id => DEF.find(d => d.id == id);

const toast = m => {
  let t = $('#toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    document.body.appendChild(t);
  }
  t.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px; vertical-align:middle;"><polyline points="20 6 9 17 4 12"/></svg> <span>${m}</span>`;
  t.classList.add('on');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('on'), 2400);
};

const lines = () => Object.entries(cart).map(([id, q]) => ({ d: find(id), q })).filter(l => l.d);
const sub = () => lines().reduce((s, l) => s + l.d.p * l.q, 0);

function renderMenu() {
  const m = menu();
  const tabsEl = $('#tabs');
  if (tabsEl) {
    tabsEl.innerHTML = ['Tous', ...CATS].map(c => `
      <button aria-pressed="${c == cat}" data-c="${c}">${c}</button>
    `).join('');
  }

  const l = m.filter(d => cat == 'Tous' || d.c == cat);
  const gridEl = $('#grid');
  if (!gridEl) return;

  gridEl.innerHTML = l.length ? l.map((d, i) => {
    const isBig = i === 0 && cat === 'Tous';
    return `
      <article class="card ${isBig ? 'big' : ''}">
        <div class="card-img-wrap">
          <img src="${d.img || 'assets/images/hero.jpg'}" alt="${esc(d.n)}" loading="lazy" onerror="this.onerror=null;this.src='assets/images/hero.jpg'">
          ${d.badge ? `<span class="card-badge">${d.badge}</span>` : ''}
        </div>
        <div class="bd">
          <div class="row">
            <h3>${esc(d.n)}</h3>
            <span class="tag ${d.a ? '' : 'no'}">${d.a ? 'Disponible' : 'Indisponible'}</span>
          </div>
          <p>${esc(d.d)}</p>
          <div class="row">
            <span class="price">${FCFA(d.p)}</span>
            <button class="btn dk" data-add="${d.id}" ${d.a ? '' : 'disabled'}>
              ${d.a ? '+ Ajouter' : 'Épuisé'}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('') : '<p class="empty">Aucun plat dans cette sélection.</p>';
}

function renderCart() {
  store.set('bcw_cart', cart);
  const L = lines();
  const n = L.reduce((s, l) => s + l.q, 0);
  const cnt = $('#cnt');
  if (cnt) cnt.textContent = n;

  const linesEl = $('#lines');
  if (!linesEl) return;

  linesEl.innerHTML = L.length ? L.map(({ d, q }) => `
    <div class="ln">
      <div>
        <b style="color:var(--ink);">${esc(d.n)}</b><br>
        <small style="color:var(--mu);">${FCFA(d.p)} l'unité</small>
      </div>
      <b style="color:var(--or);">${FCFA(d.p * q)}</b>
      <div class="qty">
        <button data-m="${d.id}" aria-label="Retirer un">−</button>
        <span style="font-weight:700; min-width:20px; text-align:center;">${q}</span>
        <button data-p="${d.id}" aria-label="Ajouter un">+</button>
      </div>
      <button class="x" data-r="${d.id}">Supprimer</button>
    </div>
  `).join('') : '<p class="empty">Votre panier est vide.<br>Ajoutez des spécialités braisées pour commencer.</p>';

  const subEl = $('#sub');
  if (subEl) subEl.textContent = FCFA(sub());

  const goBtn = $('#go');
  if (goBtn) goBtn.disabled = !L.length;
}

const drawer = o => {
  const d = $('#drawer');
  const ov = $('#ov');
  if (d && ov) {
    d.classList.toggle('on', o);
    ov.classList.toggle('on', o);
    document.body.style.overflow = o ? 'hidden' : '';
  }
};

document.addEventListener('click', e => {
  const t = e.target.closest('button, a');
  if (!t) return;
  const g = a => t.dataset[a];

  if (g('c')) {
    cat = g('c');
    renderMenu();
  }
  if (g('add')) {
    const d = find(g('add'));
    if (d && d.a) {
      cart[d.id] = (cart[d.id] || 0) + 1;
      renderCart();
      toast(`« ${d.n} » ajouté au panier !`);
    }
  }
  if (g('p')) {
    cart[g('p')]++;
    renderCart();
  }
  if (g('m')) {
    cart[g('m')]--;
    if (cart[g('m')] < 1) delete cart[g('m')];
    renderCart();
  }
  if (g('r')) {
    delete cart[g('r')];
    renderCart();
  }
  if (t.id === 'cartBtn') drawer(true);
  if (t.id === 'cl') drawer(false);
  if (t.id === 'burger') $('#nav-links').classList.toggle('on');
  if (t.closest('#nav-links')) $('#nav-links').classList.remove('on');
});

const ov = $('#ov');
if (ov) ov.onclick = () => drawer(false);

const co = $('#co');
const goBtn = $('#go');
if (goBtn) {
  goBtn.onclick = () => {
    drawer(false);
    step = 1;
    showStep();
    if (co) co.showModal();
  };
}

const ccBtn = $('#cc');
if (ccBtn) ccBtn.onclick = () => co.close();

function showStep() {
  [1, 2, 3].forEach(i => {
    const sEl = $('#s' + i);
    const pEl = $('#p' + i);
    if (sEl) sEl.hidden = i !== step;
    if (pEl) pEl.classList.toggle('on', i <= step);
  });

  const backBtn = $('#back');
  if (backBtn) backBtn.style.visibility = step === 1 ? 'hidden' : 'visible';

  const nextBtn = $('#next');
  if (nextBtn) nextBtn.textContent = step === 3 ? 'Confirmer la commande' : 'Continuer';

  const errEl = $('#err');
  if (errEl) errEl.textContent = '';

  const checkedMode = document.querySelector('[name=mode]:checked');
  mode = checkedMode ? checkedMode.value : 'livraison';

  const addrEl = $('#addr');
  if (addrEl) addrEl.hidden = mode !== 'livraison';

  if (step === 3) recap();
}

document.querySelectorAll('[name=mode]').forEach(r => r.onchange = showStep);

const backBtn = $('#back');
if (backBtn) {
  backBtn.onclick = () => {
    step--;
    showStep();
  };
}

const nextBtn = $('#next');
if (nextBtn) {
  nextBtn.onclick = () => {
    const er = m => {
      const err = $('#err');
      if (err) err.textContent = m;
      return false;
    };

    if (step === 1) {
      const n = $('#nom').value.trim();
      const t = $('#tel').value.replace(/[\s.-]/g, '');
      if (n.length < 2) return er('Indiquez votre nom et prénom.');
      if (!/^(\+?225)?\d{10}$/.test(t)) return er('Entrez un numéro de téléphone valide à 10 chiffres (ex: 07 00 00 00 00).');
    }

    if (step === 2 && mode === 'livraison') {
      if ($('#qua').value.trim().length < 2 || $('#adr').value.trim().length < 3) {
        return er('Indiquez votre quartier et une adresse / repère précis pour le livreur.');
      }
    }

    if (step < 3) {
      step++;
      return showStep();
    }

    // Validation finale de la commande
    const payChoice = document.querySelector('[name=pay]:checked')?.value || 'cash';
    const o = {
      num: 'BCW-' + Date.now().toString(36).toUpperCase().slice(-5),
      date: new Date().toISOString(),
      nom: $('#nom').value.trim(),
      tel: $('#tel').value.trim(),
      mode: mode,
      quartier: $('#qua') ? $('#qua').value.trim() : '',
      adresse: $('#adr') ? $('#adr').value.trim() : '',
      note: $('#nte') ? $('#nte').value.trim() : '',
      items: lines().map(l => ({ n: l.d.n, p: l.d.p, q: l.q })),
      total: sub() + (mode === 'livraison' ? FEE : 0),
      statut: 'En attente',
      paiement: payChoice === 'cash' ? 'Règlement à la réception' : 'Mobile Money Initié'
    };

    const all = store.get('bcw_orders', []);
    all.unshift(o);
    store.set('bcw_orders', all);

    cart = {};
    renderCart();
    if (co) co.close();

    const numInput = $('#num');
    if (numInput) numInput.value = o.num;
    track(o.num);
    location.hash = '#suivi';
    toast(`Commande ${o.num} confirmée avec succès !`);
  };
}

function recap() {
  const f = mode === 'livraison' ? FEE : 0;
  const recapEl = $('#recap');
  if (!recapEl) return;

  recapEl.innerHTML = lines().map(l => `
    <div>
      <span>${l.q} × ${esc(l.d.n)}</span>
      <b>${FCFA(l.d.p * l.q)}</b>
    </div>
  `).join('') + `
    <div>
      <span>Livraison (${mode === 'livraison' ? 'Yamoussoukro' : 'Retrait sur place'})</span>
      <b>${mode === 'livraison' ? FCFA(FEE) : 'Gratuit'}</b>
    </div>
    <div style="border-top:1px dashed #CDBFA8; margin-top:8px; padding-top:8px;">
      <span style="font-weight:800; color:var(--ink);">Total final</span>
      <b style="color:var(--or); font-size:18px;">${FCFA(sub() + f)}</b>
    </div>
  `;
}

function track(num) {
  const o = store.get('bcw_orders', []).find(x => x.num == num.trim().toUpperCase());
  const r = $('#res');
  if (!r) return;

  if (!o) {
    r.innerHTML = num ? '<p class="err">Aucune commande trouvée avec ce numéro. Vérifiez votre référence (ex: BCW-...).</p>' : '';
    return;
  }

  if (o.statut === 'Annulée') {
    r.innerHTML = `
      <div style="background:#FFF; padding:20px; border-radius:var(--r); border:1px solid var(--border);">
        <h3 style="margin-bottom:8px;">Commande ${esc(o.num)}</h3>
        <p><span class="pill" style="background:#FCE8E8; color:#B3261E;">Annulée</span> Veuillez contacter le restaurant pour plus d'informations.</p>
      </div>
    `;
    return;
  }

  const seq = STAT.slice(0, 6).filter(s => o.mode === 'livraison' || s !== 'En livraison');
  const i = seq.indexOf(o.statut);

  r.innerHTML = `
    <div class="track-box">
      <div class="row" style="margin-bottom:12px;">
        <h3>Commande ${esc(o.num)}</h3>
        <b style="color:var(--or); font-size:18px;">${FCFA(o.total)}</b>
      </div>
      <p style="margin-bottom:18px;">
        <span class="pill">Statut : ${esc(o.statut)}</span>
        <span class="pill" style="background:var(--gold-soft); color:var(--ink);">Paiement : ${esc(o.paiement)}</span>
      </p>
      <ul class="tl">
        ${seq.map((s, k) => `
          <li class="${k < i ? 'ok' : k === i ? 'now' : ''}">${s}</li>
        `).join('')}
      </ul>
      <p style="color:var(--mu); font-size:14px; border-top:1px solid var(--border); padding-top:12px;">
        Destinataire : <b>${esc(o.nom)}</b> (${esc(o.tel)}) · ${o.mode === 'livraison' ? `Livraison : ${esc(o.quartier)}, ${esc(o.adresse)}` : 'Retrait au restaurant'}
      </p>
    </div>
  `;
}

const tf = $('#tf');
if (tf) {
  tf.onsubmit = e => {
    e.preventDefault();
    track($('#num').value);
  };
}

window.addEventListener('storage', () => {
  const numInput = $('#num');
  if (numInput && numInput.value) track(numInput.value);
});

// Initial boot
renderMenu();
renderCart();
