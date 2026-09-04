"""Document verification endpoints."""
from __future__ import annotations

import hashlib
from typing import Any

from fastapi import APIRouter, File, HTTPException, UploadFile

from src.pipeline import analyze_document

router = APIRouter(prefix="/documents", tags=["documents"])

MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024
ALLOWED_MIME_TYPES = {"image/png", "image/jpeg"}


@router.post("/verify")
async def verify_document(file: UploadFile = File(...)) -> dict[str, Any]:
    """Run cryptographic hashing and ML screening for an uploaded image."""
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=422,
            detail={
                "error_code": "VALIDATION_ERROR",
                "message": "Only PNG and JPEG document images are supported.",
            },
        )

    document_bytes = await file.read(MAX_UPLOAD_SIZE_BYTES + 1)
    if len(document_bytes) > MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=422,
            detail={"error_code": "VALIDATION_ERROR", "message": "Document exceeds the 10 MB limit."},
        )

    document_hash = hashlib.sha256(document_bytes).hexdigest()
    try:
        ml_result = analyze_document(document_bytes)
        risk_assessment = ml_result["risk_assessment"]
        ml_status = "available"
    except Exception:
        # Cryptographic verification must remain usable if the ML layer fails.
        ml_result = None
        risk_assessment = {
            "risk_level": "UNAVAILABLE",
            "risk_score": None,
            "tampering_detected": None,
            "confidence": 0.0,
            "reasons": ["Risk analysis is temporarily unavailable."],
            "model_version": None,
            "assessment_timestamp": None,
            "disclaimer": "Decision support, not proof of fraud or authenticity.",
        }
        ml_status = "unavailable"

    response: dict[str, Any] = {
        "status": "success",
        "document_hash": document_hash,
        "risk_status": ml_status,
        "risk_assessment": risk_assessment,
    }
    if ml_result is not None:
        response["forensics"] = ml_result["forensics"]
        response["ocr"] = ml_result["ocr"]
    return response
