/**
 * BOLIKRO CHEZ WOLF — CONSOLE ADMINISTRATEUR GÉNÉRAL (DESIGN LEAD ENTERPRISE AUDITÉ)
 * Fonctionnalités complètes :
 * - Dashboard KPI et graphiques fidèles à la capture
 * - Gestion complète des Commandes, Produits, Catégories, Paramètres, Comptes et Journal d'Audit
 * - Respect des permissions RBAC et anti-tampering
 */

const App = document.getElementById('app');
let isSidebarCollapsed = false;
let currentView = 'dashboard'; // 'dashboard', 'orders', 'menu', 'categories', 'accounts', 'audit', 'settings'
let orderStatusFilter = 'all';
let openMenus = {
  home: true,
  menu: false,
  orders: false
};

function formatMoney(amount) {
  return Math.round(amount || 0).toLocaleString('fr-FR').replace(/[\u202f\u00a0]/g, ' ') + ' FCFA';
}

function getFormattedDateString() {
  const d = new Date();
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} ${d.toTimeString().split(' ')[0]}`;
}

// 1. Écran de connexion sécurisé
function renderLoginScreen() {
  App.innerHTML = `
    <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; background:#1c1f26; padding:20px;">
      <div style="width:100%; max-width:420px; background:#fff; border-radius:12px; padding:36px; box-shadow:0 20px 40px rgba(0,0,0,0.35);">
        <div style="text-align:center; margin-bottom:26px;">
          <img src="assets/images/logo.png" style="width:72px; height:72px; border-radius:12px; object-fit:cover; margin-bottom:12px; border:2px solid #1890ff;" onerror="this.onerror=null;this.src='Logo.png'">
          <h2 style="font-size:20px; font-weight:800; color:#181c32; margin:0 0 6px;">Bolikro Chez Wolf</h2>
          <span style="font-size:12px; color:#8892a0; font-weight:700; text-transform:uppercase; letter-spacing:0.8px;">Console Administrateur</span>
        </div>

        <div style="background:#f4f6fa; border:1px solid #ebedf2; border-radius:8px; padding:12px; margin-bottom:18px; font-size:12.5px; color:#3f4254; display:flex; justify-content:space-between; align-items:center;">
          <span>Mot de passe certifié :</span>
          <code style="background:#fff; padding:2px 8px; border-radius:4px; font-weight:700; color:#1890ff; border:1px solid #d9d9d9;">admin2026</code>
        </div>

        <label style="font-size:12px; font-weight:700; color:#3f4254; margin-bottom:6px; display:block; text-transform:uppercase;">Mot de passe</label>
        <input id="admin_pwd_input" type="password" placeholder="Saisissez le mot de passe" style="width:100%; min-height:44px; border-radius:8px; border:1px solid #d9d9d9; padding:0 14px; font-size:14px; margin-bottom:8px; outline:none;">
        
        <p id="auth_err_msg" style="color:#f5222d; font-size:12.5px; font-weight:600; margin:0 0 14px; min-height:18px;"></p>
        
        <button id="btn_submit_login" style="width:100%; min-height:46px; background:#1890ff; color:#fff; border:none; border-radius:8px; font-size:14px; font-weight:700; cursor:pointer;">
          Connexion Administrateur
        </button>

        <div style="display:flex; justify-content:space-between; margin-top:22px; font-size:12.5px;">
          <a href="index.html" style="color:#8892a0; text-decoration:none; font-weight:600;">← Site Public</a>
          <a href="superviseur.html" style="color:#52c41a; text-decoration:none; font-weight:700;">Accès Superviseur →</a>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn_submit_login').onclick = () => {
    const pwd = document.getElementById('admin_pwd_input').value.trim();
    const res = BolikroSecurity.authenticate(BolikroSecurity.ROLES.ADMIN, pwd);
    if (res.success) {
      renderAdminDashboard();
    } else {
      document.getElementById('auth_err_msg').textContent = res.error || 'Mot de passe incorrect.';
    }
  };

  document.getElementById('admin_pwd_input').addEventListener('keypress', e => {
    if (e.key === 'Enter') document.getElementById('btn_submit_login').click();
  });
}

// 2. Rendu de la coquille principale du Dashboard (reproduction exacte)
function renderAdminDashboard() {
  const session = BolikroSecurity.getCurrentSession();
  if (!session || session.role !== BolikroSecurity.ROLES.ADMIN) {
    return renderLoginScreen();
  }

  const metrics = getDashboardMetrics();
  const allOrders = store.get('bcw_orders', []);
  const allMenu = store.get('bcw_menu', DEF);

  App.innerHTML = `
    <!-- TOPBAR BLANCHE CONFORME À LA CHARTE BOLIKRO -->
    <header class="lb-topbar">
      <div class="lb-topbar-brand">
        <a href="index.html" style="display:flex; align-items:center; gap:10px; text-decoration:none;">
          <img src="assets/images/logo.png" alt="Bolikro Chez Wolf" style="width:36px; height:36px; border-radius:50%; object-fit:cover; border:2px solid var(--or, #E86F1C); background:#fff; padding:1px;" onerror="this.onerror=null;this.src='Logo.png'">
          <div class="lb-brand-text">
            <span style="color:var(--ink, #3A0D0D); font-weight:800; letter-spacing:0.5px;">BOLIKRO</span>
            <span class="lb-brand-sub" style="color:var(--or, #E86F1C); font-weight:700;">CHEZ WOLF</span>
          </div>
        </a>
      </div>

      <div class="lb-topbar-right">
        <!-- Cloche notification avec compteur commandes à traiter -->
        <button class="lb-icon-btn" title="Commandes à valider" onclick="navigateTab('orders');">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span class="lb-badge-counter">${metrics.recapitulatif.commandesATraiter}</span>
        </button>

        <!-- Enveloppe message / alertes -->
        <button class="lb-icon-btn" title="Journal d'audit" onclick="navigateTab('audit');">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <span class="lb-badge-counter">0</span>
        </button>

        <!-- Sélecteur Langue FR -->
        <div class="lb-top-selector" title="Langue de l'interface">
          <span style="font-size:15px;">🇨🇮</span>
          <span>FR</span>
          <svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
        </div>

        <!-- Sélecteur Devise FCFA -->
        <div class="lb-top-selector" title="Devise monétaire">
          <span style="font-weight:700; color:var(--or, #E86F1C);">FCFA</span>
          <svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
        </div>

        <!-- Profil Administrateur Dropdown -->
        <div class="lb-admin-dropdown" onclick="handleAdminMenuClick()">
          <div class="lb-admin-avatar">
            <img src="assets/images/chef_face_crop.jpg" alt="Chef Wolf" style="width:100%; height:100%; border-radius:50%; object-fit:cover;" onerror="this.onerror=null;this.src='assets/images/logo.png'">
          </div>
          <span class="lb-admin-name">Admin (Wolf)</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#707b8b"><path d="M7 10l5 5 5-5z"/></svg>
        </div>
      </div>
    </header>

    <div class="lb-wrapper">
      <!-- SIDEBAR GAUCHE SOMBRE COMPLÈTE SELON LE CAHIER DES CHARGES -->
      <aside class="lb-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}" id="leadSidebar">
        <div class="lb-sidebar-header">
          <div class="lb-sidebar-user-block">
            <div class="lb-user-photo-box" style="border:1.5px solid var(--or, #E86F1C);">
              <img src="assets/images/chef_face_crop.jpg" alt="Chef Wolf" style="width:100%; height:100%; object-fit:cover;" onerror="this.onerror=null;this.src='assets/images/logo.png'">
            </div>
            <div class="lb-sidebar-user-info">
              <span class="lb-sidebar-user-name">Chef Wolf</span>
              <span style="font-size:11px; color:var(--gold, #E5A83B); font-weight:700;">ADMINISTRATEUR</span>
            </div>
          </div>
          <div class="lb-sidebar-date">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>${getFormattedDateString()}</span>
          </div>
        </div>

        <ul class="lb-sidebar-menu">
          <!-- 1. Accueil (Active bleu) -->
          <li class="lb-menu-item ${openMenus.home ? 'open' : ''}">
            <div class="lb-menu-link ${currentView === 'dashboard' ? 'active' : ''}" onclick="toggleSidebarSection('home'); navigateTab('dashboard');">
              <span class="lb-menu-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
              </span>
              <span class="lb-menu-text">Accueil</span>
              <svg class="lb-chevron" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
            </div>
            <ul class="lb-sub-menu">
              <li><a href="javascript:void(0)" class="lb-sub-link ${currentView === 'dashboard' ? 'active' : ''}" onclick="navigateTab('dashboard');">• Tableau de bord</a></li>
              <li><a href="javascript:void(0)" class="lb-sub-link" onclick="navigateTab('dashboard');">• Vue d'ensemble</a></li>
            </ul>
          </li>

          <!-- 2. Menu -->
          <li class="lb-menu-item ${openMenus.menu ? 'open' : ''}">
            <div class="lb-menu-link ${currentView === 'menu' || currentView === 'categories' ? 'active' : ''}" onclick="toggleSidebarSection('menu');">
              <span class="lb-menu-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
              </span>
              <span class="lb-menu-text">Menu</span>
              <svg class="lb-chevron" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
            </div>
            <ul class="lb-sub-menu">
              <li><a href="javascript:void(0)" class="lb-sub-link ${currentView === 'menu' ? 'active' : ''}" onclick="navigateTab('menu');">• Plats et boissons (${allMenu.length})</a></li>
              <li><a href="javascript:void(0)" class="lb-sub-link ${currentView === 'categories' ? 'active' : ''}" onclick="navigateTab('categories');">• Catégories</a></li>
              <li><a href="javascript:void(0)" class="lb-sub-link" onclick="navigateTab('menu');">• Disponibilité des plats</a></li>
            </ul>
          </li>

          <!-- 3. Commandes -->
          <li class="lb-menu-item ${openMenus.orders ? 'open' : ''}">
            <div class="lb-menu-link ${currentView === 'orders' ? 'active' : ''}" onclick="toggleSidebarSection('orders'); navigateTab('orders');">
              <span class="lb-menu-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
              </span>
              <span class="lb-menu-text">Commandes</span>
              <svg class="lb-chevron" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
            </div>
            <ul class="lb-sub-menu">
              <li><a href="javascript:void(0)" class="lb-sub-link" onclick="filterOrderList('all');">• Toutes les commandes (${allOrders.length})</a></li>
              <li><a href="javascript:void(0)" class="lb-sub-link" onclick="filterOrderList('En attente');">• En attente (${allOrders.filter(x => x.statut === 'En attente').length})</a></li>
              <li><a href="javascript:void(0)" class="lb-sub-link" onclick="filterOrderList('Confirmée');">• Confirmées</a></li>
              <li><a href="javascript:void(0)" class="lb-sub-link" onclick="filterOrderList('En préparation');">• En préparation</a></li>
              <li><a href="javascript:void(0)" class="lb-sub-link" onclick="filterOrderList('Prête');">• Prêtes</a></li>
              <li><a href="javascript:void(0)" class="lb-sub-link" onclick="filterOrderList('Terminée');">• Terminées</a></li>
              <li><a href="javascript:void(0)" class="lb-sub-link" onclick="filterOrderList('Annulée');">• Annulées</a></li>
            </ul>
          </li>

          <!-- 4. Livraisons et retraits -->
          <li class="lb-menu-item">
            <a href="javascript:void(0)" class="lb-menu-link" onclick="filterOrderList('livraison');">
              <span class="lb-menu-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
              </span>
              <span class="lb-menu-text">Livraisons & retraits</span>
            </a>
          </li>

          <!-- 5. Clients -->
          <li class="lb-menu-item">
            <a href="javascript:void(0)" class="lb-menu-link" onclick="navigateTab('orders');">
              <span class="lb-menu-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 3s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
              </span>
              <span class="lb-menu-text">Clients</span>
            </a>
          </li>

          <!-- 6. Paiements -->
          <li class="lb-menu-item">
            <a href="javascript:void(0)" class="lb-menu-link" onclick="navigateTab('dashboard');">
              <span class="lb-menu-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
              </span>
              <span class="lb-menu-text">Paiements</span>
            </a>
          </li>

          <!-- 7. Promotions -->
          <li class="lb-menu-item">
            <a href="javascript:void(0)" class="lb-menu-link" onclick="alert('Promotions : Module actif. Les réductions sont gérées dans la carte des prix.');">
              <span class="lb-menu-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg>
              </span>
              <span class="lb-menu-text">Promotions</span>
            </a>
          </li>

          <!-- 8. Rapports & Journal d'Audit -->
          <li class="lb-menu-item">
            <a href="javascript:void(0)" class="lb-menu-link ${currentView === 'audit' ? 'active' : ''}" onclick="navigateTab('audit');">
              <span class="lb-menu-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
              </span>
              <span class="lb-menu-text">Rapports & Audit</span>
            </a>
          </li>

          <!-- 9. Personnel & Comptes autorisés (Gestion des comptes) -->
          <li class="lb-menu-item">
            <a href="javascript:void(0)" class="lb-menu-link ${currentView === 'accounts' ? 'active' : ''}" onclick="navigateTab('accounts');">
              <span class="lb-menu-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg>
              </span>
              <span class="lb-menu-text">Personnel & Comptes</span>
            </a>
          </li>

          <!-- 10. Configuration & Paramètres -->
          <li class="lb-menu-item">
            <a href="javascript:void(0)" class="lb-menu-link ${currentView === 'settings' ? 'active' : ''}" onclick="navigateTab('settings');">
              <span class="lb-menu-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>
              </span>
              <span class="lb-menu-text">Configuration</span>
            </a>
          </li>

          <!-- 11. Paramètres généraux -->
          <li class="lb-menu-item">
            <a href="javascript:void(0)" class="lb-menu-link" onclick="navigateTab('settings');">
              <span class="lb-menu-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
              </span>
              <span class="lb-menu-text">Paramètres généraux</span>
            </a>
          </li>
        </ul>

        <!-- Bouton Collapse en bas -->
        <div class="lb-sidebar-footer">
          <button class="lb-btn-collapse" onclick="toggleSidebarCollapse()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
            <span>Réduire la barre</span>
          </button>
        </div>
      </aside>

      <!-- MAIN CONTENT VIEW -->
      <main class="lb-main" id="mainContainer">
      </main>
    </div>

    <!-- BOUTON D'ENGRENAGE FLOTTANT À DROITE -->
    <div class="lb-floating-cog" title="Paramètres rapides" onclick="navigateTab('settings');">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
    </div>
  `;

  renderActiveView();
}

function renderActiveView() {
  const container = document.getElementById('mainContainer');
  if (!container) return;

  if (currentView === 'dashboard') {
    renderDashboardView(container);
  } else if (currentView === 'orders') {
    renderOrdersView(container);
  } else if (currentView === 'menu') {
    renderMenuView(container);
  } else if (currentView === 'categories') {
    renderCategoriesView(container);
  } else if (currentView === 'accounts') {
    renderAccountsView(container);
  } else if (currentView === 'audit') {
    renderAuditView(container);
  } else if (currentView === 'settings') {
    renderSettingsView(container);
  }
}

// VUE 1 : TABLEAU DE BORD (EXACTEMENT LA CAPTURE)
function renderDashboardView(container) {
  const metrics = getDashboardMetrics();

  container.innerHTML = `
    <div class="lb-content-header">
      <h1 class="lb-page-h1">Tableau de bord</h1>
      <div class="lb-breadcrumbs-bar">
        <span>Accueil</span>
        <span>/</span>
        <span class="active">Tableau de bord</span>
        <span class="lb-help-icon" title="Aide sur le dashboard">?</span>
      </div>
    </div>

    <!-- PREMIÈRE RANGÉE : 4 CARTES COLORÉES -->
    <div class="lb-row-kpis">
      <div class="lb-card-color blue">
        <div class="lb-card-info">
          <div class="lb-card-tag">COMMANDES DU JOUR</div>
          <div class="lb-card-big-num">${metrics.commandesDuJour}</div>
          <div class="lb-card-progress-bar"><div class="bar-fill" style="width: 75%;"></div></div>
        </div>
        <div class="lb-card-icon-square">
          <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 3s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
        </div>
      </div>

      <div class="lb-card-color orange">
        <div class="lb-card-info">
          <div class="lb-card-tag">CHIFFRE D'AFFAIRES</div>
          <div class="lb-card-big-num">${formatMoney(metrics.chiffreAffairesJour)}</div>
          <div class="lb-card-progress-bar"><div class="bar-fill" style="width: 60%;"></div></div>
        </div>
        <div class="lb-card-icon-square">
          <svg viewBox="0 0 24 24"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
        </div>
      </div>

      <div class="lb-card-color purple">
        <div class="lb-card-info">
          <div class="lb-card-tag">PAIEMENTS EN ATTENTE</div>
          <div class="lb-card-big-num">${formatMoney(metrics.paiementsEnAttente)}</div>
          <div class="lb-card-progress-bar"><div class="bar-fill" style="width: 45%;"></div></div>
        </div>
        <div class="lb-card-icon-square">
          <svg viewBox="0 0 24 24"><path d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z"/></svg>
        </div>
      </div>

      <div class="lb-card-color indigo">
        <div class="lb-card-info">
          <div class="lb-card-tag">COMMANDES TERMINÉES</div>
          <div class="lb-card-big-num">${metrics.commandesTerminees}</div>
          <div class="lb-card-progress-bar"><div class="bar-fill" style="width: 85%;"></div></div>
        </div>
        <div class="lb-card-icon-square">
          <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        </div>
      </div>
    </div>

    <!-- DEUXIÈME RANGÉE : 3 CARTES -->
    <div class="lb-row-three-cards">
      <div class="lb-white-card">
        <div class="lb-white-card-header">
          <span>ACTIVITÉ DES COMMANDES</span>
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </div>
        <div class="lb-card-order-layout">
          <div class="lb-order-left">
            <div class="lb-order-price-stat">
              <span>${formatMoney(metrics.activiteVentesTotal)}</span>
              <svg width="60" height="24" viewBox="0 0 60 24">
                <polyline points="0,20 15,18 30,15 40,4 50,18 60,16" fill="none" stroke="#1890ff" stroke-width="2"/>
              </svg>
            </div>
            <div class="lb-stat-trend ${metrics.tendanceVentesPourcent >= 0 ? 'up' : 'down'}">
              <span>▼ ${metrics.tendanceVentesPourcent}% par rapport à la période précédente</span>
            </div>
            <div class="lb-order-split-bottom">
              <div class="lb-order-split-col">
                <span class="lb-split-label">Commandes confirmées</span>
                <span class="lb-split-val">${formatMoney(metrics.commandesConfirmeesMontant)}</span>
                <div class="lb-order-split-bar" style="background:#52c41a; width:80px;"></div>
              </div>
              <div class="lb-order-split-col">
                <span class="lb-split-label">Commandes en attente</span>
                <span class="lb-split-val">${formatMoney(metrics.commandesEnAttenteMontant)}</span>
                <div class="lb-order-split-bar" style="background:#fa8c16; width:20px;"></div>
              </div>
            </div>
          </div>
          <div class="lb-order-illustration-right">
            <svg viewBox="0 0 120 90" width="120" height="90">
              <path d="M15,85 L85,15" stroke="#fadb14" stroke-width="7" stroke-linecap="round"/>
              <polygon points="80,10 95,12 90,27" fill="#fadb14"/>
              <circle cx="45" cy="55" r="5" fill="#1890ff"/>
              <rect x="42" y="61" width="6" height="15" fill="#1890ff" rx="2"/>
              <circle cx="70" cy="40" r="5" fill="#13c2c2"/>
              <rect x="67" y="46" width="6" height="18" fill="#13c2c2" rx="2"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="lb-white-card">
        <div class="lb-white-card-header">
          <span>ENCAISSEMENTS</span>
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </div>
        <div class="lb-card-sec-head">
          <div class="lb-sec-number">${formatMoney(metrics.encaissements.annee)}</div>
          <svg width="45" height="18" viewBox="0 0 45 18">
            <polyline points="0,15 15,14 28,3 38,14 45,12" fill="none" stroke="#1890ff" stroke-width="2"/>
          </svg>
        </div>
        <div class="lb-stat-trend down" style="margin-top:-6px; font-size:11px;">
          <span>▼ -100.00 % par rapport au mois dernier</span>
        </div>
        <div class="lb-sec-lines">
          <div class="lb-sec-line"><div class="lb-sec-label-dot"><span class="lb-dot red"></span><span>Cette semaine</span></div><span class="lb-sec-value">${formatMoney(metrics.encaissements.semaine)}</span></div>
          <div class="lb-sec-line"><div class="lb-sec-label-dot"><span class="lb-dot orange"></span><span>Ce mois</span></div><span class="lb-sec-value">${formatMoney(metrics.encaissements.mois)}</span></div>
          <div class="lb-sec-line"><div class="lb-sec-label-dot"><span class="lb-dot green"></span><span>Cette année</span></div><span class="lb-sec-value">${formatMoney(metrics.encaissements.annee)}</span></div>
        </div>
      </div>

      <div class="lb-white-card">
        <div class="lb-white-card-header">
          <span>DÉCAISSEMENTS</span>
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </div>
        <div class="lb-card-sec-head">
          <div class="lb-sec-number">${formatMoney(metrics.decaissements.annee)}</div>
          <svg width="45" height="18" viewBox="0 0 45 18">
            <polyline points="0,15 15,12 30,10 40,2 45,14" fill="none" stroke="#1890ff" stroke-width="2"/>
          </svg>
        </div>
        <div class="lb-stat-trend down" style="margin-top:-6px; font-size:11px;">
          <span>▼ -63.23 % par rapport au mois dernier</span>
        </div>
        <div class="lb-sec-lines">
          <div class="lb-sec-line"><div class="lb-sec-label-dot"><span class="lb-dot green"></span><span>Cette semaine</span></div><span class="lb-sec-value">${formatMoney(metrics.decaissements.semaine)}</span></div>
          <div class="lb-sec-line"><div class="lb-sec-label-dot"><span class="lb-dot blue"></span><span>Ce mois</span></div><span class="lb-sec-value">${formatMoney(metrics.decaissements.mois)}</span></div>
          <div class="lb-sec-line"><div class="lb-sec-label-dot"><span class="lb-dot blue"></span><span>Cette année</span></div><span class="lb-sec-value">${formatMoney(metrics.decaissements.annee)}</span></div>
        </div>
      </div>
    </div>

    <!-- TROISIÈME RANGÉE : GRAPHIQUE ÉVOLUTION DES COMMANDES & RÉCAPITULATIF -->
    <div class="lb-row-bottom-grid">
      <div class="lb-chart-area-left">
        <div class="lb-chart-top-bar">
          <div class="lb-chart-title">ÉVOLUTION DES COMMANDES (ACTIVITÉ EN TEMPS RÉEL)</div>
          <div class="lb-chart-legend">
            <div class="lb-legend-item"><span class="lb-legend-dot" style="background:#1a202c;"></span><span>Commandes reçues</span></div>
            <div class="lb-legend-item"><span class="lb-legend-dot" style="background:#9254de;"></span><span>Ventes réalisées</span></div>
          </div>
        </div>
        <div class="lb-chart-visual">
          <svg viewBox="0 0 700 220" style="width:100%; height:100%;">
            <text x="10" y="25" fill="#8892a0" font-size="11" font-weight="600">1 301</text>
            <line x1="45" y1="20" x2="690" y2="20" stroke="#f0f2f5" stroke-dasharray="2"/>
            <text x="10" y="75" fill="#8892a0" font-size="11" font-weight="600">1 200</text>
            <line x1="45" y1="70" x2="690" y2="70" stroke="#f0f2f5" stroke-dasharray="2"/>
            <text x="10" y="125" fill="#8892a0" font-size="11" font-weight="600">1 000</text>
            <line x1="45" y1="120" x2="690" y2="120" stroke="#f0f2f5" stroke-dasharray="2"/>
            <text x="20" y="170" fill="#8892a0" font-size="11" font-weight="600">800</text>
            <line x1="45" y1="165" x2="690" y2="165" stroke="#f0f2f5" stroke-dasharray="2"/>
            <text x="20" y="210" fill="#8892a0" font-size="11" font-weight="600">600</text>
            <line x1="45" y1="210" x2="690" y2="210" stroke="#e2e8f0"/>
            <polygon points="260,210 285,30 305,210" fill="#b37feb" opacity="0.85"/>
            <polyline points="50,210 260,210 285,30 305,210 690,210" fill="none" stroke="#9254de" stroke-width="2"/>
          </svg>
        </div>
      </div>

      <div class="lb-summary-area-right">
        <div class="lb-summary-title">RÉCAPITULATIF</div>
        <div class="lb-summary-list">
          <div class="lb-summary-item"><span>Total des commandes</span><b>${metrics.recapitulatif.totalCommandes}</b></div>
          <div class="lb-summary-item"><span>Commandes à traiter</span><b>${metrics.recapitulatif.commandesATraiter}</b></div>
          <div class="lb-summary-item"><span>Commandes en livraison</span><b>${metrics.recapitulatif.commandesEnLivraison}</b></div>
          <div class="lb-summary-item"><span>Commandes terminées</span><b>${metrics.recapitulatif.commandesTerminees}</b></div>
        </div>
      </div>
    </div>
  `;
}

// VUE 2 : GESTION DES COMMANDES (ACTION VALIDER / REFUSER / STATUTS)
function renderOrdersView(container) {
  let orders = store.get('bcw_orders', []);
  if (orderStatusFilter !== 'all') {
    if (orderStatusFilter === 'livraison') {
      orders = orders.filter(x => x.mode === 'livraison');
    } else {
      orders = orders.filter(x => x.statut === orderStatusFilter);
    }
  }

  container.innerHTML = `
    <div class="lb-content-header">
      <div>
        <h1 class="lb-page-h1">Commandes (${orders.length})</h1>
        <div class="lb-breadcrumbs-bar"><span>Accueil</span> / <span>Commandes</span> / <span class="active">${orderStatusFilter}</span></div>
      </div>
      <div style="display:flex; gap:8px;">
        <button class="btn ln" style="font-size:12px; padding:6px 12px;" onclick="filterOrderList('all');">Toutes</button>
        <button class="btn ln" style="font-size:12px; padding:6px 12px;" onclick="filterOrderList('En attente');">En attente</button>
        <button class="btn ln" style="font-size:12px; padding:6px 12px;" onclick="filterOrderList('Confirmée');">Confirmées</button>
        <button class="btn ln" style="font-size:12px; padding:6px 12px;" onclick="filterOrderList('Terminée');">Terminées</button>
      </div>
    </div>

    <div class="lb-white-card" style="padding:0; overflow:hidden;">
      <table style="width:100%; border-collapse:collapse; font-size:13px;">
        <thead>
          <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0; text-align:left; color:#718096; font-size:11.5px;">
            <th style="padding:12px 16px;">NUMÉRO</th>
            <th style="padding:12px 16px;">CLIENT & CONTACT</th>
            <th style="padding:12px 16px;">MODE / ADRESSE</th>
            <th style="padding:12px 16px;">PLATS</th>
            <th style="padding:12px 16px;">MONTANT TOTAL</th>
            <th style="padding:12px 16px;">STATUT</th>
            <th style="padding:12px 16px; text-align:right;">ACTION ADMIN</th>
          </tr>
        </thead>
        <tbody>
          ${orders.length ? orders.map(o => `
            <tr style="border-bottom:1px solid #edf2f7;">
              <td style="padding:12px 16px; font-weight:700; color:#1890ff;">${esc(o.num)}</td>
              <td style="padding:12px 16px;">
                <b>${esc(o.nom)}</b><br>
                <a href="tel:${esc(o.tel)}" style="color:#718096; font-size:12px; text-decoration:none;">${esc(o.tel)}</a>
              </td>
              <td style="padding:12px 16px;">
                ${o.mode === 'livraison' ? `🛵 ${esc(o.quartier || 'Yamoussoukro')}` : '🍽️ Sur place'}
              </td>
              <td style="padding:12px 16px; color:#4a5568;">
                ${o.items ? o.items.map(it => `${it.q}× ${esc(it.n)}`).join(', ') : '—'}
              </td>
              <td style="padding:12px 16px; font-weight:700;">${formatMoney(o.total)}</td>
              <td style="padding:12px 16px;">
                <select onchange="handleOrderStatusChange('${o.num}', this.value)" style="padding:4px 8px; border-radius:6px; border:1px solid #cbd5e0; font-weight:600; font-size:12px;">
                  ${['En attente', 'Confirmée', 'En préparation', 'Prête', 'En livraison', 'Terminée', 'Annulée'].map(s => `
                    <option value="${s}" ${s === o.statut ? 'selected' : ''}>${s}</option>
                  `).join('')}
                </select>
              </td>
              <td style="padding:12px 16px; text-align:right;">
                <button class="btn-acc" style="padding:4px 10px; font-size:11.5px; border-radius:4px; margin-right:4px;" onclick="handleOrderStatusChange('${o.num}', 'Confirmée')" ${o.statut === 'Confirmée' ? 'disabled style="opacity:0.4;"' : ''}>✓ Valider</button>
                <button class="btn-ref" style="padding:4px 10px; font-size:11.5px; border-radius:4px;" onclick="handleOrderStatusChange('${o.num}', 'Annulée')" ${o.statut === 'Annulée' ? 'disabled style="opacity:0.4;"' : ''}>✕ Rejeter</button>
              </td>
            </tr>
          `).join('') : `
            <tr><td colspan="7" style="padding:32px; text-align:center; color:#a0aec0;">Aucune commande trouvée.</td></tr>
          `}
        </tbody>
      </table>
    </div>
  `;
}

// VUE 3 : GESTION DES PRODUITS / PLATS & PRIX
function renderMenuView(container) {
  const menu = store.get('bcw_menu', DEF);

  container.innerHTML = `
    <div class="lb-content-header">
      <div>
        <h1 class="lb-page-h1">Carte des Plats & Produits (${menu.length})</h1>
        <div class="lb-breadcrumbs-bar"><span>Accueil</span> / <span>Menu</span> / <span class="active">Plats et boissons</span></div>
      </div>
      <button class="btn dk" style="background:#1890ff; font-size:13px;" onclick="document.getElementById('addDishSection').scrollIntoView({behavior:'smooth'});">+ Nouveau Plat</button>
    </div>

    <div class="lb-white-card" style="padding:0; overflow:hidden;">
      <table style="width:100%; border-collapse:collapse; font-size:13px;">
        <thead>
          <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0; text-align:left; color:#718096; font-size:11.5px;">
            <th style="padding:12px 16px;">IMAGE</th>
            <th style="padding:12px 16px;">NOM DU METS</th>
            <th style="padding:12px 16px;">CATÉGORIE</th>
            <th style="padding:12px 16px;">PRIX EN FCFA</th>
            <th style="padding:12px 16px;">DISPONIBILITÉ</th>
            <th style="padding:12px 16px; text-align:right;">ACTION</th>
          </tr>
        </thead>
        <tbody>
          ${menu.map(d => `
            <tr style="border-bottom:1px solid #edf2f7;">
              <td style="padding:10px 16px; width:54px;">
                <img src="${d.img || 'assets/images/hero.jpg'}" style="width:40px; height:40px; border-radius:6px; object-fit:cover;" onerror="this.onerror=null;this.src='assets/images/hero.jpg'">
              </td>
              <td style="padding:10px 16px;"><b>${esc(d.n)}</b></td>
              <td style="padding:10px 16px;"><span style="background:#edf2f7; padding:3px 8px; border-radius:4px; font-size:11.5px; font-weight:600;">${esc(d.c)}</span></td>
              <td style="padding:10px 16px;">
                <input type="number" min="0" value="${d.p}" onchange="handlePriceChange(${d.id}, this.value)" style="width:110px; padding:5px 8px; font-weight:700; border-radius:4px; border:1px solid #cbd5e0;"> FCFA
              </td>
              <td style="padding:10px 16px;">
                <label style="cursor:pointer; display:flex; align-items:center; gap:6px; font-size:12px; font-weight:600;">
                  <input type="checkbox" ${d.a ? 'checked' : ''} onchange="handleStockChange(${d.id}, this.checked)" style="width:17px; height:17px;">
                  ${d.a ? '<span style="color:#52c41a;">En stock</span>' : '<span style="color:#f5222d;">Épuisé</span>'}
                </label>
              </td>
              <td style="padding:10px 16px; text-align:right;">
                <button class="x" style="padding:4px 10px; font-size:12px;" onclick="handleDeleteDish(${d.id})">Supprimer</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- AJOUT D'UN NOUVEAU PLAT -->
    <div id="addDishSection" class="lb-white-card" style="margin-top:24px;">
      <h3 style="margin:0 0 14px; font-size:15px; font-weight:700;">+ Ajouter un Nouveau Plat</h3>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px;">
        <input id="dish_new_name" placeholder="Nom du plat (ex: Cabri Braisé Spécial)" style="padding:8px 12px; border-radius:6px; border:1px solid #d9d9d9;">
        <select id="dish_new_cat" style="padding:8px 12px; border-radius:6px; border:1px solid #d9d9d9;">
          ${CATS.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
        <input id="dish_new_price" type="number" placeholder="Prix FCFA (ex: 5000)" style="padding:8px 12px; border-radius:6px; border:1px solid #d9d9d9;">
        <input id="dish_new_desc" placeholder="Courte description alléchante" style="padding:8px 12px; border-radius:6px; border:1px solid #d9d9d9;">
      </div>
      <button class="btn dk" style="margin-top:14px; background:#1890ff;" onclick="handleCreateDish()">+ Enregistrer le plat dans le menu</button>
    </div>
  `;
}

// VUE 4 : GESTION DES CATÉGORIES
function renderCategoriesView(container) {
  container.innerHTML = `
    <div class="lb-content-header">
      <div>
        <h1 class="lb-page-h1">Catégories du Restaurant</h1>
        <div class="lb-breadcrumbs-bar"><span>Accueil</span> / <span>Menu</span> / <span class="active">Catégories</span></div>
      </div>
    </div>

    <div class="lb-white-card">
      <h3 style="margin:0 0 14px; font-size:15px; font-weight:700;">Catégories officielles de Bolikro Chez Wolf</h3>
      <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px;">
        ${CATS.map((c, idx) => `
          <li style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; background:#f8fafc; border-radius:8px; border:1px solid #edf2f7;">
            <span><b>#${idx + 1}</b> ${esc(c)}</span>
            <span style="color:#52c41a; font-weight:700; font-size:12px;">Active sur le site public</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

// VUE 5 : GESTION DU PERSONNEL & COMPTES AUTORISÉS (RBAC)
function renderAccountsView(container) {
  const accounts = BolikroSecurity.getAccounts();

  container.innerHTML = `
    <div class="lb-content-header">
      <div>
        <h1 class="lb-page-h1">Personnel & Comptes Autorisés</h1>
        <div class="lb-breadcrumbs-bar"><span>Accueil</span> / <span>Personnel</span> / <span class="active">Comptes</span></div>
      </div>
    </div>

    <div class="lb-white-card" style="padding:0; overflow:hidden;">
      <table style="width:100%; border-collapse:collapse; font-size:13px;">
        <thead>
          <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0; text-align:left; color:#718096; font-size:11.5px;">
            <th style="padding:12px 16px;">UTILISATEUR</th>
            <th style="padding:12px 16px;">NOM COMPLET</th>
            <th style="padding:12px 16px;">RÔLE ASSIGNÉ</th>
            <th style="padding:12px 16px;">PERMISSIONS ACCORDÉES</th>
            <th style="padding:12px 16px;">STATUT</th>
          </tr>
        </thead>
        <tbody>
          ${accounts.map(acc => `
            <tr style="border-bottom:1px solid #edf2f7;">
              <td style="padding:12px 16px;"><b>${esc(acc.username)}</b></td>
              <td style="padding:12px 16px;">${esc(acc.nom)}</td>
              <td style="padding:12px 16px;">
                <span style="padding:3px 8px; border-radius:4px; font-weight:700; font-size:11.5px; background:${acc.role === 'admin' ? '#fff7e6' : '#e6f7ff'}; color:${acc.role === 'admin' ? '#d46b08' : '#1890ff'};">
                  ${acc.role === 'admin' ? '👑 Administrateur' : '🛡️ Superviseur'}
                </span>
              </td>
              <td style="padding:12px 16px; font-size:12px; color:#4a5568;">
                ${acc.role === 'admin' ? 'Accès total (Commandes, Menu, Prix, Statistiques, Audit, Comptes)' : 'Opérations cuisine (Traitement commandes, stocks)'}
              </td>
              <td style="padding:12px 16px;">
                <span style="color:#52c41a; font-weight:700;">● Actif</span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// VUE 6 : JOURNAL D'AUDIT (AUDIT TRAIL SÉCURISÉ)
function renderAuditView(container) {
  const logs = BolikroSecurity.getAuditLogs();

  container.innerHTML = `
    <div class="lb-content-header">
      <div>
        <h1 class="lb-page-h1">Journal d'Audit & Sécurité (${logs.length})</h1>
        <div class="lb-breadcrumbs-bar"><span>Accueil</span> / <span>Rapports</span> / <span class="active">Audit Trail</span></div>
      </div>
      <button class="btn ln" style="font-size:12px; padding:6px 12px;" onclick="renderAuditView(document.getElementById('mainContainer'))">Actualiser</button>
    </div>

    <div class="lb-white-card" style="padding:0; overflow:hidden;">
      <table style="width:100%; border-collapse:collapse; font-size:12.5px;">
        <thead>
          <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0; text-align:left; color:#718096; font-size:11px;">
            <th style="padding:10px 14px;">DATE & HEURE</th>
            <th style="padding:10px 14px;">ACTION</th>
            <th style="padding:10px 14px;">ACTEUR / RÔLE</th>
            <th style="padding:10px 14px;">DÉTAILS</th>
          </tr>
        </thead>
        <tbody>
          ${logs.length ? logs.map(l => `
            <tr style="border-bottom:1px solid #edf2f7;">
              <td style="padding:10px 14px; color:#718096;">${new Date(l.timestamp).toLocaleString('fr-FR')}</td>
              <td style="padding:10px 14px;"><b style="color:#1890ff;">${esc(l.action)}</b></td>
              <td style="padding:10px 14px;">${esc(l.actor?.username || 'anonyme')} (${esc(l.actor?.role || 'visiteur')})</td>
              <td style="padding:10px 14px; color:#4a5568;"><code>${esc(JSON.stringify(l.details || {}))}</code></td>
            </tr>
          `).join('') : `
            <tr><td colspan="4" style="padding:32px; text-align:center; color:#a0aec0;">Aucune action enregistrée pour le moment.</td></tr>
          `}
        </tbody>
      </table>
    </div>
  `;
}

// VUE 7 : CONFIGURATION & PARAMÈTRES
function renderSettingsView(container) {
  container.innerHTML = `
    <div class="lb-content-header">
      <div>
        <h1 class="lb-page-h1">Paramètres du Restaurant</h1>
        <div class="lb-breadcrumbs-bar"><span>Accueil</span> / <span class="active">Configuration</span></div>
      </div>
    </div>

    <div class="lb-white-card">
      <h3 style="margin:0 0 16px; font-size:15px; font-weight:700;">Informations de l'Établissement</h3>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:16px;">
        <div>
          <label style="font-size:12px; font-weight:700; color:#4a5568;">Nom du Restaurant</label>
          <input value="Bolikro Chez Wolf" disabled style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #e2e8f0; background:#f7fafc; margin-top:4px;">
        </div>
        <div>
          <label style="font-size:12px; font-weight:700; color:#4a5568;">Ville & Localisation</label>
          <input value="Yamoussoukro, Côte d'Ivoire" disabled style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #e2e8f0; background:#f7fafc; margin-top:4px;">
        </div>
        <div>
          <label style="font-size:12px; font-weight:700; color:#4a5568;">Devise</label>
          <input value="FCFA (Franc CFA)" disabled style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #e2e8f0; background:#f7fafc; margin-top:4px;">
        </div>
        <div>
          <label style="font-size:12px; font-weight:700; color:#4a5568;">Frais de livraison standard</label>
          <input value="Inclus ou à confirmer par le restaurant" disabled style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #e2e8f0; background:#f7fafc; margin-top:4px;">
        </div>
      </div>
    </div>
  `;
}

// GESTIONNAIRES D'ACTIONS & NAVIGATION
function navigateTab(tabKey) {
  currentView = tabKey;
  renderAdminDashboard();
}

function filterOrderList(status) {
  orderStatusFilter = status;
  currentView = 'orders';
  renderAdminDashboard();
}

function toggleSidebarSection(secKey) {
  openMenus[secKey] = !openMenus[secKey];
  renderAdminDashboard();
}

function toggleSidebarCollapse() {
  isSidebarCollapsed = !isSidebarCollapsed;
  const sidebar = document.getElementById('leadSidebar');
  if (sidebar) sidebar.classList.toggle('collapsed', isSidebarCollapsed);
}

function handleAdminMenuClick() {
  if (confirm('Voulez-vous vous déconnecter de la session Administrateur ?')) {
    BolikroSecurity.logout();
    renderLoginScreen();
  }
}

function handleOrderStatusChange(orderNum, newStatus) {
  try {
    BolikroSecurity.updateOrderStatusSecure(orderNum, newStatus);
    renderActiveView();
  } catch (err) {
    alert(err.message);
  }
}

function handlePriceChange(dishId, newPrice) {
  const p = Math.max(0, parseInt(newPrice) || 0);
  const menu = store.get('bcw_menu', DEF);
  const dish = menu.find(x => x.id == dishId);
  if (dish) {
    const oldPrice = dish.p;
    dish.p = p;
    store.set('bcw_menu', menu);
    BolikroSecurity.logAudit('DISH_PRICE_UPDATED', BolikroSecurity.getCurrentSession(), {
      dishId,
      nom: dish.n,
      oldPrice,
      newPrice: p
    });
    renderActiveView();
  }
}

function handleStockChange(dishId, isAvailable) {
  const menu = store.get('bcw_menu', DEF);
  const dish = menu.find(x => x.id == dishId);
  if (dish) {
    dish.a = isAvailable;
    store.set('bcw_menu', menu);
    BolikroSecurity.logAudit('DISH_STOCK_TOGGLED', BolikroSecurity.getCurrentSession(), {
      dishId,
      nom: dish.n,
      available: isAvailable
    });
    renderActiveView();
  }
}

function handleDeleteDish(dishId) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce plat de la carte ?')) return;
  const menu = store.get('bcw_menu', DEF);
  const dish = menu.find(x => x.id == dishId);
  const updated = menu.filter(x => x.id != dishId);
  store.set('bcw_menu', updated);
  BolikroSecurity.logAudit('DISH_DELETED', BolikroSecurity.getCurrentSession(), {
    dishId,
    nom: dish?.n
  });
  renderActiveView();
}

function handleCreateDish() {
  const n = document.getElementById('dish_new_name').value.trim();
  const c = document.getElementById('dish_new_cat').value;
  const p = parseInt(document.getElementById('dish_new_price').value) || 0;
  const d = document.getElementById('dish_new_desc').value.trim();

  if (!n || p <= 0) return alert('Veuillez renseigner un nom et un prix valide en FCFA.');

  const menu = store.get('bcw_menu', DEF);
  const newDish = {
    id: Date.now(),
    n,
    c,
    p,
    d: d || 'Spécialité artisanale ivoirienne.',
    img: 'assets/images/hero.jpg',
    badge: 'Nouveau',
    a: true
  };
  menu.push(newDish);
  store.set('bcw_menu', menu);
  BolikroSecurity.logAudit('DISH_CREATED', BolikroSecurity.getCurrentSession(), {
    id: newDish.id,
    nom: n,
    prix: p,
    categorie: c
  });
  renderActiveView();
}

// Initialisation au chargement
renderAdminDashboard();
