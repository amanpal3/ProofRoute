from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.verification import QRResponse
from app.repositories.product_repo import ProductRepository
from app.services.qr_service import QRService
from app.core.exceptions import ProductNotFoundException

router = APIRouter(tags=["QR Code"])


@router.get("/products/{product_id}/qr", response_model=QRResponse)
async def get_product_qr(
    product_id: str,
    session: AsyncSession = Depends(get_db),
):
    product = await ProductRepository.get_by_id(session, product_id)
    if not product:
        raise ProductNotFoundException(product_id)

    url, qr_b64 = QRService.generate_qr_base64(product_id)
    return QRResponse(
        product_id=product_id,
        verification_url=url,
        qr_base64=qr_b64,
    )
