# Contributing to ProofRoute

Thank you for contributing to ProofRoute! Please follow these guidelines to keep our codebase clean, robust, and well-tested.

---

## 👥 Team Ownership & Roles

| Team Member | Domain | Key Responsibilities | Directory |
|---|---|---|---|
| **Member 1 (You)** | **Backend & API** | FastAPI REST endpoints, PostgreSQL persistence, Alembic migrations, event indexer, document SHA-256 hashing, AI risk service. | [`backend/`](backend/) |
| **Member 2** | **Frontend** | Next.js 14+ UI, Tailwind CSS, Wagmi 2.x wallet UX, Manufacturer/Logistics dashboards, public QR verification page. | [`frontend/`](frontend/) |
| **Member 3** | **Blockchain** | `ProofRouteRegistry.sol`, Foundry tests & fuzzing, status transitions, SHA-256 hash anchoring, Anvil & testnet deployment. | [`blockchain/`](blockchain/) / [`contracts/`](contracts/) |

---

## 🌿 Git Branching & Merge Strategy

All three team members work in parallel off the shared `develop` branch:

```text
                  develop
               /   |   \
              /    |    \
      frontend  backend  blockchain  (Feature branches)
          \       |       /
           \      |      /
              Pull Requests
                    ↓
                 develop
                    ↓
                  main (Release)
```

### Branch Conventions:
- `main`: Stable, tagged, production-ready releases.
- `develop`: Integration branch where all tested domain branches merge via PR.
- `feature/backend-<name>`: Backend feature branches (Member 1).
- `feature/frontend-<name>`: Frontend feature branches (Member 2).
- `feature/blockchain-<name>`: Smart contract & deployment branches (Member 3).
- `fix/<domain>-<name>`: Bug fixes.

---

## 📝 Commit Convention
We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat(backend): add product registration and history API`
- `feat(frontend): create mobile-friendly QR verification view`
- `feat(blockchain): implement ProofRouteRegistry with custom errors`
- `fix(indexer): resolve idempotent log deduplication`
- `test(backend): add SHA-256 document hashing test cases`
- `docs(api): sync API contract with updated endpoint schemas`

---

## 🧪 Quality Gates Before Opening PR to `develop`
1. **Domain Lint & Format**: Linters, formatters (`forge fmt`, `ruff`, `prettier`) pass.
2. **Domain Tests Pass**:
   - Backend: `pytest` passes with 0 failures.
   - Frontend: `npm test` and `npm run build` pass.
   - Blockchain: `forge test` and fuzz tests pass.
3. **Contract Alignment**: No breaking changes made to [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md) or [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) without cross-member approval.
4. **Zero Secrets**: No private keys or `.env` credentials committed.
