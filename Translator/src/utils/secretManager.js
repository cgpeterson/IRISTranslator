/**
 * SecretManager - Handles encryption/decryption of API keys using SubtleCrypto
 * Stores encrypted credentials in localStorage
 * 
 * SECURITY NOTE: This implementation uses a hardcoded password combined with a random salt
 * for key derivation. This provides obfuscation and protection against casual access, but
 * is not secure against determined attackers with repository access. The encryption primarily
 * protects against:
 * - Casual browser inspection of localStorage
 * - Accidental exposure in screenshots or logs
 * - Basic XSS attacks that read localStorage
 * 
 * For production use cases requiring stronger security, consider:
 * - Requiring users to set a master password on first use
 * - Using browser-specific entropy for key derivation
 * - Implementing a backend service to manage credentials
 */

const STORAGE_PREFIX = 'iris_encrypted_';
const SALT_KEY = 'iris_salt';

class SecretManager {
  constructor() {
    this.encoder = new TextEncoder();
    this.decoder = new TextDecoder();
    this.salt = this.getOrCreateSalt();
  }

  /**
   * Get or create a random salt for encryption
   */
  getOrCreateSalt() {
    let salt = localStorage.getItem(SALT_KEY);
    if (!salt) {
      const randomSalt = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      localStorage.setItem(SALT_KEY, randomSalt);
      salt = randomSalt;
    }
    return salt;
  }

  /**
   * Derive an encryption key from a password and salt
   */
  async deriveKey(password) {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      this.encoder.encode(password + this.salt),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: this.encoder.encode(this.salt),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt a string value
   */
  async encrypt(plaintext, password = 'iris-translator-secret-v1') {
    if (!plaintext) return null;

    try {
      const key = await this.deriveKey(password);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        this.encoder.encode(plaintext)
      );

      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);

      // Convert to base64 for storage
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption failed:', error?.name || 'Unknown error');
      return null;
    }
  }

  /**
   * Decrypt a string value
   */
  async decrypt(ciphertext, password = 'iris-translator-secret-v1') {
    if (!ciphertext) return null;

    try {
      const key = await this.deriveKey(password);
      
      // Convert from base64
      const combined = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
      
      // Extract IV and encrypted data
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      );

      return this.decoder.decode(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error?.name || 'Unknown error');
      return null;
    }
  }

  /**
   * Store an encrypted API key
   */
  async setApiKey(provider, apiKey) {
    if (!apiKey) {
      localStorage.removeItem(STORAGE_PREFIX + provider);
      return;
    }

    const encrypted = await this.encrypt(apiKey);
    if (encrypted) {
      localStorage.setItem(STORAGE_PREFIX + provider, encrypted);
    }
  }

  /**
   * Retrieve and decrypt an API key
   */
  async getApiKey(provider) {
    const encrypted = localStorage.getItem(STORAGE_PREFIX + provider);
    if (!encrypted) return null;
    return await this.decrypt(encrypted);
  }

  /**
   * Check if an API key exists for a provider
   */
  hasApiKey(provider) {
    return localStorage.getItem(STORAGE_PREFIX + provider) !== null;
  }

  /**
   * Clear a specific provider's API key
   */
  clearApiKey(provider) {
    localStorage.removeItem(STORAGE_PREFIX + provider);
  }

  /**
   * Clear all stored API keys
   */
  clearAllApiKeys() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * Get all providers that have stored keys
   */
  getStoredProviders() {
    const keys = Object.keys(localStorage);
    return keys
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .map(key => key.replace(STORAGE_PREFIX, ''));
  }
}

export const secretManager = new SecretManager();
