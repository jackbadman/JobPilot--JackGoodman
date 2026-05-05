# Job Pilot

Job Pilot is a job application tracking system built with a React frontend, an Express/MongoDB backend, and Docker support for local containerised development.

## Overview

The application helps users track job applications in one place. It currently supports:

- user registration and login with JWT-based authentication
- protected dashboard and job-management pages
- creating, editing, listing, and deleting job applications, with API-level filtering
- lookup-backed fields for job status, job type, work type, and location
- salary, applied date, closing date, and stored favourite flag on job records
- dashboard summary metrics for total applications, recent applications, and status breakdown
- Cloudinary-backed file uploads, file metadata storage, job-file association, and metadata deletion

## Repository Structure

```text
.
|-- backend/                 # Express API, MongoDB models, scripts, and tests
|-- frontend/                # React + Vite single-page application and tests
|-- .github/workflows/       # GitHub Actions CI
|-- .githooks/               # Repo-managed Git hooks
|-- docker-compose.yml       # Local frontend/backend container setup
`-- jp_Docs/                 # Project documentation and sprint artefacts
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, React Router 6, Vite 7 |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Authentication | JWT, bcrypt |
| File uploads | Multer, multer-storage-cloudinary, Cloudinary |
| Backend tests | Node test runner, Supertest, mongodb-memory-server |
| Frontend tests | Node test runner, Playwright |
| Containers | Docker, Docker Compose |
| CI | GitHub Actions |

## Current Architecture

- The frontend lives in `frontend/` and calls the backend API directly over HTTP.
- The backend lives in `backend/` and exposes routes under `/api/...`.
- Backend app composition is defined in `backend/src/app.js`; runtime startup is handled by `backend/src/server.js`.
- The frontend currently targets `http://localhost:5000` directly for API requests.
- JWTs are stored in browser `localStorage`; expired or invalid tokens are cleared and redirect the user back to `/`.
- MongoDB lookup collections are data-driven. A usable local database needs job statuses, job types, work types, and locations populated before the create/edit forms can submit valid jobs.

## API Surface

All routes below return JSON. Protected routes require an `Authorization: Bearer <token>` header.

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| `GET` | `/health` | No | Health check |
| `POST` | `/api/users/register` | No | Create a user and return a token |
| `POST` | `/api/users/login` | No | Authenticate a user and return a token |
| `GET` | `/api/users` | Yes | List public user fields |
| `GET` | `/api/users/me` | Yes | Return the authenticated user's public profile |
| `GET` | `/api/jobs` | Yes | List the authenticated user's jobs; supports `status`, `type`, `workType`, `location`, and `sort` query params |
| `POST` | `/api/jobs` | Yes | Create a job application |
| `GET` | `/api/jobs/:id` | Yes | Fetch one owned job application |
| `PUT` | `/api/jobs/:id` | Yes | Update one owned job application |
| `DELETE` | `/api/jobs/:id` | Yes | Delete one owned job application |
| `GET` | `/api/dashboard/summary` | Yes | Return total, recent, and by-status application counts |
| `GET` | `/api/lookup/job-statuses` | Yes | List job status lookup values |
| `GET` | `/api/lookup/job-types` | Yes | List job type lookup values |
| `GET` | `/api/lookup/work-types` | Yes | List work type lookup values |
| `GET` | `/api/lookup/locations` | Yes | List location lookup values |
| `POST` | `/api/upload` | Yes | Upload one binary file to Cloudinary with optional `jobId` |
| `POST` | `/api/files` | Yes | Create a file metadata record without uploading binary content |
| `GET` | `/api/files/job/:jobId` | Yes | List file metadata for one owned job |
| `DELETE` | `/api/files/:id` | Yes | Delete one owned file metadata record and detach it from its job; Cloudinary asset deletion is not currently implemented |

## Data Model

The main collections are:

- `User`: `emailAddress`, `name`, and hidden `passwordHash`
- `Job`: owner, company, title, lookup references, optional salary/dates, favourite flag, and attached files
- `File`: owner, optional job reference, filename, URL, Cloudinary public id, size, content type, format, and description
- `JobStatus`, `JobType`, `WorkType`, `Location`: unique lookup names used by job forms and filters

## Requirements

For local development without Docker:

- Node.js 20+
- npm
- MongoDB, either local or hosted
- Cloudinary credentials for upload flows

The Dockerfiles currently use Node 22 Alpine images. CI runs on Node 20.

## Environment Variables

The backend expects environment variables for database, auth, and uploads.

Required backend variables:

- `MONGO_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Optional backend variable:

- `PORT`, defaults to `5000`

Copy the template and adjust values for your environment:

```bash
cp backend/.env.example backend/.env
```

There is no active frontend environment configuration at the moment because API URLs are hardcoded in the React source.

## Running Locally

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The backend starts on `http://localhost:5000` by default.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on `http://localhost:5173`.

### Lookup Data

The app does not currently include a production seed command. Before creating jobs in a fresh database, insert lookup documents for:

- `jobstatuses`
- `jobtypes`
- `worktypes`
- `locations`

The automated tests seed their own lookup data in memory.

## Running With Docker

From the repository root:

```bash
docker compose up --build
```

This starts:

- frontend on `http://localhost:5173`
- backend on `http://localhost:5000`

The backend container reads environment variables from `backend/.env`.

Important: `docker-compose.yml` starts only the frontend and backend. It does not start MongoDB, so `MONGO_URI` must point to a database reachable from inside the backend container. A `localhost` MongoDB URI inside the container refers to the container itself, not your host machine.

## Testing

### Backend

```bash
cd backend
npm run smoke
npm run test:unit
npm run test:integration
```

Backend coverage includes:

- auth middleware behavior
- registration, login, email normalization, password hashing, and `/me`
- job CRUD, ownership isolation, and filtering
- lookup endpoint authentication and responses
- dashboard summary aggregation

Backend integration tests use `supertest` and `mongodb-memory-server`.

### Frontend

```bash
cd frontend
npm run test:unit
npm run lint
npm run build
npm run test:e2e
```

Frontend coverage includes:

- auth utility token parsing, storage, expiry checks, and cleanup
- Playwright browser flows for sign-up/login and create/edit/delete job applications

The Playwright config starts:

- the backend e2e server from `backend/scripts/e2eServer.js`
- the Vite dev server on `http://127.0.0.1:4173`

The e2e backend uses `mongodb-memory-server` and seeds lookup data automatically.

## CI

GitHub Actions configuration is in `.github/workflows/ci.yml`.

The current pipeline has three jobs:

- `backend`: install, unit tests, smoke test, integration tests
- `frontend`: install, unit tests, lint, build
- `e2e`: install backend/frontend dependencies, install Chromium, run Playwright tests, upload Playwright reports when present

## Git Hooks

A repo-managed pre-push hook exists at `.githooks/pre-push`. It runs the backend integration suite before push.

Enable it in a clone with:

```bash
git config core.hooksPath .githooks
```

## Known Gaps

- The frontend API base URL is hardcoded to `http://localhost:5000`.
- There is no production seed script for lookup data.
- File upload integration tests are not implemented yet.
- File deletion removes database metadata but does not currently destroy Cloudinary assets.
- Docker Compose does not include a MongoDB service.

## License

This project is licensed under the terms in `LICENSE`.
