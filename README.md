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

2. **Espace Staff : Superviseur & Administrateur ([admin.html](admin.html))** :
   - **Profil Superviseur** (mot de passe : `wolf`) :
     - Consultation des commandes en temps réel.
     - Boutons d'action rapide pour **Accepter** ou **Refuser / Annuler** les commandes.
     - Suivi de la préparation pour la cuisine.
   - **Profil Administrateur** (mot de passe : `admin2026`) :
     - Accès total et œil sur l'ensemble de l'activité.
     - **Tableau de bord statistique complet** : Chiffre d'affaires total en FCFA, volume de commandes, répartition livraisons/sur place, taux de validation, classement des plats les plus vendus.
     - Gestion complète de la carte (tarifs en FCFA, rupture de stock, ajout/suppression de plats).
