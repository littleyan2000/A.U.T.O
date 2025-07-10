/**
 * Generates a v4 UUID.
 * Uses the native `crypto.randomUUID()` if available, otherwise falls back to a polyfill.
 * @returns {string} A new v4 UUID.
 */
export function generateUUID(): string {
  // Prefer the native, cryptographically-secure method if available
  if (typeof self !== 'undefined' && self.crypto && self.crypto.randomUUID) {
    return self.crypto.randomUUID();
  }

  // Fallback for environments where crypto.randomUUID is not available
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}