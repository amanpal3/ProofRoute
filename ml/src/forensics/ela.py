"""Lightweight Error Level Analysis feature extraction.

This module intentionally has no mandatory OpenCV/PyTorch dependency. It provides
stable byte-level evidence for the local pipeline and can be replaced by a trained
image model without changing the result contract.
"""

from __future__ import annotations

import math
from typing import Iterable


def _entropy(values: Iterable[int]) -> float:
    counts = [0] * 256
    total = 0
    for value in values:
        counts[value] += 1
        total += 1
    if total == 0:
        return 0.0
    return -sum((count / total) * math.log2(count / total) for count in counts if count)


def ela_score(document: bytes) -> float:
    """Return a bounded compression-anomaly score in the range 0.0 to 1.0."""
    if not document:
        return 0.0

    sample = document[: min(len(document), 65536)]
    entropy = _entropy(sample)
    high_byte_ratio = sum(value >= 240 for value in sample) / len(sample)
    repeated_marker = sample.count(b"JFIF") + sample.count(b"Exif") + sample.count(b"Photoshop")

    score = min(1.0, max(0.0, (entropy / 8.0) * 0.65 + high_byte_ratio * 0.25))
    if repeated_marker > 1:
        score = min(1.0, score + 0.1)
    return round(score, 4)
