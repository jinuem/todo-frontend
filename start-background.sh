#!/bin/bash

# Kill existing frontend process if running
pkill -f "vite" 2>/dev/null

# Start frontend in background
nohup npm run dev > frontend.log 2>&1 &

# Get the process ID
PID=$!
echo "Frontend started in background with PID: $PID"
echo $PID > frontend.pid

# Wait a moment to check if it started successfully
sleep 3
if ps -p $PID > /dev/null; then
    echo "Frontend is running successfully on port 3000"
else
    echo "Failed to start frontend"
    exit 1
fi
