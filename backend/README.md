# ⚡ ProofRoute Backend Services

High-throughput asynchronous API gateway, verification router, and database persistence service built with FastAPI and PostgreSQL. The current implementation also connects the document verification route directly to the ML pipeline.

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

The implemented route is `POST /api/v1/documents/verify`. It validates the uploaded image, computes SHA-256 on the raw bytes, calls `src.pipeline.analyze_document`, and returns the risk assessment, forensics, and OCR results.

---

## 🚀 Quick Start

### 1. Environment Setup

From the repository root:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r ml/requirements.txt
pip install -r backend/requirements.txt
export PYTHONPATH="$PWD:$PWD/ml"
```

### 2. Database Migrations

```bash
# Apply migrations to PostgreSQL when the database layer is configured
alembic upgrade head
```

### 3. Run Development Server

```bash
PYTHONPATH="$PWD:$PWD/ml" uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

- **Interactive API Docs (Swagger UI)**: `http://localhost:8000/docs`
- **ReDoc UI**: `http://localhost:8000/redoc`

### 4. Verify a Document

```bash
curl -X POST http://localhost:8000/api/v1/documents/verify \
  -F "file=@./sample.png"
```

The endpoint currently supports PNG and JPEG images up to 10 MB. OCR is optional; without Tesseract, image forensics and risk scoring still run while OCR reports an unavailable engine.

ML is decision support only. It does not determine blockchain authenticity, change blockchain state, or replace raw-byte hash verification. If ML becomes unavailable, the API returns `risk_status: "unavailable"` rather than failing the cryptographic verification path.

---

## 🧪 Testing

```bash
PYTHONPATH="$PWD:$PWD/ml" pytest -q backend/tests ml/tests
```

The tests cover upload validation, SHA-256 output, FastAPI-to-ML wiring, health status, forensics, OCR fallback, scoring thresholds, and pipeline output shape.

For coverage:

```bash
PYTHONPATH="$PWD:$PWD/ml" pytest --cov=backend/app --cov=ml/src --cov-report=term-missing
```
