const crypto = require("crypto");

// function normalize(data) {
  return JSON.stringify(
    Object.keys(data)
      .sort()
      .reduce((acc, key) => {
        acc[key] = data[key];
        return acc;
      }, {})
  );
}

// Generate keypair
function generateKeypair() {
  return crypto.generateKeyPairSync("ed25519");
}

// Sign data
function signData(privateKey, data) {
  const buffer = Buffer.from(normalize(data));
  return crypto.sign(null, buffer, privateKey).toString("hex");
}

// Verify signature
function verifySignature(publicKey, data, signature) {
  if (!signature) return false;

  const buffer = Buffer.from(normalize(data));

  return crypto.verify(
    null,
    buffer,
    publicKey,
    Buffer.from(signature, "hex")
  );
}

module.exports = {
  generateKeypair,
  signData,
  verifySignature
};
