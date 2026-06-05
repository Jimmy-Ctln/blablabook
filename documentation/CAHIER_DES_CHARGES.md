# Cahier des charges — Projet BlaBlaBook

## Table des matières

1. [Présentation du projet](#1-présentation-du-projet)
2. [Définition des besoins & objectifs](#2-définition-des-besoins--objectifs)
3. [Outils de gestion et organisation](#3-outils-de-gestion-et-organisation)
4. [Fonctionnalités principales](#4-fonctionnalités-principales) — 4.1 MVP · 4.2 Additionnelles · 4.3 Évolutions futures
5. [Choix techniques](#5-choix-techniques)
6. [Architecture globale](#6-architecture-globale)
7. [Cible utilisateur](#7-cible-utilisateur)
8. [Navigateurs compatibles](#8-navigateurs-compatibles)
9. [Arborescence (Routes Front)](#9-arborescence-routes-front)
10. [Routes API (Back)](#10-routes-api-back)
11. [User Stories](#11-user-stories)
12. [Analyse des risques](#12-analyse-des-risques)
13. [Documents de conception](#13-documents-de-conception)
14. [Éléments graphiques](#14-éléments-graphiques)
15. [Contraintes techniques et réglementaires](#15-contraintes-techniques-et-réglementaires)
16. [Équipe & Rôles](#16-équipe--rôles)
17. [Planning & Organisation des sprints](#17-planning--organisation-des-sprints)
18. [Règles de gestion](#18-règles-de-gestion)
19. [Périmètre du projet — ce qui est hors scope](#19-périmètre-du-projet--ce-qui-est-hors-scope)
20. [Glossaire](#20-glossaire)

---

## 1. Présentation du projet

**BlaBlaBook** est une application web mobile-first permettant aux utilisateurs de gérer leur bibliothèque personnelle, de découvrir de nouveaux livres et de partager leurs avis avec une communauté de lecteurs.

La plateforme permet de rechercher des ouvrages via l'API OpenLibrary, d'ajouter des livres à une liste de lecture personnelle (à lire, en cours ou lu), de consulter des fiches détaillées, de laisser une note et un commentaire, et de suivre sa progression de lecture au quotidien.

L’application est déployée en production sur Vercel pour le frontend, Render pour le backend, ainsi que Supabase pour la base de données. Une pipeline CI/CD de production a été entièrement automatisée afin de déployer les services via GitHub Actions.

---

## 2. Définition des besoins & objectifs

### 2.1 Besoins

- **Centralisation** : Regrouper ses listes de lecture en un seul endroit, accessible depuis n'importe quel appareil.
- **Recherche simplifiée** : Permettre de trouver un ouvrage facilement, sans connaître son ISBN ni l'orthographe exacte de l'auteur.
- **Suivi de lecture** : Offrir un suivi visuel clair pour connaître l'état d'avancement de chaque livre (à lire, en cours, lu).
- **Accès aux informations** : Consulter rapidement le résumé, l'auteur, l'éditeur et les détails d'un livre avant de l'ajouter à sa liste.
- **Partage d'avis** : Laisser une note et un commentaire sur un livre pour aider les autres lecteurs à faire leur choix.

### 2.2 Objectifs

- **Simplifier la gestion de bibliothèque** : Offrir un outil intuitif pour dématérialiser et centraliser sa collection de livres.
- **Améliorer le suivi de lecture** : Permettre à l'utilisateur de garder une trace claire de ce qu'il a lu, ce qu'il est en train de lire et ce qu'il souhaite lire.
- **Soigner l'expérience utilisateur** : Proposer une interface agréable et fluide, accessible à tous les profils, y compris les moins technophiles.
- **Construire une base évolutive** : Concevoir une architecture technique robuste et maintenable, capable d'intégrer de nouvelles fonctionnalités (réseau social, clubs de lecture, recommandations) sans refonte majeure.

---

## 3. Outils de gestion et organisation

| Outil            | Usage                                                                               |
| ---------------- | ----------------------------------------------------------------------------------- |
| **Trello**       | Gestion du backlog, organisation des sprints et suivi des tâches                    |
| **Git & GitHub** | Versionning, code review, stratégie de branches (`main` / `dev` / feature branches) |
| **Méthodologie** | Agile Scrum — sprints courts, daily meetings, sprint planning et retrospective      |

---

## 4. Fonctionnalités principales

### 4.1 MVP

Les fonctionnalités ci-dessous constituent le périmètre du MVP. Elles sont toutes implémentées et disponibles en production.

- **Page d'accueil** : présentation du projet et affichage d'une sélection de livres issus de la base de données.
- **Authentification sécurisée** :
  - Inscription et connexion via email et mot de passe.
  - Gestion des sessions avec un access token JWT et un refresh token (rotation automatique).
  - Cookies HttpOnly pour sécuriser les tokens côté navigateur.
- **Gestion du profil** :
  - Modification du nom d'utilisateur, de l'email et du mot de passe.
  - Suppression du compte conforme au RGPD (droit à l'effacement — Article 17) : les données personnelles (email, pseudo, mot de passe, avatar) sont immédiatement anonymisées et remplacées par des valeurs neutres. Le compte est ensuite marqué comme supprimé (`deletedAt`) sans être effacé physiquement de la base, afin de préserver l'intégrité référentielle. Les avis laissés par l'utilisateur sont conservés mais dissociés de son compte (`userId` mis à `NULL`).
- **Bibliothèque personnelle** :
  - Ajout d'un livre depuis OpenLibrary.
  - Gestion du statut de lecture : À lire / En cours / Lu, calculé automatiquement à partir des dates de début et de fin de lecture.
  - Retrait d'un livre de la bibliothèque.
- **Recherche** : recherche par titre ou auteur via l'API OpenLibrary.
- **Fiche détaillée d'un livre** : couverture, auteur, résumé, éditeur, date de publication et catégorie.
- **Notes et avis** :
  - Dépôt d'une note (sur 5 étoiles) et d'un commentaire sur un livre.
  - Consultation des avis déposés par les autres utilisateurs.
  - Suppression de son propre avis.
- **Pages légales** : Mentions légales, Politique de confidentialité, Conditions d'utilisation.
- **Consentement aux cookies** : bandeau de consentement conforme au RGPD.

### 4.2 Fonctionnalités additionnelles implémentées

Ces fonctionnalités dépassent le périmètre du MVP défini initialement, mais ont été développées et sont disponibles en production.

- **Thème clair / sombre** : l'utilisateur peut basculer entre les deux modes d'affichage selon ses préférences.
- **Note privée sur un livre** : l'utilisateur peut saisir une note personnelle sur un livre de sa bibliothèque, visible uniquement par lui.
- **Catégorisation automatique** : lors de l'ajout d'un livre, une catégorie lui est attribuée automatiquement à partir des sujets fournis par OpenLibrary. Un système de scoring par mots-clés (table `KEYWORD`, opérateur PostgreSQL `~*` avec boundary de mot `\m\M`) détermine la catégorie gagnante par vote. En l'absence de correspondance, la catégorie `Unknown` est appliquée par défaut.

### 4.3 Évolutions (hors MVP)

Ces fonctionnalités sont prévues pour les versions futures du projet. Elles correspondent aux User Stories marquées d'un `*` dans la section 11.

- Filtrage avancé de la recherche (par genre, note, date de publication…)
- Préférences de genres littéraires dans le profil utilisateur.
- Partage de bibliothèque : option publique ou privée, partage de livres individuels.
- Forum de discussion autour des livres.
- Chat en direct entre utilisateurs.
- Groupes de lecture thématiques.
- Recommandations personnalisées basées sur les notes et les genres préférés.
- Moteur de recherche dynamique avec suggestions en temps réel.
- Statistiques de bibliothèque (nombre de livres lus, genres préférés, etc.).
- Support multilingue (français, anglais).
- Application mobile avec fonctionnalité de scan de livre.
- Tableau de bord administrateur pour la gestion des utilisateurs et la modération des contenus.

---

## 5. Choix techniques

### Front-end

| Technologie            | Rôle                  | Justification                                                                     |
| ---------------------- | --------------------- | --------------------------------------------------------------------------------- |
| **React + TypeScript** | Framework UI          | Large écosystème, maintenabilité facilitée, typage statique robuste               |
| **Vite**               | Outil de build        | Démarrage instantané, hot reload performant en développement                      |
| **Zustand**            | Gestion d'état global | Solution légère et simple à mettre en place, alternative minimaliste à Redux      |
| **TanStack Query**     | Data fetching         | Gestion du cache serveur, des états de chargement et des erreurs                  |
| **TanStack Router**    | Routing               | Routing entièrement typé, protection des routes (guards), préchargement au survol |
| **Zod**                | Validation de schémas | Validation fiable et typée des formulaires et des données entrantes               |
| **Axios**              | Client HTTP           | Interceptors, configuration centralisée, gestion simplifiée des requêtes          |
| **Tailwind CSS**       | Styling               | Classes utilitaires, productivité élevée, approche mobile-first native            |
| **Shadcn/ui**          | Composants UI         | Composants accessibles, personnalisables et compatibles avec Tailwind             |

### Back-end

| Technologie             | Rôle               | Justification                                                                            |
| ----------------------- | ------------------ | ---------------------------------------------------------------------------------------- |
| **NestJS + TypeScript** | Framework API REST | Architecture modulaire et structurée, cohérente avec l'écosystème TypeScript             |
| **Swagger (OpenAPI)**   | Documentation API  | Documentation générée automatiquement, facilite les tests et la collaboration front/back |
| **Helmet**              | Sécurité HTTP      | Sécurisation des en-têtes HTTP contre les attaques courantes                             |
| **@nestjs/throttler**   | Rate limiting      | Limitation du nombre de requêtes par IP pour prévenir les abus                           |

### Base de données

| Technologie     | Rôle                          | Justification                                                                   |
| --------------- | ----------------------------- | ------------------------------------------------------------------------------- |
| **PostgreSQL**  | Base de données relationnelle | Robuste et éprouvée, adaptée aux modèles de données relationnels complexes      |
| **Drizzle ORM** | ORM et gestion des migrations | Léger, entièrement typé, syntaxe proche du SQL, migrations versionnées dans Git |

### Tests & Audit

| Technologie    | Rôle                    | Justification                                                                   |
| -------------- | ----------------------- | ------------------------------------------------------------------------------- |
| **Vitest**     | Tests front-end         | Exécution rapide, intégration native avec Vite                                  |
| **Jest**       | Tests back-end          | Framework mature et stable, parfaitement compatible avec NestJS                 |
| **Lighthouse** | Audit qualité front-end | Évaluation des performances, de l'accessibilité, du SEO et des bonnes pratiques |

### API Externe

| Technologie         | Rôle                     | Justification                                                             |
| ------------------- | ------------------------ | ------------------------------------------------------------------------- |
| **OpenLibrary API** | Source de données livres | Gratuite, riche en métadonnées (titre, auteur, résumé, couverture, ISBN…) |

### Infrastructure & CI/CD

| Technologie                 | Rôle                  | Justification                                                                    |
| --------------------------- | --------------------- | -------------------------------------------------------------------------------- |
| **Docker & Docker Compose** | Conteneurisation      | Environnement standardisé entre dev et prod, setup reproductible                 |
| **GitHub Actions**          | CI/CD                 | Automatisation des tests et du déploiement à chaque modification du code         |
| **Vercel**                  | Hébergement front-end | Déploiement rapide, CDN global, proxy inverse pour la gestion des cookies Safari |
| **Render**                  | Hébergement back-end  | Hébergement NestJS avec gestion sécurisée des variables d'environnement          |

---

## 6. Architecture globale

Le projet repose sur une architecture **trois couches** découplées :

```
┌─────────────────────────────────────────────┐
│         Front-end (SPA React / Vite)         │
│  Interface utilisateur, routing, état,        │
│  appels API via Axios + TanStack Query        │
└─────────────────────┬───────────────────────┘
                      │ HTTP / REST
┌─────────────────────▼───────────────────────┐
│         Back-end (API REST NestJS)           │
│  Authentification, logique métier,           │
│  exposition des endpoints, sécurité          │
└──────────┬──────────────────┬───────────────┘
           │                  │
┌──────────▼──────┐  ┌────────▼───────────────┐
│   PostgreSQL     │  │   OpenLibrary API       │
│  (Drizzle ORM)  │  │   (données livres)      │
└─────────────────┘  └────────────────────────┘
```

Ce découpage permet de travailler en parallèle sur le front-end et le back-end, garantit une expérience utilisateur fluide grâce à la navigation SPA (sans rechargement de page) et simplifie la maintenance grâce à une séparation claire des responsabilités.

---

## 7. Cible utilisateur

L'application s'adresse à un public large de lecteurs :

- **Tranche d'âge** : 12 à 65 ans.
- **Profil** : toute personne souhaitant suivre ses lectures sans outil complexe ni surcharge fonctionnelle.
- **Usage** : gestion de collection personnelle, découverte de nouveaux livres, partage d'avis avec d'autres lecteurs.

L'interface est pensée pour être accessible aux utilisateurs peu technophiles, tout en offrant suffisamment de profondeur pour les lecteurs les plus assidus.

---

## 8. Navigateurs compatibles

| Navigateur                | Version minimale supportée |
| ------------------------- | -------------------------- |
| Chrome                    | 142+                       |
| Firefox                   | 145+                       |
| Microsoft Edge            | 142+                       |
| Safari (desktop + mobile) | 17+                        |

> **Particularité Safari / iOS** : Safari bloque par défaut les cookies cross-site (mécanisme ITP d'Apple). Pour résoudre ce problème, Vercel est configuré en tant que proxy inverse : le front-end envoie ses requêtes vers `/api/*` sur le domaine Vercel, qui les relaie ensuite vers Render. Les cookies sont ainsi considérés comme first-party par le navigateur et ne sont pas bloqués.

---

## 9. Arborescence (Routes Front)

| Route          | Page                                                                        | Accès       |
| -------------- | --------------------------------------------------------------------------- | ----------- |
| `/`            | Accueil — présentation du projet et livres mis en avant                     | Public      |
| `/login`       | Page de connexion                                                           | Public      |
| `/register`    | Page d'inscription                                                          | Public      |
| `/search`      | Résultats de recherche OpenLibrary                                          | Public      |
| `/books/:isbn` | Fiche détaillée d'un livre et ses avis                                      | Public      |
| `/library`     | Bibliothèque personnelle de l'utilisateur                                   | Authentifié |
| `/profile`     | Profil utilisateur — modification des informations et suppression du compte | Authentifié |
| `/privacy`     | Politique de confidentialité                                                | Public      |
| `/legal`       | Mentions légales                                                            | Public      |
| `/terms`       | Conditions d'utilisation                                                    | Public      |
| `*`            | Page 404 — route non trouvée                                                | Public      |

> Les routes `/library` et `/profile` sont protégées par un guard côté client. Tout utilisateur non authentifié tentant d'y accéder est automatiquement redirigé vers `/login`.

---

## 10. Routes API (Back)

### Health Check

| Méthode | Endpoint       | Description                                     |
| ------- | -------------- | ----------------------------------------------- |
| `GET`   | `/healthcheck` | Vérifie que le serveur est démarré et joignable |

### Auth

| Méthode | Endpoint         | Description                                                     | Auth requise |
| ------- | ---------------- | --------------------------------------------------------------- | ------------ |
| `POST`  | `/auth/register` | Inscription d'un nouvel utilisateur                             | Non          |
| `POST`  | `/auth/login`    | Connexion — génère et pose les cookies JWT et refresh token     | Non          |
| `POST`  | `/auth/logout`   | Déconnexion — invalide le refresh token et supprime les cookies | Oui          |
| `POST`  | `/auth/refresh`  | Renouvellement de l'access token avec rotation du refresh token | Non (cookie) |

### User

| Méthode  | Endpoint                | Description                                      | Auth requise |
| -------- | ----------------------- | ------------------------------------------------ | ------------ |
| `GET`    | `/user/:id`             | Récupération des informations du compte connecté | Oui          |
| `PATCH`  | `/user/:id`             | Mise à jour du nom d'utilisateur ou de l'email   | Oui          |
| `PATCH`  | `/user/change-password` | Modification du mot de passe                     | Oui          |
| `DELETE` | `/user`                 | Suppression du compte (soft delete)              | Oui          |

### Books

| Méthode  | Endpoint                                     | Description                                                          | Auth requise |
| -------- | -------------------------------------------- | -------------------------------------------------------------------- | ------------ |
| `GET`    | `/books`                                     | Récupération de tous les livres, avec filtre par catégorie optionnel | Non          |
| `GET`    | `/books/random`                              | Récupération d'un ensemble de livres aléatoires (`?limit=`)          | Non          |
| `GET`    | `/books/library/:userId`                     | Récupération de la bibliothèque de l'utilisateur, avec pagination    | Oui          |
| `POST`   | `/books/library/:userId`                     | Ajout d'un livre dans la bibliothèque                                | Oui          |
| `PATCH`  | `/books/library/:userId/book/:bookId/status` | Mise à jour du statut de lecture via les dates de début et de fin    | Oui          |
| `DELETE` | `/books/library/:userId/book/:bookId`        | Retrait d'un livre de la bibliothèque                                | Oui          |

### Reviews

| Méthode  | Endpoint              | Description                                       | Auth requise |
| -------- | --------------------- | ------------------------------------------------- | ------------ |
| `GET`    | `/reviews/book/:isbn` | Récupération de tous les avis associés à un livre | Non          |
| `POST`   | `/reviews`            | Création d'un avis (note et commentaire)          | Oui          |
| `DELETE` | `/reviews/:reviewId`  | Suppression de son propre avis (soft delete)      | Oui          |

### Categories

| Méthode | Endpoint    | Description                                     | Auth requise |
| ------- | ----------- | ----------------------------------------------- | ------------ |
| `GET`   | `/category` | Récupération de la liste des catégories actives | Non          |

> Toutes les routes authentifiées vérifient que l'utilisateur agit uniquement sur ses propres données (contrôle `userId === token.sub`). Un rate limiting est appliqué sur l'ensemble des routes pour prévenir les abus.

---

## 11. User Stories

| En tant que…  | Je veux…                                              | Afin de…                                                    |
| ------------- | ----------------------------------------------------- | ----------------------------------------------------------- |
| Visiteur      | Créer un compte                                       | Accéder à une bibliothèque personnelle                      |
| Visiteur      | Rechercher et consulter un livre                      | Découvrir les ouvrages disponibles avant de m'inscrire      |
| Utilisateur   | Me connecter                                          | Accéder à mes fonctionnalités personnalisées                |
| Utilisateur   | Modifier mes informations                             | Maintenir mon profil à jour                                 |
| Utilisateur   | Ajouter un livre à ma bibliothèque                    | Gérer ma collection personnelle                             |
| Utilisateur   | Changer le statut d'un livre (à lire / en cours / lu) | Suivre ma progression de lecture                            |
| Utilisateur   | Retirer un livre de ma bibliothèque                   | Conserver une liste organisée                               |
| Utilisateur   | Rechercher un livre                                   | Trouver rapidement un ouvrage                               |
| Utilisateur   | Consulter la fiche détaillée d'un livre               | Obtenir toutes les informations utiles avant de l'ajouter   |
| Utilisateur   | Noter un livre (1 à 5 étoiles)                        | Exprimer mon appréciation                                   |
| Utilisateur   | Rédiger un avis                                       | Partager mon opinion avec la communauté                     |
| Utilisateur   | Supprimer mon avis                                    | Modifier ou retirer un commentaire que j'ai laissé          |
| Utilisateur   | Supprimer mon compte                                  | Exercer mon droit à l'effacement des données (RGPD)         |
| \*Admin       | Disposer d'un tableau de bord                         | Gérer les utilisateurs (suspension, suppression de comptes) |
| \*Admin       | Modérer les avis                                      | Supprimer les contenus inappropriés                         |
| \*Utilisateur | Rendre ma bibliothèque publique ou privée             | Choisir ce que je partage avec les autres                   |
| \*Utilisateur | Consulter la bibliothèque d'un autre utilisateur      | Découvrir les lectures d'un autre membre                    |
| \*Utilisateur | Recevoir des recommandations personnalisées           | Découvrir des livres susceptibles de me correspondre        |
| \*Utilisateur | Scanner un livre                                      | L'ajouter rapidement à ma bibliothèque sans saisie manuelle |
| \*Utilisateur | Participer à un forum                                 | Échanger avec d'autres lecteurs autour d'un livre           |

> `*` User stories réservées aux évolutions futures du projet.

---

## 12. Analyse des risques

| Risque identifié                                | Impact potentiel                                                                | Mesures préventives                                                                                     |
| ----------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Indisponibilité de l'API OpenLibrary**        | Impossibilité de rechercher des livres, dégradation de l'expérience utilisateur | Gestion des erreurs HTTP, messages d'information adaptés, données minimales conservées en base          |
| **Qualité de code insuffisante**                | Bugs difficiles à corriger, régressions, accumulation de dette technique        | Revues de code systématiques, utilisation de linters (ESLint) et de formatters (Prettier)               |
| **Mauvaise gestion du planning**                | MVP incomplet, fonctionnalités non livrées dans les délais                      | Priorisation stricte du backlog, sprints courts, revue d'avancement hebdomadaire                        |
| **Faille de sécurité**                          | Risques d'injections, XSS, compromission des données utilisateurs               | Validation des DTOs (class-validator), Helmet, rate limiting, cookies HttpOnly, rotation des tokens JWT |
| **Problèmes de compatibilité ou de responsive** | Interface dégradée sur certains appareils ou navigateurs                        | Tests multi-navigateurs réguliers, approche mobile-first, composants accessibles (Shadcn/ui + Tailwind) |
| **Erreurs de schéma ou de migration**           | Perte ou corruption de données, bugs bloquants                                  | Schéma validé en amont, migrations versionnées dans Git (Drizzle), environnement de test isolé          |
| **Blocage des cookies sur Safari / iOS**        | Utilisateurs Apple mobiles incapables de se connecter                           | Proxy Vercel configuré pour que les cookies soient traités comme first-party (voir section 8)           |

---

## 13. Documents de conception

| Document                             | État    | Notes                                                                                      |
| ------------------------------------ | ------- | ------------------------------------------------------------------------------------------ |
| **Diagramme ERD**                    | ✅ Fait | `documentation/assets/base-de-donnees/` — ERD, MCD, MLD, MPD                               |
| **Diagrammes de séquence**           | ✅ Fait | `documentation/assets/sequences/` — authentification, catégorisation, gestion utilisateur  |
| **Use Cases**                        | ✅ Fait | `documentation/assets/cas-utilisation/` — use-case-1, use-case-2                           |
| **Diagramme d'architecture globale** | ✅ Fait | `documentation/assets/architecture/` — architecture globale, front, back NestJS, flux HTTP |
| **Diagramme CI/CD & déploiement**    | ✅ Fait | `documentation/assets/ci-cd/` — pipelines dev et prod, schéma de déploiement               |

---

## 14. Éléments graphiques

| Document       | État    | Notes                                                                                     |
| -------------- | ------- | ----------------------------------------------------------------------------------------- |
| **Wireframes** | ✅ Fait | `documentation/assets/maquettes/wireframes/` — zoning desktop/mobile, wireframes complets |
| **Maquettes**  | ✅ Fait | `documentation/assets/maquettes/desktop/` et `mobile/` — versions haute fidélité          |

---

## 15. Contraintes techniques et réglementaires

| Contrainte                  | Détail                                                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Responsive mobile-first** | L'interface est conçue en priorité pour mobile, puis adaptée aux écrans plus larges                                       |
| **Accessibilité WCAG**      | Respect des Web Content Accessibility Guidelines pour garantir l'accès au plus grand nombre                               |
| **RGPD**                    | Mentions légales, politique de confidentialité, bandeau de consentement aux cookies, droit à l'effacement (soft delete)   |
| **SEO basique**             | Balises meta, structure HTML sémantique, optimisation des performances de chargement                                      |
| **Sécurité applicative**    | Protection contre le XSS, validation des entrées utilisateur, absence d'injection SQL (ORM typé), rotation des tokens JWT |
| **Tests**                   | Tests unitaires front-end (Vitest) et back-end (Jest), tests d'intégration Docker intégrés au pipeline CI                 |
| **Performances**            | Code splitting via Vite, chargement différé des ressources, respect des principes d'éco-conception                        |

---

## 16. Équipe & Rôles

| Rôle                | Nom     | Responsabilités                                                                                                                                                          |
| ------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Git Master**      | MJ      | Définit la stratégie de branches, valide les Merge Requests, gère les conflits complexes et assure la stabilité de la branche `main`                                     |
| **Product Owner**   | Marion  | Traduit les besoins métier en User Stories, priorise le backlog sur Trello et valide que les fonctionnalités livrées correspondent aux attentes                          |
| **Scrum Master**    | Mohini  | Anime les rituels Scrum (daily, sprint planning, retrospective), suit l'avancement global et lève les blocages de l'équipe                                               |
| **Tech Lead Front** | Jimmy   | Définit et structure le socle front-end (Vite, Tailwind, TanStack), fixe les bonnes pratiques de développement et accompagne l'équipe sur les problématiques d'interface |
| **Tech Lead Back**  | Clément | Définit et structure le socle back-end (NestJS, Drizzle), valide le modèle de données et accompagne l'équipe sur la logique serveur et les intégrations API              |

---

## 17. Planning & Organisation des sprints

Le projet s'est déroulé sur **4 sprints de 4 semaines chacun**, soit une durée totale de 16 semaines.

### Méthodologie appliquée

La méthode Agile Scrum a été adoptée avec les rituels suivants :

| Cérémonie           | Fréquence              | Durée       | Objectif                                                                                        |
| ------------------- | ---------------------- | ----------- | ----------------------------------------------------------------------------------------------- |
| **Sprint Planning** | Début de chaque sprint | 1h à 1h30   | Sélection et répartition des tâches du backlog pour le sprint à venir                           |
| **Daily Stand-up**  | Chaque jour            | 15 à 20 min | Point rapide sur l'avancement, les blocages et les priorités du jour                            |
| **Sprint Review**   | Fin de chaque sprint   | 1h à 1h30   | Présentation des fonctionnalités livrées et validation par rapport aux objectifs fixés          |
| **Rétrospective**   | Fin de chaque sprint   | 30 min      | Présentation de l'avancement à l'ensemble des équipes et identification des axes d'amélioration |

Le suivi des tâches a été assuré via un tableau **Kanban sur Trello**, organisé en colonnes (Backlog / En cours / En review / Terminé).

### Déroulement des sprints

| Sprint       | Contenu principal                                                                                                                              |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sprint 1** | Cadrage du projet, conception (maquettes, diagrammes ERD, user stories), choix techniques et mise en place de l'environnement de développement |
| **Sprint 2** | Implémentation du code : authentification, bibliothèque personnelle, recherche via OpenLibrary, intégration de la base de données              |
| **Sprint 3** | Peaufinage du code, ajout des tests unitaires et d'intégration, corrections de bugs, conformité RGPD                                           |
| **Sprint 4** | Déploiement en production (Vercel + Render), optimisations, finalisation de la documentation                                                   |

---

## 18. Règles de gestion

Les règles ci-dessous définissent les comportements métier qui gouvernent l'application.

### Bibliothèque

- Un livre ne peut apparaître **qu'une seule fois** dans la bibliothèque d'un utilisateur. Toute tentative d'ajout en double est bloquée par une contrainte d'unicité en base de données.
- Retirer un livre de la bibliothèque **supprime uniquement le lien** entre le livre et l'utilisateur. Le livre reste présent en base et peut être réajouté ultérieurement.

### Statut de lecture

Le statut d'un livre est **calculé automatiquement** à partir des dates de lecture, sans champ dédié :

| État         | Condition                                                                          |
| ------------ | ---------------------------------------------------------------------------------- |
| **À lire**   | Aucune date renseignée (`readStart` et `readEnd` sont null)                        |
| **En cours** | Date de début renseignée, date de fin absente (`readStart` défini, `readEnd` null) |
| **Lu**       | Les deux dates sont renseignées (`readStart` et `readEnd` définis)                 |

### Livre

- Un livre est identifié de manière unique par son **ISBN**. Si deux utilisateurs ajoutent le même livre, une seule entrée existe en base ; seule la relation `LIST_BOOK` est créée pour chaque utilisateur.
- Les **catégories disponibles** sont : Horreur, Romance, Aventure, Fantasy, Science-fiction, Unknown.

### Dates de lecture

- La **date de fin de lecture ne peut pas être antérieure à la date de début**. Cette contrainte est vérifiée côté serveur avant toute mise à jour du statut.

### Avis et notes

- Un utilisateur ne peut déposer **qu'un seul avis par livre**. Toute tentative de doublon est bloquée avec une `ConflictException` (HTTP 409).
- Un avis est composé d'une **note obligatoire** (de 1 à 5 étoiles) et d'un **commentaire optionnel**.
- Un utilisateur peut **supprimer son propre avis**. La suppression est un soft delete : l'avis est marqué comme supprimé (`deletedAt`) mais reste en base.
- Les avis d'un compte supprimé sont **conservés mais dissociés** : le champ `userId` est mis à `NULL`. Ils restent visibles mais ne sont plus attribuables à une personne identifiable.

### Comptes utilisateurs

- Les champs **email et pseudo sont uniques** en base de données. Une tentative de création ou de mise à jour avec un doublon est rejetée.
- Un utilisateur **ne peut accéder et modifier que ses propres données**. Chaque requête authentifiée vérifie que l'identifiant du token JWT correspond à la ressource demandée.
- La **suppression de compte** déclenche une anonymisation immédiate des données personnelles (email, pseudo, mot de passe, avatar) et marque le compte comme supprimé (`deletedAt`). L'enregistrement est conservé en base pour maintenir l'intégrité référentielle.
- Un compte supprimé **ne peut plus se connecter**. Toutes les requêtes filtrent les comptes dont le champ `deletedAt` est renseigné.

### Authentification

- L'accès aux fonctionnalités protégées nécessite un **access token JWT valide** (durée de vie : 15 minutes), transmis via un cookie HttpOnly.
- Lorsque l'access token expire, il est **automatiquement renouvelé** via un refresh token (durée de vie : 30 jours, mécanisme de rotation unique). À chaque renouvellement, un nouveau refresh token est généré et l'ancien est invalidé.
- La **modification du mot de passe** entraîne la révocation immédiate de tous les refresh tokens actifs de l'utilisateur.

---

## 19. Périmètre du projet — ce qui est hors scope

Pour cadrer les attentes et éviter toute confusion, voici ce qui a été **explicitement exclu** du projet dans sa version actuelle.

### Fonctionnalités non développées

- Aucun espace d'administration pour la gestion des utilisateurs ou la modération des contenus.
- Aucune fonctionnalité sociale (profils publics, partage de bibliothèque, suivi d'autres utilisateurs).
- Aucun système de forum, de chat ou de communication entre utilisateurs.
- Aucun algorithme de recommandation de livres.
- Aucune statistique de lecture (nombre de livres lus, genres préférés, etc.).
- Aucun support multilingue : l'application est disponible uniquement en français.
- Aucune application mobile native ni fonctionnalité de scan de livre.
- La recherche ne propose pas de filtres avancés (genre, note, date de publication…).

### Limites techniques assumées

- Les données de livres proviennent exclusivement d'**OpenLibrary**. Si un livre n'est pas référencé dans cette API, il ne peut pas être ajouté à la bibliothèque.
- L'application ne gère pas les **images uploadées par les utilisateurs** : les couvertures de livres proviennent d'OpenLibrary.
- Il n'existe pas de **cache serveur** pour les appels à OpenLibrary. Les résultats de recherche sont mis en cache côté client via TanStack Query pour la durée de la session, mais en cas d'indisponibilité de l'API, la recherche de nouveaux livres n'est pas fonctionnelle. Les livres déjà présents en base de données restent quant à eux accessibles normalement.

---

## 20. Glossaire

| Terme               | Définition                                                                                                                                                 |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **API REST**        | Interface de programmation permettant à deux applications de communiquer via des requêtes HTTP standardisées (GET, POST, PATCH, DELETE)                    |
| **CI/CD**           | Intégration Continue / Déploiement Continu. Pipeline automatisé qui exécute les tests à chaque modification du code et déploie l'application si tout passe |
| **Cookie HttpOnly** | Cookie inaccessible depuis le JavaScript côté navigateur, ce qui le protège contre les attaques XSS                                                        |
| **ISBN**            | International Standard Book Number. Identifiant unique attribué à chaque édition d'un livre                                                                |
| **JWT**             | JSON Web Token. Jeton signé utilisé pour authentifier les requêtes de l'utilisateur sans stocker de session côté serveur                                   |
| **Kanban**          | Méthode visuelle de gestion de projet basée sur un tableau avec des colonnes représentant les états d'avancement des tâches                                |
| **Mobile-first**    | Approche de développement qui consiste à concevoir l'interface pour mobile en priorité, puis à l'adapter aux écrans plus larges                            |
| **MVP**             | Minimum Viable Product. Version minimale d'un produit incluant uniquement les fonctionnalités essentielles pour être utilisable                            |
| **ORM**             | Object-Relational Mapping. Couche d'abstraction qui permet d'interagir avec la base de données en manipulant des objets plutôt qu'en écrivant du SQL brut  |
| **Rate limiting**   | Mécanisme qui limite le nombre de requêtes qu'un client peut envoyer sur une période donnée, pour prévenir les abus                                        |
| **Refresh token**   | Token de longue durée utilisé pour renouveler un access token JWT expiré, sans demander à l'utilisateur de se reconnecter                                  |
| **RGPD**            | Règlement Général sur la Protection des Données. Réglementation européenne encadrant la collecte et le traitement des données personnelles                 |
| **Soft delete**     | Suppression logique d'un enregistrement : la donnée est marquée comme supprimée (via un champ `deletedAt`) mais reste physiquement en base                 |
| **SPA**             | Single Page Application. Application web dont le contenu se met à jour dynamiquement sans rechargement complet de la page                                  |
| **WCAG**            | Web Content Accessibility Guidelines. Normes internationales définissant les critères d'accessibilité pour les contenus web                                |
| **XSS**             | Cross-Site Scripting. Attaque consistant à injecter du code malveillant dans une page web pour le faire exécuter par le navigateur d'un autre utilisateur  |
