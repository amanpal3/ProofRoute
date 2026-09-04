// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ProofRouteRegistry
 * @notice Core registry for product provenance, milestone tracking, and cryptographic document hash anchoring.
 * @dev Enforces strict Checks-Effects-Interactions (CEI), custom errors, and event emission for off-chain indexing.
 */
contract ProofRouteRegistry is Ownable {
    // =========================================================================
    // Types & Enums
    // =========================================================================

    enum Status {
        CREATED,
        IN_TRANSIT,
        DELIVERED
    }

    struct Product {
        string productId; // Public unique product identifier
        string name; // Human-readable product name
        string batchId; // Manufacturing batch identifier
        address manufacturer; // EVM address of product creator
        string origin; // Origin country / facility
        string destination; // Destination facility
        uint256 createdAt; // Block timestamp of registration
        Status status; // Current shipment status
        bytes32 documentHash; // Anchored 32-byte SHA-256 certificate hash
        bool exists; // Product registration existence flag
    }

    // =========================================================================
    // State Variables
    // =========================================================================

    /// @dev Internal mapping from productId to Product struct
    mapping(string => Product) private _products;

    /// @notice Authorized logistics operators permitted to advance milestone statuses
    mapping(address => bool) public isLogisticsOperator;

    // =========================================================================
    // Events (Indexed for PostgreSQL Off-Chain Indexer)
    // =========================================================================

    event ProductRegistered(
        string indexed productId,
        string batchId,
        address indexed manufacturer,
        string origin,
        string destination,
        uint256 timestamp
    );

    event StatusUpdated(
        string indexed productId, Status oldStatus, Status newStatus, address indexed actor, uint256 timestamp
    );

    event DocumentHashAttached(
        string indexed productId, bytes32 indexed documentHash, address indexed actor, uint256 timestamp
    );

    event LogisticsOperatorUpdated(address indexed operator, bool authorized);

    // =========================================================================
    // Custom Errors
    // =========================================================================

    error ProductAlreadyExists(string productId);
    error ProductDoesNotExist(string productId);
    error UnauthorizedCaller(address caller);
    error InvalidStatusTransition(Status currentStatus, Status nextStatus);
    error InvalidParameter(string paramName);
    error DocumentHashAlreadyAttached(string productId);
    error InvalidZeroAddress();
    error InvalidHash();

    // =========================================================================
    // Modifiers
    // =========================================================================

    modifier onlyProductExists(string calldata productId) {
        if (!_products[productId].exists) {
            revert ProductDoesNotExist(productId);
        }
        _;
    }

    // =========================================================================
    // Constructor
    // =========================================================================

    /**
     * @param initialOwner Address of the registry administrator/owner
     */
    constructor(address initialOwner) Ownable(initialOwner) {
        if (initialOwner == address(0)) {
            revert InvalidZeroAddress();
        }
    }

    // =========================================================================
    // Admin Functions
    // =========================================================================

    /**
     * @notice Grants or revokes permission for a logistics operator to advance shipment milestones.
     * @param operator The EVM address of the logistics operator.
     * @param authorized True to authorize, false to revoke.
     */
    function setLogisticsOperator(address operator, bool authorized) external onlyOwner {
        if (operator == address(0)) {
            revert InvalidZeroAddress();
        }
        isLogisticsOperator[operator] = authorized;
        emit LogisticsOperatorUpdated(operator, authorized);
    }

    // =========================================================================
    // Core Lifecycle Functions
    // =========================================================================

    /**
     * @notice Registers a new product batch on the blockchain.
     * @param productId Unique identifier (e.g., "PRD-94821")
     * @param name Product name
     * @param batchId Manufacturing batch code
     * @param origin Country or facility of origin
     * @param destination Final destination facility/country
     */
    function registerProduct(
        string calldata productId,
        string calldata name,
        string calldata batchId,
        string calldata origin,
        string calldata destination
    ) external {
        if (bytes(productId).length == 0) revert InvalidParameter("productId");
        if (bytes(name).length == 0) revert InvalidParameter("name");
        if (bytes(batchId).length == 0) revert InvalidParameter("batchId");
        if (bytes(origin).length == 0) revert InvalidParameter("origin");
        if (bytes(destination).length == 0) revert InvalidParameter("destination");

        if (_products[productId].exists) {
            revert ProductAlreadyExists(productId);
        }

        Product storage product = _products[productId];
        product.productId = productId;
        product.name = name;
        product.batchId = batchId;
        product.manufacturer = msg.sender;
        product.origin = origin;
        product.destination = destination;
        product.createdAt = block.timestamp;
        product.status = Status.CREATED;
        product.documentHash = bytes32(0);
        product.exists = true;

        emit ProductRegistered(productId, batchId, msg.sender, origin, destination, block.timestamp);
    }

    /**
     * @notice Updates the shipment status along the unidirectional lifecycle:
     *         CREATED -> IN_TRANSIT -> DELIVERED
     * @dev Callable by the registered manufacturer or an authorized logistics operator.
     * @param productId Unique identifier of the product.
     * @param newStatus Target status to transition into.
     */
    function updateStatus(string calldata productId, Status newStatus) external onlyProductExists(productId) {
        Product storage product = _products[productId];

        // Access control: Caller must be the manufacturer or authorized logistics operator
        if (msg.sender != product.manufacturer && !isLogisticsOperator[msg.sender]) {
            revert UnauthorizedCaller(msg.sender);
        }

        Status currentStatus = product.status;

        // Enforce strictly unidirectional state machine
        if (currentStatus == Status.CREATED && newStatus == Status.IN_TRANSIT) {
            product.status = Status.IN_TRANSIT;
        } else if (currentStatus == Status.IN_TRANSIT && newStatus == Status.DELIVERED) {
            product.status = Status.DELIVERED;
        } else {
            revert InvalidStatusTransition(currentStatus, newStatus);
        }

        emit StatusUpdated(productId, currentStatus, newStatus, msg.sender, block.timestamp);
    }

    /**
     * @notice Anchors a 32-byte SHA-256 document hash to the product record.
     * @dev Can only be called once by the manufacturer of the product.
     * @param productId Unique identifier of the product.
     * @param documentHash 32-byte SHA-256 hash of the off-chain certificate.
     */
    function attachDocumentHash(string calldata productId, bytes32 documentHash) external onlyProductExists(productId) {
        Product storage product = _products[productId];

        // Access control: Caller must be the registered manufacturer
        if (msg.sender != product.manufacturer) {
            revert UnauthorizedCaller(msg.sender);
        }

        if (documentHash == bytes32(0)) {
            revert InvalidHash();
        }

        if (product.documentHash != bytes32(0)) {
            revert DocumentHashAlreadyAttached(productId);
        }

        product.documentHash = documentHash;

        emit DocumentHashAttached(productId, documentHash, msg.sender, block.timestamp);
    }

    // =========================================================================
    // View & Getter Functions (Wallet-Less Verification)
    // =========================================================================

    /**
     * @notice Public verification helper returning whether a candidate SHA-256 hash matches the anchored hash.
     * @param productId Unique identifier of the product.
     * @param hashToVerify Candidate 32-byte SHA-256 hash to verify.
     * @return True if hash matches, false otherwise.
     */
    function verifyDocumentHash(string calldata productId, bytes32 hashToVerify) external view returns (bool) {
        if (!_products[productId].exists || _products[productId].documentHash == bytes32(0)) {
            return false;
        }
        return _products[productId].documentHash == hashToVerify;
    }

    /**
     * @notice Retrieves full product details.
     * @param productId Unique product identifier.
     * @return Product struct containing all registration and status metadata.
     */
    function getProduct(string calldata productId) external view onlyProductExists(productId) returns (Product memory) {
        return _products[productId];
    }

    /**
     * @notice Helper to check if a product exists.
     * @param productId Unique product identifier.
     */
    function productExists(string calldata productId) external view returns (bool) {
        return _products[productId].exists;
    }
}
