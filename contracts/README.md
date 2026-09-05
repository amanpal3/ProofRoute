# ⛓️ ProofRoute Smart Contracts

Decentralized immutable product provenance registry, milestone tracking state machine, and cryptographic document hash anchoring for the ProofRoute platform.

---

## 🏗️ Architecture & Contracts

### [`ProofRouteRegistry.sol`](src/ProofRouteRegistry.sol)
* **Product Batch Registration**: Records unique `productId`, `name`, `batchId`, `origin`, `destination`, and `manufacturer` address.
* **Shipment Lifecycle Machine**: Enforces strictly unidirectional milestone progression (`CREATED` ➔ `IN_TRANSIT` ➔ `DELIVERED`).
* **Cryptographic Document Anchoring**: Anchors 32-byte (`bytes32`) SHA-256 certificate hashes. Immutable once attached by the product manufacturer.
* **Access Control**:
  * `Manufacturer`: Registers products and commits document hashes.
  * `Logistics Operator`: Authorized EVM address permitted to progress milestone status.
  * `Owner / Admin`: Manages operator authorizations and emergency administrative controls via OpenZeppelin `Ownable`.
* **Public Verification**: Gas-free `verifyDocumentHash(productId, hashToVerify)` view function enabling wallet-less consumer verification.
* **Event Logging**: Emits indexed `ProductRegistered`, `StatusUpdated`, `DocumentHashAttached`, and `LogisticsOperatorUpdated` events for the FastAPI indexer.

---

## 🛠️ Tooling & Standards

* **Language**: Solidity `^0.8.20`
* **Framework**: [Foundry](https://book.getfoundry.sh/) (`forge`, `cast`, `anvil`)
* **Libraries**: OpenZeppelin Contracts v5.x
* **Gas Optimizations**: Custom errors instead of string reverts, storage caching, packed types.

---

## 🚀 Quick Start

### 1. Build Contracts
```bash
forge build
```

### 2. Run Test Suite
```bash
# Run unit & fuzz tests with verbose traces
forge test -vvv

# Run with gas consumption breakdown
forge test --gas-report

# Run property-based fuzz tests with 1,000 iterations
forge test --fuzz-runs 1000
```

### 3. Format Code
```bash
forge fmt
```

### 4. Local Anvil Deployment
```bash
# Terminal 1: Start local Anvil node (Chain ID: 31337)
anvil

# Terminal 2: Deploy ProofRouteRegistry to local Anvil
forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast
```

### 5. Export ABI to Frontend
```bash
python ../scripts/export_abi.py
```
Outputs the TypeScript ABI to `frontend/src/lib/contracts.ts`.

---

## 🛡️ Security & Quality Gates
* **CEI Pattern**: Checks-Effects-Interactions pattern strictly applied across all mutating functions.
* **Custom Errors**: Reverts with gas-efficient typed custom errors (`ProductAlreadyExists`, `InvalidStatusTransition`, etc.).
* **Zero-Exposure Policy**: All deployment private keys are loaded via environment variables (`DEPLOYER_PRIVATE_KEY`).
