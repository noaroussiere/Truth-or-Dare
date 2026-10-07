# Action ou Vérité 🔥 (v0.5.1)

Projet moderne de jeu **Action ou Vérité** migré sur **Next.js App Router**, **Prisma ORM**, **PostgreSQL** et **Better Auth**.

---

## 🚀 Nouveautés v0.5.1

- ⚡ **Architecture Unifiée Next.js** : Fusion du serveur Express et de l'interface en un unique projet Next.js App Router (Route Handlers & Server Components).
- 🗄️ **Base de données PostgreSQL + Prisma ORM** : Remplacement de MySQL brut par PostgreSQL géré par Prisma ORM avec migrations et seeding automatique.
- 🔐 **Authentification Modernisée (Better Auth)** : Gestion de la connexion, inscription et sessions d'utilisateurs via `better-auth` avec adaptateur Prisma.
- 🎨 **Interface Graphique (UI) Sublimée** : Design réactif avec Tailwind CSS, Lucide Icons et composants glassmorphism.
- 🐳 **Déploiement Simplifié Docker Compose** : Lancement d'un conteneur PostgreSQL et de l'application Next.js standalone avec un simple `docker compose up -d`.
- 📦 **CI/CD GitHub Actions** : Workflow automatique qui valide le build (`npm run build`), génère l'image Docker multi-stage et la pousse sur **GitHub Container Registry (`ghcr.io`)**.

---

## 🛠️ Configuration & Déploiement

### 1. Variables d'environnement

Copiez le fichier d'exemple `.env.example` en `.env` :

```bash
cp .env.example .env
```

Modifiez au besoin les clés dans le fichier `.env` :

```env
DATABASE_URL="postgresql://postgres:postgres@db:5432/truthordare?schema=public"
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=truthordare
APP_PORT=3000
BETTER_AUTH_SECRET="votre-secret-de-securite-au-moins-32-caracteres"
BETTER_AUTH_URL="http://localhost:3000"
```

---

### 2. Déploiement avec Docker Compose

Lancement en local ou sur votre serveur :

```bash
docker compose up -d --build
```

L'application sera accessible sur `http://localhost:3000` (ou le port défini dans `APP_PORT`).

---

### 3. Développement local sans Docker

Si vous préférez exécuter le projet localement :

```bash
# Inscription et installation des dépendances
npm install

# Génération du client Prisma & application du schéma sur PostgreSQL local
npx prisma db push
npx prisma db seed

# Lancement en serveur de développement
npm run dev
```

---

## 📜 Changelog

Consultez le fichier [`CHANGELOG.md`](./CHANGELOG.md) pour le détail des évolutions de la version 0.5.1.

---

## 👏 Contribution & Crédits

**Auteur originel :** [@nduboi](https://github.com/nduboi)  
**Version 0.5.1 :** Modernisation Next.js / PostgreSQL / Prisma / Better Auth / Docker / GHCR Action.
