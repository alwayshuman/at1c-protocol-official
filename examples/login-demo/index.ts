import { AT1C } from "../../packages/sdk/src/client"

async function main() {

  console.log("\n===================================")
  console.log("🌐 demo-app.com")
  console.log("===================================\n")

  console.log("🔘 [ Sign in with AT1C ]\n")

  const at1c = new AT1C({
    apiKey: "demo_key"
  })

  console.log("👉 User clicked 'Sign in with AT1C'\n")

  // ALWAYS use persistent identity
  const user = await at1c.identify()

  console.log("🧑 Identified:", user.userId)

  console.log("\n📲 Sending approval request to user...\n")

  // Protected action
  const result = await at1c.enforce(
    {
      userId: user.userId,
      action: "Sign in",
      actor: "demo-app.com"
    },

    async () => {
      return {
        success: true,
        sessionToken: "session_abc123"
      }
    }
  )

  console.log("\n🔐 Result:", result)

  if (result.status === "approved") {
    console.log("\n✅ Login approved")
  } else {
    console.log("\n❌ Login denied")
  }
}

main()
