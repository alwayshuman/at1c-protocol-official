# AT1C Agent Execution Model v0.1

## Purpose

The Agent Execution Model defines how AI agents operate under AT1C authorization rules.

It connects:
- requests
- approvals
- receipts
- verification
- scopes

into a single execution flow.

---

## Core Principle

An AI agent MUST NOT execute any action unless it can:

- obtain or reference a valid scope OR receipt
- verify authorization via AT1C rules
- ensure execution is within allowed constraints

Execution is always conditional on authorization validity.

---

## Execution Flow

```txt
request → evaluate scope → request approval (if needed) → receive receipt → verify → execute
```

---

## Agent Responsibility

An agent is responsible for:

- determining if scope exists
- requesting approval when required
- attaching receipts to actions
- ensuring verification before execution
- refusing execution when authorization is invalid
