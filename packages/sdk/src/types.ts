export interface ApprovalReceipt {
  receiptId: string;
  receiptHash: string;
  version: string;
  status: "approved" | "denied";
  userId: string;
  agentId: string;
  action: string;
  timestamp: string;
  signature: string;
}
