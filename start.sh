#!/bin/bash

echo "Starting CareOrder..."
echo ""

# Start backend
cd backend && node server.js &
BACKEND_PID=$!
echo "Backend started (PID $BACKEND_PID) → http://localhost:5001"

# Wait for backend to be ready
sleep 1

# Start frontend
cd ../frontend && npm run dev &
FRONTEND_PID=$!
echo "Frontend started (PID $FRONTEND_PID) → http://localhost:3000"

echo ""
echo "CareOrder is running!"
echo "  App:     http://localhost:3000"
echo "  API:     http://localhost:5001"
echo ""
echo "Add your ANTHROPIC_API_KEY to backend/.env to enable Claude filtering."
echo ""
echo "Press Ctrl+C to stop both servers."

wait
