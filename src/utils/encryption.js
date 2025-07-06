// 🔐 Advanced Encryption Utilities for SentraBASE
// Healthcare-grade encryption with AES-256-GCM and key management

import { securityLogger } from './security';
import { SECURITY_EVENTS, RISK_LEVELS } from '../config/security';

/**
 * Advanced Encryption Class
 * Implements AES-256-GCM encryption with proper key management
 */
class AdvancedEncryption {
  constructor() {
    this.algorithm = 'AES-GCM';
    this.keyLength = 256;
    this.ivLength = 12; // 96 bits for GCM
    this.tagLength = 16; // 128 bits authentication tag
  }

  /**
   * Generate cryptographically secure random key
   */
  async generateKey() {
    try {
      const key = await crypto.subtle.generateKey(
        {
          name: this.algorithm,
          length: this.keyLength,
        },
        true, // extractable
        ['encrypt', 'decrypt']
      );

      securityLogger.logSecurityEvent(SECURITY_EVENTS.ENCRYPTION_KEY_GENERATED, {
        algorithm: this.algorithm,
        keyLength: this.keyLength,
        timestamp: Date.now()
      });

      return key;
    } catch (error) {
      securityLogger.logSecurityEvent(SECURITY_EVENTS.ENCRYPTION_KEY_GENERATION_FAILED, {
        error: error.message,
        riskLevel: RISK_LEVELS.HIGH
      });
      throw new Error('Failed to generate encryption key');
    }
  }

  /**
   * Generate initialization vector
   */
  generateIV() {
    return crypto.getRandomValues(new Uint8Array(this.ivLength));
  }

  /**
   * Derive key from password using PBKDF2
   */
  async deriveKeyFromPassword(password, salt = null) {
    try {
      // Generate salt if not provided
      if (!salt) {
        salt = crypto.getRandomValues(new Uint8Array(16));
      }

      // Import password as key material
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
      );

      // Derive key using PBKDF2
      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000, // OWASP recommended minimum
          hash: 'SHA-256',
        },
        keyMaterial,
        {
          name: this.algorithm,
          length: this.keyLength,
        },
        true,
        ['encrypt', 'decrypt']
      );

      securityLogger.logSecurityEvent(SECURITY_EVENTS.KEY_DERIVED_FROM_PASSWORD, {
        iterations: 100000,
        saltLength: salt.length,
        timestamp: Date.now()
      });

      return { key, salt };
    } catch (error) {
      securityLogger.logSecurityEvent(SECURITY_EVENTS.KEY_DERIVATION_FAILED, {
        error: error.message,
        riskLevel: RISK_LEVELS.HIGH
      });
      throw new Error('Failed to derive key from password');
    }
  }

  /**
   * Encrypt data with AES-256-GCM
   */
  async encrypt(data, key, additionalData = null) {
    try {
      const iv = this.generateIV();
      const encodedData = new TextEncoder().encode(JSON.stringify(data));

      const encryptParams = {
        name: this.algorithm,
        iv: iv,
      };

      // Add additional authenticated data if provided
      if (additionalData) {
        encryptParams.additionalData = new TextEncoder().encode(additionalData);
      }

      const encryptedData = await crypto.subtle.encrypt(
        encryptParams,
        key,
        encodedData
      );

      const result = {
        encrypted: Array.from(new Uint8Array(encryptedData)),
        iv: Array.from(iv),
        algorithm: this.algorithm,
        timestamp: Date.now()
      };

      securityLogger.logSecurityEvent(SECURITY_EVENTS.DATA_ENCRYPTED, {
        dataSize: encodedData.length,
        algorithm: this.algorithm,
        hasAdditionalData: !!additionalData,
        timestamp: Date.now()
      });

      return result;
    } catch (error) {
      securityLogger.logSecurityEvent(SECURITY_EVENTS.ENCRYPTION_FAILED, {
        error: error.message,
        riskLevel: RISK_LEVELS.HIGH
      });
      throw new Error('Encryption failed');
    }
  }

  /**
   * Decrypt data with AES-256-GCM
   */
  async decrypt(encryptedData, key, additionalData = null) {
    try {
      const { encrypted, iv } = encryptedData;
      
      const decryptParams = {
        name: this.algorithm,
        iv: new Uint8Array(iv),
      };

      // Add additional authenticated data if provided
      if (additionalData) {
        decryptParams.additionalData = new TextEncoder().encode(additionalData);
      }

      const decryptedData = await crypto.subtle.decrypt(
        decryptParams,
        key,
        new Uint8Array(encrypted)
      );

      const result = JSON.parse(new TextDecoder().decode(decryptedData));

      securityLogger.logSecurityEvent(SECURITY_EVENTS.DATA_DECRYPTED, {
        dataSize: decryptedData.byteLength,
        algorithm: this.algorithm,
        timestamp: Date.now()
      });

      return result;
    } catch (error) {
      securityLogger.logSecurityEvent(SECURITY_EVENTS.DECRYPTION_FAILED, {
        error: error.message,
        riskLevel: RISK_LEVELS.HIGH
      });
      throw new Error('Decryption failed or data integrity compromised');
    }
  }

  /**
   * Export key for storage
   */
  async exportKey(key) {
    try {
      const exportedKey = await crypto.subtle.exportKey('jwk', key);
      
      securityLogger.logSecurityEvent(SECURITY_EVENTS.KEY_EXPORTED, {
        keyType: exportedKey.kty,
        algorithm: exportedKey.alg,
        timestamp: Date.now()
      });

      return exportedKey;
    } catch (error) {
      securityLogger.logSecurityEvent(SECURITY_EVENTS.KEY_EXPORT_FAILED, {
        error: error.message,
        riskLevel: RISK_LEVELS.MEDIUM
      });
      throw new Error('Failed to export key');
    }
  }

  /**
   * Import key from storage
   */
  async importKey(keyData) {
    try {
      const key = await crypto.subtle.importKey(
        'jwk',
        keyData,
        {
          name: this.algorithm,
          length: this.keyLength,
        },
        true,
        ['encrypt', 'decrypt']
      );

      securityLogger.logSecurityEvent(SECURITY_EVENTS.KEY_IMPORTED, {
        algorithm: keyData.alg,
        timestamp: Date.now()
      });

      return key;
    } catch (error) {
      securityLogger.logSecurityEvent(SECURITY_EVENTS.KEY_IMPORT_FAILED, {
        error: error.message,
        riskLevel: RISK_LEVELS.HIGH
      });
      throw new Error('Failed to import key');
    }
  }

  /**
   * Generate digital signature
   */
  async sign(data, privateKey) {
    try {
      const encodedData = new TextEncoder().encode(JSON.stringify(data));
      
      const signature = await crypto.subtle.sign(
        {
          name: 'RSASSA-PKCS1-v1_5',
          hash: 'SHA-256',
        },
        privateKey,
        encodedData
      );

      securityLogger.logSecurityEvent(SECURITY_EVENTS.DATA_SIGNED, {
        dataSize: encodedData.length,
        timestamp: Date.now()
      });

      return Array.from(new Uint8Array(signature));
    } catch (error) {
      securityLogger.logSecurityEvent(SECURITY_EVENTS.SIGNING_FAILED, {
        error: error.message,
        riskLevel: RISK_LEVELS.HIGH
      });
      throw new Error('Digital signing failed');
    }
  }

  /**
   * Verify digital signature
   */
  async verify(data, signature, publicKey) {
    try {
      const encodedData = new TextEncoder().encode(JSON.stringify(data));
      
      const isValid = await crypto.subtle.verify(
        {
          name: 'RSASSA-PKCS1-v1_5',
          hash: 'SHA-256',
        },
        publicKey,
        new Uint8Array(signature),
        encodedData
      );

      securityLogger.logSecurityEvent(SECURITY_EVENTS.SIGNATURE_VERIFIED, {
        isValid,
        timestamp: Date.now()
      });

      return isValid;
    } catch (error) {
      securityLogger.logSecurityEvent(SECURITY_EVENTS.SIGNATURE_VERIFICATION_FAILED, {
        error: error.message,
        riskLevel: RISK_LEVELS.HIGH
      });
      return false;
    }
  }

  /**
   * Generate hash for data integrity
   */
  async hash(data, algorithm = 'SHA-256') {
    try {
      const encodedData = new TextEncoder().encode(JSON.stringify(data));
      const hashBuffer = await crypto.subtle.digest(algorithm, encodedData);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      securityLogger.logSecurityEvent(SECURITY_EVENTS.DATA_HASHED, {
        algorithm,
        dataSize: encodedData.length,
        timestamp: Date.now()
      });

      return hashHex;
    } catch (error) {
      securityLogger.logSecurityEvent(SECURITY_EVENTS.HASHING_FAILED, {
        error: error.message,
        riskLevel: RISK_LEVELS.MEDIUM
      });
      throw new Error('Hashing failed');
    }
  }
}

/**
 * Secure Key Management
 */
class KeyManager {
  constructor() {
    this.keyStore = new Map();
    this.keyRotationInterval = 7 * 24 * 60 * 60 * 1000; // 7 days
  }

  /**
   * Store key securely
   */
  async storeKey(keyId, key, metadata = {}) {
    try {
      const keyData = {
        key,
        metadata: {
          ...metadata,
          createdAt: Date.now(),
          lastUsed: Date.now(),
          rotationDue: Date.now() + this.keyRotationInterval
        }
      };

      this.keyStore.set(keyId, keyData);

      securityLogger.logSecurityEvent(SECURITY_EVENTS.KEY_STORED, {
        keyId,
        createdAt: keyData.metadata.createdAt,
        rotationDue: keyData.metadata.rotationDue
      });

      return true;
    } catch (error) {
      securityLogger.logSecurityEvent(SECURITY_EVENTS.KEY_STORAGE_FAILED, {
        keyId,
        error: error.message,
        riskLevel: RISK_LEVELS.HIGH
      });
      return false;
    }
  }

  /**
   * Retrieve key
   */
  async getKey(keyId) {
    try {
      const keyData = this.keyStore.get(keyId);
      
      if (!keyData) {
        securityLogger.logSecurityEvent(SECURITY_EVENTS.KEY_NOT_FOUND, {
          keyId,
          riskLevel: RISK_LEVELS.MEDIUM
        });
        return null;
      }

      // Update last used timestamp
      keyData.metadata.lastUsed = Date.now();
      this.keyStore.set(keyId, keyData);

      // Check if key rotation is due
      if (Date.now() > keyData.metadata.rotationDue) {
        securityLogger.logSecurityEvent(SECURITY_EVENTS.KEY_ROTATION_DUE, {
          keyId,
          rotationDue: keyData.metadata.rotationDue,
          riskLevel: RISK_LEVELS.MEDIUM
        });
      }

      return keyData.key;
    } catch (error) {
      securityLogger.logSecurityEvent(SECURITY_EVENTS.KEY_RETRIEVAL_FAILED, {
        keyId,
        error: error.message,
        riskLevel: RISK_LEVELS.HIGH
      });
      return null;
    }
  }

  /**
   * Rotate key
   */
  async rotateKey(keyId, newKey) {
    try {
      const oldKeyData = this.keyStore.get(keyId);
      
      if (oldKeyData) {
        // Archive old key
        const archiveId = `${keyId}_archived_${Date.now()}`;
        this.keyStore.set(archiveId, {
          ...oldKeyData,
          metadata: {
            ...oldKeyData.metadata,
            archivedAt: Date.now(),
            status: 'archived'
          }
        });
      }

      // Store new key
      await this.storeKey(keyId, newKey, { rotated: true });

      securityLogger.logSecurityEvent(SECURITY_EVENTS.KEY_ROTATED, {
        keyId,
        timestamp: Date.now()
      });

      return true;
    } catch (error) {
      securityLogger.logSecurityEvent(SECURITY_EVENTS.KEY_ROTATION_FAILED, {
        keyId,
        error: error.message,
        riskLevel: RISK_LEVELS.HIGH
      });
      return false;
    }
  }

  /**
   * Delete key securely
   */
  async deleteKey(keyId) {
    try {
      const deleted = this.keyStore.delete(keyId);
      
      if (deleted) {
        securityLogger.logSecurityEvent(SECURITY_EVENTS.KEY_DELETED, {
          keyId,
          timestamp: Date.now()
        });
      }

      return deleted;
    } catch (error) {
      securityLogger.logSecurityEvent(SECURITY_EVENTS.KEY_DELETION_FAILED, {
        keyId,
        error: error.message,
        riskLevel: RISK_LEVELS.MEDIUM
      });
      return false;
    }
  }
}

// Create singleton instances
const encryption = new AdvancedEncryption();
const keyManager = new KeyManager();

// Export convenience functions
export const generateKey = () => encryption.generateKey();
export const deriveKeyFromPassword = (password, salt) => encryption.deriveKeyFromPassword(password, salt);
export const encrypt = (data, key, additionalData) => encryption.encrypt(data, key, additionalData);
export const decrypt = (encryptedData, key, additionalData) => encryption.decrypt(encryptedData, key, additionalData);
export const hash = (data, algorithm) => encryption.hash(data, algorithm);
export const sign = (data, privateKey) => encryption.sign(data, privateKey);
export const verify = (data, signature, publicKey) => encryption.verify(data, signature, publicKey);

export const storeKey = (keyId, key, metadata) => keyManager.storeKey(keyId, key, metadata);
export const getKey = (keyId) => keyManager.getKey(keyId);
export const rotateKey = (keyId, newKey) => keyManager.rotateKey(keyId, newKey);
export const deleteKey = (keyId) => keyManager.deleteKey(keyId);

export { AdvancedEncryption, KeyManager };
export default encryption;
