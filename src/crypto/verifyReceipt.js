const fs = require("fs")
const { verifySignature } = require("./signature")

const publicKey = fs.readFileSync("keys/public.pem", "utf-8")

function verifyReceipt(receipt) {
  const { signature, ...data } = receipt

  return verifySignature(publicKey, data, signature)
}

module.exports = { verifyReceipt }
