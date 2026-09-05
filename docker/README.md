# 🐳 ProofRoute Local Docker Deployment Guide

Quick-start container orchestration for local self-hosting, hackathon demos, and evaluation.

---

## 🚀 One-Command Launch

From the repository root directory:

```bash
docker compose up --build -d
```

To view live logs across all containers:
```bash
docker compose logs -f
```

---

## 🌐 Deployed Service Endpoints

Once launched, the following services are available locally:

| Service | Local URL | Description |
|---|---|---|
| **Frontend Web Portal** | [http://localhost:3000](http://localhost:3000) | Full Next.js 14 Web3 application |
| **Backend REST API (Swagger)** | [http://localhost:8000/docs](http://localhost:8000/docs) | Interactive FastAPI documentation |
| **API Health Probe** | [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health) | Real-time DB, EVM RPC, & ML connectivity status |
| **ML Forensics Microservice** | [http://localhost:8001/health](http://localhost:8001/health) | Standalone tamper & risk scoring engine |
| **Local EVM Blockchain Node** | `http://localhost:8545` | Foundry Anvil local EVM chain (ID: 31337) |
| **PostgreSQL Database** | `localhost:5432` | Relational audit store (user: `proofroute`, db: `proofroute`) |

---

## 📦 Container Architecture

```
                                  [ Browser / Evaluator ]
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       │ :3000                                     │ :8000
                       ▼                                           ▼
          ┌─────────────────────────┐                 ┌─────────────────────────┐
          │   proofroute-frontend   │──[REST API]────▶│   proofroute-backend    │
          │     (Next.js 14)        │                 │     (FastAPI 0.110)     │
          └────────────┬────────────┘                 └────────────┬────────────┘
                       │                                           │
          [Web3 RPC]   │                               ┌───────────┼───────────┐
          :8545        ▼                               ▼           ▼           ▼
          ┌─────────────────────────┐                 ┌─────┐   ┌─────┐   ┌─────────┐
          │     proofroute-anvil    │◀──[Deploy]──────│Post-│   │ ML  │   │ Uploads │
          │  (Foundry Local Node)   │   (deployer)    │gres │   │:8001│   │ Volume  │
          └─────────────────────────┘                 └─────┘   └─────┘   └─────────┘
```

---

## 🛠️ Operational Commands

### 1. Check Container Health
```bash
docker compose ps
```

### 2. Stop Containers
```bash
docker compose down
```

### 3. Reset Database & Volumes (Fresh Start)
```bash
docker compose down -v
```

### 4. Rebuild a Single Service (e.g. Backend)
```bash
docker compose up -d --build backend
```
