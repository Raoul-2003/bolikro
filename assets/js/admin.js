/**
 * BOLIKRO CHEZ WOLF — Console Administrateur Général (Direction & Vue Globale)
 * Fichier dédié : admin.html / admin.js
 */

const A = document.getElementById('app');
let tab = 's'; // 's' (statistiques), 'o' (commandes), 'm' (carte)

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
    <div class="oc" style="max-width:420px; margin:12vh auto; padding:32px; border:2px solid var(--border); box-shadow:var(--shadow-md);">
      <div style="text-align:center; margin-bottom:20px;">
        <img src="assets/images/logo.png" style="width:72px; height:72px; border-radius:50%; margin:auto; background:#FFF; padding:2px; border:2px solid var(--gold);" onerror="this.onerror=null;this.src='Logo.png'">
        <h1 style="font-size:24px; margin-top:12px; font-family:var(--f1);">Administration Générale</h1>
        <p style="font-size:13.5px; color:var(--mu); margin-top:4px;">Bolikro Chez Wolf — Direction & Statistiques</p>
      </div>

      <div style="background:var(--iv); border:1px solid var(--border); border-radius:8px; padding:12px; margin-bottom:18px; font-size:13px; text-align:center;">
        Mot de passe administrateur : <b>admin2026</b>
      </div>

      <label for="pw" style="font-weight:700; margin-bottom:6px; display:block;">Mot de passe</label>
      <input id="pw" type="password" placeholder="Entrez le mot de passe administrateur" style="width:100%; min-height:42px; margin-bottom:12px;">
      
      <p class="err" id="e" style="margin:4px 0 10px;"></p>
      <button class="btn dk" id="ok" style="width:100%; min-height:46px; font-size:15px; font-weight:700; justify-content:center;">Connexion Administrateur</button>

      <div style="display:flex; justify-content:space-between; margin-top:20px; font-size:13px;">
        <a href="index.html" style="color:var(--mu); text-decoration:none;">← Site public</a>
        <a href="superviseur.html" style="color:#2e7d32; text-decoration:none; font-weight:700;">Accès Superviseur Cuisine →</a>
      </div>
    </div>
  `;

  document.getElementById('ok').onclick = () => {
    const pwd = document.getElementById('pw').value.trim();
    if (pwd === 'admin2026' || pwd === 'admin') {
      sessionStorage.setItem('adm_auth', '1');
      view();
    } else {
      document.getElementById('e').textContent = 'Mot de passe administrateur incorrect.';
    }
  };

  document.getElementById('pw').addEventListener('keypress', e => {
    if (e.key === 'Enter') document.getElementById('ok').click();
  });
}

function view() {
  if (!sessionStorage.getItem('adm_auth')) return login();

  A.innerHTML = `
    <div class="row" style="margin-bottom:20px; flex-wrap:wrap; gap:16px;">
      <div style="display:flex; align-items:center; gap:14px;">
        <img src="assets/images/logo.png" style="height:50px; width:50px; border-radius:50%; background:#FFF; border:2px solid var(--gold);" onerror="this.onerror=null;this.src='Logo.png'">
        <div>
          <div style="display:flex; align-items:center; gap:10px;">
            <h1 style="font-size:24px; margin:0; font-family:var(--f1);">Administration Restaurant</h1>
            <span class="badge-role admin">👑 Administrateur Général</span>
          </div>
          <span style="font-size:13px; color:var(--mu);">Vue globale sur les statistiques, ventes, commandes et la carte</span>
        </div>
      </div>
      <div style="display:flex; gap:10px; align-items:center; margin-left:auto;">
        <a href="index.html" class="btn ln" style="color:var(--ink); font-size:13px; padding:7px 12px;">← Site public</a>
        <a href="superviseur.html" class="btn ln" style="color:#2e7d32; font-size:13px; padding:7px 12px; font-weight:700;">Espace Superviseur</a>
        <button class="btn dk" onclick="sessionStorage.removeItem('adm_auth'); login();" style="padding:7px 14px; min-height:36px; font-size:13px;">Déconnexion</button>
      </div>
    </div>

    <!-- Onglets Administrateur -->
    <div class="at" style="flex-wrap:wrap;">
      <button data-t="s" aria-pressed="${tab === 's'}" style="display:inline-flex; align-items:center; gap:8px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/></svg>
        <span>Tableau de Bord & Statistiques</span>
      </button>

      <button data-t="o" aria-pressed="${tab === 'o'}" style="display:inline-flex; align-items:center; gap:8px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM12 18l4-4h-3V9h-2v5H8z"/></svg>
        <span>Toutes les Commandes (${O().length})</span>
      </button>

      <button data-t="m" aria-pressed="${tab === 'm'}" style="display:inline-flex; align-items:center; gap:8px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
        <span>Gestion de la Carte (${G().length} plats)</span>
      </button>
    </div>

    <div id="b"></div>
  `;

  if (tab === 's') stats();
  else if (tab === 'm') dishes();
  else orders();
}

function stats() {
  const o = O();
  const m = G();
  
  const totalCommandes = o.length;
  const acceptees = o.filter(x => x.statut !== 'Annulée');
  const enAttente = o.filter(x => x.statut === 'En attente').length;
  const preparees = o.filter(x => ['Confirmée', 'En préparation', 'Prête', 'En livraison'].includes(x.statut)).length;
  const terminees = o.filter(x => x.statut === 'Terminée').length;
  const annulees = o.filter(x => x.statut === 'Annulée').length;

  const caTotal = acceptees.reduce((sum, x) => sum + (x.total || 0), 0);
  const nbLivraison = o.filter(x => x.mode === 'livraison').length;
  const nbSurPlace = o.filter(x => x.mode !== 'livraison').length;

  // Calcul du classement des ventes
  const dishSales = {};
  o.forEach(order => {
    if (order.statut !== 'Annulée' && order.items) {
      order.items.forEach(it => {
        dishSales[it.n] = (dishSales[it.n] || 0) + (it.q || 1);
      });
    }
  });

  const topDishes = Object.entries(dishSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  B().innerHTML = `
    <!-- Cartes KPI statistiques -->
    <div class="stats-grid">
      <div class="stat-card green">
        <div class="lbl">Chiffre d'Affaires Réalisé</div>
        <div class="val">${FCFA(caTotal)}</div>
        <small style="color:var(--mu);">${acceptees.length} commande(s) confirmée(s)</small>
      </div>

      <div class="stat-card blue">
        <div class="lbl">Commandes Reçues</div>
        <div class="val">${totalCommandes}</div>
        <small style="color:var(--mu);">${nbLivraison} livraisons • ${nbSurPlace} retraits</small>
      </div>

      <div class="stat-card gold">
        <div class="lbl">En Cours de Traitement</div>
        <div class="val">${enAttente + preparees}</div>
        <small style="color:#b74b00; font-weight:600;">${enAttente} à valider • ${preparees} en préparation</small>
      </div>

      <div class="stat-card red">
        <div class="lbl">Commandes Refusées / Annulées</div>
        <div class="val">${annulees}</div>
        <small style="color:var(--mu);">${terminees} livrées/terminées</small>
      </div>
    </div>

    <!-- Répartition et classements -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:20px; margin-bottom:24px;">
      <div class="oc">
        <h3 style="margin-bottom:14px;">🔥 Top Plats les Plus Vendus</h3>
        ${topDishes.length ? `
          <ul style="list-style:none; padding:0; margin:0;">
            ${topDishes.map(([nom, quantite], idx) => `
              <li style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #f0e6d9;">
                <span><b>#${idx + 1}</b> ${esc(nom)}</span>
                <span class="pill" style="font-weight:700;">${quantite} portion(s) vendue(s)</span>
              </li>
            `).join('')}
          </ul>
        ` : '<p style="color:var(--mu); font-size:14px;">Aucune vente enregistrée pour le moment.</p>'}
      </div>

      <div class="oc">
        <h3 style="margin-bottom:14px;">📊 Métriques de Performance</h3>
        <div style="display:flex; flex-direction:column; gap:10px; font-size:14px;">
          <div style="display:flex; justify-content:space-between; padding-bottom:6px; border-bottom:1px solid #f0e6d9;">
            <span>Plats inscrits au menu :</span>
            <b>${m.length} plats</b>
          </div>
          <div style="display:flex; justify-content:space-between; padding-bottom:6px; border-bottom:1px solid #f0e6d9;">
            <span>Plats actifs en stock :</span>
            <b style="color:#2e7d32;">${m.filter(x => x.a).length} plats</b>
          </div>
          <div style="display:flex; justify-content:space-between; padding-bottom:6px; border-bottom:1px solid #f0e6d9;">
            <span>Plats en rupture :</span>
            <b style="color:#c62828;">${m.filter(x => !x.a).length} plats</b>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>Taux de conversion / validation :</span>
            <b>${totalCommandes > 0 ? Math.round(((totalCommandes - annulees) / totalCommandes) * 100) : 100}%</b>
          </div>
        </div>
      </div>
    </div>
  `;
}

function orders() {
  const o = O();

  B().innerHTML = o.length ? o.map((x, i) => {
    const isEnAttente = x.statut === 'En attente';
    const isAnnulee = x.statut === 'Annulée';
    const isConfirmee = ['Confirmée', 'En préparation', 'Prête', 'En livraison', 'Terminée'].includes(x.statut);

    return `
      <div class="oc" style="border-left: 5px solid ${isAnnulee ? '#c62828' : isConfirmee ? '#2e7d32' : 'var(--or)'};">
        <div class="row" style="margin-bottom:10px;">
          <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
            <h3 style="margin:0;">
              <span style="color:var(--or); font-weight:800;">${esc(x.num)}</span> · ${esc(x.nom)}
            </h3>
            ${isEnAttente ? '<span style="background:#fff3e0; color:#e65100; font-size:12px; font-weight:800; padding:2px 8px; border-radius:4px; border:1px solid #ffe0b2;">À VALIDER</span>' : ''}
            ${isAnnulee ? '<span style="background:#ffebee; color:#c62828; font-size:12px; font-weight:800; padding:2px 8px; border-radius:4px; border:1px solid #ffcdd2;">REFUSÉE / ANNULÉE</span>' : ''}
            ${x.statut === 'Confirmée' ? '<span style="background:#e8f5e9; color:#2e7d32; font-size:12px; font-weight:800; padding:2px 8px; border-radius:4px; border:1px solid #c8e6c9;">CONFIRMÉE</span>' : ''}
          </div>
          <b style="font-size:20px; color:var(--ink); font-family:var(--f1);">${FCFA(x.total)}</b>
        </div>

        <small style="color:var(--mu); display:flex; align-items:center; flex-wrap:wrap; gap:14px; margin-bottom:12px; font-size:13.5px;">
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
            ${x.mode === 'livraison' ? `Livraison : <b>${esc(x.quartier || 'Non précisé')}</b> (${esc(x.adresse || 'Sans repère')})` : '<b>Retrait sur place</b>'}
          </span>
        </small>

        <div style="background:var(--iv); padding:14px; border-radius:8px; border:1px solid var(--border); margin-bottom:14px;">
          <strong>Détail des plats :</strong><br>
          <span style="font-size:14.5px; line-height:1.6;">${x.items.map(l => `<b>${l.q}×</b> ${esc(l.n)}`).join(' • ')}</span>
          ${x.note ? `<br><em style="color:var(--or2); font-size:13.5px; display:inline-block; margin-top:4px;">Note client : ${esc(x.note)}</em>` : ''}
        </div>

        <!-- Décision Administrateur : Accepter / Refuser -->
        <div style="background:#FBF8F1; padding:12px 14px; border-radius:8px; margin-bottom:14px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
          <span style="font-size:13.5px; font-weight:700;">Action Directe :</span>
          <div style="display:flex; gap:10px; align-items:center;">
            <button class="btn-acc" data-num="${x.num}" data-action="accept" ${x.statut === 'Confirmée' ? 'disabled style="opacity:0.6; cursor:default;"' : ''}>
              ✓ Valider la commande
            </button>
            <button class="btn-ref" data-num="${x.num}" data-action="reject" ${x.statut === 'Annulée' ? 'disabled style="opacity:0.6; cursor:default;"' : ''}>
              ✕ Refuser / Annuler
            </button>
          </div>
        </div>

        <div class="g">
          <div>
            <label style="margin-top:0;">Étape de préparation</label>
            ${sel(STAT, x.statut, 'statut', i)}
          </div>
          <div>
            <label style="margin-top:0;">Statut de paiement</label>
            ${sel(PAY, x.paiement, 'paiement', i)}
          </div>
        </div>
      </div>
    `;
  }).join('') : '<p class="empty">Aucune commande enregistrée pour le moment.</p>';
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
              <img src="${d.img || 'assets/images/hero.jpg'}" style="width:42px; height:42px; border-radius:6px; object-fit:cover;" onerror="this.onerror=null;this.src='assets/images/hero.jpg'">
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
  const t = e.target.closest('button') || e.target;
  const d = t.dataset;

  if (d.t) {
    tab = d.t;
    view();
  }

  if (d.action === 'accept') {
    const o = O();
    const cmd = o.find(y => y.num === d.num);
    if (cmd) {
      cmd.statut = 'Confirmée';
      store.set('bcw_orders', o);
      orders();
    }
  }

  if (d.action === 'reject') {
    if (confirm(`Confirmez-vous l'annulation de la commande ${d.num} ?`)) {
      const o = O();
      const cmd = o.find(y => y.num === d.num);
      if (cmd) {
        cmd.statut = 'Annulée';
        store.set('bcw_orders', o);
        orders();
      }
    }
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
