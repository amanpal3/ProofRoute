"""Small OCR-result consistency helpers used by the ML contract."""

from __future__ import annotations

import re
from typing import Any

_NUMBER_PATTERN = re.compile(r"\b\d[\d,]*(?:\.\d+)?\b")


def analyze_text(text: str | None) -> dict[str, Any]:
    """Summarize OCR text without claiming to perform OCR itself."""
    normalized = " ".join((text or "").split())
    numbers = _NUMBER_PATTERN.findall(normalized)
    confidence = 0.35 if not normalized else min(0.99, 0.55 + min(len(normalized), 1000) / 2500)
    return {
        "text_available": bool(normalized),
        "character_count": len(normalized),
        "numeric_token_count": len(numbers),
        "confidence": round(confidence, 4),
        "font_anomaly_detected": False,
        "reasons": [] if normalized else ["OCR_INPUT_UNAVAILABLE: No OCR text was supplied."],
    }
