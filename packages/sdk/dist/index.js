"use strict";
/**
 * AT1C Protocol SDK
 * AI Transparency & Compliance — v1.0
 *
 * No action without consent. No consent without proof.
 *
 * @example
 * ```typescript
 * import { AT1C, buildReceipt, verifyReceipt, generateKeyPair } from '@at1c/sdk'
 *
 * const at1c = new AT1C()
 *
 * const result = await at1c.enforce(
 *   { userId: 'user_123', agentId: 'agent_payments', action: 'send_payment' },
 *   async () => sendPayment()
 * )
 *
 * if (result.status === 'approved') {
 *   console.log('Receipt ID:', result.receipt.receiptId)
 * }
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicKeyFromFile = exports.loadOrCreateKeyPair = exports.loadKeyPair = exports.saveKeyPair = exports.hexToSecretKey = exports.hexToPublicKey = exports.secretKeyToHex = exports.publicKeyToHex = exports.canonicalise = exports.verifyReceipt = exports.signReceipt = exports.buildReceipt = exports.generateKeyPair = exports.AT1C = void 0;
// ── Core client ───────────────────────────────────────────────────────────────
var client_1 = require("./src/client");
Object.defineProperty(exports, "AT1C", { enumerable: true, get: function () { return client_1.AT1C; } });
// ── Crypto primitives ─────────────────────────────────────────────────────────
var crypto_1 = require("./src/crypto");
Object.defineProperty(exports, "generateKeyPair", { enumerable: true, get: function () { return crypto_1.generateKeyPair; } });
Object.defineProperty(exports, "buildReceipt", { enumerable: true, get: function () { return crypto_1.buildReceipt; } });
Object.defineProperty(exports, "signReceipt", { enumerable: true, get: function () { return crypto_1.signReceipt; } });
Object.defineProperty(exports, "verifyReceipt", { enumerable: true, get: function () { return crypto_1.verifyReceipt; } });
Object.defineProperty(exports, "canonicalise", { enumerable: true, get: function () { return crypto_1.canonicalise; } });
Object.defineProperty(exports, "publicKeyToHex", { enumerable: true, get: function () { return crypto_1.publicKeyToHex; } });
Object.defineProperty(exports, "secretKeyToHex", { enumerable: true, get: function () { return crypto_1.secretKeyToHex; } });
Object.defineProperty(exports, "hexToPublicKey", { enumerable: true, get: function () { return crypto_1.hexToPublicKey; } });
Object.defineProperty(exports, "hexToSecretKey", { enumerable: true, get: function () { return crypto_1.hexToSecretKey; } });
// ── Key management ────────────────────────────────────────────────────────────
var keys_1 = require("./src/keys");
Object.defineProperty(exports, "saveKeyPair", { enumerable: true, get: function () { return keys_1.saveKeyPair; } });
Object.defineProperty(exports, "loadKeyPair", { enumerable: true, get: function () { return keys_1.loadKeyPair; } });
Object.defineProperty(exports, "loadOrCreateKeyPair", { enumerable: true, get: function () { return keys_1.loadOrCreateKeyPair; } });
Object.defineProperty(exports, "getPublicKeyFromFile", { enumerable: true, get: function () { return keys_1.getPublicKeyFromFile; } });
//# sourceMappingURL=index.js.map