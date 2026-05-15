const fs = require("fs");
const readline = require("readline");
const crypto = require("crypto");
export class AT1C {
  private apiKey: string;

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
private async approve(config: any): Promise<{
  status: string;
  timestamp: number;
  signature: string | null;
}> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
return new Promise((resolve) => {
  rl.question(
    `Approve ${config.action}? (y/n): `,
    (answer: string) => {
      rl.close();

      const approved = answer.toLowerCase() === "y";
const timestamp = Date.now();

const signature = crypto
  .createHash("sha256")
  .update(
    JSON.stringify({
      userId: config.userId,
      action: config.action,
      agentId: config.agentId || "unknown",
      timestamp,
    })
  )
  .digest("hex");
      resolve({
        status: approved ? "approved" : "rejected",
timestamp,
signature: approved ? signature : null,
      });
    }
  );
});
}
  // --------------------
  // CORE ENFORCEMENT
  // --------------------
private verifyApproval(approval: any, config: any): boolean {
  const expected = crypto
    .createHash("sha256")
    .update(
      JSON.stringify({
        userId: config.userId,
        action: config.action,
        agentId: config.agentId || "unknown",
        timestamp: approval.timestamp,
      })
    )
    .digest("hex");

  return expected === approval.signature;
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
