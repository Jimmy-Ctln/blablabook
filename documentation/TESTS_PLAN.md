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

## Frontend - 25 tests

#### Login Page (3 tests)

| Test                                                  | Description                     |
| ----------------------------------------------------- | ------------------------------- |
| `should render the login page with title 'Connexion'` | Formulaire affiché correctement |
| `should submit login request with credentials`        | Credentials valides → API call  |
| `should handle login error and show message`          | Credentials invalides → erreur  |

#### Register Page (3 tests)

| Test                                 | Description                               |
| ------------------------------------ | ----------------------------------------- |
| `should render register form`        | Formulaire inscription affiché            |
| `should validate password match`     | Confirmation password ≠ password → erreur |
| `should handle registration success` | Inscription OK → redirection login        |

#### HomePage (8 tests)

| Test                                            | Description                              |
| ----------------------------------------------- | ---------------------------------------- |
| `should render hero section`                    | Banneau/Hero section visible             |
| `should render book carousels`                  | Carousels par catégories affichés        |
| `should have correct categories`                | 7 catégories présentes (adventure, etc.) |
| `should handle loading state`                   | Spinner pendant fetch                    |
| `should display categories carousels correctly` | Carousels avec livres par catégorie      |
| `should handle empty carousel state`            | Message vide si pas de livres            |
| `should render footer`                          | Footer section visible                   |
| `should navigate to library on click`           | Click category → LibraryPage             |

#### LibraryPage (5 tests)

| Test                                          | Description                           |
| --------------------------------------------- | ------------------------------------- |
| `shows status counters`                       | Boutons À lire/En cours/Lu visibles   |
| `filters by search input`                     | Recherche par titre/auteur fonctionne |
| `renders all cards when search is empty`      | Liste complète affichée               |
| `shows empty state when no books`             | Message vide si 0 livres              |
| `opens AddBookModal when clicking add button` | Click ajouter livre → Modal apparaît  |

#### BookDetails (6 tests - Utility tests, excluded from coverage metrics)

| Test                                        | Description                   |
| ------------------------------------------- | ----------------------------- |
| `should format date for database correctly` | Conversion date → ISO OK      |
| `should handle invalid date string`         | Date invalide → default date  |
| `should have book statuses`                 | Statuts définis correctement  |
| `should track user book list`               | Suivi liste utilisateur OK    |
| `should update book status`                 | Statut changeable (À lire/Lu) |
| `should handle external book data`          | Données externes traitées OK  |

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
