import uuid
from typing import Optional, Any, Dict
from datetime import datetime, timezone
from sqlalchemy import String, Integer, DateTime, JSON, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class BlockchainRecord(Base):
    __tablename__ = "blockchain_records"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    tx_hash: Mapped[str] = mapped_column(String(66), nullable=False, index=True)
    log_index: Mapped[int] = mapped_column(Integer, nullable=False)
    block_number: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    contract_address: Mapped[str] = mapped_column(String(42), nullable=False)
    event_name: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    
    product_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, index=True)
    document_hash: Mapped[Optional[str]] = mapped_column(String(66), nullable=True, index=True)
    actor_address: Mapped[Optional[str]] = mapped_column(String(42), nullable=True)
    
    raw_data: Mapped[Dict[str, Any]] = mapped_column(JSON, nullable=False, default=dict)

    block_timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )
    processed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Composite uniqueness constraint guaranteeing event idempotency
    __table_args__ = (
        UniqueConstraint("tx_hash", "log_index", name="uq_blockchain_tx_log"),
    )
