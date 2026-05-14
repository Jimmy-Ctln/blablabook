# BlaBlaBook

[![CI Dev](https://github.com/Jimmy-Ctln/blablabook/actions/workflows/CICD-dev.yml/badge.svg)](https://github.com/Jimmy-Ctln/blablabook/actions/workflows/CICD-dev.yml)
[![CI Prod](https://github.com/Jimmy-Ctln/blablabook/actions/workflows/CICD-prod.yml/badge.svg)](https://github.com/Jimmy-Ctln/blablabook/actions/workflows/CICD-prod.yml)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

A mobile-first personal book management web application. Search for books, build your library, track your reading progress, and share reviews with other readers.

**[Live Demo](https://blablabook-sigma.vercel.app)**

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Commands Reference](#commands-reference)
- [Testing](#testing)
- [Deployment & CI/CD](#deployment--cicd)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [About](#about)

---

## Features

### Core (MVP)

- **Book search** — Search the OpenLibrary catalog by title, author, or ISBN
- **Personal library** — Add books to your collection and organize them
- **Reading status** — Automatically computed from reading dates: *To Read*, *Reading*, or *Read*
- **Book details** — View cover, description, author, publisher, and publication date
- **Reviews & ratings** — Leave a rating (1–5 stars) and a written review on any book
- **User account** — Register, log in, update your profile, change password, and delete your account
- **Secure authentication** — JWT access tokens + refresh tokens with rotation, stored in HttpOnly cookies

### Additional

- **Light / Dark theme** — Toggle between light and dark mode
- **Category preferences** — Select your favorite genres during onboarding
- **GDPR-compliant account deletion** — Account data is fully anonymized on deletion (email, username, password, avatar replaced with anonymous values). Reviews are preserved without any link to the original user.

---

## Tech Stack

### Frontend

| Technology          | Purpose                              |
| ------------------- | ------------------------------------ |
| React + TypeScript  | UI framework with full type safety   |
| Vite                | Fast build tool and dev server       |
| TanStack Router     | File-based routing with auth guards  |
| TanStack Query      | Server state, caching, and sync      |
| Zustand             | Client-side auth state management    |
| Zod                 | Form and API response validation     |
| Tailwind CSS        | Utility-first styling                |
| Shadcn/ui           | Accessible, composable UI components |

### Backend

| Technology        | Purpose                                      |
| ----------------- | -------------------------------------------- |
| NestJS            | Structured backend framework (Node.js)       |
| PostgreSQL        | Relational database                          |
| Drizzle ORM       | Type-safe SQL queries and schema management  |
| argon2            | Secure password hashing                      |
| Helmet            | HTTP security headers                        |
| @nestjs/throttler | Rate limiting to prevent abuse               |
| Swagger           | Interactive API documentation at `/api`      |

### Infrastructure

| Technology      | Purpose                                    |
| --------------- | ------------------------------------------ |
| Docker + Compose | Containerized dev and prod environments   |
| GitHub Actions  | CI/CD pipelines for testing and deployment |
| Vercel          | Frontend hosting + reverse proxy for Safari|
| Render          | Backend hosting                            |
| Supabase        | Managed PostgreSQL in production           |

---

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed and running
- Git

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd projet-blablabook
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in the values:

```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=blablabook

# Backend
DATABASE_URL=postgresql://postgres:your_secure_password@postgres:5432/blablabook?schema=public
JWT_SECRET=a_very_long_random_secret_at_least_32_chars
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# Frontend
VITE_BACKEND_URL=http://localhost:3000
```

### 3. Start the development environment

```bash
docker compose -f docker-compose.dev.yml up -d
```

This starts:
- **Frontend** at `http://localhost:5173` (hot reload via Vite)
- **Backend** at `http://localhost:3000` (watch mode)
- **Swagger docs** at `http://localhost:3000/api`
- **Adminer** (database UI) at `http://localhost:8080`

### 4. Seed the database

The seed runs automatically when the dev environment starts — no manual step needed.

If you ever need to re-run it (e.g. after wiping the database):

```bash
docker exec -it backend npm run seed
```

### Service URLs

| Service           | URL                       |
| ----------------- | ------------------------- |
| Frontend          | http://localhost:5173     |
| Backend API       | http://localhost:3000     |
| API Documentation | http://localhost:3000/api |
| Database Admin    | http://localhost:8080     |

---

## Project Structure

```
.
├── .github/
│   ├── workflows/
│   │   ├── CICD-dev.yml       # Dev pipeline (tests + lint + audit + docker integration)
│   │   └── CICD-prod.yml      # Prod pipeline (tests + lint + audit + migrations + deploy)
│   └── dependabot.yml         # Weekly automated dependency security scanning
│
├── backend/
│   ├── src/
│   │   ├── auth/              # JWT auth, refresh token rotation
│   │   ├── books/             # Library management
│   │   ├── category/          # Book categories
│   │   ├── review/            # Book reviews and ratings
│   │   ├── user/              # User profile and account management
│   │   ├── security/          # Cookie and token utilities
│   │   ├── db/                # Drizzle schema and DB connection
│   │   ├── main.ts            # App entry point
│   │   └── seed.ts            # Database seeding
│   ├── drizzle/               # Migration files (version controlled in Git)
│   ├── Dockerfile             # Production image
│   ├── Dockerfile.dev         # Development image
│   └── start.sh               # Production startup (migrate → seed → start)
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── pages/             # Page-level components
│   │   ├── api/               # API call functions (backend + OpenLibrary)
│   │   ├── stores/            # Zustand auth store
│   │   ├── hooks/             # Custom React hooks
│   │   └── routes/            # TanStack Router config and auth guards
│   ├── Dockerfile             # Production image
│   └── Dockerfile.dev         # Development image
│
├── documentation/             # Project docs and specifications
├── docker-compose.yml         # Production configuration
├── docker-compose.dev.yml     # Development configuration
├── vercel.json                # Reverse proxy config (fixes Safari cookie issue) + disables Vercel auto-deploys (CI controls deployments via deploy hooks)
└── .env.example               # Environment variable template
```

---

## Commands Reference

### Docker

| Command                                          | Purpose                            |
| ------------------------------------------------ | ---------------------------------- |
| `docker compose -f docker-compose.dev.yml up -d` | Start development environment      |
| `docker compose up -d`                           | Start production environment       |
| `docker compose down`                            | Stop all containers                |
| `docker compose down -v`                         | Stop containers and remove volumes |
| `docker compose logs -f`                         | Stream all logs                    |
| `docker compose logs -f backend`                 | Stream backend logs only           |
| `docker compose ps`                              | List running containers            |

### Shell access

| Command                       | Purpose                         |
| ----------------------------- | ------------------------------- |
| `docker exec -it backend sh`  | Access backend container        |
| `docker exec -it frontend sh` | Access frontend container       |
| `docker exec -it postgres sh` | Access database container       |

### Backend

| Command              | Purpose                          |
| -------------------- | -------------------------------- |
| `npm run start:dev`  | Start in watch mode              |
| `npm run build`      | Build for production             |
| `npm run start`      | Start production server          |
| `npm run seed`       | Seed the database                |
| `npm run test`       | Run tests (Jest)                 |

### Frontend

| Command             | Purpose                          |
| ------------------- | -------------------------------- |
| `npm run dev`       | Start dev server (Vite)          |
| `npm run build`     | Build for production             |
| `npm run test`      | Run tests (Vitest)               |
| `npm run coverage`  | Generate test coverage report    |

### Database migrations (Drizzle)

```bash
# 1. Edit backend/src/db/schema.ts
# 2. Generate the migration file
npx drizzle-kit generate

# 3. Commit and push — migrations are applied automatically in CI/CD
git add drizzle/
git commit -m "feat: add X to schema"
git push
```

---

## Testing

### Backend (Jest)

Tests cover the three main service layers: auth, users, and books.

```bash
cd backend
npm run test
```

- `auth.service.spec.ts` — Registration, login, token refresh, logout
- `user.service.spec.ts` — Profile updates, password change, soft delete
- `books.service.spec.ts` — Library operations, reading status, book search

### Frontend (Vitest)

Tests cover the key pages and user flows.

```bash
cd frontend
npm run test
```

- `LoginPage.spec.tsx` / `RegisterPage.spec.tsx` — Form validation and submission
- `HomePage.test.tsx` — Rendering and basic interactions
- `LibraryPage.test.tsx` — Library display
- `BookDetails.test.tsx` — Book detail page rendering

---

## Deployment & CI/CD

### Philosophy

No code reaches production without passing every quality gate. The pipelines enforce a strict sequence — if any step fails, the process stops immediately and nothing is deployed.

### Dev pipeline — `CICD-dev.yml`

Runs on every push and pull request to `dev`. No deployment — purely a validation pipeline.

```
npm audit (high+)       → blocks if a dependency has a known vulnerability
Tests                   → blocks if any test fails
Lint                    → blocks if code style rules are violated
Build                   → blocks if TypeScript compilation fails
Database migration check → validates migration files can be generated without errors
Docker integration tests → spins up all containers and verifies that:
                           - PostgreSQL is reachable
                           - Backend starts and responds on /health
                           - Frontend starts and responds
                           - Frontend container can reach Backend container
                           - Backend container can query the database
```

### Prod pipeline — `CICD-prod.yml`

Runs on every push and pull request to `main`. Deployments only trigger on direct push (not on PRs).

```
npm audit (high+)        → blocks if a dependency has a known vulnerability
Tests                    → blocks if any test fails
Lint                     → blocks if code style rules are violated
Build + Docker image     → validates TypeScript and Docker build
         ↓
Database migrations      → applied to production DB only after all tests pass
         ↓
Deploy backend (Render)  → triggered via deploy hook, then polled until /health responds
         ↓
Deploy frontend (Vercel) → triggered via deploy hook only after backend is confirmed healthy,
                           then polled until the production URL responds
```

The deployment order matters: migrations run before the backend is updated, and the frontend is deployed only after the backend is confirmed running. This prevents users from hitting a new frontend against an old or broken backend.

### Automated dependency scanning — Dependabot

`dependabot.yml` runs every week and automatically opens pull requests when:
- A frontend or backend npm package has a known security vulnerability
- A GitHub Actions action has an available security update

This complements the `npm audit` step in CI: `npm audit` catches vulnerabilities on every push, Dependabot catches them even when you haven't pushed code in weeks.

### Vercel auto-deploy disabled

By default, Vercel auto-deploys a preview on every Git push, including to `dev`, before any CI validation runs. This was causing broken previews and errors to appear before tests even passed.

`vercel.json` sets `"ignoreCommand": "exit 0"`, which tells Vercel to skip all automatic builds triggered by Git pushes. Deployments are controlled exclusively by the CI pipeline via deploy hooks — Vercel only builds when the prod pipeline explicitly triggers it after all tests pass.

### GitHub Secrets required

Set these in your repository under Settings → Secrets → Actions:

| Secret               | Description                                        |
| -------------------- | -------------------------------------------------- |
| `DATABASE_URL`       | PostgreSQL connection string (Docker CI)           |
| `JWT_SECRET`         | JWT signing key (for CI tests)                     |
| `DB_NAME`            | Database name (Docker CI)                          |
| `DB_USER`            | Database user (Docker CI)                          |
| `DB_PASSWORD`        | Database password (Docker CI)                      |
| `DB_HOST`            | Database host (Docker CI)                          |
| `VITE_BACKEND_URL`   | Backend URL (Docker CI — localhost value)          |
| `FRONTEND_URL`       | Frontend URL (Docker CI — localhost value)         |
| `BACKEND_DOCKER_URL` | Internal Docker network URL for container tests    |
| `PROD_DATABASE_URL`  | Production PostgreSQL connection string            |
| `PROD_BACKEND_URL`   | Production Render URL (for health check polling)   |
| `PROD_FRONTEND_URL`  | Production Vercel URL (for health check polling)   |
| `RENDER_DEPLOY_HOOK` | Render webhook to trigger backend deployment       |
| `VERCEL_DEPLOY_HOOK` | Vercel webhook to trigger frontend deployment      |

---

## Security

Security is treated as a first-class concern, not an afterthought. Below is an overview of the protections in place.

### Authentication & token security

- **JWT access tokens** (15 min expiry) are stored in `HttpOnly` cookies — JavaScript cannot read them, which prevents token theft via XSS attacks
- **Refresh tokens** (30 days) are hashed in the database using HMAC-SHA256 — even if the database is compromised, raw tokens are never exposed
- **Token rotation** — every refresh call invalidates the old token and issues a new one
- **Single-session policy** — logging in destroys all existing refresh tokens for that user, preventing concurrent sessions from multiple devices

### XSS prevention

`HttpOnly` cookies ensure that even if malicious JavaScript is injected into the page, it cannot access or steal authentication tokens.

### CSRF prevention

Two complementary layers:
- **`SameSite`** cookie attribute prevents cookies from being sent on cross-origin requests initiated by third-party sites
- **Strict CORS** — only the exact `FRONTEND_URL` is whitelisted. Requests from any other origin are rejected before reaching any endpoint

### SQL injection prevention

The application uses **Drizzle ORM**, which builds all database queries through a type-safe query builder. Raw SQL strings constructed from user input are never used, eliminating SQL injection by design.

### Password security

Passwords are hashed using **Argon2**, the winner of the Password Hashing Competition and the current industry standard. It is resistant to brute-force and GPU-based cracking attacks.

### Input validation & mass assignment prevention

Every API endpoint validates incoming data through **DTOs with class-validator**. The `ValidationPipe` is configured with:
- `whitelist: true` — unknown fields are silently stripped before reaching the controller
- `forbidNonWhitelisted: true` — if an unknown field is sent, the request is rejected with a 400 error

This prevents mass assignment attacks where an attacker tries to inject unexpected fields (e.g. `isAdmin: true`).

### BOLA / IDOR prevention

Every endpoint that accesses user-specific data explicitly verifies that the authenticated user's ID matches the requested resource's owner ID. Users cannot access or modify another user's library, reviews, or profile.

### Rate limiting

`@nestjs/throttler` limits the number of requests per IP address globally (60 requests / 60 seconds by default), with stricter limits on sensitive endpoints. This mitigates brute-force and enumeration attacks.

### HTTP security headers

**Helmet** sets a suite of security-related HTTP headers on every response, including `X-Frame-Options` (clickjacking prevention), `Content-Security-Policy`, and `X-Content-Type-Options`.

### Dependency vulnerability scanning

- `npm audit --audit-level=high` runs in every CI pipeline and blocks deployment if a high or critical vulnerability is found in any dependency
- **Dependabot** scans dependencies weekly and opens pull requests automatically when vulnerabilities are discovered — even between code pushes

---

## Troubleshooting

**Port already in use**

```bash
lsof -i :3000     # find what's using the port
kill -9 <PID>     # free it
```

**Database not connecting**

```bash
docker compose ps                    # check all containers are running
docker compose logs postgres         # read postgres logs
```
Make sure `DATABASE_URL` in `.env` matches your DB credentials.

**Tests failing in CI/CD**

- Check the GitHub Actions logs for the exact error
- Verify all secrets are configured in GitHub Settings
- Make sure your migration files are committed to Git

**Login not working on iOS Safari**

Safari blocks cross-site cookies by default (Apple's ITP — Intelligent Tracking Prevention). When the frontend (Vercel) and backend (Render) are on different domains, auth cookies get silently blocked on mobile.

The fix: `vercel.json` configures Vercel as a **reverse proxy**. Instead of the browser calling Render directly, it calls `/api/*` on the Vercel domain, and Vercel relays it to Render server-to-server. The browser only ever sees the Vercel domain, so cookies are treated as first-party and Safari allows them.

This is why `VITE_BACKEND_URL` must be set to `/api` (not the Render URL) in the Vercel dashboard and in GitHub Secrets.

---

## About

BlaBlaBook is a student project built for a **Titre Professionnel Concepteur Développeur d'Applications** certification. It demonstrates full-stack development skills across frontend architecture, backend design, database modeling, security, and automated deployment.

Built with: React · NestJS · PostgreSQL · Docker · GitHub Actions

---

## License

© 2025 Jimmy Catalano — All rights reserved.
