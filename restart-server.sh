#!/bin/bash

echo "🔄 Restarting SentraBASE Development Server..."

# Kill existing processes on port 5173
echo "🛑 Stopping existing server..."
lsof -ti:5173 | xargs kill -9 2>/dev/null || echo "No existing server found"

# Clear Vite cache
echo "🧹 Clearing Vite cache..."
rm -rf node_modules/.vite

# Wait a moment
sleep 2

# Start fresh server
echo "🚀 Starting fresh server..."
npm run dev -- --host 0.0.0.0 --port 5173 &

# Wait for server to start
sleep 5

# Check server status
echo "✅ Checking server status..."
if curl -s -I http://localhost:5173/ | grep -q "200 OK"; then
    echo "✅ Server is running successfully at http://localhost:5173/"
    echo "🎉 Ready for development!"
else
    echo "❌ Server failed to start properly"
    echo "🔍 Check the logs above for errors"
fi
