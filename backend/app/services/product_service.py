"""
Product Service — orchestrates product creation, status transitions, and history retrieval.
"""

from typing import List, Sequence

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import (
    ProductNotFoundException,
    InvalidStatusTransitionException,
    ProofRouteException,
)
from app.models.product import Product
from app.repositories.product_repo import ProductRepository
from app.schemas.product import (
    ProductCreate,
    ProductResponse,
    ProductHistoryResponse,
    ShipmentStatusUpdate,
    ShipmentEventResponse,
    StatusEnum,
)


# Unidirectional state machine: CREATED → IN_TRANSIT → DELIVERED
VALID_TRANSITIONS = {
    StatusEnum.CREATED.value: [StatusEnum.IN_TRANSIT.value],
    StatusEnum.IN_TRANSIT.value: [StatusEnum.DELIVERED.value],
    StatusEnum.DELIVERED.value: [],
}


class ProductService:

    @staticmethod
    async def create_product(
        session: AsyncSession, product_in: ProductCreate
    ) -> Product:
        existing = await ProductRepository.get_by_id(session, product_in.product_id)
        if existing:
            raise ProofRouteException(
                status_code=409,
                code="PRODUCT_ALREADY_EXISTS",
                message=f"Product with ID '{product_in.product_id}' already exists.",
            )
        return await ProductRepository.create(session, product_in)

    @staticmethod
    async def get_product(session: AsyncSession, product_id: str) -> Product:
        product = await ProductRepository.get_by_id(session, product_id)
        if not product:
            raise ProductNotFoundException(product_id)
        return product

    @staticmethod
    async def list_products(
        session: AsyncSession, skip: int = 0, limit: int = 50
    ) -> Sequence[Product]:
        return await ProductRepository.get_all(session, skip=skip, limit=limit)

    @classmethod
    async def get_product_history(
        cls, session: AsyncSession, product_id: str
    ) -> ProductHistoryResponse:
        product = await cls.get_product(session, product_id)
        return ProductHistoryResponse(
            product=ProductResponse.model_validate(product),
            events=[
                ShipmentEventResponse.model_validate(e)
                for e in product.shipment_events
            ],
        )

    @classmethod
    async def update_status(
        cls,
        session: AsyncSession,
        product_id: str,
        status_update: ShipmentStatusUpdate,
    ) -> ShipmentEventResponse:
        product = await cls.get_product(session, product_id)

        current = product.current_status
        target = status_update.status.value

        if target not in VALID_TRANSITIONS.get(current, []):
            raise InvalidStatusTransitionException(
                current_status=current, target_status=target
            )

        event = await ProductRepository.add_shipment_event(
            session, product, status_update
        )
        return ShipmentEventResponse.model_validate(event)
