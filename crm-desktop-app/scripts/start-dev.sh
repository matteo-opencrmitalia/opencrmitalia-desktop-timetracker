#!/bin/bash
echo "Starting CRM Desktop App Development Environment..."
echo "=================================="

# Change to project directory
cd "$(dirname "$0")/.."

# Kill any existing processes
echo "Cleaning up existing processes..."
pkill -f "vite" 2>/dev/null || true
pkill -f "electron" 2>/dev/null || true
sleep 2

# Start Vite development server
echo "Starting Vite development server..."
npm run dev &
VITE_PID=$!
echo "Vite PID: $VITE_PID"

# Wait for Vite to be ready
echo "Waiting for Vite server to be ready..."
for i in {1..30}; do
  if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "Vite server is ready!"
    break
  fi
  echo "Attempt $i/30: Waiting for Vite server..."
  sleep 1
done

# Check if Vite is running
if ! curl -s http://localhost:5173 > /dev/null 2>&1; then
  echo "ERROR: Vite server failed to start!"
  exit 1
fi

# Build Electron main process
echo "Building Electron main process..."
npm run build:electron-main

# Start Electron
echo "Starting Electron..."
NODE_ENV=development npx electron dist-electron/main.js &
ELECTRON_PID=$!
echo "Electron PID: $ELECTRON_PID"
echo "App started successfully! Press Ctrl+C to stop."

# Wait for user input
wait $ELECTRON_PID

# Cleanup on exit
trap 'echo "Cleaning up..."; kill $VITE_PID 2>/dev/null || true; pkill -f "electron" 2>/dev/null || true' EXIT