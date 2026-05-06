const fs = require("fs")

function checkPermission(agentId, action) {
  const agents = JSON.parse(fs.readFileSync("agents.json", "utf-8"))

  const agent = agents.find(a => a.agentId === agentId)

  if (!agent) {
    console.log("❌ Agent not found")
    return false
  }

  if (agent.expiresAt && Date.now() > agent.expiresAt) {
    console.log("❌ Agent expired")
    return false
  }

  if (!agent.permissions.includes(action)) {
    console.log("❌ Action not permitted for this agent")
    return false
  }

  return true
}

module.exports = { checkPermission }
