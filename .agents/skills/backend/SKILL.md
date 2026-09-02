---
name: backend
description: Standards and instructions for developing ProofRoute backend services and APIs.
---

# Backend Skill Guide

## 🛠️ Tech Stack & Standards
- Language: Python 3.11+ (FastAPI, Pydantic v2)
- Database & ORM: PostgreSQL + SQLAlchemy 2.x (Async) + Alembic migrations
- Hashing: SHA-256 (standard library `hashlib`)
- Architecture: Layered architecture (Routers -> Services -> Models/Schemas -> DB Session)

## 📌 Rules
- Always validate request payloads and parameters with Pydantic v2 schemas.
- Maintain strict contract synchronization with `docs/API_CONTRACT.md`.
- Compute document SHA-256 hashes server-side to guarantee integrity.
- Ingest blockchain events idempotently using composite uniqueness `(transaction_hash, log_index)`.
- Use Alembic migrations for any database schema changes.
- Implement structured JSON logging and centralized error handling.
