export type DocumentStatus = 'VALID' | 'TAMPERED' | 'NOT_REGISTERED' | 'UNAVAILABLE';

export type ShipmentMilestoneStatus = 'CREATED' | 'IN_TRANSIT' | 'DELIVERED';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface BlockchainRecord {
  txHash: string;
  blockNumber: number;
  contractAddress: string;
  issuerAddress: string;
  timestamp: number;
  network: string;
  status: 'CONFIRMED' | 'PENDING' | 'FAILED';
}

export interface RiskAssessment {
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  tamperingDetected: boolean;
  confidence: number; // 0.0 - 1.0
  reasons: string[];
  elaScore?: number;
  cmfdScore?: number;
  fontAnomalyDetected?: boolean;
}

export interface ShipmentMilestone {
  id: string;
  status: ShipmentMilestoneStatus;
  title: string;
  location: string;
  timestamp: string;
  txHash?: string;
  operator: string;
  note?: string;
  completed: boolean;
  current: boolean;
}

export interface ProductItem {
  id: string;
  batchNumber: string;
  name: string;
  category: string;
  manufacturer: string;
  originCountry: string;
  destinationCountry: string;
  manufactureDate: string;
  expiryDate?: string;
  documentHash: string;
  documentName: string;
  documentMime: string;
  fileSizeBytes: number;
  status: ShipmentMilestoneStatus;
  onChainRecord: BlockchainRecord;
  riskAssessment: RiskAssessment;
  milestones: ShipmentMilestone[];
}

export interface VerificationResult {
  status: DocumentStatus;
  computedHash: string;
  expectedHash?: string;
  matchedProduct?: ProductItem;
  verificationTimestamp: number;
  executionTimeMs: number;
}
