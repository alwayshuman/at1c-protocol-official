AT1C Receipt Standard v0.1
Purpose
A Receipt is a signed cryptographic authorization artifact generated after approval of an action request.
The Receipt acts as verifiable proof that:
    • a specific action
    • was approved
    • by a specific authority
    • at a specific time
within a defined execution context.
Receipts are the core authorization primitive within AT1C.
They enable:
    • independent verification
    • replay protection
    • execution accountability
    • authorization auditing
A valid receipt allows systems to verify authorization without relying on implicit trust.

Core Principle
A receipt must be:
    • verifiable — signature is checkable by any party with the authority's public key
    • tamper-evident — any field modification invalidates the signature
    • context-bound — tied to a specific action and scope, not reusable for others
    • replay-safe — nonce + expiry prevent resubmission
    • independently auditable — contains all information needed to audit without calling back to AT1C

Receipt Schema v0.1
{
  "receipt_id": "at1c_01J5K2M...",
  "version": "0.1",
  "issued_at": "2026-08-11T14:00:00Z",
  "expires_at": "2026-08-11T14:05:00Z",

  "actor": {
    "agent_id": "agent-identifier",
    "public_key": "<ed25519 public key, base64url>"
  },

  "action": {
    "type": "send_email",
    "class": "irreversible",
    "scope_ref": "at1c_scope_01J5K...",
    "resource": "mailto:recipient@example.com",
    "description": "Send project update to client"
  },

  "approval": {
    "authority": "<user DID or ed25519 public key, base64url>",
    "signature": "<ed25519 signature over canonical receipt body, base64url>"
  },

  "replay_nonce": "<32 random bytes, base64url>"
}
Field Definitions
Field	Required	Description
receipt_id	Yes	ULID prefixed with at1c_. Globally unique.
version	Yes	Schema version. Currently "0.1".
issued_at	Yes	ISO 8601 UTC timestamp of approval.
expires_at	Yes	ISO 8601 UTC timestamp after which receipt is invalid.
actor.agent_id	Yes	Identifier for the agent requesting the action.
actor.public_key	Yes	Agent's ed25519 public key (base64url). Used to verify agent identity.
action.type	Yes	Action identifier string (e.g. send_email, delete_file, post_message).
action.class	Yes	One of compensable, retriable, or irreversible. See Action Classes below.
action.scope_ref	Yes	Reference to the Scope that authorizes this action.
action.resource	Yes	The specific resource this action targets. URI or structured descriptor.
action.description	No	Human-readable description shown to the approving authority.
approval.authority	Yes	DID or public key of the approving party (the user).
approval.signature	Yes	ed25519 signature over the canonical receipt body (all fields except approval.signature itself), serialized as UTF-8 JSON with sorted keys.
replay_nonce	Yes	32 random bytes (base64url). Verifier MUST reject a previously-seen nonce.


Action Classes
The action.class field is a first-class property of AT1C receipts. It encodes whether the approved action can be undone, informing downstream saga orchestration and escalation logic.
Class	Meaning	Verifier behavior
compensable	Action can be reversed by a defined compensation step	Verifier MAY record undo context
retriable	Action is idempotent; safe to retry on failure	Verifier notes retry safety
irreversible	Action cannot be undone once executed	Verifier SHOULD require explicit user confirmation before granting

An irreversible receipt represents the execution pivot — once past it, there is no rollback, only apology. Verifiers and orchestration systems MUST treat this boundary with special care.

Signature Construction
The canonical body for signing is the full receipt JSON with:
    • keys sorted lexicographically at every level
    • approval.signature field omitted
    • serialized as UTF-8 with no extra whitespace
signature = ed25519_sign(
  private_key = authority_signing_key,
  message     = canonical_json(receipt_without_signature)
)

Minimal Receipt Lifecycle
request → approve → receipt → verify → execute

Scope Boundaries
What a Receipt proves:
    • A specific authority approved a specific action at a specific time
    • The action falls within a declared scope
    • The approval has not expired
    • The nonce has not been replayed
What a Receipt does not prove:
    • What data was returned after the action executed (post-execution outcome)
    • That the executing agent stayed within the resource described
Post-execution outcome attestation is a v0.2 scope item (response digest / service-attested result hash).
