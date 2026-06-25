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
exports.saveKeyPair = saveKeyPair;
exports.loadKeyPair = loadKeyPair;
exports.loadOrCreateKeyPair = loadOrCreateKeyPair;
exports.getPublicKeyFromFile = getPublicKeyFromFile;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto_1 = require("./crypto");
// Generates a new keypair and saves it to disk as JSON
function saveKeyPair(filePath, keyPair) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    const stored = {
        publicKey: (0, crypto_1.publicKeyToHex)(keyPair.publicKey),
        secretKey: (0, crypto_1.secretKeyToHex)(keyPair.secretKey),
        createdAt: new Date().toISOString(),
    };
    fs.writeFileSync(filePath, JSON.stringify(stored, null, 2), { mode: 0o600 });
    console.log(`🔑 Keys saved to ${filePath}`);
}
// Loads a keypair from disk
function loadKeyPair(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Key file not found: ${filePath}`);
    }
    const stored = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return {
        publicKey: (0, crypto_1.hexToPublicKey)(stored.publicKey),
        secretKey: (0, crypto_1.hexToSecretKey)(stored.secretKey),
    };
}
// Loads existing keypair or generates and saves a new one
function loadOrCreateKeyPair(filePath) {
    if (fs.existsSync(filePath)) {
        console.log(`🔑 Loaded existing keys from ${filePath}`);
        return loadKeyPair(filePath);
    }
    console.log(`🔑 No keys found — generating new keypair...`);
    const keyPair = (0, crypto_1.generateKeyPair)();
    saveKeyPair(filePath, keyPair);
    return keyPair;
}
// Returns just the public key hex from a key file
function getPublicKeyFromFile(filePath) {
    const stored = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return stored.publicKey;
}
//# sourceMappingURL=keys.js.map