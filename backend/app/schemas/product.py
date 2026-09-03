from typing import Optional, List
from datetime import datetime
import enum
from pydantic import BaseModel, ConfigDict, Field


class StatusEnum(str, enum.Enum):
    CREATED = "CREATED"
    IN_TRANSIT = "IN_TRANSIT"
    DELIVERED = "DELIVERED"


class ProductBase(BaseModel):
    product_id: str = Field(..., min_length=2, max_length=64, description="Unique alphanumeric product ID")
    name: str = Field(..., min_length=1, max_length=255, description="Product commercial name")
    batch_id: str = Field(..., min_length=1, max_length=128, description="Production batch number")
    manufacturer_address: str = Field(..., pattern=r"^0x[a-fA-F0-9]{40}$", description="EVM wallet address of manufacturer")
    origin: str = Field(..., min_length=1, max_length=255, description="Manufacturing facility or origin country")
    destination: str = Field(..., min_length=1, max_length=255, description="Intended destination facility or country")


class ProductCreate(ProductBase):
    pass


class ShipmentStatusUpdate(BaseModel):
    status: StatusEnum = Field(..., description="Target status: CREATED, IN_TRANSIT, DELIVERED")
    actor_address: str = Field(..., pattern=r"^0x[a-fA-F0-9]{40}$", description="Authorized actor wallet address")
    location: Optional[str] = Field(default=None, max_length=255, description="Checkpoint location")
    notes: Optional[str] = Field(default=None, max_length=500, description="Audit or customs notes")
    tx_hash: Optional[str] = Field(default=None, description="Optional on-chain tx hash")


class ShipmentEventResponse(BaseModel):
    id: str
    product_id: str
    status: StatusEnum
    actor_address: str
    location: Optional[str] = None
    notes: Optional[str] = None
    tx_hash: Optional[str] = None
    block_number: Optional[int] = None
    event_timestamp: datetime

    model_config = ConfigDict(from_attributes=True)


class ProductResponse(ProductBase):
    current_status: StatusEnum
    document_hash: Optional[str] = None
    is_anchored: bool = False
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProductHistoryResponse(BaseModel):
    product: ProductResponse
    events: List[ShipmentEventResponse]
