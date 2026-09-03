from typing import Optional, Sequence
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.document import Document


class DocumentRepository:
    @staticmethod
    async def get_by_hash(session: AsyncSession, document_hash: str) -> Optional[Document]:
        stmt = select(Document).where(Document.document_hash == document_hash)
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_product_id(session: AsyncSession, product_id: str) -> Sequence[Document]:
        stmt = select(Document).where(Document.product_id == product_id)
        result = await session.execute(stmt)
        return result.scalars().all()

    @staticmethod
    async def create(
        session: AsyncSession,
        document_hash: str,
        file_name: str,
        mime_type: str,
        file_size: int,
        storage_path: str,
        product_id: Optional[str] = None,
        uploaded_by: Optional[str] = None,
    ) -> Document:
        doc = Document(
            document_hash=document_hash,
            file_name=file_name,
            mime_type=mime_type,
            file_size=file_size,
            storage_path=storage_path,
            product_id=product_id,
            uploaded_by=uploaded_by,
        )
        session.add(doc)
        await session.commit()
        await session.refresh(doc)
        return doc
