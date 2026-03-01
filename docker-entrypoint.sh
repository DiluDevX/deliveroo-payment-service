#!/bin/sh
set -e

# Validate required environment variables
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is required" >&2
  exit 1
fi

if [ -z "$JWT_SECRET" ]; then
  echo "ERROR: JWT_SECRET is required" >&2
  exit 1
fi

if [ ${#JWT_SECRET} -lt 32 ]; then
  echo "ERROR: JWT_SECRET must be at least 32 characters" >&2
  exit 1
fi

echo "Environment variables validated."

# Run Prisma migrations
echo "Running database migrations..."
npx prisma migrate deploy || {
  echo "ERROR: Failed to run database migrations" >&2
  exit 1
}
echo "Migrations completed."

# Start the application
echo "Starting application..."
exec node dist/server.js
