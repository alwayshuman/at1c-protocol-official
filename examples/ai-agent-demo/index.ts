import { AT1C } from '../../packages/sdk/src/client'
import { verifyReceipt } from '../../packages/sdk/src/crypto'

async function main() {
  const at1c = new AT1C()

  console.log('\n🤖 AT1C AI Agent Demo')
  console.log('Public Key:', at1c.getPublicKey())

  const result = await at1c.enforce(
    {
      userId: 'user_demo',
      agentId: 'agent_001',
      action: 'send_email',
    },
    async () => {
      console.log('✅ Sending email...')
      return { sent: true }
    }
  )

  console.log('\n📋 Result:', result.status)

  if (result.status === 'approved') {
    const check = verifyReceipt(result.receipt)
    console.log('🔐 Receipt valid:', check.valid)
    if (!check.valid) {
      console.log('❌ Reason:', check.reason)
    }
  }
}

main().catch(console.error)
