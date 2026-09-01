---
name: indexer
description: Standards for blockchain event listening, block reorg handling, and database syncing.
---

# Indexer Skill Guide

## 📌 Rules
- Handle blockchain reorganizations by tracking confirmations.
- Ensure event ingestion is idempotent (processing the same event twice causes no state divergence).
