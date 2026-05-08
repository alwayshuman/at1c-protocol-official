const crypto = require("crypto")
const fs = require("fs")

function createAgent(ownerUserId) {
  const agentId = "agent_" + crypto.randomBytes(4).toString("hex")

  const keypair = crypto.generateKeyPairSync("ed25519")

  const publicKey = keypair.publicKey.export({
    type: "spki",
    format: "pem"
  })

  const privateKey = keypair.privateKey.export({
    type: "pkcs8",
    format: "pem"
  })

  const agent = {
    agentId,
    ownerUserId,
    permissions: ["Sign in"],
    publicKey,
    privateKey,
    createdAt: Date.now()
  }

  let agents = []

  if (fs.existsSync("agents.json")) {
    agents = JSON.parse(fs.readFileSync("agents.json"))
  }

  agents.push(agent)

  fs.writeFileSync(
    "agents.json",
    JSON.stringify(agents, null, 2)
  )

  console.log("✅ Agent created")
  console.log(agent)

  return agent
}

module.exports = { createAgent }
