"""
ProofRoute Blockchain Event Listener Worker

Continuously polls the EVM blockchain node for ProofRouteRegistry contract
events (ProductRegistered, StatusUpdated, DocumentHashAttached) and idempotently
syncs them into the PostgreSQL / SQLite database via IndexerService.
"""

import asyncio
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from web3 import Web3
from web3.contract import Contract

from app.core.config import settings
from app.core.logging import logger
from app.db.session import AsyncSessionLocal
from app.services.indexer_service import IndexerService

# Events ABI for ProofRouteRegistry
REGISTRY_EVENTS_ABI = [
    {
        "type": "event",
        "name": "ProductRegistered",
        "inputs": [
            {"name": "productId", "type": "string", "indexed": True},
            {"name": "batchId", "type": "string", "indexed": False},
            {"name": "manufacturer", "type": "address", "indexed": True},
            {"name": "origin", "type": "string", "indexed": False},
            {"name": "destination", "type": "string", "indexed": False},
            {"name": "timestamp", "type": "uint256", "indexed": False},
        ],
        "anonymous": False,
    },
    {
        "type": "event",
        "name": "StatusUpdated",
        "inputs": [
            {"name": "productId", "type": "string", "indexed": True},
            {"name": "oldStatus", "type": "uint8", "indexed": False},
            {"name": "newStatus", "type": "uint8", "indexed": False},
            {"name": "actor", "type": "address", "indexed": True},
            {"name": "timestamp", "type": "uint256", "indexed": False},
        ],
        "anonymous": False,
    },
    {
        "type": "event",
        "name": "DocumentHashAttached",
        "inputs": [
            {"name": "productId", "type": "string", "indexed": True},
            {"name": "documentHash", "type": "bytes32", "indexed": True},
            {"name": "actor", "type": "address", "indexed": True},
            {"name": "timestamp", "type": "uint256", "indexed": False},
        ],
        "anonymous": False,
    },
]


class BlockchainEventListener:
    def __init__(self, poll_interval: float = 3.0):
        self.w3 = Web3(Web3.HTTPProvider(settings.RPC_URL))
        self.poll_interval = poll_interval
        self.running = False
        self.last_block: Optional[int] = None
        self._task: Optional[asyncio.Task] = None

    def _get_contract(self) -> Optional[Contract]:
        addr = settings.CONTRACT_REGISTRY_ADDRESS
        if not Web3.is_address(addr) or addr == "0x0000000000000000000000000000000000000000":
            return None
        return self.w3.eth.contract(
            address=Web3.to_checksum_address(addr),
            abi=REGISTRY_EVENTS_ABI,
        )

    async def poll_once(self) -> int:
        """Polls for new events from last_block to current_block. Returns count of indexed events."""
        if not self.w3.is_connected():
            logger.debug("Blockchain RPC not connected; skipping indexer cycle.")
            return 0

        contract = self._get_contract()
        if not contract:
            return 0

        try:
            current_block = self.w3.eth.block_number
        except Exception as e:
            logger.warning(f"Failed to fetch current block number: {e}")
            return 0

        if self.last_block is None:
            # Lookback up to 100 blocks on first start or 0 on fresh local Anvil
            self.last_block = max(0, current_block - 100)

        if self.last_block > current_block:
            return 0

        from_block = self.last_block + 1
        to_block = current_block

        if from_block > to_block:
            return 0

        events_processed = 0

        # Event definitions to listen for
        event_classes = [
            contract.events.ProductRegistered,
            contract.events.StatusUpdated,
            contract.events.DocumentHashAttached,
        ]

        for ev_class in event_classes:
            try:
                logs = ev_class.get_logs(fromBlock=from_block, toBlock=to_block)
                for log in logs:
                    tx_hash = log["transactionHash"].hex()
                    if not tx_hash.startswith("0x"):
                        tx_hash = f"0x{tx_hash}"
                    log_idx = log["logIndex"]
                    blk_num = log["blockNumber"]
                    ev_name = log["event"]
                    raw_args = dict(log["args"])

                    # Normalize bytes to hex string for hashes
                    for k, v in raw_args.items():
                        if isinstance(v, bytes):
                            raw_args[k] = f"0x{v.hex()}"

                    # Block timestamp
                    block_data = self.w3.eth.get_block(blk_num)
                    block_dt = datetime.fromtimestamp(block_data["timestamp"], tz=timezone.utc)

                    async with AsyncSessionLocal() as session:
                        indexed = await IndexerService.process_event(
                            session=session,
                            event_name=ev_name,
                            tx_hash=tx_hash,
                            log_index=log_idx,
                            block_number=blk_num,
                            contract_address=contract.address,
                            event_args=raw_args,
                            block_timestamp=block_dt,
                        )
                        if indexed:
                            events_processed += 1
            except Exception as ev_err:
                logger.warning(f"Error reading {ev_class.event_name} logs [{from_block}..{to_block}]: {ev_err}")

        self.last_block = to_block
        if events_processed > 0:
            logger.info(f"Indexed {events_processed} blockchain events up to block {to_block}")
        return events_processed

    async def _run_loop(self):
        logger.info(f"Blockchain event indexer worker started (RPC: {settings.RPC_URL}, Contract: {settings.CONTRACT_REGISTRY_ADDRESS})")
        self.running = True
        while self.running:
            try:
                await self.poll_once()
            except Exception as e:
                logger.error(f"Unexpected error in event listener poll loop: {e}", exc_info=True)
            await asyncio.sleep(self.poll_interval)

    def start(self) -> asyncio.Task:
        if self._task is None or self._task.done():
            self.running = True
            self._task = asyncio.create_task(self._run_loop())
        return self._task

    async def stop(self):
        self.running = False
        if self._task and not self._task.done():
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
        logger.info("Blockchain event indexer worker stopped.")


# Singleton instance
event_listener = BlockchainEventListener()


async def run_standalone():
    """CLI / daemon entrypoint for dedicated indexer process."""
    listener = BlockchainEventListener(poll_interval=2.0)
    listener.start()
    try:
        while True:
            await asyncio.sleep(1)
    except (KeyboardInterrupt, asyncio.CancelledError):
        await listener.stop()


if __name__ == "__main__":
    asyncio.run(run_standalone())
