"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateKeyPair = generateKeyPair;
exports.publicKeyToHex = publicKeyToHex;
exports.hexToPublicKey = hexToPublicKey;
exports.secretKeyToHex = secretKeyToHex;
exports.hexToSecretKey = hexToSecretKey;
exports.canonicalise = canonicalise;
exports.signReceipt = signReceipt;
exports.verifyReceipt = verifyReceipt;
exports.buildReceipt = buildReceipt;
const ed = __importStar(require("@noble/ed25519"));
const sha2_js_1 = require("@noble/hashes/sha2.js");
ed.etc.sha512Sync = sha2_js_1.sha512;
const _usedNonces = new Set();
function generateKeyPair() {
    const secret = require("crypto").randomBytes(32);
    const publicKey = ed.getPublicKey(secret);
    return { secretKey: secret, publicKey };
}
function publicKeyToHex(publicKey) {
    return Buffer.from(publicKey).toString('hex');
}
function hexToPublicKey(hex) {
    return Uint8Array.from(Buffer.from(hex, 'hex'));
}
function secretKeyToHex(secretKey) {
    return Buffer.from(secretKey).toString('hex');
}
function hexToSecretKey(hex) {
    return Uint8Array.from(Buffer.from(hex, 'hex'));
}
function canonicalise(payload) {
    const sorted = Object.keys(payload)
        .sort()
        .reduce((acc, key) => {
        acc[key] = payload[key];
        return acc;
    }, {});
    return new TextEncoder().encode(JSON.stringify(sorted));
}
function signReceipt(payload, secretKey) {
    const bytes = canonicalise(payload);
    const sigBytes = ed.sign(bytes, secretKey);
    const publicKey = ed.getPublicKey(secretKey);
    return {
        ...payload,
        signature: Buffer.from(sigBytes).toString('hex'),
        publicKey: Buffer.from(publicKey).toString('hex'),
    };
}
function verifyReceipt(receipt) {
    const now = new Date();
    const expiresAt = new Date(receipt.expiresAt);
    if (now > expiresAt) {
        return { valid: false, reason: 'expired' };
    }
    if (receipt.status !== 'approved') {
        return { valid: false, reason: 'not_approved' };
    }
    try {
        const payload = {
            receiptId: receipt.receiptId,
            nonce: receipt.nonce,
            version: receipt.version,
            status: receipt.status,
            userId: receipt.userId,
            agentId: receipt.agentId,
            action: receipt.action,
            timestamp: receipt.timestamp,
            expiresAt: receipt.expiresAt,
        };
        const bytes = canonicalise(payload);
        const sigBytes = Uint8Array.from(Buffer.from(receipt.signature, 'hex'));
        const pubKeyBytes = hexToPublicKey(receipt.publicKey);
        const valid = ed.verify(sigBytes, bytes, pubKeyBytes);
        if (!valid) {
            return { valid: false, reason: 'invalid_signature' };
        }
    }
    catch {
        return { valid: false, reason: 'malformed_receipt' };
    }
    if (_usedNonces.has(receipt.nonce))
        return { valid: false, reason: 'replay_detected' };
    _usedNonces.add(receipt.nonce);
    return { valid: true };
}
function buildReceipt(config, secretKey) {
    const now = new Date();
    const ttl = config.ttlSeconds ?? 300;
    const payload = {
        receiptId: crypto.randomUUID(),
        nonce: crypto.randomUUID(),
        version: '1.0',
        status: config.status,
        userId: config.userId,
        agentId: config.agentId,
        action: config.action,
        timestamp: now.toISOString(),
        expiresAt: new Date(now.getTime() + ttl * 1000).toISOString(),
    };
    return signReceipt(payload, secretKey);
}
//# sourceMappingURL=crypto.js.map