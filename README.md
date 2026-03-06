# Recipes API

REST API de gestion de recettes de cuisine, construite avec **Node.js**, **Express**, **PostgreSQL** et **Prisma ORM**.

## Technologies

- **Runtime**: Node.js 20
- **Framework**: Express 4
- **Base de donnees**: PostgreSQL 16
- **ORM**: Prisma 5
- **Tests**: Jest + Supertest
- **Linting**: ESLint 9
- **Conteneurisation**: Docker + Docker Compose
- **CI/CD**: GitHub Actions

## Structure du projet

```
recipes-api/
├── .github/
│   └── workflows/
│       └── ci.yml          # Pipeline CI/CD (lint → tests → docker build)
├── src/
│   ├── app.js              # Application Express (sans listen)
│   ├── server.js           # Point d'entree (lance le serveur)
│   ├── routes/
│   │   └── recipes.js      # Routes CRUD pour les recettes
│   ├── middleware/
│   │   └── errorHandler.js # Gestionnaire d'erreurs global
│   └── lib/
│       └── prisma.js       # Instance Prisma Client
├── tests/
│   └── app.test.js         # Tests Jest + Supertest (8 tests)
├── prisma/
│   └── schema.prisma       # Schema de la base de donnees
├── Dockerfile
├── .dockerignore
├── docker-compose.yml
├── .gitignore
├── eslint.config.mjs
├── package.json
└── README.md
```

## Installation

### Prerequis

- Node.js 20+
- PostgreSQL 16+ (ou Docker)

### Installation locale

```bash
# Installer les dependances
npm install

# Copier et configurer les variables d'environnement
cp .env.example .env
# Editer .env avec vos credentials PostgreSQL

# Generer le client Prisma
npm run prisma:generate

# Executer les migrations
npm run prisma:migrate
```

Creer un fichier `.env` a la racine :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/recipesdb"
PORT=3000
```

## Lancer l'application

### En local (avec PostgreSQL local)

```bash
# Mode developpement (avec rechargement automatique)
npm run dev

# Mode production
npm start
```

L'API sera disponible sur `http://localhost:3000`

### Avec Docker Compose

```bash
# Construire et lancer (API + PostgreSQL)
docker compose up --build

# En arriere-plan
docker compose up --build -d

# Arreter
docker compose down
```

## Executer les tests

```bash
npm test
```

Les tests utilisent des mocks Prisma et ne necessitent pas de base de donnees.

## Linting

```bash
npm run lint
```

## Routes API

| Methode | Route           | Description                        | Status     |
|---------|----------------|------------------------------------|------------|
| GET     | /health         | Verification du statut de l'API    | 200        |
| GET     | /recipes        | Liste toutes les recettes          | 200        |
| GET     | /recipes/:id    | Recupere une recette par ID        | 200 / 404  |
| POST    | /recipes        | Cree une nouvelle recette          | 201 / 400  |
| PUT     | /recipes/:id    | Modifie une recette existante      | 200 / 404  |
| DELETE  | /recipes/:id    | Supprime une recette               | 200 / 404  |

### Champs d'une recette

| Champ         | Type    | Requis | Description                    |
|---------------|---------|--------|--------------------------------|
| `title`       | string  | Oui    | Nom de la recette              |
| `ingredients` | string  | Oui    | Liste des ingredients          |
| `steps`       | string  | Oui    | Etapes de preparation          |
| `duration`    | integer | Oui    | Duree en minutes               |
| `description` | string  | Non    | Description optionnelle        |

## Exemples de requetes curl

### Verifier la sante de l'API

```bash
curl http://localhost:3000/health
```

### Lister toutes les recettes

```bash
curl http://localhost:3000/recipes
```

### Creer une recette

```bash
curl -X POST http://localhost:3000/recipes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Spaghetti Bolognese",
    "description": "Un classique de la cuisine italienne",
    "ingredients": "500g de spaghetti, 400g de boeuf hache, 1 boite de tomates, 1 oignon, 2 gousses dail",
    "steps": "1. Faire revenir loignon. 2. Ajouter le boeuf. 3. Incorporer les tomates. 4. Cuire les pates. 5. Melanger.",
    "duration": 45
  }'
```

### Recuperer une recette par ID

```bash
curl http://localhost:3000/recipes/1
```

### Modifier une recette

```bash
curl -X PUT http://localhost:3000/recipes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Spaghetti Bolognese revisitee",
    "duration": 50
  }'
```

### Supprimer une recette

```bash
curl -X DELETE http://localhost:3000/recipes/1
```

## Pipeline CI/CD

Le pipeline GitHub Actions (`.github/workflows/ci.yml`) comprend 3 jobs sequentiels :

1. **Lint** - Verification du code avec ESLint
2. **Tests** - Execution de la suite de tests Jest
3. **Docker Build** - Construction de l'image Docker

Declenche sur chaque `push` et `pull_request`.

## Branches Git

Le projet a ete developpe avec la structure de branches suivante :

- `feature/database` - Schema Prisma et configuration de la base de donnees
- `feature/api` - Implementation des routes et de la logique metier
- `feature/tests` - Suite de tests Jest + Supertest
- `main` - Branche principale (merge des branches feature)
