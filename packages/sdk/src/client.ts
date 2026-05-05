const { createSignedReceipt } = require("../../../src/crypto/createSignedReceipt")
const fs = require("fs")
const path = require("path")

export class AT1C {
  private apiKey: string
  private receipts: any[] = []
  private receiptsFile = path.join(process.cwd(), "receipts.json")

  constructor(config: { apiKey: string }) {
    this.apiKey = config.apiKey
    this.loadReceipts()
  }

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

  private saveReceipts() {
    try {
      fs.writeFileSync(this.receiptsFile, JSON.stringify(this.receipts, null, 2))
    } catch (err) {
      console.error("Failed to save receipts:", err)
    }
  }

  async identify() {
    return {
      userId: "user_" + Math.random().toString(36).substring(2, 8)
    }
  }

  async approve({ userId, action, actor }: any) {
    console.log(`\n🔔 Approval requested`)
    console.log(`User: ${userId}`)
    console.log(`Action: ${action}`)
    console.log(`Actor: ${actor}`)

    const readline = require("readline")

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    const answer: string = await new Promise((resolve) => {
      rl.question("\nApprove? (y/n): ", (input: string) => {
        rl.close()

      })
    })

    const approved = answer.toLowerCase() === "y"
const receipt = createSignedReceipt({
  receiptId: "receipt_" + Date.now(),
  userId,
  action,
  actor,
  status: approved ? "approved" : "denied",
  timestamp: Date.now()
})

    this.receipts.push(receipt)
    this.saveReceipts()

    if (!approved) {
      return { status: "denied", receipt }
    }

    return {
      status: "approved",
      proof: "proof_" + Math.random().toString(36).substring(2),
      receipt
    }
  }

  getReceipts() {
    return this.receipts
  }

  async withApproval(config: any, fn: Function) {
    const result = await this.approve(config)

    if (result.status !== "approved") {
      throw new Error("Approval denied")
    }

    return fn()
  }
}
