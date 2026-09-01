---
name: database
description: Standards for database schema design, migrations, and query optimization.
---

# Database Skill Guide

## 📌 Rules
- Always create reversible database migrations.
- Index foreign keys and frequently queried fields (e.g., `document_hash`).
- Avoid N+1 query patterns using appropriate joins or eager loading.
