import * as crypto from 'crypto';

export class EncryptionHelper {
  static encrypt(text: string): string {
    const hash = crypto.pbkdf2Sync(text, 'cd4f1b7e2a8f9c3d6e5b0a1d7f8e2c9a', 10000, 64, 'sha512');
    return hash.toString('hex');
  }
}