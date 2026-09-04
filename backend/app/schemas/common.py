from typing import Optional, Dict, Any
from pydantic import BaseModel, ConfigDict, Field


class ErrorDetail(BaseModel):
    code: str = Field(..., description="Machine-readable error code")
    message: str = Field(..., description="Human-readable explanation of the error")
    request_id: str = Field(..., description="Unique request tracing identifier")
    details: Optional[Dict[str, Any]] = Field(default=None, description="Optional diagnostic details")

    model_config = ConfigDict(extra="ignore")


class ErrorResponse(BaseModel):
    error: ErrorDetail


class HealthResponse(BaseModel):
    status: str = "ok"
    environment: str
    database_connected: bool
    blockchain_rpc_connected: bool
    ml_service_connected: bool
    version: str = "1.0.0"
