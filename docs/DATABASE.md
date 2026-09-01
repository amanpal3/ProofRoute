# Database Design & Schema

## 🗄️ Database Engine
- **Primary Relational DB**: PostgreSQL 15+
- **Cache & Message Broker**: Redis 7+

---

## 📊 Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ DOCUMENTS : submits
    ISSUERS ||--o{ DOCUMENTS : issues
    DOCUMENTS ||--|| VERIFICATIONS : generates
    DOCUMENTS ||--|| BLOCKCHAIN_RECORDS : anchors

    USERS {
        uuid id PK
        string email UK
        string wallet_address
        string role
        timestamp created_at
    }

    DOCUMENTS {
        uuid id PK
        uuid user_id FK
        string document_hash UK
        string file_name
        string mime_type
        int file_size
        string storage_uri
        timestamp created_at
    }

    BLOCKCHAIN_RECORDS {
        uuid id PK
        uuid document_id FK
        string tx_hash UK
        int block_number
        string contract_address
        string issuer_address
        string status
        timestamp block_timestamp
    }

    VERIFICATIONS {
        uuid id PK
        uuid document_id FK
        float risk_score
        string risk_level
        boolean is_tampered
        jsonb ml_metadata
        timestamp verified_at
    }
```

---

## 🔄 Migration Strategy
- Migrations managed via Alembic (Python) / Prisma / Drizzle.
- All schema changes require backward-compatible rollback migrations.
