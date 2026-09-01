---
name: blockchain
description: Standards and instructions for developing and testing ProofRoute smart contracts.
---

# Blockchain Skill Guide

## 🛠️ Tech Stack & Standards
- Language: Solidity (>= 0.8.20)
- Tooling: Foundry (`forge`, `cast`, `anvil`)
- Libraries: OpenZeppelin Contracts

## 📌 Rules
- Follow CEI (Checks-Effects-Interactions) pattern.
- Always include comprehensive fuzz tests and invariant checks.
- Optimize gas usage by caching storage variables and minimizing state writes.
