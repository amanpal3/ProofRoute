#!/bin/sh
set -e

echo "=== ProofRoute Backend Container Starting ==="

# Wait for PostgreSQL if configured
if echo "$DATABASE_URL" | grep -q "postgresql"; then
  echo "Checking database connection readiness..."
  python -c "
import time, socket, os

host = os.environ.get('POSTGRES_HOST', 'postgres')
port = int(os.environ.get('POSTGRES_PORT', 5432))
retries = 30

while retries > 0:
    try:
        s = socket.create_connection((host, port), timeout=2)
        s.close()
        print(f'Database is reachable at {host}:{port}!')
        break
    except Exception as e:
        print(f'Waiting for database at {host}:{port}... ({retries} retries left)')
        time.sleep(1)
        retries -= 1
"
fi

# Run automatic seed
echo "Initializing tables and seeding demo data..."
python seed_data.py || echo "Seed data script finished."

echo "Starting Uvicorn ASGI server on 0.0.0.0:8000..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
