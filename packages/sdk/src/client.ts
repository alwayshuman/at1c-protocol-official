const fs = require("fs");
const readline = require("readline");
const crypto = require("crypto");
import { ApprovalReceipt } from "./types";
enum PolicyDecision {
  ALLOW = "allow",
  REQUIRE_APPROVAL = "require_approval",
  DENY = "deny",
}
import {
  createApprovalPayload,
  createApprovalSignature,
  hashReceipt,
  signaturesMatch,
} from "./crypto";
export class AT1C {
private approvalLog: ApprovalReceipt[] = [];
  private apiKey: string;
private seenReceipts = new Set<string>();
private blockedActions = JSON.parse(
  fs.readFileSync("policies.json", "utf-8")
);
getApprovalLog(): ApprovalReceipt[] {
  return this.approvalLog;
}
getReceiptById(
  receiptId: string
): ApprovalReceipt | undefined {
  return this.approvalLog.find(
    (receipt) => receipt.receiptId === receiptId
  );
}
verifyReceipt(receipt: ApprovalReceipt): { valid: boolean; reason?: string } {
const now = new Date();
const expiresAt = new Date(receipt.expiresAt);
if (now > expiresAt) {
  return { valid: false, reason: "expired" };
}
const calculatedHash =
  hashReceipt({
    receiptId: receipt.receiptId,
    version: receipt.version,
    status: receipt.status,
    userId: receipt.userId,
    agentId: receipt.agentId,
    action: receipt.action,
    timestamp: receipt.timestamp,
    signature: receipt.signature,
  });

// 🔴 REPLAY PROTECTION
if (this.seenReceipts.has(receipt.receiptId)) {
  return { valid: false, reason: "replay_detected" };
}
this.seenReceipts.add(receipt.receiptId);
const valid = calculatedHash === receipt.receiptHash;

if (!valid) {
  return { valid: false, reason: "invalid_signature" };
}

return { valid: true };
}
exportReceipts(path: string): void {
  fs.writeFileSync(
    path,
    JSON.stringify(
      this.approvalLog,
      null,
      2
    )
  );
}
  constructor(config: { apiKey: string }) {
    this.apiKey = config.apiKey;
  }

  // --------------------
  // IDENTIFY (demo login)
  // --------------------
  async identify() {
    return {
      userId: "user_demo",
    };
  }

  // --------------------
  // PERMISSION CHECK
  // --------------------
private getPolicy(
  action: string
): any {
  return this.blockedActions.find(
    (policy: any) => policy.action === action
  );
}
  private checkPermission(userId: string, action: string): boolean {
    try {
      const raw = fs.readFileSync("agents.json", "utf-8");
      const agents = JSON.parse(raw);

      const agent = agents.find(
        (a: any) => a.ownerUserId === userId
      );

      if (!agent) {
        console.log("❌ No agent found");
        return false;
      }

      console.log("🔍 Agent:", agent.agentId);
      console.log("🔍 Permissions:", agent.permissions);

      return agent.permissions.includes(action);
    } catch (err) {
      console.log("❌ Permission system failure");
      return false;
    }
  }

  // --------------------
  // APPROVAL STEP
  // --------------------
private async approve(config: any): Promise<ApprovalReceipt> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
return new Promise((resolve) => {
  rl.question(
    `Approve ${config.action}? (y/n): `,
    (answer: string) => {
      rl.close();
const approved =
  answer.toLowerCase() === "y";

const timestamp =
  new Date().toISOString();

const payload =
  createApprovalPayload({
    userId: config.userId,
    action: config.action,
    agentId: config.agentId,
    timestamp,
  });
const signature =
  createApprovalSignature(payload);
const receiptId =
  crypto.randomUUID();

const approval: ApprovalReceipt = {
  receiptId: receiptId,

  receiptHash: hashReceipt({
    receiptId: receiptId,
    version: "1.0",
    status: approved ? "approved" : "denied",
    userId: config.userId,
    agentId: config.agentId,
    action: config.action,
    timestamp,
    signature,
  }),

  version: "1.0",
  status: approved ? "approved" : "denied",
  userId: config.userId,
  agentId: config.agentId,
  action: config.action,
  timestamp,
  expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  signature,
};
resolve(approval);
    }
  );
});
}
  // --------------------
  // CORE ENFORCEMENT
  // --------------------
private verifyApproval(approval: ApprovalReceipt, config: any): boolean {
const payload = createApprovalPayload({
  userId: config.userId,
  action: config.action,
  agentId: config.agentId || "unknown",
  timestamp: approval.timestamp,
});

const expected = createApprovalSignature(payload);
return signaturesMatch(approval.signature, expected);
}
async enforce(
  config: {
    userId: string;
    action: string;
    actor: string;
    agentId?: string;
  },
  fn: () => Promise<any> | any
): Promise<any> {
const blockedPolicy =
  this.blockedActions.find(
    (policy: any) =>
      policy.action === config.action
  );
// AT1C INVARIANT: fail-closed by default
if (!this.blockedActions) {
  return {
    status: "denied",
    reason: "policy_engine_unavailable",
  };
}
if (
  blockedPolicy &&
  (
    blockedPolicy.severity === "high" ||
    blockedPolicy.severity === "critical"
  )
) {
  console.log(
    "🚫 Policy blocked action:",
    config.action
  );

  console.log(
    "⚠️ Severity:",
    blockedPolicy.severity
  );

const decision = PolicyDecision.DENY;

return {
  status: decision,
  reason: "blocked_policy",
};
}
    const allowed = this.checkPermission(config.userId, config.action);

if (!allowed) {
  return {
    status: "denied",
    reason: "permission_denied",
  };
}
const approval: ApprovalReceipt =
  await this.approve(config);
this.approvalLog.push(approval);
const valid = this.verifyApproval(approval, config);

if (!valid) {
  return {
    status: "denied",
    reason: "invalid_signature",
  };
}
    if (approval.status !== "approved") {
      return {
        status: "denied",
        reason: "user_rejected",
        approval,
      };
    }
const receipt = {
  userId: config.userId,
  agentId: config.agentId || "unknown",
  action: config.action,
  timestamp: approval.timestamp,
  signature: approval.signature,
  approvalStatus: approval.status,
};

let receipts = [];

try {
  if (fs.existsSync("receipts.json")) {
    receipts = JSON.parse(
      fs.readFileSync("receipts.json", "utf-8")
    );
  }
} catch (err) {
  receipts = [];
}

receipts.push(receipt);

fs.writeFileSync(
  "receipts.json",
  JSON.stringify(receipts, null, 2)
);
    const result = await fn();

    return {
      status: "approved",
      result,
      approval,
    };
  }
}
