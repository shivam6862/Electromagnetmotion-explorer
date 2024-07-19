#!/bin/bash

# Navigate to the desktop-application directory
cd desktop-application

# Console log the current directory
ls

# Check if node_modules directory does not exist, then install dependencies
if [ ! -d "node_modules" ]; then
  npm install
fi

# Start the application in the background and save its PID
npm run dev &
PID=$!

# Console log the PID
echo "PID: $PID"

# Wait for a command to terminate the application
read -p "Press [Enter] key to stop the application..."

# Kill the application process
kill -- -$PID
