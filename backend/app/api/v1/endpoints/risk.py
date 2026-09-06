"""
ML / Risk Engine API endpoint — exposes risk scoring directly per API contract.

Endpoint: POST /api/v1/ml/risk-score
"""

from fastapi import APIRouter, File, UploadFile, Form
from pydantic import BaseModel, Field
from app.schemas.verification import RiskAssessment
from app.services.risk_service import RiskService
from app.services.hashing_service import HashingService

router = APIRouter(prefix="/ml", tags=["ML Risk Engine"])


class RiskScoreRequest(BaseModel):
    document_hash: str = Field(..., description="0x-prefixed SHA-256 document hash")
    is_authentic_on_chain: bool = Field(
        default=True, description="Whether the hash matched the on-chain record"
    )
    file_size: int | None = Field(default=None, description="File size in bytes")
    mime_type: str | None = Field(default=None, description="MIME type of the document")
    product_status: str | None = Field(default=None, description="Current product status")


@router.post("/risk-score", response_model=RiskAssessment)
async def compute_risk_score(req: RiskScoreRequest):
    """
    Runs ML model inference (or heuristic fallback) directly on document features.
    """
    return await RiskService.evaluate_risk(
        document_hash=req.document_hash,
        is_authentic_on_chain=req.is_authentic_on_chain,
        file_size=req.file_size,
        mime_type=req.mime_type,
        product_status=req.product_status,
    )


@router.post("/scan", response_model=RiskAssessment)
async def scan_document_ml(
    file: UploadFile = File(...),
    is_authentic_on_chain: bool = Form(default=True),
    ocr_text: str | None = Form(default=None),
):
    """
    Upload a document file to execute direct ML forensics (ELA, CMFD, OCR, and risk scoring).
    """
    content = await file.read()
    from ml.src.pipeline import analyze_document
    from ml.src.integration import to_backend_response

    result = analyze_document(
        content,
        ocr_text=ocr_text,
        is_authentic_on_chain=is_authentic_on_chain,
        file_size=len(content),
        mime_type=file.content_type,
    )
    return RiskAssessment(**to_backend_response(result))

