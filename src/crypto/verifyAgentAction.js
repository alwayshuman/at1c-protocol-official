const crypto = require("crypto")
const fs = require("fs")

function verifyAgentAction(agentId, payload, signatureHex) {
  const raw = fs.readFileSync("agents.json", "utf-8")
  const agents = JSON.parse(raw)

  const agent = agents.find(a => a.agentId === agentId)

  if (!agent) {
    throw new Error("Agent not found")
  }

  if (!agent.publicKey) {
    throw new Error("Missing public key")
  }

  const data = JSON.stringify(payload)

  return crypto.verify(
    null, // IMPORTANT: Ed25519 ignores hash algorithm here
    Buffer.from(data),
    {
      key: agent.publicKey,
      format: "pem",
      type: "spki"
    },
    Buffer.from(signatureHex, "hex")
  )
}

module.exports = { verifyAgentAction }
