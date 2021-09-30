import * as crypto from 'crypto';
import { Encryption } from './encryption';

export class Hashing extends Encryption {
  constructor() {
    super();
  }
  private iteration = 10000;
  async verifyPassword(password: string, hashedPassword: string) {
    if (password === hashedPassword) return true;

    const decodedBuffer = Buffer.from(hashedPassword, 'base64');

    let saltLength = this.readNetworkByteOrder(decodedBuffer, 9);

    if (saltLength < 128 / 8) {
      return false;
    }
    let salt = crypto.randomBytes(16);

    // take the salt from the stored hash in the database.
    // we effectively overwrite the bytes here from our random buffer.
    decodedBuffer.copy(salt, 0, 13, 13 + saltLength);

    let subkeyLength = decodedBuffer.length - 13 - saltLength;

    if (subkeyLength < 128 / 8) {
      return false;
    }

    let expectedSubkey = Buffer.alloc(32);

    decodedBuffer.copy(expectedSubkey, 0, 13 + saltLength, 13 + saltLength + expectedSubkey.length);

    let acutalSubkey = crypto.pbkdf2Sync(String(password), salt, this.iteration, 32, 'sha256');

    return decodedBuffer.compare(acutalSubkey, 0, 32, 29) === 0;
  }

  async hashPassword(password: string) {
    // Create a salt with cryptographically secure method.
    let salt = crypto.randomBytes(16);

    let subkey = crypto.pbkdf2Sync(String(password), salt, this.iteration, 32, 'sha256');

    let outputBytes = Buffer.alloc(13 + salt.length + subkey.length);

    // Write in the format marker
    outputBytes[0] = 0x01;

    // Write out the byte order
    this.writeNetworkByteOrder(outputBytes, 1, 1);
    this.writeNetworkByteOrder(outputBytes, 5, this.iteration);
    this.writeNetworkByteOrder(outputBytes, 9, salt.length);

    salt.copy(outputBytes, 13, 0, 16);

    subkey.copy(outputBytes, 13 + salt.length, 0, subkey.length);

    return outputBytes.toString('base64');
  }

  /**
   * Writes the appropriate bytes into available slots
   * @param buffer
   * @param offset
   * @param value
   */
  private writeNetworkByteOrder(buffer: Buffer, offset: number, value: number) {
    buffer[offset + 0] = value >> 0;
    buffer[offset + 1] = value >> 8;
    buffer[offset + 2] = value >> 16;
    buffer[offset + 3] = value >> 24;
  }

  /**
   * Reads the bytes back out using an offset.
   * @param buffer
   * @param offset
   * @returns {number}
   */
  private readNetworkByteOrder(buffer: Buffer, offset: number) {
    return (buffer[offset + 0] << 0) | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16) | (buffer[offset + 3] << 24);
  }
}
