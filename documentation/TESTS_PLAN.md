# Plan de Test - BlabaBook

## Vue d'ensemble

Suite de tests MVP pour les fonctionnalités essentielles. Focus sur l'authentification, la gestion des livres et les pages principales.

**Total: 59 tests (34 backend + 25 frontend)**

---

## Backend - 37 tests

### Auth Service (3 tests)

| Test                       | Description                 | Entrée                    | Résultat                             |
| -------------------------- | --------------------------- | ------------------------- | ------------------------------------ |
| `should register new user` | Créer un utilisateur valide | email, password, username | Utilisateur créé avec password haché |
| `should login user`        | Connexion avec credentials  | email, password           | JWT token retourné                   |
| `should logout user`       | Déconnexion                 | userId                    | Token supprimé de la base            |

### Books Service (3 tests)

| Test                            | Description          | Entrée                | Résultat                            |
| ------------------------------- | -------------------- | --------------------- | ----------------------------------- |
| `should add book to list`       | Ajouter un livre     | userId, CreateBookDto | Livre ajouté à la liste utilisateur |
| `should remove book from list`  | Retirer un livre     | userId, bookId        | Livre retiré de la liste            |
| `should find books with status` | Récupérer les livres | userId                | Liste des livres avec statuts       |

### User Service (3 tests)

| Test                         | Description          | Entrée          | Résultat                         |
| ---------------------------- | -------------------- | --------------- | -------------------------------- |
| `should create user`         | Nouvelle création    | userData        | Utilisateur créé en base         |
| `should get user by email`   | Chercher utilisateur | email           | Utilisateur trouvé               |
| `should check existing user` | Vérifier existence   | username, email | Retourne utilisateur s'il existe |

---

## Frontend - 14 tests

### Pages (14 tests)

#### Login Page (2 tests)

| Test                          | Description                 |
| ----------------------------- | --------------------------- |
| `should render login page`    | Formulaire affiché          |
| `should submit login request` | Credentials envoyés à l'API |

#### Register Page (2 tests)

| Test                          | Description                         |
| ----------------------------- | ----------------------------------- |
| `should render register page` | Formulaire inscription affiché      |
| `should submit registration`  | Données envoyées, redirection login |

#### HomePage (5 tests)

| Test                                     | Description                                  |
| ---------------------------------------- | -------------------------------------------- |
| `should render hero section`             | Banneau principal visible                    |
| `should render carousel with categories` | Carousels par catégorie                      |
| `should have categories defined`         | 7 catégories présentes                       |
| `should handle loading state`            | Spinner affiché pendant fetch                |
| `should display multiple categories`     | Catégories adventure, romance, fantasy, etc. |

#### LibraryPage (5 tests)

| Test                                  | Description                |
| ------------------------------------- | -------------------------- |
| `shows status counters`               | Boutons À lire/En cours/Lu |
| `filters by search input`             | Recherche par titre/auteur |
| `renders all cards when search empty` | Liste complète affichée    |
| `shows empty state`                   | Message quand 0 livres     |
| `opens AddBookModal`                  | Modal d'ajout fonctionne   |

---

## Test Coverage Détaillé

### Backend Services

| Service       | Statements | Branch | Functions | Status |
| ------------- | ---------- | ------ | --------- | ------ |
| Auth Service  | **84.44%** | 80%    | 80%       | ✅     |
| Books Service | **90%**    | 55.22% | 100%      | ✅     |
| User Service  | **91.37%** | 61.53% | 100%      | ✅     |

### Frontend Pages

| Page         | Statements | Branch | Functions | Status |
| ------------ | ---------- | ------ | --------- | ------ |
| HomePage     | **92.3%**  | 100%   | 80%       | ✅     |
| LibraryPage  | **82.35%** | 60%    | 69.23%    | ✅     |
| LoginPage    | **100%**   | 75%    | 100%      | ✅     |
| RegisterPage | **100%**   | 75%    | 100%      | ✅     |

---

## Résumé Global

- **Backend Total** : 34 tests, **89.11%** statements coverage
- **Frontend Total** : 25 tests, **93.2%** statements coverage
- **All tests passing** : 59/59 ✅

---

## Commandes Test

```bash
# Frontend
cd frontend && npm run test           # Tests frontend
cd frontend && npm run test:cov       # Avec couverture frontend
cd frontend && npm run test --watch   # Mode watch frontend

# Backend
cd backend npm run test          # Tous les tests backend
cd backend npm run test:cov      # Avec couverture backend
cd backend npm run test --watch  # Mode watch backend

```
