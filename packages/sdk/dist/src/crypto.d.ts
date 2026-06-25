export interface KeyPair {
    secretKey: Uint8Array;
    publicKey: Uint8Array;
}
export interface ReceiptPayload {
    receiptId: string;
    nonce: string;
    version: string;
    status: 'approved' | 'denied';
    userId: string;
    agentId: string;
    action: string;
    timestamp: string;
    expiresAt: string;
}
export interface SignedReceipt extends ReceiptPayload {
    signature: string;
    publicKey: string;
}
export declare function generateKeyPair(): KeyPair;
export declare function publicKeyToHex(publicKey: Uint8Array): string;
export declare function hexToPublicKey(hex: string): Uint8Array;
export declare function secretKeyToHex(secretKey: Uint8Array): string;
export declare function hexToSecretKey(hex: string): Uint8Array;
export declare function canonicalise(payload: ReceiptPayload): Uint8Array;
export declare function signReceipt(payload: ReceiptPayload, secretKey: Uint8Array): SignedReceipt;
export interface VerifyResult {
    valid: boolean;
    reason?: string;
}
export declare function verifyReceipt(receipt: SignedReceipt): VerifyResult;
export declare function buildReceipt(config: {
    userId: string;
    agentId: string;
    action: string;
    status: 'approved' | 'denied';
    ttlSeconds?: number;
}, secretKey: Uint8Array): SignedReceipt;
//# sourceMappingURL=crypto.d.ts.map