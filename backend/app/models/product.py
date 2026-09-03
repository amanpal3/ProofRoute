import uuid
from typing import List, Optional
from datetime import datetime, timezone
import enum
from sqlalchemy import String, DateTime, ForeignKey, Index, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin


class ProductStatus(str, enum.Enum):
    CREATED = "CREATED"
    IN_TRANSIT = "IN_TRANSIT"
    DELIVERED = "DELIVERED"


class Product(Base, TimestampMixin):
    __tablename__ = "products"

    # Unique product identifier (e.g. PRD-89214 or custom string)
    product_id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    batch_id: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    manufacturer_address: Mapped[str] = mapped_column(String(42), nullable=False, index=True)
    origin: Mapped[str] = mapped_column(String(255), nullable=False)
    destination: Mapped[str] = mapped_column(String(255), nullable=False)
    
    current_status: Mapped[str] = mapped_column(
        String(32),
        default=ProductStatus.CREATED.value,
        nullable=False,
    )
    
    # Anchored 32-byte SHA-256 document hash (0x prefixed 64 hex chars)
    document_hash: Mapped[Optional[str]] = mapped_column(String(66), nullable=True, index=True)
    is_anchored: Mapped[bool] = mapped_column(default=False, nullable=False)

    # Relationships
    shipment_events: Mapped[List["ShipmentEvent"]] = relationship(
        "ShipmentEvent", back_populates="product", cascade="all, delete-orphan", order_by="ShipmentEvent.event_timestamp"
    )
    documents: Mapped[List["Document"]] = relationship(
        "Document", back_populates="product"
    )
    verifications: Mapped[List["Verification"]] = relationship(
        "Verification", back_populates="product"
    )


class ShipmentEvent(Base):
    __tablename__ = "shipment_events"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    product_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("products.product_id", ondelete="CASCADE"), nullable=False, index=True
    )
    status: Mapped[str] = mapped_column(String(32), nullable=False)
    actor_address: Mapped[str] = mapped_column(String(42), nullable=False)
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    tx_hash: Mapped[Optional[str]] = mapped_column(String(66), nullable=True)
    block_number: Mapped[Optional[int]] = mapped_column(nullable=True)
    
    event_timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )

    product: Mapped["Product"] = relationship("Product", back_populates="shipment_events")
