const crypto = require("crypto")
const fs = require("fs")

function signAgentAction(agentId, payload) {
  const agents = JSON.parse(fs.readFileSync("agents.json", "utf-8"))

  const agent = agents.find(a => a.agentId === agentId)

  if (!agent) {
    throw new Error("Agent not found")
  }

  const sign = crypto.createSign("SHA256")

  sign.update(JSON.stringify(payload))
  sign.end()

  const signature = sign.sign(agent.privateKey, "hex")

  return {
    agentId,
    payload,
    signature,
    timestamp: Date.now()
  }
}

module.exports = { signAgentAction }
)

