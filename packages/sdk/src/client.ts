import * as fs from 'fs'
import * as readline from 'readline'
import { ApprovalReceipt } from './types'
import { buildReceipt, verifyReceipt, generateKeyPair, secretKeyToHex, publicKeyToHex, SignedReceipt } from './crypto'

export class AT1C {
  private approvalLog: SignedReceipt[] = []
  private seenReceipts = new Set<string>()
  private blockedActions: any[]
  private secretKey: Uint8Array
  private publicKey: Uint8Array

  constructor() {
    const keys = generateKeyPair()
    this.secretKey = keys.secretKey
    this.publicKey = keys.publicKey
    try {
      this.blockedActions = JSON.parse(fs.readFileSync('policies.json', 'utf-8'))
    } catch {
      this.blockedActions = []
    }
  }

  getPublicKey(): string {
    return publicKeyToHex(this.publicKey)
  }

  getApprovalLog(): SignedReceipt[] {
    return this.approvalLog
  }

  checkReceipt(receipt: SignedReceipt): { valid: boolean; reason?: string } {
    if (this.seenReceipts.has(receipt.receiptId)) {
      return { valid: false, reason: 'replay_detected' }
    }
    const result = verifyReceipt(receipt)
    if (result.valid) {
      this.seenReceipts.add(receipt.receiptId)
    }
    return result
  }

  private getPolicy(action: string): any {
    return this.blockedActions.find((p: any) => p.action === action)
  }

  private async promptApproval(action: string, userId: string): Promise<boolean> {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    return new Promise((resolve) => {
      rl.question(`\nAT1C: Approve "${action}" for ${userId}? (y/n): `, (answer) => {
        rl.close()
        resolve(answer.toLowerCase() === 'y')
      })
    })
  }

  async enforce(
    config: { userId: string; action: string; agentId?: string },
    fn: () => Promise<any> | any
  ): Promise<any> {
    if (!this.blockedActions) {
      return { status: 'denied', reason: 'policy_engine_unavailable' }
    }

    const policy = this.getPolicy(config.action)
    if (policy?.decision === 'deny') {
      return { status: 'denied', reason: 'blocked_policy' }
    }

    const approved = await this.promptApproval(config.action, config.userId)

    const receipt = buildReceipt(
      {
        userId: config.userId,
        agentId: config.agentId ?? 'unknown',
        action: config.action,
        status: approved ? 'approved' : 'denied',
      },
      this.secretKey
    )

    this.approvalLog.push(receipt)

    const check = this.checkReceipt(receipt)
    if (!check.valid) {
      return { status: 'denied', reason: check.reason }
    }

    if (!approved) {
      return { status: 'denied', reason: 'user_rejected', receipt }
    }

    this.saveReceipt(receipt)
    const result = await fn()
    return { status: 'approved', result, receipt }
  }

  private saveReceipt(receipt: SignedReceipt): void {
    let receipts: SignedReceipt[] = []
    try {
      if (fs.existsSync('receipts.json')) {
        receipts = JSON.parse(fs.readFileSync('receipts.json', 'utf-8'))
      }
    } catch {
      receipts = []
    }
    receipts.push(receipt)
    fs.writeFileSync('receipts.json', JSON.stringify(receipts, null, 2))
  }
}
