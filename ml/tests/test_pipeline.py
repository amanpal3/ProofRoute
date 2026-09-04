from io import BytesIO

from PIL import Image, ImageDraw

from src.forensics.image import copy_move_detection, error_level_analysis
from src.ocr.extractor import extract_text
from src.pipeline import analyze_document
from src.risk.scorer import DISCLAIMER, assess_risk


def image_bytes() -> bytes:
    image = Image.new("RGB", (128, 128), "white")
    draw = ImageDraw.Draw(image)
    draw.rectangle((20, 20, 55, 55), fill="black")
    draw.rectangle((70, 70, 105, 105), fill="black")
    output = BytesIO()
    image.save(output, format="PNG")
    return output.getvalue()


def test_ela_returns_normalized_metrics():
    result = error_level_analysis(image_bytes())
    assert 0 <= result.confidence <= 1
    assert 0 <= result.mean_error <= 1
    assert 0 <= result.high_error_ratio <= 1


def test_copy_move_returns_explainable_result():
    result = copy_move_detection(image_bytes())
    assert result.duplicate_pairs >= 0
    assert 0 <= result.confidence <= 1
    assert result.reason


def test_ocr_degrades_without_engine():
    result = extract_text(image_bytes())
    assert result.engine in {"unavailable", "tesseract"}
    assert 0 <= result.confidence <= 1


def test_risk_thresholds_and_disclaimer():
    result = assess_risk(
        ela_confidence=1,
        copy_move_confidence=1,
        ocr_inconsistency=1,
        issuer_reputation=0,
        on_chain_registered=False,
    )
    assert result.risk_level == "HIGH"
    assert result.risk_score <= 100
    assert result.tampering_detected is True
    assert result.disclaimer == DISCLAIMER


def test_pipeline_has_backend_contract_fields():
    result = analyze_document(image_bytes(), on_chain_registered=True)
    risk = result["risk_assessment"]
    assert result["status"] == "success"
    assert {"risk_level", "risk_score", "reasons", "model_version", "assessment_timestamp", "disclaimer"} <= risk.keys()
    assert {"ela", "copy_move"} <= result["forensics"].keys()
