import { useState, useEffect } from 'react';
import { encodeBase64, decodeBase64 } from '@/utils/base64';

/**
 * Custom hook for Base64 encoding and decoding
 * @returns {Object} - State and handlers for Base64 operations
 */
export function useBase64() {
  const [plainText, setPlainText] = useState('');
  const [base64Text, setBase64Text] = useState('');

  // Automatically encode when plain text changes
  useEffect(() => {
    const encoded = encodeBase64(plainText);
    if (encoded !== base64Text) {
      setBase64Text(encoded);
    }
  }, [plainText, base64Text]);

  // Handle Base64 text changes (decode to plain text)
  const handleBase64Change = (newBase64) => {
    setBase64Text(newBase64);
    setPlainText(decodeBase64(newBase64));
  };

  return {
    plainText,
    setPlainText,
    base64Text,
    handleBase64Change,
  };
}
