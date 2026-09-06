/**
 * Client-Side In-Browser Cryptographic Hashing
 * Computes SHA-256 hash using the native browser WebCrypto API.
 * Ensures privacy: documents never leave the browser to compute hashes.
 */
export async function computeFileSHA256(file: File): Promise<{ hash: string; timeMs: number }> {
  const start = performance.now();
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hexHash = '0x' + hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  const timeMs = Math.round((performance.now() - start) * 10) / 10;
  return { hash: hexHash, timeMs };
}

/**
 * Computes SHA-256 hash for raw text strings
 */
export async function computeTextSHA256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return '0x' + hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Formats a long hash or address for elegant UI display
 * e.g., 0x7f83...9069
 */
export function truncateHash(hash: string, startChars = 8, endChars = 8): string {
  if (!hash) return '';
  if (hash.length <= startChars + endChars + 3) return hash;
  return `${hash.slice(0, startChars)}...${hash.slice(-endChars)}`;
}
