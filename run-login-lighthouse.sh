#!/bin/bash

set -e

# 1. Install dependencies (if not present)
echo "Installing dependencies..."
npm install puppeteer lighthouse serve

# 2. Start local static server in background
echo "Starting local server..."
npx serve . -l 8080 > server.log 2>&1 &
SERVER_PID=$!

# Wait for the server to be up
sleep 2

# 3. Run Puppeteer + Lighthouse script
echo "Running Puppeteer + Lighthouse script..."
node login-lighthouse.js

# 4. Kill the server after the script runs
echo "Shutting down server..."
kill $SERVER_PID

echo "Done. Check lighthouse-home-report.html for the report."