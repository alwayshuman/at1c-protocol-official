const fs = require("fs");
const readline = require("readline");
const crypto = require("crypto");
import { ApprovalReceipt } from "./types";
import {
  createApprovalPayload,
  createApprovalSignature,
  hashReceipt,
  signaturesMatch,
} from "./crypto";
export class AT1C {
private approvalLog: ApprovalReceipt[] = [];
  private apiKey: string;
getApprovalLog(): ApprovalReceipt[] {
  return this.approvalLog;
}
getReceiptById(
  receiptId: string
): ApprovalReceipt | undefined {
  return this.approvalLog.find(
    (receipt) =>
      receipt.receiptId === receiptId
  );
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

const approval: ApprovalReceipt = {
  receiptId: crypto.randomUUID(),
  receiptHash: hashReceipt({
    receiptId: crypto.randomUUID(),
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
    const allowed = this.checkPermission(config.userId, config.action);

    if (!allowed) {
      return {
        status: "denied",
        reason: "permission_denied",
      };
    }

    const approval = await this.approve(config);
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

    const result = await fn();

    return {
      status: "approved",
      result,
      approval,
    };
  }
}
