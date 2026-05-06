const crypto = require("crypto")

function normalize(data) {
  return JSON.stringify(
    Object.keys(data)
      .sort()
      .reduce((acc, key) => {
        acc[key] = data[key]
        return acc
      }, {})
  )
}

function signData(privateKey, data) {
  const buffer = Buffer.from(normalize(data))
  return crypto.sign(null, buffer, privateKey).toString("hex")
}

function verifySignature(publicKey, data, signature) {
  if (!signature) return false

  const buffer = Buffer.from(normalize(data))

  return crypto.verify(
    null,
    buffer,
    publicKey,
    Buffer.from(signature, "hex")
  )
}

function generateKeypair() {
  return crypto.generateKeyPairSync("ed25519")
}

module.exports = {
  signData,
  verifySignature,
  generateKeypair
}
