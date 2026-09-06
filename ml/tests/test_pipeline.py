from __future__ import annotations

import pytest

from ml.src.pipeline import analyze_document, analyze_features
from ml.src.risk.scorer import score_risk
from ml.src.integration import analyze_backend_request, to_backend_response, to_frontend_response


def test_analysis_returns_frontend_compatible_bounded_fields() -> None:
    result = analyze_document(
        b"%PDF-1.7\ncertificate data\n" * 8,
        ocr_text="Invoice 12345 Amount 2500.00",
        is_authentic_on_chain=True,
        mime_type="application/pdf",
    )

    assert 0.0 <= result["risk_score"] <= 100.0
    assert result["risk_level"] in {"LOW", "MEDIUM", "HIGH"}
    assert 0.0 <= result["confidence"] <= 1.0
    assert 0.0 <= result["ela_score"] <= 1.0
    assert 0.0 <= result["cmfd_score"] <= 1.0
    assert isinstance(result["reasons"], list)
    assert "ocr" in result


def test_repeated_blocks_raise_copy_move_signal() -> None:
    block = b"A" * 32
    result = analyze_document(block * 20)

    assert result["cmfd_score"] > 0.0
    assert any("COPY_MOVE_SIGNAL" in reason for reason in result["reasons"])


def test_hash_mismatch_is_high_risk() -> None:
    result = analyze_features(
        {
            "document_hash": "0xabc123",
            "is_authentic_on_chain": False,
            "mime_type": "application/pdf",
        }
    )

    assert result["risk_level"] == "HIGH"
    assert result["tampering_detected"] is True
    assert any("CRYPTOGRAPHIC_HASH_MISMATCH" in reason for reason in result["reasons"])


def test_scores_are_clamped_and_invalid_document_type_is_rejected() -> None:
    result = score_risk(
        ela_score=4.0,
        cmfd_score=-2.0,
        ocr_confidence=2.0,
    )

    assert 0.0 <= result["risk_score"] <= 100.0
    assert result["ela_score"] == 1.0
    assert result["cmfd_score"] == 0.0

    with pytest.raises(TypeError):
        analyze_document("not bytes")  # type: ignore[arg-type]


def test_backend_request_maps_to_backend_and_frontend_contracts() -> None:
    result = analyze_backend_request(
        {
            "document_hash": "0x1234",
            "is_authentic_on_chain": True,
            "file_size": 512,
            "mime_type": "application/pdf",
            "ocr_text": "Certificate 2026",
        }
    )

    backend = to_backend_response(result)
    frontend = to_frontend_response(result)

    assert backend["risk_score"] == result["risk_score"]
    assert backend["ela_score"] == result["ela_score"]
    assert frontend["riskScore"] == result["risk_score"]
    assert frontend["cmfdScore"] == result["cmfd_score"]
    assert frontend["riskLevel"] in {"LOW", "MEDIUM", "HIGH"}
