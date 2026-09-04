# @at1c/sdk

**AI Transparency & Compliance Protocol**

> No action without consent. No consent without proof.

AT1C is a lightweight SDK that wraps any AI agent action with cryptographic human approval. Every action produces a signed receipt. Every receipt can be independently verified. Built for the **EU AI Act** (enforcement: August 2026).

[![npm version](https://img.shields.io/npm/v/@at1c/sdk)](https://www.npmjs.com/package/@at1c/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## Why AT1C?

Modern AI agents act silently. They execute on your behalf without oversight, and there is no proof any of it was authorised. AT1C fixes that with one rule:

**No action is valid unless backed by verifiable human approval.**

Every action produces a signed receipt binding the user, agent, action, timestamp, and nonce. Any system can independently verify the receipt before execution.

---

## Install

```bash
npm install @at1c/sdk
```

---

## Quick Start

```typescript
import { AT1C } from '@at1c/sdk'

const at1c = new AT1C()

const result = await at1c.enforce(
  {
    userId:  'user_123',
    agentId: 'agent_payments',
    action:  'send_payment',
  },
  async () => {
    // Your AI agent action goes here
    return sendPayment({ amount: 500, to: 'john_smith' })
  }
)

if (result.status === 'approved') {
  console.log('Action completed. Receipt ID:', result.receipt.receiptId)
} else {
  console.log('Action blocked:', result.reason)
}
```

That's it. The action only runs if a human explicitly approves it. The receipt proves it happened.

---

## Core Concepts

### The Enforce Pattern

`at1c.enforce()` wraps any action with the full AT1C flow:

```
request → policy check → human approval → sign receipt → verify → execute
```

```typescript
const result = await at1c.enforce(config, fn)

// result.status  — 'approved' | 'denied'
// result.receipt — the signed cryptographic receipt
// result.reason  — why it was denied (if applicable)
// result.result  — the return value of fn() (if approved)
```

### Receipts

Every approved action produces a `SignedReceipt`:

```typescript
{
  receiptId:  'uuid',           // unique receipt identifier
  nonce:      'uuid',           // single-use replay protection
  version:    '1.0',
  status:     'approved',
  userId:     'user_123',
  agentId:    'agent_payments',
  action:     'send_payment',
  timestamp:  '2026-06-12T09:00:00.000Z',
  expiresAt:  '2026-06-12T09:05:00.000Z',
  signature:  'ed25519 hex signature',
  publicKey:  'ed25519 public key hex',
}
```

### Verification

Any system can independently verify a receipt:

```typescript
import { verifyReceipt } from '@at1c/sdk'

const result = verifyReceipt(receipt)

if (result.valid) {
  // Safe to proceed — human approval cryptographically proven
} else {
  console.log('Invalid receipt:', result.reason)
  // reason: 'expired' | 'invalid_signature' | 'not_approved' |
  //         'replay_detected' | 'malformed_receipt'
}
```

### Policy Engine

Control which actions require approval, are always allowed, or always blocked:

```json
// policies.json
[
  { "action": "delete_database", "severity": "critical",  "decision": "deny" },
  { "action": "send_payment",    "severity": "high",      "decision": "require_approval" },
  { "action": "read_data",       "severity": "low",       "decision": "allow" }
]
```

---

## Advanced Usage

### Build and Sign Receipts Manually

```typescript
import { buildReceipt, verifyReceipt, generateKeyPair } from '@at1c/sdk'

const { secretKey } = generateKeyPair()

const receipt = buildReceipt(
  {
    userId:     'user_123',
    agentId:    'agent_payments',
    action:     'send_payment',
    status:     'approved',
    ttlSeconds: 300,   // receipt valid for 5 minutes
  },
  secretKey
)

const check = verifyReceipt(receipt)
console.log(check.valid) // true
```

### Persist Keys Across Sessions

```typescript
import { loadOrCreateKeyPair } from '@at1c/sdk'

// Loads existing keys or generates and saves new ones
const keyPair = loadOrCreateKeyPair('.at1c_keys.json')
```

### Access the Approval Log

```typescript
const at1c = new AT1C()

// ... run some actions ...

const log = at1c.getApprovalLog()
console.log(`${log.length} actions recorded this session`)
```

---

## Security Properties

| Property | How AT1C provides it |
|---|---|
| **No implicit authority** | Nothing executes without explicit human approval |
| **Context binding** | Approval is valid only for its exact action, agent, and user |
| **Replay protection** | Every receipt is single-use via nonce |
| **Tamper detection** | Ed25519 signature covers all receipt fields |
| **Audit trail** | Every action logged with cryptographic proof |
| **Expiry** | Receipts expire after a configurable TTL |

---

## EU AI Act Compliance

AT1C receipts satisfy the core transparency and accountability requirements of the EU AI Act (Regulation 2024/1689):

- **Article 13** — Transparency obligations for AI systems
- **Article 14** — Human oversight of high-risk AI actions
- **Article 17** — Quality management and audit records

Generate a human-readable compliance report:

```bash
npm run demo -- --html   # self-contained HTML receipt
npm run demo -- --pdf    # PDF for formal audit submission
```

---

## API Reference

### `new AT1C()`
Creates an AT1C instance. Generates a session keypair and loads `policies.json` if present.

### `at1c.enforce(config, fn)`
Wraps an action with the full AT1C flow. Returns `{ status, receipt, reason?, result? }`.

### `at1c.checkReceipt(receipt)`
Verifies a receipt and checks for replay. Returns `{ valid, reason? }`.

### `at1c.getApprovalLog()`
Returns all receipts issued this session.

### `at1c.getPublicKey()`
Returns the session public key as hex.

### `buildReceipt(config, secretKey)`
Builds and signs a receipt. Returns `SignedReceipt`.

### `verifyReceipt(receipt)`
Verifies signature, expiry, status, and replay. Returns `VerifyResult`.

### `generateKeyPair()`
Generates a new Ed25519 keypair. Returns `KeyPair`.

### `loadOrCreateKeyPair(filePath)`
Loads keys from disk or generates and saves new ones.

---

## Run the Demo

```bash
git clone https://github.com/at1c-protocol/at1c-protocol-official.git
cd at1c-protocol-official
npm install
npm run demo          # terminal output
npm run demo -- --html  # HTML compliance receipt
npm run demo -- --pdf   # PDF compliance receipt
```

---

## Licence

MIT — AT1C Protocol
