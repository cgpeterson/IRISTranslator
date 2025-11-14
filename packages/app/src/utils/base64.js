/**
 * Encode plain text to Base64
 * @param {string} text - Plain text to encode
 * @returns {string} - Base64 encoded string or error message
 */
export function encodeBase64(text) {
  try {
    if (!text || text.trim() === '') {
      return '';
    }
    // Use TextEncoder for proper UTF-8 handling (replaces deprecated unescape)
    return btoa(String.fromCharCode(...new TextEncoder().encode(text)));
  } catch (error) {
    console.error('Encoding error:', error);
    return 'Error: Invalid input for encoding.';
  }
}

/**
 * Decode Base64 to plain text
 * @param {string} text - Base64 encoded string
 * @returns {string} - Decoded plain text or error message
 */
export function decodeBase64(text) {
  try {
    if (!text || text.trim() === '') {
      return '';
    }
    // Use TextDecoder for proper UTF-8 handling (replaces deprecated escape)
    return new TextDecoder().decode(Uint8Array.from(atob(text), c => c.charCodeAt(0)));
  } catch (error) {
    console.error('Decoding error:', error);
    return 'Error: Invalid Base64 string.';
  }
}
