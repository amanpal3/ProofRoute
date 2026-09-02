# ⛓️ ProofRoute Blockchain & Smart Contract Layer

Decentralized immutable product provenance, shipment milestone state machine, and cryptographic document hash anchoring for ProofRoute.

---

## 🏗️ Architecture & Core Contract

### `ProofRouteRegistry.sol`
- **Product Registration**: Immutably records unique `productId`, `name`, `batchId`, `origin`, `destination`, and `manufacturer` address.
- **Shipment Lifecycle State Machine**: Enforces valid milestone state transitions (`CREATED` ➔ `IN_TRANSIT` ➔ `DELIVERED`).
- **Cryptographic Document Anchoring**: Anchors 32-byte (`bytes32`) SHA-256 hashes of off-chain certificates.
- **Role-Based Access Control**:
  - `Manufacturer`: Registers product batches and attaches document hashes.
  - `Logistics Operator`: Authorized to update shipment milestone statuses.
  - `Owner / Admin`: Manages logistics operator authorizations and emergency controls.
- **Event Emission**: Emits `ProductRegistered`, `StatusUpdated`, and `DocumentHashAttached` logs for off-chain indexer consumption.

---

## 🛠️ Tooling & Standards

- **Language**: Solidity `^0.8.24` (or `>=0.8.20`)
- **Framework**: [Foundry](https://getfoundry.sh/) (`forge` for build/test, `anvil` for local EVM, `cast` for RPC interaction)
- **Standard Libraries**: OpenZeppelin Contracts 5.x
- **Gas Optimization**: Custom errors (`error InvalidStatusTransition()`), storage caching, packing structs.

---

## 📂 Directory Structure

```text
blockchain/
├── src/
│   └── ProofRouteRegistry.sol       # Core product provenance registry
├── test/
│   └── ProofRouteRegistry.t.sol     # Unit, fuzz, and invariant tests
├── script/
│   └── Deploy.s.sol                 # Deployment automation script
├── foundry.toml                     # Foundry compiler & profile config
├── blockchainskill.md               # Senior Blockchain Engineering skill guide
└── README.md                        # Documentation overview
```

---

## 🚀 Quick Start

### 1. Build Contracts
```bash
forge build
```

### 2. Run Test Suite
```bash
# Run unit and fuzz tests with verbose traces
forge test -vvv

# Run with gas report
forge test --gas-report

# Run fuzz tests with extended iterations
forge test --fuzz-runs 1000
```

### 3. Run Static Security Analysis
```bash
slither .
```

### 4. Deploy Locally (Anvil)
```bash
# Terminal 1: Start local EVM chain
anvil

# Terminal 2: Deploy contract
forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast
```

### 5. Deploy to EVM Testnet (e.g. Sepolia / Polygon Amoy)
```bash
forge script script/Deploy.s.sol \
  --rpc-url $TESTNET_RPC_URL \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --broadcast \
  --verify
```

---

## 🛡️ Security & Quality Gates
- Follows the **Checks-Effects-Interactions (CEI)** pattern.
- Uses **Custom Errors** instead of costly string reverts to save deployment and execution gas.
- Zero private keys committed; all deployment keys are loaded via environment variables (`.env`).
