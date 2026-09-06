// Auto-generated ABI from ProofRouteRegistry.sol build artifacts
export const PROOFROUTE_REGISTRY_ABI = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "initialOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "attachDocumentHash",
    "inputs": [
      {
        "name": "productId",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "documentHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getProduct",
    "inputs": [
      {
        "name": "productId",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct ProofRouteRegistry.Product",
        "components": [
          {
            "name": "productId",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "name",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "batchId",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "manufacturer",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "origin",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "destination",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "createdAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "status",
            "type": "uint8",
            "internalType": "enum ProofRouteRegistry.Status"
          },
          {
            "name": "documentHash",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "exists",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isLogisticsOperator",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "productExists",
    "inputs": [
      {
        "name": "productId",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "registerProduct",
    "inputs": [
      {
        "name": "productId",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "batchId",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "origin",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "destination",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setLogisticsOperator",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "authorized",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateStatus",
    "inputs": [
      {
        "name": "productId",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "newStatus",
        "type": "uint8",
        "internalType": "enum ProofRouteRegistry.Status"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "verifyDocumentHash",
    "inputs": [
      {
        "name": "productId",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "hashToVerify",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "DocumentHashAttached",
    "inputs": [
      {
        "name": "productId",
        "type": "string",
        "indexed": true,
        "internalType": "string"
      },
      {
        "name": "documentHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "actor",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LogisticsOperatorUpdated",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "authorized",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ProductRegistered",
    "inputs": [
      {
        "name": "productId",
        "type": "string",
        "indexed": true,
        "internalType": "string"
      },
      {
        "name": "batchId",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "manufacturer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "origin",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "destination",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "StatusUpdated",
    "inputs": [
      {
        "name": "productId",
        "type": "string",
        "indexed": true,
        "internalType": "string"
      },
      {
        "name": "oldStatus",
        "type": "uint8",
        "indexed": false,
        "internalType": "enum ProofRouteRegistry.Status"
      },
      {
        "name": "newStatus",
        "type": "uint8",
        "indexed": false,
        "internalType": "enum ProofRouteRegistry.Status"
      },
      {
        "name": "actor",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "DocumentHashAlreadyAttached",
    "inputs": [
      {
        "name": "productId",
        "type": "string",
        "internalType": "string"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidHash",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidParameter",
    "inputs": [
      {
        "name": "paramName",
        "type": "string",
        "internalType": "string"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidStatusTransition",
    "inputs": [
      {
        "name": "currentStatus",
        "type": "uint8",
        "internalType": "enum ProofRouteRegistry.Status"
      },
      {
        "name": "nextStatus",
        "type": "uint8",
        "internalType": "enum ProofRouteRegistry.Status"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidZeroAddress",
    "inputs": []
  },
  {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ProductAlreadyExists",
    "inputs": [
      {
        "name": "productId",
        "type": "string",
        "internalType": "string"
      }
    ]
  },
  {
    "type": "error",
    "name": "ProductDoesNotExist",
    "inputs": [
      {
        "name": "productId",
        "type": "string",
        "internalType": "string"
      }
    ]
  },
  {
    "type": "error",
    "name": "UnauthorizedCaller",
    "inputs": [
      {
        "name": "caller",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
] as const;

export const PROOFROUTE_REGISTRY_ADDRESS =
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`) ||
  "0x0000000000000000000000000000000000000000";

export enum BlockchainStatus {
  CREATED = 0,
  IN_TRANSIT = 1,
  DELIVERED = 2,
}
