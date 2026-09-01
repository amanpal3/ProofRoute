# ⛓️ ProofRoute Smart Contracts

Smart contract suite for decentralized document hash anchoring, cryptographic provenance, and role-based access management.

---

## 🏗️ Architecture & Contracts

- **`DocumentRegistry.sol`**:
  - Anchors unique document hashes (Keccak-256).
  - Records issuer address, block timestamp, metadata URI, and revocation status.
  - Emits `DocumentRegistered` and `DocumentRevoked` events for indexers.
- **`AccessManager.sol`**:
  - Role-Based Access Control (RBAC) powered by OpenZeppelin `AccessControlUpgradeable`.
  - Roles: `ADMIN_ROLE`, `ISSUER_ROLE`, `AUDITOR_ROLE`, `ORACLE_ROLE`.

---

## 🛠️ Tooling & Standards

- **Language**: Solidity `^0.8.20`
- **Framework**: [Foundry](https://book.getfoundry.sh/) (`forge`, `cast`, `anvil`)
- **Dependencies**: OpenZeppelin Contracts

---

## 🚀 Quick Start

### 1. Build Contracts
```bash
forge build
```

### 2. Run Test Suite
```bash
# Run all unit tests
forge test

# Run tests with verbose gas reports
forge test --gas-report

# Run invariant and fuzz tests with high runs
forge test --fuzz-runs 10000
```

### 3. Local Anvil Deployment
```bash
# Start local node
anvil

# Deploy DocumentRegistry to local Anvil
forge script script/DeployRegistry.s.sol:DeployRegistry --rpc-url http://127.0.0.1:8545 --broadcast
```

---

## 🛡️ Security & Audits
- CEI (Checks-Effects-Interactions) pattern enforced across all state transitions.
- Static analysis with Slither:
  ```bash
  slither .
  ```
- Fuzzing and invariant invariants testing in `test/invariants/`.
