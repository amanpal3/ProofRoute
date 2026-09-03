from typing import Dict, Any, Optional
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.event_repo import EventRepository
from app.repositories.product_repo import ProductRepository
from app.models.product import ShipmentEvent, ProductStatus
from app.core.logging import logger


class IndexerService:
    @staticmethod
    async def process_event(
        session: AsyncSession,
        event_name: str,
        tx_hash: str,
        log_index: int,
        block_number: int,
        contract_address: str,
        event_args: Dict[str, Any],
        block_timestamp: Optional[datetime] = None,
    ) -> bool:
        """
        Idempotently processes a raw blockchain event and updates the PostgreSQL projection.
        Returns True if newly processed, False if safely skipped as duplicate.
        """
        # 1. Check idempotency
        if await EventRepository.is_event_processed(session, tx_hash, log_index):
            logger.info(f"Event {event_name} at {tx_hash}:{log_index} already indexed. Safely skipping.")
            return False

        product_id = event_args.get("productId")
        actor_address = event_args.get("actor") or event_args.get("manufacturer")
        doc_hash = event_args.get("documentHash")

        # 2. Record raw event with composite key (tx_hash, log_index)
        await EventRepository.record_event(
            session=session,
            tx_hash=tx_hash,
            log_index=log_index,
            block_number=block_number,
            contract_address=contract_address,
            event_name=event_name,
            raw_data=event_args,
            product_id=product_id,
            document_hash=doc_hash,
            actor_address=actor_address,
            block_timestamp=block_timestamp,
        )

        # 3. Update Domain Projections
        if product_id:
            product = await ProductRepository.get_by_id(session, product_id)
            if product:
                if event_name == "StatusUpdated":
                    new_status_num = event_args.get("newStatus")
                    # Map enum index to string if integer
                    status_map = {0: "CREATED", 1: "IN_TRANSIT", 2: "DELIVERED"}
                    status_str = status_map.get(new_status_num, str(new_status_num))
                    product.current_status = status_str
                    
                    event = ShipmentEvent(
                        product_id=product_id,
                        status=status_str,
                        actor_address=actor_address or "0x0000000000000000000000000000000000000000",
                        notes=f"Blockchain on-chain status update (tx: {tx_hash[:10]}...)",
                        tx_hash=tx_hash,
                        block_number=block_number,
                        event_timestamp=block_timestamp or datetime.now(timezone.utc),
                    )
                    session.add(event)
                    await session.commit()

                elif event_name == "DocumentHashAttached":
                    if doc_hash:
                        product.document_hash = doc_hash
                        product.is_anchored = True
                        await session.commit()

        logger.info(f"Successfully projected event {event_name} for product {product_id} (tx: {tx_hash})")
        return True
