import { VerificationResult } from './types';
import { SAMPLE_PRODUCTS } from './mockData';
import { computeFileSHA256 } from './crypto';

/**
 * Resolves a computed hash against the local mock registry.
 * Used as the zero-dependency demo fallback when the API is offline.
 */
export function verifyHashAgainstRegistry(
  hash: string,
  presetProductId?: string
): VerificationResult {
  const matchedProduct = presetProductId
    ? SAMPLE_PRODUCTS[presetProductId]
    : Object.values(SAMPLE_PRODUCTS).find(
        (p) => p.documentHash.toLowerCase() === hash.toLowerCase()
      );

  if (matchedProduct) {
    const isAuthentic = matchedProduct.documentHash.toLowerCase() === hash.toLowerCase();
    return {
      status: isAuthentic ? 'VALID' : 'TAMPERED',
      computedHash: hash,
      expectedHash: matchedProduct.documentHash,
      matchedProduct,
      verificationTimestamp: Date.now(),
      executionTimeMs: 0,
    };
  }

  return {
    status: 'NOT_REGISTERED',
    computedHash: hash,
    expectedHash: undefined,
    verificationTimestamp: Date.now(),
    executionTimeMs: 0,
  };
}

/**
 * Hashes a file locally, then verifies against the mock registry.
 */
export async function verifyFileLocally(
  file: File,
  presetProductId?: string
): Promise<VerificationResult & { fileName: string; fileSize: number; mimeType: string }> {
  const { hash, timeMs } = await computeFileSHA256(file);
  const result = verifyHashAgainstRegistry(hash, presetProductId);
  return {
    ...result,
    executionTimeMs: timeMs,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type || 'application/pdf',
  };
}
