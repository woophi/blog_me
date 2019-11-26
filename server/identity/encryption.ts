import * as crypto from 'crypto';

export class Encryption {
  constructor() {}
  private algorithm = 'aes-192-cbc';

  public encrypt = async (value: string, password: string) => {
    try {
      const key = crypto.scryptSync(String(password), 'salt', 24);
      const iv = Buffer.alloc(16, 0);
      const cipher = crypto.createCipheriv(this.algorithm, key, iv);
      let encrypted = cipher.update(String(value), 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted;
    } catch (e) {
      new Error(e);
    }
  }

  public decrypt = async (encryptedValue: string, password: string) => {
    try {
      const key = crypto.scryptSync(String(password), 'salt', 24);
      const iv = Buffer.alloc(16, 0);
      const decipher = crypto.createDecipheriv(this.algorithm, key, iv);

      let decrypted = decipher.update(String(encryptedValue), 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (e) {
      new Error(e);
    }
  }

}
