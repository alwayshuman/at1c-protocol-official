import { AT1C } from '../../packages/sdk/src/client'
import { verifyReceipt } from '../../packages/sdk/src/crypto'

async function main() {
  const at1c = new AT1C()

  console.log('\n🔐 AT1C Login Demo')
  console.log('Public Key:', at1c.getPublicKey())

  const result = await at1c.enforce(
    {
      userId: 'user_demo',
      agentId: 'login_agent',
      action: 'login',
    },
    async () => {
      console.log('✅ Login action executed')
      return { loggedIn: true }
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
