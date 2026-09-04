"""Unified ProofRoute ML inference entrypoint."""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

try:
    from .forensics.image import copy_move_detection, error_level_analysis
    from .ocr.extractor import extract_text
    from .risk.scorer import assess_risk
except ImportError:  # Support `python ml/src/pipeline.py` from the repository root.
    from forensics.image import copy_move_detection, error_level_analysis
    from ocr.extractor import extract_text
    from risk.scorer import assess_risk


def analyze_document(
    source: str | bytes,
    *,
    issuer_reputation: float = 1.0,
    on_chain_registered: bool | None = True,
) -> dict[str, Any]:
    """Run all available document analysis steps and return JSON-safe output."""
    ela = error_level_analysis(source)
    copy_move = copy_move_detection(source)
    ocr = extract_text(source)
    # No signed expected entities are available at this layer yet. OCR quality
    # is therefore surfaced separately and does not become an unsupported claim.
    ocr_inconsistency = 1.0 - ocr.confidence if ocr.engine != "unavailable" else 0.0
    risk = assess_risk(
        ela_confidence=ela.confidence,
        copy_move_confidence=copy_move.confidence,
        ocr_confidence=ocr.confidence,
        ocr_inconsistency=ocr_inconsistency,
        issuer_reputation=issuer_reputation,
        on_chain_registered=on_chain_registered,
    )
    return {
        "status": "success",
        "risk_assessment": risk.to_dict(),
        "forensics": {"ela": ela.to_dict(), "copy_move": copy_move.to_dict()},
        "ocr": ocr.to_dict(),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Analyze a document image for ProofRoute risk signals.")
    parser.add_argument("--input-image", required=True, type=Path)
    parser.add_argument("--issuer-reputation", default=1.0, type=float)
    parser.add_argument("--not-registered", action="store_true")
    args = parser.parse_args()
    result = analyze_document(
        args.input_image.read_bytes(),
        issuer_reputation=args.issuer_reputation,
        on_chain_registered=not args.not_registered,
    )
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
