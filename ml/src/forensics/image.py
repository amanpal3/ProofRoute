"""Image-forensics feature extraction for ProofRoute documents.

The implementation intentionally uses Pillow and NumPy so it can run in a small
service container. OpenCV can be added later for production-grade keypoint
matching without changing the public result shape.
"""
from __future__ import annotations

from dataclasses import dataclass, asdict
from io import BytesIO
from typing import Any

import numpy as np
from PIL import Image, ImageChops, ImageEnhance


@dataclass(frozen=True)
class ELAResult:
    mean_error: float
    max_error: float
    high_error_ratio: float
    confidence: float
    reason: str

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(frozen=True)
class CopyMoveResult:
    duplicate_pairs: int
    confidence: float
    reason: str

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


def _open_image(source: str | bytes | Image.Image) -> Image.Image:
    if isinstance(source, Image.Image):
        return source.convert("RGB")
    if isinstance(source, bytes):
        return Image.open(BytesIO(source)).convert("RGB")
    return Image.open(source).convert("RGB")


def error_level_analysis(source: str | bytes | Image.Image, quality: int = 90) -> ELAResult:
    """Estimate JPEG recompression inconsistencies.

    ELA is a screening signal, not proof of tampering. PNG input is encoded as
    JPEG in memory at a known quality, then compared against the original.
    """
    if not 1 <= quality <= 100:
        raise ValueError("quality must be between 1 and 100")
    image = _open_image(source)
    encoded = BytesIO()
    image.save(encoded, format="JPEG", quality=quality)
    encoded.seek(0)
    recompressed = Image.open(encoded).convert("RGB")
    diff = ImageChops.difference(image, recompressed)
    values = np.asarray(diff, dtype=np.float32)
    per_pixel = values.mean(axis=2)
    mean_error = float(per_pixel.mean() / 255.0)
    max_error = float(per_pixel.max() / 255.0)
    high_error_ratio = float((per_pixel > 25.0).mean())
    # These are deliberately conservative heuristic indicators.
    confidence = float(np.clip((mean_error * 1.5 + high_error_ratio) / 2.0, 0.0, 1.0))
    reason = (
        "Elevated recompression error suggests localized editing or mixed compression."
        if confidence >= 0.25
        else "No material recompression inconsistency detected by the ELA heuristic."
    )
    return ELAResult(mean_error, max_error, high_error_ratio, confidence, reason)


def copy_move_detection(
    source: str | bytes | Image.Image,
    block_size: int = 16,
    stride: int = 8,
    quantization: int = 8,
) -> CopyMoveResult:
    """Find repeated non-flat grayscale blocks as a CMFD screening heuristic."""
    if block_size <= 0 or stride <= 0 or quantization <= 0:
        raise ValueError("block_size, stride, and quantization must be positive")
    image = _open_image(source).convert("L")
    array = np.asarray(image, dtype=np.float32)
    height, width = array.shape
    signatures: dict[tuple[int, ...], list[tuple[int, int]]] = {}
    for y in range(0, max(0, height - block_size + 1), stride):
        for x in range(0, max(0, width - block_size + 1), stride):
            block = array[y : y + block_size, x : x + block_size]
            if block.std() < 4.0:
                continue
            normalized = (block - block.mean()) / (block.std() + 1e-6)
            signature = tuple(np.rint(normalized[::4, ::4] * quantization).astype(int).flatten())
            signatures.setdefault(signature, []).append((x, y))

    duplicate_pairs = 0
    for positions in signatures.values():
        if len(positions) > 1:
            # Nearby overlapping windows are not independent evidence.
            for index, left in enumerate(positions):
                for right in positions[index + 1 :]:
                    if abs(left[0] - right[0]) >= block_size or abs(left[1] - right[1]) >= block_size:
                        duplicate_pairs += 1
    confidence = float(np.clip(duplicate_pairs / 10.0, 0.0, 1.0))
    reason = (
        f"Detected {duplicate_pairs} spatially separated repeated image block pair(s)."
        if duplicate_pairs
        else "No spatially separated repeated blocks detected by the CMFD heuristic."
    )
    return CopyMoveResult(duplicate_pairs, confidence, reason)


def build_heatmap(source: str | bytes | Image.Image, quality: int = 90) -> Image.Image:
    """Return an enhanced ELA visualization suitable for a UI heatmap preview."""
    image = _open_image(source)
    encoded = BytesIO()
    image.save(encoded, format="JPEG", quality=quality)
    encoded.seek(0)
    recompressed = Image.open(encoded).convert("RGB")
    diff = ImageChops.difference(image, recompressed)
    return ImageEnhance.Brightness(diff).enhance(8.0)
