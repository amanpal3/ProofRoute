import json
from pathlib import Path
from tempfile import TemporaryDirectory

from PIL import Image

from src.pipeline import analyze_document


with TemporaryDirectory() as directory:
    sample = Path(directory) / "sample.png"
    Image.new("RGB", (64, 64), "white").save(sample)
    result = analyze_document(sample.read_bytes())
    assert result["status"] == "success"
    assert 0 <= result["risk_assessment"]["risk_score"] <= 100
    assert result["risk_assessment"]["model_version"] == "v0.1.0-rules"
    print(json.dumps({"status": result["status"], "risk_level": result["risk_assessment"]["risk_level"]}))
