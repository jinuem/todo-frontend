#!/bin/bash

# Stop frontend service
if [ -f frontend.pid ]; then
    PID=$(cat frontend.pid)
    if ps -p $PID > /dev/null; then
        kill $PID
        echo "Frontend stopped (PID: $PID)"
    else
        echo "Frontend process not running"
    fi
    rm -f frontend.pid
else
    # Fallback: kill by process name
    pkill -f "vite"
    echo "Frontend processes killed"
fi
