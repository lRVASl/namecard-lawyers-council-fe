import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';

export enum HashAlgorithm {
  SHA256 = 'SHA256',
}

export const createHash = (algorithm: HashAlgorithm, data: string) =>
  Base64.stringify(sha256(data));
