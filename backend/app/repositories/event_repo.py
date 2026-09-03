from typing import Optional, Any, Dict, List
from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.blockchain_event import BlockchainRecord
from app.models.verification import Verification


class EventRepository:
    @staticmethod
    async def is_event_processed(
        session: AsyncSession, tx_hash: str, log_index: int
    ) -> bool:
        stmt = select(BlockchainRecord).where(
            BlockchainRecord.tx_hash == tx_hash,
            BlockchainRecord.log_index == log_index,
        )
        result = await session.execute(stmt)
        return result.scalar_one_or_none() is not None

    @staticmethod
    async def record_event(
        session: AsyncSession,
        tx_hash: str,
        log_index: int,
        block_number: int,
        contract_address: str,
        event_name: str,
        raw_data: Dict[str, Any],
        product_id: Optional[str] = None,
        document_hash: Optional[str] = None,
        actor_address: Optional[str] = None,
        block_timestamp: Optional[datetime] = None,
    ) -> Optional[BlockchainRecord]:
        # Idempotency check: return existing if already recorded
        if await EventRepository.is_event_processed(session, tx_hash, log_index):
            return None

        event_rec = BlockchainRecord(
            tx_hash=tx_hash,
            log_index=log_index,
            block_number=block_number,
            contract_address=contract_address,
            event_name=event_name,
            product_id=product_id,
            document_hash=document_hash,
            actor_address=actor_address,
            raw_data=raw_data,
            block_timestamp=block_timestamp or datetime.now(timezone.utc),
        )
        session.add(event_rec)
        await session.commit()
        await session.refresh(event_rec)
        return event_rec

    @staticmethod
    async def save_verification(
        session: AsyncSession,
        document_hash: str,
        status: str,
        is_authentic: bool,
        risk_score: float,
        risk_level: str,
        tampering_detected: bool,
        confidence: float,
        reasons: List[str],
        product_id: Optional[str] = None,
        checked_by_ip: Optional[str] = None,
    ) -> Verification:
        verification = Verification(
            product_id=product_id,
            document_hash=document_hash,
            status=status,
            is_authentic=is_authentic,
            risk_score=risk_score,
            risk_level=risk_level,
            tampering_detected=tampering_detected,
            confidence=confidence,
            reasons=reasons,
            checked_by_ip=checked_by_ip,
        )
        session.add(verification)
        await session.commit()
        await session.refresh(verification)
        return verification
