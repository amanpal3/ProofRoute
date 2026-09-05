// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {ProofRouteRegistry} from "../src/ProofRouteRegistry.sol";

contract ProofRouteRegistryTest is Test {
    ProofRouteRegistry public registry;

    address public owner = makeAddr("owner");
    address public manufacturer = makeAddr("manufacturer");
    address public operator = makeAddr("logisticsOperator");
    address public unauthorized = makeAddr("unauthorized");

    string constant PRODUCT_ID = "PRD-94821";
    string constant NAME = "BioPharma Cold Vaccine Batch A";
    string constant BATCH_ID = "BATCH-2026-X";
    string constant ORIGIN = "Berlin, Germany";
    string constant DESTINATION = "New York, USA";
    bytes32 constant DOC_HASH = keccak256("Certificate-Of-Authenticity-v1");

    function setUp() public {
        vm.prank(owner);
        registry = new ProofRouteRegistry(owner);

        // Authorize logistics operator
        vm.prank(owner);
        registry.setLogisticsOperator(operator, true);
    }

    // =========================================================================
    // 1. Registration Tests
    // =========================================================================

    function test_RegisterProduct_Success() public {
        vm.prank(manufacturer);
        registry.registerProduct(PRODUCT_ID, NAME, BATCH_ID, ORIGIN, DESTINATION);

        ProofRouteRegistry.Product memory prod = registry.getProduct(PRODUCT_ID);
        assertEq(prod.productId, PRODUCT_ID);
        assertEq(prod.name, NAME);
        assertEq(prod.batchId, BATCH_ID);
        assertEq(prod.manufacturer, manufacturer);
        assertEq(prod.origin, ORIGIN);
        assertEq(prod.destination, DESTINATION);
        assertEq(uint8(prod.status), uint8(ProofRouteRegistry.Status.CREATED));
        assertEq(prod.documentHash, bytes32(0));
        assertTrue(prod.exists);
        assertTrue(registry.productExists(PRODUCT_ID));
    }

    function test_RegisterProduct_EmitsEvent() public {
        vm.expectEmit(true, false, true, true);
        emit ProofRouteRegistry.ProductRegistered(
            PRODUCT_ID, BATCH_ID, manufacturer, ORIGIN, DESTINATION, block.timestamp
        );

        vm.prank(manufacturer);
        registry.registerProduct(PRODUCT_ID, NAME, BATCH_ID, ORIGIN, DESTINATION);
    }

    function test_RegisterProduct_DuplicateReverts() public {
        vm.prank(manufacturer);
        registry.registerProduct(PRODUCT_ID, NAME, BATCH_ID, ORIGIN, DESTINATION);

        vm.expectRevert(abi.encodeWithSelector(ProofRouteRegistry.ProductAlreadyExists.selector, PRODUCT_ID));
        vm.prank(manufacturer);
        registry.registerProduct(PRODUCT_ID, NAME, BATCH_ID, ORIGIN, DESTINATION);
    }

    function test_RegisterProduct_EmptyFieldsRevert() public {
        vm.prank(manufacturer);
        vm.expectRevert(abi.encodeWithSelector(ProofRouteRegistry.InvalidParameter.selector, "productId"));
        registry.registerProduct("", NAME, BATCH_ID, ORIGIN, DESTINATION);

        vm.prank(manufacturer);
        vm.expectRevert(abi.encodeWithSelector(ProofRouteRegistry.InvalidParameter.selector, "name"));
        registry.registerProduct(PRODUCT_ID, "", BATCH_ID, ORIGIN, DESTINATION);
    }

    // =========================================================================
    // 2. Status Machine Lifecycle Tests
    // =========================================================================

    function test_UpdateStatus_CreatedToInTransit_ByManufacturer() public {
        vm.prank(manufacturer);
        registry.registerProduct(PRODUCT_ID, NAME, BATCH_ID, ORIGIN, DESTINATION);

        vm.prank(manufacturer);
        registry.updateStatus(PRODUCT_ID, ProofRouteRegistry.Status.IN_TRANSIT);

        ProofRouteRegistry.Product memory prod = registry.getProduct(PRODUCT_ID);
        assertEq(uint8(prod.status), uint8(ProofRouteRegistry.Status.IN_TRANSIT));
    }

    function test_UpdateStatus_CreatedToInTransit_ByAuthorizedOperator() public {
        vm.prank(manufacturer);
        registry.registerProduct(PRODUCT_ID, NAME, BATCH_ID, ORIGIN, DESTINATION);

        vm.prank(operator);
        registry.updateStatus(PRODUCT_ID, ProofRouteRegistry.Status.IN_TRANSIT);

        ProofRouteRegistry.Product memory prod = registry.getProduct(PRODUCT_ID);
        assertEq(uint8(prod.status), uint8(ProofRouteRegistry.Status.IN_TRANSIT));
    }

    function test_UpdateStatus_InTransitToDelivered() public {
        vm.prank(manufacturer);
        registry.registerProduct(PRODUCT_ID, NAME, BATCH_ID, ORIGIN, DESTINATION);

        vm.prank(operator);
        registry.updateStatus(PRODUCT_ID, ProofRouteRegistry.Status.IN_TRANSIT);

        vm.prank(operator);
        registry.updateStatus(PRODUCT_ID, ProofRouteRegistry.Status.DELIVERED);

        ProofRouteRegistry.Product memory prod = registry.getProduct(PRODUCT_ID);
        assertEq(uint8(prod.status), uint8(ProofRouteRegistry.Status.DELIVERED));
    }

    function test_UpdateStatus_SkipStageReverts() public {
        vm.prank(manufacturer);
        registry.registerProduct(PRODUCT_ID, NAME, BATCH_ID, ORIGIN, DESTINATION);

        // Transition directly from CREATED to DELIVERED must revert
        vm.expectRevert(
            abi.encodeWithSelector(
                ProofRouteRegistry.InvalidStatusTransition.selector,
                ProofRouteRegistry.Status.CREATED,
                ProofRouteRegistry.Status.DELIVERED
            )
        );
        vm.prank(operator);
        registry.updateStatus(PRODUCT_ID, ProofRouteRegistry.Status.DELIVERED);
    }

    function test_UpdateStatus_TerminalStateReverts() public {
        vm.prank(manufacturer);
        registry.registerProduct(PRODUCT_ID, NAME, BATCH_ID, ORIGIN, DESTINATION);

        vm.prank(operator);
        registry.updateStatus(PRODUCT_ID, ProofRouteRegistry.Status.IN_TRANSIT);
        vm.prank(operator);
        registry.updateStatus(PRODUCT_ID, ProofRouteRegistry.Status.DELIVERED);

        // DELIVERED is terminal: cannot transition anywhere
        vm.expectRevert(
            abi.encodeWithSelector(
                ProofRouteRegistry.InvalidStatusTransition.selector,
                ProofRouteRegistry.Status.DELIVERED,
                ProofRouteRegistry.Status.IN_TRANSIT
            )
        );
        vm.prank(operator);
        registry.updateStatus(PRODUCT_ID, ProofRouteRegistry.Status.IN_TRANSIT);
    }

    function test_UpdateStatus_UnauthorizedCallerReverts() public {
        vm.prank(manufacturer);
        registry.registerProduct(PRODUCT_ID, NAME, BATCH_ID, ORIGIN, DESTINATION);

        vm.expectRevert(abi.encodeWithSelector(ProofRouteRegistry.UnauthorizedCaller.selector, unauthorized));
        vm.prank(unauthorized);
        registry.updateStatus(PRODUCT_ID, ProofRouteRegistry.Status.IN_TRANSIT);
    }

    // =========================================================================
    // 3. Cryptographic Document Hash Anchoring Tests
    // =========================================================================

    function test_AttachDocumentHash_Success() public {
        vm.prank(manufacturer);
        registry.registerProduct(PRODUCT_ID, NAME, BATCH_ID, ORIGIN, DESTINATION);

        vm.expectEmit(true, true, false, true);
        emit ProofRouteRegistry.DocumentHashAttached(PRODUCT_ID, DOC_HASH, manufacturer, block.timestamp);

        vm.prank(manufacturer);
        registry.attachDocumentHash(PRODUCT_ID, DOC_HASH);

        ProofRouteRegistry.Product memory prod = registry.getProduct(PRODUCT_ID);
        assertEq(prod.documentHash, DOC_HASH);
    }

    function test_AttachDocumentHash_OnlyManufacturerAllowed() public {
        vm.prank(manufacturer);
        registry.registerProduct(PRODUCT_ID, NAME, BATCH_ID, ORIGIN, DESTINATION);

        vm.expectRevert(abi.encodeWithSelector(ProofRouteRegistry.UnauthorizedCaller.selector, operator));
        vm.prank(operator);
        registry.attachDocumentHash(PRODUCT_ID, DOC_HASH);
    }

    function test_AttachDocumentHash_DoubleAttachReverts() public {
        vm.prank(manufacturer);
        registry.registerProduct(PRODUCT_ID, NAME, BATCH_ID, ORIGIN, DESTINATION);

        vm.prank(manufacturer);
        registry.attachDocumentHash(PRODUCT_ID, DOC_HASH);

        vm.expectRevert(abi.encodeWithSelector(ProofRouteRegistry.DocumentHashAlreadyAttached.selector, PRODUCT_ID));
        vm.prank(manufacturer);
        registry.attachDocumentHash(PRODUCT_ID, keccak256("new-tampered-hash"));
    }

    function test_AttachDocumentHash_ZeroHashReverts() public {
        vm.prank(manufacturer);
        registry.registerProduct(PRODUCT_ID, NAME, BATCH_ID, ORIGIN, DESTINATION);

        vm.expectRevert(ProofRouteRegistry.InvalidHash.selector);
        vm.prank(manufacturer);
        registry.attachDocumentHash(PRODUCT_ID, bytes32(0));
    }

    // =========================================================================
    // 4. Public View Verification Tests
    // =========================================================================

    function test_VerifyDocumentHash_Matches() public {
        vm.prank(manufacturer);
        registry.registerProduct(PRODUCT_ID, NAME, BATCH_ID, ORIGIN, DESTINATION);

        vm.prank(manufacturer);
        registry.attachDocumentHash(PRODUCT_ID, DOC_HASH);

        // Valid match
        assertTrue(registry.verifyDocumentHash(PRODUCT_ID, DOC_HASH));

        // Tampered mismatch
        bytes32 tamperedHash = keccak256("tampered-content");
        assertFalse(registry.verifyDocumentHash(PRODUCT_ID, tamperedHash));
    }

    function test_VerifyDocumentHash_NonExistentOrUnattachedReturnsFalse() public {
        // Non-existent product
        assertFalse(registry.verifyDocumentHash("NON-EXISTENT", DOC_HASH));

        // Registered but no hash attached yet
        vm.prank(manufacturer);
        registry.registerProduct(PRODUCT_ID, NAME, BATCH_ID, ORIGIN, DESTINATION);
        assertFalse(registry.verifyDocumentHash(PRODUCT_ID, DOC_HASH));
    }

    // =========================================================================
    // 5. Admin & Operator Tests
    // =========================================================================

    function test_SetLogisticsOperator_OwnerOnly() public {
        address newOperator = makeAddr("newOp");

        vm.expectRevert();
        vm.prank(unauthorized);
        registry.setLogisticsOperator(newOperator, true);

        vm.prank(owner);
        registry.setLogisticsOperator(newOperator, true);
        assertTrue(registry.isLogisticsOperator(newOperator));

        vm.prank(owner);
        registry.setLogisticsOperator(newOperator, false);
        assertFalse(registry.isLogisticsOperator(newOperator));
    }

    // =========================================================================
    // 6. Property Fuzz Testing
    // =========================================================================

    function testFuzz_VerifyDocumentHash(bytes32 candidateHash) public {
        vm.prank(manufacturer);
        registry.registerProduct(PRODUCT_ID, NAME, BATCH_ID, ORIGIN, DESTINATION);

        vm.prank(manufacturer);
        registry.attachDocumentHash(PRODUCT_ID, DOC_HASH);

        if (candidateHash == DOC_HASH) {
            assertTrue(registry.verifyDocumentHash(PRODUCT_ID, candidateHash));
        } else {
            assertFalse(registry.verifyDocumentHash(PRODUCT_ID, candidateHash));
        }
    }
}
