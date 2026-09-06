from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class DocumentUploadResponse(BaseModel):
    document_hash: str = Field(..., description="0x-prefixed SHA-256 hash computed on raw file bytes")
    file_name: str
    file_size: int
    mime_type: str
    product_id: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DocumentAnchorRequest(BaseModel):
    product_id: str
    document_hash: str = Field(..., pattern=r"^0x[a-fA-F0-9]{64}$")
    tx_hash: str = Field(..., pattern=r"^0x[a-fA-F0-9]{64}$")
    issuer_address: str = Field(..., pattern=r"^0x[a-fA-F0-9]{40}$")


class DocumentAnchorResponse(BaseModel):
    success: bool
    product_id: str
    document_hash: str
    tx_hash: str
    message: str
