#!/bin/sh
# 1. preparation
# start migrage with Drizzle
echo "Start migrate with Drizzle"
npm run migrate

# stop the script if migrate is failed
if [ $? -ne 0 ]; then
  echo "Migration failed. Exiting."
  exit 1
fi

# 2. launch the server
echo "Start the server"
exec npm run start:dev
