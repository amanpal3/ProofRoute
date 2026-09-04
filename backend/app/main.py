"""
ProofRoute Backend — FastAPI Application Entrypoint

Wires together all routers, middleware (CORS, request-ID, error handling),
and the startup lifecycle (DB table creation for dev/test).
"""

import uuid
from contextlib import asynccontextmanager

# pyrefly: ignore [missing-import]
from fastapi import FastAPI, Request
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.logging import logger, request_id_ctx
from app.core.exceptions import ProofRouteException
from app.db.session import init_db

# Import all models so SQLAlchemy metadata is populated before create_all
import app.models  # noqa: F401

from app.api.v1.endpoints import health, products, documents, qr, risk


# ---------------------------------------------------------------------------
# Lifespan: startup / shutdown
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(application: FastAPI):
    """Create tables on startup (dev/test). Production uses Alembic migrations."""
    logger.info("Starting ProofRoute backend…")
    await init_db()
    logger.info("Database tables verified / created.")
    yield
    logger.info("Shutting down ProofRoute backend.")


# ---------------------------------------------------------------------------
# Application factory
# ---------------------------------------------------------------------------
app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)


# ---------------------------------------------------------------------------
# Middleware
# ---------------------------------------------------------------------------

# 1. CORS — uses origins from settings; locked down in production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 2. Request-ID middleware — populates the context-var consumed by the logger.
@app.middleware("http")
async def request_id_middleware(request: Request, call_next):
    rid = request.headers.get("X-Request-ID", f"req_{uuid.uuid4().hex[:12]}")
    request_id_ctx.set(rid)
    response = await call_next(request)
    response.headers["X-Request-ID"] = rid
    return response


# ---------------------------------------------------------------------------
# Global exception handlers
# ---------------------------------------------------------------------------
@app.exception_handler(ProofRouteException)
async def proofroute_exception_handler(request: Request, exc: ProofRouteException):
    """Return structured JSON for all ProofRoute domain errors."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "request_id": request_id_ctx.get(),
                "details": exc.details if exc.details else None,
            }
        },
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    """Catch-all: log the real error, return a safe generic message."""
    logger.error(
        "Unhandled exception at %s: %s",
        str(request.url),
        str(exc),
        exc_info=True,
    )
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An unexpected internal error occurred.",
                "request_id": request_id_ctx.get(),
                "details": None,
            }
        },
    )


# ---------------------------------------------------------------------------
# Register routers under /api/v1
# ---------------------------------------------------------------------------
api_prefix = settings.API_V1_PREFIX  # "/api/v1"

# Health check available at both /health and /api/v1/health
app.include_router(health.router)
app.include_router(health.router,    prefix=api_prefix)
app.include_router(products.router,  prefix=api_prefix)
app.include_router(documents.router, prefix=api_prefix)
app.include_router(qr.router,       prefix=api_prefix)
app.include_router(risk.router,     prefix=api_prefix)


# ---------------------------------------------------------------------------
# Root redirect (convenience)
# ---------------------------------------------------------------------------
@app.get("/", include_in_schema=False)
async def root():
    return {"message": "ProofRoute Backend API", "docs": "/docs"}
