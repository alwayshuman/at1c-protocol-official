# AT1C Policy Engine v0.1

## Purpose

The Policy Engine determines whether an AI agent action:

- is automatically allowed
- requires explicit approval
- is denied

It acts as the decision layer between scopes and execution.

---

## Core Principle

All actions MUST pass through policy evaluation before execution.

Policy evaluation determines:

- authorization requirement level
- risk classification
- approval necessity

No action may bypass policy evaluation.

---

## Decision Outcomes

A policy evaluation returns one of three outcomes:

### 1. Allow

The action is permitted within scope and policy rules.
No additional approval required.

### 2. Require Approval

The action is permitted conditionally.
A valid AT1C receipt MUST be generated before execution.

### 3. Deny

The action is not permitted under any condition.
Execution MUST NOT occur.

---

## Evaluation Flow

```txt
action → scope check → policy evaluation → decision → (execute | request approval | deny)
```
