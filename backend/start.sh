#!/bin/sh
# 1. Apply Drizzle migrations
echo "Applying database migrations with Drizzle..."
npm run migrate

if [ $? -ne 0 ]; then
  echo "Migration failed. Exiting."
  exit 1
fi

echo "Migrations applied successfully."

# 2. Run compiled seed (seed.ts is compiled to dist/seed.js at build time)
echo "Running seed data..."
node dist/seed.js

if [ $? -ne 0 ]; then
  echo "Seed failed. Continuing anyway..."
  # Continue on seed fail (data might already exist)
fi

# 3. Launch server
echo "Starting NestJS server..."
exec npm run start:prod