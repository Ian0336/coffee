#!/bin/sh
# wait-for-it.sh

set -e

echo "Waiting for database..."
# 等待資料庫啟動
until PGPASSWORD="${POSTGRES_PASSWORD}" psql -h "db" -U "coffee_admin" -d "coffee_shop" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

echo "Database is up - starting application" 