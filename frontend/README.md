# BlaBlaBook — Frontend

React + TypeScript frontend for the BlaBlaBook application.

For full project setup, documentation, and CI/CD instructions, see the [root README](../README.md).

---

## Tech Stack

| Technology         | Purpose                              |
| ------------------ | ------------------------------------ |
| React + TypeScript | UI framework with full type safety   |
| Vite               | Fast build tool and dev server       |
| TanStack Router    | File-based routing with auth guards  |
| TanStack Query     | Server state, caching, and sync      |
| Zustand            | Client-side auth state management    |
| Zod                | Form and API response validation     |
| Tailwind CSS       | Utility-first styling                |
| Shadcn/ui          | Accessible, composable UI components |
| Vitest             | Unit and component testing           |

---

## Getting Started

The frontend is meant to run inside Docker alongside the backend. See the [root README](../README.md#getting-started) for the full setup.

To run the frontend standalone (without Docker):

```bash
cd frontend
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`.

Set the backend URL in a `.env` file at the frontend root:

```env
VITE_BACKEND_URL=http://localhost:3000
```

---

## Commands

| Command             | Purpose                       |
| ------------------- | ----------------------------- |
| `npm run dev`       | Start dev server (Vite)       |
| `npm run build`     | Build for production          |
| `npm run preview`   | Preview the production build  |
| `npm run test`      | Run tests (Vitest)            |
| `npm run coverage`  | Generate test coverage report |
| `npm run lint`      | Run ESLint                    |

---

## Project Structure

```
src/
├── api/           # API call functions (backend + OpenLibrary)
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks
├── pages/         # Page-level components
├── routes/        # TanStack Router config and auth guards
├── stores/        # Zustand auth store
└── main.tsx       # App entry point
```

---

## Testing

Tests are written with Vitest and cover the main pages and user flows.

```bash
npm run test
npm run coverage
```
