const { checkPermission } = require("./checkPermission")
const { createSignedReceipt } = require("./createSignedReceipt")

function enforce({ userId, agentId, action, actor, approved }) {

  const allowed = checkPermission(agentId, action)

  const finalApproved = approved && allowed

  const status = finalApproved ? "approved" : "denied"

  const receipt = createSignedReceipt({
    receiptId: "receipt_" + Date.now(),
    userId,
    agentId,
    action,
    actor,
    status,
    timestamp: Date.now()
  })

  return {
    status,
    receipt
  }
}

module.exports = { enforce }
