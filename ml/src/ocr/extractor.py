"""OCR and lightweight entity extraction for verification metadata."""
from __future__ import annotations

import re
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from io import BytesIO
from typing import Any

from PIL import Image


@dataclass(frozen=True)
class OCRResult:
    text: str
    confidence: float
    engine: str
    entities: dict[str, list[str]]
    reason: str

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


def _load_image(source: str | bytes | Image.Image) -> Image.Image:
    if isinstance(source, Image.Image):
        return source.convert("RGB")
    if isinstance(source, bytes):
        return Image.open(BytesIO(source)).convert("RGB")
    return Image.open(source).convert("RGB")


def _entities(text: str) -> dict[str, list[str]]:
    return {
        "dates": re.findall(r"\b(?:\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[-/]\d{1,2}[-/]\d{4})\b", text),
        "amounts": re.findall(r"(?:[$€£₹]\s?\d[\d,]*(?:\.\d{2})?|\b\d[\d,]*\.\d{2}\b)", text),
        "document_ids": re.findall(r"\b(?:INV|DOC|CERT|PO)[-_A-Z0-9]{2,}\b", text, flags=re.IGNORECASE),
    }


def extract_text(source: str | bytes | Image.Image, language: str = "eng") -> OCRResult:
    """Extract text using pytesseract when installed; otherwise return UNAVAILABLE."""
    image = _load_image(source)
    try:
        import pytesseract  # type: ignore

        data = pytesseract.image_to_data(image, lang=language, output_type=pytesseract.Output.DICT)
        words = [word for word in data.get("text", []) if word.strip()]
        text = " ".join(words)
        confidences = [float(value) for value in data.get("conf", []) if float(value) >= 0]
        confidence = (sum(confidences) / len(confidences) / 100.0) if confidences else 0.0
        return OCRResult(text, confidence, "tesseract", _entities(text), "OCR extracted text successfully.")
    except (ImportError, OSError):
        timestamp = datetime.now(timezone.utc).isoformat()
        return OCRResult(
            text="",
            confidence=0.0,
            engine="unavailable",
            entities={},
            reason=f"OCR engine unavailable at {timestamp}; install Tesseract and pytesseract for text extraction.",
        )
