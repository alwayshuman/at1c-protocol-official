const crypto = require("crypto")

export class SDK {

  async getProof(): Promise<any> {
    return {
      proof: crypto.randomBytes(32).toString("hex")
    }
  }

  async verify(proof: any): Promise<boolean> {
    if (!proof || !proof.signature) return false
    return proof.signature.startsWith("mock-signature")
  }

}
