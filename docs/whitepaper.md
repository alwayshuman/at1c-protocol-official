# AT1C Protocol — Whitepaper v1.4

**Cryptographic Human Consent for AI Agent Actions**

*July 2026 · at1c.com · registry.at1c.com · github.com/at1c-protocol*

---

## Executive Summary

AI agents are taking consequential actions on behalf of humans and organisations — sending payments, filing documents, scheduling appointments, managing data — with no verifiable record that a human actually authorised those actions. The EU AI Act, which enters enforcement in August 2026, requires exactly that record: accountability for automated decisions, human oversight of high-risk AI actions, and auditable logs of AI behaviour.

AT1C (Agent Trust & Consent Control) is an open protocol that solves this problem with a single, cryptographically verifiable primitive: a signed receipt that proves a specific human approved a specific AI agent action before it executed. AT1C works for individual users protecting their personal AI assistants, and for organisations managing fleets of agents operating across business processes.

**AT1C is:**
- Free and open source — MIT licensed, no vendor lock-in
- Deployable in a day — a lightweight SDK wrapping any existing system
- Non-custodial — AT1C never holds signing keys; they stay on the agent's or user's device
- Designed for both personal and entity use — individual AI assistants and enterprise agent fleets
- Live today — registry.at1c.com is operational and accepting agent registrations

> Large enterprises spend €400,000–€2,000,000 per year on EU AI Act compliance infrastructure. AT1C gives SMEs and individuals in fintech, healthcare, and legal the same verifiable accountability at a fraction of the cost.

---

## The Problem: Unaccountable AI Agents

Modern AI systems act silently. An agent executes a payment, files a form, or sends a communication — and there is no cryptographic record that a human approved that specific action at that specific moment.

This is not merely a technical gap. It is the gap the EU AI Act was written to close. The regulation recognises that as AI agents accumulate standing privilege and act autonomously, the question of accountability becomes critical: who approved what, when, with what scope, and can that approval be independently verified?

The answer today, for most systems, is: **no one can verify it, because the proof was never created.**

As the number of deployed AI agents grows toward billions — and eventually toward the "trillions of agents" scale researchers project for European SMEs alone — the accountability gap compounds. Without a standard consent protocol, every agent is an unverified actor, and every action it takes is a potential compliance exposure.

---

## The Three Sectors Most at Risk

### Fintech

AI agents in financial services execute trades, initiate payments, manage portfolios, and interact with brokers on behalf of users. Under the EU AI Act and existing financial regulation (MiFID II, PSD2), firms must demonstrate human oversight of automated decisions.

**Cost of non-compliance:** Fines up to €30M or 6% of global annual turnover under EU AI Act. MiFID II penalties up to €5M per breach.

**AT1C solution:** Every agent-initiated transaction carries a signed receipt proving the account holder approved that specific action. Auditors verify independently, with no reliance on the firm's own logs.

### Healthcare

AI agents in healthcare are scheduling appointments, triaging patient queries, recommending treatments, and accessing medical records. The EU AI Act classifies health AI as high-risk, requiring the strictest oversight.

**Cost of non-compliance:** GDPR fines up to €20M or 4% of global turnover, plus EU AI Act penalties.

**AT1C solution:** Every AI-initiated action on patient data requires a verifiable human approval receipt — simultaneously the consent record required by GDPR and the oversight audit trail required by the EU AI Act.

### Legal

AI agents in legal practice are drafting documents, conducting due diligence, filing submissions, and communicating with counterparties. Solicitor conduct rules require informed client consent for actions taken on their behalf.

**Cost of non-compliance:** SRA disciplinary action, professional indemnity claims, and EU AI Act penalties.

**AT1C solution:** Client consent to specific AI-initiated actions is captured as a cryptographic receipt, timestamped and independently verifiable — the informed consent record the profession requires.

---

## How It Works

```
request → approve → proof → verify
```

**Step 1 — Request:** An AI agent asks permission to perform a specific, scoped action. Nothing executes at this stage.

**Step 2 — Approve:** A human explicitly grants or denies the request. Approval is specific to the action named — it cannot be transferred to any other action. This is the human-in-the-loop moment the EU AI Act requires.

**Step 3 — Proof:** A signed receipt is generated, cryptographically binding the approving user's identity, the exact action, the agent's registered public key, a timestamp, and a single-use nonce. The receipt is signed with the user's Ed25519 private key — which never leaves their device.

**Step 4 — Verify:** Any system — the agent, a counterparty, a regulator, or an auditor — independently verifies the receipt before the action executes. No trust in AT1C required; the mathematics is the guarantee.

---

## Personal and Entity Use Cases

### Personal AI Agent Coverage

Any individual using an AI assistant to act on their behalf benefits from AT1C. A personal account gives the individual a verifiable record of every action their AI assistant has taken — independently auditable at any time. Registration takes one day. The private key stays on the individual's device. No fee for the free tier.

### Entity-Owned Agent Fleets

Organisations deploying multiple AI agents face the challenge of maintaining oversight without creating an approval bottleneck. AT1C addresses this through granular permission scopes and tiered autonomy.

### Tiered Autonomy: Low, Medium, High Trust

- **Low trust** — explicit human approval for every action; appropriate for high-value or sensitive actions
- **Medium trust** — autonomous within pre-approved boundaries; alerts on boundary approach
- **High trust** — operates within a scoped permission envelope; oversight via audit log and alarm

This maps directly onto the EU AI Act's risk classification framework.

*Note: Tiered autonomy is a planned feature for AT1C v2.0.*

---

## Cryptographic Guarantees

**Confirmed guarantees:**
- A valid receipt proves the holder of the private key signed the exact action payload — no one else could have produced that signature
- Nonces are unique and single-use — replay attacks are prevented by construction
- Agent certificates are signed by the AT1C registry root key — agent identity is independently verifiable

**The layered security model:**
AT1C is one layer in a defence-in-depth stack. The receipt proves a specific key signed a specific approval. The question of who holds that key is answered by your authentication layer (passkey, biometric, 2FA). Combined, these two layers deliver identity assurance and action accountability — the same separation of concerns that governs every major payment network and PKI system in production today.

**Known limitations:**
- Ed25519 is not post-quantum secure — migration to a NIST-approved post-quantum scheme is on the long-term roadmap
- Receipt storage is currently local — hosted long-term storage is a planned paid tier
- Tiered autonomy is planned — current protocol supports scoped permissions per agent

---

## EU AI Act Compliance Mapping

| Article | Requirement | AT1C Response |
|---------|-------------|---------------|
| Art. 9 | Risk management | Approval checkpoint at every action; tiered trust maps risk to oversight |
| Art. 13 | Transparency | Request names action and resource explicitly before approval |
| Art. 14 | Human oversight | No action executes without verified human approval — architecturally required |
| Art. 17 | Quality management | Every receipt is a timestamped, tamper-evident audit record |
| Art. 26 | Deployer obligations | Receipt log satisfies logging requirements without custom infrastructure |

---

## Cost Comparison

| Approach | Annual Cost | Time to Deploy |
|----------|-------------|----------------|
| Enterprise compliance programme | €400,000 – €2,000,000 | 6 – 18 months |
| Legal/compliance consultancy | €50,000 – €200,000 | 3 – 6 months |
| **AT1C Protocol (free tier)** | **€0 (open source)** | **1 day** |

*Cost estimates based on TRENDS Group research on EU AI Act compliance costs for European SMEs (2026). AT1C addresses human oversight and audit trail requirements — it does not replace legal advice or a full compliance programme.*

---

## Payment Architecture: AT1C and Algorand x402

### Why Not Stripe

Stripe charges a flat $0.30 per transaction — viable for infrequent high-value payments, but structurally incompatible with agent-scale micro-transactions. At millions of agent registrations and per-action consent fees, a $0.30 floor eliminates the unit economics entirely.

### Algorand x402 — The Target Payment Layer

x402 is an HTTP-native payment protocol enabling machines to pay for resources directly within a request-response cycle. Algorand is the settlement layer of choice for three reasons:

- **Sub-$0.0002 transaction fees** — over 1,500× cheaper than Stripe at agent scale
- **Sub-2-second deterministic finality** — x402 payments complete inside a live HTTP request
- **Native atomic transactions** — payment, authorisation check, and consent logging in a single atomic operation

Algorand x402 uses USDC as a native stablecoin. Standard card-to-USDC onramps mean users never need to think about crypto.

### How AT1C and x402 Complement Each Other

- **AT1C** = consent and accountability layer — proves a human approved the action
- **x402 on Algorand** = payment settlement layer — settles the micro-payment for that action

*Note: Algorand x402 integration is planned for AT1C v2.1. Near-term paid tier uses standard card payment.*

---

## Getting Started in One Day

**Step 1 — Create your account (5 minutes)**
Register free at **at1c.com**. No credit card required.

**Step 2 — Install the SDK (2 minutes)**
```bash
npm install @at1c/sdk
```

**Step 3 — Generate your agent keypair (2 minutes)**
```bash
node generate-agent-keys.js --out my-agent-keys.json
```
Private key never leaves your machine.

**Step 4 — Register your agent (5 minutes)**
Register at **at1c.com/users/register-agent.php** — set agent name, permissions, and trust tier.

**Step 5 — Integrate receipts into your action flow**
- Agent generates a request for the specific action
- Human approves via your existing UI
- SDK generates the signed receipt in milliseconds
- Receipt is verified before action executes
- Action executes — the receipt is your audit trail

---

## Roadmap

| Version | Status | Description |
|---------|--------|-------------|
| v1.1 | ✅ Done | Non-custodial agent key registration |
| v1.2 | ✅ Done | Live registry API at registry.at1c.com |
| v1.3 | ✅ Done | Open web registration — personal and entity agents |
| v1.4 | Planned | Browser-side keypair generation — no terminal required |
| v1.5 | Planned | End-user passkey (WebAuthn/FIDO2) onboarding |
| v1.6 | Planned | Hosted receipt storage — 10-year retention paid tier |
| v2.0 | Planned | Tiered autonomy with alarm thresholds for fleet management |
| v2.1 | Planned | Algorand x402 payment integration |
| Future | Roadmap | Agent Manifest, post-quantum signatures |

---

## Contact & Further Information

- **Website:** at1c.com
- **Live registry:** registry.at1c.com
- **GitHub:** github.com/at1c-protocol/at1c-protocol-official
- **npm:** npmjs.com/package/@at1c/sdk
- **SME compliance guide:** at1c.com/compliance.html
- **Register your agent:** at1c.com/users/register-agent.php

---

*© 2026 AT1C Protocol Contributors · MIT Licence · Version 1.4*
