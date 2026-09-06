from typing import Optional, List
# pyrefly: ignore [missing-import]
from pydantic import BaseModel, Field


class OnChainStatus(BaseModel):
    registered: bool = False
    issuer: Optional[str] = None
    block_number: Optional[int] = None
    timestamp: Optional[int] = None


class RiskAssessment(BaseModel):
    risk_score: float = Field(..., ge=0.0, le=100.0, description="Risk score from 0 (safest) to 100 (highest risk)")
    risk_level: str = Field(..., description="Risk category: LOW | MEDIUM | HIGH")
    tampering_detected: bool = Field(default=False, description="Flag indicating potential document modification")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Model or heuristic confidence level")
    reasons: List[str] = Field(default_factory=list, description="Specific explainable factor codes")
    model_version: str = "v0.1.0-rules"
    disclaimer: str = "Decision support only. Does not constitute absolute legal proof of authenticity or fraud."
    ela_score: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    cmfd_score: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    font_anomaly_detected: bool = False


class DocumentVerifyResponse(BaseModel):
    status: str = Field(..., description="VALID | TAMPERED | NOT_REGISTERED | UNAVAILABLE")
    document_hash: str = Field(..., description="0x-prefixed SHA-256 hash evaluated")
    is_authentic: bool = Field(..., description="True if hash matches the immutable on-chain record")
    product_id: Optional[str] = None
    on_chain_status: OnChainStatus
    risk_assessment: RiskAssessment


class QRResponse(BaseModel):
    product_id: str
    verification_url: str
    qr_base64: str
