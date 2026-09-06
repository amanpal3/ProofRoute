import { describe, it, expect } from 'vitest';
import { truncateHash, computeTextSHA256 } from '../crypto';

describe('Crypto Utilities', () => {
  it('truncates hash cleanly with default characters', () => {
    const fullHash = '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069';
    const truncated = truncateHash(fullHash);
    expect(truncated).toBe('0x7f83b1...126d9069');
  });

  it('handles short or empty strings gracefully in truncateHash', () => {
    expect(truncateHash('')).toBe('');
    expect(truncateHash('0x1234')).toBe('0x1234');
  });

  it('computes deterministic SHA-256 for text', async () => {
    const hash = await computeTextSHA256('ProofRoute Verification');
    expect(hash).toMatch(/^0x[a-f0-9]{64}$/);
  });
});
