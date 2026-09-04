"""ProofRoute backend application entrypoint."""
from fastapi import FastAPI

from .api.v1.documents import router as documents_router

app = FastAPI(title="ProofRoute API", version="0.1.0")
app.include_router(documents_router, prefix="/api/v1")


@app.get("/api/v1/health")
def health() -> dict[str, str]:
    return {"status": "ok", "ml_service": "integrated"}
