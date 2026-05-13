# BlaBlaBook — Backend

NestJS REST API for the BlaBlaBook application.

For full project setup, documentation, and CI/CD instructions, see the [root README](../README.md).

---

## Tech Stack

| Technology        | Purpose                                     |
| ----------------- | ------------------------------------------- |
| NestJS            | Structured backend framework (Node.js)      |
| PostgreSQL        | Relational database                         |
| Drizzle ORM       | Type-safe SQL queries and schema management |
| argon2            | Secure password hashing                     |
| Helmet            | HTTP security headers                       |
| @nestjs/throttler | Rate limiting to prevent abuse              |
| Swagger           | Interactive API documentation at `/api`     |
| Jest              | Unit testing                                |

---

## Getting Started

The backend is meant to run inside Docker alongside the frontend. See the [root README](../README.md#getting-started) for the full setup.

To run the backend standalone (without Docker):

```bash
cd backend
npm install
npm run start:dev
```

The API starts at `http://localhost:3000`.  
Swagger docs are available at `http://localhost:3000/api`.

Required environment variables (create a `.env` at the backend root):

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/blablabook?schema=public
JWT_SECRET=a_very_long_random_secret_at_least_32_chars
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

---

## Commands

| Command                | Purpose                          |
| ---------------------- | -------------------------------- |
| `npm run start:dev`    | Start in watch mode              |
| `npm run start:prod`   | Start production server          |
| `npm run build`        | Build for production             |
| `npm run seed`         | Seed the database                |
| `npm run migrate`      | Apply pending migrations         |
| `npm run migrate:generate` | Generate a new migration file|
| `npm run test`         | Run tests (Jest)                 |
| `npm run test:watch`   | Run tests in watch mode          |
| `npm run test:cov`     | Generate test coverage report    |
| `npm run lint`         | Run ESLint                       |
| `npm run format`       | Format code with Prettier        |

---

## Project Structure

```
src/
├── auth/          # JWT auth, refresh token rotation, guards
├── books/         # Library management (add, remove, status)
├── category/      # Book categories
├── review/        # Book reviews and ratings
├── user/          # User profile and account management
├── security/      # Cookie and token utilities
├── db/
│   ├── schema.ts  # Drizzle table definitions
│   └── index.ts   # DB connection
├── main.ts        # App entry point (Helmet, throttler, CORS, cookies)
└── seed.ts        # Database seeding
```

### Migrations

Migration files live in `drizzle/` and are version-controlled in Git. The CI/CD pipeline applies them automatically on deployment.

To create a new migration after editing `schema.ts`:

```bash
npm run migrate:generate
git add drizzle/
git commit -m "feat: add X to schema"
```

---

## API Routes

Full interactive documentation is available via Swagger at `/api`.

| Method | Route                                        | Auth | Description                        |
| ------ | -------------------------------------------- | ---- | ---------------------------------- |
| POST   | `/auth/register`                             | —    | Create a new account               |
| POST   | `/auth/login`                                | —    | Log in and receive tokens          |
| POST   | `/auth/logout`                               | ✓    | Log out and revoke refresh token   |
| POST   | `/auth/refresh`                              | —    | Rotate refresh token               |
| GET    | `/user/:id`                                  | ✓    | Get user profile                   |
| PATCH  | `/user/:id`                                  | ✓    | Update profile (username, avatar…) |
| PATCH  | `/user/change-password`                      | ✓    | Change password                    |
| DELETE | `/user`                                      | ✓    | Delete account (GDPR anonymize)    |
| GET    | `/books`                                     | —    | Get all books                      |
| GET    | `/books/random`                              | —    | Get random books                   |
| GET    | `/books/library/:userId`                     | ✓    | Get user's library                 |
| POST   | `/books/library/:userId`                     | ✓    | Add a book to library              |
| PATCH  | `/books/library/:userId/book/:bookId/status` | ✓    | Update reading status              |
| DELETE | `/books/library/:userId/book/:bookId`        | ✓    | Remove a book from library         |
| GET    | `/reviews/book/:isbn`                        | —    | Get reviews for a book             |
| POST   | `/reviews`                                   | ✓    | Create a review                    |
| DELETE | `/reviews/:reviewId`                         | ✓    | Delete own review                  |

---

## Testing

Tests are written with Jest and cover the three main service layers.

```bash
npm run test
npm run test:cov
```

- `auth.service.spec.ts` — Registration, login, token refresh, logout
- `user.service.spec.ts` — Profile updates, password change, soft delete
- `books.service.spec.ts` — Library operations, reading status, book search
