from typing import Optional, List, Sequence
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.product import Product, ShipmentEvent, ProductStatus
from app.schemas.product import ProductCreate, ShipmentStatusUpdate


class ProductRepository:
    @staticmethod
    async def get_by_id(session: AsyncSession, product_id: str) -> Optional[Product]:
        stmt = (
            select(Product)
            .where(Product.product_id == product_id)
            .options(selectinload(Product.shipment_events))
        )
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_all(session: AsyncSession, skip: int = 0, limit: int = 50) -> Sequence[Product]:
        stmt = select(Product).offset(skip).limit(limit)
        result = await session.execute(stmt)
        return result.scalars().all()

    @staticmethod
    async def create(session: AsyncSession, product_in: ProductCreate) -> Product:
        product = Product(
            product_id=product_in.product_id,
            name=product_in.name,
            batch_id=product_in.batch_id,
            manufacturer_address=product_in.manufacturer_address,
            origin=product_in.origin,
            destination=product_in.destination,
            current_status=ProductStatus.CREATED.value,
        )
        session.add(product)
        
        # Add initial CREATED shipment milestone
        initial_event = ShipmentEvent(
            product_id=product.product_id,
            status=ProductStatus.CREATED.value,
            actor_address=product_in.manufacturer_address,
            location=product_in.origin,
            notes="Product registered and batch initialized.",
        )
        session.add(initial_event)
        
        await session.commit()
        await session.refresh(product)
        return product

    @staticmethod
    async def add_shipment_event(
        session: AsyncSession, product: Product, update: ShipmentStatusUpdate
    ) -> ShipmentEvent:
        product.current_status = update.status.value
        
        event = ShipmentEvent(
            product_id=product.product_id,
            status=update.status.value,
            actor_address=update.actor_address,
            location=update.location,
            notes=update.notes,
            tx_hash=update.tx_hash,
        )
        session.add(event)
        await session.commit()
        await session.refresh(event)
        await session.refresh(product)
        return event

    @staticmethod
    async def attach_hash(
        session: AsyncSession, product: Product, document_hash: str
    ) -> Product:
        product.document_hash = document_hash
        product.is_anchored = True
        await session.commit()
        await session.refresh(product)
        return product
