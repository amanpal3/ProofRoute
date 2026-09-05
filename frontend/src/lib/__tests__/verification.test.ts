import { describe, it, expect } from 'vitest';
import { verifyHashAgainstRegistry } from '../verification';

describe('Verification Fallback Logic', () => {
  it('returns VALID when hash matches authentic product PR-8829-X', () => {
    const authenticHash = '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069';
    const result = verifyHashAgainstRegistry(authenticHash, 'PR-8829-X');

    expect(result.status).toBe('VALID');
    expect(result.matchedProduct?.id).toBe('PR-8829-X');
    expect(result.computedHash).toBe(authenticHash);
  });

  it('returns TAMPERED when hash does not match product record', () => {
    const alteredHash = '0x0000000000000000000000000000000000000000000000000000000000000000';
    const result = verifyHashAgainstRegistry(alteredHash, 'PR-8829-X');

    expect(result.status).toBe('TAMPERED');
    expect(result.matchedProduct?.id).toBe('PR-8829-X');
  });

  it('returns NOT_REGISTERED for unknown product ID and hash', () => {
    const unknownHash = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd';
    const result = verifyHashAgainstRegistry(unknownHash, 'PR-UNKNOWN-999');

    expect(result.status).toBe('NOT_REGISTERED');
    expect(result.matchedProduct).toBeUndefined();
  });
});
