# Changelog

Toutes les modifications majeures apportées au projet **Action ou Vérité** sont documentées dans ce fichier.

---

## [0.5.1] - 2026-10-07

### 🚀 Refactorisation Majeure & Migration Next.js
- **Architecture unifiée Next.js (App Router)** : Suppression du serveur backend Express distinct (`api_server`) et consolidation complète de l'application dans Next.js.
- **API Route Handlers** : Migration des routes API (`/api/getChallenge`, `/api/getAllChallenge`, `/api/addChallenge`, `/api/checkToken`) en Route Handlers Next.js natifs.

### 🗄️ ORM & Base de Données PostgreSQL
- **Remplacement de MySQL par PostgreSQL** : Adoption de PostgreSQL comme système de gestion de base de données relationnelle.
- **Intégration de Prisma ORM** :
  - Définition des modèles `User`, `Session`, `Account`, `Verification` et `Challenge` dans `prisma/schema.prisma`.
  - Script de seed (`prisma/seed.ts`) pour peupler automatiquement la base de données avec les défis initiaux.
  - Script d'entrée Docker (`docker-entrypoint.sh`) exécutant `prisma db push` et `prisma db seed` au démarrage.

### 🔐 Authentification Moderne (Better Auth)
- **Intégration de Better Auth** : Remplacement de la gestion manuelle JWT/BCrypt par la bibliothèque `better-auth` avec adaptateur Prisma.
- **Client & React Hooks** : Mise en place des utilitaires d'authentification client (`signIn.email`, `signUp.email`, `signOut`, `useSession`).
- **Protection des endpoints** : Enregistrement sécurisé des utilisateurs et protection du formulaire d'ajout de défis.

### 🎨 Amélioration de l'Interface Utilisateur (UI)
- **Design Modernisé** : Cartes glassmorphism, dégradés dynamiques, badges d'état et icônes Lucide.
- **Expérience de jeu réactive** :
  - **Accueil** : Affichage dynamique du statut d'utilisateur connecté et bouton de déconnexion.
  - **Jeu** : Gestion fluide des joueurs (garçon/fille), animations et décompte des tours.
  - **Tous les défis** : Ajout d'une barre de recherche en temps réel et de filtres (Tous, Action, Vérité).
  - **Ajout de défis** : Formulaire modernisé avec retour visuel par notifications Toast.

### 🐳 Déploiement & Containerisation
- **Docker Compose** : Configuration simple orchestrant le conteneur PostgreSQL (`truthordare_db`) avec *healthcheck* et l'application Next.js standalone (`truthordare_app`).
- **Fichiers d'environnement** : Création du modèle `.env.example` et centralisation de la configuration `.env`.

### 🤖 Automation & CI/CD (GitHub Actions)
- **Workflow GHCR** (`.github/workflows/docker-build-push.yml`) :
  - Exécution de la vérification de build (`npm run build`).
  - Construction multi-stage de l'image Docker.
  - Publication automatique de l'image sur GitHub Container Registry (`ghcr.io`).

---

## [0.5.0] - Version Précédente
- Structure séparée frontend Next.js / backend Express JS.
- Base de données MySQL avec script SQL manuel.
