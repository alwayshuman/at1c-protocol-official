
import { AT1C } from "../../packages/sdk/src/client"

async function main() {
  console.log("===================================")
  console.log("🌐 demo-app.com")
  console.log("===================================\n")

  const at1c = new AT1C({ apiKey: "demo_key" })

  console.log("🔘 [ Sign in with AT1C ]\n")

  console.log("👉 User clicked 'Sign in with AT1C'\n")

  // simple user (no identify() needed now)
  const userId = "user_" + Math.random().toString(36).substring(2, 8)

  console.log("🧑 Identified:", userId)
  console.log("\n📲 Sending approval request to user...\n")

  const result = await at1c.enforce(
    {
      userId,
      action: "Sign in",
      actor: "demo-app.com"
    },
    async () => {
      return {
        success: true
      }
    }
  )

  console.log("\n🔐 Result:", result)

  if (result.status === "approved") {
    console.log("\n✅ Login successful")
  } else {
    console.log("\n❌ Login denied")
  }
}

main()
