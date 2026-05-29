# AT1C Signature Standard v0.1

## Purpose

AT1C signatures provide cryptographic proof that an approval receipt was authorized by a valid signing authority.

A signature binds authorization to:

- a specific action
- a specific payload
- a specific approval context
- a specific point in time

Signatures ensure that receipts cannot be modified without detection.

---

## Core Principle

A valid signature must prove that:

- the receipt originated from an authorized signer
- the payload has not been altered
- the approval context remains intact

Any modification to a signed receipt invalidates verification.

---

## Minimal Signing Flow

```txt
request → approve → serialize → sign → verify
```
