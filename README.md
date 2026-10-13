# Bolikro Chez Wolf — Plateforme Gastronomique & Commande en Ligne

Site officiel et système de commande digitale pour le restaurant **BOLIKRO CHEZ WOLF** (Abidjan, Côte d'Ivoire).

## Identité & Charte Graphique
- **Typographie** : *Fraunces* (titres nobles gastronomiques) & *DM Sans* (clarté et réactivité sur mobile).
- **Palette Officielle** :
  - Marron Chocolat Chaud (`#3A0D0D`)
  - Orange Braisé Vif (`#E86F1C`)
  - Vert Feuille Végétal (`#287A42`)
  - Ambre Doré (`#E5A83B`)
  - Crème Ivoire (`#FBF8F1`)

## Structure du Projet
```
bolikro/
├── index.html            # Vitrine gastronomique, menu & tunnel de commande
├── admin.html            # Console de gestion pour le personnel & cuisine
├── Logo.png              # Logo officiel original
├── README.md             # Documentation du projet
└── assets/
    ├── css/
    │   └── style.css     # Design System complet & responsive
    ├── js/
    │   ├── core.js       # Données du menu & utilitaires partagés
    │   ├── app.js        # Moteur du panier, checkout 3 étapes & suivi
    │   └── admin.js      # Gestion des commandes et de la carte
    └── images/
        ├── logo.png      # Logo web optimisé
        ├── hero.jpg      # Photographie du plateau signature
        ├── cabri.jpg     # Cabri braisé spécial Wolf
        ├── carpe.jpg     # Carpe braisée royauté
        ├── poulet.jpg    # Poulet braisé fermier
        ├── kedjenou.jpg  # Kédjenou de poulet en canari
        └── alloco.jpg    # Alloco gourmand
```

## Fonctionnalités Principales
1. **Parcours Client ([index.html](index.html))** :
   - Découverte immersive des plats et spécialités ivoiriennes.
   - Ajout instantané au panier avec tiroir latéral dynamique.
   - Tunnel de commande en 3 étapes :
     1. Coordonnées (nom, contact à 10 chiffres).
     2. Mode de réception (Livraison avec quartier/repère ou Retrait).
     3. Validation et choix du mode de paiement.
   - Module de suivi de commande en direct avec numéro de référence (ex: `BCW-XXXXX`).

2. **Espace Cuisine & Staff ([admin.html](admin.html))** :
   - Authentification sécurisée (mot de passe test : `wolf`).
   - Gestion des commandes en direct (mise à jour du statut de préparation et de paiement synchronisée avec le suivi client).
   - Gestion de la carte (activation/désactivation des stocks, mise à jour des prix en FCFA, ajout de nouveaux plats).
