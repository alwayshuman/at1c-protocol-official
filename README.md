🔐 AT1C Protocol
AI Agentic Verified Accountability Layer

Make every AI action accountable to a human — by default.

Verifiable approval for human and AI actions.

Nothing can act on behalf of a user without their approval — and that approval must be provable.

Why AT1C Exists

Modern systems operate on implicit trust:

Apps act on behalf of users silently
AI agents execute actions without oversight
Identity is fragmented and platform-controlled

This leads to:

automation without accountability
unclear responsibility for actions
unverifiable agent behavior
AT1C Core Idea

AT1C introduces a simple rule:

No action is valid unless backed by verifiable human approval.

This becomes a universal authorization layer for:

AI agents
applications
services
automated systems
Core Primitive
request → approve → proof → verify
How It Works
1. Request

A system or AI agent requests permission to perform an action.

2. Approve

A human explicitly approves or denies the request.

3. Proof

A cryptographic receipt is generated binding:

user identity
action
context
timestamp
nonce
4. Verify

Any system can independently verify the proof before execution.

Quick Example (SDK)
const user = await at1c.identify()

const approval = await at1c.request({
  actor: "ai_agent",
  action: "post_content",
  resource: "user://social_account"
})

await at1c.approve(approval)

const proof = await at1c.getProof(approval)

// Any system can verify
await at1c.verify(proof)
What This Enables
Safe AI agents (cannot act without permission)
Consent-based authentication (beyond passwords)
Auditable digital actions (who approved what, when)
Human-in-the-loop automation
Verifiable system-to-system execution
The AT1C Solution

AT1C introduces a control layer:

User-controlled identity
Explicit approval before execution
Verifiable cryptographic proof of consent
AI agents gated by human intent

AT1C doesn’t replace existing systems — it wraps them with accountability.

📜 Protocol Specification (AT1C v0.1)

AT1C is a lightweight authorization protocol for autonomous systems.

It defines how AI and software systems can act only after producing verifiable proof of human approval.

Core Principle

All actions MUST satisfy:

1. Explicit Approval

Approval is intentionally granted by a human authority.

2. Bound Context

Approval is tied to:

action
actor
resource
execution scope
3. Verifiable Proof

Approval produces cryptographic proof that can be independently verified.

Core Flow
request → approve → proof → verify
Entities
User (Human Principal)
Root authority
Grants approval
Controls identity and permissions
Agent
AI or system acting on behalf of user
Cannot self-authorize
Approver
Human or policy system
Grants or denies requests
Receipt
Cryptographic proof of approval
Signed authorization artifact
Verifier
Validates receipts before execution
Executor
Performs action only after verification
Receipt Structure
{
  "id": "uuid",
  "actor": "ai_agent",
  "action": "post_content",
  "resource": "user://social_account",
  "payloadHash": "sha256:abc123",
  "approvedBy": "user",
  "timestamp": 1740000000,
  "expiresAt": 1740003600,
  "nonce": "random",
  "signature": "ed25519:..."
}
Verification Rules

A receipt is valid only if:

signature is valid
payload is unchanged
nonce is unused (replay protection)
timestamp is valid
scope matches requested action
Core Safety Rules
Rule 1 — No Implicit Authority

No system may act without explicit approval or scoped permission.

Rule 2 — Context Binding

Approval is valid only for its exact action + resource.

Rule 3 — Proof Integrity

Receipts must be tamper-evident and independently verifiable.

Rule 4 — Verification Before Execution

All actions must be verified before execution.

Rule 5 — Replay Protection

Receipts cannot be reused.

Replay Protection

AT1C uses nonce-based tracking to prevent reuse of approvals.

Each receipt is single-use unless explicitly defined otherwise.

Identity Model
Identity is user-controlled
Identity is portable across systems
AT1C does not enforce identity providers
Cryptographic Requirements

Implementations must provide:

secure digital signatures
collision-resistant hashing
timestamp integrity

Optional:

zero-knowledge proofs
hardware-backed keys
post-quantum signatures
SDK Surface
createRequest()
approveRequest()
signReceipt()
verifyReceipt()
detectReplay()
storeReceipt()
Try It (30 seconds)
git clone https://github.com/alwayshuman/at1c.git
cd at1c
npx ts-node --compiler-options '{"module":"CommonJS"}' examples/login-demo/index.ts
Demo 1 — Identity + Approval
user identified
approval requested
access granted only after consent
Demo 2 — AI Agent Approval
AI requests permission
user approves or denies
execution is gated by approval
Documentation
Protocol Spec:
https://github.com/alwayshuman/at1c-protocol-official/blob/main/docs/protocol.md

Whitepaper:
https://github.com/alwayshuman/at1c/blob/main/docs/whitepaper.md

Vision

AT1C can become the standard authorization layer for:

AI safety & accountability
permission-based automation
verifiable digital systems
identity-controlled execution
Project Structure
at1c/
 ├── docs/        # protocol + whitepaper
 ├── packages/    # SDK
 ├── examples/    # demos
Closing Principle

AI systems should be able to prove they were authorized to act.

Summary

AT1C defines a minimal rule:

Actions require approval.
Approval produces proof.
Proof enables verification.
License

MIT

A.Human
