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
exports.AT1C = void 0;
const fs = __importStar(require("fs"));
const readline = __importStar(require("readline"));
const crypto_1 = require("./crypto");
class AT1C {
    constructor() {
        this.approvalLog = [];
        this.seenReceipts = new Set();
        const keys = (0, crypto_1.generateKeyPair)();
        this.keyPair = keys;
        this.publicKey = keys.publicKey;
        try {
            this.blockedActions = JSON.parse(fs.readFileSync('policies.json', 'utf-8'));
        }
        catch {
            this.blockedActions = [];
        }
    }
    getPublicKey() {
        return (0, crypto_1.publicKeyToHex)(this.publicKey);
    }
    getApprovalLog() {
        return this.approvalLog;
    }
    checkReceipt(receipt) {
        if (this.seenReceipts.has(receipt.receiptId)) {
            return { valid: false, reason: 'replay_detected' };
        }
        const result = (0, crypto_1.verifyReceipt)(receipt);
        if (result.valid) {
            this.seenReceipts.add(receipt.receiptId);
        }
        return result;
    }
    getPolicy(action) {
        return this.blockedActions.find((p) => p.action === action);
    }
    async promptApproval(action, userId) {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        return new Promise((resolve) => {
            rl.question(`\nAT1C: Approve "${action}" for ${userId}? (y/n): `, (answer) => {
                rl.close();
                resolve(answer.toLowerCase() === 'y');
            });
        });
    }
    async enforce(config, fn) {
        if (!this.blockedActions) {
            return { status: 'denied', reason: 'policy_engine_unavailable' };
        }
        const policy = this.getPolicy(config.action);
        if (policy?.decision === 'deny') {
            return { status: 'denied', reason: 'blocked_policy' };
        }
        const approved = await this.promptApproval(config.action, config.userId);
        const receipt = (0, crypto_1.buildReceipt)({
            userId: config.userId,
            agentId: config.agentId ?? 'unknown',
            action: config.action,
            status: approved ? 'approved' : 'denied',
        }, this.keyPair);
        this.approvalLog.push(receipt);
        const check = this.checkReceipt(receipt);
        if (!check.valid) {
            return { status: 'denied', reason: check.reason };
        }
        if (!approved) {
            return { status: 'denied', reason: 'user_rejected', receipt };
        }
        this.saveReceipt(receipt);
        const result = await fn();
        return { status: 'approved', result, receipt };
    }
    saveReceipt(receipt) {
        let receipts = [];
        try {
            if (fs.existsSync('receipts.json')) {
                receipts = JSON.parse(fs.readFileSync('receipts.json', 'utf-8'));
            }
        }
        catch {
            receipts = [];
        }
        receipts.push(receipt);
        fs.writeFileSync('receipts.json', JSON.stringify(receipts, null, 2));
    }
}
exports.AT1C = AT1C;
//# sourceMappingURL=client.js.map