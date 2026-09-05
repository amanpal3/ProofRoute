"""Dependency-free copy-move evidence extraction."""

from __future__ import annotations

import hashlib


def copy_move_score(document: bytes, *, block_size: int = 32) -> float:
    """Estimate duplicated byte blocks as a bounded copy-move signal.

    The signal is deliberately conservative: repeated blocks are evidence for
    review, not proof of tampering.
    """
    if len(document) < block_size * 2:
        return 0.0

    blocks: set[bytes] = set()
    duplicate_count = 0
    for offset in range(0, len(document) - block_size + 1, block_size):
        block = document[offset : offset + block_size]
        digest = hashlib.sha256(block).digest()
        if digest in blocks:
            duplicate_count += 1
        blocks.add(digest)

    total_blocks = max(1, len(document) // block_size)
    return round(min(1.0, duplicate_count / total_blocks * 4.0), 4)
