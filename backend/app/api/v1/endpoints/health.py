from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.db.session import get_db
from app.core.config import settings
from app.services.blockchain_service import blockchain_service
from app.schemas.common import HealthResponse
import httpx

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def get_health(session: AsyncSession = Depends(get_db)):
    # 1. Database check
    db_ok = False
    try:
        await session.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        db_ok = False

    # 2. Blockchain RPC check
    rpc_ok = blockchain_service.is_connected()

    # 3. ML Service check
    ml_ok = False
    try:
        async with httpx.AsyncClient(timeout=1.0) as client:
            res = await client.get(f"{settings.ML_SERVICE_URL}/health")
            ml_ok = res.status_code == 200
    except Exception:
        ml_ok = False

    return HealthResponse(
        status="ok" if db_ok else "degraded",
        environment=settings.APP_ENV,
        database_connected=db_ok,
        blockchain_rpc_connected=rpc_ok,
        ml_service_connected=ml_ok,
        version="1.0.0",
    )
