# Plan de Test - BlabaBook

## Vue d'ensemble

Ce plan détaille les tests mis en place, couvrant les fonctionnalités essentielles du backend.

---

## Tableau Récapitulatif des Tests

| ## Module    | Cas de Test                         | Endpoint/Fonction                             | Données Entrée                                    | Code HTTP  | Résultat Attendu                                                                                    |
| ------------ | ----------------------------------- | --------------------------------------------- | ------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------- |
| **AUTH**     | Inscription valide                  | POST /auth/register                           | email, password, confirmPassword                  | 201        | Utilisateur créé, password haché, JWT retourné                                                      |
|              | Email déjà existant                 | POST /auth/register                           | email existant                                    | 409        | Erreur "email already in use"                                                                       |
|              | Password invalide                   | POST /auth/register                           | password trop court                               | 400        | Erreur "password too short"                                                                         |
|              | Password non confirmé               | POST /auth/register                           | password ≠ confirmPassword                        | 422        | Erreur "password is not confirmed"                                                                  |
|              | Login avec credentials corrects     | POST /auth/login                              | email + password valides                          | 200        | JWT token + utilisateur {id, email, username, role}                                                 |
|              | Login email inexistant              | POST /auth/login                              | email non enregistré                              | 401        | Erreur "unauthorized"                                                                               |
|              | Login password incorrect            | POST /auth/login                              | password mauvais                                  | 401        | Erreur "unauthorized"                                                                               |
|              | Auth Guard avec token valide        | GET /books/library/:userId (headers + Bearer) | JWT valide en Authorization                       | 200        | Requête autorisée                                                                                   |
|              | Auth Guard sans token               | GET /books/library/:userId                    | Pas d'Authorization header                        | 401        | Erreur "unauthorized"                                                                               |
|              | Auth Guard token expiré             | GET /books/library/:userId                    | JWT expiré                                        | 401        | Erreur "unauthorized"                                                                               |
|              | Hash password différent             | service.hashPassword()                        | plaintext password                                | N/A (unit) | Hash ≠ plaintext                                                                                    |
|              | Verify password correct             | service.verifyPassword()                      | plaintext + hash                                  | N/A (unit) | true                                                                                                |
|              | Verify password incorrect           | service.verifyPassword()                      | plaintext mauvais + hash                          | N/A (unit) | false                                                                                               |
| **BOOKS**    | Ajouter nouveau livre avec keywords | POST /books/library/:userId                   | {name, author, isbn, categories: ["horror"]}      | 201        | Livre créé, category determinée par matching, keywords enregistrés                                  |
|              | Ajouter livre sans keywords match   | POST /books/library/:userId                   | {name, author, isbn, categories: ["unknown-xyz"]} | 201        | Livre créé avec categoryId=1 (Unknown), aucune entrée book_keyword                                  |
|              | Ajouter livre existant (même ISBN)  | POST /books/library/:userId                   | {isbn: "existant"}                                | 201        | Livre réutilisé (pas créé), list_book lié à nouvel utilisateur                                      |
|              | Retirer livre de liste              | DELETE /books/library/:userId/book/:bookId    | bookId existant                                   | 200        | list_book supprimée, livre reste en base                                                            |
|              | Retirer livre inexistant            | DELETE /books/library/:userId/book/:bookId    | bookId absent                                     | 404        | Erreur "book not found"                                                                             |
|              | Récupérer livres utilisateur        | GET /books/library/:userId                    | userid valide                                     | 200        | Array {books, total}, chaque book avec {id, name, author, categoryName, status, readStart, readEnd} |
|              | Utilisateur sans livres             | GET /books/library/:userId                    | userid sans aucun livre                           | 200        | {books: [], total: 0}                                                                               |
|              | Marquer livre "En cours"            | PATCH /books/library/:userId/book/:bookId     | {readStart: "2024-01-01", readEnd: null}          | 200        | Status = "En cours", readStart défini                                                               |
|              | Marquer livre "Lu"                  | PATCH /books/library/:userId/book/:bookId     | {readStart: "2024-01-01", readEnd: "2024-02-01"}  | 200        | Status = "Lu", readEnd défini                                                                       |
|              | Réinitialiser livre "À lire"        | PATCH /books/library/:userId/book/:bookId     | {readStart: null, readEnd: null}                  | 200        | Status = "À lire", aucune date                                                                      |
| **CATEGORY** | Récupérer toutes catégories         | GET /categories                               | aucune                                            | 200        | Array [{id, name, description}, ...]                                                                |
|              | Filtrer livres par catégorie        | GET /books?categories=horror,fiction          | categories query param                            | 200        | Livres filtrés par category name                                                                    |
| **USER**     | Récupérer profil utilisateur        | GET /user/:userId                             | userId valide                                     | 200        | {id, email, username, role, createdAt}                                                              |
|              | GDPR soft delete                    | DELETE /user/:userId                          | userId valide                                     | 204        | Utilisateur anonymisé (email, username blank), softDeleted=true                                     |
|              | Vérifier accès non-autorisé         | GET /user/:otherUserId                        | userId ≠ authenticatedUserId                      | 403        | Erreur "forbidden"                                                                                  |
| **SECURITY** | Cookie refresh token stocké         | POST /auth/login (set-cookie)                 | credentials valides                               | 200        | Cookie "refresh_cookie" présent, HttpOnly, Secure                                                   |
|              | Token JWT valide                    | service.generateJWTToken()                    | userId + role                                     | N/A (unit) | Token signé, payload contient {sub, userRole}                                                       |
|              | Rotate tokens valides               | POST /auth/refresh                            | refresh_cookie valide                             | 200        | Nouveau JWT + nouveau refresh token                                                                 |
|              | Rotate token expiré                 | POST /auth/refresh                            | refresh_cookie expiré                             | 401        | Erreur "unauthorized"                                                                               |
|              | Logout détruit refresh              | POST /auth/logout                             | utilisateur actif                                 | 204        | Refresh token en base supprimé, cookie cleared                                                      |

---

## Codes HTTP Utilisés

| Code | Signification        | Cas d'Usage                 |
| ---- | -------------------- | --------------------------- |
| 200  | OK                   | Login, fetch, update        |
| 201  | Created              | Création utilisateur/livre  |
| 204  | No Content           | Logout, delete, soft delete |
| 400  | Bad Request          | Données invalides           |
| 401  | Unauthorized         | Credentials/token invalides |
| 403  | Forbidden            | Accès non-autorisé          |
| 404  | Not Found            | Ressource inexistante       |
| 409  | Conflict             | Email existant              |
| 422  | Unprocessable Entity | Donnée incohérente          |

---

### 1. Authentification

- ✅ Register + password hash
- ✅ Login + JWT + refresh token en cookie
- ✅ Auth Guard validation
- ✅ Logout + token destruction

### 2. Books

- ✅ Nouveau livre + keyword matching (ILIKE)
- ✅ Catégorie gagnante (GROUP BY count)
- ✅ Livre existant (réutilisation)
- ✅ Status calcul (À lire / En cours / Lu)
- ✅ Suppression + RGPD

### 3. Categories & Keywords

- ✅ Récupération catégories
- ✅ Matching automatique
- ✅ Fallback "Unknown" si aucun match

### 4. User Profile

- ✅ Profil utilisateur
- ✅ GDPR soft delete + anonymisation

### 5. Security

- ✅ JWT tokens (génération + validation expiry)
- ✅ Refresh tokens
- ✅ Password hashing
- ✅ Cookies HttpOnly/Secure

---

## Frontend - Tests Frontend

### API Integration

Parties testées :

- `getBooks` - Récupération des livres
- `getUserBooks` - Récupération des livres de l'utilisateur
- `addBookToUserList` - Ajout d'un livre à la liste
- `removeBookFromUserList` - Suppression d'un livre de la liste
- `updateBookStatus` - Mise à jour du statut (À lire / En cours / Lu)
- `getSearchBooks` - Recherche de livres
- `searchExternalBooks` - Recherche dans API externe (text / category / random / skip)

### Hooks

Parties testées :

- `useAddBook` - Hook d'ajout de livre
- `useUserBooks` - Hook de récupération des livres utilisateur
- `useCurrentUser` - Hook pour récupérer l'utilisateur actuel

### Components

Parties testées :

- `AddBookModal` - Modal d'ajout de livre
- `BookCard` - Carte de livre

### Stores

Parties testées :

- `authStore` - Gestion de l'authentification

---

## Résumé Global

- **Backend** : 161 tests implémentés
- **Frontend** : API Integration, Hooks, Components et Stores testés

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
