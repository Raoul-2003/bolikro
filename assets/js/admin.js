/**
 * BOLIKRO CHEZ WOLF — REPRODUCTION PIXEL-PERFECT DU DASHBOARD LEAD ENTERPRISE
 * Respect absolu de la capture d'écran fournie par l'utilisateur :
 * 1. Topbar blanche (Logo, Cloche+0, Message+0, EN/FR, Devise, Admin dropdown)
 * 2. Sidebar sombre repliable (Photo, Date/Heure, Menus avec chevrons et élément actif Accueil bleu)
 * 3. Titre "Tableau de bord" + Breadcrumbs à droite
 * 4. Rangée 1 : 4 cartes colorées (Bleu, Orange, Violet, Indigo) avec icône carré arrondi et barre
 * 5. Rangée 2 : 1 grande carte Activité commandes (Sparkline + stats + dessin) + 2 cartes Encaissements / Décaissements
 * 6. Rangée 3 : Grand Graphique en aires violettes (Commandes vs Ventes) + Panneau latéral RÉCAPITULATIF
 * 7. Bouton flottant Paramètres à droite (engrenage noir)
 */

const App = document.getElementById('app');
let isSidebarCollapsed = false;
let openMenus = { home: true, menu: false, orders: false };

function formatMoney(amount) {
  return Math.round(amount).toLocaleString('fr-FR').replace(/[\u202f\u00a0]/g, ' ') + ' FCFA';
}

function getFormattedDateString() {
  const d = new Date();
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  const dayName = days[d.getDay()];
  const dayNum = d.getDate();
  const monthName = months[d.getMonth()];
  const year = d.getFullYear();
  const time = d.toTimeString().split(' ')[0];
  return `${dayName}, ${dayNum} ${monthName} ${year} ${time}`;
}

function renderLeadDashboard() {
  const metrics = getDashboardMetrics();

  App.innerHTML = `
    <!-- 1. TOPBAR BLANCHE (IDENTIQUE À LA CAPTURE) -->
    <header class="lb-topbar">
      <div class="lb-topbar-brand">
        <a href="index.html" style="display:flex; align-items:center; gap:10px; text-decoration:none;">
          <div class="lb-brand-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1890ff" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <div class="lb-brand-text">
            <span>BOLIKRO</span>
            <span class="lb-brand-sub">CHEZ WOLF</span>
          </div>
        </a>
      </div>

      <div class="lb-topbar-right">
        <!-- Cloche notification avec badge 0 -->
        <button class="lb-icon-btn" title="Notifications">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span class="lb-badge-counter">0</span>
        </button>

        <!-- Enveloppe message avec badge 0 -->
        <button class="lb-icon-btn" title="Messages">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <span class="lb-badge-counter">0</span>
        </button>

        <!-- Sélecteur Langue FR -->
        <div class="lb-top-selector">
          <span style="font-size:15px;">🇨🇮</span>
          <span>FR</span>
          <svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
        </div>

        <!-- Sélecteur Devise FCFA -->
        <div class="lb-top-selector">
          <span>FCFA</span>
          <svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
        </div>

        <!-- Profil Administrateur -->
        <div class="lb-admin-dropdown" onclick="if(confirm('Voulez-vous retourner au site public ou vous déconnecter ?')) window.location.href='index.html';">
          <div class="lb-admin-avatar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#6a7485"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
          <span class="lb-admin-name">Admin</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#707b8b"><path d="M7 10l5 5 5-5z"/></svg>
        </div>
      </div>
    </header>

    <!-- WRAPPER : SIDEBAR GAUCHE + CONTENU -->
    <div class="lb-wrapper">
      
      <!-- 2. SIDEBAR GAUCHE SOMBRE (220PX) -->
      <aside class="lb-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}" id="leadSidebar">
        <!-- En-tête sidebar avec photo montagne / utilisateur -->
        <div class="lb-sidebar-header">
          <div class="lb-sidebar-user-block">
            <div class="lb-user-photo-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#8e99a8"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            <div class="lb-sidebar-user-info">
              <span class="lb-sidebar-user-name">Admin</span>
            </div>
          </div>
          <div class="lb-sidebar-date">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>${getFormattedDateString()}</span>
          </div>
        </div>

        <!-- Navigation latérale ordonnée selon la demande -->
        <ul class="lb-sidebar-menu">
          <!-- 1. Accueil (ACTIF BLEU VIF #1890ff COMME LA CAPTURE) -->
          <li class="lb-menu-item ${openMenus.home ? 'open' : ''}">
            <div class="lb-menu-link active" onclick="toggleMenu('home')">
              <span class="lb-menu-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
              </span>
              <span class="lb-menu-text">Accueil</span>
              <svg class="lb-chevron" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
            </div>
            <ul class="lb-sub-menu">
              <li><a href="#dashboard" class="lb-sub-link active">• Tableau de bord</a></li>
              <li><a href="#overview" class="lb-sub-link">• Vue d'ensemble</a></li>
            </ul>
          </li>

          <!-- 2. Menu du Restaurant -->
          <li class="lb-menu-item ${openMenus.menu ? 'open' : ''}">
            <div class="lb-menu-link" onclick="toggleMenu('menu')">
              <span class="lb-menu-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
              </span>
              <span class="lb-menu-text">Menu</span>
              <svg class="lb-chevron" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
            </div>
            <ul class="lb-sub-menu">
              <li><a href="superviseur.html" class="lb-sub-link">• Plats et boissons</a></li>
              <li><a href="index.html#menu" class="lb-sub-link">• Catégories</a></li>
              <li><a href="superviseur.html" class="lb-sub-link">• Disponibilité plats</a></li>
            </ul>
          </li>

          <!-- 3. Commandes -->
          <li class="lb-menu-item ${openMenus.orders ? 'open' : ''}">
            <div class="lb-menu-link" onclick="toggleMenu('orders')">
              <span class="lb-menu-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
              </span>
              <span class="lb-menu-text">Commandes</span>
              <svg class="lb-chevron" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
            </div>
            <ul class="lb-sub-menu">
              <li><a href="superviseur.html" class="lb-sub-link">• Toutes (${metrics.recapitulatif.totalCommandes})</a></li>
              <li><a href="superviseur.html" class="lb-sub-link">• En attente (${metrics.recapitulatif.commandesATraiter})</a></li>
              <li><a href="superviseur.html" class="lb-sub-link">• En livraison (${metrics.recapitulatif.commandesEnLivraison})</a></li>
              <li><a href="superviseur.html" class="lb-sub-link">• Terminées (${metrics.recapitulatif.commandesTerminees})</a></li>
            </ul>
          </li>

          <!-- 4. Livraisons et retraits -->
          <li class="lb-menu-item">
            <a href="superviseur.html" class="lb-menu-link">
              <span class="lb-menu-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
              </span>
              <span class="lb-menu-text">Livraisons & retraits</span>
            </a>
          </li>

          <!-- 5. Clients -->
          <li class="lb-menu-item">
            <a href="#clients" class="lb-menu-link">
              <span class="lb-menu-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 3s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
              </span>
              <span class="lb-menu-text">Clients</span>
            </a>
          </li>

          <!-- 6. Paiements -->
          <li class="lb-menu-item">
            <a href="#paiements" class="lb-menu-link">
              <span class="lb-menu-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
              </span>
              <span class="lb-menu-text">Paiements</span>
            </a>
          </li>

          <!-- 7. Promotions -->
          <li class="lb-menu-item">
            <a href="#promotions" class="lb-menu-link">
              <span class="lb-menu-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg>
              </span>
              <span class="lb-menu-text">Promotions</span>
            </a>
          </li>

          <!-- 8. Rapports -->
          <li class="lb-menu-item">
            <a href="#rapports" class="lb-menu-link">
              <span class="lb-menu-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
              </span>
              <span class="lb-menu-text">Rapports</span>
            </a>
          </li>

          <!-- 9. Personnel -->
          <li class="lb-menu-item">
            <a href="superviseur.html" class="lb-menu-link">
              <span class="lb-menu-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg>
              </span>
              <span class="lb-menu-text">Personnel</span>
            </a>
          </li>

          <!-- 10. Configuration -->
          <li class="lb-menu-item">
            <a href="#config" class="lb-menu-link">
              <span class="lb-menu-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>
              </span>
              <span class="lb-menu-text">Configuration</span>
            </a>
          </li>

          <!-- 11. Paramètres généraux -->
          <li class="lb-menu-item">
            <a href="#params" class="lb-menu-link">
              <span class="lb-menu-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
              </span>
              <span class="lb-menu-text">Paramètres généraux</span>
            </a>
          </li>
        </ul>

        <!-- Bouton de réduction Collapse en bas -->
        <div class="lb-sidebar-footer">
          <button class="lb-btn-collapse" onclick="toggleSidebarCollapse()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
            <span>Réduire la barre</span>
          </button>
        </div>
      </aside>

      <!-- 3. ZONE CENTRALE (DASHBOARD) -->
      <main class="lb-main">
        <!-- Titre & Breadcrumb -->
        <div class="lb-content-header">
          <h1 class="lb-page-h1">Tableau de bord</h1>
          <div class="lb-breadcrumbs-bar">
            <span>Accueil</span>
            <span>/</span>
            <span class="active">Tableau de bord</span>
            <span class="lb-help-icon" title="Aide sur le dashboard">?</span>
          </div>
        </div>

        <!-- PREMIÈRE RANGÉE : 4 CARTES COLORÉES (EXACTEMENT LA CAPTURE) -->
        <div class="lb-row-kpis">
          <!-- CARTE 1 : BLEU (#1890ff) -->
          <div class="lb-card-color blue">
            <div class="lb-card-info">
              <div class="lb-card-tag">COMMANDES DU JOUR</div>
              <div class="lb-card-big-num">${metrics.commandesDuJour}</div>
              <div class="lb-card-progress-bar">
                <div class="bar-fill" style="width: 75%;"></div>
              </div>
            </div>
            <div class="lb-card-icon-square">
              <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 3s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
            </div>
          </div>

          <!-- CARTE 2 : ORANGE (#fa8c16) -->
          <div class="lb-card-color orange">
            <div class="lb-card-info">
              <div class="lb-card-tag">CHIFFRE D'AFFAIRES</div>
              <div class="lb-card-big-num">${formatMoney(metrics.chiffreAffairesJour)}</div>
              <div class="lb-card-progress-bar">
                <div class="bar-fill" style="width: 60%;"></div>
              </div>
            </div>
            <div class="lb-card-icon-square">
              <svg viewBox="0 0 24 24"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
            </div>
          </div>

          <!-- CARTE 3 : VIOLET (#9254de) -->
          <div class="lb-card-color purple">
            <div class="lb-card-info">
              <div class="lb-card-tag">PAIEMENTS EN ATTENTE</div>
              <div class="lb-card-big-num">${formatMoney(metrics.paiementsEnAttente)}</div>
              <div class="lb-card-progress-bar">
                <div class="bar-fill" style="width: 45%;"></div>
              </div>
            </div>
            <div class="lb-card-icon-square">
              <svg viewBox="0 0 24 24"><path d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z"/></svg>
            </div>
          </div>

          <!-- CARTE 4 : INDIGO (#597ef7) -->
          <div class="lb-card-color indigo">
            <div class="lb-card-info">
              <div class="lb-card-tag">COMMANDES TERMINÉES</div>
              <div class="lb-card-big-num">${metrics.commandesTerminees}</div>
              <div class="lb-card-progress-bar">
                <div class="bar-fill" style="width: 85%;"></div>
              </div>
            </div>
            <div class="lb-card-icon-square">
              <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </div>
          </div>
        </div>

        <!-- DEUXIÈME RANGÉE : 3 CARTES (1 GRANDE + 2 SECONDAIRES) -->
        <div class="lb-row-three-cards">
          <!-- GRANDE CARTE GAUCHE : ACTIVITÉ DES COMMANDES -->
          <div class="lb-white-card">
            <div class="lb-white-card-header">
              <span>ACTIVITÉ DES COMMANDES</span>
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </div>

            <div class="lb-card-order-layout">
              <div class="lb-order-left">
                <div class="lb-order-price-stat">
                  <span>${formatMoney(metrics.activiteVentesTotal)}</span>
                  <!-- Mini sparkline bleu -->
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

              <!-- Illustration discrète identique au modèle (flèche jaune et silhouettes) -->
              <div class="lb-order-illustration-right">
                <svg viewBox="0 0 120 90" width="120" height="90">
                  <path d="M15,85 L85,15" stroke="#fadb14" stroke-width="7" stroke-linecap="round"/>
                  <polygon points="80,10 95,12 90,27" fill="#fadb14"/>
                  <!-- Silhouettes épurées -->
                  <circle cx="45" cy="55" r="5" fill="#1890ff"/>
                  <rect x="42" y="61" width="6" height="15" fill="#1890ff" rx="2"/>
                  <circle cx="70" cy="40" r="5" fill="#13c2c2"/>
                  <rect x="67" y="46" width="6" height="18" fill="#13c2c2" rx="2"/>
                  <!-- Mini tableau de bord -->
                  <rect x="80" y="35" width="28" height="20" rx="3" fill="#002766" stroke="#1890ff" stroke-width="1"/>
                  <line x1="84" y1="42" x2="98" y2="42" stroke="#52c41a" stroke-width="2"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- CARTE CENTRALE : ENCAISSEMENTS -->
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
              <div class="lb-sec-line">
                <div class="lb-sec-label-dot">
                  <span class="lb-dot red"></span>
                  <span>Cette semaine</span>
                </div>
                <span class="lb-sec-value">${formatMoney(metrics.encaissements.semaine)}</span>
              </div>
              <div class="lb-sec-line">
                <div class="lb-sec-label-dot">
                  <span class="lb-dot orange"></span>
                  <span>Ce mois</span>
                </div>
                <span class="lb-sec-value">${formatMoney(metrics.encaissements.mois)}</span>
              </div>
              <div class="lb-sec-line">
                <div class="lb-sec-label-dot">
                  <span class="lb-dot green"></span>
                  <span>Cette année</span>
                </div>
                <span class="lb-sec-value">${formatMoney(metrics.encaissements.annee)}</span>
              </div>
            </div>
          </div>

          <!-- CARTE DROITE : DÉCAISSEMENTS / REMBOURSEMENTS -->
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
              <div class="lb-sec-line">
                <div class="lb-sec-label-dot">
                  <span class="lb-dot green"></span>
                  <span>Cette semaine</span>
                </div>
                <span class="lb-sec-value">${formatMoney(metrics.decaissements.semaine)}</span>
              </div>
              <div class="lb-sec-line">
                <div class="lb-sec-label-dot">
                  <span class="lb-dot blue"></span>
                  <span>Ce mois</span>
                </div>
                <span class="lb-sec-value">${formatMoney(metrics.decaissements.mois)}</span>
              </div>
              <div class="lb-sec-line">
                <div class="lb-sec-label-dot">
                  <span class="lb-dot blue"></span>
                  <span>Cette année</span>
                </div>
                <span class="lb-sec-value">${formatMoney(metrics.decaissements.annee)}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- TROISIÈME RANGÉE : GRAPHIQUE ÉVOLUTION DES COMMANDES & RÉCAPITULATIF -->
        <div class="lb-row-bottom-grid">
          <!-- ZONE GAUCHE : LE GRAND GRAPHIQUE VIOLET -->
          <div class="lb-chart-area-left">
            <div class="lb-chart-top-bar">
              <div class="lb-chart-title">ÉVOLUTION DES COMMANDES (ACTIVITÉ EN TEMPS RÉEL)</div>
              <div class="lb-chart-legend">
                <div class="lb-legend-item">
                  <span class="lb-legend-dot" style="background:#1a202c;"></span>
                  <span>Commandes reçues</span>
                </div>
                <div class="lb-legend-item">
                  <span class="lb-legend-dot" style="background:#9254de;"></span>
                  <span>Ventes réalisées</span>
                </div>
              </div>
            </div>

            <div class="lb-chart-visual">
              <svg viewBox="0 0 700 220" style="width:100%; height:100%;">
                <!-- Lignes de grille horizontales et repères d'ordonnées -->
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

                <!-- Lignes verticales de grille -->
                <line x1="160" y1="20" x2="160" y2="210" stroke="#f0f2f5"/>
                <line x1="280" y1="20" x2="280" y2="210" stroke="#f0f2f5"/>
                <line x1="400" y1="20" x2="400" y2="210" stroke="#f0f2f5"/>
                <line x1="520" y1="20" x2="520" y2="210" stroke="#f0f2f5"/>
                <line x1="640" y1="20" x2="640" y2="210" stroke="#f0f2f5"/>

                <!-- LE PIC EN VIOLET EXACT COMME DANS LA CAPTURE -->
                <polygon points="260,210 285,30 305,210" fill="#b37feb" opacity="0.85"/>
                <polyline points="50,210 260,210 285,30 305,210 690,210" fill="none" stroke="#9254de" stroke-width="2"/>
              </svg>
            </div>
          </div>

          <!-- ZONE DROITE : PANNEAU LATÉRAL RÉCAPITULATIF -->
          <div class="lb-summary-area-right">
            <div class="lb-summary-title">RÉCAPITULATIF</div>

            <div class="lb-summary-list">
              <div class="lb-summary-item">
                <span>Total des commandes</span>
                <b>${metrics.recapitulatif.totalCommandes}</b>
              </div>
              <div class="lb-summary-item">
                <span>Commandes à traiter</span>
                <b>${metrics.recapitulatif.commandesATraiter}</b>
              </div>
              <div class="lb-summary-item">
                <span>Commandes en livraison</span>
                <b>${metrics.recapitulatif.commandesEnLivraison}</b>
              </div>
              <div class="lb-summary-item">
                <span>Commandes terminées</span>
                <b>${metrics.recapitulatif.commandesTerminees}</b>
              </div>
            </div>

            <!-- Illustration d'ambiance discrète en bas à droite -->
            <div class="lb-summary-footer-img">
              <svg viewBox="0 0 160 45" width="160" height="45">
                <path d="M10,40 Q40,30 80,38 T150,35" fill="none" stroke="#e1e8ed" stroke-width="2"/>
                <circle cx="30" cy="25" r="7" fill="#8c8c8c"/>
                <circle cx="50" cy="20" r="6" fill="#bfbfbf"/>
                <circle cx="75" cy="26" r="8" fill="#595959"/>
                <circle cx="105" cy="22" r="7" fill="#8c8c8c"/>
                <circle cx="130" cy="28" r="6" fill="#bfbfbf"/>
              </svg>
            </div>
          </div>
        </div>

      </main>
    </div>

    <!-- BOUTON D'ENGRENAGE FLOTTANT À DROITE (NOIR) -->
    <div class="lb-floating-cog" title="Paramètres rapides" onclick="window.location.href='superviseur.html';">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
    </div>
  `;
}

// INTERACTIONS MENU LATÉRAL
function toggleMenu(menuKey) {
  openMenus[menuKey] = !openMenus[menuKey];
  renderLeadDashboard();
}

function toggleSidebarCollapse() {
  isSidebarCollapsed = !isSidebarCollapsed;
  const sidebar = document.getElementById('leadSidebar');
  if (sidebar) {
    sidebar.classList.toggle('collapsed', isSidebarCollapsed);
  }
}

// Initialisation au chargement
renderLeadDashboard();
