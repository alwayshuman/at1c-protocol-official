# AT1C Protocol
### AI Agentic Verified Accountability Layer

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/@at1c/sdk)](https://www.npmjs.com/package/@at1c/sdk)
[![Registry](https://img.shields.io/badge/registry-live-blue.svg)](https://registry.at1c.com/health)

AI should never act on your behalf without your permission — and that permission should be provable.

AT1C is an open protocol that makes every AI action auditable, consent-based, and cryptographically verifiable.

Built for developers. Designed for the EU AI Act (enforcement: August 2026).

---

## Try it in 30 seconds

```bash
git clone https://github.com/at1c-protocol/at1c-protocol-official.git
cd at1c-protocol-official
npm install
npm run demo
```

Or install the SDK directly:

```bash
npm install @at1c/sdk
```

---

## Live Registry

The AT1C Agent Registry is live at **[registry.at1c.com](https://registry.at1c.com/health)**

```bash
curl https://registry.at1c.com/health
```

---

## What is AT1C?

Modern AI systems act silently — apps execute on your behalf without oversight, and there is no proof any of it was authorised.

AT1C fixes that with one rule: **No action is valid unless backed by verifiable human approval.**

Every action produces a signed receipt. Every receipt can be independently verified.

---

## How it works
request → approve → proof → verify

1. **Request** — an AI agent asks permission to perform an action
2. **Approve** — a human explicitly grants or denies it
3. **Proof** — a cryptographic receipt is generated, binding the user, action, timestamp, and nonce
4. **Verify** — any system can independently verify the receipt before execution

---

## Why it matters right now

The EU AI Act begins enforcement in **August 2026**. It requires:
- Accountability for automated decisions
- Human oversight of high-risk AI actions
- Auditable records of AI behaviour

AT1C gives you all three out of the box — as a lightweight SDK you can wrap around any existing system.

Targeted at: fintech, health, and legal sectors.

---

## Core Safety Rules

- **No implicit authority** — nothing acts without explicit approval
- **Context binding** — approval is valid only for its exact action and resource
- **Replay protection** — every receipt is single-use
- **Verification before execution** — actions must be verified before they run

---

## Project structure
at1c-protocol-official/

docs/      # protocol spec + whitepaper

packages/  # SDK (@at1c/sdk)

examples/  # compliance demo, login demo, AI agent demo

---

## Documentation

- Protocol Spec: [docs/protocol.md](https://github.com/at1c-protocol/at1c-protocol-official/blob/main/docs/protocol.md)
- npm package: [@at1c/sdk](https://www.npmjs.com/package/@at1c/sdk)
- Live registry: [registry.at1c.com](https://registry.at1c.com/health)

---

## Known Limitations & Roadmap

AT1C v1.0 is the protocol and SDK foundation. The following are known gaps being addressed in upcoming releases:

- **Agent key custody — ✅ done (v1.1)** — non-custodial by design. Agents generate their own keypairs locally and the registry only ever receives and signs over the public key.

- **Live registry — ✅ done (v1.2)** — the AT1C Agent Registry is live at `registry.at1c.com`, serving authenticated agent verification over HTTPS. Registry private key held in environment variables only, never on the filesystem.

- **End-user onboarding (planned)** — a passkey-based (WebAuthn/FIDO2) flow for non-technical users. The signing key lives on the user's device, unlocked by Face ID / fingerprint — AT1C never holds it.

- **Receipt storage (planned, opt-in add-on)** — currently receipts are stored locally. Hosted, long-term receipt storage with explicit opt-in consent is planned as an optional paid tier, framed as an evidence/insurance service.

- **Agent Manifest (planned, future)** — a structured, signed document per agent mapping directly onto EU AI Act Article 13/14 documentation requirements.

These are documented here deliberately — AT1C's value depends on being verifiable and trustworthy, and that includes being transparent about what is solid today versus what is still being built.

---

## Licence

MIT — [AT1C Protocol Contributors](LICENSE)
