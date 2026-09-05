"""Adapters for ProofRoute backend and frontend ML contracts.

The application layers can import these helpers later without duplicating field
mapping or changing the ML result semantics.
"""

from __future__ import annotations

from typing import Any

from .pipeline import analyze_features


def analyze_backend_request(payload: dict[str, Any]) -> dict[str, Any]:
    """Analyze the JSON shape used by ``POST /ml/risk-score``."""
    return analyze_features(
        {
            "document_hash": payload.get("document_hash", ""),
            "is_authentic_on_chain": payload.get("is_authentic_on_chain"),
            "file_size": payload.get("file_size"),
            "mime_type": payload.get("mime_type"),
            "ocr_text": payload.get("ocr_text"),
        }
    )


def to_backend_response(result: dict[str, Any]) -> dict[str, Any]:
    """Return the backend/Pydantic-compatible risk assessment fields."""
    return {
        "risk_score": float(result["risk_score"]),
        "risk_level": result["risk_level"],
        "tampering_detected": bool(result["tampering_detected"]),
        "confidence": float(result["confidence"]),
        "reasons": list(result["reasons"]),
        "model_version": result["model_version"],
        "disclaimer": result["disclaimer"],
        "ela_score": float(result["ela_score"]),
        "cmfd_score": float(result["cmfd_score"]),
        "font_anomaly_detected": bool(result["font_anomaly_detected"]),
    }


def to_frontend_response(result: dict[str, Any]) -> dict[str, Any]:
    """Return the camelCase fields expected by the frontend risk type."""
    return {
        "riskScore": float(result["risk_score"]),
        "riskLevel": result["risk_level"],
        "tamperingDetected": bool(result["tampering_detected"]),
        "confidence": float(result["confidence"]),
        "reasons": list(result["reasons"]),
        "elaScore": float(result["ela_score"]),
        "cmfdScore": float(result["cmfd_score"]),
        "fontAnomalyDetected": bool(result["font_anomaly_detected"]),
    }
