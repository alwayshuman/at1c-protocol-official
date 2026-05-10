const crypto = require("crypto")
const fs = require("fs")

function signAgentAction(agentId, payload) {
  const raw = fs.readFileSync("agents.json", "utf-8")
  const agents = JSON.parse(raw)

  const agent = agents.find(a => a.agentId === agentId)

  if (!agent) {
    throw new Error("Agent not found")
  }

  const privateKey = agent.privateKey

  const data = JSON.stringify(payload)

  const signature = crypto.sign(
    null,
    Buffer.from(data),
    {
      key: privateKey,
      format: "pem"
    }
  )

  return signature.toString("hex")
}

module.exports = {
  signAgentAction
}
