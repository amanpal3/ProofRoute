"""Unified ProofRoute ML analysis entrypoint."""

from __future__ import annotations

from typing import Any

from .forensics import copy_move_score, ela_score
from .ocr import analyze_text
from .risk import score_risk


def analyze_document(
    document: bytes = b"",
    *,
    ocr_text: str | None = None,
    is_authentic_on_chain: bool | None = None,
    file_size: int | None = None,
    mime_type: str | None = None,
) -> dict[str, Any]:
    """Analyze document evidence and return the shared risk response contract."""
    if not isinstance(document, bytes):
        raise TypeError("document must be bytes")

    resolved_size = len(document) if file_size is None else file_size
    ela = ela_score(document)
    cmfd = copy_move_score(document)
    ocr = analyze_text(ocr_text)
    result = score_risk(
        ela_score=ela,
        cmfd_score=cmfd,
        ocr_confidence=float(ocr["confidence"]),
        is_authentic_on_chain=is_authentic_on_chain,
        file_size=resolved_size,
        mime_type=mime_type,
    )
    result["ocr"] = ocr
    return result


def analyze_features(payload: dict[str, Any]) -> dict[str, Any]:
    """Adapt JSON-safe feature payloads for the risk-score endpoint contract."""
    document_hash = str(payload.get("document_hash", ""))
    seed = document_hash.encode("utf-8")
    return analyze_document(
        seed,
        ocr_text=payload.get("ocr_text"),
        is_authentic_on_chain=payload.get("is_authentic_on_chain"),
        file_size=payload.get("file_size"),
        mime_type=payload.get("mime_type"),
    )
