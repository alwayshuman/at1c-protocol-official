# AT1C Protocol
### AI Agentic Verified Accountability Layer

AI should never act on your behalf without your permission - and that permission should be provable.

AT1C is an open protocol that makes every AI action auditable, consent-based, and cryptographically verifiable.

Built for developers. Designed for the EU AI Act (enforcement: August 2026).

---

## Try it in 30 seconds

    git clone https://github.com/alwayshuman/at1c-protocol-official.git
    cd at1c-protocol-official
    npm install
    npm run demo

---

## What is AT1C?

Modern AI systems act silently - apps execute on your behalf without oversight, and there is no proof any of it was authorised.

AT1C fixes that with one rule: No action is valid unless backed by verifiable human approval.

Every action produces a signed receipt. Every receipt can be independently verified.

---

## How it works

    request -> approve -> proof -> verify

1. Request - an AI agent asks permission to perform an action
2. Approve - a human explicitly grants or denies it
3. Proof - a cryptographic receipt is generated, binding the user, action, timestamp, and nonce
4. Verify - any system can independently verify the receipt before execution

---

## Why it matters right now

The EU AI Act begins enforcement in August 2026. It requires accountability for automated decisions, human oversight of high-risk AI actions, and auditable records of AI behaviour.

AT1C gives you all three out of the box - as a lightweight SDK you can wrap around any existing system.

Targeted at: fintech, health, and legal sectors.

---

## Safety rules

- No implicit authority - nothing acts without explicit approval
- Context binding - approval is valid only for its exact action and resource
- Replay protection - every receipt is single-use
- Verification before execution - actions must be verified before they run

---

## Project structure

    at1c-protocol-official/
    docs/      # protocol spec + whitepaper
    packages/  # SDK
    examples/  # compliance demo, login demo, AI agent demo

---

## Documentation

Protocol Spec: https://github.com/alwayshuman/at1c-protocol-official/blob/main/docs/protocol.md

## Known Limitations & Roadmap

AT1C v1.0 is the protocol and SDK foundation. The following are known
gaps being addressed in upcoming releases:

- **Agent key custody — ✅ done (v1.1)** — the agent registrar
  (`register-agent.js`) now uses public-key-only registration: agents
  generate their own keypairs locally (`generate-agent-keys.js`) and the
  registry only ever receives and signs over the public key. Legacy
  agent records with server-stored private keys have been cleaned up.
  Agent registration is non-custodial, consistent with AT1C's
  user-controlled identity model.

- **End-user onboarding (planned)** — a passkey-based (WebAuthn/FIDO2)
  flow for non-technical users, so no keys are ever visible to or
  managed by the user. The signing key lives on the user's device,
  unlocked by Face ID / fingerprint — AT1C never holds it.

- **Receipt storage (planned, opt-in add-on)** — currently receipts are
  stored locally in `receipts.json`. Hosted, long-term (10-year) receipt
  storage with explicit opt-in consent is planned as an optional paid
  tier, framed as an evidence/insurance service rather than a
  requirement to use the protocol.

- **Agent Manifest (planned, future)** — a structured, signed document per
  agent describing intended use, prohibited uses, risk level, and human
  oversight requirements, distinct from the lightweight permissions list
  used by the current registrar. This would extend (not replace) the
  existing certificate model and map more directly onto EU AI Act Article
  13/14 documentation requirements. Lower priority than the custody and
  onboarding work above — revisit once those are stable.

These are documented here deliberately — AT1C's value depends on being
verifiable and trustworthy, and that includes being transparent about
what's solid today versus what's still being built.
---

## Licence

MIT - A.Human
