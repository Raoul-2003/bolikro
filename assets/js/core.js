/**
 * BOLIKRO CHEZ WOLF — Core Data & Shared Utilities (Modèle Final)
 */

const FCFA = n => Math.round(n).toLocaleString('fr-FR').replace(/[\u202f\u00a0]/g, ' ') + ' FCFA';
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const store = {
  get(k, d) {
    try {
      const v = JSON.parse(localStorage.getItem(k));
      return v ?? d;
    } catch {
      return d;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  }
};

const CATS = ['Nos grillades', 'Nos soupes', 'Nos Kédjénous', 'Nos accompagnements'];

/* 
   BOLIKRO CHEZ WOLF — Yamoussoukro, Côte d'Ivoire
   Téléphone : +225 07 09 24 33 80 / +225 07 47 47 38 58
   Email : bolikrochezwolf@gmail.com
   Facebook : facebook.com/Bolikroyakrochezwolf
*/

/* Menu Officiel Bolikro Chez Wolf — Uniquement les 22 mets de la carte officielle */
const DEF = [
  /* NOS GRILLADES */
  {
    id: 1,
    n: 'Cabri braisé',
    c: 'Nos grillades',
    p: 2500,
    d: 'Morceaux tendres de cabri marinés aux épices secrètes du chef, braisés au feu de bois avec oignons et piment.',
    img: 'assets/images/cabri_braise_officiel.jpg',
    badge: 'Spécialité Maison',
    a: true
  },
  {
    id: 2,
    n: 'Cabri sauté',
    c: 'Nos grillades',
    p: 3000,
    d: 'Morceaux de cabri mijotés et sautés à feu vif avec oignons, poivrons, tomates fraîches et aromates.',
    img: 'assets/images/cabri_saute_officiel.jpg',
    badge: 'Coup de Cœur',
    a: true
  },
  {
    id: 3,
    n: 'Poulet africain braisé',
    c: 'Nos grillades',
    p: 6000,
    d: 'Poulet fermier africain entier mariné aux herbes locales, peau croustillante dorée à la braise.',
    img: 'assets/images/poulet_africain_braise_officiel.jpg',
    badge: 'Incontournable',
    a: true
  },
  {
    id: 4,
    n: 'Poulet africain sauté',
    c: 'Nos grillades',
    p: 6000,
    d: 'Poulet africain sauté minute en cocotte avec oignons caramélisés, ail, gingembre et sauce relevée onctueuse.',
    img: 'assets/images/poulet_africain_saute_officiel.jpg',
    badge: 'Signature Wolf',
    a: true
  },
  {
    id: 5,
    n: 'Agouti braisé (entier)',
    c: 'Nos grillades',
    p: 25000,
    d: 'Agouti de brousse entier mariné et braisé lentement au feu de bois selon les traditions ivoiriennes.',
    img: 'assets/images/agouti.jpg',
    badge: 'Gibier d\'Exception',
    a: true
  },
  {
    id: 6,
    n: 'Agouti sauté (entier)',
    c: 'Nos grillades',
    p: 25000,
    d: 'Agouti entier découpé et sauté avec oignons, épices aromatiques et sauce gourmande fondante.',
    img: 'assets/images/kedjenou_agouti_officiel.jpg',
    badge: 'Gibier d\'Exception',
    a: true
  },
  {
    id: 7,
    n: 'Hérisson braisé (entier)',
    c: 'Nos grillades',
    p: 30000,
    d: 'Gibier d\'hérisson entier préparé et grillé à la perfection aux épices de nos terroirs.',
    img: 'assets/images/agouti.jpg',
    badge: 'Prestige Terroir',
    a: true
  },
  {
    id: 8,
    n: 'Hérisson sauté (entier)',
    c: 'Nos grillades',
    p: 30000,
    d: 'Hérisson entier sauté à la sauce tomate épicée aux aromates authentiques.',
    img: 'assets/images/agouti.jpg',
    badge: 'Prestige Terroir',
    a: true
  },
  {
    id: 9,
    n: 'Poisson braisé (commande)',
    c: 'Nos grillades',
    p: 10000,
    d: 'Poisson frais entier sélectionné du jour, mariné aux fines herbes et grillé au feu de bois avec oignons et piments.',
    img: 'assets/images/carpe.jpg',
    badge: 'Sur Commande',
    a: true
  },

  /* NOS SOUPES */
  {
    id: 10,
    n: 'Soupe de cabri',
    c: 'Nos soupes',
    p: 2500,
    d: 'Bouillon traditionnel au cabri frais bien épicé, relevé au piment frais et aux herbes vivifiantes.',
    img: 'assets/images/cabri_braise_officiel.jpg',
    badge: 'Chaud & Piquant',
    a: true
  },
  {
    id: 11,
    n: 'Soupe de poulet africain',
    c: 'Nos soupes',
    p: 6000,
    d: 'Soupe réconfortante de poulet fermier aux épices authentiques, gingembre frais et piment akpi.',
    img: 'assets/images/poulet.jpg',
    badge: 'Revigorant',
    a: true
  },
  {
    id: 12,
    n: 'Soupe de tête de cabri',
    c: 'Nos soupes',
    p: 6000,
    d: 'La légendaire soupe de tête de cabri cuite à feu doux, saveur profonde appréciée des grands connaisseurs.',
    img: 'assets/images/cabri.jpg',
    badge: 'Grand Classique',
    a: true
  },
  {
    id: 13,
    n: 'Soupe de boyaux de cabri',
    c: 'Nos soupes',
    p: 6000,
    d: 'Abats de cabri nettoyés méticuleusement et mijotés dans un bouillon pimenté aux graines d\'akpi et ail.',
    img: 'assets/images/cabri.jpg',
    badge: 'Authenticité',
    a: true
  },
  {
    id: 14,
    n: 'Soupe de poisson (commande)',
    c: 'Nos soupes',
    p: 10000,
    d: 'Poisson frais entier poché dans un bouillon aromatique aux légumes frais, citronnelle et piments.',
    img: 'assets/images/carpe.jpg',
    badge: 'Sur Commande',
    a: true
  },

  /* NOS KÉDJÉNOUS */
  {
    id: 15,
    n: 'Kédjénou de poulet africain',
    c: 'Nos Kédjénous',
    p: 6000,
    d: 'Poulet africain cuit à l\'étouffée dans un canari de terre cuite avec jus corsé, tomates, piments entiers et oignons.',
    img: 'assets/images/kedjenou_poulet_officiel.jpg',
    badge: 'Tradition Canari',
    a: true
  },
  {
    id: 16,
    n: 'Kédjénou de perdrix',
    c: 'Nos Kédjénous',
    p: 4000,
    d: 'Perdrix mijotée dans son canari en terre cuite aux arômes de la forêt.',
    img: 'assets/images/kedjenou.jpg',
    badge: 'Gibier Fin',
    a: true
  },
  {
    id: 17,
    n: 'Kédjénou d\'agouti',
    c: 'Nos Kédjénous',
    p: 25000,
    d: 'Viande d\'agouti entière étouffée dans un canari traditionnel, sauce riche parfumée aux feuilles odorantes.',
    img: 'assets/images/kedjenou_agouti_officiel.jpg',
    badge: 'Grand Gibier',
    a: true
  },
  {
    id: 18,
    n: 'Kédjénou d\'Hérisson',
    c: 'Nos Kédjénous',
    p: 30000,
    d: 'Hérisson entier préparé en kédjénou traditionnel dans un pot d\'argile étanche, arômes intenses et chair fondante.',
    img: 'assets/images/kedjenou.jpg',
    badge: 'Spécialité Rare',
    a: true
  },

  /* NOS ACCOMPAGNEMENTS */
  {
    id: 19,
    n: 'Attiéké',
    c: 'Nos accompagnements',
    p: 300,
    d: 'Semoule de manioc fraîche, légère, aérée et savoureuse. L\'incontournable de la table ivoirienne.',
    img: 'assets/images/alloco.jpg',
    badge: 'Tradition',
    a: true
  },
  {
    id: 20,
    n: 'Riz',
    c: 'Nos accompagnements',
    p: 1000,
    d: 'Portion généreuse de riz blanc cuit à la vapeur, accompagnement idéal pour nos sauces et soupes.',
    img: 'assets/images/alloco.jpg',
    badge: 'Accompagnement',
    a: true
  },
  {
    id: 21,
    n: 'Alloco',
    c: 'Nos accompagnements',
    p: 500,
    d: 'Bananes plantains mûres découpées en dés et frites dorées, fondantes et caramélisées.',
    img: 'assets/images/alloco.jpg',
    badge: 'Croustillant',
    a: true
  },
  {
    id: 22,
    n: 'Frites',
    c: 'Nos accompagnements',
    p: 2000,
    d: 'Frites croustillantes dorées et salées, servies bien chaudes.',
    img: 'assets/images/alloco.jpg',
    badge: 'Gourmand',
    a: true
  }
];

const STAT = ['En attente', 'Confirmée', 'En préparation', 'Prête', 'En livraison', 'Terminée', 'Annulée'];
const PAY = ['Règlement à la réception', 'Mobile Money Wave (Confirmé)', 'Mobile Money Orange (Confirmé)', 'Mobile Money MTN (Confirmé)', 'Paiement échoué'];
const FEE = 0; /* Frais de livraison à confirmer par Bolikro Chez Wolf — Yamoussoukro */
