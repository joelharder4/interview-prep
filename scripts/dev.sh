#!/bin/bash

# Local development script for running frontend and backend together
# Start this from the repo root: bash scripts/dev.sh

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_PID=""
FRONTEND_PID=""

is_wsl() {
    grep -qiE "microsoft|wsl" /proc/version 2>/dev/null
}

cleanup() {
    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi

    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi

    echo "Shutdown complete"
}

run_in_dir() {
    local dir="$1"
    shift

    if [ "$USE_WINDOWS_NODE" = "1" ]; then
        local win_dir
        win_dir="$(wslpath -w "$dir")"
        cmd.exe /c "cd /d \"${win_dir}\" && $*"
    else
        (
            cd "$dir"
            "$@"
        )
    fi
}

run_in_dir_background() {
    local dir="$1"
    shift

    if [ "$USE_WINDOWS_NODE" = "1" ]; then
        local win_dir
        win_dir="$(wslpath -w "$dir")"
        cmd.exe /c "cd /d \"${win_dir}\" && $*" &
        echo $!
    else
        (
            cd "$dir"
            "$@"
        ) &
        echo $!
    fi
}

echo "Starting interview-prep (frontend + backend)..."
echo "Project root: $PROJECT_ROOT"

CHECK_ONLY="0"
if [ "${1:-}" = "--check" ]; then
    CHECK_ONLY="1"
fi

# Check if frontend and backend directories exist
if [ ! -d "$PROJECT_ROOT/frontend" ]; then
    echo "❌ Error: frontend/ directory not found"
    exit 1
fi

if [ ! -d "$PROJECT_ROOT/backend" ]; then
    echo "❌ Error: backend/ directory not found"
    exit 1
fi

USE_WINDOWS_NODE="0"

if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
    echo "Using native Node/npm from current shell"
elif is_wsl && command -v cmd.exe >/dev/null 2>&1; then
    echo "Native Node/npm not found in WSL; using Windows Node/npm through cmd.exe"
    USE_WINDOWS_NODE="1"
else
    echo "❌ Error: node and npm are not available in this shell"
    echo "Install Node.js in your environment, or run from WSL with Windows Node installed."
    exit 1
fi

if [ "$CHECK_ONLY" = "1" ]; then
    echo "Environment check passed"
    exit 0
fi

# Install dependencies if needed
if [ ! -d "$PROJECT_ROOT/frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    if [ "$USE_WINDOWS_NODE" = "1" ]; then
        run_in_dir "$PROJECT_ROOT/frontend" npm install
    else
        run_in_dir "$PROJECT_ROOT/frontend" npm install
    fi
fi

if [ ! -f "$PROJECT_ROOT/backend/package.json" ]; then
    echo "Error: backend/package.json not found"
    exit 1
fi

# Start backend in background
echo "Starting backend on http://127.0.0.1:3333..."
BACKEND_PID="$(run_in_dir_background "$PROJECT_ROOT/backend" node src/server.js)"
echo "Backend PID: $BACKEND_PID"

# Start frontend
echo "Starting frontend on http://127.0.0.1:5173..."
FRONTEND_PID="$(run_in_dir_background "$PROJECT_ROOT/frontend" npm run dev)"
echo "Frontend PID: $FRONTEND_PID"

# Trap to kill both processes on exit
trap cleanup EXIT INT TERM

# Wait for both processes
wait
