"""
Product API endpoints — thin routes that delegate to ProductService.
"""

from typing import List

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.product import (
    ProductCreate,
    ProductResponse,
    ProductHistoryResponse,
    ShipmentStatusUpdate,
    ShipmentEventResponse,
)
from app.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["Products"])


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_in: ProductCreate,
    session: AsyncSession = Depends(get_db),
):
    product = await ProductService.create_product(session, product_in)
    return product


@router.get("", response_model=List[ProductResponse])
async def list_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    session: AsyncSession = Depends(get_db),
):
    return await ProductService.list_products(session, skip=skip, limit=limit)


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: str,
    session: AsyncSession = Depends(get_db),
):
    return await ProductService.get_product(session, product_id)


@router.get("/{product_id}/history", response_model=ProductHistoryResponse)
async def get_product_history(
    product_id: str,
    session: AsyncSession = Depends(get_db),
):
    return await ProductService.get_product_history(session, product_id)


@router.post("/{product_id}/status", response_model=ShipmentEventResponse)
async def update_product_status(
    product_id: str,
    status_update: ShipmentStatusUpdate,
    session: AsyncSession = Depends(get_db),
):
    return await ProductService.update_status(session, product_id, status_update)
