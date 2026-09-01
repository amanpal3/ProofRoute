# Architecture Decision Records (ADR)

## ADR-001: Monorepo Project Structure
- **Status**: Accepted
- **Context**: ProofRoute consists of smart contracts, ML models, backend services, and a frontend client.
- **Decision**: Use an organized modular structure (`contracts/`, `frontend/`, `backend/`, `ml/`) to ensure unified versioning, streamlined cross-domain testing, and agentic workflows.
- **Consequences**: Simplified CI/CD and cross-domain agent coordination.

## ADR-002: Foundry for Smart Contract Tooling
- **Status**: Accepted
- **Context**: Fast compilation, robust fuzzing, and native Solidity tests.
- **Decision**: Standardize on Foundry for smart contract development and testing.
