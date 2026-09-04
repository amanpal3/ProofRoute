from io import BytesIO

from fastapi.testclient import TestClient
from PIL import Image

from backend.app.main import app


client = TestClient(app)


def sample_png() -> bytes:
    output = BytesIO()
    Image.new("RGB", (64, 64), "white").save(output, format="PNG")
    return output.getvalue()


def test_verify_document_connects_to_ml_pipeline():
    response = client.post(
        "/api/v1/documents/verify",
        files={"file": ("sample.png", sample_png(), "image/png")},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "success"
    assert len(body["document_hash"]) == 64
    assert body["risk_status"] == "available"
    assert body["risk_assessment"]["model_version"] == "v0.1.0-rules"
    assert "forensics" in body
    assert "ocr" in body


def test_verify_document_rejects_unsupported_mime_type():
    response = client.post(
        "/api/v1/documents/verify",
        files={"file": ("sample.txt", b"not an image", "text/plain")},
    )
    assert response.status_code == 422
    assert response.json()["detail"]["error_code"] == "VALIDATION_ERROR"


def test_health_reports_ml_integration():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "ml_service": "integrated"}
