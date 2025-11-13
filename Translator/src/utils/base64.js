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
    return btoa(unescape(encodeURIComponent(text)));
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
    return decodeURIComponent(escape(atob(text)));
  } catch (error) {
    console.error('Decoding error:', error);
    return 'Error: Invalid Base64 string.';
  }
}
