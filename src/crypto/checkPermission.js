const fs = require("fs")

const DEBUG = true

function getAgentForUser(userId) {
  const data = fs.readFileSync("agents.json", "utf-8")
  const agents = JSON.parse(data)

  return agents.find(a => a.ownerUserId === userId)
}

function checkPermission(userId, action) {
  try {
    const agent = getAgentForUser(userId)

    if (DEBUG) {
      console.log("\n🔍 PERMISSION DEBUG")
      console.log("User:", userId)
      console.log("Action:", action)
      console.log("Agent found:", !!agent)
    }

    if (!agent) {
      if (DEBUG) console.log("❌ No agent found")
      return false
    }

    if (agent.expiresAt && Date.now() > agent.expiresAt) {
      if (DEBUG) console.log("⛔ Agent expired")
      return false
    }

    if (DEBUG) {
      console.log("Permissions:", agent.permissions)
      console.log("Match check:", agent.permissions.includes(action))
    }

    const allowed = agent.permissions.includes(action)

    if (DEBUG) {
      console.log(allowed ? "✅ ALLOWED" : "🚫 DENIED")
    }

    return allowed

  } catch (err) {
    console.error("Permission check failed:", err)
    return false
  }
}

function getAgentForUserDebug(userId) {
  return getAgentForUser(userId)
}

module.exports = {
  checkPermission,
  getAgentForUser,
  getAgentForUserDebug
}
