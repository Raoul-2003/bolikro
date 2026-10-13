/**
 * BOLIKRO CHEZ WOLF — Console Staff & Administration Cuisine (Modèle Final)
 */

const A = document.getElementById('app');
let tab = 'o';

const G = () => store.get('bcw_menu', DEF);
const O = () => store.get('bcw_orders', []);
const B = () => document.getElementById('b');

const sel = (l, v, k, i) => `
  <select data-k="${k}" data-i="${i}" style="min-height:38px; font-weight:600;">
    ${l.map(s => `<option ${s == v ? 'selected' : ''}>${s}</option>`).join('')}
  </select>
`;

function login() {
  A.innerHTML = `
    <div class="oc" style="max-width:400px; margin:14vh auto; padding:32px; border:2px solid var(--border);">
      <div style="text-align:center; margin-bottom:20px;">
        <img src="assets/images/logo.png" style="width:70px; height:70px; border-radius:50%; margin:auto; background:#FFF; padding:2px; border:2px solid var(--gold);">
        <h1 style="font-size:24px; margin-top:12px;">Espace Staff & Cuisine</h1>
        <p style="font-size:13.5px; color:var(--mu);">Bolikro Chez Wolf</p>
      </div>
      <p class="note" style="margin-bottom:16px;">Mot de passe de test : <b>wolf</b></p>
      <label for="pw">Mot de passe</label>
      <input id="pw" type="password" placeholder="Entrez le mot de passe" style="margin-bottom:12px;">
      <p class="err" id="e"></p>
      <button class="btn dk" id="ok" style="width:100%; margin-top:8px;">Se connecter</button>
    </div>
  `;

  document.getElementById('ok').onclick = () => {
    if (document.getElementById('pw').value.trim() === 'wolf') {
      sessionStorage.setItem('adm', '1');
      view();
    } else {
      document.getElementById('e').textContent = 'Mot de passe incorrect.';
    }
  };

  document.getElementById('pw').addEventListener('keypress', e => {
    if (e.key === 'Enter') document.getElementById('ok').click();
  });
}

function view() {
  if (!sessionStorage.getItem('adm')) return login();

  A.innerHTML = `
    <div class="row" style="margin-bottom:20px; flex-wrap:wrap;">
      <div style="display:flex; align-items:center; gap:14px;">
        <img src="assets/images/logo.png" style="height:48px; width:48px; border-radius:50%; background:#FFF; border:2px solid var(--gold);">
        <div>
          <h1 style="font-size:26px; margin:0;">Administration Restaurant</h1>
          <span style="font-size:13px; color:var(--mu);">Console de traitement en direct</span>
        </div>
      </div>
      <div style="display:flex; gap:12px; align-items:center;">
        <a href="index.html" class="btn ln" style="color:var(--ink); font-size:14px;">← Voir le site public</a>
        <button class="btn dk" onclick="sessionStorage.removeItem('adm'); login();" style="padding:0 16px; min-height:40px; font-size:13px;">Déconnexion</button>
      </div>
    </div>

    <div class="at">
      <button data-t="o" aria-pressed="${tab === 'o'}" style="display:inline-flex; align-items:center; gap:8px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM12 18l4-4h-3V9h-2v5H8z"/></svg>
        <span>Commandes en direct (${O().length})</span>
      </button>
      <button data-t="m" aria-pressed="${tab === 'm'}" style="display:inline-flex; align-items:center; gap:8px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
        <span>Carte des Plats & Stocks</span>
      </button>
    </div>
    <div id="b"></div>
  `;

  tab === 'o' ? orders() : dishes();
}

function orders() {
  const o = O();
  B().innerHTML = o.length ? o.map((x, i) => `
    <div class="oc">
      <div class="row" style="margin-bottom:10px;">
        <h3>
          <span style="color:var(--or); font-weight:800;">${esc(x.num)}</span> · ${esc(x.nom)}
        </h3>
        <b style="font-size:19px; color:var(--ink); font-family:var(--f1);">${FCFA(x.total)}</b>
      </div>

      <small style="color:var(--mu); display:flex; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:10px; font-size:13.5px;">
        <span style="display:inline-flex; align-items:center; gap:5px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/></svg>
          ${new Date(x.date).toLocaleString('fr-FR')}
        </span>
        <span style="display:inline-flex; align-items:center; gap:5px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--or)"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
          <a href="tel:${esc(x.tel)}" style="color:var(--or); font-weight:700;">${esc(x.tel)}</a>
        </span>
        <span style="display:inline-flex; align-items:center; gap:5px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19 7c0-1.1-.9-2-2-2h-3v2h3v2.65L13.52 14H10V9H6c-2.21 0-4 1.79-4 4v3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4.48L19 10.35V7zM7 17c-.55 0-1-.45-1-1h2c0 .55-.45 1-1 1zm12-1c0 1.66-1.34 3-3 3s-3-1.34-3-3h2c0 .55.45 1 1 1s1-.45 1-1h2z"/></svg>
          ${x.mode === 'livraison' ? `Livraison : <b>${esc(x.quartier)}</b> (${esc(x.adresse)})` : '<b>Retrait au restaurant</b>'}
        </span>
      </small>

      <div style="background:var(--iv); padding:12px; border-radius:8px; border:1px solid var(--border); margin-bottom:12px;">
        <strong>Plats commandés :</strong><br>
        <span style="font-size:14.5px;">${x.items.map(l => `${l.q} × ${esc(l.n)}`).join(' • ')}</span>
        ${x.note ? `<br><em style="color:var(--or2); font-size:13.5px;">Note client : ${esc(x.note)}</em>` : ''}
      </div>

      <div class="g">
        <div>
          <label style="margin-top:0;">Statut de préparation</label>
          ${sel(STAT, x.statut, 'statut', i)}
        </div>
        <div>
          <label style="margin-top:0;">Statut de règlement</label>
          ${sel(PAY, x.paiement, 'paiement', i)}
        </div>
      </div>
    </div>
  `).join('') : '<p class="empty">Aucune commande enregistrée pour le moment.<br>Les nouvelles commandes passées sur le site apparaîtront ici automatiquement.</p>';
}

function dishes() {
  const m = G();
  B().innerHTML = `
    <table class="tbl">
      <thead>
        <tr>
          <th>Photo</th>
          <th>Plat</th>
          <th>Catégorie</th>
          <th>Prix FCFA</th>
          <th style="text-align:center;">En Stock</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${m.map(d => `
          <tr>
            <td style="width:50px;">
              <img src="${d.img || 'assets/images/hero.jpg'}" style="width:42px; height:42px; border-radius:6px; object-fit:cover;">
            </td>
            <td><strong>${esc(d.n)}</strong></td>
            <td><span class="pill" style="font-size:12px;">${esc(d.c)}</span></td>
            <td style="width:130px;">
              <input type="number" min="0" value="${d.p}" data-pr="${d.id}" style="width:110px; font-weight:700;">
            </td>
            <td style="text-align:center; width:90px;">
              <input type="checkbox" ${d.a ? 'checked' : ''} data-av="${d.id}" style="width:22px; height:22px; cursor:pointer;">
            </td>
            <td style="text-align:right;">
              <button class="x" data-del="${d.id}">Supprimer</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="oc" style="margin-top:20px;">
      <h3>Ajouter un Nouveau Plat au Menu</h3>
      <div class="g" style="margin-top:10px;">
        <input id="an" placeholder="Nom du plat (ex: Demi Poulet Braisé)">
        <select id="ac">
          ${CATS.map(c => `<option>${c}</option>`).join('')}
        </select>
        <input id="ap" type="number" placeholder="Prix en FCFA (ex: 4500)">
        <input id="ad" placeholder="Courte description alléchante...">
      </div>
      <button class="btn dk" id="add" style="margin-top:14px;">+ Ajouter le plat à la carte</button>
    </div>
  `;
}

A.addEventListener('click', e => {
  const t = e.target;
  const d = t.dataset;

  if (d.t) {
    tab = d.t;
    view();
  }

  if (d.del && confirm('Êtes-vous sûr de vouloir retirer ce plat du menu ?')) {
    store.set('bcw_menu', G().filter(x => x.id != d.del));
    dishes();
  }

  if (t.id === 'add') {
    const n = document.getElementById('an').value.trim();
    const p = +document.getElementById('ap').value;
    const desc = document.getElementById('ad').value.trim();
    const cat = document.getElementById('ac').value;

    if (!n || !(p >= 0)) return alert('Le nom et le prix en FCFA sont obligatoires.');

    const m = G();
    m.push({
      id: Date.now(),
      n: n,
      c: cat,
      p: p,
      d: desc || 'Préparation artisanale aux saveurs de Côte d\'Ivoire.',
      img: 'assets/images/hero.jpg',
      badge: 'Nouveau',
      a: true
    });
    store.set('bcw_menu', m);
    dishes();
  }
});

A.addEventListener('change', e => {
  const t = e.target;
  const d = t.dataset;

  if (d.k) {
    const o = O();
    o[d.i][d.k] = t.value;
    store.set('bcw_orders', o);
  }

  if (d.pr || d.av) {
    const m = G();
    const x = m.find(y => y.id == (d.pr || d.av));
    if (x) {
      if (d.pr) x.p = +t.value;
      else x.a = t.checked;
      store.set('bcw_menu', m);
    }
  }
});

view();
