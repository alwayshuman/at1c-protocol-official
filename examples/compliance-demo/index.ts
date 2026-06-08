import { generateKeyPair, buildReceipt, verifyReceipt } from '../../packages/sdk/src/crypto'

const keys = generateKeyPair()

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('        AT1C COMPLIANCE DEMO v1.0         ')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log()
console.log('🤖 AI Agent requesting: Send £500 to John Smith')
console.log('👤 Human approval required before execution...')
console.log()

const receipt = buildReceipt(
  {
    userId: 'user_grandad_001',
    agentId: 'ai_payment_agent',
    action: 'send_payment:£500:john_smith',
    status: 'approved',
  },
  keys.secretKey
)

console.log('✅ Human approved the action')
console.log()
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('           COMPLIANCE RECEIPT             ')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log(`Receipt ID  : ${receipt.receiptId}`)
console.log(`Nonce       : ${receipt.nonce}`)
console.log(`User        : ${receipt.userId}`)
console.log(`Agent       : ${receipt.agentId}`)
console.log(`Action      : ${receipt.action}`)
console.log(`Status      : ${receipt.status}`)
console.log(`Approved at : ${receipt.timestamp}`)
console.log(`Expires at  : ${receipt.expiresAt}`)
console.log(`Signature   : ${receipt.signature.slice(0, 32)}...`)
console.log()

const result = verifyReceipt(receipt)
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log(`VERIFICATION: ${result.valid ? '✅ VALID — Cryptographically proven' : '❌ INVALID — ' + result.reason}`)
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
