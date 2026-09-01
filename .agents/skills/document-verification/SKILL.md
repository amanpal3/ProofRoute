---
name: document-verification
description: Standards for ML-based document inspection, OCR, and tampering detection.
---

# Document Verification Skill Guide

## 🛠️ Tech Stack & Standards
- Frameworks: PyTorch, OpenCV, Tesseract / TrOCR
- Tasks: Copy-move forgery detection, text extraction, font anomaly detection

## 📌 Rules
- Ensure models return calibrated confidence scores.
- Handle multi-page documents and diverse image resolutions gracefully.
