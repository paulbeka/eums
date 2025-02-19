#!/bin/sh

# Wait for the database to be ready
echo "Waiting for database..."
until pg_isready -h db -p 5432 -U admin; do
  echo "Waiting for database to be ready..."
  sleep 2
done
echo "Database is ready."

# Run Alembic migrations
echo "Running migrations..."
alembic upgrade head
python populate.py

# Start the FastAPI app
exec uvicorn eums_app.main:app --host 0.0.0.0 --port 8000
