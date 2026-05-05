const fs = require("fs")
const { signData } = require("./signature")

const privateKey = fs.readFileSync("keys/private.pem", "utf-8")

function createSignedReceipt(receiptData) {
  const signature = signData(privateKey, receiptData)

  return {
    ...receiptData,
    signature
  }
}

module.exports = { createSignedReceipt }
