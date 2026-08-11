AT1C Verification Standard v0.1
Purpose
Verification is the process of determining whether an AT1C receipt represents valid authorization for execution.
A verifier evaluates whether:
    • the receipt is authentic
    • the receipt has not been modified
    • the approval is still valid
    • the receipt has not been replayed
    • the execution context matches the approved action
Verification is required before any protected action may execute.

Core Principle
Execution MUST NOT occur unless authorization can be independently verified.
Verification must be:
    • deterministic — same inputs always produce same result
    • tamper-resistant — signature validation catches any field modification
    • replay-safe — verifier maintains a nonce registry and rejects seen nonces
    • independently auditable — no callback to AT1C infrastructure required to verify a receipt

Verification Steps
A verifier MUST perform all of the following checks in order. Failure at any step MUST return an explicit rejection with a reason code.
Step 1 — Schema Validation
Confirm the receipt is well-formed and all required fields are present per the Receipt Schema v0.1.
Step 2 — Expiry Check
Confirm receipt.expires_at is in the future relative to the verifier's current UTC time.
now_utc < receipt.expires_at  →  PASS
Step 3 — Nonce Check
Confirm receipt.replay_nonce has not been seen before. The verifier MUST maintain a nonce registry persisted for at least the maximum receipt TTL.
nonce NOT IN nonce_registry  →  PASS
nonce_registry.add(nonce)
Step 4 — Signature Verification
Reconstruct the canonical receipt body (all fields except approval.signature, keys sorted, UTF-8 JSON) and verify the ed25519 signature against approval.authority.
ed25519_verify(
  public_key = approval.authority,
  message    = canonical_json(receipt_without_signature),
  signature  = approval.signature
)  →  PASS
Step 5 — Scope Validation
Resolve the referenced scope (action.scope_ref) and confirm all five scope matching conditions (actor, permission, resource, validity, constraints). See Scope Standard v0.1 for matching rules.
Step 6 — Context Match
Confirm the execution context presented to the verifier matches the action and resource declared in the receipt. What constitutes a valid context match is defined by the action type.
Note — v0.2 gap: Exact action fingerprinting rules (how an HTTP request, SQL statement, or API call maps to action.type + action.resource) are not specified in v0.1. This is the primary open design question for the next version. In v0.1, context match is the responsibility of the integrating system.

Verification Result
On success, the verifier returns a signed verification result:
{
  "verified": true,
  "receipt_id": "at1c_01J5K2M...",
  "verified_at": "2026-08-11T14:00:01Z",
  "action_class": "irreversible",
  "verifier_signature": "<ed25519 signature by AT1C verifier key, base64url>"
}
On failure:
{
  "verified": false,
  "receipt_id": "at1c_01J5K2M...",
  "reason": "NONCE_REPLAYED | EXPIRED | SIGNATURE_INVALID | SCOPE_MISMATCH | SCHEMA_ERROR",
  "verified_at": "2026-08-11T14:00:01Z"
}
The verifier signs its result so the caller can prove to a third party that verification was performed.

Irreversible Action Handling
When receipt.action.class is irreversible, the verifier SHOULD:
    1. Log the verification event with a durable timestamp
    2. Return the action_class field explicitly in the result
    3. Not re-verify the same receipt_id for a different execution (one receipt = one execution)
There is no rollback past an irreversible action. The Receipt is the pre-action evidence that authorization existed. Post-execution outcome attestation (what the action produced) is a v0.2 scope item.

Suppression Resistance
A Receipt is created at approval time, before execution. This means it exists as evidence independent of whether the downstream service logs the action. An agent cannot suppress the evidence of authorization by omitting a log entry — the Receipt was issued first.
This property holds as long as:
    • The Receipt is stored by the approving authority (not only by the agent)
    • The verifier's result is returned to the caller (not only to the agent)
On-chain anchoring of Receipt hashes for stronger suppression resistance is a planned v0.2 feature.

Minimal Verification Flow
receipt → validate schema → check expiry → check nonce → verify signature → validate scope → authorize → execute

