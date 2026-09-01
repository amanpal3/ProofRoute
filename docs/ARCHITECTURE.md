# System Architecture

## 🏛️ High-Level Architecture Overview

```mermaid
graph TD
    Client[Web Frontend / SDK] -->|REST / GraphQL| API[Backend API Gateway]
    API -->|Async Tasks| ML[ML Document Verification & Risk Engine]
    API -->|Transactions| Chain[Smart Contracts on Blockchain]
    Indexer[Blockchain Event Indexer] -->|Listen & Sync| Chain
    Indexer -->|Store Synced Data| DB[(PostgreSQL & Redis)]
    API -->|Query State| DB
    ML -->|Risk Score & Flags| API
```

## 🧩 Core Components

1. **Smart Contracts (`contracts/`)**:
   - `DocumentRegistry.sol`: Anchors document hashes, issuer signatures, and status.
   - `AccessManager.sol`: Role-based access control for issuers and verifiers.

2. **Backend Service (`backend/`)**:
   - API endpoints for verification, batch submissions, and user management.
   - Job queue for ML inference and blockchain transaction submission.

3. **ML Pipeline (`ml/`)**:
   - Document layout analysis & OCR.
   - Copy-move and metadata tampering detection.
   - Risk scoring engine outputting confidence scores (0-100).

4. **Event Indexer (`backend/indexer/` or `scripts/`)**:
   - High-throughput listener for contract events (`DocumentRegistered`, `DocumentRevoked`).
   - Syncs on-chain data into PostgreSQL for instant relational queries.

5. **Frontend Client (`frontend/`)**:
   - Next.js dashboard with wallet connection (Ethers / Viem / Wagmi).
   - Drag-and-drop document verifier with visual tamper heatmaps.
