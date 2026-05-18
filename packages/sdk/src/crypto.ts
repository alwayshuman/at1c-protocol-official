export function createApprovalPayload(data: {
  userId: string;
  action: string;
  agentId: string;
  timestamp: string;
}): string {
  return JSON.stringify({
    userId: data.userId,
    action: data.action,
    agentId: data.agentId,
    timestamp: data.timestamp,
  });
}

export function createApprovalSignature(payload: string): string {
  return require("crypto")
    .createHash("sha256")
    .update(payload)
    .digest("hex");
}

export function signaturesMatch(
  actual: string,
  expected: string
): boolean {
  const crypto = require("crypto");

  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}
export function hashReceipt(
  receipt: any
): string {
  return require("crypto")
    .createHash("sha256")
    .update(
      JSON.stringify(receipt)
    )
    .digest("hex");
}
