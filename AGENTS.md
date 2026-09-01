# ProofRoute Agent Orchestration Guide

This document defines how autonomous agents, developers, and tools collaborate across the ProofRoute codebase.

---

## 🎯 Core Principles

1. **Spec-First Engineering**: Never implement code without an approved spec or task definition in `docs/` or `.gsd/`.
2. **Domain Isolation**: Agents operate strictly within their designated skill domains (frontend, backend, blockchain, ml, etc.).
3. **Empirical Verification**: All implementations must provide passing test output or execution proof before completion.
4. **Clean Git Hygiene**: Atomic commits following Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`).

---

## 👥 Agent Roles & Skill Mapping

| Agent Role | Domain Directory | Skill Reference | Focus Areas |
|---|---|---|---|
| **Architect / Orchestrator** | Root / `docs/` | [`.agents/AGENTS.md`](.agents/AGENTS.md) | System design, cross-domain coordination |
| **Blockchain Engineer** | `contracts/` | [`.agents/skills/blockchain/SKILL.md`](.agents/skills/blockchain/SKILL.md) | Smart contracts, gas optimization, security |
| **Backend Engineer** | `backend/` | [`.agents/skills/backend/SKILL.md`](.agents/skills/backend/SKILL.md) | APIs, business logic, auth, service integration |
| **Database Engineer** | `backend/`, `docs/` | [`.agents/skills/database/SKILL.md`](.agents/skills/database/SKILL.md) | Schema design, migrations, indexing, query perf |
| **Frontend Engineer** | `frontend/` | [`.agents/skills/frontend/SKILL.md`](.agents/skills/frontend/SKILL.md) | UI components, state management, web3 wallet UX |
| **ML / Verification Specialist** | `ml/` | [`.agents/skills/document-verification/SKILL.md`](.agents/skills/document-verification/SKILL.md) | OCR, tampering detection, authenticity scoring |
| **Risk Analyst** | `ml/`, `backend/` | [`.agents/skills/risk-analysis/SKILL.md`](.agents/skills/risk-analysis/SKILL.md) | Fraud scoring, risk rule engines, anomaly detection |
| **Indexer Engineer** | `backend/`, `scripts/` | [`.agents/skills/indexer/SKILL.md`](.agents/skills/indexer/SKILL.md) | Blockchain event listeners, subgraphs, data sync |
| **QA / Test Engineer** | `tests/` | [`.agents/skills/testing/SKILL.md`](.agents/skills/testing/SKILL.md) | Unit, integration, E2E, fuzz & invariant tests |

---

## 🔄 Standard Workflows

- [Feature Development Workflow](.agents/workflows/feature-development.md)
- [Bug Fix Workflow](.agents/workflows/bug-fix.md)
- [API Change Workflow](.agents/workflows/api-change.md)
- [Testing & Quality Gate Workflow](.agents/workflows/testing.md)
- [Release Workflow](.agents/workflows/release.md)
