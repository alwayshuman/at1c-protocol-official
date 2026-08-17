# AT1C Protocol — Whitepaper v1.6

**Cryptographic Human Consent for AI Agent Actions**

*July 2026 · at1c.com · registry.at1c.com · github.com/at1c-protocol*

---

## Executive Summary

AI agents are taking consequential actions on behalf of humans and organisations sending payments, filing documents, scheduling appointments, managing data with no verifiable record that a human actually authorised those actions. The EU AI Act, which enters enforcement in August 2026, requires exactly that record: accountability for automated decisions, human oversight of high-risk AI actions, and auditable logs of AI behaviour.

AT1C (Agent Trust & Consent Control) is an open protocol that solves this problem with a single, cryptographically verifiable primitive: a signed receipt that proves a specific human approved a specific AI agent action before it executed. AT1C works for individual users protecting their personal AI assistants, and for organisations managing fleets of agents operating across business processes.

**AT1C is:**
- Free and open source MIT licensed, no vendor lock-in
- Deployable in a day a lightweight SDK wrapping any existing system
- Non-custodial AT1C never holds signing keys; they stay on the agent's or user's device
- Designed for both personal and entity use individual AI assistants and enterprise agent fleets
- Live today registry.at1c.com is operational and accepting agent registrations

> Large enterprises spend €400,000–€2,000,000 per year on EU AI Act compliance infrastructure. AT1C gives SMEs and individuals in fintech, healthcare, and legal the same verifiable accountability at a fraction of the cost.

---

## Foundational Principles: Two Independent Convergences

AT1C was not built in a vacuum. Two independent bodies of principled thought one from internet protocol design, one from legal scholarship have arrived at the same conclusion that AT1C implements.

### RFC 8890: The Internet is for End Users

In 2020, the Internet Architecture Board (IAB) published RFC 8890, authored by Mark Nottingham, Chair of the IETF HTTP Working Group. The RFC establishes a formal principle: that internet protocol design decisions should favour end users over all other stakeholders when conflicts arise, and that "all decisions have the possibility of bias; of advantaging or disadvantaging different parties."

RFC 8890 explicitly states that the IETF should design protocols for the pessimal environment the worst-case scenario where platforms and networks cannot be trusted to act in users' interests.

AT1C applies this principle directly to AI agent consent. The protocol is designed for the pessimal environment: a world where platforms cannot be trusted to hold your signing keys, maintain your consent records honestly, or enforce your approval boundaries without cryptographic proof. Non-custodial design, signed receipts, and independent verification are not conveniences they are the architecture that RFC 8890's philosophy demands.

### Ayres & Balkin: The Legal Accountability Gap

In 2026, Yale Law School professors Ian Ayres and Jack Balkin, writing in the University of Chicago Law Review, identified the defining legal gap of the AI era: AI agents lack *mens rea* intention which means most existing liability frameworks do not cleanly apply to AI actions. Their solution: apply objective standards, holding the humans and companies deploying AI to standards of reasonable care.

The critical implication: for objective liability to work, there must be evidence of what the human principal approved. Without a verifiable consent record, accountability collapses.

AT1C's signed receipt is exactly that evidence. It transforms the legal question from "did the principal exercise reasonable care?" hard to prove, subjective to "is there a signed receipt for this action?" verifiable, objective, independently auditable.

**AT1C is not only an EU AI Act compliance tool. It is the evidentiary infrastructure that makes AI accountability law enforceable.**

---

## The Problem: Unaccountable AI Agents

Modern AI systems act silently. An agent executes a payment, files a form, or sends a communication and there is no cryptographic record that a human approved that specific action at that specific moment.

This is not merely a technical gap. It is the gap the EU AI Act was written to close. As the number of deployed AI agents grows toward billions — and eventually toward the "trillions of agents" scale researchers project for European SMEs alone the accountability gap compounds. Without a standard consent protocol, every agent is an unverified actor, and every action it takes is a potential compliance exposure.

---

## The Three Sectors Most at Risk

### Fintech

AI agents in financial services execute trades, initiate payments, and manage portfolios on behalf of users. Under the EU AI Act, MiFID II, and PSD2, firms must demonstrate human oversight of automated decisions.

**Cost of non-compliance:** Fines up to €30M or 6% of global annual turnover (EU AI Act). MiFID II penalties up to €5M per breach.

**AT1C solution:** Every agent-initiated transaction carries a signed receipt proving the account holder approved that specific action — independently verifiable, no reliance on the firm's own logs.

### Healthcare

AI agents scheduling appointments, triaging patients, recommending treatments, and accessing medical records. The EU AI Act classifies health AI as high-risk, requiring the strictest oversight and auditable records.

**Cost of non-compliance:** GDPR fines up to €20M or 4% of global turnover, plus EU AI Act penalties.

**AT1C solution:** Every AI-initiated action on patient data requires a verifiable human approval receipt — simultaneously the GDPR consent record and the EU AI Act oversight audit trail.

### Legal

AI agents drafting documents, conducting due diligence, filing submissions, and communicating with counterparties. Solicitor conduct rules require informed client consent for actions taken on their behalf.

**Cost of non-compliance:** SRA disciplinary action, professional indemnity claims, and EU AI Act penalties.

**AT1C solution:** Client consent to specific AI-initiated actions captured as a cryptographic receipt, timestamped and independently verifiable.

---

## How It Works

```
request → approve → proof → verify
```

**Step 1 — Request:** An AI agent asks permission to perform a specific, scoped action. Nothing executes at this stage.

**Step 2 — Approve:** A human explicitly grants or denies the request. Approval is specific to the action named — it cannot be transferred to any other action. This is the human-in-the-loop moment the EU AI Act requires.

**Step 3 — Proof:** A signed receipt is generated, cryptographically binding the approving user's identity, the exact action, the agent's registered public key, a timestamp, and a single-use nonce. The receipt is signed with the user's Ed25519 private key — which never leaves their device.

**Step 4 — Verify:** Any system — the agent, a counterparty, a regulator, or an auditor independently verifies the receipt before the action executes. No trust in AT1C required; the mathematics is the guarantee.

---

## Personal and Entity Use Cases

### Personal AI Agent Coverage

Any individual using an AI assistant to act on their behalf benefits from AT1C. A personal account gives the individual a verifiable record of every action their AI assistant has taken independently auditable at any time. Registration takes one day. The private key stays on the individual's device. No fee for the free tier.

### Entity-Owned Agent Fleets

Organisations deploying multiple AI agents face the challenge of maintaining oversight without creating an approval bottleneck. AT1C addresses this through granular permission scopes and tiered autonomy.

### Tiered Autonomy: Low, Medium, High Trust

- **Low trust** explicit human approval for every action; appropriate for high-value or sensitive actions
- **Medium trust** autonomous within pre-approved boundaries; alerts on boundary approach
- **High trust** operates within a scoped permission envelope; oversight via audit log and alarm

This maps directly onto the EU AI Act's risk classification framework.

*Note: Tiered autonomy is a planned feature for AT1C v2.0.*

---

## Cryptographic Guarantees

**Confirmed guarantees:**
- A valid receipt proves the holder of the private key signed the exact action payload — no one else could have produced that signature
- Nonces are unique and single-use replay attacks are prevented by construction
- Agent certificates are signed by the AT1C registry root key agent identity is independently verifiable
- Ed25519 (RFC 8032) IETF-standardised elliptic curve signature scheme, strong security record

**The layered security model:**
AT1C is one layer in a defence-in-depth stack. The receipt proves a specific key signed a specific approval. The question of who holds that key is answered by your authentication layer (passkey, biometric, 2FA). Combined, these two layers deliver identity assurance and action accountability the same separation of concerns that governs every major payment network and PKI system in production today.

**Known limitations:**
- Ed25519 is not post-quantum secure — migration to a NIST-approved post-quantum scheme is on the long-term roadmap
- Receipt storage is currently local — hosted long-term storage is a planned paid tier
- Tiered autonomy is planned — current protocol supports scoped permissions per agent
- A valid receipt proves a specific action scope was approved at a specific time — it does not prove the agent acted within that scope, what the agent observed before acting, or what it actually executed post-approval. Post-execution outcome verification is a planned future layer
- AT1C assumes the key holder is the consenting principal. This assumption does not hold under coercion, cognitive incapacity, or caregiving delegation — circumstances adjudicated by courts, not protocols. This limitation is shared by all cryptographic consent systems
- Per-action approval does not bound aggregate behaviour. Ten individually approved actions can combine to exceed what a reasonable principal would have consented to in aggregate. Fleet-level cumulative limits are planned for v2.0

---

## EU AI Act Compliance Mapping

| Article | Requirement | AT1C Response |
|---------|-------------|---------------|
| Art. 9 | Risk management | Approval checkpoint at every action; tiered trust maps risk to oversight intensity |
| Art. 13 | Transparency | Request names action and resource explicitly before approval is sought |
| Art. 14 | Human oversight | No action executes without verified human approval architecturally required |
| Art. 17 | Quality management | Every receipt is a timestamped, tamper-evident audit record |
| Art. 26 | Deployer obligations | Receipt log satisfies logging requirements without custom infrastructure |

---

## Cost Comparison

| Approach | Annual Cost | Time to Deploy |
|----------|-------------|----------------|
| Enterprise compliance programme | €400,000 – €2,000,000 | 6 – 18 months |
| Legal/compliance consultancy | €50,000 – €200,000 | 3 – 6 months |
| **AT1C Protocol (free tier)** | **€0 (open source)** | **1 day** |

*Cost estimates based on TRENDS Group research on EU AI Act compliance costs for European SMEs (2026). AT1C addresses human oversight and audit trail requirements it does not replace legal advice or a full compliance programme.*

---

## Payment Architecture: AT1C and Algorand x402

### Why Not Stripe

Stripe charges a flat $0.30 per transaction viable for infrequent high-value payments, but structurally incompatible with agent-scale micro-transactions. At millions of agent registrations and per-action consent events, a $0.30 floor eliminates the unit economics entirely.

### Algorand x402 — The Target Payment Layer

x402 is an HTTP-native payment protocol enabling machines to pay for resources directly within a request-response cycle. Algorand is the settlement layer of choice for three reasons:

- **Sub-$0.0002 transaction fees** over 1,500× cheaper than Stripe at agent scale
- **Sub-2-second deterministic finality** x402 payments complete inside a live HTTP request
- **Stablecoin settlement in your currency** Algorand natively supports both USDC (US dollar) and EURC (euro), both issued by Circle. EU users settle in euros with no FX conversion required pricing and settlement stay in the same currency. Card onramps mean users never need to think about crypto.

### How AT1C and x402 Complement Each Other

- **AT1C** = consent and accountability layer — proves a human approved the action
- **x402 on Algorand** = payment settlement layer settles the micro-transaction in USDC or EURC depending on the user's region

Together they deliver the complete compliance and settlement stack for agentic commerce, with no FX friction for EU operators.

*Note: Algorand x402 integration is planned for AT1C v2.1. Near-term paid tier uses standard card payment.*

---

## Getting Started in One Day

**Step 1 — Create your account (5 minutes)**
Register free at **at1c.com**. No credit card required.

**Step 2 — Install the SDK (2 minutes)**
```bash
npm install @at1c/sdk
```

**Step 3 — Register your agent (5 minutes)**
Visit **at1c.com/users/register-agent.php**. Your browser generates the Ed25519 keypair — the private key downloads to your device and never leaves it. Select permissions via checkboxes. The registry signs a certificate over your public key.

**Step 4 — Integrate receipts into your action flow**
- Agent generates a request for the specific action
- Human approves via your existing UI
- SDK generates the signed receipt in milliseconds
- Receipt is verified before action executes
- Action executes — the receipt is your audit trail

Full documentation: **github.com/at1c-protocol/at1c-protocol-official**

---

## Roadmap

| Version | Status | Description |
|---------|--------|-------------|
| v1.1 | ✅ Done | Non-custodial agent key registration |
| v1.2 | ✅ Done | Live registry API at registry.at1c.com |
| v1.3 | ✅ Done | Open web registration — personal and entity agents |
| v1.4 | ✅ Done | Browser-side keypair generation — no terminal required |
| v1.5 | Planned | End-user passkey (WebAuthn/FIDO2) onboarding |
| v1.6 | Planned | Hosted receipt storage — 10-year retention paid tier |
| v2.0 | Planned | Tiered autonomy with alarm thresholds for fleet management |
| v2.1 | Planned | Algorand x402 payment integration — USDC and EURC settlement |
| Future | Roadmap | Agent Manifest per EU AI Act Art 13/14, post-quantum signatures |

---

## References

- RFC 8890 — *The Internet is for End Users*. Nottingham, M. Internet Architecture Board, 2020. https://www.rfc-editor.org/info/rfc8890/
- *The Law of AI is the Law of Risky Agents Without Intentions*. Ayres, I. & Balkin, J. University of Chicago Law Review, 2026.
- *How Big Tech's Monopoly of AI Threatens Fair Competition*. TRENDS Group Research, 2026.

---

## Contact & Further Information

- **Website:** at1c.com
- **Live registry:** registry.at1c.com
- **GitHub:** github.com/at1c-protocol/at1c-protocol-official
- **npm:** npmjs.com/package/@at1c/sdk
- **SME compliance guide:** at1c.com/compliance.html
- **Register your agent:** at1c.com/users/register-agent.php

---

*© 2026 AT1C Protocol Contributors · MIT Licence · Version 1.6*
