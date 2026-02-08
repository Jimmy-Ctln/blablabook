# 📚 BlablaBook

**BlablaBook** is an open-source personal book management platform for tracking your reading journey.  
It allows you to mark books as read, currently reading, or to-read, in a **containerized and easily deployable** environment (Docker).

---

## 📚 Table of Contents

- [📚 BlablaBook](#-blablabook)
  - [📚 Table of Contents](#-table-of-contents)
  - [🎯 Project Objective](#-project-objective)
  - [⚙️ Technologies Used](#️-technologies-used)
  - [🧱 Local Installation and Execution](#-local-installation-and-execution)
    - [1️⃣ Prerequisites](#1️⃣-prerequisites)
    - [2️⃣ Clone the repository](#2️⃣-clone-the-repository)
    - [3️⃣ Create a .env file](#3️⃣-create-a-env-file)
    - [4️⃣ Start the project](#4️⃣-start-the-project)
    - [5️⃣ Access the services](#5️⃣-access-the-services)
    - [6️⃣ Verify functionality](#6️⃣-verify-functionality)
  - [🔧 Useful Commands](#-useful-commands)
  - [🧭 Project Structure](#-project-structure)
  - [🧪 Test Plan](#-test-plan)
    - [🔹 Category Module Validation](#-category-module-validation)

---

## 🎯 Project Objective

The goal of **BlablaBook** is to provide a simple and intuitive personal library management solution, allowing users to:

- **add books** to their personal library via the OpenLibrary API;
- **track reading status**: "Read", "Currently Reading", "To Read";
- **search books** by title in their collection;

---

## ⚙️ Technologies Used

| Technology                  | Role                                   |
| --------------------------- | -------------------------------------- |
| **Docker & Docker Compose** | Containerization and orchestration     |
| **React + TypeScript**      | Modern, typed frontend framework       |
| **Vite**                    | Ultra-fast build tool                  |
| **Zustand**                 | Lightweight state management           |
| **Tanstack Query**          | Data fetching and caching              |
| **Tanstack Router**         | Type-safe routing                      |
| **Zod**                     | Schema validation                      |
| **Axios**                   | HTTP client                            |
| **Tailwind CSS**            | Utility-first CSS framework            |
| **Shadcn/ui**               | Pre-built UI components                |
| **NestJS**                  | Structured Node.js backend framework   |
| **PostgreSQL**              | Relational database                    |
| **Drizzle ORM**             | Modern, typed ORM                      |
| **Swagger**                 | Automatic API documentation            |
| **Adminer**                 | SQL administration interface           |
| **OpenLibrary API**         | Book data source                       |
| **Vitest**                  | Frontend testing                       |
| **Jest**                    | Backend testing                        |
| **Lighthouse**              | Performance and accessibility auditing |
| **Artillery**               | Load testing                           |
| **GitHub Actions**          | CI/CD                                  |

---

## 🧱 Local Installation and Execution

### 1️⃣ Prerequisites

- Docker installed on your system

### 2️⃣ Clone the repository

```bash
git clone <your-repo-url>
cd projet-blablabook
```

### 3️⃣ Create a .env file

Create a `.env` file at the project root based on `.env.example`.

### 4️⃣ Start the project

```bash
docker-compose up
```

### 🌱 Seed the database (books)

This populates the `book` table and links them to the test user's list.

```bash
cd backend
npx ts-node src/seed.ts
```

### 5️⃣ Access the services

| Service               | URL                                                    |
| --------------------- | ------------------------------------------------------ |
| Frontend              | [http://localhost:5173](http://localhost:5173)         |
| Backend API           | [http://localhost:3000](http://localhost:3000)         |
| Swagger Documentation | [http://localhost:3000/api](http://localhost:3000/api) |
| Adminer               | [http://localhost:8080](http://localhost:8080)         |

### 6️⃣ Verify functionality

**➤ Check the API**  
Open in browser: [http://localhost:3000/api](http://localhost:3000/api)  
Explore the interactive Swagger documentation.

**➤ Check the frontend**  
Go to: [http://localhost:5173](http://localhost:5173)  
The React interface should display correctly.

**➤ Check Adminer**  
Go to: [http://localhost:8080](http://localhost:8080)

---

## 🔧 Useful Commands

| Command                            | Description                      |
| ---------------------------------- | -------------------------------- |
| `docker-compose up`                | Start the project                |
| `docker-compose up -d`             | Start in detached mode           |
| `docker-compose down`              | Stop containers                  |
| `docker-compose down -v`           | Remove containers and volumes    |
| `docker-compose logs -f`           | Display continuous logs          |
| `docker exec -it backend sh`       | Open shell in backend container  |
| `docker exec -it frontend sh`      | Open shell in frontend container |
| `docker ps`                        | List active containers           |
| `docker-compose restart <service>` | Restart a specific service       |

---

## 🧭 Project Structure

```
.
├── backend/              # NestJS API source code
│   ├── src/
│   │   ├── auth/        # Authentication
│   │   ├── books/       # Books management
│   │   ├── user/        # Users management
│   │   ├── db/          # Database config and Drizzle schema
│   │   └── main.ts      # Entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/             # React + Vite application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Application pages
│   │   ├── api/         # API calls
│   │   ├── stores/      # Zustand stores
│   │   └── routes/      # Tanstack Router configuration
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml    # Docker Compose configuration
├── docker-compose.prod.yml # Production configuration
└── README.md
```
---

## 🧪 Test Plan

The project follows a testing strategy to ensure data integrity and API reliability.

### 🔹 Category Module Validation

| Test Case | Expected Result | Status |
| :--- | :--- | :--- |
| **Get All Categories** | 200: Returns the list of active categories | 🟢 |
| **Get Category by valid ID** | 200: Returns the specific category object | 🟢 |
| **Get Category by non-existent ID** | 404: Error "Category with ID X not found" | 🔴 |
| **Invalid ID format** (e.g., `/abc`) | 400: Validation error (ParseIntPipe) | 🔴 |
| **Find or Create (Exists)** | Returns existing category without duplication | 🟢 |
| **Find or Create (New)** | Persists new category in DB and returns it | 🟢 |

> **Note:** Backend tests are performed using **Jest** with a fully mocked Drizzle ORM to isolate business logic from the database layer.

---