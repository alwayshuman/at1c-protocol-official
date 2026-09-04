const { ml_dsa65 } = require('@noble/post-quantum/ml-dsa')

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
  const sig = ml_dsa65.sign(privateKey, buffer)
  return Buffer.from(sig).toString('hex')
}

function verifySignature(publicKey, data, signature) {
  if (!signature) return false
  const buffer = Buffer.from(normalize(data))
  const sigBytes = Uint8Array.from(Buffer.from(signature, 'hex'))
  return ml_dsa65.verify(publicKey, buffer, sigBytes)
}

function generateKeypair() {
  const { randomBytes } = require('@noble/hashes/utils')
  const seed = randomBytes(32)
  const keys = ml_dsa65.keygen(seed)
  return {
    privateKey: keys.secretKey,
    publicKey: keys.publicKey
  }
}

module.exports = {
  signData,
  verifySignature,
  generateKeypair
}
