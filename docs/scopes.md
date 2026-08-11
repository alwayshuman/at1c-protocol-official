AT1C Scope Standard v0.1
Purpose
A Scope defines the boundaries within which an AI agent is allowed to act without requiring a new explicit approval.
Scopes enable controlled autonomy by pre-defining:
    • allowed actions
    • restricted resources
    • execution limits
    • time constraints
Scopes reduce approval friction while preserving accountability.

Core Principle
All agent actions MUST either:
    • fall within an approved scope, OR
    • require a new explicit approval
Any action outside scope is invalid without fresh authorization.

Scope Schema v0.1
{
  "scope_id": "at1c_scope_01J5K2M...",
  "version": "0.1",
  "issued_at": "2026-08-11T14:00:00Z",
  "expires_at": "2026-08-12T14:00:00Z",

  "actor": {
    "agent_id": "agent-identifier",
    "public_key": "<ed25519 public key, base64url>"
  },

  "permissions": [
    "send_email",
    "read_calendar"
  ],

  "resources": [
    "mailto:*@example.com",
    "calendar://user/primary"
  ],

  "constraints": {
    "max_executions": 50,
    "rate_limit": "10/hour",
    "max_spend_usd": "5.00"
  },

  "granted_by": {
    "authority": "<user DID or ed25519 public key, base64url>",
    "signature": "<ed25519 signature over canonical scope body, base64url>"
  }
}
Field Definitions
Field	Required	Description
scope_id	Yes	ULID prefixed with at1c_scope_. Globally unique.
version	Yes	Schema version. Currently "0.1".
issued_at	Yes	ISO 8601 UTC timestamp when scope was granted.
expires_at	Yes	ISO 8601 UTC timestamp after which scope is invalid.
actor.agent_id	Yes	The agent this scope applies to.
actor.public_key	Yes	Agent's ed25519 public key (base64url).
permissions	Yes	Array of action type strings the agent is permitted to perform.
resources	Yes	Array of resource patterns the agent may act on. Supports * wildcard at path level.
constraints.max_executions	No	Maximum number of actions permitted under this scope.
constraints.rate_limit	No	Rate limit string in N/period format (e.g. 10/hour, 100/day).
constraints.max_spend_usd	No	Maximum cumulative spend the agent may authorize under this scope.
granted_by.authority	Yes	DID or public key of the granting user.
granted_by.signature	Yes	ed25519 signature over canonical scope body (all fields except granted_by.signature), sorted keys.


Scope Matching
When evaluating a Receipt against a Scope:
    1. Actor match — receipt.actor.agent_id MUST equal scope.actor.agent_id
    2. Permission match — receipt.action.type MUST be in scope.permissions
    3. Resource match — receipt.action.resource MUST match at least one pattern in scope.resources
    4. Validity — scope.expires_at MUST be in the future at time of verification
    5. Constraint check — execution count and rate limit MUST not be exceeded
A Receipt referencing a Scope that fails any of these checks is INVALID.

Scope Delegation (v0.2)
Scope delegation — allowing a scope to be sub-granted to a child agent with equal or narrower bounds — is a v0.2 item. In v0.1, scopes are granted directly by a human authority to a single named agent.

Minimal Scope Flow
grant scope → operate within bounds → verify scope → execute or re-approve
