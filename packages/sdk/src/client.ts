const fs = require("fs")
const path = require("path")

export class AT1C {
  private apiKey: string

  constructor(config: { apiKey: string }) {
    this.apiKey = config.apiKey
  }

  // --------------------
  // IDENTIFY (used in demo login)
  // --------------------
  async identify() {
    return {
      userId: "user_demo"
    }
  }

  // --------------------
  // PERMISSION CHECK
  // --------------------
private checkPermission(userId: string, action: string): boolean {
  const fs = require("fs")

  try {
    const raw = fs.readFileSync("agents.json", "utf-8")
    const agents = JSON.parse(raw)

    const agent = agents.find(
      (a: any) => a.ownerUserId === userId
    )

    if (!agent) {
      console.log("❌ No agent found")
      return false
    }

    console.log("🔍 Agent:", agent.agentId)
    console.log("🔍 Permissions:", agent.permissions)

    return agent.permissions.includes(action)

  } catch (err) {
    console.log("❌ Permission system failure")
    return false
  }
}
  // --------------------
  // APPROVAL STEP
  // --------------------
  private async approve(config: any) {
    const readline = require("readline")

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    return await new Promise((resolve) => {
      rl.question(`Approve ${config.action}? (y/n): `, (answer: string) => {
        rl.close()

        resolve({
          status: answer.toLowerCase() === "y" ? "approved" : "rejected"
        })
      })
    })
  }

  // --------------------
  // ENFORCE CORE
  // --------------------
async enforce(
  config: {
    userId: string
    action: string
    actor: string
    agentId?: string
  },
  fn: Function
) {
  const allowed = this.checkPermission(config.userId, config.action)

  if (!allowed) {
    return {
      status: "denied",
      reason: "permission_denied"
    }
  }

  const approval = await this.approve(config) as any

  if (approval.status !== "approved") {
    return {
      status: "denied",
      reason: "user_rejected",
      approval
    }
  }

  const result = await fn()

  return {
    status: "approved",
    result,
    approval
  }
}
}
