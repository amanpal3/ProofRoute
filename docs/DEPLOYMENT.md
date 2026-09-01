# Deployment & Infrastructure Guide

## 🌐 Target Environments
- **Local / Development**: Docker Compose (Postgres, Redis, Anvil Node, API, Frontend).
- **Staging / Testnet**: Sepolia / Polygon Amoy, Cloud Run / Kubernetes.
- **Production / Mainnet**: Ethereum Mainnet / Arbitrum / Base, AWS / GCP.

---

## 🚢 CI/CD Pipeline
- **GitHub Actions**:
  - `lint-and-test.yml`: Runs linter, unit tests, and Foundry tests on every PR.
  - `contract-deploy.yml`: Deploys verified contracts to target testnet on tag release.
  - `build-and-deploy.yml`: Builds Docker images and deploys backend/frontend services.
