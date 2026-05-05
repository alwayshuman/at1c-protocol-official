const fs = require("fs")
const { verifyReceipt } = require("./src/crypto/verifyReceipt")

const receipts = JSON.parse(fs.readFileSync("receipts.json", "utf-8"))

console.log("\n🔍 AT1C Verification Report\n")

receipts.forEach((r, i) => {
  const valid = verifyReceipt(r)

  console.log(`Receipt #${i + 1}`)
  console.log(`ID: ${r.receiptId}`)
  console.log(`Action: ${r.action}`)
  console.log(`Valid: ${valid ? "✅ YES" : "❌ NO"}`)
  console.log("------------------------")
})
