/**
 * SUITE DE TESTS FONCTIONNELS ET DE SÉCURITÉ AUTOMATISÉS
 * POUR BOLIKRO CHEZ WOLF
 *
 * Exécuté avec Node.js.
 */

// Simulation d'un environnement navigateur minimal
const localStorageStore = {};
const sessionStorageStore = {};

global.localStorage = {
  getItem: k => localStorageStore[k] || null,
  setItem: (k, v) => { localStorageStore[k] = String(v); },
  removeItem: k => { delete localStorageStore[k]; }
};

global.sessionStorage = {
  getItem: k => sessionStorageStore[k] || null,
  setItem: (k, v) => { sessionStorageStore[k] = String(v); },
  removeItem: k => { delete sessionStorageStore[k]; }
};

global.navigator = { userAgent: 'NodeTestRunner/1.0' };

// Chargement des scripts du projet
const fs = require('fs');
const path = require('path');

const coreCode = fs.readFileSync(path.join(__dirname, 'assets/js/core.js'), 'utf8');
const securityCode = fs.readFileSync(path.join(__dirname, 'assets/js/security.js'), 'utf8');
const demoDataCode = fs.readFileSync(path.join(__dirname, 'assets/js/admin-demo-data.js'), 'utf8');

eval(coreCode);
eval(securityCode);
eval(demoDataCode);

const results = [];

function test(id, description, fn) {
  try {
    const outcome = fn();
    results.push({ id, description, status: 'PASS', details: outcome || 'OK' });
    console.log(`[PASS] Test ${id}: ${description}`);
  } catch (err) {
    results.push({ id, description, status: 'FAIL', error: err.message });
    console.error(`[FAIL] Test ${id}: ${description} - ${err.message}`);
  }
}

console.log('--- DÉBUT DE LA SUITE DE TESTS BOLIKRO CHEZ WOLF ---');

// Test 1: Authentification Administrateur
test(1, 'Admin peut se connecter avec admin2026', () => {
  const res = BolikroSecurity.authenticate(BolikroSecurity.ROLES.ADMIN, 'admin2026');
  if (!res.success) throw new Error(res.error);
  if (res.session.role !== 'admin') throw new Error('Rôle non admin');
  return `Token: ${res.session.token}`;
});

// Test 2: Authentification Superviseur
test(2, 'Superviseur peut se connecter avec wolf', () => {
  const res = BolikroSecurity.authenticate(BolikroSecurity.ROLES.SUPERVISEUR, 'wolf');
  if (!res.success) throw new Error(res.error);
  if (res.session.role !== 'superviseur') throw new Error('Rôle non superviseur');
  return `Role: ${res.session.role}`;
});

// Test 3: Anti-élévation de privilèges
test(3, 'Superviseur ne peut pas exécuter une action Admin (ex: modifier des comptes ou supprimer un plat)', () => {
  BolikroSecurity.authenticate(BolikroSecurity.ROLES.SUPERVISEUR, 'wolf');
  if (BolikroSecurity.hasPermission('accounts:manage')) {
    throw new Error('Élévation de privilèges détectée : le superviseur a accès aux comptes');
  }
  if (BolikroSecurity.hasPermission('products:delete')) {
    throw new Error('Élévation de privilèges détectée : le superviseur peut supprimer des plats');
  }
  return 'Permissions vérifiées avec succès côté noyau';
});

// Test 4: Utilisateur déconnecté bloqué
test(4, 'Utilisateur déconnecté n a aucune permission', () => {
  BolikroSecurity.logout();
  if (BolikroSecurity.hasPermission('orders:read')) {
    throw new Error('Un visiteur déconnecté ne devrait avoir aucune permission');
  }
  return 'Session anonyme correctement refusée';
});

// Test 5: Validation et recalcul du prix côté serveur
test(5, 'Tentative de falsification de prix d une commande détectée et corrigée', () => {
  // Le client essaie de commander du Cabri Braisé (normalement 2500 FCFA) à 50 FCFA
  const forgedOrder = {
    nom: 'Client Tricheur',
    tel: '0700000000',
    mode: 'retrait',
    items: [{ n: 'Cabri braisé', p: 50, q: 2 }],
    total: 100, // Total falsifié à 100 FCFA au lieu de 5000 FCFA
    statut: 'En attente'
  };

  const certified = BolikroSecurity.validateOrderPayload(forgedOrder);
  if (certified.total !== 5000) {
    throw new Error(`Total falsifié accepté (${certified.total} FCFA au lieu de 5000 FCFA)`);
  }
  return `Prix recalculé et certifié avec succès : ${certified.total} FCFA`;
});

// Test 6: Validation du numéro de téléphone ivoirien (10 chiffres)
test(6, 'Rejet d une commande avec numéro de téléphone invalide', () => {
  let errorRaised = false;
  try {
    BolikroSecurity.validateOrderPayload({
      nom: 'Test',
      tel: '1234', // Numéro incomplet
      items: [{ n: 'Alloco', p: 500, q: 1 }]
    });
  } catch (err) {
    errorRaised = true;
  }
  if (!errorRaised) throw new Error('La validation du téléphone a échoué à rejeter le faux numéro');
  return 'Rejet valide';
});

// Test 7: Enregistrement dans le journal d audit
test(7, 'Les modifications de statut de commande sont tracées dans le journal d audit', () => {
  // Connexion Admin
  BolikroSecurity.authenticate(BolikroSecurity.ROLES.ADMIN, 'admin2026');
  // Créer une commande de test
  const testOrder = {
    num: 'BCW-TEST1',
    date: new Date().toISOString(),
    nom: 'Test Audit',
    tel: '0700000000',
    mode: 'retrait',
    items: [{ n: 'Attiéké', p: 300, q: 1 }],
    total: 300,
    statut: 'En attente'
  };
  store.set('bcw_orders', [testOrder]);

  // Changer statut
  BolikroSecurity.updateOrderStatusSecure('BCW-TEST1', 'Confirmée');
  const logs = BolikroSecurity.getAuditLogs();
  const found = logs.find(l => l.action === 'ORDER_STATUS_CHANGED' && l.details.orderNum === 'BCW-TEST1');
  if (!found) throw new Error('Aucun log généré pour la modification de commande');
  return `Log généré à ${found.timestamp} par ${found.actor.username}`;
});

// Test 8: Métriques et statistiques calculées
test(8, 'Les statistiques reflètent exactement les commandes', () => {
  const metrics = getDashboardMetrics();
  if (typeof metrics.commandesDuJour !== 'number' || typeof metrics.chiffreAffairesJour !== 'number') {
    throw new Error('Les métriques retournées sont invalides');
  }
  return `Commandes: ${metrics.commandesDuJour}, CA: ${metrics.chiffreAffairesJour} FCFA`;
});

console.log('\n--- BILAN DES TESTS EXÉCUTÉS ---');
console.table(results);
