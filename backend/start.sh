#!/bin/sh
# 1. Apply Drizzle migrations
echo "Applying database migrations with Drizzle..."
npm run migrate

if [ $? -ne 0 ]; then
  echo "Migration failed. Exiting."
  exit 1
fi

echo "Migrations applied successfully."

# 2. Run seed data (categories, keywords, etc.)
echo "Running seed data..."
npm run seed

if [ $? -ne 0 ]; then
  echo "Seed failed. Continuing anyway..."
  # On continue même si le seed échoue (ex: données déjà présentes)
fi

# 3. Launch server
echo "Starting NestJS server..."
exec npm run start:prod