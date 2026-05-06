const fs = require("fs")
const path = require("path")
const { createSignedReceipt } = require("../../../src/crypto/createSignedReceipt")

export class AT1C {
  private apiKey: string
  private receipts: any[] = []
  private receiptsFile = path.join(process.cwd(), "receipts.json")

  constructor(config: { apiKey: string }) {
    this.apiKey = config.apiKey
    this.loadReceipts()
  }

  // ----------------------------
  // CORE PERMISSION CHECK (simple placeholder)
  // ----------------------------
  private checkPermission(userId: string, action: string): boolean {
    // TEMP RULE: allow everything
    // (later you plug real agent rules here)
    return true
  }

  // ----------------------------
  // HUMAN APPROVAL STEP
  // ----------------------------
  async approve({ userId, action, actor }: any) {
    const readline = require("readline")

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    const answer: string = await new Promise((resolve) => {
      rl.question(`Approve ${action}? (y/n): `, (ans: string) => {
        rl.close()
        resolve(ans)
      })
    })

    const approved = answer.toLowerCase() === "y"

    return {
      userId,
      action,
      actor,
      approved
    }
  }

  // ----------------------------
  // 🔐 SINGLE CONTROL GATE
  // ----------------------------
  async enforce(
    config: {
      userId: string
      action: string
      actor: string
    },
    fn: Function
  ) {
    // 1. Permission layer
    const allowed = this.checkPermission(config.userId, config.action)

    if (!allowed) {
      return {
        status: "denied",
        reason: "permission_denied"
      }
    }

    // 2. Human approval
    const approval = await this.approve(config)

    if (!approval.approved) {
      return {
        status: "denied",
        reason: "human_denied"
      }
    }

    // 3. Execute real action
    const result = await fn()

    // 4. Create receipt
    const receipt = createSignedReceipt({
      receiptId: "receipt_" + Date.now(),
      userId: config.userId,
      action: config.action,
      actor: config.actor,
      status: "approved",
      timestamp: Date.now()
    })

    // 5. Store receipt
    this.receipts.push(receipt)
    this.saveReceipts()

    return {
      status: "approved",
      receipt,
      result
    }
  }

  // ----------------------------
  // STORAGE
  // ----------------------------
  private loadReceipts() {
    try {
      if (fs.existsSync(this.receiptsFile)) {
        const data = fs.readFileSync(this.receiptsFile, "utf-8")
        this.receipts = JSON.parse(data)
      }
    } catch (err) {
      this.receipts = []
    }
  }

  private saveReceipts() {
    try {
      fs.writeFileSync(
        this.receiptsFile,
        JSON.stringify(this.receipts, null, 2)
      )
    } catch (err) {
      console.error("Failed to save receipts:", err)
    }
  }
}
