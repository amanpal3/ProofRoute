from typing import List, Optional, Dict, Any
import sys
from pathlib import Path
import httpx
from app.core.config import settings
from app.core.logging import logger
from app.schemas.verification import RiskAssessment

REPOSITORY_ROOT = Path(__file__).resolve().parents[3]
if str(REPOSITORY_ROOT) not in sys.path:
    sys.path.insert(0, str(REPOSITORY_ROOT))

from ml.src.integration import to_backend_response


class RiskService:
    @classmethod
    async def evaluate_risk(
        cls,
        document_hash: str,
        is_authentic_on_chain: bool,
        file_size: Optional[int] = None,
        mime_type: Optional[str] = None,
        product_status: Optional[str] = None,
        document_content: Optional[bytes] = None,
    ) -> RiskAssessment:
        """
        Evaluates document risk. First attempts to contact the ML microservice.
        If unreachable, gracefully degrades to a deterministic heuristic rule engine.
        """
        # 1. Run the local ML pipeline when document bytes are available.
        ml_result = cls._query_local_ml(
            document_hash=document_hash,
            is_authentic_on_chain=is_authentic_on_chain,
            file_size=file_size,
            mime_type=mime_type,
            document_content=document_content,
        )
        if ml_result:
            return ml_result

        # 2. Try external ML microservice.
        ml_result = await cls._query_ml_service(
            document_hash=document_hash,
            is_authentic_on_chain=is_authentic_on_chain,
            file_size=file_size,
            mime_type=mime_type,
        )
        if ml_result:
            return ml_result

        # 3. Rule-based heuristic fallback
        return cls._evaluate_heuristic_rules(
            is_authentic_on_chain=is_authentic_on_chain,
            file_size=file_size,
            mime_type=mime_type,
            product_status=product_status,
        )

    @classmethod
    def _query_local_ml(
        cls,
        document_hash: str,
        is_authentic_on_chain: bool,
        file_size: Optional[int],
        mime_type: Optional[str],
        document_content: Optional[bytes],
    ) -> Optional[RiskAssessment]:
        try:
            if document_content is None:
                return None

            from ml.src.pipeline import analyze_document

            result = analyze_document(
                document_content,
                is_authentic_on_chain=is_authentic_on_chain,
                file_size=file_size,
                mime_type=mime_type,
            )
            return RiskAssessment(**to_backend_response(result))
        except Exception as error:
            logger.info(f"Local ML pipeline unavailable ({error}); trying configured ML service.")
            return None

    @classmethod
    async def _query_ml_service(
        cls,
        document_hash: str,
        is_authentic_on_chain: bool,
        file_size: Optional[int],
        mime_type: Optional[str],
    ) -> Optional[RiskAssessment]:
        try:
            async with httpx.AsyncClient(timeout=2.0) as client:
                res = await client.post(
                    f"{settings.ML_SERVICE_URL}/ml/risk-score",
                    json={
                        "document_hash": document_hash,
                        "is_authentic_on_chain": is_authentic_on_chain,
                        "file_size": file_size,
                        "mime_type": mime_type,
                    },
                )
                if res.status_code == 200:
                    data = res.json()
                    return RiskAssessment(
                        risk_score=float(data.get("risk_score", 0.0)),
                        risk_level=data.get("risk_level", "LOW"),
                        tampering_detected=bool(data.get("tampering_detected", False)),
                        confidence=float(data.get("confidence", 0.95)),
                        reasons=data.get("reasons", ["ML forensics scan completed."]),
                        model_version=data.get("model_version", settings.RISK_MODEL_VERSION),
                        ela_score=data.get("ela_score"),
                        cmfd_score=data.get("cmfd_score"),
                        font_anomaly_detected=data.get("font_anomaly_detected", False),
                    )
        except Exception as e:
            logger.info(f"ML service unreachable ({str(e)}); utilizing rule-based risk heuristics.")
            return None
        return None

    @classmethod
    def _evaluate_heuristic_rules(
        cls,
        is_authentic_on_chain: bool,
        file_size: Optional[int] = None,
        mime_type: Optional[str] = None,
        product_status: Optional[str] = None,
    ) -> RiskAssessment:
        score = 0.0
        reasons: List[str] = []
        tampering = False

        if not is_authentic_on_chain:
            score += 85.0
            reasons.append("CRYPTOGRAPHIC_HASH_MISMATCH: Document bytes do not match on-chain commitment.")
            tampering = True
        else:
            reasons.append("ON_CHAIN_PROVENANCE_VERIFIED: Document hash matches immutable on-chain record.")

        if file_size is not None and file_size < 100:
            score += 15.0
            reasons.append("SUSPICIOUS_FILE_SIZE: Uploaded document file size is abnormally small.")

        if mime_type and mime_type not in ["application/pdf", "image/png", "image/jpeg"]:
            score += 20.0
            reasons.append("NON_STANDARD_MIME_TYPE: File does not match typical shipping certificate format.")

        # Cap score between 0.0 and 100.0
        score = min(max(score, 0.0), 100.0)

        # Categorize level
        if score >= settings.RISK_SCORE_THRESHOLD:
            risk_level = "HIGH"
        elif score >= 35.0:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        confidence = 0.99 if is_authentic_on_chain else 0.95

        return RiskAssessment(
            risk_score=score,
            risk_level=risk_level,
            tampering_detected=tampering,
            confidence=confidence,
            reasons=reasons,
            model_version=f"{settings.RISK_MODEL_VERSION} (heuristic fallback)",
        )
