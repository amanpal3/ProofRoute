import logging
import sys
import json
from datetime import datetime, timezone
from contextvars import ContextVar

# Context variable to track the current request ID across async calls
request_id_ctx: ContextVar[str] = ContextVar("request_id", default="req_system")


class JSONFormatter(logging.Formatter):
    """
    Format logs as structured JSON objects for modern observability.
    Redacts sensitive keys to prevent credential leakage.
    """
    SENSITIVE_KEYS = {"private_key", "password", "token", "secret", "authorization"}

    def format(self, record: logging.LogRecord) -> str:
        log_data = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "request_id": request_id_ctx.get(),
        }

        # Include custom extra attributes if provided
        if hasattr(record, "extra_fields"):
            for k, v in record.extra_fields.items():
                if k.lower() in self.SENSITIVE_KEYS:
                    log_data[k] = "[REDACTED]"
                else:
                    log_data[k] = v

        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)

        return json.dumps(log_data)


def setup_logging(debug: bool = False) -> logging.Logger:
    logger = logging.getLogger("proofroute")
    logger.setLevel(logging.DEBUG if debug else logging.INFO)

    # Avoid duplicate handlers if setup is called multiple times
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(JSONFormatter())
        logger.addHandler(handler)

    return logger


logger = setup_logging()
