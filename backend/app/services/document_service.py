"""
Document Service — orchestrates document upload, verification, and anchoring.

Follows the golden rule: routes delegate to services, services coordinate
repositories and external services, repositories handle data access.
"""

import os
from typing import Optional, Tuple

# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import sanitize_filename
from app.core.exceptions import (
    FileTooLargeException,
    InvalidFileTypeException,
    ProductNotFoundException,
    DocumentNotFoundException,
    ProofRouteException,
)
from app.core.logging import logger
from app.repositories.product_repo import ProductRepository
from app.repositories.document_repo import DocumentRepository
from app.repositories.event_repo import EventRepository
from app.services.hashing_service import HashingService
from app.services.blockchain_service import blockchain_service
from app.services.risk_service import RiskService
from app.schemas.verification import (
    DocumentVerifyResponse,
    OnChainStatus,
    RiskAssessment,
)
from app.schemas.document import DocumentUploadResponse, DocumentAnchorResponse

ALLOWED_MIME_TYPES = ["application/pdf", "image/png", "image/jpeg"]


class DocumentService:
    """Encapsulates all document business logic."""

    # ------------------------------------------------------------------
    # Upload
    # ------------------------------------------------------------------
    @classmethod
    async def upload_document(
        cls,
        session: AsyncSession,
        file_content: bytes,
        file_name: str,
        content_type: str,
        product_id: Optional[str] = None,
        uploaded_by: Optional[str] = None,
    ) -> DocumentUploadResponse:
        # 1. Validate MIME type
        if content_type not in ALLOWED_MIME_TYPES:
            raise InvalidFileTypeException(content_type, ALLOWED_MIME_TYPES)

        # 2. Enforce size limit
        file_size = len(file_content)
        if file_size > settings.MAX_UPLOAD_SIZE_BYTES:
            raise FileTooLargeException(settings.MAX_UPLOAD_SIZE_BYTES)

        # 3. Compute SHA-256 on raw bytes
        doc_hash = HashingService.hash_bytes(file_content)

        # 4. Persist file safely
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        safe_name = sanitize_filename(file_name)
        destination = os.path.join(settings.UPLOAD_DIR, safe_name)
        with open(destination, "wb") as f:
            f.write(file_content)

        # 5. Validate product exists if specified
        if product_id:
            product = await ProductRepository.get_by_id(session, product_id)
            if not product:
                raise ProductNotFoundException(product_id)

        # 6. Record in database
        doc = await DocumentRepository.create(
            session=session,
            document_hash=doc_hash,
            file_name=file_name,
            mime_type=content_type,
            file_size=file_size,
            storage_path=destination,
            product_id=product_id,
            uploaded_by=uploaded_by,
        )

        return DocumentUploadResponse(
            document_hash=doc.document_hash,
            file_name=doc.file_name,
            file_size=doc.file_size,
            mime_type=doc.mime_type,
            product_id=doc.product_id,
            created_at=doc.created_at,
        )

    # ------------------------------------------------------------------
    # Verify
    # ------------------------------------------------------------------
    @classmethod
    async def verify_document(
        cls,
        session: AsyncSession,
        *,
        file_content: Optional[bytes] = None,
        content_type: Optional[str] = None,
        doc_hash: Optional[str] = None,
        product_id: Optional[str] = None,
        issuer_address: Optional[str] = None,
        client_ip: Optional[str] = None,
    ) -> DocumentVerifyResponse:
        """
        Core verification pipeline:
          hash → on-chain check → off-chain fallback → risk engine → persist audit → respond
        """
        if not file_content and not doc_hash:
            raise ProofRouteException(
                status_code=400,
                code="VALIDATION_ERROR",
                message="Either 'file' or 'doc_hash' must be provided for verification.",
            )

        file_size: Optional[int] = None
        mime_type: Optional[str] = content_type

        if file_content:
            file_size = len(file_content)
            calculated_hash = HashingService.hash_bytes(file_content)
        else:
            calculated_hash = doc_hash.lower() if doc_hash else ""
            if not calculated_hash.startswith("0x"):
                calculated_hash = f"0x{calculated_hash}"

        # --- Authenticity determination ---
        is_authentic = False
        registered = False
        issuer = issuer_address
        block_num: Optional[int] = None
        timestamp: Optional[int] = None
        product = None

        if product_id:
            product = await ProductRepository.get_by_id(session, product_id)
            if product and product.document_hash:
                registered = True
                issuer = product.manufacturer_address
                # On-chain check (returns None when RPC/contract unavailable)
                on_chain_match = blockchain_service.verify_document_hash_on_chain(
                    product_id, calculated_hash
                )
                if on_chain_match is not None:
                    is_authentic = on_chain_match
                else:
                    # Offline fallback against DB projection
                    is_authentic = product.document_hash.lower() == calculated_hash.lower()
        else:
            doc_record = await DocumentRepository.get_by_hash(session, calculated_hash)
            if doc_record:
                registered = True
                is_authentic = True

        # Determine status string
        if not registered:
            verification_status = "NOT_REGISTERED"
        elif is_authentic:
            verification_status = "VALID"
        else:
            verification_status = "TAMPERED"

        # --- Risk engine ---
        risk_assessment = await RiskService.evaluate_risk(
            document_hash=calculated_hash,
            is_authentic_on_chain=is_authentic,
            file_size=file_size,
            mime_type=mime_type,
            product_status=product.current_status if product else None,
            document_content=file_content,
        )

        # --- Audit trail ---
        await EventRepository.save_verification(
            session=session,
            document_hash=calculated_hash,
            status=verification_status,
            is_authentic=is_authentic,
            risk_score=risk_assessment.risk_score,
            risk_level=risk_assessment.risk_level,
            tampering_detected=risk_assessment.tampering_detected,
            confidence=risk_assessment.confidence,
            reasons=risk_assessment.reasons,
            product_id=product_id,
            checked_by_ip=client_ip,
        )

        return DocumentVerifyResponse(
            status=verification_status,
            document_hash=calculated_hash,
            is_authentic=is_authentic,
            product_id=product_id,
            on_chain_status=OnChainStatus(
                registered=registered,
                issuer=issuer,
                block_number=block_num,
                timestamp=timestamp,
            ),
            risk_assessment=risk_assessment,
        )

    # ------------------------------------------------------------------
    # Anchor
    # ------------------------------------------------------------------
    @classmethod
    async def anchor_document(
        cls,
        session: AsyncSession,
        product_id: str,
        document_hash: str,
        tx_hash: str,
    ) -> DocumentAnchorResponse:
        product = await ProductRepository.get_by_id(session, product_id)
        if not product:
            raise ProductNotFoundException(product_id)

        if product.document_hash and product.is_anchored:
            raise ProofRouteException(
                status_code=409,
                code="DOCUMENT_ALREADY_ANCHORED",
                message=f"Product '{product_id}' already has an immutable document hash anchored.",
            )

        await ProductRepository.attach_hash(session, product, document_hash)

        return DocumentAnchorResponse(
            success=True,
            product_id=product_id,
            document_hash=document_hash,
            tx_hash=tx_hash,
            message="Document hash successfully anchored to product.",
        )
