import os
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "ProofRoute Backend Services"
    APP_ENV: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    SECRET_KEY: str = "proofroute-insecure-dev-secret-change-in-prod"
    API_V1_PREFIX: str = "/api/v1"
    
    # CORS
    ALLOWED_ORIGINS: Union[List[str], str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return ["*"] if cls.model_fields.get("DEBUG") else []

    # Database
    # Default to async sqlite for seamless local out-of-the-box development & testing,
    # or PostgreSQL when DATABASE_URL is configured (e.g. postgresql+asyncpg://...)
    DATABASE_URL: str = "sqlite+aiosqlite:///./proofroute.db"

    # Storage
    STORAGE_PROVIDER: str = "local"
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB default

    # Web3 / Blockchain
    RPC_URL: str = "http://127.0.0.1:8545"
    CHAIN_ID: int = 31337
    CONTRACT_REGISTRY_ADDRESS: str = "0x0000000000000000000000000000000000000000"
    DEPLOYER_PRIVATE_KEY: str = ""

    # ML & Forensics
    ML_SERVICE_URL: str = "http://localhost:8001"
    RISK_MODEL_VERSION: str = "v0.1.0-rules"
    RISK_SCORE_THRESHOLD: float = 75.0
    OCR_CONFIDENCE_THRESHOLD: float = 0.85

    # Verification URL base for QR generation
    PUBLIC_APP_URL: str = "http://localhost:3000"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
