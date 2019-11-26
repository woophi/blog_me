import * as crypto from 'crypto';

export const generateRandomNumbers = (minimum: number, maximum: number): number => {
  if (minimum < -9007199254740991 || minimum > 9007199254740991) {
    throw new Error(
      'The minimum value must be inbetween MIN_SAFE_INTEGER and MAX_SAFE_INTEGER.'
    );
  }

  if (maximum < -9007199254740991 || maximum > 9007199254740991) {
    throw new Error(
      'The maximum value must be inbetween MIN_SAFE_INTEGER and MAX_SAFE_INTEGER.'
    );
  }
  let range = maximum - minimum;

  if (range < -9007199254740991 || range > 9007199254740991) {
    throw new Error(
      'The range between the minimum and maximum value must be inbetween MIN_SAFE_INTEGER and MAX_SAFE_INTEGER.'
    );
  }

  const { bytesNeeded, mask } = calculateParameters(range);

  const randomBytes = crypto.randomBytes(bytesNeeded);

  let randomValue = 0;
  /* Turn the random bytes into an integer, using bitwise operations. */
  for (let i = 0; i < bytesNeeded; i++) {
    randomValue |= randomBytes[i] << (8 * i);
  }
  randomValue = randomValue & mask;
  if (randomValue <= range) {
    /* We've been working with 0 as a starting point, so we need to
     * add the `minimum` here. */
    return minimum + randomValue;
  } else {
    /* Outside of the acceptable range, throw it away and try again.
     * We don't try any modulo tricks, as this would introduce bias. */
    return generateRandomNumbers(minimum, maximum);
  }
};

const calculateParameters = (range: number) => {
  let bitsNeeded = 0;
  let bytesNeeded = 0;
  let mask = 1;

  while (range > 0) {
    if (bitsNeeded % 8 === 0) {
      bytesNeeded += 1;
    }

    bitsNeeded += 1;
    mask = (mask << 1) | 1; /* 0x00001111 -> 0x00011111 */

    range = range >>> 1; /* 0x01000000 -> 0x00100000 */
  }

  return { bitsNeeded, bytesNeeded, mask };
};

export const generateRandomString = (length: number) => {
  return crypto.randomBytes(length).toString('hex');
};