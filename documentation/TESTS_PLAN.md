# Plan de Test - BlaBlaBook

## Vue d'ensemble

Suite de tests couvrant l'authentification, la gestion des livres, la catégorisation automatique, les guards de sécurité et les pages principales.

**Total : 169 tests — tous verts ✅**

---

## Backend - 74 tests (unitaires)

> Les 5 suites ci-dessous couvrent les composants métier essentiels. 4 suites supplémentaires existent dans le projet (`category.service.spec.ts`, `password.service.spec.ts`, `token.service.spec.ts`, `token.repository.spec.ts`) et sont couvertes par la mesure globale.

### Auth Service (11 tests) — `auth.service.spec.ts`

| Test | Description | Entrée | Résultat attendu |
|---|---|---|---|
| `should be defined` | Service correctement injecté | — | Service défini |
| `login - should return user if login is valid` | Connexion réussie | email + password valides | Utilisateur retourné |
| `login - should throw error if user not exist` | Login avec email inconnu | email inexistant | `UnauthorizedException` |
| `login - should throw UnauthorizedError if password invalid` | Mauvais mot de passe | password incorrect | `UnauthorizedException` |
| `register - should create new user` | Inscription valide | email, username, password | Utilisateur créé, mot de passe haché |
| `register - should throw error if user not created` | Échec création DB | données valides + DB en erreur | `InternalServerErrorException` |
| `register - should throw error if password not confirmed` | Password ≠ confirmation | password mismatch | `UnprocessableEntityException` |
| `register - should throw error if email already exists` | Email déjà utilisé | email existant | `UnprocessableEntityException` |
| `register - should throw error if username already exists` | Username déjà utilisé | username existant | `UnprocessableEntityException` |
| `logout - should destroy refresh token` | Déconnexion standard | refreshToken valide | Token détruit en base |
| `logout - should handle missing refresh token gracefully` | Token introuvable | refreshToken inexistant | Warning loggé, pas d'erreur |

### Books Service (19 tests) — `books.service.spec.ts`

| Test | Description | Entrée | Résultat attendu |
|---|---|---|---|
| `should be defined` | Service correctement injecté | — | Service défini |
| `should add book to user list` | Ajout livre existant | userId, CreateBookDto | Livre lié à la liste |
| `should remove book from user list` | Retrait livre | userId, bookId | Livre délié |
| `should find user books with status` | Lecture bibliothèque | userId, pagination | Liste avec statuts calculés |
| `should find all books by categories` | Filtrage par catégorie | categories[] | Livres groupés par catégorie |
| `should get random books with limit` | Sélection aléatoire | limit | N livres aléatoires |
| `should update book status with reading dates` | Changement statut | userId, bookId, dates | Statut mis à jour |
| `should throw when user list not found during update` | Liste inexistante | userId invalide | `HttpException 404` |
| `should create new book when not existing` | Insertion nouveau livre | CreateBookDto | Livre créé + catégorisé |
| `should create user list if not existing` | Création liste à la volée | userId sans liste | Liste créée + livre lié |
| `should update book note successfully` | Mise à jour note | userId, bookId, comment | Note enregistrée |
| `should throw when user list not found during note update` | Note sur liste inexistante | userId invalide | `HttpException 404` |
| `should handle error when adding book to list` | Erreur DB lors d'un ajout | DB en erreur | `HttpException 500` |
| `should return 409 Conflict when book already exists` | Livre déjà dans la bibliothèque | Erreur unique constraint (`code: 23505`) | `HttpException 409` + message `"Book already in user library"` |
| **`normalizeSubjects trims and filters empty strings`** | **Nettoyage des subjects** | `["  horror  ", "", "fantasy"]` | `["horror", "fantasy"]` |
| **`pickWinningCategory returns 1 (unknown) when no match`** | **Cas sans match** | `[]` | `1` |
| **`pickWinningCategory returns the only category`** | **Un seul match** | `[{categoryId:5}]` | `5` |
| **`pickWinningCategory returns category with most matches`** | **Catégorie majoritaire** | 3x horreur + 1x romance | `3` (horreur) |
| **`pickWinningCategory handles ties deterministically`** | **Ex-aequo géré** | 1x cat 4 + 1x cat 7 | `4` ou `7` (déterministe) |

### User Service (12 tests) — `user.service.spec.ts`

| Test | Description | Entrée | Résultat attendu |
|---|---|---|---|
| `should be defined` | Service correctement injecté | — | Service défini |
| `should create a new user` | Création utilisateur | userData | Utilisateur inséré |
| `should get user by email` | Recherche par email | email | Utilisateur trouvé |
| `should get user by username` | Recherche par username | username | Utilisateur trouvé |
| `should check existing user` | Vérification doublon | username + email | Utilisateur si existe |
| `should update user data` | Mise à jour profil | id, updateData | Utilisateur mis à jour |
| `should throw if email already taken on update` | Email pris par un autre | email d'un autre user | `UnprocessableEntityException` |
| `should change password successfully` | Changement mot de passe | id, ancien + nouveau | Mot de passe haché + refresh tokens supprimés |
| `should throw error when current password is incorrect` | Vérification ancien mdp | mauvais ancien mdp | `UnprocessableEntityException` |
| `should soft delete user with anonymization` | RGPD Article 17 | userId | Email/username anonymisés, `deletedAt` set |
| `should find user by id` | Recherche par id | id | Profil utilisateur |
| `should throw if user not found by id` | ID inexistant | id invalide | `NotFoundException` |

### Sécurité — AuthGuard (3 tests) — `auth.guard.spec.ts` 🔒

| Test | Description | Entrée | Résultat attendu |
|---|---|---|---|
| `rejects request without jwt_cookie` | Absence de token | request sans cookies | `UnauthorizedException` |
| `rejects request with invalid jwt_cookie` | Token malformé | jwt_cookie invalide | `UnauthorizedException` |
| `accepts request with valid jwt_cookie and attaches payload` | Token valide | jwt_cookie valide | `true` + payload attaché à `request.user` |

### Sécurité — JsonContentTypeGuard (6 tests) — `content-type.guard.spec.ts` 🔒

| Test | Description | Entrée | Résultat attendu |
|---|---|---|---|
| `allows GET requests regardless of Content-Type` | GET non concerné | `GET /...` | `true` |
| `rejects POST with application/x-www-form-urlencoded` | Vecteur CSRF | POST form-urlencoded | `BadRequestException` |
| `rejects POST with text/plain` | Vecteur CSRF | POST text/plain | `BadRequestException` |
| `accepts POST with application/json` | Cas nominal | POST JSON | `true` |
| `accepts POST with application/json; charset=utf-8` | Variante charset | POST JSON + charset | `true` |
| `allows POST with empty body (content-length: 0)` | Body vide légitime | POST sans body | `true` |

### Tests d'intégration PostgreSQL réel (4 tests) — `findMatchedKeywords.spec.ts`

Ces tests s'exécutent contre une vraie instance PostgreSQL (Docker isolé) et valident le comportement de la requête SQL de catégorisation, sans aucun mock.

| Test | Description | Résultat attendu |
|---|---|---|
| Word-boundary — anti faux positifs | Le sujet `"horror"` ne matche pas `"horreur"` ni `"horrorific"` | Seuls les mots exacts sont retournés |
| Case-insensitivity via `~*` | Le sujet `"Horror"` (majuscule) matche les keywords en minuscules | Match insensible à la casse |
| Multi-keyword — requête unique | Plusieurs subjects passés en une seule requête | Tous les keywords correspondants retournés |
| Aucun keyword reconnu | Subjects sans correspondance dans la table KEYWORD | Liste vide retournée |

### Tests fonctionnels HTTP (4 tests) — `books-functional.spec.ts`

Tests end-to-end via supertest contre un serveur NestJS réel et une base PostgreSQL isolée. Valident la chaîne complète : validation DTO → contrôleur → service → catégorisation → écriture en base → réponse HTTP.

| Test | Description | Résultat attendu |
|---|---|---|
| Ajout avec catégorisation | `POST /books/library/:userId` avec subjects reconnus (fantasy) | HTTP 201, livre créé, catégorie `fantasy` en base |
| Scoring — catégorie majoritaire | Subjects avec dominante horreur (horror, vampire, ghost, zombie) + 1 love | Catégorie `horreur` gagne par score |
| Case-insensitive | Subjects en majuscules (`HORROR`, `Vampires`, `GhOsT`) | Catégorie `horreur` → match insensible à la casse |
| Fallback catégorie Unknown | Subjects sans correspondance (`mathematics`, `accounting`) | HTTP 201, catégorie `unknown` en base |

---

## Frontend - 87 tests (23 fichiers)

> Les 5 pages ci-dessous sont détaillées. 18 fichiers de test supplémentaires couvrent les composants, hooks, stores, API et utilitaires (`axios`, `books`, `externalBooks`, `BookCardCarousel`, `BookCoverImage`, `Hero`, `CookieConsent`, `authStore`, `themeStore`, `useUserBooks`, `useExternalBooks`, `bookDisplayMapper`, `utils`, `routes`, etc.).

### Login Page (3 tests) — `LoginPage.spec.tsx`

| Test | Description |
|---|---|
| `should render the login page with title 'Connexion'` | Formulaire affiché correctement |
| `should submit login request with credentials` | Credentials valides → appel API |
| `should handle login error and show message` | Credentials invalides → message d'erreur |

### Register Page (3 tests) — `RegisterPage.spec.tsx`

| Test | Description |
|---|---|
| `should render register form` | Formulaire d'inscription affiché |
| `should validate password match` | Confirmation différente du mot de passe → erreur |
| `should handle registration success` | Inscription OK → redirection login |

### HomePage (6 tests) — `HomePage.test.tsx`

| Test | Description |
|---|---|
| `should render hero section` | Bannière/Hero section visible |
| `should render book carousels` | Carousels par catégories affichés |
| `should have correct categories` | Toutes les catégories présentes |
| `should handle loading state` | Spinner pendant fetch |
| `should display categories carousels correctly` | Carousels avec livres par catégorie |
| `should navigate to library on click` | Click sur catégorie → LibraryPage |

### LibraryPage (5 tests) — `LibraryPage.test.tsx`

| Test | Description |
|---|---|
| `shows status counters` | Boutons À lire/En cours/Lu visibles |
| `filters by search input` | Recherche par titre/auteur fonctionne |
| `renders all cards when search is empty` | Liste complète affichée |
| `shows empty state when no books` | Message vide si 0 livres |
| `opens AddBookModal when clicking add button` | Click bouton ajouter → modal apparaît |

### BookDetails (6 tests) — `BookDetails.test.tsx`

| Test | Description |
|---|---|
| `should format date for database correctly` | Conversion date → ISO OK |
| `should handle invalid date string` | Date invalide → date par défaut |
| `should have book statuses` | Statuts définis correctement |
| `should track user book list` | Suivi liste utilisateur OK |
| `should update book status` | Changement statut (À lire → Lu) |
| `should handle external book data` | Données OpenLibrary traitées OK |

---

## Tests fonctionnels manuels (parcours utilisateurs)

Ces tests sont exécutés manuellement via le navigateur ou Postman pour valider les parcours utilisateurs complets de bout en bout.

| Scénario | Outil | Étapes | Résultat attendu |
|---|---|---|---|
| Inscription complète | Navigateur | 1. Page register → 2. Renseigne email + mdp fort + username → 3. Submit | Redirection vers /login + message succès |
| Connexion + accès bibliothèque | Navigateur | 1. Page login → 2. Renseigne credentials → 3. Submit | Redirection vers /library, bibliothèque vide affichée |
| Recherche + ajout livre avec catégorisation | Navigateur | 1. Search "Harry Potter" → 2. Clique sur + d'un résultat | Livre ajouté, catégorie "fantasy" appliquée automatiquement |
| Changement de statut de lecture | Navigateur | 1. Bibliothèque → 2. Détail livre → 3. Change statut "À lire" → "En cours" | Statut mis à jour, badge couleur changé |
| Suppression de livre | Navigateur | 1. Bibliothèque → 2. Détail livre → 3. Clic supprimer | Livre retiré de la bibliothèque |
| Modification du profil | Navigateur | 1. Profil → 2. Change username → 3. Submit | Profil mis à jour, ancien username libéré |
| Changement de mot de passe + déconnexion automatique | Navigateur | 1. Profil → 2. Change password → 3. Refresh page | Refresh tokens invalidés, redirection /login |
| Déconnexion complète | Navigateur | 1. Click logout | Cookies effacés, redirection accueil |

---

## Tests de sécurité 🔒

### Tests automatisés (déjà couverts dans la section Backend)

Les tests unitaires des guards (`AuthGuard` + `JsonContentTypeGuard`) couvrent les vérifications côté code. Voir les sections dédiées ci-dessus.

### Tests manuels via Postman

| Scénario | Endpoint testé | Action | Résultat attendu |
|---|---|---|---|
| BOLA — accès cross-utilisateur | `GET /books/library/<id_user_B>` | User A connecté tente d'accéder à la biblio de user B | `403 Forbidden` |
| BOLA — modification cross-utilisateur | `PATCH /user/<id_user_B>` | User A connecté tente de modifier le profil de B | `403 Forbidden` |
| Rate limit login | `POST /auth/login` × 4 | 4 tentatives en < 1 min | 4e tentative → `429 Too Many Requests` |
| Validation DTO — champ inconnu | `POST /books/library/123` avec `{ malicious: "xxx" }` | Envoi d'un champ non déclaré dans le DTO | `400 Bad Request` |
| CSRF — Content-Type form-urlencoded | `POST /books/library/123` `Content-Type: application/x-www-form-urlencoded` | Tentative en form-urlencoded (vecteur CSRF) | `400 Bad Request` (`JsonContentTypeGuard`) |
| Auth — sans cookie | `GET /books/library/1` sans cookie | Requête sans authentification | `401 Unauthorized` |
| Auth — cookie JWT expiré | `GET /books/library/1` avec JWT > 15min | JWT expiré | `401 Unauthorized` → trigger du refresh |
| Mot de passe faible refusé | `POST /auth/register` avec password = "abc" | Mot de passe ne respectant pas la policy | `400 Bad Request` avec message du DTO |

---

## Couverture de code

> Conformément à la consigne (« plan de tests couvrant les fonctionnalités principales du projet »), la mesure de couverture est focalisée sur les composants essentiels : services métier backend, guards de sécurité, pages principales frontend. Les composants secondaires (pages légales, composants UI, hooks utilitaires) sont volontairement exclus du périmètre — ils sont validés indirectement par les tests fonctionnels manuels.

### Backend — couverture mesurée sur 5 composants essentiels

| Fichier | Statements | Branch | Functions | Lines |
|---|---|---|---|---|
| `auth.service.ts` | 84.44% | 80% | 80% | 83.72% |
| `auth.guard.ts` 🔒 | **95.65%** | 78.57% | 100% | 95.23% |
| `books.service.ts` | 86.79% | 59.42% | 92.59% | 88.17% |
| `content-type.guard.ts` 🔒 | **100%** | 87.5% | 100% | 100% |
| `user.service.ts` | 90.47% | 60% | 100% | 90.16% |
| **Total backend** | **87%** | — | — | **87%** |

### Frontend — couverture mesurée sur 4 pages principales

| Page | Statements | Branch | Functions | Lines |
|---|---|---|---|---|
| `HomePage.tsx` | 77.77% | 36.66% | 33.33% | 77.77% |
| `LibraryPage.tsx` | 82.35% | 60% | 69.23% | 80.64% |
| `LoginPage.tsx` | 100% | 50% | 100% | 100% |
| `RegisterPage.tsx` | 100% | 50% | 100% | 100% |
| **Total frontend** | **81%** | — | — | **81%** |

---

## Résumé global

- **Backend unitaires** : 74 tests (9 suites — auth, books, user, guards, password, token) — **87%** de couverture
- **Backend intégration PostgreSQL réel** : 4 tests (`findMatchedKeywords.spec.ts`)
- **Backend fonctionnels HTTP** : 4 tests (`books-functional.spec.ts`)
- **Frontend** : 87 tests (23 fichiers — pages, composants, hooks, stores, API, utilitaires) — **81%** de couverture
- **Tests fonctionnels manuels** : 8 scénarios utilisateurs documentés
- **Tests de sécurité manuels (Postman)** : 8 scénarios documentés
- **Tous les tests automatisés passent** : 169/169 ✅

---

## Commandes test

```bash
# Backend
cd backend && npm test          # Tous les tests backend
cd backend && npm run test:cov  # Avec couverture
cd backend && npm run test:e2e  # Tests e2e (placeholder actuel)

# Frontend
cd frontend && npm test           # Tests frontend
cd frontend && npm run test:cov   # Avec couverture
```
