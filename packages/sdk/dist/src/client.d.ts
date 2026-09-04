import { SignedReceipt } from './crypto';
export declare class AT1C {
    private approvalLog;
    private seenReceipts;
    private blockedActions;
    private keyPair;
    private publicKey;
    constructor();
    getPublicKey(): string;
    getApprovalLog(): SignedReceipt[];
    checkReceipt(receipt: SignedReceipt): {
        valid: boolean;
        reason?: string;
    };
    private getPolicy;
    private promptApproval;
    enforce(config: {
        userId: string;
        action: string;
        agentId?: string;
    }, fn: () => Promise<any> | any): Promise<any>;
    private saveReceipt;
}
//# sourceMappingURL=client.d.ts.map