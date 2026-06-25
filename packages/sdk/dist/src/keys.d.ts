import { KeyPair } from './crypto';
export interface StoredKeyPair {
    publicKey: string;
    secretKey: string;
    createdAt: string;
}
export declare function saveKeyPair(filePath: string, keyPair: KeyPair): void;
export declare function loadKeyPair(filePath: string): KeyPair;
export declare function loadOrCreateKeyPair(filePath: string): KeyPair;
export declare function getPublicKeyFromFile(filePath: string): string;
//# sourceMappingURL=keys.d.ts.map