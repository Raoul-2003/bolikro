/**
 * BOLIKRO CHEZ WOLF — Console Staff, Superviseur & Administration Restaurant
 */

const A = document.getElementById('app');
let tab = 'o'; // 'o' (commandes), 's' (statistiques), 'm' (carte des plats)
let currentRole = sessionStorage.getItem('user_role') || null; // 'admin' ou 'superviseur'

const G = () => store.get('bcw_menu', DEF);
const O = () => store.get('bcw_orders', []);
const B = () => document.getElementById('b');

const sel = (l, v, k, i, disabled = false) => `
  <select data-k="${k}" data-i="${i}" style="min-height:38px; font-weight:600;" ${disabled ? 'disabled' : ''}>
    ${l.map(s => `<option ${s == v ? 'selected' : ''}>${s}</option>`).join('')}
  </select>
`;

function login() {
  A.innerHTML = `
    <div class="oc" style="max-width:440px; margin:10vh auto; padding:32px; border:2px solid var(--border); box-shadow:var(--shadow-md);">
      <div style="text-align:center; margin-bottom:24px;">
        <img src="assets/images/logo.png" style="width:72px; height:72px; border-radius:50%; margin:auto; background:#FFF; padding:2px; border:2px solid var(--gold);" onerror="this.onerror=null;this.src='Logo.png'">
        <h1 style="font-size:24px; margin-top:12px; font-family:var(--f1);">Espace Restaurant</h1>
        <p style="font-size:13.5px; color:var(--mu); margin-top:4px;">Bolikro Chez Wolf — Gestion & Supervision</p>
      </div>

      <div style="background:var(--iv); border:1px solid var(--border); border-radius:10px; padding:14px; margin-bottom:20px; font-size:13px; color:var(--tx);">
        <strong style="color:var(--or); display:block; margin-bottom:6px;">Accès disponibles :</strong>
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span>👑 <b>Administrateur</b> :</span> <code>admin2026</code>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span>🛡️ <b>Superviseur</b> :</span> <code>wolf</code>
        </div>
      </div>

      <label for="roleSelect" style="font-weight:700; margin-bottom:6px; display:block;">Profil de connexion</label>
      <select id="roleSelect" style="width:100%; min-height:42px; margin-bottom:14px; font-weight:600; padding:8px 12px; border-radius:8px; border:1px solid #CDBFA8;">
        <option value="superviseur">🛡️ Superviseur (Gestion & Traitement des commandes)</option>
        <option value="admin">👑 Administrateur (Accès Total & Statistiques)</option>
      </select>

      <label for="pw" style="font-weight:700; margin-bottom:6px; display:block;">Mot de passe</label>
      <input id="pw" type="password" placeholder="Entrez le mot de passe" style="width:100%; min-height:42px; margin-bottom:12px;">
      
      <p class="err" id="e" style="margin:4px 0 10px;"></p>
      <button class="btn dk" id="ok" style="width:100%; min-height:46px; font-size:15px; font-weight:700; justify-content:center;">Se connecter</button>

      <div style="text-align:center; margin-top:20px;">
        <a href="index.html" style="font-size:13.5px; color:var(--mu); text-decoration:none;">← Retour au site public</a>
      </div>
    </div>
  `;

  document.getElementById('ok').onclick = () => {
    const role = document.getElementById('roleSelect').value;
    const pwd = document.getElementById('pw').value.trim();
    const err = document.getElementById('e');

    if (role === 'admin') {
      if (pwd === 'admin2026' || pwd === 'admin') {
        sessionStorage.setItem('adm', '1');
        sessionStorage.setItem('user_role', 'admin');
        currentRole = 'admin';
        tab = 's'; // Afficher directement les statistiques à l'admin
        view();
      } else {
        err.textContent = 'Mot de passe Administrateur incorrect. (Essayez: admin2026)';
      }
    } else {
      if (pwd === 'wolf' || pwd === 'superviseur') {
        sessionStorage.setItem('adm', '1');
        sessionStorage.setItem('user_role', 'superviseur');
        currentRole = 'superviseur';
        tab = 'o'; // Superviseur va directement sur les commandes
        view();
      } else {
        err.textContent = 'Mot de passe Superviseur incorrect. (Essayez: wolf)';
      }
    }
  };

  document.getElementById('pw').addEventListener('keypress', e => {
    if (e.key === 'Enter') document.getElementById('ok').click();
  });
}

function view() {
  if (!sessionStorage.getItem('adm')) return login();
  currentRole = sessionStorage.getItem('user_role') || 'superviseur';
  const isAdmin = currentRole === 'admin';

  A.innerHTML = `
    <div class="row" style="margin-bottom:20px; flex-wrap:wrap; gap:16px;">
      <div style="display:flex; align-items:center; gap:14px;">
        <img src="assets/images/logo.png" style="height:50px; width:50px; border-radius:50%; background:#FFF; border:2px solid var(--gold);" onerror="this.onerror=null;this.src='Logo.png'">
        <div>
          <div style="display:flex; align-items:center; gap:10px;">
            <h1 style="font-size:24px; margin:0; font-family:var(--f1);">Bolikro Chez Wolf</h1>
            <span class="badge-role ${isAdmin ? 'admin' : 'superviseur'}">
              ${isAdmin ? '👑 Administrateur (Global)' : '🛡️ Superviseur (Cuisine)'}
            </span>
          </div>
          <span style="font-size:13px; color:var(--mu);">
            ${isAdmin ? 'Vue complète sur les ventes, statistiques, commandes et la carte' : 'Validation, acceptation et refus des commandes en cuisine'}
          </span>
        </div>
      </div>
      <div style="display:flex; gap:12px; align-items:center; margin-left:auto;">
        <a href="index.html" class="btn ln" style="color:var(--ink); font-size:13.5px; padding:8px 14px;">← Site public</a>
        <button class="btn dk" onclick="sessionStorage.removeItem('adm'); sessionStorage.removeItem('user_role'); login();" style="padding:8px 16px; min-height:38px; font-size:13px;">Déconnexion</button>
      </div>
    </div>

    <!-- Navigation onglets -->
    <div class="at" style="flex-wrap:wrap;">
      ${isAdmin ? `
        <button data-t="s" aria-pressed="${tab === 's'}" style="display:inline-flex; align-items:center; gap:8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/></svg>
          <span>Tableau de Bord & Statistiques</span>
        </button>
      ` : ''}

      <button data-t="o" aria-pressed="${tab === 'o'}" style="display:inline-flex; align-items:center; gap:8px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM12 18l4-4h-3V9h-2v5H8z"/></svg>
        <span>Gestion des Commandes (${O().length})</span>
      </button>

      ${isAdmin ? `
        <button data-t="m" aria-pressed="${tab === 'm'}" style="display:inline-flex; align-items:center; gap:8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
          <span>Carte des Plats & Prix</span>
        </button>
      ` : ''}
    </div>

    <div id="b"></div>
  `;

  if (tab === 's' && isAdmin) stats();
  else if (tab === 'm' && isAdmin) dishes();
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

  // Chiffre d'affaires total
  const caTotal = acceptees.reduce((sum, x) => sum + (x.total || 0), 0);

  // Commandes par mode
  const nbLivraison = o.filter(x => x.mode === 'livraison').length;
  const nbSurPlace = o.filter(x => x.mode !== 'livraison').length;

  // Calcul des plats les plus vendus
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
    .slice(0, 5);

  B().innerHTML = `
    <!-- Cartes KPI statistiques -->
    <div class="stats-grid">
      <div class="stat-card green">
        <div class="lbl">Chiffre d'Affaires</div>
        <div class="val">${FCFA(caTotal)}</div>
        <small style="color:var(--mu);">${acceptees.length} commande(s) confirmée(s)</small>
      </div>

      <div class="stat-card blue">
        <div class="lbl">Total Commandes</div>
        <div class="val">${totalCommandes}</div>
        <small style="color:var(--mu);">${nbLivraison} livraisons • ${nbSurPlace} retraits</small>
      </div>

      <div class="stat-card gold">
        <div class="lbl">En Traitement</div>
        <div class="val">${enAttente + preparees}</div>
        <small style="color:#b74b00; font-weight:600;">${enAttente} à valider • ${preparees} en cours</small>
      </div>

      <div class="stat-card red">
        <div class="lbl">Commandes Refusées / Annulées</div>
        <div class="val">${annulees}</div>
        <small style="color:var(--mu);">${terminees} terminée(s) avec succès</small>
      </div>
    </div>

    <!-- Répartition & Top Ventes -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:20px; margin-bottom:24px;">
      <div class="oc">
        <h3 style="margin-bottom:14px; display:flex; align-items:center; gap:8px;">
          <span>🔥 Plats les Plus Populaires</span>
        </h3>
        ${topDishes.length ? `
          <ul style="list-style:none; padding:0; margin:0;">
            ${topDishes.map(([nom, quantite], idx) => `
              <li style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #f0e6d9;">
                <span><b>#${idx + 1}</b> ${esc(nom)}</span>
                <span class="pill" style="font-weight:700;">${quantite} portion(s)</span>
              </li>
            `).join('')}
          </ul>
        ` : '<p style="color:var(--mu); font-size:14px;">Aucune vente enregistrée pour le moment.</p>'}
      </div>

      <div class="oc">
        <h3 style="margin-bottom:14px;">📊 Vue Globale de l\'Activité</h3>
        <div style="display:flex; flex-direction:column; gap:10px; font-size:14px;">
          <div style="display:flex; justify-content:space-between; padding-bottom:6px; border-bottom:1px solid #f0e6d9;">
            <span>Nombre de plats sur la carte :</span>
            <b>${m.length} plats</b>
          </div>
          <div style="display:flex; justify-content:space-between; padding-bottom:6px; border-bottom:1px solid #f0e6d9;">
            <span>Plats disponibles en stock :</span>
            <b style="color:#2e7d32;">${m.filter(x => x.a).length} plats</b>
          </div>
          <div style="display:flex; justify-content:space-between; padding-bottom:6px; border-bottom:1px solid #f0e6d9;">
            <span>Plats épuisés :</span>
            <b style="color:#c62828;">${m.filter(x => !x.a).length} plats</b>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>Taux de satisfaction / validation :</span>
            <b>${totalCommandes > 0 ? Math.round(((totalCommandes - annulees) / totalCommandes) * 100) : 100}%</b>
          </div>
        </div>
      </div>
    </div>
  `;
}

function orders() {
  const o = O();
  const isAdmin = currentRole === 'admin';

  B().innerHTML = o.length ? `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h2 style="font-size:19px; margin:0;">Toutes les commandes en temps réel</h2>
      <span style="font-size:13px; color:var(--mu);">${o.length} commande(s) au total</span>
    </div>
    ${o.map((x, i) => {
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
              ${isEnAttente ? '<span style="background:#fff3e0; color:#e65100; font-size:12px; font-weight:800; padding:2px 8px; border-radius:4px; border:1px solid #ffe0b2;">À TRAITER</span>' : ''}
              ${isAnnulee ? '<span style="background:#ffebee; color:#c62828; font-size:12px; font-weight:800; padding:2px 8px; border-radius:4px; border:1px solid #ffcdd2;">REFUSÉE / ANNULÉE</span>' : ''}
              ${x.statut === 'Confirmée' ? '<span style="background:#e8f5e9; color:#2e7d32; font-size:12px; font-weight:800; padding:2px 8px; border-radius:4px; border:1px solid #c8e6c9;">ACCEPTÉE</span>' : ''}
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
              ${x.mode === 'livraison' ? `Livraison : <b>${esc(x.quartier || 'Non précisé')}</b> (${esc(x.adresse || 'Sans repère')})` : '<b>Retrait sur place au restaurant</b>'}
            </span>
          </small>

          <div style="background:var(--iv); padding:14px; border-radius:8px; border:1px solid var(--border); margin-bottom:14px;">
            <strong>Détail de la commande :</strong><br>
            <span style="font-size:14.5px; line-height:1.6;">${x.items.map(l => `<b>${l.q}×</b> ${esc(l.n)}`).join(' • ')}</span>
            ${x.note ? `<br><em style="color:var(--or2); font-size:13.5px; display:inline-block; margin-top:4px;">Note client : ${esc(x.note)}</em>` : ''}
          </div>

          <!-- Actions Rapides : Accepter / Refuser (Superviseur & Admin) -->
          <div style="background:#FBF8F1; padding:12px 14px; border-radius:8px; margin-bottom:14px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
            <span style="font-size:13.5px; font-weight:700;">Décision Rapide Superviseur :</span>
            <div style="display:flex; gap:10px; align-items:center;">
              <button class="btn-acc" data-accept="${i}" ${x.statut === 'Confirmée' ? 'disabled style="opacity:0.6; cursor:default;"' : ''}>
                ✓ Accepter la commande
              </button>
              <button class="btn-ref" data-reject="${i}" ${x.statut === 'Annulée' ? 'disabled style="opacity:0.6; cursor:default;"' : ''}>
                ✕ Refuser / Annuler
              </button>
            </div>
          </div>

          <!-- Changement de statut détaillé -->
          <div class="g">
            <div>
              <label style="margin-top:0;">Étape de préparation</label>
              ${sel(STAT, x.statut, 'statut', i)}
            </div>
            <div>
              <label style="margin-top:0;">Statut de paiement</label>
              ${sel(PAY, x.paiement, 'paiement', i, !isAdmin && false)}
            </div>
          </div>
        </div>
      `;
    }).join('')
  : '<p class="empty">Aucune commande enregistrée pour le moment.<br>Les nouvelles commandes passées par les clients apparaîtront ici automatiquement.</p>';
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

// Gestion des clics et interactions
A.addEventListener('click', e => {
  const t = e.target.closest('button') || e.target;
  const d = t.dataset;

  // Navigation onglets
  if (d.t) {
    tab = d.t;
    view();
  }

  // Action Accepter la commande (Superviseur & Admin)
  if (d.accept !== undefined) {
    const o = O();
    const idx = +d.accept;
    if (o[idx]) {
      o[idx].statut = 'Confirmée';
      store.set('bcw_orders', o);
      orders();
    }
  }

  // Action Refuser / Annuler la commande (Superviseur & Admin)
  if (d.reject !== undefined) {
    if (confirm('Confirmez-vous le REFUS de cette commande ? Le statut passera à Annulée.')) {
      const o = O();
      const idx = +d.reject;
      if (o[idx]) {
        o[idx].statut = 'Annulée';
        store.set('bcw_orders', o);
        orders();
      }
    }
  }

  // Suppression plat (Admin)
  if (d.del && confirm('Êtes-vous sûr de vouloir retirer ce plat du menu ?')) {
    store.set('bcw_menu', G().filter(x => x.id != d.del));
    dishes();
  }

  // Ajout plat (Admin)
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

// Changements sur selecteurs ou inputs
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

// Initialisation au chargement
view();
