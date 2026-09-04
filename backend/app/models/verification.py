import uuid
from typing import Optional, List, Any
from datetime import datetime, timezone
from sqlalchemy import String, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Verification(Base):
    __tablename__ = "verifications"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    product_id: Mapped[Optional[str]] = mapped_column(
        String(64), ForeignKey("products.product_id", ondelete="SET NULL"), nullable=True, index=True
    )
    document_hash: Mapped[str] = mapped_column(String(66), nullable=False, index=True)
    
    # Status: VALID | TAMPERED | NOT_REGISTERED | UNAVAILABLE
    status: Mapped[str] = mapped_column(String(32), nullable=False)
    is_authentic: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    
    # AI / Risk analysis metrics
    risk_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    risk_level: Mapped[str] = mapped_column(String(16), default="LOW", nullable=False)
    tampering_detected: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    confidence: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)
    reasons: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)

    checked_by_ip: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    
    verified_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    product: Mapped[Optional["Product"]] = relationship("Product", back_populates="verifications")
