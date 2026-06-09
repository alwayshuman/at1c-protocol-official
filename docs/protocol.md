AT1C Protocol Specification v0.1
Cryptographic Approval Protocol for AI Agent Actions
Abstract

AT1C is a lightweight authorization protocol designed for autonomous AI systems.

The protocol introduces:

explicit human approval
cryptographic authorization receipts
deterministic verification
replay protection
auditable execution flows

AT1C is built around a simple primitive:

request → approve → proof → verify

The protocol explores how AI agents can perform actions only after producing verifiable proof of authorization.

Rather than relying on implicit trust, AT1C treats AI actions as signed and verifiable transactions.

Chapter 1 — Purpose

Modern AI systems are increasingly capable of autonomous execution.

Agents can:

deploy infrastructure
execute transactions
modify systems
call APIs
automate workflows
operate continuously

However, most AI architectures still lack a standardized authorization layer.

Current systems often cannot prove:

who approved an action
what exactly was approved
whether approval was altered
whether authorization was replayed
whether execution was validly authorized

AT1C exists to provide these primitives.

The protocol defines a structured approval flow for AI agent actions using cryptographic receipts and deterministic verification rules.

The objective of AT1C is not to replace AI orchestration systems.

Its purpose is to provide a dedicated authorization and proof layer for autonomous execution.

Core Principle

No system—human or AI—may act on behalf of a user without explicit approval, and that approval must be provable.

All actions performed on behalf of a user MUST satisfy:

Explicit Approval

Approval must be intentionally granted by the user or authorized authority.

Bound Context

Approval must be tied to a specific:

action
actor
scope
resource
execution context
Verifiable Proof

Authorization must produce proof that can be independently verified by any system.

Chapter 2 — Core Entities

AT1C defines five primary entities.

2.1 User (Human Principal)

The User represents the root authority within the protocol.

The User:

owns identity
grants approvals
defines authorization boundaries
may delegate permissions

The protocol assumes that authorization originates from human-controlled authority.

2.2 Agent

The Agent is the autonomous system requesting permission to perform an action.

Examples:

AI agents
coding agents
infrastructure agents
workflow orchestrators
applications
services

The Agent does not self-authorize actions.

All agents MUST:

operate within authorization scope
request approval for actions outside approved scope
2.3 Approver

The Approver is the authority responsible for approving or rejecting requested actions.

An Approver may be:

a human operator
an administrative authority
a policy engine
a future multi-signature approval group

The Approver generates authorization intent.

2.4 Receipt

A Receipt is a signed cryptographic proof of authorization.

The Receipt contains:

action metadata
timestamps
integrity data
replay protection primitives
signatures

The Receipt is the central proof object within the protocol.

2.5 Verifier

The Verifier validates:

receipt authenticity
payload integrity
signature correctness
replay status
expiration validity

Only verified receipts are considered authorized.

2.6 Executor

The Executor performs the approved action after successful verification.

Execution without verification is considered unauthorized under the protocol model.

Chapter 3 — Request Model

The Request stage begins the authorization lifecycle.

An Agent constructs a structured request describing the intended action.

Example request categories:

deploy production code
restart infrastructure
transfer funds
access protected data
invoke privileged APIs

Requests should be deterministic and serializable.

A request may contain:

action type
payload
timestamps
metadata
scope definitions
expiration constraints

Example request object:

{
  "actor": "deployment-agent",
  "action": "deploy_production",
  "resource": "payments-api",
  "payload": {
    "version": "v1.2.4"
  },
  "timestamp": 1740000000
}

The request itself does not authorize execution.

It only defines proposed intent.

Chapter 4 — Approval Model

Approval represents explicit authorization by an authority.

During approval:

The request is reviewed
Authorization intent is confirmed
Approval metadata is attached
A receipt is generated and signed

Approval metadata may include:

approver identity
approval timestamp
expiration windows
authorization scope
policy constraints

The approval phase converts a proposed action into a verifiable authorization event.

Approval / Denial

Requests may be:

approved
denied
expired
revoked

Approval does not imply unlimited authority.

Authorization is always context-bound.

Chapter 5 — Receipt Structure

The Receipt is the canonical authorization artifact within AT1C.

A valid receipt should contain sufficient information for independent verification.

Example structure:

{
  "id": "uuid",
  "actor": "deployment-agent",
  "action": "deploy_production",
  "resource": "payments-api",
  "payloadHash": "sha256:abc123...",
  "approvedBy": "admin",
  "timestamp": 1740000000,
  "expiresAt": 1740003600,
  "nonce": "7d8a2f...",
  "signature": "ed25519:..."
}
5.1 Required Fields
id

Unique identifier for the receipt.

actor

The requesting system or agent.

action

The approved action identifier.

resource

The target resource or execution domain.

payloadHash

Cryptographic hash of the request payload.

approvedBy

Identity of the approving authority.

timestamp

Approval creation timestamp.

nonce

Unique anti-replay value.

signature

Cryptographic signature over the receipt contents.

5.2 Optional Fields

Optional future fields may include:

expiration windows
scoped permissions
policy identifiers
execution constraints
multi-signature approvals
5.3 Serialization

Receipts should be serialized deterministically before signing.

Deterministic serialization ensures:

consistent hashing
signature stability
reproducible verification
Chapter 6 — Verification Rules

Verification determines whether a receipt is valid for execution.

A receipt is considered valid only if all verification rules succeed.

Rule 1 — No Implicit Authority

No action may be executed without explicit approval unless pre-authorized within defined scope.

Rule 2 — Context Binding

Approval MUST be bound to a specific:

action
actor
resource
execution scope

Reuse of approval outside its context is invalid.

Rule 3 — Proof Integrity

Proofs MUST be:

tamper-evident
reproducible
independently verifiable

The protocol should not require trust in the issuer after proof generation.

Rule 4 — Verification Before Execution

Any system receiving a request MUST verify proof before executing the action.

Rule 5 — Revocation

Users SHOULD be able to revoke:

agent permissions
delegated authority
prior approvals where applicable
6.1 Signature Verification

The signature must correctly validate against:

the serialized receipt
the approver public key

Invalid signatures immediately invalidate the receipt.

6.2 Integrity Verification

The payload hash must match the original request payload.

Modified payloads invalidate authorization.

6.3 Timestamp Validation

Verification may reject receipts that:

are expired
violate allowed time windows
contain invalid timestamps
6.4 Replay Protection

A previously used nonce must not be accepted again.

Replay detection prevents repeated execution using reused receipts.

6.5 Authorization Consistency

The approved action must match the executed action.

Authorization for one action does not imply authorization for another.

Chapter 7 — Replay Protection

Replay attacks are a core concern in autonomous execution systems.

Without replay protection:

valid receipts could be reused indefinitely
attackers could repeat previously approved actions
authorization events could be duplicated maliciously

AT1C mitigates replay attacks through nonce tracking.

7.1 Nonce Model

Each receipt contains a unique nonce value.

Example:

{
  "nonce": "7d8a2f..."
}

Nonce reuse invalidates authorization.

7.2 Receipt Persistence

Used receipts may be persisted locally or remotely.

Persistence enables:

replay detection
audit history
execution tracking

Current AT1C implementations may persist receipts in:

receipts.json
7.3 Single-Use Authorization

Receipts are intended to represent single authorization events unless explicitly configured otherwise.

Chapter 8 — Persistence Model

AT1C supports persistent storage of authorization artifacts.

Persistence allows:

replay prevention
auditing
historical verification
forensic analysis

Persisted data may include:

receipts
used nonces
approval timestamps
execution metadata

The persistence layer is implementation-specific and not tightly coupled to protocol semantics.

Chapter 9 — SDK Surface

AT1C implementations may expose a developer SDK for interacting with protocol primitives.

Example interface:

createRequest()
approveRequest()
signReceipt()
verifyReceipt()
detectReplay()
storeReceipt()
9.1 Design Goals

The SDK should prioritize:

deterministic behavior
inspectable primitives
minimal abstractions
explicit verification
composability
9.2 Protocol Independence

The protocol specification is independent from any single SDK implementation.

Different implementations may exist across:

TypeScript
Rust
Go
Python
distributed systems
embedded systems
Chapter 10 — Threat Model

AT1C currently attempts to mitigate:

unauthorized execution
tampered approvals
forged receipts
replayed authorization
payload modification
10.1 Non-Goals (v0.1)

AT1C v0.1 does not yet fully address:

compromised signing keys
distributed consensus
Byzantine fault tolerance
decentralized governance
malicious execution environments
hardware security guarantees

These areas are reserved for future protocol evolution.

Chapter 11 — Future Extensions

AT1C is intentionally minimal in early versions.

The protocol is designed to evolve incrementally.

Potential future extensions include:

threshold approvals
multi-signature authorization
policy engines
delegated authority
hardware-backed signing
decentralized verification
machine-readable governance
scoped execution permissions
zero-knowledge authorization proofs
post-quantum signature systems
cross-agent authorization standards
Identity Model

AT1C defines:

user identity is self-controlled
identity may exist across multiple systems
authorization remains portable between implementations

The protocol does NOT enforce:

a specific identity provider
a blockchain dependency
a centralized authority model
Implementation Agnosticism

AT1C is not tied to:

any blockchain
any execution environment
any identity provider
any infrastructure stack

The protocol MAY be implemented using:

UTXO-based systems
account-based systems
off-chain systems
centralized systems
distributed systems
Compliance

A system is considered AT1C-compliant if:

actions require valid approval or scoped authorization
approvals produce verifiable proof
proofs are verified before execution

Unattributed or unverifiable agent actions are considered non-compliant with the protocol model.

Conclusion

AT1C explores a simple foundational idea:

AI systems should be able to prove they were authorized to act.

The protocol introduces:

explicit approval
signed authorization receipts
deterministic verification
replay-safe execution
auditable authorization flows

As AI systems become more autonomous, authorization becomes increasingly important.

AT1C proposes that autonomous execution should not rely solely on trust.

It should rely on verifiable proof.

Summary

AT1C defines a minimal rule:

Actions require approval.
Approval produces proof.
Proof enables verification.

This establishes a foundation for:

accountable automation
user-controlled authorization
verifiable digital interactions
cryptographic accountability for AI systems

AT1C Protocol Specification  v0.1
A. Human
