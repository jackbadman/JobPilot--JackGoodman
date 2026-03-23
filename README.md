# Job Pilot

Job Pilot is a job application tracking system built with a React frontend, an Express/MongoDB backend, and Docker support for local containerised development.

## Overview

The application is designed to help users track job applications in one place. It currently supports:

- user registration and login with JWT-based authentication
- creating, editing, listing, filtering, and deleting job applications
- lookup-backed fields for job status, job type, work type, and location
- dashboard summary metrics for total applications, recent activity, and status breakdown
- file upload endpoints and file metadata handling

## Repository Structure

```text
.
|-- backend/                 # Express API, MongoDB models, integration tests
|-- frontend/                # React + Vite single-page application
|-- .github/workflows/       # GitHub Actions CI
|-- .githooks/               # Repo-managed Git hooks
|-- docker-compose.yml       # Local multi-container setup
`-- jp_Docs/                 # Project documentation and sprint artefacts
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, React Router, Vite |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Authentication | JWT |
| File Uploads | Multer + Cloudinary |
| Testing | Node test runner, Supertest, mongodb-memory-server |
| Containers | Docker, Docker Compose |
| CI | GitHub Actions |

## Current Architecture

- The frontend lives in [`frontend/`](/home/jgoodman/Desktop/Uni/COMP3000%20-%20Dissertation%20Project/Job-Pilot-repo/frontend) and calls the backend API over HTTP.
- The backend lives in [`backend/`](/home/jgoodman/Desktop/Uni/COMP3000%20-%20Dissertation%20Project/Job-Pilot-repo/backend) and exposes routes under `/api/...`.
- The backend app composition is defined in [`backend/src/app.js`](/home/jgoodman/Desktop/Uni/COMP3000%20-%20Dissertation%20Project/Job-Pilot-repo/backend/src/app.js), while runtime startup happens in [`backend/src/server.js`](/home/jgoodman/Desktop/Uni/COMP3000%20-%20Dissertation%20Project/Job-Pilot-repo/backend/src/server.js).
- The frontend currently targets `http://localhost:5000` directly for API requests.

## Requirements

For local development without Docker:

- Node.js 20+
- npm
- a MongoDB instance or MongoDB Atlas connection
- Cloudinary credentials if you want to exercise upload flows

## Environment Variables

The backend expects environment variables for database, auth, and upload configuration.

Required backend variables:

- `MONGO_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `PORT` optional, defaults to `5000`

Copy the template and adjust values for your environment:

```bash
cp backend/.env.example backend/.env
```

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

## Running With Docker

From the repository root:

```bash
docker compose up --build
```

This starts:

- frontend on `http://localhost:5173`
- backend on `http://localhost:5000`

The backend container reads environment variables from `backend/.env`.

## Testing

Backend integration tests are located in [`backend/tests/`](/home/jgoodman/Desktop/Uni/COMP3000%20-%20Dissertation%20Project/Job-Pilot-repo/backend/tests).

Current backend integration coverage includes:

- authentication
- job CRUD and ownership isolation
- lookup endpoints
- dashboard summary aggregation

Run the backend integration suite with:

```bash
cd backend
npm run test:integration
```

The suite uses:

- `supertest` for HTTP-level API testing
- `mongodb-memory-server` for isolated test databases

## CI

GitHub Actions configuration is in [`/.github/workflows/ci.yml`](/home/jgoodman/Desktop/Uni/COMP3000%20-%20Dissertation%20Project/Job-Pilot-repo/.github/workflows/ci.yml).

The current pipeline runs:

- backend install
- backend smoke test
- backend integration tests
- frontend install
- frontend lint
- frontend build

## Git Hooks

A repo-managed pre-push hook exists at [`.githooks/pre-push`](/home/jgoodman/Desktop/Uni/COMP3000%20-%20Dissertation%20Project/Job-Pilot-repo/.githooks/pre-push). It runs the backend integration suite before push.

Important:

- Git does not use `.githooks` automatically unless `core.hooksPath` is configured.
- In this local clone, `core.hooksPath` was configured manually.
- Other clones will need the same config if you want the hook to run locally there too.

## Known Gaps

- The frontend API base URL is hardcoded to `http://localhost:5000`.
- Browser end-to-end tests are not implemented yet.
- File upload integration tests are not implemented yet.

## License

This project is licensed under the terms in [`LICENSE`](/home/jgoodman/Desktop/Uni/COMP3000%20-%20Dissertation%20Project/Job-Pilot-repo/LICENSE).
