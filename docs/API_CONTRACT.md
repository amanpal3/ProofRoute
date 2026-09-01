# API Contract & Specifications

## Base URL
`/api/v1`

## Authentication
Bearer JWT Token in `Authorization: Bearer <token>` or API Key in `X-API-Key`.

---

## Endpoints

### 1. Documents

#### `POST /documents/verify`
Submits a document for verification against on-chain records and ML risk analysis.

**Request Body (`multipart/form-data`):**
- `file`: Document binary (PDF/PNG/JPEG)
- `doc_hash` (optional): Pre-calculated SHA-256 hash
- `issuer_address` (optional): Expected issuer Ethereum address

**Response (`200 OK`):**
```json
{
  "status": "success",
  "document_hash": "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
  "is_authentic": true,
  "on_chain_status": {
    "registered": true,
    "issuer": "0x1234567890123456789012345678901234567890",
    "block_number": 19482012,
    "timestamp": 1772561561
  },
  "risk_assessment": {
    "risk_score": 12.5,
    "risk_level": "LOW",
    "tampering_detected": false,
    "confidence": 0.98
  }
}
```

#### `POST /documents/anchor`
Registers a new document hash on the smart contract registry.

---

### 2. Risk Engine

#### `POST /ml/risk-score`
Runs ML model inference directly on document features.

---

### 3. Indexer / Health

#### `GET /health`
Returns health status of API, Database, ML service, and Blockchain RPC connection.
