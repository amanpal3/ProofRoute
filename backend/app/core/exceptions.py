from typing import Optional, Any, Dict
from fastapi import HTTPException, status


class ProofRouteException(HTTPException):
    def __init__(
        self,
        status_code: int,
        code: str,
        message: str,
        details: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(status_code=status_code, detail=message)
        self.code = code
        self.message = message
        self.details = details or {}


class ProductNotFoundException(ProofRouteException):
    def __init__(self, product_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            code="PRODUCT_NOT_FOUND",
            message=f"Product with ID '{product_id}' was not found.",
            details={"product_id": product_id},
        )


class DocumentNotFoundException(ProofRouteException):
    def __init__(self, doc_hash: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            code="DOCUMENT_NOT_FOUND",
            message=f"Document with hash '{doc_hash}' was not found.",
            details={"document_hash": doc_hash},
        )


class FileTooLargeException(ProofRouteException):
    def __init__(self, max_size_bytes: int):
        super().__init__(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            code="FILE_TOO_LARGE",
            message=f"File exceeds maximum allowed size of {max_size_bytes} bytes.",
            details={"max_size_bytes": max_size_bytes},
        )


class InvalidFileTypeException(ProofRouteException):
    def __init__(self, content_type: str, allowed_types: list[str]):
        super().__init__(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            code="INVALID_FILE_TYPE",
            message=f"File type '{content_type}' is not supported. Allowed: {allowed_types}",
            details={"content_type": content_type, "allowed": allowed_types},
        )


class BlockchainUnavailableException(ProofRouteException):
    def __init__(self, reason: str = "Blockchain verification is temporarily unavailable."):
        super().__init__(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            code="BLOCKCHAIN_UNAVAILABLE",
            message=reason,
        )


class InvalidStatusTransitionException(ProofRouteException):
    def __init__(self, current_status: str, target_status: str):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            code="INVALID_STATUS_TRANSITION",
            message=f"Cannot transition status from '{current_status}' to '{target_status}'.",
            details={"current_status": current_status, "target_status": target_status},
        )
