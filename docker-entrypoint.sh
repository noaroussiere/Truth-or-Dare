#!/bin/sh
set -e

echo "Waiting for PostgreSQL database to be ready..."
npx prisma db push

echo "Seeding database..."
npx prisma db seed || true

echo "Starting Next.js application..."
exec node server.js
