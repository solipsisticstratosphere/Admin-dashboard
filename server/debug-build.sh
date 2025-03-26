#!/bin/bash

echo "==== DEBUG BUILD SCRIPT ===="
echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

echo -e "\n==== ENVIRONMENT VARIABLES ===="
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"

echo -e "\n==== DIRECTORY STRUCTURE BEFORE BUILD ===="
find ./src -type f | sort

echo -e "\n==== INSTALLING DEPENDENCIES ===="
npm install --include=dev

echo -e "\n==== GENERATING PRISMA CLIENT ===="
npx prisma generate

echo -e "\n==== RUNNING BUILD SCRIPT ===="
node build.js

echo -e "\n==== DIRECTORY STRUCTURE AFTER BUILD ===="
find ./dist -type f | sort

echo -e "\n==== CHECKING MAIN.JS ===="
if [ -f "./dist/src/main.js" ]; then
  echo "dist/src/main.js EXISTS - Build successful"
  echo "File size: $(ls -lh ./dist/src/main.js | awk '{print $5}')"
  echo "First 10 lines of main.js:"
  head -n 10 ./dist/src/main.js
else
  echo "dist/src/main.js DOES NOT EXIST - Build failed"
  exit 1
fi

echo -e "\n==== BUILD DEBUG COMPLETE ===="
