/**
 * diary-crypto.js
 * Módulo de Criptografia Zero-Knowledge Client-Side via Web Crypto API (AES-GCM 256-bit + PBKDF2)
 * Protege diários, reflexões e exercícios psicológicos com segurança militar antes do envio ao Supabase.
 */

export class DiaryCrypto {
  /**
   * Converte ArrayBuffer para Base64
   */
  static bufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const globalObj = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : null);
    if (globalObj && typeof globalObj.btoa === 'function') {
      return globalObj.btoa(binary);
    }
    return Buffer.from(binary, 'binary').toString('base64');
  }

  /**
   * Converte Base64 para ArrayBuffer
   */
  static base64ToBuffer(base64) {
    const globalObj = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : null);
    let binary = '';
    if (globalObj && typeof globalObj.atob === 'function') {
      binary = globalObj.atob(base64);
    } else {
      binary = Buffer.from(base64, 'base64').toString('binary');
    }
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Deriva uma chave AES-GCM a partir de uma senha mestra e salt
   */
  static async deriveKey(password, saltBuffer) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltBuffer,
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
   * Criptografa um objeto ou string
   */
  static async encrypt(data, password) {
    const encoder = new TextEncoder();
    const plainText = typeof data === 'string' ? data : JSON.stringify(data);
    const encodedData = encoder.encode(plainText);

    // Gerar Salt (16 bytes) e IV (12 bytes) aleatórios
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const key = await this.deriveKey(password, salt);

    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encodedData
    );

    return {
      ciphertext: this.bufferToBase64(encryptedBuffer),
      iv: this.bufferToBase64(iv),
      salt: this.bufferToBase64(salt)
    };
  }

  /**
   * Descriptografa um payload
   */
  static async decrypt(ciphertextBase64, ivBase64, saltBase64, password) {
    try {
      const encryptedBuffer = this.base64ToBuffer(ciphertextBase64);
      const iv = new Uint8Array(this.base64ToBuffer(ivBase64));
      const salt = new Uint8Array(this.base64ToBuffer(saltBase64));

      const key = await this.deriveKey(password, salt);

      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encryptedBuffer
      );

      const decoder = new TextDecoder();
      const plainText = decoder.decode(decryptedBuffer);

      try {
        return JSON.parse(plainText);
      } catch {
        return plainText;
      }
    } catch (err) {
      throw new Error('Chave de segurança ou 2FA incorreta. Não foi possível descriptografar.');
    }
  }

  /**
   * Cria um hash de verificação de chave
   */
  static async hashMasterKey(key) {
    const encoder = new TextEncoder();
    const data = encoder.encode(key + "_cartas_vault_salt_2026");
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return this.bufferToBase64(hashBuffer);
  }
}
