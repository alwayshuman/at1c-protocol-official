# AT1C Scope Standard v0.1

## Purpose

A Scope defines the boundaries within which an AI agent is allowed to act without requiring a new explicit approval.

Scopes enable controlled autonomy by pre-defining:

- allowed actions
- restricted resources
- execution limits
- time constraints

Scopes reduce approval friction while preserving accountability.

---

## Core Principle

All agent actions MUST either:

- fall within an approved scope, OR
- require a new explicit approval

Any action outside scope is invalid without fresh authorization.

---

## Scope Structure

A Scope defines:

- actor (who the scope applies to)
- permissions (what actions are allowed)
- resources (what can be accessed)
- constraints (limits on execution)
- expiry (time validity)

---

## Minimal Scope Flow

```txt
grant scope → operate within bounds → verify scope → execute or re-approve
```
