"""
ProofRoute Standalone ML & Forensics HTTP Microservice

Exposes Error Level Analysis (ELA), Copy-Move Forgery Detection (CMFD),
OCR heuristic evaluation, and explainable risk scoring on port 8001.
"""

from typing import Optional, List, Dict, Any
# pyrefly: ignore [missing-import]
from fastapi import FastAPI, UploadFile, File, Form, status
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from ml.src.pipeline import analyze_document, analyze_features
from ml.src.integration import to_backend_response

app = FastAPI(
    title="ProofRoute ML Forensics Service",
    description="Standalone Microservice for Document Tamper Detection & Risk Scoring",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RiskScorePayload(BaseModel):
    document_hash: str = Field(..., description="0x-prefixed SHA-256 document hash")
    is_authentic_on_chain: bool = Field(default=True)
    file_size: Optional[int] = Field(default=None)
    mime_type: Optional[str] = Field(default=None)
    ocr_text: Optional[str] = Field(default=None)


@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    return {
        "status": "ok",
        "service": "ProofRoute ML Forensics Engine",
        "version": "0.1.0",
    }


@app.get("/", status_code=status.HTTP_200_OK)
async def root():
    return {
        "message": "ProofRoute ML Microservice is online",
        "docs": "/docs",
    }


@app.post("/ml/risk-score")
async def compute_risk_score(payload: RiskScorePayload):
    """
    Computes explainable risk assessment based on document metadata,
    cryptographic on-chain status, and feature heuristics.
    """
    features = payload.model_dump()
    result = analyze_features(features)
    return to_backend_response(result)


@app.post("/ml/scan")
async def scan_document(
    file: UploadFile = File(...),
    is_authentic_on_chain: bool = Form(default=True),
    ocr_text: Optional[str] = Form(default=None),
):
    """
    Direct document binary upload for deep forensic inspection (ELA + CMFD + OCR).
    """
    content = await file.read()
    result = analyze_document(
        document=content,
        ocr_text=ocr_text,
        is_authentic_on_chain=is_authentic_on_chain,
        file_size=len(content),
        mime_type=file.content_type,
    )
    return to_backend_response(result)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
