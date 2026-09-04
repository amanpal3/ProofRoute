from typing import Optional, Dict, Any
from web3 import Web3
from web3.exceptions import Web3Exception
from app.core.config import settings
from app.core.logging import logger
from app.core.exceptions import BlockchainUnavailableException

# Minimal ABI for ProofRouteRegistry contract
PROOFROUTE_REGISTRY_ABI = [
    {
        "type": "function",
        "name": "productExists",
        "inputs": [{"name": "productId", "type": "string"}],
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "view",
    },
    {
        "type": "function",
        "name": "verifyDocumentHash",
        "inputs": [
            {"name": "productId", "type": "string"},
            {"name": "hashToVerify", "type": "bytes32"},
        ],
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "view",
    },
    {
        "type": "function",
        "name": "getProduct",
        "inputs": [{"name": "productId", "type": "string"}],
        "outputs": [
            {
                "components": [
                    {"name": "productId", "type": "string"},
                    {"name": "name", "type": "string"},
                    {"name": "batchId", "type": "string"},
                    {"name": "manufacturer", "type": "address"},
                    {"name": "origin", "type": "string"},
                    {"name": "destination", "type": "string"},
                    {"name": "createdAt", "type": "uint256"},
                    {"name": "status", "type": "uint8"},
                    {"name": "documentHash", "type": "bytes32"},
                    {"name": "exists", "type": "bool"},
                ],
                "name": "",
                "type": "tuple",
            }
        ],
        "stateMutability": "view",
    },
]


class BlockchainService:
    def __init__(self):
        self.w3 = Web3(Web3.HTTPProvider(settings.RPC_URL))
        self.contract_address = settings.CONTRACT_REGISTRY_ADDRESS

    def is_connected(self) -> bool:
        try:
            return self.w3.is_connected()
        except Exception as e:
            logger.warning(f"Blockchain RPC connectivity check failed: {str(e)}")
            return False

    def get_contract(self):
        if not Web3.is_address(self.contract_address) or self.contract_address == "0x0000000000000000000000000000000000000000":
            return None
        return self.w3.eth.contract(
            address=Web3.to_checksum_address(self.contract_address),
            abi=PROOFROUTE_REGISTRY_ABI,
        )

    def verify_document_hash_on_chain(
        self, product_id: str, document_hash: str
    ) -> Optional[bool]:
        """
        Queries the smart contract to verify if the document hash matches the anchored commitment.
        Returns:
            bool if product exists on-chain and contract is available,
            None if RPC is offline, contract is unconfigured, or product is not yet on-chain (graceful fallback).
        """
        if not self.is_connected():
            logger.info("Blockchain RPC not connected; falling back to off-chain projection verification.")
            return None

        contract = self.get_contract()
        if not contract:
            logger.info("Contract registry address unconfigured; falling back to off-chain projection.")
            return None

        try:
            # Check if product is registered on-chain first
            if not contract.functions.productExists(product_id).call():
                logger.info(f"Product {product_id} not registered on-chain yet; falling back to database projection.")
                return None

            # Convert 0x hex string to bytes32
            hex_clean = document_hash.lower()
            if hex_clean.startswith("0x"):
                hex_clean = hex_clean[2:]
            hash_bytes32 = bytes.fromhex(hex_clean)

            is_valid: bool = contract.functions.verifyDocumentHash(
                product_id, hash_bytes32
            ).call()
            return is_valid
        except Exception as e:
            logger.warning(f"Failed to query on-chain document hash for {product_id} ({str(e)}); falling back to projection.")
            return None


blockchain_service = BlockchainService()
