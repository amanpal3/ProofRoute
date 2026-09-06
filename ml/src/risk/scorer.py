"""Explainable composite risk scoring for document-analysis signals."""

from __future__ import annotations

from typing import Any


def _level(score: float) -> str:
    if score >= 75.0:
        return "HIGH"
    if score >= 35.0:
        return "MEDIUM"
    return "LOW"


def score_risk(
    *,
    ela_score: float,
    cmfd_score: float,
    ocr_confidence: float,
    is_authentic_on_chain: bool | None = None,
    file_size: int | None = None,
    mime_type: str | None = None,
) -> dict[str, Any]:
    """Combine bounded forensic signals into the shared risk response shape."""
    ela = min(1.0, max(0.0, ela_score))
    cmfd = min(1.0, max(0.0, cmfd_score))
    ocr = min(1.0, max(0.0, ocr_confidence))
    score = ela * 40.0 + cmfd * 35.0 + (1.0 - ocr) * 15.0
    reasons: list[str] = []

    if ela >= 0.5:
        score += 10.0
        reasons.append("ELA_ANOMALY: Compression-level variation warrants review.")
    if cmfd >= 0.5:
        score += 15.0
        reasons.append("COPY_MOVE_SIGNAL: Repeated document regions were detected.")
    if ocr < 0.85:
        reasons.append("OCR_LOW_CONFIDENCE: Text evidence is incomplete or uncertain.")
    if file_size is not None and file_size < 100:
        score += 15.0
        reasons.append("SUSPICIOUS_FILE_SIZE: Document payload is unusually small.")
    if mime_type and mime_type not in {"application/pdf", "image/png", "image/jpeg"}:
        score += 20.0
        reasons.append("NON_STANDARD_MIME_TYPE: File type is outside the supported set.")
    if is_authentic_on_chain is True:
        score = max(0.0, score - 25.0)
        reasons.append("ON_CHAIN_PROVENANCE_VERIFIED: Hash matches the immutable record.")
    elif is_authentic_on_chain is False:
        score += 85.0
        reasons.append("CRYPTOGRAPHIC_HASH_MISMATCH: Bytes do not match the on-chain commitment.")

    bounded_score = round(min(100.0, max(0.0, score)), 2)
    tampering_detected = cmfd >= 0.5 or ela >= 0.75 or is_authentic_on_chain is False
    confidence = round(min(0.99, max(0.35, 0.55 + abs(ocr - 0.5) * 0.4)), 4)
    if not reasons:
        reasons.append("FORENSICS_NO_STRONG_SIGNAL: No high-risk forensic signal was detected.")

    return {
        "risk_score": bounded_score,
        "risk_level": _level(bounded_score),
        "tampering_detected": tampering_detected,
        "confidence": confidence,
        "reasons": reasons,
        "model_version": "v0.1.0-deterministic-forensics",
        "disclaimer": "Decision support only. Does not constitute absolute legal proof of authenticity or fraud.",
        "ela_score": ela,
        "cmfd_score": cmfd,
        "font_anomaly_detected": False,
    }
