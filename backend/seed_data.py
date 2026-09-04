import asyncio
from datetime import datetime, timezone
from app.db.session import AsyncSessionLocal, init_db
from app.models.product import Product, ShipmentEvent, ProductStatus
from app.models.document import Document
from app.repositories.product_repo import ProductRepository

async def seed():
    await init_db()
    async with AsyncSessionLocal() as session:
        # Check if already seeded
        existing = await ProductRepository.get_by_id(session, "PR-8829-X")
        if existing:
            print("Database already seeded with PR-8829-X.")
            return

        # 1. Authentic Pharma Product
        p1 = Product(
            product_id="PR-8829-X",
            name="Pfizer BioPharma Cold-Chain Vaccines (v2.4)",
            batch_id="BATCH-2026-08892",
            manufacturer_address="0x1234567890123456789012345678901234567890",
            origin="Germany",
            destination="United States",
            current_status=ProductStatus.IN_TRANSIT.value,
            document_hash="0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
            is_anchored=True,
        )
        session.add(p1)

        doc1 = Document(
            product_id="PR-8829-X",
            document_hash="0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
            file_name="Certificate_Of_Authenticity_Batch8829.pdf",
            mime_type="application/pdf",
            file_size=2458000,
            storage_path="uploads/Certificate_Of_Authenticity_Batch8829.pdf",
            uploaded_by="0x1234567890123456789012345678901234567890",
        )
        session.add(doc1)

        e1_1 = ShipmentEvent(
            product_id="PR-8829-X",
            status="CREATED",
            actor_address="0x1234567890123456789012345678901234567890",
            location="Frankfurt Production Facility, Germany",
            notes="SHA-256 hash anchored via ProofRouteRegistry contract. Temperature logging active.",
            tx_hash="0x3c99a8b1229f3d99914ea98bb9cf8872bca5743dfac98583487fba4e987c9123",
            block_number=19482012,
        )
        e1_2 = ShipmentEvent(
            product_id="PR-8829-X",
            status="IN_TRANSIT",
            actor_address="0x1234567890123456789012345678901234567890",
            location="Port of Hamburg Logistics Hub, Germany",
            notes="Departed container terminal via vessel CMA CGM Jacques Saade under continuous cold-chain monitoring (-20°C).",
            tx_hash="0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
            block_number=19482200,
        )
        session.add_all([e1_1, e1_2])

        # 2. Tampered Aerospace Product
        p2 = Product(
            product_id="PR-4410-T",
            name="Aerospace Grade Titanium Fasteners (Grade 5)",
            batch_id="BATCH-2026-4410A",
            manufacturer_address="0x2345678901234567890123456789012345678901",
            origin="United States",
            destination="France",
            current_status=ProductStatus.IN_TRANSIT.value,
            document_hash="0x4a5b6c7d8e9f0123456789abcdef0123456789abcdef0123456789abcdef0123",
            is_anchored=True,
        )
        session.add(p2)

        doc2 = Document(
            product_id="PR-4410-T",
            document_hash="0x4a5b6c7d8e9f0123456789abcdef0123456789abcdef0123456789abcdef0123",
            file_name="Material_Test_Report_MTR_Altered.pdf",
            mime_type="application/pdf",
            file_size=1842000,
            storage_path="uploads/Material_Test_Report_MTR_Altered.pdf",
            uploaded_by="0x2345678901234567890123456789012345678901",
        )
        session.add(doc2)

        e2_1 = ShipmentEvent(
            product_id="PR-4410-T",
            status="CREATED",
            actor_address="0x2345678901234567890123456789012345678901",
            location="Seattle Aerospace Forging Plant, WA, USA",
            notes="Batch fabricated under AS9100D standards. Original MTR issued and hash registered.",
            tx_hash="0x99aa88bb77cc66dd55ee44ff33aa22bb11cc00dd99ee88ff77aa66bb55cc44dd",
            block_number=19481900,
        )
        session.add(e2_1)

        await session.commit()
        print("Database seeded with sample products successfully!")

if __name__ == "__main__":
    asyncio.run(seed())
