const crypto = require('crypto');

// Generate a keypair
function generateKeypair() {
  return crypto.generateKeyPairSync('ed25519');
}

// Sign data
function signData(privateKey, data) {
  const buffer = Buffer.from(JSON.stringify(data));
  return crypto.sign(null, buffer, privateKey).toString('hex');
}

// Verify signature
function verifySignature(publicKey, data, signature) {
  const buffer = Buffer.from(JSON.stringify(data));
  return crypto.verify(
    null,
    buffer,
    publicKey,
    Buffer.from(signature, 'hex')
  );
}

module.exports = {
  generateKeypair,
  signData,
  verifySignature
};
