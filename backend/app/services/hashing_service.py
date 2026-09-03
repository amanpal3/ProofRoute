import hashlib
from typing import BinaryIO


class HashingService:
    """
    Cryptographic SHA-256 hashing service.
    Guarantees consistent 0x-prefixed 64-hex-character output computed purely on raw bytes.
    """

    @staticmethod
    def hash_bytes(data: bytes) -> str:
        digest = hashlib.sha256(data).hexdigest()
        return f"0x{digest.lower()}"

    @classmethod
    def hash_stream(cls, file_obj: BinaryIO, chunk_size: int = 65536) -> str:
        hasher = hashlib.sha256()
        file_obj.seek(0)
        while chunk := file_obj.read(chunk_size):
            hasher.update(chunk)
        file_obj.seek(0)  # Reset stream position
        return f"0x{hasher.hexdigest().lower()}"

    @classmethod
    def hash_file(cls, file_path: str, chunk_size: int = 65536) -> str:
        hasher = hashlib.sha256()
        with open(file_path, "rb") as f:
            while chunk := f.read(chunk_size):
                hasher.update(chunk)
        return f"0x{hasher.hexdigest().lower()}"
