# Security Policy & Audit Guidelines

## 🛡️ Core Security Principles
- **No PII on Chain**: Only cryptographic hashes (SHA-256 / Keccak-256) and zero-knowledge proofs are stored on public blockchains.
- **Smart Contract Audits**: Reentrancy protection, overflow checks, strict access control (`AccessControlUpgradeable`).
- **Data Encryption**: All documents in transit (TLS 1.3) and at rest (AES-256) are encrypted.
- **Rate Limiting**: Defend API endpoints against DoS with Redis token-bucket rate limiters.

## 🚨 Reporting a Vulnerability
Please report security vulnerabilities to `security@proofroute.io`. Do not open public issues for zero-day vulnerabilities.
