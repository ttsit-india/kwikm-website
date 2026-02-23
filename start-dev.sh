#!/bin/bash

echo "Starting KwikM Development Environment..."
echo

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Starting kwikm-api backend..."
cd "$SCRIPT_DIR/../kwikm-api"
gnome-terminal --title="KwikM API" -- bash -c "npm run start:dev; exec bash" 2>/dev/null || \
xterm -title "KwikM API" -e "npm run start:dev; bash" 2>/dev/null || \
echo "Please start kwikm-api manually: cd ../kwikm-api && npm run start:dev"

echo "Waiting for backend to start..."
sleep 5

echo "Starting Color-Wave client..."
cd "$SCRIPT_DIR"
gnome-terminal --title="Color-Wave Client" -- bash -c "npm run dev; exec bash" 2>/dev/null || \
xterm -title "Color-Wave Client" -e "npm run dev; bash" 2>/dev/null || \
echo "Please start client manually: npm run dev"

echo
echo "Development servers starting..."
echo "Backend: http://localhost:3000"
echo "Frontend: http://localhost:5000"
echo "API Docs: http://localhost:3000/api/docs"
echo