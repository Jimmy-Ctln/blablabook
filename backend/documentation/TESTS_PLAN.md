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

### API Integration (`books.test.ts`)

Parties testées avec les cas d'erreur:

| Fonction                          | Cas Testé               | Données                                  | Résultat Attendu               | Code Erreur |
| --------------------------------- | ----------------------- | ---------------------------------------- | ------------------------------ | ----------- |
| `getBooks`                        | Récupération succès     | aucune                                   | Retourne {[category]: books[]} | 200         |
| `getBooks`                        | Erreur réseau           | aucune                                   | Erreur réseau                  | Erreur      |
| `getUserBooks`                    | Succès avec livres      | userId valide                            | Retourne {books: [], total: N} | 200         |
| `getUserBooks`                    | Utilisateur sans livres | userId valide, empty                     | {books: [], total: 0}          | 200         |
| `getUserBooks`                    | User ID invalide        | userId inexistant                        | Erreur not found               | 404         |
| `addBookToUserList`               | Ajout succès            | {userId, bookId}                         | Book ajouté à la liste         | 201         |
| `addBookToUserList`               | Book inexistant         | bookId invalide                          | Erreur not found               | 404         |
| `addBookToUserList`               | User inexistant         | userId invalide                          | Erreur unauthorized            | 401         |
| `removeBookFromUserList`          | Suppression succès      | {userId, bookId}                         | Book retiré de la liste        | 200         |
| `removeBookFromUserList`          | Book non trouvé         | bookId inexistant                        | Erreur not found               | 404         |
| `updateBookStatus`                | Statut "À lire"         | {userId, bookId, readStart: null}        | Status mis à jour              | 200         |
| `updateBookStatus`                | Statut "En cours"       | {userId, bookId, readStart: date}        | Status mis à jour              | 200         |
| `updateBookStatus`                | Statut "Lu"             | {userId, bookId, readEnd: date}          | Status mis à jour              | 200         |
| `updateBookStatus`                | Données invalides       | dates invalides                          | Erreur validation              | 422         |
| `getSearchBooks`                  | Recherche succès        | query: "fiction"                         | Retourne livres filtrés        | 200         |
| `getSearchBooks`                  | Query vide              | query: ""                                | Retourne [] ou erreur          | 400         |
| `searchExternalBooks` - text      | Recherche OpenLib       | {type: "searchText", searchText: "Book"} | Retourne résultats externes    | 200         |
| `searchExternalBooks` - category  | Filtre par catégorie    | {type: "category", category: "fiction"}  | Livres filtrés                 | 200         |
| `searchExternalBooks` - random    | Livres aléatoires       | {type: "random"}                         | Retourne N livres aléatoires   | 200         |
| `searchExternalBooks` - API error | Erreur OpenLibrary      | query invalide                           | Erreur API externe             | Erreur      |

### Hooks

#### `useAddBook` (`useAddBook.test.tsx`)

| Cas Testé              | Setup                         | Résultat Attendu              | Code Erreur |
| ---------------------- | ----------------------------- | ----------------------------- | ----------- |
| Mutation succès        | Mock ISBN data valide         | Book ajouté, cache updated    | 201         |
| Mutation avec keywords | Categories détectées          | Keywords enregistrés          | 201         |
| ISBN inexistant        | ISBN non trouvé en API        | Error state, refetch support  | 404         |
| Données validation     | Champs obligatoires manquants | Erreur validation en mutation | 422         |
| Optimistic update      | Mutation en cours             | UI updated immédiatement      | Pending     |

#### `useUserBooks` (`useUserBooks.test.tsx`)

| Cas Testé              | Setup                   | Résultat Attendu               | Code Erreur |
| ---------------------- | ----------------------- | ------------------------------ | ----------- |
| Query succès           | userId valide           | Retourne {books: [], total: N} | 200         |
| Query vide             | Utilisateur sans livres | {books: [], total: 0}          | 200         |
| Mutation update status | newStatus valide        | Book status mis à jour         | 200         |
| Mutation remove book   | bookId valide           | Book supprimé de la liste      | 200         |
| Query error            | userId invalide         | Erreur state, can retry        | 401         |
| Invalidation cache     | Après mutation          | Cache revalidé automatiquement | —           |

#### `useCurrentUser` (`useCurrentUser.test.tsx`)

| Cas Testé                              | Input (Store)             | Output                     | Code/State  |
| -------------------------------------- | ------------------------- | -------------------------- | ----------- |
| User authenticated                     | user: User, isAuth: true  | data: User, isError: false | 200         |
| User not authenticated                 | user: null, isAuth: false | data: null, isError: true  | 401         |
| State inconsistent (user but not auth) | user: User, isAuth: false | data: User, isError: true  | State error |
| State inconsistent (auth but no user)  | user: null, isAuth: true  | data: null, isError: false | State error |
| After logout                           | user: null, isAuth: false | data: null, isError: true  | 204         |
| isLoading always false                 | any state                 | isLoading: false           | N/A         |

### Components

#### `AddBookModal` (`AddBookModal.test.tsx`)

| Cas Testé             | Action               | Résultat Attendu              | Code |
| --------------------- | -------------------- | ----------------------------- | ---- |
| Modal renders         | isOpen=true          | Modal visible avec SearchBar  | 200  |
| Search books          | Tapez query ≥2 chars | Appel API lance automatically | 200  |
| No search             | Query < 2 chars      | Aucun appel API               | —    |
| Select book           | Click sur book       | Modal close, book added       | 201  |
| Modal close           | Click X ou backdrop  | Modal hidden, cache reset     | 200  |
| Show internal books   | Pas de search        | Affiche 10 livres random      | 200  |
| Show external results | Search lancée        | Affiche résultats OpenLibrary | 200  |

#### `BookCard` (`BookCard.test.tsx`)

| Cas Testé        | Props             | Action                              | Résultat                |
| ---------------- | ----------------- | ----------------------------------- | ----------------------- |
| Card renders     | book: BookDisplay | Affiche titre + auteur + couverture | 200                     |
| Click navigation | book: BookDisplay | Click card                          | Navigate to /books/{id} |
| Missing cover    | cover: undefined  | Placeholder image affiché           | —                       |
| Hover state      | Mouse over        | Visual feedback shown               | —                       |

### Stores

#### `authStore` (`authStore.test.ts`)

| Cas Testé                | Action                       | Résultat Attendu              | Erreur       |
| ------------------------ | ---------------------------- | ----------------------------- | ------------ |
| Login success            | setUser + setAuth true       | Store updated                 | —            |
| Logout                   | setUser null + setAuth false | Store cleared                 | —            |
| Token refresh            | setToken + newJWT            | JWT actualisé                 | 401 si error |
| Multiple state selectors | useAuthStore((s) => s.user)  | Correct slice retourné        | —            |
| Store persistence        | localStorage sync            | State persisted               | —            |
| Unauthorized state       | isAuth false                 | useCurrentUser → isError true | 401          |

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
