# ProofRoute

> Decentralized & AI-Powered Document Verification, Risk Analysis, and Provenance Routing Platform.

## 📌 Overview

ProofRoute connects smart contracts, machine learning document verification models, blockchain event indexing, and modern web interfaces to deliver secure, auditable, and automated provenance and risk routing.

---

## 🏗️ Project Architecture

```
ProofRoute/
├── contracts/       # Smart contracts (Solidity/Foundry/Hardhat)
├── frontend/        # Web client application (Next.js/React/Tailwind)
├── backend/         # API & core application services (FastAPI/Node.js)
├── ml/              # Machine learning models (Document verification, Risk analysis)
├── scripts/         # Automation, migration & deployment scripts
├── tests/           # Integration & End-to-End test suites
├── docs/            # Architecture, PRD, API contracts & documentation
└── .agents/         # Autonomous agent skills, workflows & orchestration
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.x
- Python >= 3.10
- Foundry / Hardhat (for smart contracts)
- Docker & Docker Compose (optional, for local services)

### Setup
```bash
# 1. Clone & enter repository
git clone https://github.com/your-org/proofroute.git
cd ProofRoute

# 2. Environment Configuration
cp .env.example .env

# 3. Install dependencies per workspace
# Backend:
cd backend && pip install -r requirements.txt
# Frontend:
cd ../frontend && npm install
# Contracts:
cd ../contracts && forge build
```

---

## 📚 Documentation

Refer to [`docs/`](docs/) for in-depth documentation:
- [`PRD.md`](docs/PRD.md) - Product Requirements Document
- [`ARCHITECTURE.md`](docs/ARCHITECTURE.md) - High-level system architecture
- [`API_CONTRACT.md`](docs/API_CONTRACT.md) - REST/GraphQL/WebSocket API specs
- [`DATABASE.md`](docs/DATABASE.md) - Schema, ERD, and migration plans
- [`SECURITY.md`](docs/SECURITY.md) - Security guidelines and audit checklist

---

## 🤖 Agentic Development

This repository is optimized for autonomous multi-agent workflows.
Check [`AGENTS.md`](AGENTS.md) and [`.agents/`](.agents/) for agent roles, skills, and execution workflows.

---

## 📄 License
[MIT License](LICENSE)
