# AT1C Protocol
### Cryptographic Human Consent for AI Agent Actions

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/@at1c/sdk)](https://www.npmjs.com/package/@at1c/sdk)
[![Registry](https://img.shields.io/badge/registry-live-blue.svg)](https://registry.at1c.com/health)

**AT1C gives you a cryptographically signed, independently verifiable proof that a human approved a specific AI agent action — before that action executes.**

No approval, no valid action. No exceptions.

Built for developers. Required for EU AI Act compliance (enforcement: August 2026).

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

## Key Documents

- 📄 [Whitepaper](https://github.com/at1c-protocol/at1c-protocol-official/blob/main/docs/whitepaper.md) — EU AI Act compliance, sector analysis, Algorand x402 payment architecture
- 📜 [Manifesto](https://github.com/at1c-protocol/at1c-protocol-official/blob/main/docs/manifesto.md) — AT1C founding principles: sovereign identity, humans first
- 📚 [All docs](https://github.com/at1c-protocol/at1c-protocol-official/tree/main/docs) — protocol spec, receipts, verification, SDK reference

---

## Live Registry

```bash
curl https://registry.at1c.com/health
```

---

## How it works

1. **Request** — an AI agent asks permission to perform a specific action
2. **Approve** — a human explicitly grants or denies it
3. **Proof** — an Ed25519-signed receipt is generated, binding the user, action, timestamp, and nonce
4. **Verify** — any system independently verifies the receipt before execution — no trust required

Every receipt is single-use (nonce-based replay protection). Approval is scoped to the exact action requested — not transferable to any other action.

---

## AT1C vs. The Others

The agentic AI space has several overlapping projects. Here is where AT1C differs from the closest ones:

**vs. autonomous agent runtimes (Theseus, etc.)** — those systems remove humans from the loop by design. AT1C keeps a human in the loop by design. These are not competing approaches — they target different buyers. Autonomous runtimes suit DeFi/crypto use cases where fully autonomous execution is the goal. AT1C suits regulated sectors where human oversight is legally required.

**vs. data redaction gateways (TrustLayer, etc.)** — those systems control what data AI sees. AT1C controls what actions AI is permitted to take. A developer could use both without conflict.

**vs. payment authorization protocols (ATXP, etc.)** — those systems authorize agent payments. AT1C authorizes any agent action, with cryptographic proof of human approval, across any domain — not scoped to payments.

**The field is converging on a shared framing:** treat autonomous agents as instruments acting under a person's authority, with scoped, revocable, auditable chains of responsibility. AT1C implements this today, with a working SDK and live registry.

---

## Why it matters right now

The EU AI Act begins enforcement in **August 2026**. It requires:
- Accountability for automated decisions
- Human oversight of high-risk AI actions  
- Auditable records of AI behaviour

AT1C gives you all three out of the box. Primary target sectors: **fintech, health, legal.**

---

## Core Safety Rules

- **No implicit authority** — nothing acts without explicit approval
- **Context binding** — approval is valid only for its exact action and resource
- **Replay protection** — every receipt is single-use
- **Verification before execution** — actions must be verified before they run
- **Non-custodial** — AT1C never holds signing keys. Agent keys and user keys stay on their respective devices.

---

## Project structure

---

## Documentation

- 📄 Whitepaper: [AT1C_Protocol_Whitepaper_v1.4.docx](https://github.com/at1c-protocol/at1c-protocol-official/blob/main/docs/AT1C_Protocol_Whitepaper_v1.4.docx)
- 📜 Manifesto: [docs/manifesto.md](https://github.com/at1c-protocol/at1c-protocol-official/blob/main/docs/manifesto.md)
- 🔧 Protocol Spec: [docs/protocol.md](https://github.com/at1c-protocol/at1c-protocol-official/blob/main/docs/protocol.md)
- 📚 All docs: [docs/](https://github.com/at1c-protocol/at1c-protocol-official/tree/main/docs)
- npm package: [@at1c/sdk](https://www.npmjs.com/package/@at1c/sdk)
- Live registry: [registry.at1c.com](https://registry.at1c.com/health)

---

## Known Limitations & Roadmap

- **Agent key custody — ✅ done (v1.1)** — non-custodial by design. Agents generate their own keypairs locally; the registry only ever receives and signs over the public key.

- **Live registry — ✅ done (v1.2)** — authenticated agent verification live at `registry.at1c.com` over HTTPS. Registry private key held in environment variables only, never on the filesystem.

- **Open web registration — ✅ done (v1.3)** — any user can register a personal or entity-owned agent via `at1c.com/users/register-agent.php`. No CLI required for registration.

- **Browser-side keypair generation — ✅ done (v1.4)** — Ed25519 keypair generated in the browser using the Web Crypto API. Private key downloads automatically, never touches the server. Permissions selected via checkboxes. No terminal required — accessible to non-technical users.

- **End-user passkey onboarding (planned v1.5)** — WebAuthn/FIDO2 flow so the signing key lives on the user's device, unlocked by Face ID or fingerprint. AT1C never holds it.

- **Hosted receipt storage (planned v1.6)** — currently receipts are stored locally. Long-term hosted storage planned as an optional paid tier — evidence/insurance retention, not a protocol requirement.

- **Tiered autonomy (planned v2.0)** — low/medium/high trust tiers with alarm thresholds for fleet management. Maps directly onto EU AI Act risk classifications.

- **Algorand x402 payment integration (planned v2.1)** — sub-$0.0002 micro-transaction fees, USDC settlement, card onramp. Target payment rail for agent-scale commerce.


- **Quantum resistance (future)** — AT1C currently uses Ed25519, which is not post-quantum secure. Migration to a NIST-approved post-quantum signature scheme is on the long-term roadmap. Not urgent for August 2026 compliance, but noted transparently.

- **Agent Manifest (future)** — structured, signed per-agent document mapping onto EU AI Act Article 13/14 documentation requirements.

These are documented deliberately — AT1C's value depends on being trustworthy, and that includes being transparent about what is solid today versus what is still being built.

---

## Licence

MIT — [AT1C Protocol Contributors](LICENSE)
