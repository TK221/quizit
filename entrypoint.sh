#!/bin/sh

echo "Applying database migrations..."
cd /app/migration
yarn db:migrate & PID=$!
# Wait for migration to finish
wait $PID

cd /app

echo "Starting server..."
node server.js & PID=$!

wait $PID