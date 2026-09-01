# ⚙️ ProofRoute Automation & DevOps Scripts

A collection of utility and automation scripts for database management, local blockchain setup, testing, and deployment.

---

## 📜 Script Inventory

| Script | Purpose |
|---|---|
| `deploy-local.sh` / `.ps1` | Spawns local Anvil chain, deploys contracts, and syncs addresses to `.env`. |
| `seed-database.py` | Seeds development PostgreSQL database with mock issuers and document records. |
| `generate-mock-docs.py` | Generates sample authentic and tampered PDFs for testing ML pipelines. |
| `sync-indexer.py` | Standalone script to backfill blockchain events from genesis block. |
