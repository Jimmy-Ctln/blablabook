#!/bin/sh
# 1. Preparation - Apply Drizzle migrations
# Uses drizzle-kit migrate (with SQL file history in ./drizzle/)
echo "Applying database migrations with Drizzle..."
npm run migrate

# Stop if migration fails
if [ $? -ne 0 ]; then
  echo "Migration failed. Exiting."
  exit 1
fi

echo "Migrations applied successfully."

# 2. Launch the server
echo "Starting NestJS server..."
exec npm run start:dev
