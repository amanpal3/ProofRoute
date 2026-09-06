"""
ProofRoute Standalone Blockchain Event Indexer CLI

Backfills and syncs on-chain events from ProofRouteRegistry into the database.
Usage:
    python scripts/sync_indexer.py [--blocks N]
"""

import sys
import asyncio
from pathlib import Path

# Add backend directory to sys.path
REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "backend"))

from app.services.event_listener import BlockchainEventListener
from app.db.session import init_db
from app.core.config import settings


async def main():
    print(f"=== ProofRoute Blockchain Indexer CLI ===")
    print(f"RPC URL: {settings.RPC_URL}")
    print(f"Contract: {settings.CONTRACT_REGISTRY_ADDRESS}")
    print(f"Database: {settings.DATABASE_URL}")

    await init_db()
    listener = BlockchainEventListener()

    print("Checking blockchain connection...")
    if not listener.w3.is_connected():
        print("ERROR: Cannot connect to EVM RPC node. Is Anvil or testnet running?")
        sys.exit(1)

    latest = listener.w3.eth.block_number
    print(f"Connected to EVM node! Current block height: {latest}")

    # Set start block to 0 for local backfill
    listener.last_block = 0
    print(f"Syncing events from block 0 to {latest}...")
    count = await listener.poll_once()
    print(f"Sync complete! Successfully indexed {count} events into database.")


if __name__ == "__main__":
    asyncio.run(main())
