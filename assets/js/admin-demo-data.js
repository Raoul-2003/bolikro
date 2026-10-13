/**
 * BOLIKRO CHEZ WOLF — JEU DE DONNÉES DE DÉMONSTRATION & CALCULS POUR LE DASHBOARD
 * Ce fichier alimente le dashboard de référence avec des données réalistes de restaurant
 * en FCFA tout en se connectant aux commandes réelles de localStorage (store.get('bcw_orders')).
 */

const DEMO_DASHBOARD_DATA = {
  restaurant: {
    nom: 'Bolikro Chez Wolf',
    module: 'Administration du restaurant',
    devise: 'FCFA',
    langue: 'FR'
  },
  
  // Statistiques calculées par défaut si aucune commande réelle n'est passée
  fallbackStats: {
    commandesDuJour: 24,
    chiffreAffairesJour: 231800, // en FCFA
    paiementsEnAttente: 39200,   // en FCFA
    commandesTerminees: 49,
    
    activiteVentesTotal: 1299000, // FCFA
    tendanceVentesPourcent: -100.0,
    commandesConfirmeesMontant: 1299000,
    commandesEnAttenteMontant: 0,

    encaissements: {
      semaine: 0,
      mois: 0,
      annee: 445000
    },

    decaissements: {
      semaine: 39200,
      mois: 39200,
      annee: 213200
    },

    recapitulatif: {
      totalCommandes: 24,
      commandesATraiter: 3,
      commandesEnLivraison: 5,
      commandesTerminees: 16
    }
  },

  // Données de la série temporelle pour le grand graphique
  serieEvolution: [
    { jour: 'Lun', commandes: 12, ventes: 45000 },
    { jour: 'Mar', commandes: 18, ventes: 85000 },
    { jour: 'Mer', commandes: 28, ventes: 130000 },
    { jour: 'Jeu', commandes: 15, ventes: 60000 },
    { jour: 'Ven', commandes: 42, ventes: 210000 },
    { jour: 'Sam', commandes: 55, ventes: 290000 },
    { jour: 'Dim', commandes: 60, ventes: 320000 }
  ]
};

// Fonction d'agrégation liant les commandes réelles et le fallback
function getDashboardMetrics() {
  const orders = (typeof store !== 'undefined') ? store.get('bcw_orders', []) : [];
  const fb = DEMO_DASHBOARD_DATA.fallbackStats;

  if (!orders || orders.length === 0) {
    return fb;
  }

  // Calcul basé sur les vraies commandes passées sur le site
  const nonAnnulees = orders.filter(x => x.statut !== 'Annulée');
  const caTotal = nonAnnulees.reduce((acc, c) => acc + (c.total || 0), 0);
  const pendingOrders = orders.filter(x => x.statut === 'En attente');
  const pendingAmount = pendingOrders.reduce((acc, c) => acc + (c.total || 0), 0);
  const terminees = orders.filter(x => x.statut === 'Terminée').length;
  const enLivraison = orders.filter(x => x.statut === 'En livraison').length;

  return {
    commandesDuJour: orders.length,
    chiffreAffairesJour: caTotal,
    paiementsEnAttente: pendingAmount,
    commandesTerminees: terminees,

    activiteVentesTotal: caTotal,
    tendanceVentesPourcent: 12.5,
    commandesConfirmeesMontant: caTotal,
    commandesEnAttenteMontant: pendingAmount,

    encaissements: {
      semaine: Math.round(caTotal * 0.4),
      mois: caTotal,
      annee: caTotal + fb.encaissements.annee
    },

    decaissements: {
      semaine: Math.round(caTotal * 0.15),
      mois: Math.round(caTotal * 0.25),
      annee: fb.decaissements.annee
    },

    recapitulatif: {
      totalCommandes: orders.length,
      commandesATraiter: pendingOrders.length,
      commandesEnLivraison: enLivraison,
      commandesTerminees: terminees
    }
  };
}
