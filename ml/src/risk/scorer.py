"""Explainable composite risk scoring for ProofRoute."""
from __future__ import annotations

from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from typing import Any, Mapping

MODEL_VERSION = "v0.1.0-rules"
DISCLAIMER = "Decision support, not proof of fraud or authenticity."


@dataclass(frozen=True)
class RiskAssessment:
    risk_score: float
    risk_level: str
    tampering_detected: bool
    confidence: float
    reasons: list[str]
    model_version: str
    assessment_timestamp: str
    disclaimer: str = DISCLAIMER

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


def _bounded(value: float) -> float:
    return max(0.0, min(100.0, float(value)))


def assess_risk(
    *,
    ela_confidence: float = 0.0,
    copy_move_confidence: float = 0.0,
    ocr_confidence: float = 1.0,
    ocr_inconsistency: float = 0.0,
    issuer_reputation: float = 1.0,
    on_chain_registered: bool | None = True,
    extra_signals: Mapping[str, float] | None = None,
) -> RiskAssessment:
    """Aggregate normalized signals into an explainable risk assessment.

    ``issuer_reputation`` and all confidence inputs are expected in [0, 1],
    where a higher reputation/confidence is safer. The result is decision
    support and never a definitive authenticity judgment.
    """
    signals = {
        "ELA anomaly": max(0.0, min(1.0, ela_confidence)),
        "copy-move anomaly": max(0.0, min(1.0, copy_move_confidence)),
        "OCR inconsistency": max(0.0, min(1.0, ocr_inconsistency)),
        "issuer reputation concern": 1.0 - max(0.0, min(1.0, issuer_reputation)),
    }
    if extra_signals:
        signals.update({name: max(0.0, min(1.0, value)) for name, value in extra_signals.items()})

    weighted = (
        signals["ELA anomaly"] * 35.0
        + signals["copy-move anomaly"] * 30.0
        + signals["OCR inconsistency"] * 20.0
        + signals["issuer reputation concern"] * 15.0
    )
    if on_chain_registered is False:
        weighted += 20.0
        signals["document is not registered on-chain"] = 1.0
    score = _bounded(weighted)
    level = "LOW" if score < 30 else "MEDIUM" if score < 70 else "HIGH"
    reasons = [f"{name}: {value:.2f}" for name, value in signals.items() if value >= 0.20]
    if not reasons:
        reasons = ["No material risk signals exceeded the explanation threshold."]
    confidence = _bounded((max(0.0, min(1.0, ocr_confidence)) + max(0.0, min(1.0, issuer_reputation))) / 2.0)
    timestamp = datetime.now(timezone.utc).isoformat()
    return RiskAssessment(score, level, score >= 30.0, confidence, reasons, MODEL_VERSION, timestamp)
