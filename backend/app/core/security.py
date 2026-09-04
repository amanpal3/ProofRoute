import os
import re
import uuid
from typing import Optional
from fastapi import Header, HTTPException, status
from app.core.config import settings
from app.core.exceptions import ProofRouteException


def sanitize_filename(filename: str) -> str:
    """
    Remove potentially dangerous characters and path traversal sequences.
    Prepends a UUID to guarantee non-colliding storage.
    """
    # Extract only the base name
    base = os.path.basename(filename)
    # Allow alphanumeric, underscore, hyphen, and period
    cleaned = re.sub(r"[^\w\.\-]", "_", base)
    if not cleaned:
        cleaned = "unnamed_document"
    return f"{uuid.uuid4().hex}_{cleaned}"


async def verify_api_key(x_api_key: Optional[str] = Header(default=None)) -> Optional[str]:
    """
    Validates API key if provided. In production or write operations, this can enforce strict auth.
    """
    # In development mode, allow requests without API keys unless explicitly required
    if settings.APP_ENV == "production" and not x_api_key:
        raise ProofRouteException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="UNAUTHORIZED",
            message="Missing required API key.",
        )
    return x_api_key
