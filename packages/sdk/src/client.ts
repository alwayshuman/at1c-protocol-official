const fs = require("fs")
const path = require("path")
const readline = require("readline")

const {
  createSignedReceipt
} = require("../../../src/crypto/createSignedReceipt")

const {
  checkPermission
} = require("../../../src/crypto/checkPermission")

export class AT1C {
  private apiKey: string
  private receipts: any[] = []
  private receiptsFile = path.join(process.cwd(), "receipts.json")

  constructor(config: { apiKey: string }) {
    this.apiKey = config.apiKey
    this.loadReceipts()
  }

   // ----------------------------
  // LOAD RECEIPTS
  // ----------------------------
  private loadReceipts() {
    try {
      if (fs.existsSync(this.receiptsFile)) {
        const data = fs.readFileSync(this.receiptsFile, "utf-8")
        this.receipts = JSON.parse(data)
      }
    } catch (err) {
      console.error("Failed to load receipts:", err)
      this.receipts = []
    }
  }
  // ----------------------------
  // SAVE RECEIPTS
  // ----------------------------
  private saveReceipts() {
    fs.writeFileSync(
      this.receiptsFile,
      JSON.stringify(this.receipts, null, 2)
    )
  }

  // ----------------------------
  // HUMAN IDENTIFICATION
  // ----------------------------
async identify() {
  // persistent identity (demo-safe version)
  const fs = require("fs")
  const path = require("path")

  const identityFile = path.join(process.cwd(), ".at1c_identity.json")

  if (fs.existsSync(identityFile)) {
    const data = JSON.parse(fs.readFileSync(identityFile, "utf-8"))
    return data
  }

  const newIdentity = {
    userId: "user_demo"
  }

  fs.writeFileSync(identityFile, JSON.stringify(newIdentity, null, 2))

  return newIdentity
}
  // ----------------------------
  // HUMAN APPROVAL
  // ----------------------------
  private async approve({
    userId,
    action,
    actor
  }: any) {

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    const answer: string = await new Promise((resolve) => {
      rl.question(
        `Approve ${action}? (y/n): `,
        resolve
      )
    })

    rl.close()

    const approved = answer.toLowerCase() === "y"

    return {
      status: approved ? "approved" : "denied",
      userId,
      action,
      actor
    }
  }

  // ----------------------------
  // ENFORCE
  // ----------------------------
  async enforce(
    config: {
      userId: string
      action: string
      actor: string
    },
    fn: Function
  ) {

    // 1. Permission Layer
    const allowed = checkPermission(
      config.userId,
      config.action
    )

    if (!allowed) {
      console.log("🚫 Blocked by permission layer")

      return {
        status: "denied",
        reason: "permission_denied"
      }
    }

    // 2. Human Approval
    const approval = await this.approve(config)

    if (approval.status !== "approved") {
      return approval
    }

    // 3. Execute Protected Action
    const result = await fn()

    // 4. Create Receipt
    const receipt = createSignedReceipt({
      receiptId: "receipt_" + Date.now(),
      userId: config.userId,
      action: config.action,
      actor: config.actor,
      status: "approved",
      timestamp: Date.now()
    })

    this.receipts.push(receipt)
    this.saveReceipts()

    return {
      status: "approved",
      proof: receipt.signature,
      result
    }
  }
}
