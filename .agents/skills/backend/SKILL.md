---
name: backend
description: Standards and instructions for developing ProofRoute backend services and APIs.
---

# Backend Skill Guide

## 🛠️ Tech Stack & Standards
- Language: Python (FastAPI) or Node.js (TypeScript)
- Database ORM: SQLAlchemy / Prisma
- Caching: Redis
- Architecture: Layered architecture (Controllers/Routers -> Services -> Repositories -> Models)

## 📌 Rules
- Always validate request payloads with Pydantic / Zod schemas.
- Implement structured logging and error handling.
- Maintain API contract synchronization with `docs/API_CONTRACT.md`.
