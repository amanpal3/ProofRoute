"""
ProofRoute Backend — Basic Integration Tests

Tests all API endpoints using httpx.AsyncClient against a fresh in-memory SQLite DB
so tests are fast, isolated, and require no external services (no Postgres, no RPC, no ML).
"""

# pyrefly: ignore [missing-import]
import pytest
# pyrefly: ignore [missing-import]
import pytest_asyncio
# pyrefly: ignore [missing-import]
from httpx import AsyncClient, ASGITransport

from app.main import app
from app.db.session import engine, init_db
from app.db.base import Base


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------
@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    """Create all tables before each test, drop them after."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def client():
    """Async test client — no real server needed."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as ac:
        yield ac


# ===========================================================================
# Health
# ===========================================================================
class TestHealth:
    @pytest.mark.asyncio
    async def test_health_returns_ok(self, client: AsyncClient):
        r = await client.get("/api/v1/health")
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "ok"
        assert data["database_connected"] is True
        assert "version" in data

    @pytest.mark.asyncio
    async def test_root_returns_info(self, client: AsyncClient):
        r = await client.get("/")
        assert r.status_code == 200
        assert r.json()["docs"] == "/docs"


# ===========================================================================
# Products
# ===========================================================================
SAMPLE_PRODUCT = {
    "product_id": "PRD-001",
    "name": "Organic Coffee Beans",
    "batch_id": "BATCH-2026-09",
    "manufacturer_address": "0x1234567890123456789012345678901234567890",
    "origin": "Colombia",
    "destination": "New York, USA",
}


class TestProducts:
    @pytest.mark.asyncio
    async def test_create_product(self, client: AsyncClient):
        r = await client.post("/api/v1/products", json=SAMPLE_PRODUCT)
        assert r.status_code == 201
        data = r.json()
        assert data["product_id"] == "PRD-001"
        assert data["current_status"] == "CREATED"
        assert data["is_anchored"] is False

    @pytest.mark.asyncio
    async def test_create_duplicate_product_409(self, client: AsyncClient):
        await client.post("/api/v1/products", json=SAMPLE_PRODUCT)
        r = await client.post("/api/v1/products", json=SAMPLE_PRODUCT)
        assert r.status_code == 409
        assert r.json()["error"]["code"] == "PRODUCT_ALREADY_EXISTS"

    @pytest.mark.asyncio
    async def test_get_product(self, client: AsyncClient):
        await client.post("/api/v1/products", json=SAMPLE_PRODUCT)
        r = await client.get("/api/v1/products/PRD-001")
        assert r.status_code == 200
        assert r.json()["name"] == "Organic Coffee Beans"

    @pytest.mark.asyncio
    async def test_get_product_not_found_404(self, client: AsyncClient):
        r = await client.get("/api/v1/products/NONEXISTENT")
        assert r.status_code == 404
        assert r.json()["error"]["code"] == "PRODUCT_NOT_FOUND"

    @pytest.mark.asyncio
    async def test_list_products(self, client: AsyncClient):
        await client.post("/api/v1/products", json=SAMPLE_PRODUCT)
        r = await client.get("/api/v1/products")
        assert r.status_code == 200
        assert len(r.json()) == 1

    @pytest.mark.asyncio
    async def test_list_products_pagination(self, client: AsyncClient):
        for i in range(3):
            p = {**SAMPLE_PRODUCT, "product_id": f"PRD-{i:03d}"}
            await client.post("/api/v1/products", json=p)
        r = await client.get("/api/v1/products?skip=1&limit=1")
        assert r.status_code == 200
        assert len(r.json()) == 1

    @pytest.mark.asyncio
    async def test_get_product_history(self, client: AsyncClient):
        await client.post("/api/v1/products", json=SAMPLE_PRODUCT)
        r = await client.get("/api/v1/products/PRD-001/history")
        assert r.status_code == 200
        data = r.json()
        assert data["product"]["product_id"] == "PRD-001"
        # Should have the initial CREATED event
        assert len(data["events"]) >= 1
        assert data["events"][0]["status"] == "CREATED"

    @pytest.mark.asyncio
    async def test_status_transition_created_to_in_transit(self, client: AsyncClient):
        await client.post("/api/v1/products", json=SAMPLE_PRODUCT)
        r = await client.post("/api/v1/products/PRD-001/status", json={
            "status": "IN_TRANSIT",
            "actor_address": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
            "location": "Port of Cartagena",
            "notes": "Loaded onto vessel",
        })
        assert r.status_code == 200
        assert r.json()["status"] == "IN_TRANSIT"

    @pytest.mark.asyncio
    async def test_status_transition_in_transit_to_delivered(self, client: AsyncClient):
        await client.post("/api/v1/products", json=SAMPLE_PRODUCT)
        await client.post("/api/v1/products/PRD-001/status", json={
            "status": "IN_TRANSIT",
            "actor_address": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        })
        r = await client.post("/api/v1/products/PRD-001/status", json={
            "status": "DELIVERED",
            "actor_address": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
            "location": "New York warehouse",
        })
        assert r.status_code == 200
        assert r.json()["status"] == "DELIVERED"

    @pytest.mark.asyncio
    async def test_invalid_status_transition_400(self, client: AsyncClient):
        await client.post("/api/v1/products", json=SAMPLE_PRODUCT)
        # CREATED -> DELIVERED is not allowed (must go through IN_TRANSIT)
        r = await client.post("/api/v1/products/PRD-001/status", json={
            "status": "DELIVERED",
            "actor_address": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        })
        assert r.status_code == 400
        assert r.json()["error"]["code"] == "INVALID_STATUS_TRANSITION"

    @pytest.mark.asyncio
    async def test_invalid_status_backward_transition_400(self, client: AsyncClient):
        await client.post("/api/v1/products", json=SAMPLE_PRODUCT)
        await client.post("/api/v1/products/PRD-001/status", json={
            "status": "IN_TRANSIT",
            "actor_address": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        })
        # IN_TRANSIT -> CREATED is not allowed (no backward transitions)
        r = await client.post("/api/v1/products/PRD-001/status", json={
            "status": "CREATED",
            "actor_address": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        })
        assert r.status_code == 400

    @pytest.mark.asyncio
    async def test_status_update_nonexistent_product_404(self, client: AsyncClient):
        r = await client.post("/api/v1/products/GHOST/status", json={
            "status": "IN_TRANSIT",
            "actor_address": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        })
        assert r.status_code == 404


# ===========================================================================
# Documents
# ===========================================================================
class TestDocuments:
    @pytest.mark.asyncio
    async def test_upload_document_pdf(self, client: AsyncClient):
        # Create product first
        await client.post("/api/v1/products", json=SAMPLE_PRODUCT)
        r = await client.post(
            "/api/v1/documents/upload",
            files={"file": ("cert.pdf", b"%PDF-test-content", "application/pdf")},
            data={"product_id": "PRD-001"},
        )
        assert r.status_code == 201
        data = r.json()
        assert data["document_hash"].startswith("0x")
        assert len(data["document_hash"]) == 66  # 0x + 64 hex chars
        assert data["file_name"] == "cert.pdf"
        assert data["mime_type"] == "application/pdf"
        assert data["product_id"] == "PRD-001"

    @pytest.mark.asyncio
    async def test_upload_document_png(self, client: AsyncClient):
        r = await client.post(
            "/api/v1/documents/upload",
            files={"file": ("photo.png", b"\x89PNG-fake-data", "image/png")},
        )
        assert r.status_code == 201
        assert r.json()["mime_type"] == "image/png"

    @pytest.mark.asyncio
    async def test_upload_unsupported_type_415(self, client: AsyncClient):
        r = await client.post(
            "/api/v1/documents/upload",
            files={"file": ("script.exe", b"MZ-binary", "application/octet-stream")},
        )
        assert r.status_code == 415
        assert r.json()["error"]["code"] == "INVALID_FILE_TYPE"

    @pytest.mark.asyncio
    async def test_upload_to_nonexistent_product_404(self, client: AsyncClient):
        r = await client.post(
            "/api/v1/documents/upload",
            files={"file": ("cert.pdf", b"%PDF-data", "application/pdf")},
            data={"product_id": "GHOST"},
        )
        assert r.status_code == 404

    @pytest.mark.asyncio
    async def test_verify_document_not_registered(self, client: AsyncClient):
        r = await client.post(
            "/api/v1/documents/verify",
            data={"doc_hash": "0x" + "ab" * 32},
        )
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "NOT_REGISTERED"
        assert data["is_authentic"] is False
        assert data["on_chain_status"]["registered"] is False

    @pytest.mark.asyncio
    async def test_verify_uploaded_document_valid(self, client: AsyncClient):
        # Upload a document
        upload_r = await client.post(
            "/api/v1/documents/upload",
            files={"file": ("cert.pdf", b"%PDF-valid-doc", "application/pdf")},
        )
        doc_hash = upload_r.json()["document_hash"]

        # Verify same hash
        r = await client.post(
            "/api/v1/documents/verify",
            data={"doc_hash": doc_hash},
        )
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "VALID"
        assert data["is_authentic"] is True

    @pytest.mark.asyncio
    async def test_verify_against_product_valid(self, client: AsyncClient):
        # Create product and upload document
        await client.post("/api/v1/products", json=SAMPLE_PRODUCT)
        upload_r = await client.post(
            "/api/v1/documents/upload",
            files={"file": ("cert.pdf", b"%PDF-anchored", "application/pdf")},
            data={"product_id": "PRD-001"},
        )
        doc_hash = upload_r.json()["document_hash"]

        # Anchor it
        await client.post("/api/v1/documents/anchor", json={
            "product_id": "PRD-001",
            "document_hash": doc_hash,
            "tx_hash": "0x" + "ff" * 32,
            "issuer_address": "0x1234567890123456789012345678901234567890",
        })

        # Verify against product
        r = await client.post(
            "/api/v1/products/PRD-001/documents/verify",
            data={"doc_hash": doc_hash},
        )
        assert r.status_code == 200
        assert r.json()["status"] == "VALID"
        assert r.json()["is_authentic"] is True

    @pytest.mark.asyncio
    async def test_verify_against_product_tampered(self, client: AsyncClient):
        # Create and anchor
        await client.post("/api/v1/products", json=SAMPLE_PRODUCT)
        upload_r = await client.post(
            "/api/v1/documents/upload",
            files={"file": ("cert.pdf", b"%PDF-original", "application/pdf")},
            data={"product_id": "PRD-001"},
        )
        doc_hash = upload_r.json()["document_hash"]
        await client.post("/api/v1/documents/anchor", json={
            "product_id": "PRD-001",
            "document_hash": doc_hash,
            "tx_hash": "0x" + "ff" * 32,
            "issuer_address": "0x1234567890123456789012345678901234567890",
        })

        # Verify with a DIFFERENT hash
        r = await client.post(
            "/api/v1/products/PRD-001/documents/verify",
            data={"doc_hash": "0x" + "cc" * 32},
        )
        assert r.status_code == 200
        assert r.json()["status"] == "TAMPERED"
        assert r.json()["is_authentic"] is False

    @pytest.mark.asyncio
    async def test_verify_no_input_400(self, client: AsyncClient):
        r = await client.post("/api/v1/documents/verify")
        assert r.status_code == 400


# ===========================================================================
# Document Anchoring
# ===========================================================================
class TestAnchoring:
    @pytest.mark.asyncio
    async def test_anchor_document(self, client: AsyncClient):
        await client.post("/api/v1/products", json=SAMPLE_PRODUCT)
        r = await client.post("/api/v1/documents/anchor", json={
            "product_id": "PRD-001",
            "document_hash": "0x" + "aa" * 32,
            "tx_hash": "0x" + "bb" * 32,
            "issuer_address": "0x1234567890123456789012345678901234567890",
        })
        assert r.status_code == 200
        data = r.json()
        assert data["success"] is True
        assert data["product_id"] == "PRD-001"

    @pytest.mark.asyncio
    async def test_anchor_nonexistent_product_404(self, client: AsyncClient):
        r = await client.post("/api/v1/documents/anchor", json={
            "product_id": "GHOST",
            "document_hash": "0x" + "aa" * 32,
            "tx_hash": "0x" + "bb" * 32,
            "issuer_address": "0x1234567890123456789012345678901234567890",
        })
        assert r.status_code == 404

    @pytest.mark.asyncio
    async def test_re_anchor_409(self, client: AsyncClient):
        await client.post("/api/v1/products", json=SAMPLE_PRODUCT)
        anchor_payload = {
            "product_id": "PRD-001",
            "document_hash": "0x" + "aa" * 32,
            "tx_hash": "0x" + "bb" * 32,
            "issuer_address": "0x1234567890123456789012345678901234567890",
        }
        await client.post("/api/v1/documents/anchor", json=anchor_payload)
        r = await client.post("/api/v1/documents/anchor", json=anchor_payload)
        assert r.status_code == 409
        assert r.json()["error"]["code"] == "DOCUMENT_ALREADY_ANCHORED"


# ===========================================================================
# QR Code
# ===========================================================================
class TestQRCode:
    @pytest.mark.asyncio
    async def test_generate_qr(self, client: AsyncClient):
        await client.post("/api/v1/products", json=SAMPLE_PRODUCT)
        r = await client.get("/api/v1/products/PRD-001/qr")
        assert r.status_code == 200
        data = r.json()
        assert data["product_id"] == "PRD-001"
        assert "verify/PRD-001" in data["verification_url"]
        assert data["qr_base64"].startswith("data:image/png;base64,")

    @pytest.mark.asyncio
    async def test_qr_nonexistent_product_404(self, client: AsyncClient):
        r = await client.get("/api/v1/products/GHOST/qr")
        assert r.status_code == 404


# ===========================================================================
# ML Risk Score
# ===========================================================================
class TestRiskScore:
    @pytest.mark.asyncio
    async def test_risk_score_authentic(self, client: AsyncClient):
        r = await client.post("/api/v1/ml/risk-score", json={
            "document_hash": "0x" + "ab" * 32,
            "is_authentic_on_chain": True,
        })
        assert r.status_code == 200
        data = r.json()
        assert data["risk_level"] == "LOW"
        assert data["risk_score"] == 0.0
        assert data["tampering_detected"] is False

    @pytest.mark.asyncio
    async def test_risk_score_not_authentic(self, client: AsyncClient):
        r = await client.post("/api/v1/ml/risk-score", json={
            "document_hash": "0x" + "ab" * 32,
            "is_authentic_on_chain": False,
        })
        assert r.status_code == 200
        data = r.json()
        assert data["risk_level"] == "HIGH"
        assert data["risk_score"] >= 75.0
        assert data["tampering_detected"] is True

    @pytest.mark.asyncio
    async def test_risk_score_small_file_flag(self, client: AsyncClient):
        r = await client.post("/api/v1/ml/risk-score", json={
            "document_hash": "0x" + "ab" * 32,
            "is_authentic_on_chain": True,
            "file_size": 50,
        })
        assert r.status_code == 200
        data = r.json()
        assert any("SUSPICIOUS_FILE_SIZE" in reason for reason in data["reasons"])

    @pytest.mark.asyncio
    async def test_risk_score_non_standard_mime(self, client: AsyncClient):
        r = await client.post("/api/v1/ml/risk-score", json={
            "document_hash": "0x" + "ab" * 32,
            "is_authentic_on_chain": True,
            "mime_type": "application/zip",
        })
        assert r.status_code == 200
        data = r.json()
        assert any("NON_STANDARD_MIME_TYPE" in reason for reason in data["reasons"])

    @pytest.mark.asyncio
    async def test_ml_scan_uploaded_file(self, client: AsyncClient):
        file_bytes = b"%PDF-1.7\nSample Trade Certificate\n" + b"A" * 64
        files = {"file": ("test_doc.pdf", file_bytes, "application/pdf")}
        r = await client.post("/api/v1/ml/scan", files=files)
        assert r.status_code == 200
        data = r.json()
        assert "risk_score" in data
        assert "risk_level" in data
        assert "ela_score" in data
        assert "cmfd_score" in data
        assert isinstance(data["reasons"], list)


# ===========================================================================
# Error Response Structure
# ===========================================================================
class TestErrorFormat:
    @pytest.mark.asyncio
    async def test_error_has_structured_fields(self, client: AsyncClient):
        r = await client.get("/api/v1/products/NONEXISTENT")
        assert r.status_code == 404
        err = r.json()["error"]
        assert "code" in err
        assert "message" in err
        assert "request_id" in err
        assert err["request_id"].startswith("req_")

    @pytest.mark.asyncio
    async def test_request_id_in_response_header(self, client: AsyncClient):
        r = await client.get("/api/v1/health")
        assert "X-Request-ID" in r.headers
        assert r.headers["X-Request-ID"].startswith("req_")


# ===========================================================================
# Hashing Service (unit)
# ===========================================================================
class TestHashingService:
    def test_hash_bytes_deterministic(self):
        from app.services.hashing_service import HashingService

        h1 = HashingService.hash_bytes(b"hello world")
        h2 = HashingService.hash_bytes(b"hello world")
        assert h1 == h2
        assert h1.startswith("0x")
        assert len(h1) == 66

    def test_hash_bytes_different_input(self):
        from app.services.hashing_service import HashingService

        h1 = HashingService.hash_bytes(b"hello")
        h2 = HashingService.hash_bytes(b"world")
        assert h1 != h2

    def test_hash_empty_bytes(self):
        from app.services.hashing_service import HashingService

        h = HashingService.hash_bytes(b"")
        assert h.startswith("0x")
        assert len(h) == 66


# ===========================================================================
# Security: Filename Sanitization (unit)
# ===========================================================================
class TestFilenameSanitization:
    def test_sanitize_removes_path_traversal(self):
        from app.core.security import sanitize_filename

        result = sanitize_filename("../../etc/passwd")
        assert ".." not in result
        assert "/" not in result

    def test_sanitize_removes_special_chars(self):
        from app.core.security import sanitize_filename

        result = sanitize_filename("my file (1).pdf")
        # Should not contain spaces or parens
        assert "(" not in result

    def test_sanitize_handles_empty_name(self):
        from app.core.security import sanitize_filename

        result = sanitize_filename("")
        assert "unnamed_document" in result