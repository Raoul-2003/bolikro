/**
 * BOLIKRO CHEZ WOLF — Console Administrateur Général (Design Moderne Type Lead Enterprise)
 * Modèle inspiré : Sidebar gauche sombre avec icônes, Topbar complète,
 * KPI Cards dégradées vives (Bleu, Orange, Violet, Indigo), Graphiques Vectoriels et Gestion Intégrale.
 */

const A = document.getElementById('app');
let currentTab = 'dashboard'; // 'dashboard', 'orders', 'menu', 'customers'

const G = () => store.get('bcw_menu', DEF);
const O = () => store.get('bcw_orders', []);

function getNowFormatted() {
  const d = new Date();
  return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function login() {
  A.innerHTML = `
    <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; background:#1e1e2d; padding:20px;">
      <div style="width:100%; max-width:420px; background:#fff; border-radius:16px; padding:36px; box-shadow:0 20px 40px rgba(0,0,0,0.3);">
        <div style="text-align:center; margin-bottom:28px;">
          <img src="assets/images/logo.png" style="width:76px; height:76px; border-radius:16px; object-fit:cover; margin-bottom:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1);" onerror="this.onerror=null;this.src='Logo.png'">
          <h2 style="font-size:22px; font-weight:800; color:#181c32; margin:0 0 6px;">Bolikro Chez Wolf</h2>
          <span style="font-size:12.5px; color:#7e8299; font-weight:600; text-transform:uppercase; letter-spacing:0.8px;">Enterprise Admin Console</span>
        </div>

        <div style="background:#f4f6fa; border:1px solid #ebedf2; border-radius:10px; padding:12px 16px; margin-bottom:20px; font-size:13px; color:#3f4254; display:flex; justify-content:space-between; align-items:center;">
          <span>Mot de passe requis :</span>
          <code style="background:#fff; padding:3px 8px; border-radius:6px; font-weight:700; color:#e86f1c; border:1px solid #e1e3ea;">admin2026</code>
        </div>

        <label style="font-size:12.5px; font-weight:700; color:#3f4254; margin-bottom:6px; display:block;">Mot de Passe Administrateur</label>
        <input id="admin_pwd" type="password" placeholder="Entrez votre mot de passe" style="width:100%; min-height:46px; border-radius:10px; border:1px solid #e1e3ea; padding:0 14px; font-size:14px; margin-bottom:8px; outline:none; transition:border 0.2s;">
        
        <p id="auth_err" style="color:#f5222d; font-size:13px; font-weight:600; margin:0 0 14px; min-height:20px;"></p>
        
        <button id="btn_login" style="width:100%; min-height:48px; background:linear-gradient(135deg, #e86f1c 0%, #c7560a 100%); color:#fff; border:none; border-radius:10px; font-size:15px; font-weight:700; cursor:pointer; box-shadow:0 6px 16px rgba(232,111,28,0.35); transition:transform 0.15s;">
          Accéder au Tableau de Bord
        </button>

        <div style="display:flex; justify-content:space-between; margin-top:24px; font-size:13px;">
          <a href="index.html" style="color:#7e8299; text-decoration:none; font-weight:600;">← Site Public</a>
          <a href="superviseur.html" style="color:#2e7d32; text-decoration:none; font-weight:700;">Espace Superviseur →</a>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn_login').onclick = () => {
    const pwd = document.getElementById('admin_pwd').value.trim();
    if (pwd === 'admin2026' || pwd === 'admin') {
      sessionStorage.setItem('adm_auth', '1');
      view();
    } else {
      document.getElementById('auth_err').textContent = 'Mot de passe incorrect. Utilisez : admin2026';
    }
  };

  document.getElementById('admin_pwd').addEventListener('keypress', e => {
    if (e.key === 'Enter') document.getElementById('btn_login').click();
  });
}

function view() {
  if (!sessionStorage.getItem('adm_auth')) return login();

  const o = O();
  const m = G();
  const totalOrders = o.length;
  const acceptees = o.filter(x => x.statut !== 'Annulée');
  const totalRevenue = acceptees.reduce((acc, cur) => acc + (cur.total || 0), 0);
  const pendingOrders = o.filter(x => x.statut === 'En attente').length;
  const inProgress = o.filter(x => ['Confirmée', 'En préparation', 'Prête', 'En livraison'].includes(x.statut)).length;

  A.innerHTML = `
    <div class="dash-layout">
      <!-- SIDEBAR GAUCHE SOMBRE -->
      <aside class="dash-sidebar">
        <div class="dash-brand">
          <img src="assets/images/logo.png" alt="Logo" onerror="this.onerror=null;this.src='Logo.png'">
          <div class="dash-brand-title">BOLIKRO ADMIN</div>
        </div>

        <div class="dash-user-badge">
          <div class="admin-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Administrateur
          </div>
          <div class="live-clock">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${getNowFormatted()}
          </div>
        </div>

        <nav class="dash-nav">
          <div class="dash-nav-header">Navigation Principale</div>
          
          <button class="dash-nav-item ${currentTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
            <span>Tableau de Bord</span>
          </button>

          <button class="dash-nav-item ${currentTab === 'orders' ? 'active' : ''}" data-tab="orders">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM12 18l4-4h-3V9h-2v5H8z"/></svg>
            <span>Toutes les Commandes</span>
            <span class="dash-nav-badge">${totalOrders}</span>
          </button>

          <button class="dash-nav-item ${currentTab === 'menu' ? 'active' : ''}" data-tab="menu">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
            <span>Carte & Prix des Plats</span>
            <span class="dash-nav-badge">${m.length}</span>
          </button>

          <div class="dash-nav-header" style="margin-top:16px;">Passerelles & Équipe</div>

          <a href="superviseur.html" class="dash-nav-item" style="color:#52c41a;">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            <span>Espace Superviseur</span>
          </a>

          <a href="index.html" class="dash-nav-item">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            <span>Voir le Site Public</span>
          </a>
        </nav>
      </aside>

      <!-- ZONE CENTRALE & TOPBAR -->
      <div class="dash-main">
        <!-- TOPBAR EN-TÊTE -->
        <header class="dash-topbar">
          <div class="dash-topbar-left">
            <div>
              <h1 class="dash-page-title">${currentTab === 'dashboard' ? 'Dashboard' : currentTab === 'orders' ? 'Gestion des Commandes' : 'Gestion de la Carte'}</h1>
              <div class="dash-breadcrumbs">Bolikro Chez Wolf / Administration / ${currentTab.toUpperCase()}</div>
            </div>
          </div>

          <div class="dash-topbar-right">
            <!-- Notifications avec compteur -->
            <div class="topbar-icon-btn" title="Commandes à valider" onclick="currentTab='orders'; view();">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              ${pendingOrders > 0 ? `<span class="badge-dot">${pendingOrders}</span>` : ''}
            </div>

            <!-- Bouton Déconnexion -->
            <button class="topbar-icon-btn" title="Se déconnecter" onclick="sessionStorage.removeItem('adm_auth'); login();">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f5222d" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>

            <!-- Profil utilisateur avec badge -->
            <div class="topbar-profile">
              <img src="assets/images/logo.png" alt="Admin Avatar" onerror="this.onerror=null;this.src='Logo.png'">
              <div class="topbar-profile-info">
                <span class="topbar-profile-name">Chef Wolf</span>
                <span class="topbar-profile-role">Directeur Général</span>
              </div>
            </div>
          </div>
        </header>

        <!-- CORPS DU DASHBOARD -->
        <main class="dash-content" id="dash_body">
        </main>
      </div>
    </div>
  `;

  renderTabContent();
}

function renderTabContent() {
  const container = document.getElementById('dash_body');
  if (!container) return;

  if (currentTab === 'dashboard') {
    renderDashboardOverview(container);
  } else if (currentTab === 'orders') {
    renderOrdersManagement(container);
  } else if (currentTab === 'menu') {
    renderMenuManagement(container);
  }
}

function renderDashboardOverview(container) {
  const o = O();
  const m = G();
  const totalOrders = o.length;
  const acceptees = o.filter(x => x.statut !== 'Annulée');
  const caTotal = acceptees.reduce((sum, x) => sum + (x.total || 0), 0);
  const pendingOrders = o.filter(x => x.statut === 'En attente').length;
  const activeOrders = o.filter(x => ['Confirmée', 'En préparation', 'Prête', 'En livraison'].includes(x.statut)).length;
  const completedOrders = o.filter(x => x.statut === 'Terminée').length;
  const cancelledOrders = o.filter(x => x.statut === 'Annulée').length;

  // Top plats vendus
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

  container.innerHTML = `
    <!-- 4 CARTES KPI DÉGRADÉES EXACTEMENT COMME LE MODÈLE DU CLIENT -->
    <div class="dash-kpi-grid">
      <!-- BLEU : TOTAL COMMANDES CLIENTS -->
      <div class="dash-kpi-card blue">
        <div class="dash-kpi-info">
          <div class="dash-kpi-label">TOTAL COMMANDES</div>
          <div class="dash-kpi-value">${totalOrders}</div>
          <div class="dash-kpi-sub">${acceptees.length} validée(s) • ${cancelledOrders} rejetée(s)</div>
        </div>
        <div class="dash-kpi-icon-wrap">
          <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 3s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
        </div>
      </div>

      <!-- ORANGE : CHIFFRE D'AFFAIRES GLOBAL -->
      <div class="dash-kpi-card orange">
        <div class="dash-kpi-info">
          <div class="dash-kpi-label">CHIFFRE D'AFFAIRES TOTAL</div>
          <div class="dash-kpi-value">${FCFA(caTotal)}</div>
          <div class="dash-kpi-sub">Encaissement cumulé du restaurant</div>
        </div>
        <div class="dash-kpi-icon-wrap">
          <svg viewBox="0 0 24 24"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
        </div>
      </div>

      <!-- VIOLET : COMMANDES EN ATTENTE DE VALIDATION -->
      <div class="dash-kpi-card purple">
        <div class="dash-kpi-info">
          <div class="dash-kpi-label">EN ATTENTE DE DÉCISION</div>
          <div class="dash-kpi-value">${pendingOrders}</div>
          <div class="dash-kpi-sub">Commandes nécessitant validation</div>
        </div>
        <div class="dash-kpi-icon-wrap">
          <svg viewBox="0 0 24 24"><path d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z"/></svg>
        </div>
      </div>

      <!-- INDIGO : COMMANDES EN CUISINE / LIVRAISON -->
      <div class="dash-kpi-card indigo">
        <div class="dash-kpi-info">
          <div class="dash-kpi-label">EN COURS DE TRAITEMENT</div>
          <div class="dash-kpi-value">${activeOrders}</div>
          <div class="dash-kpi-sub">${completedOrders} terminée(s) avec succès</div>
        </div>
        <div class="dash-kpi-icon-wrap">
          <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
        </div>
      </div>
    </div>

    <!-- MINI METRIC CARDS STYLE EXACT (Total Orders, Credits, Debits) -->
    <div class="dash-metrics-grid">
      <div class="dash-metric-card">
        <div class="dash-metric-header">
          <span class="dash-metric-title">Performance Ventes</span>
        </div>
        <div class="dash-metric-body">
          <div>
            <div class="dash-metric-number">${FCFA(caTotal)}</div>
            <div class="dash-metric-trend up">↑ 100% Transactions locales</div>
          </div>
          <svg class="dash-sparkline-svg" viewBox="0 0 100 40">
            <path d="M0,35 Q20,30 40,25 T80,10 T100,5" fill="none" stroke="#1890ff" stroke-width="2.5"/>
          </svg>
        </div>
        <div class="dash-metric-details">
          <span>Commandes Confirmées: <b style="color:#52c41a;">${FCFA(caTotal)}</b></span>
          <span>En Attente: <b style="color:#fa8c16;">${pendingOrders}</b></span>
        </div>
      </div>

      <div class="dash-metric-card">
        <div class="dash-metric-header">
          <span class="dash-metric-title">État de la Carte des Plats</span>
        </div>
        <div class="dash-metric-body">
          <div>
            <div class="dash-metric-number">${m.length} Plats</div>
            <div class="dash-metric-trend up">Disponibles : ${m.filter(x => x.a).length}</div>
          </div>
          <svg class="dash-sparkline-svg" viewBox="0 0 100 40">
            <path d="M0,30 Q25,10 50,20 T75,5 T100,2" fill="none" stroke="#52c41a" stroke-width="2.5"/>
          </svg>
        </div>
        <div class="dash-metric-details">
          <span>En rupture : <b style="color:#f5222d;">${m.filter(x => !x.a).length}</b></span>
          <span>Catégories : <b>${CATS.length}</b></span>
        </div>
      </div>

      <div class="dash-metric-card">
        <div class="dash-metric-header">
          <span class="dash-metric-title">Modes de Livraison</span>
        </div>
        <div class="dash-metric-body">
          <div>
            <div class="dash-metric-number">${o.filter(x => x.mode === 'livraison').length} Livraisons</div>
            <div class="dash-metric-trend" style="color:#1890ff;">${o.filter(x => x.mode !== 'livraison').length} Retraits au restaurant</div>
          </div>
          <svg class="dash-sparkline-svg" viewBox="0 0 100 40">
            <path d="M0,25 Q30,35 60,15 T100,8" fill="none" stroke="#722ed1" stroke-width="2.5"/>
          </svg>
        </div>
        <div class="dash-metric-details">
          <span>Taux Réussite : <b style="color:#52c41a;">${totalOrders > 0 ? Math.round(((totalOrders - cancelledOrders)/totalOrders)*100) : 100}%</b></span>
          <span>Ville : <b>Yamoussoukro</b></span>
        </div>
      </div>
    </div>

    <!-- GRAPHIQUE DES VENTES & TOP 5 (JOININGS & SALES CHART DU MODÈLE) -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(360px, 1fr)); gap:20px;">
      <!-- Graphique d'activité -->
      <div class="dash-panel">
        <div class="dash-panel-header">
          <h3 class="dash-panel-title">Graphique d'Activité & Commandes (Ventes)</h3>
          <span style="font-size:12px; color:#52c41a; font-weight:700;">● Ventes confirmées</span>
        </div>
        <div class="dash-chart-container">
          <svg viewBox="0 0 600 200" style="width:100%; height:100%;">
            <!-- Lignes de grille -->
            <line x1="0" y1="40" x2="600" y2="40" stroke="#f0f2f5" stroke-dasharray="4"/>
            <line x1="0" y1="90" x2="600" y2="90" stroke="#f0f2f5" stroke-dasharray="4"/>
            <line x1="0" y1="140" x2="600" y2="140" stroke="#f0f2f5" stroke-dasharray="4"/>
            <line x1="0" y1="190" x2="600" y2="190" stroke="#e1e3ea"/>

            <!-- Aire dégradée violette comme le graphique du modèle -->
            <defs>
              <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#9254de" stop-opacity="0.45"/>
                <stop offset="100%" stop-color="#9254de" stop-opacity="0.0"/>
              </linearGradient>
            </defs>
            <polygon points="0,190 80,180 160,150 240,60 320,160 400,120 480,90 600,140 600,190" fill="url(#purpleGrad)" />
            <polyline points="0,190 80,180 160,150 240,60 320,160 400,120 480,90 600,140" fill="none" stroke="#722ed1" stroke-width="3" />

            <!-- Points d'inflexion -->
            <circle cx="240" cy="60" r="5" fill="#722ed1" stroke="#fff" stroke-width="2"/>
            <circle cx="480" cy="90" r="5" fill="#722ed1" stroke="#fff" stroke-width="2"/>
          </svg>
        </div>
      </div>

      <!-- Top 5 des mets les plus demandés -->
      <div class="dash-panel">
        <div class="dash-panel-header">
          <h3 class="dash-panel-title">🔥 Plats les Plus Commandés</h3>
          <button class="btn ln" style="font-size:12px; padding:4px 10px;" onclick="currentTab='menu'; view();">Voir la carte</button>
        </div>
        ${topDishes.length ? `
          <div style="display:flex; flex-direction:column; gap:12px;">
            ${topDishes.map(([plat, qte], idx) => `
              <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; background:#fbfcfe; border-radius:8px; border:1px solid #ebedf2;">
                <div style="display:flex; align-items:center; gap:10px;">
                  <span style="font-weight:800; color:#e86f1c; font-size:14px;">#${idx + 1}</span>
                  <span style="font-weight:600; font-size:13.5px; color:#181c32;">${esc(plat)}</span>
                </div>
                <span class="badge-status success">${qte} portion(s) vendue(s)</span>
              </div>
            `).join('')}
          </div>
        ` : `
          <p style="color:#7e8299; font-size:13.5px; text-align:center; padding:30px 0;">Aucune commande finalisée pour le moment.</p>
        `}
      </div>
    </div>
  `;
}

function renderOrdersManagement(container) {
  const o = O();

  container.innerHTML = `
    <div class="dash-panel">
      <div class="dash-panel-header">
        <div>
          <h3 class="dash-panel-title">Gestion Globale des Commandes</h3>
          <span style="font-size:12.5px; color:#7e8299;">Supervision directe, acceptation, refus et changement de statut</span>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn ln" style="font-size:12px; padding:6px 12px;" onclick="renderOrdersManagement(document.getElementById('dash_body'))">Actualiser</button>
        </div>
      </div>

      <div class="dash-table-wrap">
        <table class="dash-table">
          <thead>
            <tr>
              <th>RÉFÉRENCE</th>
              <th>CLIENT & CONTACT</th>
              <th>MODE & ADRESSE</th>
              <th>PLATS COMMANDÉS</th>
              <th>TOTAL</th>
              <th>STATUT ACTUEL</th>
              <th>DÉCISION ADMIN</th>
            </tr>
          </thead>
          <tbody>
            ${o.length ? o.map((x, i) => {
              const isEnAttente = x.statut === 'En attente';
              const isAnnulee = x.statut === 'Annulée';
              const isConfirmee = ['Confirmée', 'En préparation', 'Prête', 'En livraison', 'Terminée'].includes(x.statut);

              return `
                <tr>
                  <td><b style="color:#e86f1c; font-size:13.5px;">${esc(x.num)}</b></td>
                  <td>
                    <strong>${esc(x.nom)}</strong><br>
                    <a href="tel:${esc(x.tel)}" style="color:#1890ff; font-size:12px; text-decoration:none;">${esc(x.tel)}</a>
                  </td>
                  <td>
                    <span style="font-size:12.5px;">
                      ${x.mode === 'livraison' ? `🛵 Livraison : <b>${esc(x.quartier || 'Non précisé')}</b>` : '🍽️ Retrait sur place'}
                    </span>
                  </td>
                  <td>
                    <span style="font-size:12.5px; color:#5e6278;">
                      ${x.items.map(l => `${l.q}× ${esc(l.n)}`).join(', ')}
                    </span>
                  </td>
                  <td>
                    <b style="color:#181c32; font-size:14px;">${FCFA(x.total)}</b>
                  </td>
                  <td>
                    <span class="badge-status ${isAnnulee ? 'danger' : isConfirmee ? 'success' : 'warning'}">
                      ${esc(x.statut)}
                    </span>
                  </td>
                  <td>
                    <div style="display:flex; gap:6px;">
                      <button class="btn-acc" data-num="${x.num}" data-action="accept" style="padding:5px 10px; font-size:12px;" ${x.statut === 'Confirmée' ? 'disabled style="opacity:0.5;"' : ''}>
                        ✓ Valider
                      </button>
                      <button class="btn-ref" data-num="${x.num}" data-action="reject" style="padding:5px 10px; font-size:12px;" ${x.statut === 'Annulée' ? 'disabled style="opacity:0.5;"' : ''}>
                        ✕ Refuser
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('') : `
              <tr>
                <td colspan="7" style="text-align:center; padding:30px; color:#7e8299;">Aucune commande passée sur le site pour l'instant.</td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderMenuManagement(container) {
  const m = G();

  container.innerHTML = `
    <div class="dash-panel">
      <div class="dash-panel-header">
        <div>
          <h3 class="dash-panel-title">Carte des Plats & Gestion des Prix</h3>
          <span style="font-size:12.5px; color:#7e8299;">Modification immédiate des prix, mise en rupture de stock et suppression</span>
        </div>
      </div>

      <div class="dash-table-wrap">
        <table class="dash-table">
          <thead>
            <tr>
              <th>IMAGE</th>
              <th>NOM DU PLAT</th>
              <th>CATÉGORIE</th>
              <th>PRIX EN FCFA</th>
              <th>EN STOCK</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            ${m.map(d => `
              <tr>
                <td style="width:60px;">
                  <img src="${d.img || 'assets/images/hero.jpg'}" style="width:44px; height:44px; border-radius:8px; object-fit:cover;" onerror="this.onerror=null;this.src='assets/images/hero.jpg'">
                </td>
                <td><strong>${esc(d.n)}</strong></td>
                <td><span class="badge-status info">${esc(d.c)}</span></td>
                <td>
                  <input type="number" min="0" value="${d.p}" data-pr="${d.id}" style="width:110px; padding:6px 10px; font-weight:700; border-radius:6px; border:1px solid #ebedf2;">
                </td>
                <td>
                  <label style="cursor:pointer; display:flex; align-items:center; gap:6px; font-weight:600; font-size:13px;">
                    <input type="checkbox" ${d.a ? 'checked' : ''} data-av="${d.id}" style="width:18px; height:18px; cursor:pointer;">
                    ${d.a ? '<span style="color:#52c41a;">Disponible</span>' : '<span style="color:#f5222d;">Épuisé</span>'}
                  </label>
                </td>
                <td>
                  <button class="x" data-del="${d.id}" style="padding:6px 12px; font-size:12px;">Supprimer</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- AJOUT D'UN NOUVEAU METS -->
      <div style="background:#fafbfd; border:1px solid #ebedf2; border-radius:10px; padding:20px; margin-top:24px;">
        <h4 style="margin:0 0 14px; font-size:15px; font-weight:700;">+ Ajouter un Nouveau Plat à la Carte Officielle</h4>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px;">
          <input id="an" placeholder="Nom du plat (ex: Poulet Braisé XL)" style="padding:8px 12px; border-radius:6px; border:1px solid #e1e3ea;">
          <select id="ac" style="padding:8px 12px; border-radius:6px; border:1px solid #e1e3ea;">
            ${CATS.map(c => `<option>${c}</option>`).join('')}
          </select>
          <input id="ap" type="number" placeholder="Prix FCFA (ex: 7000)" style="padding:8px 12px; border-radius:6px; border:1px solid #e1e3ea;">
          <input id="ad" placeholder="Courte description alléchante..." style="padding:8px 12px; border-radius:6px; border:1px solid #e1e3ea;">
        </div>
        <button id="btn_add_dish" style="margin-top:14px; background:#e86f1c; color:#fff; font-weight:700; border:none; border-radius:8px; padding:10px 18px; cursor:pointer;">
          + Enregistrer le plat
        </button>
      </div>
    </div>
  `;
}

// GESTION DES CLICS & ONGLETS
A.addEventListener('click', e => {
  const btnTab = e.target.closest('[data-tab]');
  if (btnTab) {
    currentTab = btnTab.dataset.tab;
    view();
    return;
  }

  const t = e.target.closest('button') || e.target;
  const d = t.dataset;

  // Validation commande
  if (d.action === 'accept') {
    const o = O();
    const cmd = o.find(y => y.num === d.num);
    if (cmd) {
      cmd.statut = 'Confirmée';
      store.set('bcw_orders', o);
      renderOrdersManagement(document.getElementById('dash_body'));
    }
  }

  // Refus commande
  if (d.action === 'reject') {
    if (confirm(`Confirmez-vous le rejet de la commande ${d.num} ?`)) {
      const o = O();
      const cmd = o.find(y => y.num === d.num);
      if (cmd) {
        cmd.statut = 'Annulée';
        store.set('bcw_orders', o);
        renderOrdersManagement(document.getElementById('dash_body'));
      }
    }
  }

  // Suppression plat
  if (d.del && confirm('Voulez-vous retirer ce plat de la carte ?')) {
    store.set('bcw_menu', G().filter(x => x.id != d.del));
    renderMenuManagement(document.getElementById('dash_body'));
  }

  // Ajout plat
  if (t.id === 'btn_add_dish') {
    const n = document.getElementById('an').value.trim();
    const p = +document.getElementById('ap').value;
    const desc = document.getElementById('ad').value.trim();
    const cat = document.getElementById('ac').value;

    if (!n || !(p >= 0)) return alert('Veuillez spécifier le nom et le prix en FCFA.');

    const m = G();
    m.push({
      id: Date.now(),
      n: n,
      c: cat,
      p: p,
      d: desc || 'Spécialité gastronomique de Bolikro Chez Wolf.',
      img: 'assets/images/hero.jpg',
      badge: 'Nouveau',
      a: true
    });
    store.set('bcw_menu', m);
    renderMenuManagement(document.getElementById('dash_body'));
  }
});

// GESTION DES MODIFICATIONS DE PRIX & DISPONIBILITÉ
A.addEventListener('change', e => {
  const t = e.target;
  const d = t.dataset;

  if (d.pr || d.av) {
    const m = G();
    const x = m.find(y => y.id == (d.pr || d.av));
    if (x) {
      if (d.pr) x.p = +t.value;
      else x.a = t.checked;
      store.set('bcw_menu', m);
      renderMenuManagement(document.getElementById('dash_body'));
    }
  }
});

// Lancement au chargement
view();
