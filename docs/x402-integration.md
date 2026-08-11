AT1C x402 Integration
Overview
AT1C exposes its /verify endpoint as an x402-protected pay-per-request service on Algorand.
An AI agent pays a small ALGO-denominated fee to verify that an AT1C Receipt is valid before executing a protected action. The payment settles on Algorand; the response is a signed verification result.
This positions AT1C as verification-as-a-service — one of the four core endpoint patterns for the agentic economy. The agent does not need to trust AT1C's infrastructure; the cryptographic verification result is independently auditable.

Why x402 + AT1C
Agent protocols (MCP, A2A) standardize how agents communicate. They do not standardize commitment — what authorization existed before an irreversible action ran.
AT1C fills that gap. The /verify endpoint is the enforcement gate an agent calls before committing an action on a user's behalf. Making it x402-gated means:
    • Verification is an atomic, priced capability
    • Every verification call settles on-chain with Algorand's deterministic finality
    • The settlement record and the AT1C Receipt together form a two-layer audit trail: payment proves the check was requested; the Receipt proves consent was granted

Endpoint
POST /verify
x402 Payment Details
Parameter	Value
Payment amount	0.001 USDC per verification
Settlement chain	Algorand Mainnet
Facilitator	GoPlausible x402 Facilitator
Currency	USDC (EUDC planned for EU AI Act-aligned deployments)

Request Body
{
  "receipt": { /* AT1C Receipt v0.1 object */ }
}
Response — Verification Granted
{
  "verified": true,
  "receipt_id": "at1c_01J5K2M...",
  "verified_at": "2026-08-11T14:00:01Z",
  "action_class": "irreversible",
  "verifier_signature": "<ed25519 sig by AT1C verifier key, base64url>"
}
Response — Verification Denied
{
  "verified": false,
  "receipt_id": "at1c_01J5K2M...",
  "reason": "EXPIRED | NONCE_REPLAYED | SIGNATURE_INVALID | SCOPE_MISMATCH",
  "verified_at": "2026-08-11T14:00:01Z"
}
Payment is required regardless of verification outcome. The fee covers the verification computation, not a guaranteed pass.

Agent Flow
1. User approves action → AT1C issues Receipt
2. Agent prepares x402 payment (0.001 ALGO)
3. Agent POST /verify with Receipt + x402 payment header
4. Algorand settles payment (~2.8s, deterministic finality)
5. AT1C verifies Receipt (6-step verification: schema, expiry, nonce, signature, scope, context)
6. AT1C returns signed verification result
7. Agent proceeds with action (if verified=true) or halts (if verified=false)
Step 7 is the enforcement gate. The agent's execution plane MUST NOT proceed past an irreversible action without a verified: true result carrying a valid verifier signature.

Audit Properties
After a verified execution, two independent artifacts exist:
Artifact	Proves	Lives on
Algorand transaction	Payment for verification was made, at timestamp T	Algorand ledger (permanent)
AT1C Receipt	User authorized the action before execution	AT1C + caller storage
Verifier result	Verification was performed and passed	Caller storage

Together these answer the incident-response question: "Did the agent have authorization to do this, and was that authorization checked?" — without relying on the agent's own logs.

Irreversible Action Gate
When the Receipt's action.class is irreversible, the verifier flags this explicitly in its response. Orchestration systems SHOULD treat a verified-irreversible result as the execution pivot — the point of no return past which compensation is not possible, only apology.
This maps directly to the authority mandate pattern: a signed, scope-bounded, time-bounded grant for a non-monetary irreversible action, verified on-chain before execution.

Deployment Notes
    • The /verify endpoint runs as a stateless service; nonce state is the only persistence requirement
    • x402 middleware wraps the endpoint; the core verification logic is chain-agnostic
    • USDC is the required denomination for the Algorand x402 Challenge; EUDC is the planned denomination for EU AI Act-aligned deployments post-launch
    • On-chain anchoring of Receipt hashes (for suppression resistance) is planned for v0.2 using Algorand's note field or a dedicated ARC
