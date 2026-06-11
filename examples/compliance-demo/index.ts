import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'
import { generateKeyPair, buildReceipt, verifyReceipt } from '../../packages/sdk/src/crypto'

const wantPdf = process.argv.includes('--pdf')

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

if (wantPdf) {
  const outputPath = path.join(process.cwd(), 'compliance-report.pdf')
  const scriptPath = path.join(__dirname, 'generate-compliance-pdf.py')
  const payload = JSON.stringify({
    receiptId:  receipt.receiptId,
    nonce:      receipt.nonce,
    userId:     receipt.userId,
    agentId:    receipt.agentId,
    action:     receipt.action,
    status:     receipt.status,
    timestamp:  receipt.timestamp,
    expiresAt:  receipt.expiresAt,
    signature:  receipt.signature,
    valid:      result.valid,
    reason:     result.valid ? undefined : result.reason,
  }).replace(/'/g, "'\''")
  console.log()
  console.log('📄 Generating PDF compliance report...')
  execSync(`python3 "${scriptPath}" "${outputPath}" '${payload}'`, { stdio: 'inherit' })
  console.log('✅ PDF report saved to compliance-report.pdf')
} else if (process.argv.includes('--html')) {
  const outputPath = path.join(process.cwd(), 'compliance-report.html')
  const scriptPath = path.join(__dirname, 'generate-compliance-html.py')
  const payload = JSON.stringify({
    receiptId:  receipt.receiptId,
    nonce:      receipt.nonce,
    userId:     receipt.userId,
    agentId:    receipt.agentId,
    action:     receipt.action,
    status:     receipt.status,
    timestamp:  receipt.timestamp,
    expiresAt:  receipt.expiresAt,
    signature:  receipt.signature,
    valid:      result.valid,
    reason:     result.valid ? undefined : result.reason,
  }).replace(/'/g, "'\\''")
  console.log()
  console.log('🌐 Generating HTML compliance report...')
  execSync(`python3 "${scriptPath}" "${outputPath}" '${payload}'`, { stdio: 'inherit' })
  console.log('✅ HTML report saved to compliance-report.html')
} else {
  const lines = [
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '        AT1C COMPLIANCE REPORT            ',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `Receipt ID  : ${receipt.receiptId}`,
    `Nonce       : ${receipt.nonce}`,
    `User        : ${receipt.userId}`,
    `Agent       : ${receipt.agentId}`,
    `Action      : ${receipt.action}`,
    `Status      : ${receipt.status}`,
    `Approved at : ${receipt.timestamp}`,
    `Expires at  : ${receipt.expiresAt}`,
    `Signature   : ${receipt.signature}`,
    '',
    `VERIFICATION: ${result.valid ? 'VALID — Cryptographically proven' : 'INVALID — ' + result.reason}`,
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `Generated   : ${new Date().toISOString()}`,
    '',
  ]
  fs.writeFileSync('compliance-report.txt', lines.join('\n'))
  console.log()
  console.log('📄 Report saved to compliance-report.txt')
}
