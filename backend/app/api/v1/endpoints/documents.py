"""
Document API endpoints — thin routes that delegate to DocumentService.
"""

from typing import Optional

from fastapi import APIRouter, Depends, UploadFile, File, Form, status, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.exceptions import ProofRouteException
from app.schemas.document import (
    DocumentUploadResponse,
    DocumentAnchorRequest,
    DocumentAnchorResponse,
)
from app.schemas.verification import DocumentVerifyResponse
from app.services.document_service import DocumentService

router = APIRouter(tags=["Documents"])


@router.post(
    "/documents/upload",
    response_model=DocumentUploadResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_document(
    file: UploadFile = File(...),
    product_id: Optional[str] = Form(default=None),
    uploaded_by: Optional[str] = Form(default=None),
    session: AsyncSession = Depends(get_db),
):
    content = await file.read()
    return await DocumentService.upload_document(
        session=session,
        file_content=content,
        file_name=file.filename or "document.pdf",
        content_type=file.content_type or "application/octet-stream",
        product_id=product_id,
        uploaded_by=uploaded_by,
    )


@router.post("/documents/verify", response_model=DocumentVerifyResponse)
async def verify_document(
    request: Request,
    file: Optional[UploadFile] = File(default=None),
    doc_hash: Optional[str] = Form(default=None),
    product_id: Optional[str] = Form(default=None),
    issuer_address: Optional[str] = Form(default=None),
    session: AsyncSession = Depends(get_db),
):
    file_content = None
    content_type = None
    if file:
        file_content = await file.read()
        content_type = file.content_type

    client_ip = request.client.host if request.client else None

    return await DocumentService.verify_document(
        session=session,
        file_content=file_content,
        content_type=content_type,
        doc_hash=doc_hash,
        product_id=product_id,
        issuer_address=issuer_address,
        client_ip=client_ip,
    )


@router.post(
    "/products/{product_id}/documents/verify",
    response_model=DocumentVerifyResponse,
)
async def verify_product_document(
    product_id: str,
    request: Request,
    file: Optional[UploadFile] = File(default=None),
    doc_hash: Optional[str] = Form(default=None),
    session: AsyncSession = Depends(get_db),
):
    file_content = None
    content_type = None
    if file:
        file_content = await file.read()
        content_type = file.content_type

    client_ip = request.client.host if request.client else None

    return await DocumentService.verify_document(
        session=session,
        file_content=file_content,
        content_type=content_type,
        doc_hash=doc_hash,
        product_id=product_id,
        client_ip=client_ip,
    )


@router.post("/documents/anchor", response_model=DocumentAnchorResponse)
async def anchor_document(
    req: DocumentAnchorRequest,
    session: AsyncSession = Depends(get_db),
):
    return await DocumentService.anchor_document(
        session=session,
        product_id=req.product_id,
        document_hash=req.document_hash,
        tx_hash=req.tx_hash,
    )
