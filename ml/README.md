# 🧠 ProofRoute ML Verification Pipeline

Multimodal deep learning and digital forensics pipeline for document tampering detection, OCR extraction, and composite risk scoring.

---

## 🔬 Core Capabilities

1. **Error Level Analysis (ELA)**:
   - Resaves images at known compression levels to highlight modified or spliced regions.
2. **Copy-Move Forgery Detection (CMFD)**:
   - Identifies cloned text, duplicated signatures, or cloned stamp artifacts.
3. **OCR & Entity Consistency (TrOCR / Tesseract)**:
   - Extracts structured document text (invoice IDs, amounts, dates) and validates against signed metadata.
4. **Composite Risk Scoring Engine**:
   - Combines image tampering probabilities, on-chain issuer reputation, and OCR inconsistencies into an explainable score (`0–100`).

---

## 📂 Directory Layout

```
ml/
├── src/
│   ├── forensics/               # ELA and image manipulation detection
│   ├── ocr/                     # Text extraction and layout parsing
│   ├── risk/                    # Risk scoring rules and aggregation engine
│   └── pipeline.py              # Unified inference pipeline entrypoint
├── models/                      # Model weights and checkpoint configs
├── data/                        # Datasets (raw, processed, benchmarks)
└── requirements.txt             # Core runtime dependencies
```

---

## 🚀 Quick Start

### 1. Install Dependencies

From the repository root:

```bash
pip install -r ml/requirements.txt
```

### 2. Run Inference on a Sample Document

```bash
PYTHONPATH=ml python ml/src/pipeline.py --input-image ./data/sample.png
```

## Implemented baseline

The initial implementation is dependency-light and lives under `src/`. It provides:

- `forensics.image.error_level_analysis`: JPEG recompression inconsistency metrics.
- `forensics.image.copy_move_detection`: repeated-block copy-move screening heuristic.
- `ocr.extractor.extract_text`: optional Tesseract extraction with graceful `unavailable` fallback.
- `risk.scorer.assess_risk`: explainable weighted score from `0–100`, with `LOW`, `MEDIUM`, and `HIGH` levels.
- `pipeline.analyze_document`: unified JSON-safe result for backend integration.

The ML result is **decision support only** and does not determine blockchain authenticity. The pipeline can run without Tesseract; OCR fields then report an unavailable engine while image forensics and risk scoring continue.

### Development commands

```bash
PYTHONPATH=ml pytest -q ml/tests
PYTHONPATH=ml python3 -m compileall -q ml/src ml/tests
```

The risk response includes `risk_level`, `risk_score`, `reasons`, `model_version`, `assessment_timestamp`, and the required disclaimer from the backend integration contract.
