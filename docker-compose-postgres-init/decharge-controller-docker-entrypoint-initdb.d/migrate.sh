#!/bin/bash
set -e

export PGPASSWORD="dephy"

psql -U dephy -c "CREATE DATABASE dephy_decharge_controller_server;"

for sql_file in /decharge_controller_server_migrations/*.sql; do
  echo "Executing $sql_file..."
  psql -U dephy -d dephy_decharge_controller_server -f "$sql_file"
done
