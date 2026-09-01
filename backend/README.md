# ⚡ ProofRoute Backend Services

High-throughput asynchronous API gateway, verification router, and database persistence service built with FastAPI and PostgreSQL.

---

## 🏗️ Architecture

```
backend/
├── app/
│   ├── api/
│   │   └── v1/                  # Versioned API routes (documents, auth, ml, indexer)
│   ├── core/                    # App config, database session, security utils
│   ├── models/                  # SQLAlchemy ORM models
│   ├── schemas/                 # Pydantic schemas for request/response validation
│   ├── services/                # Business logic (blockchain client, verification engine)
│   └── main.py                  # FastAPI application entry point
├── migrations/                  # Alembic database migration scripts
└── requirements.txt             # Python dependencies
```

---

## 🚀 Quick Start

### 1. Environment Setup
```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Database Migrations
```bash
# Apply migrations to PostgreSQL
alembic upgrade head
```

### 3. Run Development Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- **Interactive API Docs (Swagger UI)**: `http://localhost:8000/docs`
- **ReDoc UI**: `http://localhost:8000/redoc`

---

## 🧪 Testing
```bash
# Run Pytest suite
pytest

# Run tests with coverage
pytest --cov=app --cov-report=term-missing
```
