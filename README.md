# Interview Prep

A local interview preparation tool with live code execution for JavaScript and Python.

## Project Structure

```
interview-prep/
├── frontend/          # React + TypeScript + Vite frontend
├── backend/           # Local code execution backend (Node.js)
├── scripts/           # Development scripts
└── package.json       # Root orchestration
```

## Quick Start

### Option 1: Using bash (WSL or macOS/Linux)

From the repo root:

```bash
npm run dev
```

This uses WSL (`wsl bash scripts/dev.sh`) to start both the backend (port 3333) and frontend (port 5173) together. The frontend automatically proxies API calls to the backend.

If Node/npm are not installed inside WSL, the script automatically falls back to Windows Node/npm via `cmd.exe`.

If you already have bash in your current shell (for example Git Bash), you can also run:

```bash
npm run dev:bash
```

### Option 2: Manual startup (PowerShell or terminal)

Terminal 1 - Start the backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Start the frontend:
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://127.0.0.1:5173` and automatically proxies `/api` requests to `http://127.0.0.1:3333`.

## Root package.json scripts

- `npm run dev` - Start both frontend and backend using WSL bash script
- `npm run dev:wsl` - Explicitly start both using WSL
- `npm run dev:bash` - Start both using bash from current shell
- `npm run dev:check` - Validate startup environment without launching servers
- `npm run dev:check:wsl` - Validate WSL startup environment without launching servers
- `npm run dev:frontend` - Start only the frontend
- `npm run dev:backend` - Start only the backend  
- `npm run build` - Build the frontend for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run linting on frontend code

## Frontend

Located in `frontend/`, this is a React + TypeScript application:

- Run `cd frontend && npm run dev` to start development server
- Run `cd frontend && npm run build` to build for production
- Vite configuration proxies `/api` to the backend

## Backend

Located in `backend/`, this provides local code execution:

- Runs on port 3333 (configurable via `PORT` env var)
- Executes JavaScript code in a sandboxed Node.js VM context
- Executes Python code by spawning the local Python interpreter
- Supports timeouts to prevent infinite loops

**Endpoints:**
- `POST /api/run/javascript` - Execute JavaScript with test cases
- `POST /api/run/python` - Execute Python snippets
- `GET /api/health` - Health check

**Environment variables:**
- `PORT` - Backend port (default: 3333)
- `PYTHON_EXECUTABLE` - Python interpreter path (default: `python`)

Each workspace (`frontend` and `backend`) has its own package setup, and `npm run dev` from the repo root starts both together.
