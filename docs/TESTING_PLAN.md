# Testing Plan & Strategy

## 🧪 Testing Pyramid

1. **Unit Tests**:
   - Contracts: 100% branch coverage with Foundry (`forge test`).
   - Backend: Pytest / Jest covering services, utils, and validators.
   - ML: Unit tests on preprocessing, feature extractors, and scoring thresholds.
2. **Integration Tests**:
   - API endpoints against a test PostgreSQL instance.
   - Indexer syncing events from local Anvil / Hardhat node.
3. **End-to-End (E2E) Tests**:
   - Playwright tests simulating complete user journeys (Upload -> Anchor -> Verify).
4. **Security & Fuzzing**:
   - Invariant testing for smart contracts.
   - OWASP API security checks.
