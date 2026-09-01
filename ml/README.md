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
└── requirements.txt             # PyTorch, OpenCV, Transformers dependencies
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run Inference on a Sample Document
```bash
python src/pipeline.py --input-image ./data/sample.png
```
