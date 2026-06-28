#!/usr/bin/env bash
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"
PORT="${PORT:-8765}"

echo "Building main app..."
(cd test-designs/test-02 && npm run build)

echo ""
echo "  http://localhost:${PORT}/"
echo ""
echo "  Press Ctrl+C to stop."
echo ""

cd dist && python3 -m http.server "$PORT"
