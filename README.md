# BlablaBook

An open-source personal book management platform for tracking your reading journey. Organize your library, mark books as read, currently reading, or to-read.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Stack](#technologies-stack)
- [Getting Started](#getting-started)
- [Deployment & CI/CD](#deployment--cicd)
- [Project Structure](#project-structure)
- [Commands Reference](#commands-reference)
- [Testing](#testing)

---

## Project Overview

BlablaBook provides a simple and intuitive solution for managing your personal library. Whether you're tracking your reading progress or discovering new books through the OpenLibrary API, this platform makes it easy to:

- Add books to your library from OpenLibrary
- Track reading status: Read, Currently Reading, or To Read
- Search and manage your collection
- Access a clean, modern interface built with React

---

## Technologies Stack

| Technology               | Purpose                                        |
| ------------------------ | ---------------------------------------------- |
| Docker & Docker Compose  | Containerization and orchestration             |
| React + TypeScript       | Frontend framework with type safety            |
| Vite                     | Build tool for blazing-fast development        |
| Zustand                  | State management                               |
| TanStack Query & Router  | Data fetching and type-safe routing            |
| Zod                      | Schema validation                              |
| Tailwind CSS & Shadcn/ui | Styling and UI components                      |
| NestJS                   | Backend framework with structured architecture |
| PostgreSQL               | Production-grade relational database           |
| Drizzle ORM              | Type-safe database queries                     |
| Swagger                  | Interactive API documentation                  |
| Jest & Vitest            | Testing frameworks                             |
| GitHub Actions           | Continuous Integration and Deployment          |

---

## Getting Started

### Prerequisites

- Docker installed and running
- Git for cloning the repository

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd projet-blablabook
```

2. Create a `.env` file at the project root:

```bash
cp .env.example .env
```

3. Start the development environment:

```bash
docker compose -f docker-compose.dev.yml up -d
```

### Docker Environments

**Development** (`docker-compose.dev.yml`)

- Frontend with hot reload via Vite dev server
- Backend with watch mode for live file changes
- Adminer for database management
- Perfect for active development

**Production** (`docker-compose.yml`)

- Optimized React build served via Nginx
- Production-ready NestJS backend
- PostgreSQL with persistent volumes
- Ready to deploy on Render and Vercel

### Starting the Application

Development:

```bash
docker compose -f docker-compose.dev.yml up -d
```

Production:

```bash
docker compose up -d
```

### Database Setup

To seed initial data:

```bash
cd backend
npx ts-node src/seed.ts
```

### Access Services

| Service           | URL                       |
| ----------------- | ------------------------- |
| Frontend          | http://localhost:5173     |
| Backend API       | http://localhost:3000     |
| API Documentation | http://localhost:3000/api |
| Database Admin    | http://localhost:8080     |

---

## Deployment & CI/CD

This project uses GitHub Actions for automated testing and deployment. The CI/CD pipeline is designed to prevent broken code from reaching production.

### Pipeline Overview

**Development Branch (`dev`)**

- Triggers on: Push or Pull Request to `dev`
- Runs: Frontend tests, Backend tests, Docker integration tests
- Result: No deployment (safe testing environment)

**Main Branch (`main`)**

- Triggers on: Push or Pull Request to `main`
- Runs: Frontend tests, Backend tests, Docker integration tests, database migrations
- Result: If all tests pass → Automatic deployment to Vercel (frontend) and Render (backend)

### Setting Up GitHub Secrets

Create these secrets in your GitHub repository (Settings → Secrets and variables → Actions):

| Secret               | Example Value                                                 | Purpose                                                      |
| -------------------- | ------------------------------------------------------------- | ------------------------------------------------------------ |
| `DATABASE_URL`       | `postgresql://username:password@localhost:5432/database_name` | Test database URL                                            |
| `JWT_SECRET`         | `your-secret-key-for-jwt-signing`                             | JWT signing key                                              |
| `DB_NAME`            | `your_database_name`                                          | Database name                                                |
| `DB_USER`            | `your_database_user`                                          | Database user                                                |
| `DB_PASSWORD`        | `your_secure_database_password`                               | Database password                                            |
| `VITE_BACKEND_URL`   | `/api`                                                        | Production backend URL (proxied via Vercel — see note below) |
| `FRONTEND_URL`       | `https://your-frontend-url.vercel.app`                        | Frontend URL for CORS                                        |
| `RENDER_DEPLOY_HOOK` | `https://api.render.com/deploy/srv-xxxxx/...`                 | Render deployment webhook                                    |
| `VERCEL_DEPLOY_HOOK` | `https://api.vercel.com/v1/integrations/deploy/...`           | Vercel deployment webhook                                    |

### Environment Variables Explained

**During Tests (CI/CD)**

- Uses `DATABASE_URL` pointing to local test database
- Frontend uses `VITE_BACKEND_URL` for test backend
- `NODE_ENV` set to `production` for production pipeline

**Production (Render/Vercel)**

- Backend receives secrets directly from GitHub Actions
- Migrations are automatically applied at startup
- Database seeding runs before server starts

### Testing the Pipeline Locally

**Test the dev pipeline:**

1. Create a feature branch from `dev`
2. Make changes and push
3. Create a Pull Request to `dev`
4. Check GitHub Actions (Settings → Actions) to see tests run
5. No deployment occurs

**Test the prod pipeline:**

1. Create a feature branch from `main`
2. Make changes and push
3. Create a Pull Request to `main`
4. If all tests pass, deployment to production automatically triggers

### Database Migration Strategy

Developer workflow:

```bash
# 1. Modify schema.ts
# 2. Generate migration
npx drizzle-kit generate

# 3. Commit and push (migrations are versioned in git)
git add drizzle/
git commit -m "Add new schema migration"
git push
```

Pipeline automatically:

- Applies migrations from git
- Runs tests
- Deploys if tests pass
- Seed data is loaded on production startup

---

## Project Structure

```
.
├── .github/workflows/
│   ├── CICD-dev.yml           # Development pipeline
│   └── CICD-prod.yml          # Production pipeline with deployment
│
├── backend/
│   ├── src/
│   │   ├── auth/              # Authentication & JWT
│   │   ├── books/             # Books management module
│   │   ├── category/          # Categories module
│   │   ├── user/              # User management
│   │   ├── db/                # Database config & Drizzle schema
│   │   ├── security/          # Security utilities (cookies, tokens)
│   │   ├── main.ts            # Application entry point
│   │   └── seed.ts            # Database seeding
│   ├── drizzle/               # Migration files (version controlled)
│   ├── Dockerfile             # Production image
│   ├── Dockerfile.dev         # Development image
│   ├── start.sh               # Production startup script
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── pages/             # Page components
│   │   ├── api/               # API client functions
│   │   ├── stores/            # Zustand state management
│   │   ├── hooks/             # Custom React hooks
│   │   ├── routes/            # TanStack Router configuration
│   │   └── main.tsx           # Entry point
│   ├── Dockerfile             # Production image
│   ├── Dockerfile.dev         # Development image
│   └── package.json
│
├── docker-compose.yml         # Production configuration
├── docker-compose.dev.yml     # Development configuration
├── .env.example               # Environment template
└── README.md
```

---

## Commands Reference

### Docker Compose

| Command                                          | Purpose                            |
| ------------------------------------------------ | ---------------------------------- |
| `docker compose -f docker-compose.dev.yml up -d` | Start development environment      |
| `docker compose up -d`                           | Start production environment       |
| `docker compose down`                            | Stop all containers                |
| `docker compose down -v`                         | Stop containers and remove volumes |
| `docker compose logs -f`                         | Stream logs                        |
| `docker compose logs -f <service>`               | Stream logs for specific service   |
| `docker compose ps`                              | List running containers            |

### Container Shell Access

| Command                       | Purpose                         |
| ----------------------------- | ------------------------------- |
| `docker exec -it backend sh`  | Access backend container shell  |
| `docker exec -it frontend sh` | Access frontend container shell |
| `docker exec -it postgres sh` | Access database container shell |

### Backend Commands

| Command              | Purpose                   |
| -------------------- | ------------------------- |
| `npm run test`       | Run backend tests (Jest)  |
| `npm run migrate`    | Apply database migrations |
| `npm run build`      | Build for production      |
| `npm run start:dev`  | Start with watch mode     |
| `npm run start:prod` | Start production server   |

### Frontend Commands

| Command            | Purpose                       |
| ------------------ | ----------------------------- |
| `npm run test`     | Run frontend tests (Vitest)   |
| `npm run build`    | Build for production          |
| `npm run dev`      | Start development server      |
| `npm run coverage` | Generate test coverage report |

---

## Testing

The project includes comprehensive testing for both frontend and backend.

### Backend Tests (Jest)

- Unit tests for all modules
- Authentication and authorization tests
- Database query tests with mocked Drizzle ORM
- API endpoint validation

Run tests:

```bash
cd backend
npm run test
```

### Frontend Tests (Vitest)

- Component tests
- Hook tests
- Integration tests

Run tests:

```bash
cd frontend
npm run test
```

### Category Module Validation

| Test Case                   | Expected Result                   |
| --------------------------- | --------------------------------- |
| Get All Categories          | Returns list of active categories |
| Get Category by ID          | Returns specific category object  |
| Category by non-existent ID | Returns 404 error                 |
| Invalid ID format           | Returns 400 validation error      |
| Find or Create (exists)     | Returns existing category         |
| Find or Create (new)        | Creates and returns new category  |

### Integration Tests

The Docker integration tests verify that all services communicate correctly:

- Database connectivity
- API health checks
- Service startup sequence
- Environment configuration

---

## Troubleshooting

**Port already in use?**

```bash
# Kill process on port (e.g., 3000)
lsof -i :3000
kill -9 <PID>
```

**Database connection issues?**

- Verify `docker compose ps` shows all containers running
- Check logs: `docker compose logs postgres`
- Ensure `DATABASE_URL` is correct in `.env`

**Tests failing in CI/CD?**

- Check GitHub Actions logs
- Verify all secrets are set in GitHub
- Ensure migrations are committed to git

**Login not working on mobile (iOS Safari)?**

Safari on iOS blocks cross-site cookies by default, even when the backend sets `SameSite=None; Secure=true`. This is Apple's ITP (Intelligent Tracking Prevention). Since the frontend (Vercel) and backend (Render) are on different domains, the auth cookies get silently blocked on mobile.

The fix: `vercel.json` configures Vercel as a reverse proxy. Instead of the browser calling the Render URL directly, it calls `/api/*` on the same Vercel domain. Vercel then relays the request to Render server-to-server. The browser only ever sees the Vercel domain, so cookies are first-party and Safari allows them.

This is why `VITE_BACKEND_URL` must be set to `/api` (not the Render URL) in the Vercel dashboard.

---

## About This Project

This is a student project developed as part of a professional examination for a **Developer-Designer certification**. It demonstrates full-stack development capabilities including frontend development, backend architecture, database design, and CI/CD pipeline implementation.

The project was built to showcase practical knowledge of:

- Modern web application development (React, NestJS)
- Database design and optimization (PostgreSQL, Drizzle ORM)
- Containerization and orchestration (Docker)
- Continuous Integration and Deployment (GitHub Actions)
- API design and documentation
