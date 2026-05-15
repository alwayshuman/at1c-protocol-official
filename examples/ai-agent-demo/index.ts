import { AT1C } from "../../packages/sdk/src/client"

async function run() {
  const at1c = new AT1C({ apiKey: "demo_key" })

  console.clear()

  console.log("===================================")
  console.log("🤖 AI Agent Demo")
  console.log("===================================\n")

  const user = await at1c.identify()

  console.log("🧑 User:", user.userId)
  console.log("\n🤖 AI Agent wants to perform an action...\n")

  const action = "Send email to boss: 'I quit my job' 😅"

  console.log("⚠️  Action Requested:")
  console.log(action)
const result = await at1c.enforce(
  {
    userId: "user_demo",
    action: "send_email",
    actor: "ai-agent",
    agentId: "agent_3678c68b"
  },
  async () => {
    return {
      message: "Email sent (simulated)"
    }
  }
)
console.log("\n📦 Result:")
console.log(result)

if (result.status === "approved") {
  console.log("\n✅ Approved — AI executes action")
  console.log("📨 Email sent (simulated)")
} else {
  console.log("\n❌ Denied — AI blocked")
}

console.log("\n===================================")
}

run()

