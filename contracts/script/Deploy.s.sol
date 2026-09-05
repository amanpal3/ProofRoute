// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {ProofRouteRegistry} from "../src/ProofRouteRegistry.sol";

contract DeployProofRouteRegistry is Script {
    function run() external returns (ProofRouteRegistry) {
        // Retrieve deployer private key from environment or fallback to Anvil account 0
        uint256 deployerPrivateKey;
        try vm.envUint("DEPLOYER_PRIVATE_KEY") returns (uint256 key) {
            deployerPrivateKey = key;
        } catch {
            // Default Anvil Account 0 private key for local development
            deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
        }

        address deployer = vm.addr(deployerPrivateKey);
        console.log("Deploying ProofRouteRegistry with address:", deployer);

        vm.startBroadcast(deployerPrivateKey);

        ProofRouteRegistry registry = new ProofRouteRegistry(deployer);

        vm.stopBroadcast();

        console.log("ProofRouteRegistry deployed successfully at:", address(registry));

        return registry;
    }
}
